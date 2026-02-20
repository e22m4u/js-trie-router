import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {ROOT_PATH} from '../constants.js';
import {validateRouterBranchDefinition} from './validate-router-branch-definition.js';

describe('validateRouterBranchDefinition', function () {
  it('should require the parameter "routeDef" to be an Object', function () {
    const throwable = v => () => validateRouterBranchDefinition(v);
    const error = v =>
      format('The branch definition must be an Object, but %s was given.', v);
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

  it('should throw an error if the option "method" is provided', function () {
    const throwable = () =>
      validateRouterBranchDefinition({
        path: ROOT_PATH,
        method: 123,
      });
    expect(throwable).to.throw(
      'The option "method" is not supported for the router branch, ' +
        'but 123 was given.',
    );
  });

  it('should require the option "path" to be a String', function () {
    const throwable = v => () => validateRouterBranchDefinition({path: v});
    const error = v =>
      format('The option "path" must be a String, but %s was given.', v);
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable('/path')();
  });

  it('should require the option "path" to start with a forward slash', function () {
    const throwable = v => () => validateRouterBranchDefinition({path: v});
    const error = s =>
      format('The option "path" must start with "/", but %s was given.', s);
    expect(throwable('path')).to.throw(error('"path"'));
    expect(throwable('')).to.throw(error('""'));
    throwable('/path')();
    throwable('/')();
  });

  it('should throw an error when the option "handler" is provided', function () {
    const throwable = () =>
      validateRouterBranchDefinition({
        path: ROOT_PATH,
        handler: 123,
      });
    expect(throwable).to.throw(
      'The option "handler" is not supported for the router branch, ' +
        'but 123 was given.',
    );
  });

  it('should require the option "preHandler" to be a Function or an Array', function () {
    const throwable = v => () =>
      validateRouterBranchDefinition({
        path: ROOT_PATH,
        preHandler: v,
      });
    const error = v =>
      format(
        'The option "preHandler" must be a Function ' +
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

  it('should require an array of the option "preHandler" to contain a Function', function () {
    const throwable = v => () =>
      validateRouterBranchDefinition({
        path: ROOT_PATH,
        preHandler: [v],
      });
    const error = v =>
      format('The hook "preHandler" must be a Function, but %s was given.', v);
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

  it('should require the option "postHandler" to be a Function or an Array', function () {
    const throwable = v => () =>
      validateRouterBranchDefinition({
        path: ROOT_PATH,
        postHandler: v,
      });
    const error = v =>
      format(
        'The option "postHandler" must be a Function ' +
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

  it('should require an array of the option "postHandler" to contain a Function', function () {
    const throwable = v => () =>
      validateRouterBranchDefinition({
        path: ROOT_PATH,
        postHandler: [v],
      });
    const error = v =>
      format('The hook "postHandler" must be a Function, but %s was given.', v);
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

  it('should require the option "meta" to be an Object', function () {
    const throwable = v => () =>
      validateRouterBranchDefinition({
        path: ROOT_PATH,
        meta: v,
      });
    const error = v =>
      format('The option "meta" must be an Object, but %s was given.', v);
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
