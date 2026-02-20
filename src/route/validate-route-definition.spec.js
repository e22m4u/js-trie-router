import {expect} from 'chai';
import {HttpMethod} from './route.js';
import {format} from '@e22m4u/js-format';
import {ROOT_PATH} from '../constants.js';
import {validateRouteDefinition} from './validate-route-definition.js';

describe('validateRouteDefinition', function () {
  it('should require the parameter "routeDef" to be an Object', function () {
    const throwable = v => () => validateRouteDefinition(v);
    const error = v =>
      format('The route definition must be an Object, but %s was given.', v);
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
    throwable({
      method: HttpMethod.GET,
      path: ROOT_PATH,
      handler: () => undefined,
    })();
  });

  it('should require the option "method" to be a non-empty String', function () {
    const throwable = v => () =>
      validateRouteDefinition({
        method: v,
        path: ROOT_PATH,
        handler: () => undefined,
      });
    const error = v =>
      format(
        'The option "method" must be a non-empty String, but %s was given.',
        v,
      );
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable(HttpMethod.GET)();
  });

  it('should require the option "path" to be a String', function () {
    const throwable = v => () =>
      validateRouteDefinition({
        method: HttpMethod.GET,
        path: v,
        handler: () => undefined,
      });
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
    const throwable = v => () =>
      validateRouteDefinition({
        method: HttpMethod.GET,
        path: v,
        handler: () => undefined,
      });
    const error = s =>
      format('The option "path" must start with "/", but %s was given.', s);
    expect(throwable('path')).to.throw(error('"path"'));
    expect(throwable('')).to.throw(error('""'));
    throwable('/path')();
    throwable('/')();
  });

  it('should require the option "handler" to be a Function', function () {
    const throwable = v => () =>
      validateRouteDefinition({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: v,
      });
    const error = v =>
      format('The option "handler" must be a Function, but %s was given.', v);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    throwable(() => undefined)();
  });

  it('should require the option "preHandler" to be a Function or an Array', function () {
    const throwable = v => () =>
      validateRouteDefinition({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: v,
        handler: () => undefined,
      });
    const error = v =>
      format(
        'The option "preHandler" must be a Function or an Array, ' +
          'but %s was given.',
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
      validateRouteDefinition({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: [v],
        handler: () => undefined,
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
      validateRouteDefinition({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        postHandler: v,
        handler: () => undefined,
      });
    const error = v =>
      format(
        'The option "postHandler" must be a Function or an Array, ' +
          'but %s was given.',
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
      validateRouteDefinition({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        postHandler: [v],
        handler: () => undefined,
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
      validateRouteDefinition({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => undefined,
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
