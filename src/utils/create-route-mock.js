import {Route, HttpMethod} from '../route.js';

/**
 * @typedef {object} RouteMockOptions
 * @property {HttpMethod} method
 * @property {string} path
 * @property {import('../route.js').RouteHandler} handler
 */

/**
 * Create route mock.
 *
 * @param {Route} options
 * @returns {Route}
 */
export function createRouteMock(options = {}) {
  return new Route({
    method: options.method || HttpMethod.GET,
    path: options.path || '/',
    handler: options.handler || (() => 'OK'),
  });
}
