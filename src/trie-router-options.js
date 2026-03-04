import {InvalidArgumentError} from '@e22m4u/js-format';

/**
 * Trie router options.
 */
export class TrieRouterOptions {
  /**
   * Request body bytes limit.
   *
   * @type {number}
   */
  _requestBodyBytesLimit = 512 * 1024; // 512kb

  /**
   * Request body bytes limit.
   *
   * @type {number}
   */
  get requestBodyBytesLimit() {
    return this._requestBodyBytesLimit;
  }

  /**
   * Ignored media types.
   *
   * @type {string[]}
   */
  _ignoredMediaTypes = [];

  /**
   * Ignored media types.
   *
   * @type {string[]}
   */
  get ignoredMediaTypes() {
    return this._ignoredMediaTypes;
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
    // requestBodyBytesLimit
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
    // ignoredMediaTypes
    if (options.ignoredMediaTypes !== undefined) {
      if (!Array.isArray(options.ignoredMediaTypes)) {
        throw new InvalidArgumentError(
          'Option "ignoredMediaTypes" must be an Array, but %v was given.',
          options.ignoredMediaTypes,
        );
      }
      options.ignoredMediaTypes.forEach((mediaType, index) => {
        if (!mediaType || typeof mediaType !== 'string') {
          throw new InvalidArgumentError(
            'Element %d of the option "ignoredMediaTypes" must be ' +
              'a non-empty String, but %v was given.',
            index,
            mediaType,
          );
        }
        const mediaTypeLc = mediaType.toLowerCase();
        if (!this._ignoredMediaTypes.includes(mediaTypeLc)) {
          this._ignoredMediaTypes.push(mediaTypeLc);
        }
      });
      Object.freeze(this._ignoredMediaTypes);
    }
  }
}
