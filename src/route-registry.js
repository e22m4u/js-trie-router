import {Route} from './route.js';
import {Errorf} from '@e22m4u/js-format';
import {PathTrie} from '@e22m4u/js-path-trie';
import {ServiceContainer} from '@e22m4u/js-service';
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
   * @param {import('./route.js').RouteDefinition} routeDef
   * @returns {Route}
   */
  defineRoute(routeDef) {
    const debug = this.getDebuggerFor(this.defineRoute);
    if (!routeDef || typeof routeDef !== 'object' || Array.isArray(routeDef))
      throw new Errorf(
        'The route definition should be an Object, but %v was given.',
        routeDef,
      );
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
   * @param {import('http').IncomingRequest} req
   * @returns {ResolvedRoute|undefined}
   */
  matchRouteByRequest(req) {
    const debug = this.getDebuggerFor(this.matchRouteByRequest);
    const requestPath = (req.url || '/').replace(/\?.*$/, '');
    debug(
      'Matching routes with the request %s %v.',
      req.method.toUpperCase(),
      requestPath,
    );
    const triePath = `${req.method.toUpperCase()}/${requestPath}`;
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
      req.method.toUpperCase(),
      requestPath,
    );
  }
}
