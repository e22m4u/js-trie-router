import {Readable} from 'stream';
import {IncomingMessage} from 'http';

/**
 * Request options.
 */
type RequestOptions = {
  host?: string;
  method?: string;
  secure?: boolean;
  url?: string;
  headers?: {[name: string]: string | string[]};
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
