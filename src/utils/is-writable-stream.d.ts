import {Writable} from 'stream';

/**
 * Check whether a value has an end
 * method.
 *
 * @param value
 */
export declare function isWritableStream(value: unknown): value is Writable;
