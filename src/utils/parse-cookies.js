import {Errorf} from '@e22m4u/js-format';

/**
 * Parse cookies.
 *
 * @example
 * ```ts
 * parseCookies('pkg=math; equation=E%3Dmc%5E2');
 * // {pkg: 'math', equation: 'E=mc^2'}
 * ```
 *
 * @param {string} input
 * @returns {object}
 */
export function parseCookies(input) {
  if (typeof input !== 'string')
    throw new Errorf(
      'The first parameter of "parseCookies" should be a String, ' +
        'but %v was given.',
      input,
    );
  return input
    .split(';')
    .filter(v => v !== '')
    .map(v => v.split('='))
    .reduce((cookies, tuple) => {
      const key = decodeURIComponent(tuple[0]).trim();
      const value =
        tuple[1] !== undefined ? decodeURIComponent(tuple[1]).trim() : '';
      cookies[key] = value;
      return cookies;
    }, {});
}
