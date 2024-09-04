/**
 * Debugger.
 */
export type Debugger = (message: string, ...args: unknown[]) => void;

/**
 * Create debugger.
 *
 * @param name
 */
export declare function createDebugger(name: string): Debugger;
