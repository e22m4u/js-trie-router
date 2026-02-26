/**
 * Trie router options input.
 */
export type TrieRouterOptionsInput = {
  requestBodyBytesLimit?: number;
};

/**
 * Trie router options.
 */
export declare class TrieRouterOptions {
  /**
   * Getter of request body bytes limit.
   */
  get requestBodyBytesLimit(): number;

  /**
   * Constructor.
   *
   * @param options
   */
  constructor(options?: TrieRouterOptionsInput);
}
