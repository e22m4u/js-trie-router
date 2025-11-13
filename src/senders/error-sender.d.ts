import {ServerResponse} from 'http';
import {IncomingMessage} from 'http';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Exposed error properties.
 */
export const EXPOSED_ERROR_PROPERTIES: ['code', 'details'];

/**
 * Error sender.
 */
export declare class ErrorSender extends DebuggableService {
  /**
   * Send.
   *
   * @param request
   * @param response
   * @param error
   */
  send(request: IncomingMessage, response: ServerResponse, error: Error): void;

  /**
   * Send 404.
   *
   * @param request
   * @param response
   */
  send404(request: IncomingMessage, response: ServerResponse): void;
}
