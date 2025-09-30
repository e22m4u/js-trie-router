import {parseCookies} from '../utils/index.js';
import {getRequestPathname} from '../utils/index.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Cookies parser.
 */
export class CookiesParser extends DebuggableService {
  /**
   * Parse
   *
   * @param {import('http').IncomingMessage} req
   * @returns {object}
   */
  parse(req) {
    const debug = this.getDebuggerFor(this.parse);
    const cookiesString = req.headers['cookie'] || '';
    const cookies = parseCookies(cookiesString);
    const cookiesKeys = Object.keys(cookies);
    if (cookiesKeys.length) {
      cookiesKeys.forEach(key => {
        debug('The cookie %v had the value %v.', key, cookies[key]);
      });
    } else {
      debug(
        'The request %s %v had no cookies.',
        req.method,
        getRequestPathname(req),
      );
    }
    return cookies;
  }
}
