import {ServerResponse} from 'http';
import {IncomingMessage} from 'http';
import {Service} from '../service.js';

/**
 * Error sender.
 */
export declare class ErrorSender extends Service {
  /**
   * Send.
   *
   * @param req
   * @param res
   * @param error
   */
  send(req: IncomingMessage, res: ServerResponse, error: Error): void;

  /**
   * Send 404.
   *
   * @param req
   * @param res
   */
  send404(req: IncomingMessage, res: ServerResponse): void;
}
