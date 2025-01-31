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
    const queryStr = req.url.replace(/^[^?]*\??/, '');
    const query = queryStr ? querystring.parse(queryStr) : {};
    const queryKeys = Object.keys(query);
    if (queryKeys.length) {
      queryKeys.forEach(key => {
        this.debug('The query %v has the value %v.', key, query[key]);
      });
    } else {
      this.debug(
        'The request %s %v has no query.',
        req.method,
        getRequestPathname(req),
      );
    }
    return query;
  }
}
