import {Errorf} from '@e22m4u/js-format';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Router hook.
 *
 * @type {{
 *   PRE_HANDLER: 'preHandler',
 *   POST_HANDLER: 'postHandler',
 * }}
 */
export const HookName = {
  PRE_HANDLER: 'preHandler',
  POST_HANDLER: 'postHandler',
};

/**
 * Hook registry.
 */
export class HookRegistry extends DebuggableService {
  /**
   * Hooks.
   *
   * @type {Map<string, Function[]>}
   * @private
   */
  _hooks = new Map();

  /**
   * Add hook.
   *
   * @param {string} name
   * @param {Function} hook
   * @returns {this}
   */
  addHook(name, hook) {
    if (!name || typeof name !== 'string')
      throw new Errorf('The hook name is required, but %v given.', name);
    if (!Object.values(HookName).includes(name))
      throw new Errorf('The hook name %v is not supported.', name);
    if (!hook || typeof hook !== 'function')
      throw new Errorf(
        'The hook %v should be a Function, but %v given.',
        name,
        hook,
      );
    const hooks = this._hooks.get(name) || [];
    hooks.push(hook);
    this._hooks.set(name, hooks);
    return this;
  }

  /**
   * Has hook.
   *
   * @param {string} name
   * @param {Function} hook
   * @returns {boolean}
   */
  hasHook(name, hook) {
    if (!name || typeof name !== 'string')
      throw new Errorf('The hook name is required, but %v given.', name);
    if (!Object.values(HookName).includes(name))
      throw new Errorf('The hook name %v is not supported.', name);
    if (!hook || typeof hook !== 'function')
      throw new Errorf(
        'The hook %v should be a Function, but %v given.',
        name,
        hook,
      );
    const hooks = this._hooks.get(name) || [];
    return hooks.indexOf(hook) > -1;
  }

  /**
   * Get hooks.
   *
   * @param {string} name
   * @returns {Function[]}
   */
  getHooks(name) {
    if (!name || typeof name !== 'string')
      throw new Errorf('The hook name is required, but %v given.', name);
    if (!Object.values(HookName).includes(name))
      throw new Errorf('The hook name %v is not supported.', name);
    return this._hooks.get(name) || [];
  }
}
