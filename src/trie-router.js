import {ServerResponse} from 'http';
import {IncomingMessage} from 'http';
import {HookType} from './hooks/index.js';
import {isPromise} from './utils/index.js';
import {HookInvoker} from './hooks/index.js';
import {DataSender} from './senders/index.js';
import {HookRegistry} from './hooks/index.js';
import {ErrorSender} from './senders/index.js';
import {isResponseSent} from './utils/index.js';
import {RequestParser} from './parsers/index.js';
import {RouteRegistry} from './route-registry.js';
import {RequestContext} from './request-context.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {DebuggableService} from './debuggable-service.js';

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
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   * @returns {Promise<undefined>}
   * @private
   */
  async _handleRequest(req, res) {
    const debug = this.getDebuggerFor(this._handleRequest);
    const requestPath = (req.url || '/').replace(/\?.*$/, '');
    debug(
      'Preparing to handle an incoming request %s %v.',
      req.method,
      requestPath,
    );
    const resolved = this.getService(RouteRegistry).matchRouteByRequest(req);
    if (!resolved) {
      debug('No route for the request %s %v.', req.method, requestPath);
      this.getService(ErrorSender).send404(req, res);
    } else {
      const {route, params} = resolved;
      // создание дочернего сервис-контейнера для передачи
      // в контекст запроса, что бы родительский контекст
      // нельзя было модифицировать
      const container = new ServiceContainer(this.container);
      const context = new RequestContext(container, req, res);
      // регистрация контекста запроса в сервис-контейнере
      // для доступа через container.getRegistered(RequestContext)
      container.set(RequestContext, context);
      // регистрация текущего экземпляра IncomingMessage
      // и ServerResponse в сервис-контейнере запроса
      container.set(IncomingMessage, req);
      container.set(ServerResponse, res);
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
        const reqDataOrPromise = this.getService(RequestParser).parse(req);
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
          HookType.PRE_HANDLER,
          res,
          context,
        );
        if (isPromise(data)) data = await data;
        // если ответ не бы отправлен внутри "preHandler" хуков,
        // и сами "preHandler" хуки не вернули значения, то вызывается
        // основной обработчик маршрута, результат которого передается
        // в хуки "postHandler"
        if (!isResponseSent(res) && data == null) {
          data = route.handle(context);
          if (isPromise(data)) data = await data;
          // вызываются хуки "postHandler", результат которых
          // также может быть использован в качестве ответа
          let postHandlerData = hookInvoker.invokeAndContinueUntilValueReceived(
            route,
            HookType.POST_HANDLER,
            res,
            context,
            data,
          );
          if (isPromise(postHandlerData))
            postHandlerData = await postHandlerData;
          if (postHandlerData != null) data = postHandlerData;
        }
      } catch (error) {
        this.getService(ErrorSender).send(req, res, error);
        return;
      }
      // если ответ не был отправлен во время выполнения
      // хуков и основного обработчика запроса,
      // то результат передается в DataSender
      if (!isResponseSent(res)) {
        this.getService(DataSender).send(res, data);
      }
    }
  }

  /**
   * Add hook.
   *
   * Example:
   * ```
   * import {TrieRouter} from '@e22m4u/js-trie-router';
   * import {HookType} from '@e22m4u/js-trie-router';
   *
   * // Router instance.
   * const router = new TrieRouter();
   *
   * // Adds the "preHandler" hook for each route.
   * router.addHook(
   *   HookType.PRE_HANDLER,
   *   ctx => { ... },
   * );
   *
   * // Adds the "postHandler" hook for each route.
   * router.addHook(
   *   HookType.POST_HANDLER,
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
}
