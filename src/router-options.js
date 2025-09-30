import {Errorf} from '@e22m4u/js-format';
import {DebuggableService} from './debuggable-service.js';

/**
 * Router options.
 */
export class RouterOptions extends DebuggableService {
  /**
   * Request body bytes limit.
   *
   * @type {number}
   * @private
   */
  _requestBodyBytesLimit = 512000; // 512kb

  /**
   * Getter of request body bytes limit.
   *
   * @returns {number}
   */
  get requestBodyBytesLimit() {
    return this._requestBodyBytesLimit;
  }

  /**
   * Set request body bytes limit.
   *
   * @param {number} input
   * @returns {RouterOptions}
   */
  setRequestBodyBytesLimit(input) {
    if (typeof input !== 'number' || input < 0)
      throw new Errorf(
        'The option "requestBodyBytesLimit" must be ' +
          'a positive Number or 0, but %v was given.',
        input,
      );
    this._requestBodyBytesLimit = input;
    return this;
  }
}
