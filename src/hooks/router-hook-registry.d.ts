import {RouteDefinition} from '../route/index.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {RequestContext} from '../request-context.js';
import {Callable, ValueOrPromise} from '../types.js';
import {IncomingMessage, ServerResponse} from 'http';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Router hook type.
 */
export declare const RouterHookType: {
  ON_DEFINE_ROUTE: 'onDefineRoute';
  ON_REQUEST: 'onRequest';
  PRE_HANDLER: 'preHandler';
  POST_HANDLER: 'postHandler';
};

/**
 * Router hook type.
 */
export type RouterHookType =
  (typeof RouterHookType)[keyof typeof RouterHookType];

/**
 * Router hook types.
 */
export const ROUTER_HOOK_TYPES: RouterHookType[];

/**
 * Router hook.
 */
export type RouterHook = Callable;

/**
 * On defined route hook.
 */
export type OnDefineRouteHook = (
  routeDef: RouteDefinition,
  container: ServiceContainer,
) => RouteDefinition | undefined;

/**
 * On request hook.
 */
export type OnRequestHook = (
  request: IncomingMessage,
  response: ServerResponse,
  container: ServiceContainer,
) => ValueOrPromise<boolean | undefined>;

/**
 * Pre handler hook.
 */
export type PreHandlerHook = (ctx: RequestContext) => unknown;

/**
 * Post handler hook.
 */
export type PostHandlerHook = (ctx: RequestContext, data: unknown) => unknown;

/**
 * Router hook registry.
 */
export declare class RouterHookRegistry extends DebuggableService {
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

  /**
   * Get hooks (overload for "onDefineRoute").
   *
   * @param type
   */
  getHooks(type: typeof RouterHookType.ON_DEFINE_ROUTE): OnDefineRouteHook[];

  /**
   * Get hooks (overload for "onRequest").
   *
   * @param type
   */
  getHooks(type: typeof RouterHookType.ON_REQUEST): OnRequestHook[];

  /**
   * Get hooks (overload for "preHandler").
   *
   * @param type
   */
  getHooks(type: typeof RouterHookType.PRE_HANDLER): PreHandlerHook[];

  /**
   * Get hooks (overload for "postHandler").
   *
   * @param type
   */
  getHooks(type: typeof RouterHookType.POST_HANDLER): PostHandlerHook[];

  /**
   * Get hooks.
   *
   * @param type
   */
  getHooks(type: RouterHookType): RouterHook[];
}
