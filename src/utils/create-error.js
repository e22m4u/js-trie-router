import {format} from '@e22m4u/js-format';
import {Errorf} from '@e22m4u/js-format';

/**
 * Create error.
 *
 * @param {Function} errorCtor
 * @param {string} message
 * @param {*[]|undefined} args
 * @returns {object}
 */
export function createError(errorCtor, message, ...args) {
  if (typeof errorCtor !== 'function')
    throw new Errorf(
      'The first argument of "createError" should be ' +
        'a constructor, but %v given.',
      errorCtor,
    );
  if (message != null && typeof message !== 'string')
    throw new Errorf(
      'The second argument of "createError" should be ' +
        'a String, but %v given.',
      message,
    );
  if (message == null) return new errorCtor();
  const interpolatedMessage = format(message, ...args);
  return new errorCtor(interpolatedMessage);
}
