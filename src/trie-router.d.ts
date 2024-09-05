import {Route} from './route.js';
import {Service} from './service.js';
import {RequestListener} from 'http';
import {RouteDefinition} from './route.js';
import {HOOK_NAME} from './hooks/index.js';
import {RouterHook} from './hooks/index.js';

/**
 * Trie router.
 */
export declare class TrieRouter extends Service {
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
   *   postHandler(ctx, data) { ... }, // The "postHandler" is executed after a route handler
   * });
   * ```
   *
   * @param routeDef
   */
  defineRoute(routeDef: RouteDefinition): Route;

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
   * Add hook.
   *
   * @param name
   * @param hook
   */
  addHook(name: HOOK_NAME, hook: RouterHook): this;
}
