import {IncomingMessage} from 'http';
import {ParsedCookies} from '../utils/index.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Cookies parser.
 */
export declare class CookiesParser extends DebuggableService {
  /**
   * Parse.
   *
   * @param request
   */
  parse(request: IncomingMessage): ParsedCookies;
}
