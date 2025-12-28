import {format, InvalidArgumentError} from '@e22m4u/js-format';

/**
 * Create error.
 *
 * @param {Function} errorCtor
 * @param {string} message
 * @param {*[]|undefined} args
 * @returns {object}
 */
export function createError(errorCtor, message, ...args) {
  if (typeof errorCtor !== 'function') {
    throw new InvalidArgumentError(
      'The first parameter of "createError" must be ' +
        'a constructor, but %v was given.',
      errorCtor,
    );
  }
  if (message != null && typeof message !== 'string') {
    throw new InvalidArgumentError(
      'The second parameter of "createError" must be ' +
        'a String, but %v was given.',
      message,
    );
  }
  if (message == null) {
    return new errorCtor();
  }
  const interpolatedMessage = format(message, ...args);
  return new errorCtor(interpolatedMessage);
}
