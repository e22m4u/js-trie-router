import {IncomingMessage} from 'http';
import {ValueOrPromise} from '../types.js';
import {ParsedQuery} from './query-parser.js';
import {ParsedCookies} from '../utils/index.js';
import {DebuggableService} from '../debuggable-service.js';

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
  cookies: ParsedCookies;
  body: unknown;
  headers: ParsedHeaders;
};

/**
 * Request parser.
 */
export declare class RequestParser extends DebuggableService {
  /**
   * Parse.
   *
   * @param request
   */
  parse(request: IncomingMessage): ValueOrPromise<ParsedRequestData>;
}
