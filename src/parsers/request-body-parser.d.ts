import {IncomingMessage} from 'http';
import {ValueOrPromise} from '../types.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Body parser function.
 */
export type BodyParserFunction = <T = unknown>(input: string) => T;

/**
 * Request body parser.
 */
export declare class RequestBodyParser extends DebuggableService {
  /**
   * Define parser.
   *
   * @param mediaType
   * @param parserFn
   */
  defineParser(mediaType: string, parserFn: BodyParserFunction): this;

  /**
   * Has parser.
   *
   * @param mediaType
   */
  hasParser(mediaType: string): boolean;

  /**
   * Get parser.
   *
   * @param mediaType
   */
  getParser(mediaType: string): BodyParserFunction;

  /**
   * Remove parser.
   *
   * @param mediaType
   */
  removeParser(mediaType: string): this;

  /**
   * Parse.
   *
   * @param request
   */
  parse<T = unknown>(request: IncomingMessage): ValueOrPromise<T>;
}
