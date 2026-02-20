import {Readable} from 'stream';
import {IncomingMessage} from 'http';

/**
 * Request options.
 */
type RequestOptions = {
  host?: string;
  method?: string;
  secure?: boolean;
  path?: string;
  query?: string | object;
  cookies?: object;
  headers?: object;
  body?: string;
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
