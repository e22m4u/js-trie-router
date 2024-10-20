import {Callable} from '../types.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Hook type.
 */
export enum HOOK_NAME {
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
  addHook(name: HOOK_NAME, hook: RouterHook): this;

  /**
   * Has hook.
   *
   * @param name
   * @param hook
   */
  hasHook(name: HOOK_NAME, hook: RouterHook): this;

  /**
   * Get hooks.
   *
   * @param name
   */
  getHooks(name: HOOK_NAME): RouterHook[];
}
