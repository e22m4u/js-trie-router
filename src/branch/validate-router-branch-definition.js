import {InvalidArgumentError} from '@e22m4u/js-format';

/**
 * Validate router branch definition.
 *
 * @param {import('./router-branch.js').RouterBranchDefinition} branchDef
 */
export function validateRouterBranchDefinition(branchDef) {
  if (!branchDef || typeof branchDef !== 'object' || Array.isArray(branchDef)) {
    throw new InvalidArgumentError(
      'Branch definition must be an Object, but %v was given.',
      branchDef,
    );
  }
  if (branchDef.method !== undefined) {
    throw new InvalidArgumentError(
      'Option "method" is not supported for the router branch, ' +
        'but %v was given.',
      branchDef.method,
    );
  }
  if (branchDef.handler !== undefined) {
    throw new InvalidArgumentError(
      'Option "handler" is not supported for the router branch, ' +
        'but %v was given.',
      branchDef.handler,
    );
  }
  if (typeof branchDef.path !== 'string') {
    throw new InvalidArgumentError(
      'Option "path" must be a String, but %v was given.',
      branchDef.path,
    );
  }
  if (!branchDef.path.startsWith('/')) {
    throw new InvalidArgumentError(
      'Option "path" must start with "/", but %v was given.',
      branchDef.path,
    );
  }
  if (branchDef.preHandler !== undefined) {
    if (Array.isArray(branchDef.preHandler)) {
      branchDef.preHandler.forEach(preHandler => {
        if (typeof preHandler !== 'function') {
          throw new InvalidArgumentError(
            'Route pre-handler must be a Function, but %v was given.',
            preHandler,
          );
        }
      });
    } else if (typeof branchDef.preHandler !== 'function') {
      throw new InvalidArgumentError(
        'Option "preHandler" must be a Function or an Array, but %v was given.',
        branchDef.preHandler,
      );
    }
  }
  if (branchDef.postHandler !== undefined) {
    if (Array.isArray(branchDef.postHandler)) {
      branchDef.postHandler.forEach(postHandler => {
        if (typeof postHandler !== 'function') {
          throw new InvalidArgumentError(
            'Route post-handler must be a Function, but %v was given.',
            postHandler,
          );
        }
      });
    } else if (typeof branchDef.postHandler !== 'function') {
      throw new InvalidArgumentError(
        'Option "postHandler" must be a Function or an Array, but %v was given.',
        branchDef.postHandler,
      );
    }
  }
  if (branchDef.meta !== undefined) {
    if (
      !branchDef.meta ||
      typeof branchDef.meta !== 'object' ||
      Array.isArray(branchDef.meta)
    ) {
      throw new InvalidArgumentError(
        'Option "meta" must be an Object, but %v was given.',
        branchDef.meta,
      );
    }
  }
}
