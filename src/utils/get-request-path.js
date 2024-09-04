import {Errorf} from '@e22m4u/js-format';

/**
 * Get request path.
 *
 * @param {import('http').IncomingMessage} req
 * @returns {string}
 */
export function getRequestPath(req) {
  if (
    !req ||
    typeof req !== 'object' ||
    Array.isArray(req) ||
    typeof req.url !== 'string'
  ) {
    throw new Errorf(
      'The first argument of "getRequestPath" should be ' +
        'an instance of IncomingMessage, but %v given.',
      req,
    );
  }
  return (req.url || '/').replace(/\?.*$/, '');
}
