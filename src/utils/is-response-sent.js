import {Errorf} from '@e22m4u/js-format';

/**
 * Is response sent.
 *
 * @param {import('http').ServerResponse} res
 * @returns {boolean}
 */
export function isResponseSent(res) {
  if (
    !res ||
    typeof res !== 'object' ||
    Array.isArray(res) ||
    typeof res.headersSent !== 'boolean'
  ) {
    throw new Errorf(
      'The first argument of "isResponseSent" should be ' +
        'an instance of ServerResponse, but %v was given.',
      res,
    );
  }
  return res.headersSent;
}
