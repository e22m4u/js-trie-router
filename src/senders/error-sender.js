import {inspect} from 'util';
import getStatusMessage from 'statuses';
import {getRequestPathname} from '../utils/index.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Exposed error properties.
 *
 * @type {string[]}
 */
export const EXPOSED_ERROR_PROPERTIES = ['code', 'details'];

/**
 * Error sender.
 */
export class ErrorSender extends DebuggableService {
  /**
   * Handle.
   *
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   * @param {Error} error
   * @returns {undefined}
   */
  send(req, res, error) {
    const debug = this.getDebuggerFor(this.send);
    let safeError = {};
    if (error) {
      if (typeof error === 'object') {
        safeError = error;
      } else {
        safeError = {message: String(error)};
      }
    }
    const statusCode = error.statusCode || error.status || 500;
    const body = {error: {}};
    if (safeError.message && typeof safeError.message === 'string') {
      body.error.message = safeError.message;
    } else {
      body.error.message = getStatusMessage(statusCode);
    }
    EXPOSED_ERROR_PROPERTIES.forEach(name => {
      if (name in safeError) body.error[name] = safeError[name];
    });
    const requestData = {
      url: req.url,
      method: req.method,
      headers: req.headers,
    };
    const inspectOptions = {
      showHidden: false,
      depth: null,
      colors: true,
      compact: false,
    };
    console.warn(inspect(requestData, inspectOptions));
    console.warn(inspect(body, inspectOptions));
    if (error.stack) {
      console.log(error.stack);
    } else {
      console.error(error);
    }
    res.statusCode = statusCode;
    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(body, null, 2), 'utf-8');
    debug(
      'The %s error was sent for the request %s %v.',
      statusCode,
      req.method,
      getRequestPathname(req),
    );
  }

  /**
   * Send 404.
   *
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   * @returns {undefined}
   */
  send404(req, res) {
    const debug = this.getDebuggerFor(this.send404);
    res.statusCode = 404;
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.end('404 Not Found', 'utf-8');
    debug(
      'The 404 error was sent for the request %s %v.',
      req.method,
      getRequestPathname(req),
    );
  }
}
