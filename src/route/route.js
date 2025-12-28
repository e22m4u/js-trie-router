import {Debuggable} from '@e22m4u/js-debug';
import {HookRegistry, RouterHookType} from '../hooks/index.js';
import {MODULE_DEBUG_NAMESPACE} from '../debuggable-service.js';
import {cloneDeep, getRequestPathname} from '../utils/index.js';
import {validateRouteDefinition} from './validate-route-definition.js';

/**
 * @typedef {import('./request-context.js').RequestContext} RequestContext
 * @typedef {(ctx: RequestContext) => *} RoutePreHandler
 * @typedef {(ctx: RequestContext) => *} RouteHandler
 * @typedef {(ctx: RequestContext, data: *) => *} RoutePostHandler
 * @typedef {{
 *   method: string,
 *   path: string,
 *   handler: RouteHandler,
 *   preHandler?: RoutePreHandler|(RoutePreHandler[]),
 *   postHandler?: RoutePostHandler|(RoutePostHandler[]),
 *   meta?: object,
 * }} RouteDefinition
 */

/**
 * Http method.
 *
 * @type {{
 *   GET: 'GET',
 *   POST: 'POST',
 *   PUT: 'PUT',
 *   PATCH: 'PATCH',
 *   DELETE: 'DELETE',
 * }}
 */
export const HttpMethod = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

/**
 * Route.
 */
export class Route extends Debuggable {
  /**
   * Method.
   *
   * @type {string}
   * @private
   */
  _method;

  /**
   * Getter of the method.
   *
   * @returns {string}
   */
  get method() {
    return this._method;
  }

  /**
   * Path template.
   *
   * @type {string}
   * @private
   */
  _path;

  /**
   * Getter of the path.
   *
   * @returns {string}
   */
  get path() {
    return this._path;
  }

  /**
   * Meta.
   *
   * @type {object}
   */
  _meta = {};

  /**
   * Getter of the meta.
   *
   * @returns {object}
   */
  get meta() {
    return this._meta;
  }

  /**
   * Handler.
   *
   * @type {RouteHandler}
   * @private
   */
  _handler;

  /**
   * Getter of the handler.
   *
   * @returns {*}
   */
  get handler() {
    return this._handler;
  }

  /**
   * Hook registry.
   *
   * @type {HookRegistry}
   * @private
   */
  _hookRegistry = new HookRegistry();

  /**
   * Getter of the hook registry.
   *
   * @returns {HookRegistry}
   */
  get hookRegistry() {
    return this._hookRegistry;
  }

  /**
   * Constructor.
   *
   * @param {RouteDefinition} routeDef
   */
  constructor(routeDef) {
    super({
      namespace: MODULE_DEBUG_NAMESPACE,
      noEnvironmentNamespace: true,
      noInstantiationMessage: true,
    });
    validateRouteDefinition(routeDef);
    this._method = routeDef.method.toUpperCase();
    this._path = routeDef.path;
    if (routeDef.meta !== undefined) {
      this._meta = cloneDeep(routeDef.meta);
    }
    this._handler = routeDef.handler;
    if (routeDef.preHandler !== undefined) {
      const preHandlerHooks = Array.isArray(routeDef.preHandler)
        ? routeDef.preHandler
        : [routeDef.preHandler];
      preHandlerHooks.forEach(hook => {
        this._hookRegistry.addHook(RouterHookType.PRE_HANDLER, hook);
      });
    }
    if (routeDef.postHandler !== undefined) {
      const postHandlerHooks = Array.isArray(routeDef.postHandler)
        ? routeDef.postHandler
        : [routeDef.postHandler];
      postHandlerHooks.forEach(hook => {
        this._hookRegistry.addHook(RouterHookType.POST_HANDLER, hook);
      });
    }
    this.ctorDebug('A new route %s %v was created.', this._method, this._path);
  }

  /**
   * Handle request.
   *
   * @param {RequestContext} context
   * @returns {*}
   */
  handle(context) {
    const debug = this.getDebuggerFor(this.handle);
    const requestPath = getRequestPathname(context.request);
    debug(
      'Invoking the Route handler for the request %s %v.',
      this.method.toUpperCase(),
      requestPath,
    );
    return this._handler(context);
  }
}
