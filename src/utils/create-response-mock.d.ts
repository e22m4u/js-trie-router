import {ServerResponse} from 'http';

/**
 * Server response mock.
 */
export type ServerResponseMock = ServerResponse & {
  _headersSent: boolean;
  _headers: {[name: string]: string | undefined};
  getEncoding(encoding: BufferEncoding): ServerResponseMock;
  getBody(): Promise<string>;
};

/**
 * Create response mock.
 */
export declare function createResponseMock(): ServerResponseMock;
