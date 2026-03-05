import {RouterBranch} from './branch/index.js';
import {RequestParser} from './parsers/index.js';
import {RequestContext} from './request-context.js';
import {ServerResponse, IncomingMessage} from 'http';
import {DebuggableService} from './debuggable-service.js';
import {TrieRouterOptions} from './trie-router-options.js';
import {HttpMethod, RouteRegistry} from './route/index.js';
import {RouterDataSender, RouterErrorSender} from './senders/index.js';
import {isServiceContainer, ServiceContainer} from '@e22m4u/js-service';
import {isPromise, isResponseSent, getRequestPathname} from './utils/index.js';

import {
  RouterHookType,
  RouterHookInvoker,
  RouterHookRegistry,
} from './hooks/index.js';

/**
 * Trie router.
 */
export class TrieRouter extends DebuggableService {
  /**
   * Constructor.
   *
   * @param {import('@e22m4u/js-service').ServiceContainer|import('./trie-router-options.js').TrieRouterOptionsInput} [containerOrOptions]
   * @param {import('./trie-router-options.js').TrieRouterOptionsInput} [options]
   */
  constructor(containerOrOptions, options) {
    // первый аргумент является контейнером,
    // который передается в базовый конструктор
    if (isServiceContainer(containerOrOptions)) {
      super(containerOrOptions);
    }
    // если первый аргумент не является контейнером,
    // то значение воспринимается как объект настроек
    else if (containerOrOptions !== undefined) {
      super();
      options = containerOrOptions;
    }
    // если первый аргумент не определен, то объект
    // настроек ожидается во втором аргументе
    else {
      super();
    }
    this.useService(TrieRouterOptions, options);
  }

  /**
   * Define route.
   *
   * Example 1:
   * ```
   * const router = new TrieRouter();
   * router.defineRoute({
   *   method: HttpMethod.GET,         // Request method.
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
   *   preHandler(ctx) { ... },        // The hook "preHandler" executes before a route handler.
   *   handler(ctx) { ... },           // Route handler function.
   *   postHandler(ctx, data) { ... }, // The hook "postHandler" executes after a route handler.
   * });
   * ```
   *
   * @param {import('./route-registry.js').RouteDefinition} routeDef
   * @returns {import('./route/index.js').Route}
   */
  defineRoute(routeDef) {
    return this.getService(RouteRegistry).defineRoute(routeDef);
  }

  /**
   * Create branch.
   *
   * Example:
   * ```js
   * const router = new TrieRouter();
   * const apiBranch = router.createBranch({path: '/api'});
   *
   * // GET /api/hello
   * apiBranch.defineRoute({
   *   method: HttpMethod.GET,
   *   path: '/hello',
   *   handler: () => 'Hello World!',
   * });
   * ```
   *
   * @param {import('./branch/index.js').RouterBranchDefinition} branchDef
   * @returns {import('./branch/index.js').RouterBranchDefinition}
   */
  createBranch(branchDef) {
    return new RouterBranch(this, branchDef);
  }

  /**
   * Handle request.
   *
   * Example:
   * ```
   * import http from 'http';
   * import {TrieRouter} from '@e22m4u/js-trie-router';
   *
   * const router = new TrieRouter();
   * const server = new http.Server();
   * server.on('request', router.handleRequest); // Bind the request listener.
   * server.listen(3000);                        // Listen for connections.
   * ```
   *
   * @param {import('http').IncomingMessage} request
   * @param {import('http').ServerResponse} response
   * @returns {Promise<undefined>}
   */
  async handleRequest(request, response) {
    const debug = this.getDebuggerFor(this.handleRequest);
    const requestPath = getRequestPathname(request);
    debug('Handling an incoming request %s %v.', request.method, requestPath);
    // при обработке запроса требуется перехватывать
    // возможные ошибки, чтобы избежать падения процесса
    try {
      // если ответ уже отправлен, то дальнейшая
      // обработка запроса прерывается
      if (isResponseSent(response)) {
        debug('Response has been sent before handling.');
        return;
      }
      // проверка наличия "onRequest" хуков
      // и их последовательный вызов
      const hookInvoker = this.getService(RouterHookInvoker);
      const onRequestHooks = this.getService(RouterHookRegistry).getHooks(
        RouterHookType.ON_REQUEST,
      );
      if (onRequestHooks.length) {
        debug('Invoking "onRequest" hooks, %v hook(s) found.');
        let shouldIgnoreRequest = hookInvoker.invokeOnRequestHooks(
          request,
          response,
        );
        // если результатом вызова "onRequest" хуков
        // является Promise, то ожидается его значение
        if (isPromise(shouldIgnoreRequest)) {
          shouldIgnoreRequest = await shouldIgnoreRequest;
        }
        // если ответ уже отправлен, то дальнейшая
        // обработка запроса прерывается
        if (isResponseSent(response)) {
          debug('Response has been sent by "onRequest" hook.');
          return;
        }
        // если результатом вызова "onRequest" хуков
        // является логическое значение true, то обработка
        // текущего запроса прерывается
        if (shouldIgnoreRequest === true) {
          debug('Response handling was interrupted by "onRequest" hook.');
          return;
        }
      }
      const resolved =
        this.getService(RouteRegistry).matchRouteByRequest(request);
      if (!resolved) {
        // обработка метода OPTIONS выполняется автоматически
        // перед отправкой ошибки 404, если для пути запроса
        // имеются другие методы, то вместо ошибки 404 будет
        // отправлен ответ с "Allow*" заголовками
        if (request.method.toUpperCase() === HttpMethod.OPTIONS) {
          const allowedMethods =
            this.getService(RouteRegistry).getAllowedMethodsForRequestPath(
              requestPath,
            );
          if (allowedMethods.length > 0) {
            debug('Auto-handling OPTIONS request.');
            if (!allowedMethods.includes('OPTIONS')) {
              allowedMethods.push('OPTIONS');
            }
            const allowHeader = allowedMethods.join(', ');
            response.statusCode = 204;
            response.setHeader('Allow', allowHeader);
            response.end();
            return;
          }
        }
        debug(
          'No route found for the request %s %v.',
          request.method,
          requestPath,
        );
        this.getService(RouterErrorSender).send404(request, response);
      } else {
        const {route, params} = resolved;
        // создание дочернего сервис-контейнера для передачи
        // в контекст запроса, чтобы родительский контекст
        // нельзя было модифицировать
        const container = new ServiceContainer(this.container);
        const context = new RequestContext(container, request, response, route);
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
        // разбор тела, заголовков и других данных запроса
        // выполняется отдельным сервисом, после чего результат
        // записывается в контекст передаваемый обработчику
        const reqDataOrPromise = this.getService(RequestParser).parse(request);
        // результат разбора может являться асинхронным, и вместо
        // того, чтобы разрывать поток выполнения, стоит проверить,
        // действительно ли необходимо использование оператора "await"
        if (isPromise(reqDataOrPromise)) {
          const reqData = await reqDataOrPromise;
          Object.assign(context, reqData);
        } else {
          Object.assign(context, reqDataOrPromise);
        }
        // если результатом вызова хуков "preHandler" является
        // значение (или Promise) отличное от "undefined",
        // то такое значение используется в качестве ответа
        let data = hookInvoker.invokePreHandlerHooks(context);
        if (isPromise(data)) {
          data = await data;
        }
        // если на данном этапе ответ не бы отправлен через
        // ServerResponse, то выполняется вызов основного
        // обработчика маршрута и "postHandler" хуков
        if (!isResponseSent(response)) {
          // если "preHandler" хуки не сформировали ответ
          // сервера, то выполняется основной обработчик
          if (data === undefined) {
            data = route.handle(context);
            if (isPromise(data)) {
              data = await data;
            }
          }
          // если ответ был отправлен через ServerResponse
          // внутри основного обработчика, то обработка запроса
          // немедленно завершается
          if (isResponseSent(response)) {
            debug('Response has been sent by the route handler.');
            return;
          }
          // подготовленные данные передаются в "postHandler"
          // хуки, которые выполняют трансформацию этих данных,
          // и возвращают новое значение (или undefined)
          let postHandlerData = hookInvoker.invokePostHandlerHooks(
            context,
            data,
          );
          // если результатом вызова "postHandler" хуков
          // является Promise, то ожидается его значение
          if (isPromise(postHandlerData)) {
            postHandlerData = await postHandlerData;
          }
          // если ответ был отправлен через ServerResponse
          // внутри "postHandler" хука, то обработка запроса
          // немедленно завершается
          if (isResponseSent(response)) {
            debug('Response has been sent by "postHandler" hook.');
            return;
          }
          // если "postHandler" хук вернул значение, отличное
          // от undefined, то новое значение подменяет данные,
          // возвращаемые клиенту
          if (postHandlerData !== undefined) {
            data = postHandlerData;
          }
        }
        // если ответ был отправлен через ServerResponse
        // внутри "preHandler" хука, то обработка запроса
        // немедленно завершается
        else {
          debug('Response has been sent by "preHandler" hook.');
          return;
        }
        // если ответ не был отправлен во время выполнения
        // хуков и основного обработчика запроса, то итоговые
        // данные передаются в RouterDataSender
        if (!isResponseSent(response)) {
          this.getService(RouterDataSender).send(response, data);
        }
      }
    } catch (error) {
      this.getService(RouterErrorSender).send(request, response, error);
      return;
    }
  }

  /**
   * Add hook.
   *
   * @param {import('./hooks/index.js').RouterHookType} type
   * @param {import('./hooks/index.js').RouterHook} hook
   * @returns {this}
   */
  addHook(type, hook) {
    this.getService(RouterHookRegistry).addHook(type, hook);
    return this;
  }

  /**
   * Has hook.
   *
   * @param {import('./hooks/index.js').RouterHookType} type
   * @param {import('./hooks/index.js').RouterHook} hook
   * @returns {boolean}
   */
  hasHook(type, hook) {
    return this.getService(RouterHookRegistry).hasHook(type, hook);
  }
}
