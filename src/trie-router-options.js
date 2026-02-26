import {InvalidArgumentError} from '@e22m4u/js-format';

export class TrieRouterOptions {
  /**
   * Request body bytes limit.
   *
   * @type {number}
   * @private
   */
  _requestBodyBytesLimit = 512000; // 512kb

  /**
   * Getter of the request body bytes limit.
   *
   * @returns {number}
   */
  get requestBodyBytesLimit() {
    return this._requestBodyBytesLimit;
  }

  /**
   * Constructor.
   *
   * @param {import('./trie-router-options.js').TrieRouterOptionsInput} [options]
   */
  constructor(options = {}) {
    if (!options || typeof options !== 'object' || Array.isArray(options)) {
      throw new InvalidArgumentError(
        'Parameter "options" must be an Object, but %v was given.',
        options,
      );
    }
    if (options.requestBodyBytesLimit !== undefined) {
      if (
        typeof options.requestBodyBytesLimit !== 'number' ||
        options.requestBodyBytesLimit < 0
      ) {
        throw new InvalidArgumentError(
          'Option "requestBodyBytesLimit" must be a positive Number or 0, ' +
            'but %v was given.',
          options.requestBodyBytesLimit,
        );
      }
      this._requestBodyBytesLimit = options.requestBodyBytesLimit;
    }
  }
}
