import {Route, HttpMethod, ROOT_PATH} from '../route/index.js';

/**
 * @typedef {object} RouteMockOptions
 * @property {string|undefined} method
 * @property {string|undefined} path
 * @property {Function|undefined} handler
 */

/**
 * Create route mock.
 *
 * @param {RouteMockOptions|undefined} options
 * @returns {Route}
 */
export function createRouteMock(options = {}) {
  return new Route({
    method: options.method || HttpMethod.GET,
    path: options.path || ROOT_PATH,
    handler: options.handler || (() => 'OK'),
  });
}
