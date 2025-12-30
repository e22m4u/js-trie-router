import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {validateRouterBranchDefinition} from './validate-router-branch-definition.js';
import {ROOT_PATH} from '../constants.js';

describe('validateRouterBranchDefinition', function () {
  it('should require the "routeDef" parameter to be an Object', function () {
    const throwable = v => () => validateRouterBranchDefinition(v);
    const error = v =>
      format('Branch definition must be an Object, but %s was given.', v);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable({path: ROOT_PATH})();
  });

  it('should throw an error if the "method" option is provided', function () {
    const throwable = () =>
      validateRouterBranchDefinition({
        path: ROOT_PATH,
        method: 123,
      });
    expect(throwable).to.throw(
      'Option "method" is not supported for the router branch, ' +
        'but 123 was given.',
    );
  });

  it('should require the "path" option to be a non-empty String', function () {
    const throwable = v => () => validateRouterBranchDefinition({path: v});
    const error = v =>
      format('Option "path" must be a non-empty String, but %s was given.', v);
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable('str')();
  });

  it('should throw an error if the "handler" option is provided', function () {
    const throwable = () =>
      validateRouterBranchDefinition({
        path: ROOT_PATH,
        handler: 123,
      });
    expect(throwable).to.throw(
      'Option "handler" is not supported for the router branch, ' +
        'but 123 was given.',
    );
  });

  it('should require the "preHandler" option to be a Function or an Array of Function', function () {
    const throwable = v => () =>
      validateRouterBranchDefinition({
        path: ROOT_PATH,
        preHandler: v,
      });
    const error = v =>
      format(
        'Option "preHandler" must be a Function ' +
          'or an Array, but %s was given.',
        v,
      );
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable(null)).to.throw(error('null'));
    throwable([])();
    throwable(() => undefined)();
    throwable(undefined)();
  });

  it('should require an array of the "preHandler" option to contain a Function', function () {
    const throwable = v => () =>
      validateRouterBranchDefinition({
        path: ROOT_PATH,
        preHandler: [v],
      });
    const error = v =>
      format('Route pre-handler must be a Function, but %s was given.', v);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    throwable(() => undefined)();
  });

  it('should require the "postHandler" option to be a Function or an Array of Function', function () {
    const throwable = v => () =>
      validateRouterBranchDefinition({
        path: ROOT_PATH,
        postHandler: v,
      });
    const error = v =>
      format(
        'Option "postHandler" must be a Function ' +
          'or an Array, but %s was given.',
        v,
      );
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable(null)).to.throw(error('null'));
    throwable([])();
    throwable(() => undefined)();
    throwable(undefined)();
  });

  it('should require an array of the "postHandler" option to contain a Function', function () {
    const throwable = v => () =>
      validateRouterBranchDefinition({
        path: ROOT_PATH,
        postHandler: [v],
      });
    const error = v =>
      format('Route post-handler must be a Function, but %s was given.', v);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    throwable(() => undefined)();
  });

  it('should require the "meta" option to be an Object', function () {
    const throwable = v => () =>
      validateRouterBranchDefinition({
        path: ROOT_PATH,
        meta: v,
      });
    const error = v =>
      format('Option "meta" must be an Object, but %s was given.', v);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable({foo: 'bar'})();
    throwable({})();
    throwable(undefined)();
  });
});
