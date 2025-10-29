import {Callable} from '../types.js';
import {RequestContext} from '../request-context.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Hook type.
 */
export declare const HookType: {
  PRE_HANDLER: 'preHandler';
  POST_HANDLER: 'postHandler';
};

/**
 * Type of HookType.
 */
export type HookType = (typeof HookType)[keyof typeof HookType];

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
 * Hook registry.
 */
export declare class HookRegistry extends DebuggableService {
  /**
   * Add hook.
   *
   * @param type
   * @param hook
   */
  addHook(type: typeof HookType.PRE_HANDLER, hook: PreHandlerHook): this;

  /**
   * Add hook.
   *
   * @param type
   * @param hook
   */
  addHook(type: typeof HookType.POST_HANDLER, hook: PostHandlerHook): this;

  /**
   * Add hook.
   *
   * @param type
   * @param hook
   */
  addHook(type: HookType, hook: RouterHook): this;

  /**
   * Has hook.
   *
   * @param type
   * @param hook
   */
  hasHook(type: HookType, hook: RouterHook): boolean;

  /**
   * Get hooks.
   *
   * @param type
   */
  getHooks(type: typeof HookType.PRE_HANDLER): PreHandlerHook[];

  /**
   * Get hooks.
   *
   * @param type
   */
  getHooks(type: typeof HookType.POST_HANDLER): PostHandlerHook[];

  /**
   * Get hooks.
   *
   * @param type
   */
  getHooks(type: HookType): RouterHook[];
}
