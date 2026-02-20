import {InvalidArgumentError} from '@e22m4u/js-format';

/**
 * Validate route definition.
 *
 * @param {import('./route.js').RouteDefinition} routeDef
 */
export function validateRouteDefinition(routeDef) {
  if (!routeDef || typeof routeDef !== 'object' || Array.isArray(routeDef)) {
    throw new InvalidArgumentError(
      'The route definition must be an Object, but %v was given.',
      routeDef,
    );
  }
  if (!routeDef.method || typeof routeDef.method !== 'string') {
    throw new InvalidArgumentError(
      'The option "method" must be a non-empty String, but %v was given.',
      routeDef.method,
    );
  }
  if (typeof routeDef.path !== 'string') {
    throw new InvalidArgumentError(
      'The option "path" must be a String, but %v was given.',
      routeDef.path,
    );
  }
  if (!routeDef.path.startsWith('/')) {
    throw new InvalidArgumentError(
      'The option "path" must start with "/", but %v was given.',
      routeDef.path,
    );
  }
  if (typeof routeDef.handler !== 'function') {
    throw new InvalidArgumentError(
      'The option "handler" must be a Function, but %v was given.',
      routeDef.handler,
    );
  }
  if (routeDef.preHandler !== undefined) {
    if (Array.isArray(routeDef.preHandler)) {
      routeDef.preHandler.forEach(preHandler => {
        if (typeof preHandler !== 'function') {
          throw new InvalidArgumentError(
            'The hook "preHandler" must be a Function, but %v was given.',
            preHandler,
          );
        }
      });
    } else if (typeof routeDef.preHandler !== 'function') {
      throw new InvalidArgumentError(
        'The option "preHandler" must be a Function or an Array, ' +
          'but %v was given.',
        routeDef.preHandler,
      );
    }
  }
  if (routeDef.postHandler !== undefined) {
    if (Array.isArray(routeDef.postHandler)) {
      routeDef.postHandler.forEach(postHandler => {
        if (typeof postHandler !== 'function') {
          throw new InvalidArgumentError(
            'The hook "postHandler" must be a Function, but %v was given.',
            postHandler,
          );
        }
      });
    } else if (typeof routeDef.postHandler !== 'function') {
      throw new InvalidArgumentError(
        'The option "postHandler" must be a Function or an Array, ' +
          'but %v was given.',
        routeDef.postHandler,
      );
    }
  }
  if (routeDef.meta !== undefined) {
    if (
      !routeDef.meta ||
      typeof routeDef.meta !== 'object' ||
      Array.isArray(routeDef.meta)
    ) {
      throw new InvalidArgumentError(
        'The option "meta" must be an Object, but %v was given.',
        routeDef.meta,
      );
    }
  }
}
