import {Callable} from '../types.js';
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
export type RouterHook<T = unknown> = Callable<T>;

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
  getHooks(type: HookType): RouterHook[];
}
