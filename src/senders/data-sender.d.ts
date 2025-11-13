import {ServerResponse} from 'http';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Data sender.
 */
export declare class DataSender extends DebuggableService {
  /**
   * Send.
   *
   * @param response
   * @param data
   */
  send(response: ServerResponse, data: unknown): void;
}
