import {Service} from '../service.js';
import {ServerResponse} from 'http';

/**
 * Data sender.
 */
export declare class DataSender extends Service {
  /**
   * Send.
   *
   * @param res
   * @param data
   */
  send(res: ServerResponse, data: unknown): void;
}
