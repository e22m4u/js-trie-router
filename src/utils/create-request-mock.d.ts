import {Readable} from 'stream';
import {IncomingMessage} from 'http';

/**
 * Request query object input.
 */
type RequestQueryObjectInput = {
  [name: string]: unknown;
};

/**
 * Request headers input.
 */
type RequestHeadersInput = {
  [name: string]: string | string[];
};

/**
 * Request options.
 */
type RequestOptions = {
  host?: string;
  method?: string;
  secure?: boolean;
  url?: string;
  path?: string;
  query?: string | RequestQueryObjectInput;
  cookies?: object;
  headers?: RequestHeadersInput;
  body?: unknown;
  stream?: Readable;
  encoding?: BufferEncoding;
};

/**
 * Create request mock.
 *
 * @param options
 */
export declare function createRequestMock(
  options?: RequestOptions,
): IncomingMessage;
