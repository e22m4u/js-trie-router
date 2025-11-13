import querystring from 'querystring';
import {getRequestPathname} from '../utils/index.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Query parser.
 */
export class QueryParser extends DebuggableService {
  /**
   * Parse
   *
   * @param {import('http').IncomingMessage} request
   * @returns {object}
   */
  parse(request) {
    const debug = this.getDebuggerFor(this.parse);
    const queryStr = request.url.replace(/^[^?]*\??/, '');
    const query = queryStr ? querystring.parse(queryStr) : {};
    const queryKeys = Object.keys(query);
    if (queryKeys.length) {
      queryKeys.forEach(key => {
        debug('The query parameter %v had the value %v.', key, query[key]);
      });
    } else {
      debug(
        'The request %s %v had no query parameters.',
        request.method,
        getRequestPathname(request),
      );
    }
    return query;
  }
}
