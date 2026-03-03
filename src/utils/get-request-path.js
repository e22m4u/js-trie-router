import {InvalidArgumentError} from '@e22m4u/js-format';

/**
 * Host RegExp.
 */
const HOST_RE = /^https?:\/\/[^/]+/;

/**
 * Get request path.
 *
 * @param {import('http').IncomingHttpHeaders} request
 * @returns {string}
 */
export function getRequestPath(request) {
  if (
    !request ||
    typeof request !== 'object' ||
    Array.isArray(request) ||
    typeof request.url !== 'string'
  ) {
    throw new InvalidArgumentError(
      'Parameter "request" must be an instance of IncomingMessage, ' +
        'but %v was given.',
      request,
    );
  }
  return (request.url || '/').replace(HOST_RE, '') || '/';
}
