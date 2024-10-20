import {Debugger} from './utils/index.js';
import {Service} from '@e22m4u/js-service';

/**
 * Debuggable service.
 */
declare class DebuggableService extends Service {
  /**
   * Debug.
   *
   * @protected
   */
  protected debug: Debugger;
}
