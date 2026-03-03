import {Readable} from 'stream';
import {IncomingMessage} from 'http';

/**
 * Request query input.
 */
type RequestQueryInput = {
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
  query?: RequestQueryInput;
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
