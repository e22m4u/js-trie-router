import DebugFactory from 'debug';
import {Errorf, format} from '@e22m4u/js-format';

/**
 * Create debugger.
 *
 * @param {string} name
 * @returns {Function}
 */
export function createDebugger(name) {
  if (typeof name !== 'string')
    throw new Errorf(
      'The first argument of "createDebugger" should be ' +
        'a String, but %v was given.',
      name,
    );
  const debug = DebugFactory(`jsTrieRouter:${name}`);
  return function (message, ...args) {
    const interpolatedMessage = format(message, ...args);
    return debug(interpolatedMessage);
  };
}
