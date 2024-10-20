import {Service} from '@e22m4u/js-service';
import {toCamelCase} from './utils/index.js';
import {createDebugger} from './utils/index.js';
import {ServiceContainer} from '@e22m4u/js-service';

/**
 * Debuggable service.
 */
export class DebuggableService extends Service {
  /**
   * Debug.
   *
   * @type {Function}
   */
  debug;

  /**
   * Constructor.
   *
   * @param {ServiceContainer} container
   */
  constructor(container) {
    super(container);
    const serviceName = toCamelCase(this.constructor.name);
    this.debug = createDebugger(serviceName);
    this.debug('The %v is created.', this.constructor);
  }
}
