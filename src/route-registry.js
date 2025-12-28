import {PathTrie} from '@e22m4u/js-path-trie';
import {ROOT_PATH, Route} from './route/index.js';
import {getRequestPathname} from './utils/index.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {DebuggableService} from './debuggable-service.js';

/**
 * @typedef {{
 *   route: Route,
 *   params: object,
 * }} ResolvedRoute
 */

/**
 * Route registry.
 */
export class RouteRegistry extends DebuggableService {
  /**
   * Constructor.
   *
   * @param {ServiceContainer} container
   */
  constructor(container) {
    super(container);
    this._trie = new PathTrie();
  }

  /**
   * Define route.
   *
   * @param {import('./route/index.js').RouteDefinition} routeDef
   * @returns {Route}
   */
  defineRoute(routeDef) {
    const debug = this.getDebuggerFor(this.defineRoute);
    if (!routeDef || typeof routeDef !== 'object' || Array.isArray(routeDef)) {
      throw new InvalidArgumentError(
        'The route definition must be an Object, but %v was given.',
        routeDef,
      );
    }
    const route = new Route(routeDef);
    const triePath = `${route.method}/${route.path}`;
    this._trie.add(triePath, route);
    debug(
      'The route %s %v was registered.',
      route.method.toUpperCase(),
      route.path,
    );
    return route;
  }

  /**
   * Match route by request.
   *
   * @param {import('http').IncomingRequest} request
   * @returns {ResolvedRoute|undefined}
   */
  matchRouteByRequest(request) {
    const debug = this.getDebuggerFor(this.matchRouteByRequest);
    const requestPath = getRequestPathname(request);
    debug(
      'Matching routes with the request %s %v.',
      request.method.toUpperCase(),
      requestPath,
    );
    const rawTriePath = `${request.method.toUpperCase()}/${requestPath}`;
    // маршрут формируется с удалением дубликатов косой черты
    // "OPTIONS//api/users/login" => "OPTIONS/api/users/login"
    const triePath = rawTriePath.replace(/\/+/g, ROOT_PATH);
    const resolved = this._trie.match(triePath);
    if (resolved) {
      const route = resolved.value;
      debug(
        'The route %s %v was matched.',
        route.method.toUpperCase(),
        route.path,
      );
      const paramNames = Object.keys(resolved.params);
      if (paramNames.length) {
        paramNames.forEach(name => {
          debug(
            'The path parameter %v had the value %v.',
            name,
            resolved.params[name],
          );
        });
      } else {
        debug('No path parameters found.');
      }
      return {route, params: resolved.params};
    }
    debug(
      'No matched route for the request %s %v.',
      request.method.toUpperCase(),
      requestPath,
    );
  }
}
