import {Errorf} from '@e22m4u/js-format';

/**
 * Create cookies string.
 *
 * @param {object} data
 * @returns {string}
 */
export function createCookiesString(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data))
    throw new Errorf(
      'The first parameter of "createCookiesString" should be ' +
        'an Object, but %v was given.',
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
