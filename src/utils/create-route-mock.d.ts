import {Route, HttpMethod} from '../route/index.js';
import type {RouteHandler} from '../route/index.js';

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
 * @param options
 */
export function createRouteMock(options?: RouteMockOptions): Route;
