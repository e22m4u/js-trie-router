import {expect} from 'chai';
import {HttpMethod} from './route.js';
import {format} from '@e22m4u/js-format';
import {validateRouteDefinition} from './validate-route-definition.js';

describe('validateRouteDefinition', function () {
  it('should require the "routeDef" parameter to be an Object', function () {
    const throwable = v => () => validateRouteDefinition(v);
    const error = v =>
      format('Route definition must be an Object, but %s was given.', v);
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
      handler: () => undefined,
    })();
  });

  it('should require the "method" option to be a non-empty String', function () {
    const throwable = v => () =>
      validateRouteDefinition({
        method: v,
        handler: () => undefined,
      });
    const error = v =>
      format(
        'Option "method" must be a non-empty String, but %s was given.',
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

  it('should require the "path" option to be a non-empty String', function () {
    const throwable = v => () =>
      validateRouteDefinition({
        method: HttpMethod.GET,
        path: v,
        handler: () => undefined,
      });
    const error = v =>
      format('Option "path" must be a String, but %s was given.', v);
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable('str')();
    throwable('')();
    throwable(undefined)();
  });

  it('should require the "handler" option to be a Function', function () {
    const throwable = v => () =>
      validateRouteDefinition({
        method: HttpMethod.GET,
        handler: v,
      });
    const error = v =>
      format('Option "handler" must be a Function, but %s was given.', v);
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

  it('should require the "preHandler" option to be a Function or an Array of Function', function () {
    const throwable = v => () =>
      validateRouteDefinition({
        method: HttpMethod.GET,
        preHandler: v,
        handler: () => undefined,
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
      validateRouteDefinition({
        method: HttpMethod.GET,
        preHandler: [v],
        handler: () => undefined,
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
      validateRouteDefinition({
        method: HttpMethod.GET,
        postHandler: v,
        handler: () => undefined,
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
      validateRouteDefinition({
        method: HttpMethod.GET,
        postHandler: [v],
        handler: () => undefined,
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

  it('should require the "meta" option to be a plain Object', function () {
    const throwable = v => () =>
      validateRouteDefinition({
        method: HttpMethod.GET,
        handler: () => undefined,
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
