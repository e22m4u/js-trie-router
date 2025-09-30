import {Errorf} from '@e22m4u/js-format';

/**
 * Hook type.
 *
 * @type {{
 *   PRE_HANDLER: 'preHandler',
 *   POST_HANDLER: 'postHandler',
 * }}
 */
export const HookType = {
  PRE_HANDLER: 'preHandler',
  POST_HANDLER: 'postHandler',
};

/**
 * Hook registry.
 */
export class HookRegistry {
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
   * @param {string} type
   * @param {Function} hook
   * @returns {this}
   */
  addHook(type, hook) {
    if (!type || typeof type !== 'string')
      throw new Errorf('The hook type is required, but %v was given.', type);
    if (!Object.values(HookType).includes(type))
      throw new Errorf('The hook type %v is not supported.', type);
    if (!hook || typeof hook !== 'function')
      throw new Errorf(
        'The hook %v should be a Function, but %v was given.',
        type,
        hook,
      );
    const hooks = this._hooks.get(type) || [];
    hooks.push(hook);
    this._hooks.set(type, hooks);
    return this;
  }

  /**
   * Has hook.
   *
   * @param {string} type
   * @param {Function} hook
   * @returns {boolean}
   */
  hasHook(type, hook) {
    if (!type || typeof type !== 'string')
      throw new Errorf('The hook type is required, but %v was given.', type);
    if (!Object.values(HookType).includes(type))
      throw new Errorf('The hook type %v is not supported.', type);
    if (!hook || typeof hook !== 'function')
      throw new Errorf(
        'The hook %v should be a Function, but %v was given.',
        type,
        hook,
      );
    const hooks = this._hooks.get(type) || [];
    return hooks.indexOf(hook) > -1;
  }

  /**
   * Get hooks.
   *
   * @param {string} type
   * @returns {Function[]}
   */
  getHooks(type) {
    if (!type || typeof type !== 'string')
      throw new Errorf('The hook type is required, but %v was given.', type);
    if (!Object.values(HookType).includes(type))
      throw new Errorf('The hook type %v is not supported.', type);
    return this._hooks.get(type) || [];
  }
}
