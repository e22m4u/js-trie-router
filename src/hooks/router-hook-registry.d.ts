import {Callable} from '../types.js';
import {RouteDefinition} from '../route/index.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {RequestContext} from '../request-context.js';
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
 * Pre handler hook.
 */
export type PreHandlerHook = (ctx: RequestContext) => unknown;

/**
 * Post handler hook.
 */
export type PostHandlerHook = (ctx: RequestContext, data: unknown) => unknown;

/**
 * On defined route hook.
 */
export type OnDefineRouteHook = (
  routeDef: RouteDefinition,
  container: ServiceContainer,
) => RouteDefinition | undefined;

/**
 * Router hook registry.
 */
export declare class RouterHookRegistry extends DebuggableService {
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
   * Get hooks.
   *
   * @param type
   */
  getHooks(type: RouterHookType): RouterHook[];
}
