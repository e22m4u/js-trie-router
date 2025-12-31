import {TrieRouter} from '../trie-router.js';
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
export interface RouterBranchDefinition {
  path: string;
  preHandler?: RoutePreHandler | RoutePreHandler[];
  postHandler?: RoutePostHandler | RoutePostHandler[];
  meta?: RouteMeta;
}

/**
 * Router branch.
 */
export declare class RouterBranch extends DebuggableService {
  /**
   * Get router.
   */
  getRouter(): TrieRouter;

  /**
   * Get definition.
   */
  getDefinition(): RouterBranchDefinition;

  /**
   * Has parent branch.
   */
  hasParentBranch(): boolean;

  /**
   * Get parent branch.
   */
  getParentBranch(): RouterBranch;

  /**
   * Constructor.
   *
   * @param router
   * @param branchDef
   * @param parentBranch
   */
  constructor(
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
