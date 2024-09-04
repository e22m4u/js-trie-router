import {IncomingMessage} from 'http';
import {Service} from '../service.js';
import {ValueOrPromise} from '../types.js';
import {ParsedQuery} from './query-parser.js';
import {ParsedCookie} from './cookie-parser.js';

/**
 * Parsed headers.
 */
export type ParsedHeaders = {
  [key: string]: string | undefined;
};

/**
 * Parsed request.
 */
type ParsedRequestData = {
  query: ParsedQuery;
  cookie: ParsedCookie;
  body: unknown;
  headers: ParsedHeaders;
};

/**
 * Request parser.
 */
export declare class RequestParser extends Service {
  /**
   * Parse.
   *
   * @param req
   */
  parse(req: IncomingMessage): ValueOrPromise<ParsedRequestData>;
}
