import {IncomingMessage} from 'http';
import {Service} from '../service.js';
import {ValueOrPromise} from '../types.js';

/**
 * Method names to be parsed.
 */
export type METHODS_WITH_BODY = string[];

/**
 * Unparsable media types.
 */
export type UNPARSABLE_MEDIA_TYPES = string[];

/**
 * Body parser function.
 */
export type BodyParserFunction = <T = unknown>(input: string) => T;

/**
 * Body parser.
 */
export declare class BodyParser extends Service {
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
   * Delete parser.
   *
   * @param mediaType
   */
  deleteParser(mediaType: string): this;

  /**
   * Parse.
   *
   * @param req
   */
  parse<T = unknown>(req: IncomingMessage): ValueOrPromise<T>;
}
