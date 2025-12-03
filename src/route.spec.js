import {Route} from './route.js';
import {expect} from 'chai';
import {HttpMethod} from './route.js';
import {format} from '@e22m4u/js-format';
import {RouterHookType} from './hooks/index.js';
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

    describe('the "method" option', function () {
      it('requires the "method" option to be a non-empty String', function () {
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

      it('sets the "method" option in upper case to the "method" property', function () {
        const route = new Route({
          method: 'post',
          path: '/',
          handler: () => undefined,
        });
        expect(route.method).to.be.eq('POST');
      });
    });

    describe('the "path" option', function () {
      it('requires the "path" option to be a non-empty String', function () {
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

      it('sets the "path" option to the "path" property', function () {
        const value = '/myPath';
        const route = new Route({
          method: HttpMethod.GET,
          path: value,
          handler: () => undefined,
        });
        expect(route.path).to.be.eq(value);
      });
    });

    describe('the "meta" option', function () {
      it('requires the "meta" option to be a plain Object', function () {
        const throwable = v => () =>
          new Route({
            method: HttpMethod.GET,
            path: 'path',
            handler: () => undefined,
            meta: v,
          });
        const error = v =>
          format(
            'The option "meta" of the Route should be ' +
              'a plain Object, but %s was given.',
            v,
          );
        expect(throwable(10)).to.throw(error('10'));
        expect(throwable(0)).to.throw(error('0'));
        expect(throwable(true)).to.throw(error('true'));
        expect(throwable(false)).to.throw(error('false'));
        expect(throwable([])).to.throw(error('Array'));
        expect(throwable(() => undefined)).to.throw(error('Function'));
        throwable({foo: 'bar'})();
        throwable({})();
        throwable(null)();
        throwable(undefined)();
      });

      it('sets the "meta" option to the "meta" property as a deep copy', function () {
        const metaData = {foo: {bar: {baz: 'qux'}}};
        const route = new Route({
          method: 'post',
          path: '/',
          handler: () => undefined,
          meta: metaData,
        });
        expect(route.meta).to.be.not.eq(metaData);
        expect(route.meta).to.be.eql(metaData);
        expect(route.meta.foo).to.be.not.eq(metaData.foo);
        expect(route.meta.foo).to.be.eql(metaData.foo);
        expect(route.meta.foo.bar).to.be.not.eq(metaData.foo.bar);
        expect(route.meta.foo.bar).to.be.eql(metaData.foo.bar);
      });

      it('sets an empty object to the "meta" property if the "meta" option is not provided', function () {
        const route = new Route({
          method: 'post',
          path: '/',
          handler: () => undefined,
        });
        expect(route.meta).to.be.eql({});
      });

      it('sets an empty object to the "meta" property if the "meta" option is undefined', function () {
        const route = new Route({
          method: 'post',
          path: '/',
          handler: () => undefined,
          meta: undefined,
        });
        expect(route.meta).to.be.eql({});
      });

      it('sets an empty object to the "meta" property if the "meta" option is null', function () {
        const route = new Route({
          method: 'post',
          path: '/',
          handler: () => undefined,
          meta: null,
        });
        expect(route.meta).to.be.eql({});
      });
    });

    describe('the "handler" option', function () {
      it('requires the "handler" option to be a non-empty String', function () {
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

      it('sets the "handler" option to the "handler" property', function () {
        const value = () => undefined;
        const route = new Route({
          method: HttpMethod.GET,
          path: '/',
          handler: value,
        });
        expect(route.handler).to.be.eq(value);
      });
    });

    describe('the "preHandler" option', function () {
      it('requires the "preHandler" option to be a Function or an Array of Function', function () {
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

      it('adds a Function to "preHandler" hooks', function () {
        const value = () => undefined;
        const route = new Route({
          method: HttpMethod.GET,
          path: '/',
          preHandler: value,
          handler: () => undefined,
        });
        expect(route.hookRegistry.hasHook(RouterHookType.PRE_HANDLER, value)).to
          .be.true;
      });

      it('adds a Function Array to "preHandler" hooks', function () {
        const value = [() => undefined, () => undefined];
        const route = new Route({
          method: HttpMethod.GET,
          path: '/',
          preHandler: value,
          handler: () => undefined,
        });
        expect(route.hookRegistry.hasHook(RouterHookType.PRE_HANDLER, value[0]))
          .to.be.true;
        expect(route.hookRegistry.hasHook(RouterHookType.PRE_HANDLER, value[1]))
          .to.be.true;
      });
    });

    describe('the "postHandler" option', function () {
      it('requires the "postHandler" option to be a Function or an Array of Function', function () {
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

      it('adds a Function to "postHandler" hooks', function () {
        const value = () => undefined;
        const route = new Route({
          method: HttpMethod.GET,
          path: '/',
          handler: () => undefined,
          postHandler: value,
        });
        expect(route.hookRegistry.hasHook(RouterHookType.POST_HANDLER, value))
          .to.be.true;
      });

      it('adds a Function Array to "postHandler" hooks', function () {
        const value = [() => undefined, () => undefined];
        const route = new Route({
          method: HttpMethod.GET,
          path: '/',
          handler: () => undefined,
          postHandler: value,
        });
        expect(
          route.hookRegistry.hasHook(RouterHookType.POST_HANDLER, value[0]),
        ).to.be.true;
        expect(
          route.hookRegistry.hasHook(RouterHookType.POST_HANDLER, value[1]),
        ).to.be.true;
      });
    });
  });

  describe('handle', function () {
    it('invokes the handler with the given RequestContext and return its result', function () {
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
        handler(ctx) {
          expect(ctx).to.be.instanceof(RequestContext);
          return 'OK';
        },
      });
      const req = createRequestMock();
      const res = createResponseMock();
      const cont = new ServiceContainer();
      const ctx = new RequestContext(cont, req, res, route);
      const result = route.handle(ctx);
      expect(result).to.be.eq('OK');
    });
  });
});
