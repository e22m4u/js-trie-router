import {ServerResponse} from 'http';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Data sender.
 */
export declare class DataSender extends DebuggableService {
  /**
   * Send.
   *
   * @param res
   * @param data
   */
  send(res: ServerResponse, data: unknown): void;
}
