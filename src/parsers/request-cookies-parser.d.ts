import {IncomingMessage} from 'http';
import {ParsedCookies} from '../utils/index.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Request cookies parser.
 */
export declare class RequestCookiesParser extends DebuggableService {
  /**
   * Parse.
   *
   * @param request
   */
  parse(request: IncomingMessage): ParsedCookies;
}
