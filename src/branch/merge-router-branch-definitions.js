import {mergeDeep, normalizePath} from '../utils/index.js';
import {validateRouterBranchDefinition} from './validate-router-branch-definition.js';

/**
 * Merge router branch definitions.
 *
 * @param {import('./router-branch.js').RouterBranchDefinition} firstDef
 * @param {import('./router-branch.js').RouterBranchDefinition} secondDef
 * @returns {import('./router-branch.js').RouterBranchDefinition}
 */
export function mergeRouterBranchDefinitions(firstDef, secondDef) {
  validateRouterBranchDefinition(firstDef);
  validateRouterBranchDefinition(secondDef);
  const mergedDef = {};
  // path
  const path = (firstDef.path || '') + '/' + (secondDef.path || '');
  mergedDef.path = normalizePath(path);
  // pre-handler
  if (firstDef.preHandler || secondDef.preHandler) {
    mergedDef.preHandler = [firstDef.preHandler, secondDef.preHandler]
      .flat()
      .filter(Boolean);
  }
  // post-handler
  if (firstDef.postHandler || secondDef.postHandler) {
    mergedDef.postHandler = [firstDef.postHandler, secondDef.postHandler]
      .flat()
      .filter(Boolean);
  }
  // meta
  if (firstDef.meta && !secondDef.meta) {
    mergedDef.meta = firstDef.meta;
  } else if (!firstDef.meta && secondDef.meta) {
    mergedDef.meta = secondDef.meta;
  } else if (firstDef.meta && secondDef.meta) {
    mergedDef.meta = mergeDeep(firstDef.meta, secondDef.meta);
  }
  return {...firstDef, ...secondDef, ...mergedDef};
}
