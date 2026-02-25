import {IncomingMessage} from 'http';

/**
 * Check if a request has a request body.
 * http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.3
 *
 * @param {import('http').IncomingMessage} request
 * @returns {boolean}
 */
export function hasRequestBody(request: IncomingMessage): boolean;
