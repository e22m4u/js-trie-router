import {Route} from './route.js';
import {Service} from './service.js';
import {IncomingMessage} from 'http';
import {RouteDefinition} from './route.js';
import {ServiceContainer} from '@e22m4u/js-service';

/**
 * Resolved route.
 */
export type ResolvedRoute = {
  route: Route;
  params: {[key: string]: string | undefined};
};

/**
 * Route registry.
 */
export declare class RouteRegistry extends Service {
  /**
   * Constructor.
   *
   * @param container
   */
  constructor(container: ServiceContainer);

  /**
   * Define route.
   *
   * @param routeDef
   */
  defineRoute(routeDef: RouteDefinition): Route;

  /**
   * Match route by request.
   *
   * @param req
   */
  matchRouteByRequest(req: IncomingMessage): ResolvedRoute | undefined;
}
