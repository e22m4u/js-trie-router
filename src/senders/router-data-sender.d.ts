import {ServerResponse} from 'http';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Router data sender.
 */
export declare class RouterDataSender extends DebuggableService {
  /**
   * Send.
   *
   * @param response
   * @param data
   */
  send(response: ServerResponse, data: unknown): void;
}
