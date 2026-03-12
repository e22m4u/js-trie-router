import {Route} from './route/index.js';
import {RouteDefinition} from './route/index.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {IncomingMessage, ServerResponse} from 'http';
import {DebuggableService} from './debuggable-service.js';
import {TrieRouterOptionsInput} from './trie-router-options.js';
import {RouterBranch, RouterBranchDefinition} from './branch/index.js';

import {
  RouterHook,
  OnRequestHook,
  RouterHookType,
  PreHandlerHook,
  PostHandlerHook,
  OnDefineRouteHook,
} from './hooks/index.js';

/**
 * Trie router.
 */
export declare class TrieRouter extends DebuggableService {
  /**
   * Constructor.
   *
   * @param container
   */
  constructor(container: ServiceContainer);

  /**
   * Constructor.
   *
   * @param options
   */
  constructor(options: TrieRouterOptionsInput);

  /**
   * Constructor.
   *
   * @param container
   * @param options
   */
  constructor(container: ServiceContainer, options: TrieRouterOptionsInput);

  /**
   * Define route.
   *
   * Example 1:
   * ```
   * const router = new TrieRouter();
   * router.defineRoute({
   *   method: HttpMethod.GET,         // Request method.
   *   path: '/',                      // Path template.
   *   handler: ctx => 'Hello world!', // Route handler.
   * });
   * ```
   *
   * Example 2:
   * ```
   * const router = new TrieRouter();
   * router.defineRoute({
   *   method: HttpMethod.POST,        // Request method.
   *   path: '/users/:id',             // The path template may have parameters.
   *   preHandler(ctx) { ... },        // The hook "preHandler" is executed before a route handler.
   *   handler(ctx) { ... },           // Route handler function.
   *   postHandler(ctx, data) { ... }, // The hook "postHandler" is executed after a route handler
   * });
   * ```
   *
   * @param routeDef
   */
  defineRoute(routeDef: RouteDefinition): Route;

  /**
   * Create branch.
   *
   * Example:
   * ```js
   * const router = new TrieRouter();
   * const apiBranch = router.createBranch({path: 'api'});
   *
   * // GET /api/hello
   * apiBranch.defineRoute({
   *   method: HttpMethod.GET,
   *   path: '/hello',
   *   handler: () => 'Hello World!',
   * });
   * ```
   *
   * @param branchDef
   */
  createBranch(branchDef: RouterBranchDefinition): RouterBranch;

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
   * @param request
   * @param response
   * @returns {Function}
   */
  handleRequest(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void>;

  /**
   * Add hook (overload for "onDefineRoute" hook).
   *
   * @param type
   * @param hook
   */
  addHook(
    type: typeof RouterHookType.ON_DEFINE_ROUTE,
    hook: OnDefineRouteHook,
  ): this;

  /**
   * Add hook (overload for "onRequest" hook).
   *
   * @param type
   * @param hook
   */
  addHook(type: typeof RouterHookType.ON_REQUEST, hook: OnRequestHook): this;

  /**
   * Add hook (overload for "preHandler" hook).
   *
   * @param type
   * @param hook
   */
  addHook(type: typeof RouterHookType.PRE_HANDLER, hook: PreHandlerHook): this;

  /**
   * Add hook (overload for "postHandler" hook).
   *
   * @param type
   * @param hook
   */
  addHook(
    type: typeof RouterHookType.POST_HANDLER,
    hook: PostHandlerHook,
  ): this;

  /**
   * Add hook.
   *
   * @param type
   * @param hook
   */
  addHook(type: RouterHookType, hook: RouterHook): this;

  /**
   * Has hook.
   *
   * @param type
   * @param hook
   */
  hasHook(type: RouterHookType, hook: RouterHook): boolean;
}
