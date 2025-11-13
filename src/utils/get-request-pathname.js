import {Errorf} from '@e22m4u/js-format';

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
    throw new Errorf(
      'The first argument of "getRequestPathname" should be ' +
        'an instance of IncomingMessage, but %v was given.',
      request,
    );
  }
  return (request.url || '/').replace(/\?.*$/, '');
}
