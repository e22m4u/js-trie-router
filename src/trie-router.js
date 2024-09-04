import {Service} from './service.js';
import {isPromise} from './utils/index.js';
import {HOOK_NAME} from './hooks/index.js';
import {HookInvoker} from './hooks/index.js';
import {DataSender} from './senders/index.js';
import {HookRegistry} from './hooks/index.js';
import {ErrorSender} from './senders/index.js';
import {RequestParser} from './parsers/index.js';
import {RouteRegistry} from './route-registry.js';
import {RequestContext} from './request-context.js';
import {ServiceContainer} from '@e22m4u/js-service';

/**
 * Trie router.
 */
export class TrieRouter extends Service {
  /**
   * Define route.
   *
   * Example 1:
   * ```
   * const router = new TrieRouter();
   * router.defineRoute({
   *   method: HTTP_METHOD.GET,        // Request method.
   *   path: '/',                      // Path template.
   *   handler: ctx => 'Hello world!', // Request handler.
   * });
   * ```
   *
   * Example 2:
   * ```
   * const router = new TrieRouter();
   * router.defineRoute({
   *   method: HTTP_METHOD.POST,       // Request method.
   *   path: '/users/:id',             // The path template may have parameters.
   *   preHandler(ctx) { ... },        // The "preHandler" is executed before a route handler.
   *   handler(ctx) { ... },           // Request handler function.
   *   postHandler(ctx, data) { ... }, // The "postHandler" is executed after a route handler.
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
   * Request handler.
   *
   * Example:
   * ```
   * import http from 'http';
   * import {TrieRouter} from '@e22m4u/js-trie-router';
   *
   * const router = new TrieRouter();
   * const server = new http.Server();
   * server.on('request', router.requestHandler); // Sets the request handler.
   * server.listen(3000);                         // Starts listening for connections.
   * ```
   *
   * @returns {Function}
   */
  get requestHandler() {
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
    const requestPath = (req.url || '/').replace(/\?.*$/, '');
    this.debug('Preparing to handle %s %v.', req.method, requestPath);
    const resolved = this.getService(RouteRegistry).matchRouteByRequest(req);
    if (!resolved) {
      this.debug('No route for the request %s %v.', req.method, requestPath);
      this.getService(ErrorSender).send404(req, res);
    } else {
      const {route, params} = resolved;
      // создание дочернего сервис-контейнера для передачи
      // в контекст запроса, что бы родительский контекст
      // нельзя было модифицировать
      const container = new ServiceContainer(this.container);
      const context = new RequestContext(container, req, res);
      // запись параметров пути в контекст запроса,
      // так как они были определены в момент
      // поиска подходящего роута
      context.params = params;
      // разбор тела, заголовков и других данных
      // запроса выполняется отдельным сервисом,
      // после чего результат записывается
      // в контекст передаваемый обработчику
      const reqDataOrPromise = this.getService(RequestParser).parse(req);
      // результат разбора может являться асинхронным,
      // и вместо того, что бы разрывать поток выполнения,
      // стоит проверить, действительно ли необходимо
      // использование оператора "await"
      if (isPromise(reqDataOrPromise)) {
        const reqData = await reqDataOrPromise;
        Object.assign(context, reqData);
      } else {
        Object.assign(context, reqDataOrPromise);
      }
      // получение данных от обработчика, который
      // находится в найденном роуте, и отправка
      // результата в качестве ответа сервера
      let data, error;
      const hookInvoker = this.getService(HookInvoker);
      try {
        // если результатом вызова хуков "preHandler" является
        // значение (или Promise) отличное от "undefined" и "null",
        // то такое значение используется в качестве ответа
        data = hookInvoker.invokeAndContinueUntilValueReceived(
          route,
          HOOK_NAME.PRE_HANDLER,
          res,
          context,
        );
        if (isPromise(data)) data = await data;
        // если ответ не определен хуками "preHandler",
        // то вызывается обработчик роута, результат
        // которого передается в хуки "postHandler"
        if (data == null) {
          data = route.handle(context);
          if (isPromise(data)) data = await data;
          // вызываются хуки "postHandler", результат
          // которых также может быть использован
          // в качестве ответа
          let postHandlerData = hookInvoker.invokeAndContinueUntilValueReceived(
            route,
            HOOK_NAME.POST_HANDLER,
            res,
            context,
            data,
          );
          if (isPromise(postHandlerData))
            postHandlerData = await postHandlerData;
          if (postHandlerData != null) data = postHandlerData;
        }
      } catch (err) {
        error = err;
      }
      if (error) {
        this.getService(ErrorSender).send(req, res, error);
      } else {
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
   * import {HOOK_NAME} from '@e22m4u/js-trie-router';
   *
   * // Router instance.
   * const router = new TrieRouter();
   *
   * // Adds the "preHandler" hook for each route.
   * router.addHook(
   *   HOOK_NAME.PRE_HANDLER,
   *   ctx => { ... },
   * );
   *
   * // Adds the "postHandler" hook for each route.
   * router.addHook(
   *   HOOK_NAME.POST_HANDLER,
   *   ctx => { ... },
   * );
   * ```
   *
   * @param {string} name
   * @param {Function} hook
   * @returns {this}
   */
  addHook(name, hook) {
    this.getService(HookRegistry).addHook(name, hook);
    return this;
  }
}
