/**
 * A callable type with the "new" operator
 * allows class and constructor.
 */
export interface Constructor<T = unknown> {
  new (...args: any[]): T;
}

/**
 * A function type without class and constructor.
 */
export type Callable<T = unknown> = (...args: any[]) => T;

/**
 * Representing a value or promise. This type is used
 * to represent results of synchronous/asynchronous
 * resolution of values.
 */
export type ValueOrPromise<T> = T | PromiseLike<T>;
