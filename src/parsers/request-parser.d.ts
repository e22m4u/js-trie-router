import {IncomingMessage} from 'http';
import {ValueOrPromise} from '../types.js';
import {ParsedQuery} from './query-parser.js';
import {ParsedCookie} from '../utils/index.js';
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
  cookie: ParsedCookie;
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
   * @param req
   */
  parse(req: IncomingMessage): ValueOrPromise<ParsedRequestData>;
}
