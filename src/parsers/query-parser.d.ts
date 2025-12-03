import {IncomingMessage} from 'http';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Parsed query.
 */
export type ParsedQuery = {
  [key: string]: string | undefined;
};

/**
 * Query parser.
 */
export declare class QueryParser extends DebuggableService {
  /**
   * Parse.
   *
   * @param request
   */
  parse(request: IncomingMessage): ParsedQuery;
}
