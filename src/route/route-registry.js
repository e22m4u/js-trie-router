import {Route} from './route.js';
import {PathTrie} from '@e22m4u/js-path-trie';
import {ServiceContainer} from '@e22m4u/js-service';
import {getRequestPathname} from '../utils/index.js';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {DebuggableService} from '../debuggable-service.js';
import {RouterHookRegistry, RouterHookType} from '../hooks/index.js';

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
   * @param {ServiceContainer} [container]
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
        'Route definition must be an Object, but %v was given.',
        routeDef,
      );
    }
    // если определены хуки определения маршрута,
    // то выполняется их последовательный вызов
    const hookRegistry = this.getService(RouterHookRegistry);
    const onDefineRouteHooks = hookRegistry.getHooks(
      RouterHookType.ON_DEFINE_ROUTE,
    );
    if (onDefineRouteHooks.length) {
      debug('Invoking %v "onDefineRoute" hook(s).', onDefineRouteHooks.length);
      for (const hook of onDefineRouteHooks) {
        const hookResult = hook({...routeDef}, this.container);
        // если возвращаемое значение хука не является
        // объектом и undefined, то выбрасывается ошибка
        if (
          hookResult !== undefined &&
          !(
            hookResult !== null &&
            typeof hookResult === 'object' &&
            !Array.isArray(hookResult)
          )
        ) {
          throw new InvalidArgumentError(
            'Hook "onDefineRoute" must return an Object or undefined, ' +
              'but %v was given.',
            hookResult,
          );
        }
        // если хук вернул значение, отличное от undefined,
        // то значение используется в качестве определения
        if (hookResult !== undefined) {
          routeDef = hookResult;
        }
      }
      debug('Hooks invoked.');
    }
    const route = new Route(routeDef);
    const triePath = `${route.method}/${route.path}`;
    this._trie.add(triePath, route);
    debug('Route %s %v registered.', route.method.toUpperCase(), route.path);
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
      'Matching routes for the request %s %v.',
      request.method.toUpperCase(),
      requestPath,
    );
    const rawTriePath = `${request.method.toUpperCase()}/${requestPath}`;
    // маршрут формируется с удалением дубликатов косой черты
    // "OPTIONS//api/users/login" => "OPTIONS/api/users/login"
    const triePath = rawTriePath.replace(/\/+/g, '/');
    const resolved = this._trie.match(triePath);
    if (resolved) {
      const route = resolved.value;
      debug('Matched route is %s %v.', route.method.toUpperCase(), route.path);
      const paramNames = Object.keys(resolved.params);
      if (paramNames.length) {
        paramNames.forEach(name => {
          debug(
            'Found a path parameter %v with a value %v.',
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
      'No route found for the request %s %v.',
      request.method.toUpperCase(),
      requestPath,
    );
  }
}
