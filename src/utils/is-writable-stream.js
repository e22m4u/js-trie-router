/**
 * Check whether a value has an end
 * method.
 *
 * @param {*} value
 * @returns {boolean}
 */
export function isWritableStream(value) {
  if (!value || typeof value !== 'object') return false;
  return typeof value.end === 'function';
}
