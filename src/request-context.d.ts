import {ServerResponse} from 'http';
import {IncomingMessage} from 'http';
import {RouteMeta} from './route.js';
import {ParsedQuery} from './parsers/index.js';
import {ParsedCookies} from './utils/index.js';
import {ParsedHeaders} from './parsers/index.js';
import {ServiceContainer} from '@e22m4u/js-service';

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
  cont: ServiceContainer;

  /**
   * Request.
   */
  req: IncomingMessage;

  /**
   * Response.
   */
  res: ServerResponse;

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
  meta: RouteMeta;

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
  );
}
