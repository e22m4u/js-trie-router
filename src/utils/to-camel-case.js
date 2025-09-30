import {Errorf} from '@e22m4u/js-format';

/**
 * To camel case.
 *
 * @param {string} input
 * @returns {string}
 */
export function toCamelCase(input) {
  if (typeof input !== 'string')
    throw new Errorf(
      'The first argument of "toCamelCase" ' +
        'should be a String, but %v was given.',
      input,
    );
  return input
    .replace(/(^\w|[A-Z]|\b\w)/g, c => c.toUpperCase())
    .replace(/\W+/g, '')
    .replace(/(^\w)/g, c => c.toLowerCase());
}
