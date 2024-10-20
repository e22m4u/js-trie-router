import {IncomingMessage} from 'http';
import {ParsedCookie} from '../utils/index.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Cookie parser.
 */
export declare class CookieParser extends DebuggableService {
  /**
   * Parse.
   *
   * @param req
   */
  parse(req: IncomingMessage): ParsedCookie;
}
