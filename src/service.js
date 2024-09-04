import {toCamelCase} from './utils/index.js';
import {createDebugger} from './utils/index.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {Service as BaseService} from '@e22m4u/js-service';

/**
 * Service.
 */
export class Service extends BaseService {
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
