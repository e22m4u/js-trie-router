import {Errorf} from '@e22m4u/js-format';
import {HOOK_NAME} from './hooks/index.js';
import {HookRegistry} from './hooks/index.js';
import {createDebugger} from './utils/index.js';
import {getRequestPathname} from './utils/index.js';

/**
 * @typedef {import('./request-context.js').RequestContext} RequestContext
 * @typedef {(ctx: RequestContext) => *} RoutePreHandler
 * @typedef {(ctx: RequestContext) => *} RouteHandler
 * @typedef {(ctx: RequestContext, data: *) => *} RoutePostHandler
 * @typedef {{
 *   method: string,
 *   path: string,
 *   preHandler: RoutePreHandler|(RoutePreHandler[])
 *   handler: RouteHandler,
 *   postHandler: RoutePostHandler|(RoutePostHandler[])
 * }} RouteDefinition
 */

/**
 * Http method.
 *
 * @type {{
 *   DELETE: 'delete',
 *   POST: 'post',
 *   GET: 'get',
 *   PUT: 'put',
 *   PATCH: 'patch',
 * }}
 */
export const HTTP_METHOD = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  PATCH: 'patch',
  DELETE: 'delete',
};

/**
 * Debugger.
 *
 * @type {Function}
 */
const debug = createDebugger('route');

/**
 * Route.
 */
export class Route {
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
    if (!routeDef || typeof routeDef !== 'object' || Array.isArray(routeDef))
      throw new Errorf(
        'The first parameter of Route.controller ' +
          'should be an Object, but %v given.',
        routeDef,
      );
    if (!routeDef.method || typeof routeDef.method !== 'string')
      throw new Errorf(
        'The option "method" of the Route should be ' +
          'a non-empty String, but %v given.',
        routeDef.method,
      );
    this._method = routeDef.method.toLowerCase();
    if (typeof routeDef.path !== 'string')
      throw new Errorf(
        'The option "path" of the Route should be ' + 'a String, but %v given.',
        routeDef.path,
      );
    this._path = routeDef.path;
    if (typeof routeDef.handler !== 'function')
      throw new Errorf(
        'The option "handler" of the Route should be ' +
          'a Function, but %v given.',
        routeDef.handler,
      );
    this._handler = routeDef.handler;
    if (routeDef.preHandler != null) {
      const preHandlerHooks = Array.isArray(routeDef.preHandler)
        ? routeDef.preHandler
        : [routeDef.preHandler];
      preHandlerHooks.forEach(hook => {
        this._hookRegistry.addHook(HOOK_NAME.PRE_HANDLER, hook);
      });
    }
    if (routeDef.postHandler != null) {
      const postHandlerHooks = Array.isArray(routeDef.postHandler)
        ? routeDef.postHandler
        : [routeDef.postHandler];
      postHandlerHooks.forEach(hook => {
        this._hookRegistry.addHook(HOOK_NAME.POST_HANDLER, hook);
      });
    }
  }

  /**
   * Handle request.
   *
   * @param {RequestContext} context
   * @returns {*}
   */
  handle(context) {
    const requestPath = getRequestPathname(context.req);
    debug(
      'Invoking the Route handler for the request %s %v.',
      this.method.toUpperCase(),
      requestPath,
    );
    return this._handler(context);
  }
}
