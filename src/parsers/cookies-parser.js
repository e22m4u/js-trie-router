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
   * @param {import('http').IncomingMessage} request
   * @returns {object}
   */
  parse(request) {
    const debug = this.getDebuggerFor(this.parse);
    const cookiesString = request.headers['cookie'] || '';
    const cookies = parseCookies(cookiesString);
    const cookiesKeys = Object.keys(cookies);
    if (cookiesKeys.length) {
      cookiesKeys.forEach(key => {
        debug('The cookie %v had the value %v.', key, cookies[key]);
      });
    } else {
      debug(
        'The request %s %v had no cookies.',
        request.method,
        getRequestPathname(request),
      );
    }
    return cookies;
  }
}
