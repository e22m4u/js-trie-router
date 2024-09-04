import {Service} from './service.js';

/**
 * Router options.
 */
export declare class RouterOptions extends Service {
  /**
   * Request body bytes limit.
   */
  get requestBodyBytesLimit(): number;

  /**
   * Set request body bytes limit.
   *
   * @param input
   */
  setRequestBodyBytesLimit(input: number): this;
}
