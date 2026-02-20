import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {ROOT_PATH} from '../constants.js';
import {TrieRouter} from '../trie-router.js';
import {RouterBranch} from './router-branch.js';
import {HttpMethod, Route} from '../route/route.js';

describe('RouterBranch', function () {
  describe('constructor', function () {
    it('should require the parameter "router" to be an instance of TrieRouter', function () {
      const throwable = v => () => new RouterBranch(v, {path: '/branch'});
      const error = s =>
        format(
          'The parameter "router" must be an instance of TrieRouter, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(new TrieRouter())();
    });

    it('should require the parameter "branchDef" to be an Object', function () {
      const router = new TrieRouter();
      const throwable = v => () => new RouterBranch(router, v);
      const error = s =>
        format('The branch definition must be an Object, but %s was given.', s);
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable({path: '/branch'})();
    });

    it('should require the parameter "parentBranch" to be an instance of RouterBranch', function () {
      const router = new TrieRouter();
      const throwable = v => () =>
        new RouterBranch(router, {path: '/branch'}, v);
      const error = s =>
        format(
          'The parameter "parentBranch" must be an instance of RouterBranch, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(new RouterBranch(router, {path: '/root'}))();
      throwable(undefined);
    });

    it('should use a service container from a given router', function () {
      const router = new TrieRouter();
      const S = new RouterBranch(router, {path: ROOT_PATH});
      expect(S.container).to.be.eq(router.container);
    });

    it('should merge a parent definition with a given definition', function () {
      const router = new TrieRouter();
      const parent = router.createBranch({path: '/foo'});
      const S = new RouterBranch(router, {path: '/bar'}, parent);
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
      expect(S.getDefinition()).to.be.not.eq(branchDef);
    });
  });

  describe('hasParentBranch', function () {
    it('should return true if a parent branch exists', function () {
      const router = new TrieRouter();
      const parent = router.createBranch({path: ROOT_PATH});
      const branch1 = new RouterBranch(router, {path: ROOT_PATH});
      expect(branch1.hasParentBranch()).to.be.false;
      const branch2 = new RouterBranch(router, {path: ROOT_PATH}, parent);
      expect(branch2.hasParentBranch()).to.be.true;
    });
  });

  describe('getParentBranch', function () {
    it('should return a parent branch provided to the constructor', function () {
      const router = new TrieRouter();
      const parent = router.createBranch({path: ROOT_PATH});
      const S = new RouterBranch(router, {path: ROOT_PATH}, parent);
      expect(S.getParentBranch()).to.be.eq(parent);
    });

    it('should throw an error when the parent branch does not exist', function () {
      const router = new TrieRouter();
      const S = new RouterBranch(router, {path: ROOT_PATH});
      const throwable = () => S.getParentBranch();
      expect(throwable).to.throw(
        'The parent branch does not exist in the router branch.',
      );
    });
  });

  describe('defineRoute', function () {
    it('should return an instance of Route', function () {
      const router = new TrieRouter();
      const S = new RouterBranch(router, {path: '/foo'});
      const res = S.defineRoute({
        method: HttpMethod.GET,
        path: '/bar',
        handler: () => undefined,
      });
      expect(res).to.be.instanceOf(Route);
    });

    it('should combine a branch path with a route path', function () {
      const router = new TrieRouter();
      const S = new RouterBranch(router, {path: '/foo'});
      const res = S.defineRoute({
        method: HttpMethod.GET,
        path: '/bar',
        handler: () => undefined,
      });
      expect(res.path).to.be.eq('/foo/bar');
    });
  });

  describe('createBranch', function () {
    it('should return an instance of RouterBranch', function () {
      const router = new TrieRouter();
      const S = new RouterBranch(router, {path: '/foo'});
      const res = S.createBranch({path: '/bar'});
      expect(res).to.be.instanceOf(RouterBranch);
    });

    it('should combine a current path with a new path', function () {
      const router = new TrieRouter();
      const S = new RouterBranch(router, {path: '/foo'});
      const res = S.createBranch({path: '/bar'});
      expect(res.getDefinition().path).to.be.eq('/foo/bar');
    });
  });
});
