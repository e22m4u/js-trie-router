import {IncomingMessage} from 'http';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Parsed query.
 */
export type ParsedQuery = {
  [key: string]: any;
};

/**
 * Query parser.
 */
export declare class QueryParser extends DebuggableService {
  /**
   * Parse.
   *
   * @param req
   */
  parse(req: IncomingMessage): ParsedQuery;
}
