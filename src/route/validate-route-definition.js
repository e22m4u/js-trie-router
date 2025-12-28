import {InvalidArgumentError} from '@e22m4u/js-format';

/**
 * Validate route definition.
 *
 * @param {import('./route.js').RouteDefinition} routeDef
 */
export function validateRouteDefinition(routeDef) {
  if (!routeDef || typeof routeDef !== 'object' || Array.isArray(routeDef)) {
    throw new InvalidArgumentError(
      'Route definition must be an Object, but %v was given.',
      routeDef,
    );
  }
  if (!routeDef.method || typeof routeDef.method !== 'string') {
    throw new InvalidArgumentError(
      'Option "method" must be a non-empty String, but %v was given.',
      routeDef.method,
    );
  }
  if (typeof routeDef.path !== 'string') {
    throw new InvalidArgumentError(
      'Option "path" must be a String, but %v was given.',
      routeDef.path,
    );
  }
  if (typeof routeDef.handler !== 'function') {
    throw new InvalidArgumentError(
      'Option "handler" must be a Function, but %v was given.',
      routeDef.handler,
    );
  }
  if (routeDef.meta !== undefined) {
    if (
      !routeDef.meta ||
      typeof routeDef.meta !== 'object' ||
      Array.isArray(routeDef.meta)
    ) {
      throw new InvalidArgumentError(
        'Option "meta" must be an Object, but %v was given.',
        routeDef.meta,
      );
    }
  }
}
