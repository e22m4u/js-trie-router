import {Errorf} from '@e22m4u/js-format';

/**
 * Parse cookie.
 *
 * @example
 * ```ts
 * parseCookie('pkg=math; equation=E%3Dmc%5E2');
 * // {pkg: 'math', equation: 'E=mc^2'}
 * ```
 *
 * @param {string} input
 * @returns {object}
 */
export function parseCookie(input) {
  if (typeof input !== 'string')
    throw new Errorf(
      'The first parameter of "parseCookie" should be a String, but %v given.',
      input,
    );
  return input
    .split(';')
    .filter(v => v !== '')
    .map(v => v.split('='))
    .reduce((cookies, tuple) => {
      const key = decodeURIComponent(tuple[0]).trim();
      cookies[key] = decodeURIComponent(tuple[1]).trim();
      return cookies;
    }, {});
}
