import {expect} from 'chai';
import {ROOT_PATH} from '../constants.js';
import {mergeRouterBranchDefinitions} from './merge-router-branch-definitions.js';

describe('mergeRouterBranchDefinitions', function () {
  it('should require the parameter "firstDef" to be an Object', function () {
    const throwable = () =>
      mergeRouterBranchDefinitions(123, {path: ROOT_PATH});
    expect(throwable).to.throw(
      'Branch definition must be an Object, but 123 was given.',
    );
  });

  it('should require the parameter "secondDef" to be an Object', function () {
    const throwable = () =>
      mergeRouterBranchDefinitions({path: ROOT_PATH}, 123);
    expect(throwable).to.throw(
      'Branch definition must be an Object, but 123 was given.',
    );
  });

  it('should concatenate the option "path" with the correct order', function () {
    const res = mergeRouterBranchDefinitions({path: '/foo'}, {path: '/bar'});
    expect(res).to.be.eql({path: '/foo/bar'});
  });

  it('should keep a trailing slash from the first definition', function () {
    const res1 = mergeRouterBranchDefinitions({path: '/foo/'}, {path: '/'});
    expect(res1).to.be.eql({path: '/foo/'});
    const res2 = mergeRouterBranchDefinitions({path: '/foo/'}, {path: '/bar'});
    expect(res2).to.be.eql({path: '/foo/bar'});
  });

  it('should keep a trailing slash from the second definition', function () {
    const res1 = mergeRouterBranchDefinitions({path: '/'}, {path: '/foo/'});
    expect(res1).to.be.eql({path: '/foo/'});
    const res2 = mergeRouterBranchDefinitions({path: '/foo'}, {path: '/bar/'});
    expect(res2).to.be.eql({path: '/foo/bar/'});
  });

  it('should collapse slashes when the option "path" has a trailing slash', function () {
    const res1 = mergeRouterBranchDefinitions({path: '/'}, {path: '/'});
    expect(res1).to.be.eql({path: '/'});
    const res2 = mergeRouterBranchDefinitions({path: '/foo/'}, {path: '/bar/'});
    expect(res2).to.be.eql({path: '/foo/bar/'});
  });

  it('should merge the option "preHandler" with a function value', function () {
    const preHandler1 = () => undefined;
    const preHandler2 = () => undefined;
    const res = mergeRouterBranchDefinitions(
      {
        path: ROOT_PATH,
        preHandler: preHandler1,
      },
      {
        path: ROOT_PATH,
        preHandler: preHandler2,
      },
    );
    expect(res).to.be.eql({
      path: ROOT_PATH,
      preHandler: [preHandler1, preHandler2],
    });
  });

  it('should merge the option "preHandler" with an array value', function () {
    const preHandler1 = () => undefined;
    const preHandler2 = () => undefined;
    const res = mergeRouterBranchDefinitions(
      {
        path: ROOT_PATH,
        preHandler: [preHandler1],
      },
      {
        path: ROOT_PATH,
        preHandler: [preHandler2],
      },
    );
    expect(res).to.be.eql({
      path: ROOT_PATH,
      preHandler: [preHandler1, preHandler2],
    });
  });

  it('should merge the option "postHandler" with a function value', function () {
    const preHandler1 = () => undefined;
    const preHandler2 = () => undefined;
    const res = mergeRouterBranchDefinitions(
      {
        path: ROOT_PATH,
        postHandler: preHandler1,
      },
      {
        path: ROOT_PATH,
        postHandler: preHandler2,
      },
    );
    expect(res).to.be.eql({
      path: ROOT_PATH,
      postHandler: [preHandler1, preHandler2],
    });
  });

  it('should merge the option "postHandler" with an array value', function () {
    const preHandler1 = () => undefined;
    const preHandler2 = () => undefined;
    const res = mergeRouterBranchDefinitions(
      {
        path: ROOT_PATH,
        postHandler: [preHandler1],
      },
      {
        path: ROOT_PATH,
        postHandler: [preHandler2],
      },
    );
    expect(res).to.be.eql({
      path: ROOT_PATH,
      postHandler: [preHandler1, preHandler2],
    });
  });

  it('should use the option "meta" from the first definition', function () {
    const meta = {foo: 'bar'};
    const res = mergeRouterBranchDefinitions(
      {path: ROOT_PATH, meta},
      {path: ROOT_PATH},
    );
    expect(res).to.be.eql({path: ROOT_PATH, meta});
  });

  it('should use the option "meta" from the second definition', function () {
    const meta = {foo: 'bar'};
    const res = mergeRouterBranchDefinitions(
      {path: ROOT_PATH},
      {path: ROOT_PATH, meta},
    );
    expect(res).to.be.eql({path: ROOT_PATH, meta});
  });

  it('should merge the option "meta" when both definitions are provided', function () {
    const meta1 = {foo: 1};
    const meta2 = {bar: 2};
    const res = mergeRouterBranchDefinitions(
      {path: ROOT_PATH, meta: meta1},
      {path: ROOT_PATH, meta: meta2},
    );
    expect(res).to.be.eql({path: ROOT_PATH, meta: {foo: 1, bar: 2}});
  });

  it('should merge the option "meta" with nested arrays', function () {
    const meta1 = {foo: [1, {bar: 2}]};
    const meta2 = {foo: [3, {baz: 4}]};
    const expectedMeta = {foo: [1, {bar: 2}, 3, {baz: 4}]};
    const res = mergeRouterBranchDefinitions(
      {path: ROOT_PATH, meta: meta1},
      {path: ROOT_PATH, meta: meta2},
    );
    expect(res).to.be.eql({path: ROOT_PATH, meta: expectedMeta});
  });

  it('should merge the option "meta" with a deep recursion', function () {
    const meta1 = {foo: {bar: 10}};
    const meta2 = {foo: {baz: 20}};
    const expectedMeta = {foo: {bar: 10, baz: 20}};
    const res = mergeRouterBranchDefinitions(
      {path: ROOT_PATH, meta: meta1},
      {path: ROOT_PATH, meta: meta2},
    );
    expect(res).to.be.eql({path: ROOT_PATH, meta: expectedMeta});
  });

  it('should add extra properties of definitions to the result', function () {
    const res = mergeRouterBranchDefinitions(
      {path: ROOT_PATH, extra1: 10},
      {path: ROOT_PATH, extra2: 20},
    );
    expect(res).to.be.eql({path: ROOT_PATH, extra1: 10, extra2: 20});
  });
});
