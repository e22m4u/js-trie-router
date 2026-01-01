import {DebuggableService} from '../debuggable-service.js';
import {parseCookieString, getRequestPathname} from '../utils/index.js';

/**
 * Cookies parser.
 */
export class CookiesParser extends DebuggableService {
  /**
   * Parse
   *
   * @param {import('http').IncomingMessage} request
   * @returns {object}
   */
  parse(request) {
    const debug = this.getDebuggerFor(this.parse);
    const cookiesString = request.headers['cookie'] || '';
    const cookies = parseCookieString(cookiesString);
    const cookiesKeys = Object.keys(cookies);
    if (cookiesKeys.length) {
      cookiesKeys.forEach(key => {
        debug('Found a cookie %v with a value %v.', key, cookies[key]);
      });
    } else {
      debug(
        'Request %s %v had no cookies.',
        request.method,
        getRequestPathname(request),
      );
    }
    return cookies;
  }
}
