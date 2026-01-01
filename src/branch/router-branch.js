import {Route} from '../route/index.js';
import {cloneDeep} from '../utils/index.js';
import {TrieRouter} from '../trie-router.js';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {normalizePath} from '../utils/normalize-path.js';
import {DebuggableService} from '../debuggable-service.js';
import {validateRouteDefinition} from '../route/validate-route-definition.js';
import {mergeRouterBranchDefinitions} from './merge-router-branch-definitions.js';
import {validateRouterBranchDefinition} from './validate-router-branch-definition.js';

/**
 * @typedef {import('./request-context.js').RequestContext} RequestContext
 * @typedef {import('../route/index.js').RoutePreHandler} RoutePreHandler
 * @typedef {import('../route/index.js').RoutePostHandler} RoutePostHandler
 * @typedef {{
 *   path: string,
 *   preHandler?: RoutePreHandler|(RoutePreHandler[]),
 *   postHandler?: RoutePostHandler|(RoutePostHandler[]),
 *   meta?: object,
 * }} RouterBranchDefinition
 */

/**
 * Router branch.
 */
export class RouterBranch extends DebuggableService {
  /**
   * Router.
   *
   * @type {TrieRouter}
   */
  _router;

  /**
   * Get router.
   *
   * @type {TrieRouter}
   */
  getRouter() {
    return this._router;
  }

  /**
   * Branch definition.
   *
   * @type {RouterBranchDefinition}
   */
  _definition;

  /**
   * Get branch definition.
   *
   * @type {RouterBranchDefinition}
   */
  getDefinition() {
    return this._definition;
  }

  /**
   * Parent branch.
   *
   * @type {RouterBranch|undefined}
   */
  _parentBranch;

  /**
   * Has parent branch.
   *
   * @returns {boolean}
   */
  hasParentBranch() {
    return Boolean(this._parentBranch);
  }

  /**
   * Get parent branch.
   *
   * @returns {RouterBranch|undefined}
   */
  getParentBranch() {
    if (!this._parentBranch) {
      throw new InvalidArgumentError(
        'Parent branch does not exist in the router branch.',
      );
    }
    return this._parentBranch;
  }

  /**
   * Constructor.
   *
   * @param {TrieRouter} router
   * @param {RouterBranchDefinition} branchDef
   * @param {RouterBranch} [parentBranch]
   */
  constructor(router, branchDef, parentBranch) {
    super(router.container);
    if (!(router instanceof TrieRouter)) {
      throw new InvalidArgumentError(
        'Parameter "router" must be a TrieRouter instance, but %v was given.',
        router,
      );
    }
    this._router = router;
    if (parentBranch !== undefined && !(parentBranch instanceof RouterBranch)) {
      throw new InvalidArgumentError(
        'Parameter "parentBranch" must be a RouterBranch instance, ' +
          'but %v was given.',
        parentBranch,
      );
    }
    this._parentBranch = parentBranch;
    if (parentBranch) {
      const mergedDef = mergeRouterBranchDefinitions(
        parentBranch.getDefinition(),
        branchDef,
      );
      this._definition = cloneDeep(mergedDef);
    } else {
      validateRouterBranchDefinition(branchDef);
      this._definition = cloneDeep(branchDef);
    }
    this.ctorDebug('Created a branch %v.', normalizePath(branchDef.path, true));
    this.ctorDebug('Branch path is %v.', this._definition.path);
  }

  /**
   * Define route.
   *
   * @param {import('../route/index.js').RouteDefinition} routeDef
   * @returns {Route}
   */
  defineRoute(routeDef) {
    validateRouteDefinition(routeDef);
    const {method, handler, ...routeDefAsBranchDef} = routeDef;
    const mergedDef = mergeRouterBranchDefinitions(
      this._definition,
      routeDefAsBranchDef,
    );
    mergedDef.method = method;
    mergedDef.handler = handler;
    return this._router.defineRoute(mergedDef);
  }

  /**
   * Create branch.
   *
   * @param {RouterBranch} branchDef
   * @returns {RouterBranch}
   */
  createBranch(branchDef) {
    return new RouterBranch(this._router, branchDef, this);
  }
}
