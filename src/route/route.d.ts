import {ValueOrPromise} from '../types.js';
import {RequestContext} from '../request-context.js';
import {RouterHookRegistry} from '../hooks/index.js';

/**
 * Http method.
 */
export declare const HttpMethod: {
  GET: 'GET';
  POST: 'POST';
  PUT: 'PUT';
  PATCH: 'PATCH';
  DELETE: 'DELETE';
};

/**
 * Type of HttpMethod.
 */
export type HttpMethod = (typeof HttpMethod)[keyof typeof HttpMethod];

/**
 * Route handler.
 */
export type RouteHandler = (ctx: RequestContext) => ValueOrPromise<unknown>;

/**
 * Route pre-handler.
 */
export type RoutePreHandler = RouteHandler;

/**
 * Route post-handler.
 */
export type RoutePostHandler<T = unknown, U = unknown> = (
  ctx: RequestContext,
  data: T,
) => ValueOrPromise<U>;

/**
 * Route meta.
 */
export interface RouteMeta {
  [key: string]: unknown;
}

/**
 * Route definition.
 */
export interface RouteDefinition {
  method: string;
  path: string;
  handler: RouteHandler;
  preHandler?: RoutePreHandler | RoutePreHandler[];
  postHandler?: RoutePostHandler | RoutePostHandler[];
  meta?: RouteMeta;
}

/**
 * Route.
 */
export declare class Route {
  /**
   * Get definition.
   */
  getDefinition(): RouteDefinition;

  /**
   * Get hook registry.
   */
  getHookRegistry(): RouterHookRegistry;

  /**
   * Method.
   */
  get method(): string;

  /**
   * Path.
   */
  get path(): string;

  /**
   * Meta.
   */
  get meta(): RouteMeta;

  /**
   * Handler.
   */
  get handler(): RouteHandler;

  /**
   * Constructor.
   *
   * @param routeDef
   */
  constructor(routeDef: RouteDefinition);

  /**
   * Handle.
   *
   * @param context
   */
  handle(context: RequestContext): ValueOrPromise<unknown>;
}
