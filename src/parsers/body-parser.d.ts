import {IncomingMessage} from 'http';
import {ValueOrPromise} from '../types.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Method names to be parsed.
 */
export declare const METHODS_WITH_BODY: string[];

/**
 * Body parser function.
 */
export type BodyParserFunction = <T = unknown>(input: string) => T;

/**
 * Body parser.
 */
export declare class BodyParser extends DebuggableService {
  /**
   * Define parser.
   *
   * @param mediaType
   * @param parser
   */
  defineParser(mediaType: string, parser: BodyParserFunction): this;

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
