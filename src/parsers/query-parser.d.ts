import {IncomingMessage} from 'http';
import {Service} from '../service.js';

/**
 * Parsed query.
 */
export type ParsedQuery = {
  [key: string]: string | undefined;
};

/**
 * Query parser.
 */
export declare class QueryParser extends Service {
  /**
   * Parse.
   *
   * @param req
   */
  parse(req: IncomingMessage): ParsedQuery;
}
