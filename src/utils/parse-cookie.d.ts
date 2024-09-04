/**
 * Parsed cookie.
 */
type ParsedCookie = {
  [key: string]: string | undefined;
};

/**
 * Parse cookie.
 *
 * @example
 * ```ts
 * parseCookie('pkg=math; equation=E%3Dmc%5E2');
 * // {pkg: 'math', equation: 'E=mc^2'}
 * ```
 *
 * @param input
 */
export declare function parseCookie(input: string): ParsedCookie;
