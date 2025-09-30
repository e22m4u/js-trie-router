import {Route} from './route.js';
import {expect} from './chai.js';
import {HttpMethod} from './route.js';
import {format} from '@e22m4u/js-format';
import {HookType} from './hooks/index.js';
import {createRequestMock} from './utils/index.js';
import {createResponseMock} from './utils/index.js';
import {RequestContext} from './request-context.js';
import {ServiceContainer} from '@e22m4u/js-service';

describe('Route', function () {
  describe('constructor', function () {
    it('requires the first parameter to be an Object', function () {
      const throwable = v => () => new Route(v);
      const error = v =>
        format(
          'The first parameter of Route.constructor ' +
            'should be an Object, but %s was given.',
          v,
        );
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

    it('requires the option "method" to be a non-empty String', function () {
      const throwable = v => () =>
        new Route({
          method: v,
          path: '/',
          handler: () => undefined,
        });
      const error = v =>
        format(
          'The option "method" of the Route should be ' +
            'a non-empty String, but %s was given.',
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

    it('requires the option "path" to be a non-empty String', function () {
      const throwable = v => () =>
        new Route({
          method: HttpMethod.GET,
          path: v,
          handler: () => undefined,
        });
      const error = v =>
        format(
          'The option "path" of the Route should be ' +
            'a String, but %s was given.',
          v,
        );
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

    it('requires the option "handler" to be a non-empty String', function () {
      const throwable = v => () =>
        new Route({
          method: HttpMethod.GET,
          path: '/',
          handler: v,
        });
      const error = v =>
        format(
          'The option "handler" of the Route should be ' +
            'a Function, but %s was given.',
          v,
        );
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

    it('requires the option "preHandler" to be a Function or an Array of Function', function () {
      const throwable1 = v => () =>
        new Route({
          method: HttpMethod.GET,
          path: '/',
          preHandler: v,
          handler: () => undefined,
        });
      const error = v =>
        format(
          'The hook "preHandler" should be a Function, but %s was given.',
          v,
        );
      expect(throwable1('str')).to.throw(error('"str"'));
      expect(throwable1('')).to.throw(error('""'));
      expect(throwable1(10)).to.throw(error('10'));
      expect(throwable1(0)).to.throw(error('0'));
      expect(throwable1(true)).to.throw(error('true'));
      expect(throwable1(false)).to.throw(error('false'));
      expect(throwable1({})).to.throw(error('Object'));
      throwable1([])();
      throwable1(() => undefined)();
      throwable1(null)();
      throwable1(undefined)();
      const throwable2 = v => () =>
        new Route({
          method: HttpMethod.GET,
          path: '/',
          preHandler: [v],
          handler: () => undefined,
        });
      expect(throwable2('str')).to.throw(error('"str"'));
      expect(throwable2('')).to.throw(error('""'));
      expect(throwable2(10)).to.throw(error('10'));
      expect(throwable2(0)).to.throw(error('0'));
      expect(throwable2(true)).to.throw(error('true'));
      expect(throwable2(false)).to.throw(error('false'));
      expect(throwable2({})).to.throw(error('Object'));
      expect(throwable2(null)).to.throw(error('null'));
      expect(throwable2([])).to.throw(error('Array'));
      expect(throwable2(undefined)).to.throw(error('undefined'));
      throwable2(() => undefined)();
    });

    it('requires the option "postHandler" to be a Function or an Array of Function', function () {
      const throwable1 = v => () =>
        new Route({
          method: HttpMethod.GET,
          path: '/',
          handler: () => undefined,
          postHandler: v,
        });
      const error = v =>
        format(
          'The hook "postHandler" should be a Function, but %s was given.',
          v,
        );
      expect(throwable1('str')).to.throw(error('"str"'));
      expect(throwable1('')).to.throw(error('""'));
      expect(throwable1(10)).to.throw(error('10'));
      expect(throwable1(0)).to.throw(error('0'));
      expect(throwable1(true)).to.throw(error('true'));
      expect(throwable1(false)).to.throw(error('false'));
      expect(throwable1({})).to.throw(error('Object'));
      throwable1([])();
      throwable1(() => undefined)();
      throwable1(null)();
      throwable1(undefined)();
      const throwable2 = v => () =>
        new Route({
          method: HttpMethod.GET,
          path: '/',
          handler: () => undefined,
          postHandler: [v],
        });
      expect(throwable2('str')).to.throw(error('"str"'));
      expect(throwable2('')).to.throw(error('""'));
      expect(throwable2(10)).to.throw(error('10'));
      expect(throwable2(0)).to.throw(error('0'));
      expect(throwable2(true)).to.throw(error('true'));
      expect(throwable2(false)).to.throw(error('false'));
      expect(throwable2({})).to.throw(error('Object'));
      expect(throwable2(null)).to.throw(error('null'));
      expect(throwable2([])).to.throw(error('Array'));
      expect(throwable2(undefined)).to.throw(error('undefined'));
      throwable2(() => undefined)();
    });

    it('sets the option "method" in upper case to the "method" property', function () {
      const route = new Route({
        method: 'post',
        path: '/',
        handler: () => undefined,
      });
      expect(route.method).to.be.eq('POST');
    });

    it('sets the option "path" to the "path" property', function () {
      const value = '/myPath';
      const route = new Route({
        method: HttpMethod.GET,
        path: value,
        handler: () => undefined,
      });
      expect(route.path).to.be.eq(value);
    });

    it('sets the option "handler" to the "handler" property', function () {
      const value = () => undefined;
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
        handler: value,
      });
      expect(route.handler).to.be.eq(value);
    });

    it('adds a Function to "preHandler" hooks', function () {
      const value = () => undefined;
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
        preHandler: value,
        handler: () => undefined,
      });
      expect(route.hookRegistry.hasHook(HookType.PRE_HANDLER, value)).to.be
        .true;
    });

    it('adds Function items of an Array to "preHandler" hooks', function () {
      const value = [() => undefined, () => undefined];
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
        preHandler: value,
        handler: () => undefined,
      });
      expect(route.hookRegistry.hasHook(HookType.PRE_HANDLER, value[0])).to.be
        .true;
      expect(route.hookRegistry.hasHook(HookType.PRE_HANDLER, value[1])).to.be
        .true;
    });

    it('adds a Function to "postHandler" hooks', function () {
      const value = () => undefined;
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
        handler: () => undefined,
        postHandler: value,
      });
      expect(route.hookRegistry.hasHook(HookType.POST_HANDLER, value)).to.be
        .true;
    });

    it('adds Function items of an Array to "postHandler" hooks', function () {
      const value = [() => undefined, () => undefined];
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
        handler: () => undefined,
        postHandler: value,
      });
      expect(route.hookRegistry.hasHook(HookType.POST_HANDLER, value[0])).to.be
        .true;
      expect(route.hookRegistry.hasHook(HookType.POST_HANDLER, value[1])).to.be
        .true;
    });
  });

  describe('handle', function () {
    it('invokes the handler with the given RequestContext and return its result', function () {
      const handler = ctx => {
        expect(ctx).to.be.instanceof(RequestContext);
        return 'OK';
      };
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
        handler,
      });
      const req = createRequestMock();
      const res = createResponseMock();
      const cnt = new ServiceContainer();
      const ctx = new RequestContext(cnt, req, res);
      const result = route.handle(ctx);
      expect(result).to.be.eq('OK');
    });
  });
});
