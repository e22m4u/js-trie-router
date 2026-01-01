import {Debuggable} from '@e22m4u/js-debug';
import {MODULE_DEBUG_NAMESPACE} from '../debuggable-service.js';
import {cloneDeep, getRequestPathname} from '../utils/index.js';
import {RouterHookRegistry, RouterHookType} from '../hooks/index.js';
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
 * Объект метаданных по умолчанию.
 */
const DEFAULT_META = Object.freeze({});

/**
 * Route.
 */
export class Route extends Debuggable {
  /**
   * Definition.
   *
   * @type {RouteDefinition}
   */
  _definition;

  /**
   * Get definition.
   *
   * @returns {RouteDefinition}
   */
  getDefinition() {
    return this._definition;
  }

  /**
   * Hook registry.
   *
   * @type {RouterHookRegistry}
   */
  _hookRegistry = new RouterHookRegistry();

  /**
   * Get hook registry.
   *
   * @returns {RouterHookRegistry}
   */
  getHookRegistry() {
    return this._hookRegistry;
  }

  /**
   * Getter of the method.
   *
   * @returns {string}
   */
  get method() {
    return this._definition.method;
  }

  /**
   * Getter of the path.
   *
   * @returns {string}
   */
  get path() {
    return this._definition.path;
  }

  /**
   * Getter of the meta.
   *
   * @returns {object}
   */
  get meta() {
    return this._definition.meta || DEFAULT_META;
  }

  /**
   * Getter of the handler.
   *
   * @returns {*}
   */
  get handler() {
    return this._definition.handler;
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
    // установка копии определения
    // в свойство экземпляра
    this._definition = cloneDeep(routeDef);
    // перевод метода в верхний регистр
    // выполняется в конструкторе единожды
    this._definition.method = this._definition.method.toUpperCase();
    // регистрация хуков маршрута
    // в экземпляре реестра
    if (routeDef.preHandler !== undefined) {
      const preHandlerHooks = [routeDef.preHandler].flat().filter(Boolean);
      preHandlerHooks.forEach(hook => {
        this._hookRegistry.addHook(RouterHookType.PRE_HANDLER, hook);
      });
    }
    if (routeDef.postHandler !== undefined) {
      const postHandlerHooks = [routeDef.postHandler].flat().filter(Boolean);
      postHandlerHooks.forEach(hook => {
        this._hookRegistry.addHook(RouterHookType.POST_HANDLER, hook);
      });
    }
    this.ctorDebug('Created a route %s %v.', this.method, this.path);
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
    debug('Invoking a route handler %s %v.', this.method, requestPath);
    return this.handler(context);
  }
}
