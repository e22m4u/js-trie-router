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
  if (!routeDef.path || typeof routeDef.path !== 'string') {
    throw new InvalidArgumentError(
      'Option "path" must be a non-empty String, but %v was given.',
      routeDef.path,
    );
  }
  if (typeof routeDef.handler !== 'function') {
    throw new InvalidArgumentError(
      'Option "handler" must be a Function, but %v was given.',
      routeDef.handler,
    );
  }
  if (routeDef.preHandler !== undefined) {
    if (Array.isArray(routeDef.preHandler)) {
      routeDef.preHandler.forEach(preHandler => {
        if (typeof preHandler !== 'function') {
          throw new InvalidArgumentError(
            'Route pre-handler must be a Function, but %v was given.',
            preHandler,
          );
        }
      });
    } else if (typeof routeDef.preHandler !== 'function') {
      throw new InvalidArgumentError(
        'Option "preHandler" must be a Function or an Array, but %v was given.',
        routeDef.preHandler,
      );
    }
  }
  if (routeDef.postHandler !== undefined) {
    if (Array.isArray(routeDef.postHandler)) {
      routeDef.postHandler.forEach(postHandler => {
        if (typeof postHandler !== 'function') {
          throw new InvalidArgumentError(
            'Route post-handler must be a Function, but %v was given.',
            postHandler,
          );
        }
      });
    } else if (typeof routeDef.postHandler !== 'function') {
      throw new InvalidArgumentError(
        'Option "postHandler" must be a Function or an Array, but %v was given.',
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
        'Option "meta" must be an Object, but %v was given.',
        routeDef.meta,
      );
    }
  }
}
