import {ValueOrPromise} from './types.js';
import {HookRegistry} from './hooks/index.js';
import {RequestContext} from './request-context.js';

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
 * Route definition.
 */
export type RouteDefinition = {
  method: string;
  path: string;
  handler: RouteHandler;
  preHandler?: RoutePreHandler | RoutePreHandler[];
  postHandler?: RoutePostHandler | RoutePostHandler[];
};

/**
 * Route.
 */
export declare class Route {
  /**
   * Method.
   */
  get method(): string;

  /**
   * Path.
   */
  get path(): string;

  /**
   * Handler.
   */
  get handler(): RouteHandler;

  /**
   * Hook registry.
   */
  get hookRegistry(): HookRegistry;

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
