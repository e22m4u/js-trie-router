import {Route, HttpMethod} from '../route.js';
import type {RouteHandler} from '../route.js';

/**
 * Route mock options.
 */
type RouteMockOptions = {
  method?: HttpMethod;
  path?: string;
  handler?: RouteHandler;
};

/**
 * Create route mock.
 *
 * @param {Route} options
 * @returns {Route}
 */
export function createRouteMock(options: RouteMockOptions): Route;
