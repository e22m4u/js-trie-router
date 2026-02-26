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
   * Ignored media types.
   *
   * @type {string[]}
   */
  _ignoredMediaTypes = [];

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
    }
  }

  /**
   * Get request body bytes limit.
   *
   * @param {number} limit
   * @returns {this}
   */
  setRequestBodyBytesLimit(limit) {
    if (typeof limit !== 'number' || limit < 0) {
      throw new InvalidArgumentError(
        'Parameter "limit" must be a positive Number or 0, but %v was given.',
        limit,
      );
    }
    this._requestBodyBytesLimit = limit;
    return this;
  }

  /**
   * Get request body bytes limit.
   *
   * @returns {number}
   */
  getRequestBodyBytesLimit() {
    return this._requestBodyBytesLimit;
  }

  /**
   * Get ignored media types.
   *
   * @param {string} mediaType
   * @returns {this}
   */
  addIgnoredMediaType(mediaType) {
    if (!mediaType || typeof mediaType !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "mediaType" must be a non-empty String, but %v was given.',
        mediaType,
      );
    }
    const mediaTypeLc = mediaType.toLowerCase();
    if (!this._ignoredMediaTypes.includes(mediaTypeLc)) {
      this._ignoredMediaTypes.push(mediaTypeLc);
    }
    return this;
  }

  /**
   * Has ignored media type.
   *
   * @param {string} mediaType
   * @returns {boolean}
   */
  hasIgnoredMediaType(mediaType) {
    if (!mediaType || typeof mediaType !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "mediaType" must be a non-empty String, but %v was given.',
        mediaType,
      );
    }
    return this._ignoredMediaTypes.includes(mediaType.toLowerCase());
  }

  /**
   * Get ignored media types.
   *
   * @returns {string[]}
   */
  getIgnoredMediaTypes() {
    return this._ignoredMediaTypes.slice();
  }
}
