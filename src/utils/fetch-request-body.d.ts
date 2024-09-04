import {IncomingMessage} from 'http';

/**
 * Buffer encoding list.
 */
export type BUFFER_ENCODING_LIST = BufferEncoding[];

/**
 * Fetch request body.
 *
 * @param req
 * @param bodyBytesLimit
 */
export declare function fetchRequestBody(
  req: IncomingMessage,
  bodyBytesLimit?: number,
): Promise<string>;
