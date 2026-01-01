import {RequestListener} from 'http';
import {Route} from './route/index.js';
import {RouteDefinition} from './route/index.js';
import {DebuggableService} from './debuggable-service.js';
import {PostHandlerHook, PreHandlerHook} from './hooks/index.js';
import {RouterBranch, RouterBranchDefinition} from './branch/index.js';

/**
 * Trie router.
 */
export declare class TrieRouter extends DebuggableService {
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
   *   method: HttpMethod.POST,       // Request method.
   *   path: '/users/:id',             // The path template may have parameters.
   *   preHandler(ctx) { ... },        // The "preHandler" is executed before a route handler.
   *   handler(ctx) { ... },           // Request handler function.
   *   postHandler(ctx, data) { ... }, // The "postHandler" is executed after a route handler
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
  get requestListener(): RequestListener;

  /**
   * Add pre-handler hook.
   *
   * @param hook
   */
  addPreHandler(hook: PreHandlerHook): this;

  /**
   * Has pre-handler hook.
   *
   * @param hook
   */
  hasPreHandler(hook: PreHandlerHook): boolean;

  /**
   * Add post-handler hook.
   *
   * @param hook
   */
  addPostHandler(hook: PostHandlerHook): this;

  /**
   * Has post-handler hook.
   *
   * @param hook
   */
  hasPostHandler(hook: PostHandlerHook): boolean;
}
