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
   * @param {import('http').IncomingMessage} request
   * @param {import('http').ServerResponse} response
   * @param {Error} error
   * @returns {undefined}
   */
  send(request, response, error) {
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
      url: request.url,
      method: request.method,
      headers: request.headers,
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
    response.statusCode = statusCode;
    response.setHeader('content-type', 'application/json; charset=utf-8');
    response.end(JSON.stringify(body, null, 2), 'utf-8');
    debug(
      'The %s error was sent for the request %s %v.',
      statusCode,
      request.method,
      getRequestPathname(request),
    );
  }

  /**
   * Send 404.
   *
   * @param {import('http').IncomingMessage} request
   * @param {import('http').ServerResponse} response
   * @returns {undefined}
   */
  send404(request, response) {
    const debug = this.getDebuggerFor(this.send404);
    response.statusCode = 404;
    response.setHeader('content-type', 'text/plain; charset=utf-8');
    response.end('404 Not Found', 'utf-8');
    debug(
      'The 404 error was sent for the request %s %v.',
      request.method,
      getRequestPathname(request),
    );
  }
}
