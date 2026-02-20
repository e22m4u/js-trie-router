import {InvalidArgumentError} from '@e22m4u/js-format';

/**
 * Get request pathname.
 *
 * @param {import('http').IncomingMessage} request
 * @returns {string}
 */
export function getRequestPathname(request) {
  if (
    !request ||
    typeof request !== 'object' ||
    Array.isArray(request) ||
    typeof request.url !== 'string'
  ) {
    throw new InvalidArgumentError(
      'The parameter "request" must be an instance of IncomingMessage, ' +
        'but %v was given.',
      request,
    );
  }
  return (request.url || '/').replace(/\?.*$/, '');
}
