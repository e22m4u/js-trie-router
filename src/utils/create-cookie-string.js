import {Errorf} from '@e22m4u/js-format';

/**
 * Create cookie string.
 *
 * @param {object} data
 * @returns {string}
 */
export function createCookieString(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Errorf(
      'The first parameter of "createCookieString" should be ' +
        'an Object, but %v given.',
      data,
    );
  let cookies = '';
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
    const val = data[key];
    if (val == null) continue;
    cookies += `${key}=${val}; `;
  }
  return cookies.trim();
}
