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
      path: '/',
      handler: () => undefined,
    })();
  });

  it('should require the "method" option to be a non-empty String', function () {
    const throwable = v => () =>
      validateRouteDefinition({
        method: v,
        path: '/',
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
    expect(throwable(undefined)).to.throw(error('undefined'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable('str')();
    throwable('')();
  });

  it('should require the "meta" option to be a plain Object', function () {
    const throwable = v => () =>
      validateRouteDefinition({
        method: HttpMethod.GET,
        path: 'path',
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
