import {Route} from './route.js';
import {Service} from './service.js';
import {Errorf} from '@e22m4u/js-format';
import {PathTrie} from '@e22m4u/js-path-trie';
import {ServiceContainer} from '@e22m4u/js-service';

/**
 * @typedef {{
 *   route: Route,
 *   params: object,
 * }} ResolvedRoute
 */

/**
 * Route registry.
 */
export class RouteRegistry extends Service {
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
    if (!routeDef || typeof routeDef !== 'object' || Array.isArray(routeDef))
      throw new Errorf(
        'The route definition should be an Object, but %v given.',
        routeDef,
      );
    const route = new Route(routeDef);
    const triePath = `${route.method}/${route.path}`;
    this._trie.add(triePath, route);
    this.debug(
      'The route %s %v is registered.',
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
    const requestPath = (req.url || '/').replace(/\?.*$/, '');
    this.debug(
      'Matching %s %v with registered routes.',
      req.method.toUpperCase(),
      requestPath,
    );
    const triePath = `${req.method.toLowerCase()}/${requestPath}`;
    const resolved = this._trie.match(triePath);
    if (resolved) {
      const route = resolved.value;
      this.debug(
        'The request %s %v was matched to the route %s %v.',
        req.method.toUpperCase(),
        requestPath,
        route.method.toUpperCase(),
        route.path,
      );
      const paramNames = Object.keys(resolved.params);
      if (paramNames) {
        paramNames.forEach(name => {
          this.debug(
            'The path parameter %v has the value %v.',
            name,
            resolved.params[name],
          );
        });
      } else {
        this.debug('No path parameters found.');
      }
      return {route, params: resolved.params};
    }
    this.debug(
      'No matched route for the request %s %v.',
      req.method.toUpperCase(),
      requestPath,
    );
  }
}
