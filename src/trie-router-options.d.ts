/**
 * Trie router options input.
 */
export type TrieRouterOptionsInput = {
  requestBodyBytesLimit?: number;
  ignoredMediaTypes?: string[];
};

/**
 * Trie router options.
 */
export declare class TrieRouterOptions {
  /**
   * Request body bytes limit.
   */
  get requestBodyBytesLimit(): number;

  /**
   * Request body bytes limit.
   */
  get ignoredMediaTypes(): string[];

  /**
   * Constructor.
   *
   * @param options
   */
  constructor(options?: TrieRouterOptionsInput);
}
