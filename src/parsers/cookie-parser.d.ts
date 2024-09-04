import {IncomingMessage} from 'http';
import {Service} from '../service.js';

/**
 * Parsed cookie.
 */
export type ParsedCookie = {
  [key: string]: string | undefined;
};

/**
 * Cookie parser.
 */
export declare class CookieParser extends Service {
  /**
   * Parse.
   *
   * @param req
   */
  parse(req: IncomingMessage): ParsedCookie;
}
