import {ServerResponse} from 'http';
import {IncomingMessage} from 'http';
import {ParsedCookie} from './utils/index.js';
import {ParsedQuery} from './parsers/index.js';
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
  container: ServiceContainer;

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
   * Cookie.
   */
  cookie: ParsedCookie;

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
