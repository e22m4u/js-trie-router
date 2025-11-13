import {Errorf} from '@e22m4u/js-format';

/**
 * Is response sent.
 *
 * @param {import('http').ServerResponse} response
 * @returns {boolean}
 */
export function isResponseSent(response) {
  if (
    !response ||
    typeof response !== 'object' ||
    Array.isArray(response) ||
    typeof response.headersSent !== 'boolean'
  ) {
    throw new Errorf(
      'The first argument of "isResponseSent" should be ' +
        'an instance of ServerResponse, but %v was given.',
      response,
    );
  }
  return response.headersSent;
}
