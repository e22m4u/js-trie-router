import {Route, RouteMeta} from './route.js';
import {ParsedCookies} from './utils/index.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {IncomingMessage, ServerResponse} from 'http';
import {ParsedQuery, ParsedHeaders} from './parsers/index.js';

/**
 * Parsed params.
 */
export type ParsedParams = {
  [key: string]: string | undefined;
};

/**
 * Request context.
 */
export declare class RequestContext {
  /**
   * Container.
   */
  get container(): ServiceContainer;

  /**
   * Request.
   */
  get request(): IncomingMessage;

  /**
   * Response.
   */
  get response(): ServerResponse;

  /**
   * Route.
   */
  get route(): Route;

  /**
   * Query.
   */
  query: ParsedQuery;

  /**
   * Params.
   */
  params: ParsedParams;

  /**
   * Headers.
   */
  headers: ParsedHeaders;

  /**
   * Cookies.
   */
  cookies: ParsedCookies;

  /**
   * Body.
   */
  body: unknown;

  /**
   * Route meta.
   */
  get meta(): RouteMeta;

  /**
   * Method.
   */
  get method(): string;

  /**
   * Path.
   */
  get path(): string;

  /**
   * Pathname.
   */
  get pathname(): string;

  /**
   * Constructor.
   *
   * @param container
   * @param request
   * @param response
   */
  constructor(
    container: ServiceContainer,
    request: IncomingMessage,
    response: ServerResponse,
    route: Route,
  );
}
