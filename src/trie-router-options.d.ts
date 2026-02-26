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
   * Get request body bytes limit.
   *
   * @param limit
   */
  setRequestBodyBytesLimit(limit: number): this;

  /**
   * Get request body bytes limit.
   */
  getRequestBodyBytesLimit(): number;

  /**
   * Get ignored media types.
   *
   * @param mediaType
   */
  addIgnoredMediaType(mediaType: string): this;

  /**
   * Has ignored media type.
   *
   * @param mediaType
   */
  hasIgnoredMediaType(mediaType: string): boolean;

  /**
   * Get ignored media types.
   */
  getIgnoredMediaTypes(): string[];
}
