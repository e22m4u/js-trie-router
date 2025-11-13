import {RequestParser} from './parsers/index.js';
import {RouteRegistry} from './route-registry.js';
import {RequestContext} from './request-context.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {ServerResponse, IncomingMessage} from 'http';
import {DebuggableService} from './debuggable-service.js';
import {DataSender, ErrorSender} from './senders/index.js';
import {cloneDeep, isPromise, isResponseSent} from './utils/index.js';
import {HookInvoker, HookRegistry, RouterHookType} from './hooks/index.js';

/**
 * Trie router.
 */
export class TrieRouter extends DebuggableService {
  /**
   * Define route.
   *
   * Example 1:
   * ```
   * const router = new TrieRouter();
   * router.defineRoute({
   *   method: HttpMethod.GET,        // Request method.
   *   path: '/',                      // Path template.
   *   handler: ctx => 'Hello world!', // Request handler.
   * });
   * ```
   *
   * Example 2:
   * ```
   * const router = new TrieRouter();
   * router.defineRoute({
   *   method: HttpMethod.POST,        // Request method.
   *   path: '/users/:id',             // The path template may have parameters.
   *   preHandler(ctx) { ... },        // The "preHandler" executes before a route handler.
   *   handler(ctx) { ... },           // Request handler function.
   *   postHandler(ctx, data) { ... }, // The "postHandler" executes after a route handler.
   * });
   * ```
   *
   * @param {import('./route-registry.js').RouteDefinition} routeDef
   * @returns {import('./route.js').Route}
   */
  defineRoute(routeDef) {
    return this.getService(RouteRegistry).defineRoute(routeDef);
  }

  /**
   * Request listener.
   *
   * Example:
   * ```
   * import http from 'http';
   * import {TrieRouter} from '@e22m4u/js-trie-router';
   *
   * const router = new TrieRouter();
   * const server = new http.Server();
   * server.on('request', router.requestListener); // Sets the request listener.
   * server.listen(3000);                          // Starts listening for connections.
   * ```
   *
   * @returns {Function}
   */
  get requestListener() {
    return this._handleRequest.bind(this);
  }

  /**
   * Handle incoming request.
   *
   * @param {import('http').IncomingMessage} request
   * @param {import('http').ServerResponse} response
   * @returns {Promise<undefined>}
   * @private
   */
  async _handleRequest(request, response) {
    const debug = this.getDebuggerFor(this._handleRequest);
    const requestPath = (request.url || '/').replace(/\?.*$/, '');
    debug(
      'Preparing to handle an incoming request %s %v.',
      request.method,
      requestPath,
    );
    const resolved =
      this.getService(RouteRegistry).matchRouteByRequest(request);
    if (!resolved) {
      debug('No route for the request %s %v.', request.method, requestPath);
      this.getService(ErrorSender).send404(request, response);
    } else {
      const {route, params} = resolved;
      // создание дочернего сервис-контейнера для передачи
      // в контекст запроса, что бы родительский контекст
      // нельзя было модифицировать
      const container = new ServiceContainer(this.container);
      const context = new RequestContext(container, request, response);
      // чтобы метаданные маршрута были доступны в хуках,
      // их копия устанавливается в контекст запроса
      if (route.meta != null) {
        context.meta = cloneDeep(route.meta);
      }
      // регистрация контекста запроса в сервис-контейнере
      // для доступа через container.getRegistered(RequestContext)
      container.set(RequestContext, context);
      // регистрация текущего экземпляра IncomingMessage
      // и ServerResponse в сервис-контейнере запроса
      container.set(IncomingMessage, request);
      container.set(ServerResponse, response);
      // запись параметров пути в контекст запроса,
      // так как они были определены в момент
      // поиска подходящего роута
      context.params = params;
      // при разборе входящих данных и выполнении обработчиков
      // запроса, требуется перехватывать возможные ошибки
      // для корректной отправки сервисом ErrorSender
      let data;
      try {
        // разбор тела, заголовков и других данных запроса
        // выполняется отдельным сервисом, после чего результат
        // записывается в контекст передаваемый обработчику
        const reqDataOrPromise = this.getService(RequestParser).parse(request);
        // результат разбора может являться асинхронным, и вместо
        // того, что бы разрывать поток выполнения, стоит проверить,
        // действительно ли необходимо использование оператора "await"
        if (isPromise(reqDataOrPromise)) {
          const reqData = await reqDataOrPromise;
          Object.assign(context, reqData);
        } else {
          Object.assign(context, reqDataOrPromise);
        }
        // получение данных от обработчика, который находится
        // в найденном маршруте, и отправка результата в качестве
        // ответа сервера
        const hookInvoker = this.getService(HookInvoker);
        // если результатом вызова хуков "preHandler" является
        // значение (или Promise) отличное от "undefined" и "null",
        // то такое значение используется в качестве ответа
        data = hookInvoker.invokeAndContinueUntilValueReceived(
          route,
          RouterHookType.PRE_HANDLER,
          response,
          context,
        );
        if (isPromise(data)) data = await data;
        // если ответ не бы отправлен внутри "preHandler" хуков,
        // и сами "preHandler" хуки не вернули значения, то вызывается
        // основной обработчик маршрута, результат которого передается
        // в хуки "postHandler"
        if (!isResponseSent(response) && data == null) {
          data = route.handle(context);
          if (isPromise(data)) data = await data;
          // вызываются хуки "postHandler", результат которых
          // также может быть использован в качестве ответа
          let postHandlerData = hookInvoker.invokeAndContinueUntilValueReceived(
            route,
            RouterHookType.POST_HANDLER,
            response,
            context,
            data,
          );
          if (isPromise(postHandlerData))
            postHandlerData = await postHandlerData;
          if (postHandlerData != null) data = postHandlerData;
        }
      } catch (error) {
        this.getService(ErrorSender).send(request, response, error);
        return;
      }
      // если ответ не был отправлен во время выполнения
      // хуков и основного обработчика запроса,
      // то результат передается в DataSender
      if (!isResponseSent(response)) {
        this.getService(DataSender).send(response, data);
      }
    }
  }

  /**
   * Add hook.
   *
   * Example:
   * ```
   * import {TrieRouter} from '@e22m4u/js-trie-router';
   * import {RouterHookType} from '@e22m4u/js-trie-router';
   *
   * // Router instance.
   * const router = new TrieRouter();
   *
   * // Adds the "preHandler" hook for each route.
   * router.addHook(
   *   RouterHookType.PRE_HANDLER,
   *   ctx => { ... },
   * );
   *
   * // Adds the "postHandler" hook for each route.
   * router.addHook(
   *   RouterHookType.POST_HANDLER,
   *   ctx => { ... },
   * );
   * ```
   *
   * @param {string} type
   * @param {Function} hook
   * @returns {this}
   */
  addHook(type, hook) {
    this.getService(HookRegistry).addHook(type, hook);
    return this;
  }

  /**
   * Add pre-handler hook.
   *
   * @param {Function} hook
   * @returns {this}
   */
  addPreHandler(hook) {
    this.getService(HookRegistry).addHook(RouterHookType.PRE_HANDLER, hook);
    return this;
  }

  /**
   * Add post-handler hook.
   *
   * @param {Function} hook
   * @returns {this}
   */
  addPostHandler(hook) {
    this.getService(HookRegistry).addHook(RouterHookType.POST_HANDLER, hook);
    return this;
  }
}
