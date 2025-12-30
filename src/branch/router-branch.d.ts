import {TrieRouter} from '../trie-router.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {DebuggableService} from '../debuggable-service.js';

import {
  Route,
  RouteMeta,
  RoutePreHandler,
  RouteDefinition,
  RoutePostHandler,
} from '../route/index.js';

/**
 * Router branch definition.
 */
export type RouterBranchDefinition = {
  path: string;
  preHandler?: RoutePreHandler | RoutePreHandler[];
  postHandler?: RoutePostHandler | RoutePostHandler[];
  meta?: RouteMeta;
};

/**
 * Router branch.
 */
export declare class RouterBranch extends DebuggableService {
  /**
   * Get router.
   */
  getRouter(): TrieRouter;

  /**
   * Get parent branch.
   */
  getParentBranch(): RouterBranch | undefined;

  /**
   * Get definition.
   */
  getDefinition(): RouterBranchDefinition;

  /**
   * Constructor.
   *
   * @param container
   * @param router
   * @param branchDef
   * @param parentBranch
   */
  constructor(
    container: ServiceContainer,
    router: TrieRouter,
    branchDef: RouterBranchDefinition,
    parentBranch?: RouterBranch,
  );

  /**
   * Define route.
   *
   * @param routeDef
   */
  defineRoute(routeDef: RouteDefinition): Route;

  /**
   * Create branch.
   *
   * @param branchDef
   */
  createBranch(branchDef: RouterBranchDefinition): RouterBranch;
}
