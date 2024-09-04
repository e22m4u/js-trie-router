import {ServerResponse} from 'http';
import {IncomingMessage} from 'http';
import {ParsedQuery} from './parsers/index.js';
import {ParsedCookie} from './parsers/index.js';
import {ParsedHeaders} from './parsers/index.js';
import {ServiceContainer} from '@e22m4u/js-service';

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
   * Headers.
   */
  headers: ParsedHeaders;

  /**
   * Cookie.
   */
  cookie: ParsedCookie;

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
