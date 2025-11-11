/**
 * Clone deep.
 *
 * @param {*} value
 * @returns {*}
 */
export function cloneDeep(value) {
  // handle primitives, undefined, null, and functions (return them as is)
  if (value == null || typeof value !== 'object') {
    return value;
  }
  // handle Date objects
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  // handle Arrays by recursively cloning each item
  if (Array.isArray(value)) {
    return value.map(item => cloneDeep(item));
  }
  // handle plain objects (literals) by recursively cloning properties
  const proto = Object.getPrototypeOf(value);
  if (proto === Object.prototype || proto === null) {
    const newObj = {};
    for (const key in value) {
      // ensure we only copy own properties
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        newObj[key] = cloneDeep(value[key]);
      }
    }
    return newObj;
  }
  return value;
}
