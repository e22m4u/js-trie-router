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
   * @param {import('http').IncomingMessage} req
   * @returns {object}
   */
  parse(req) {
    const debug = this.getDebuggerFor(this.parse);
    const queryStr = req.url.replace(/^[^?]*\??/, '');
    const query = queryStr ? querystring.parse(queryStr) : {};
    const queryKeys = Object.keys(query);
    if (queryKeys.length) {
      queryKeys.forEach(key => {
        debug('The query parameter %v had the value %v.', key, query[key]);
      });
    } else {
      debug(
        'The request %s %v had no query parameters.',
        req.method,
        getRequestPathname(req),
      );
    }
    return query;
  }
}
