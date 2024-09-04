import {Errorf} from '@e22m4u/js-format';

/**
 * Get request pathname.
 *
 * @param {import('http').IncomingMessage} req
 * @returns {string}
 */
export function getRequestPathname(req) {
  if (
    !req ||
    typeof req !== 'object' ||
    Array.isArray(req) ||
    typeof req.url !== 'string'
  ) {
    throw new Errorf(
      'The first argument of "getRequestPathname" should be ' +
        'an instance of IncomingMessage, but %v given.',
      req,
    );
  }
  return (req.url || '/').replace(/\?.*$/, '');
}
