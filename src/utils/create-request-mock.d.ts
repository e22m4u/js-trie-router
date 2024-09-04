import {Readable} from 'stream';
import {IncomingMessage} from 'http';

/**
 * Request patch.
 */
type RequestPatch = {
  host?: string;
  method?: string;
  secure?: boolean;
  path?: string;
  query?: object;
  hash?: string;
  cookie?: object;
  headers?: object;
  body?: string;
  stream?: Readable;
  encoding?: BufferEncoding;
};

/**
 * Create request mock.
 *
 * @param patch
 */
export declare function createRequestMock(
  patch?: RequestPatch,
): IncomingMessage;
