import {Service} from '../service.js';
import {parseCookie} from '../utils/index.js';
import {getRequestPath} from '../utils/index.js';

/**
 * Cookie parser.
 */
export class CookieParser extends Service {
  /**
   * Parse
   *
   * @param {import('http').IncomingMessage} req
   * @returns {object}
   */
  parse(req) {
    const cookieString = req.headers['cookie'] || '';
    const cookie = parseCookie(cookieString);
    const cookieKeys = Object.keys(cookie);
    if (cookieKeys.length) {
      cookieKeys.forEach(key => {
        this.debug('The cookie %v has the value %v.', key, cookie[key]);
      });
    } else {
      this.debug(
        'The request %s %v has no cookie.',
        req.method,
        getRequestPath(req),
      );
    }
    return cookie;
  }
}
