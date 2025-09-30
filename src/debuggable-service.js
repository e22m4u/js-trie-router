import {DebuggableService as BaseDebuggableService} from '@e22m4u/js-service';

/**
 * @typedef {import('@e22m4u/js-service').ServiceContainer} ServiceContainer
 */

/**
 * Module debug namespace.
 */
export const MODULE_DEBUG_NAMESPACE = 'jsTrieRouter';

/**
 * Debuggable service.
 */
export class DebuggableService extends BaseDebuggableService {
  /**
   * Constructor.
   *
   * @param {ServiceContainer} container
   */
  constructor(container = undefined) {
    super(container, {
      namespace: MODULE_DEBUG_NAMESPACE,
      noEnvironmentNamespace: true,
    });
  }
}
