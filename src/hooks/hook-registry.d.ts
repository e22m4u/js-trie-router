import {Callable} from '../types.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Hook type.
 */
export enum HookName {
  PRE_HANDLER = 'preHandler',
  POST_HANDLER = 'postHandler',
}

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
   * @param name
   * @param hook
   */
  addHook(name: HookName, hook: RouterHook): this;

  /**
   * Has hook.
   *
   * @param name
   * @param hook
   */
  hasHook(name: HookName, hook: RouterHook): this;

  /**
   * Get hooks.
   *
   * @param name
   */
  getHooks(name: HookName): RouterHook[];
}
