import {expect} from 'chai';
import {ROOT_PATH} from '../constants.js';
import {TrieRouter} from '../trie-router.js';
import {RouterBranch} from './router-branch.js';
import {HttpMethod, Route} from '../route/route.js';

describe('RouterBranch', function () {
  describe('constructor', function () {
    it('should use a service container from a given router', function () {
      const router = new TrieRouter();
      const S = new RouterBranch(router, {path: ROOT_PATH});
      expect(S.container).to.be.eq(router.container);
    });

    it('should merge a parent definition with a given definition', function () {
      const router = new TrieRouter();
      const parent = router.createBranch({path: 'foo'});
      const S = new RouterBranch(router, {path: 'bar'}, parent);
      expect(S.getDefinition().path).to.be.eq('/foo/bar');
    });
  });

  describe('getRouter', function () {
    it('should return the router instance that was provided to the constructor', function () {
      const router = new TrieRouter();
      const S = new RouterBranch(router, {path: ROOT_PATH});
      expect(S.getRouter()).to.be.eq(router);
    });
  });

  describe('getDefinition', function () {
    it('should return the branch definition that was provided to the constructor', function () {
      const router = new TrieRouter();
      const branchDef = {path: ROOT_PATH};
      const S = new RouterBranch(router, branchDef);
      expect(S.getDefinition()).to.be.eql(branchDef);
    });
  });

  describe('getParentBranch', function () {
    it('should return the parent branch that was provided to the constructor', function () {
      const router = new TrieRouter();
      const parent = router.createBranch({path: ROOT_PATH});
      const S = new RouterBranch(router, {path: ROOT_PATH}, parent);
      expect(S.getParentBranch()).to.be.eq(parent);
    });
  });

  describe('defineRoute', function () {
    it('should return a Route instance', function () {
      const router = new TrieRouter();
      const S = new RouterBranch(router, {path: 'foo'});
      const res = S.defineRoute({
        method: HttpMethod.GET,
        path: 'bar',
        handler: () => undefined,
      });
      expect(res).to.be.instanceOf(Route);
    });

    it('should combine a branch path with a route path', function () {
      const router = new TrieRouter();
      const S = new RouterBranch(router, {path: 'foo'});
      const res = S.defineRoute({
        method: HttpMethod.GET,
        path: 'bar',
        handler: () => undefined,
      });
      expect(res.path).to.be.eq('/foo/bar');
    });
  });

  describe('createBranch', function () {
    it('should return a RouterBranch instance', function () {
      const router = new TrieRouter();
      const S = new RouterBranch(router, {path: 'foo'});
      const res = S.createBranch({path: 'bar'});
      expect(res).to.be.instanceOf(RouterBranch);
    });

    it('should combine a current path with a new path', function () {
      const router = new TrieRouter();
      const S = new RouterBranch(router, {path: 'foo'});
      const res = S.createBranch({path: 'bar'});
      expect(res.getDefinition().path).to.be.eq('/foo/bar');
    });
  });
});
