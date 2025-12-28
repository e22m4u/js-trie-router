import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {ROOT_PATH} from '../constants.js';
import {Route, HttpMethod} from './route.js';
import {RouterHookType} from '../hooks/index.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {RequestContext} from '../request-context.js';
import {createRequestMock, createResponseMock} from '../utils/index.js';

describe('Route', function () {
  describe('constructor', function () {
    it('should require the "routeDef" parameter to be an Object', function () {
      const throwable = v => () => new Route(v);
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
        path: ROOT_PATH,
        handler: () => undefined,
      })();
    });

    describe('the "method" option', function () {
      it('should require the "method" option to be a non-empty String', function () {
        const throwable = v => () =>
          new Route({
            method: v,
            path: ROOT_PATH,
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

      it('should set the "method" option to the "method" property in upper case', function () {
        const route = new Route({
          method: 'post',
          path: ROOT_PATH,
          handler: () => undefined,
        });
        expect(route.method).to.be.eq('POST');
      });
    });

    describe('the "path" option', function () {
      it('should require the "path" option to be a non-empty String', function () {
        const throwable = v => () =>
          new Route({
            method: HttpMethod.GET,
            path: v,
            handler: () => undefined,
          });
        const error = v =>
          format(
            'Option "path" must be a non-empty String, but %s was given.',
            v,
          );
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

      it('should set the "path" option to the "path" property', function () {
        const value = '/myPath';
        const route = new Route({
          method: HttpMethod.GET,
          path: value,
          handler: () => undefined,
        });
        expect(route.path).to.be.eq(value);
      });
    });

    describe('the "handler" option', function () {
      it('should require the "handler" option to be a Function', function () {
        const throwable = v => () =>
          new Route({
            method: HttpMethod.GET,
            path: ROOT_PATH,
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

      it('should set the "handler" option to the "handler" property', function () {
        const value = () => undefined;
        const route = new Route({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          handler: value,
        });
        expect(route.handler).to.be.eq(value);
      });
    });

    describe('the "preHandler" option', function () {
      it('should require the "preHandler" option to be a Function or an Array of Function', function () {
        const throwable = v => () =>
          new Route({
            method: HttpMethod.GET,
            path: ROOT_PATH,
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
          new Route({
            method: HttpMethod.GET,
            path: ROOT_PATH,
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

      it('should add a Function to "preHandler" hooks', function () {
        const value = () => undefined;
        const route = new Route({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler: value,
          handler: () => undefined,
        });
        expect(route.hookRegistry.hasHook(RouterHookType.PRE_HANDLER, value)).to
          .be.true;
      });

      it('should add a Function Array to "preHandler" hooks', function () {
        const value = [() => undefined, () => undefined];
        const route = new Route({
          method: HttpMethod.GET,
          path: ROOT_PATH,
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
      it('should require the "postHandler" option to be a Function or an Array of Function', function () {
        const throwable = v => () =>
          new Route({
            method: HttpMethod.GET,
            path: ROOT_PATH,
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
          new Route({
            method: HttpMethod.GET,
            path: ROOT_PATH,
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

      it('should add a Function to "postHandler" hooks', function () {
        const value = () => undefined;
        const route = new Route({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          handler: () => undefined,
          postHandler: value,
        });
        expect(route.hookRegistry.hasHook(RouterHookType.POST_HANDLER, value))
          .to.be.true;
      });

      it('should add a Function Array to "postHandler" hooks', function () {
        const value = [() => undefined, () => undefined];
        const route = new Route({
          method: HttpMethod.GET,
          path: ROOT_PATH,
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

    describe('the "meta" option', function () {
      it('should require the "meta" option to be a plain Object', function () {
        const throwable = v => () =>
          new Route({
            method: HttpMethod.GET,
            path: ROOT_PATH,
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

      it('should set the "meta" option to the "meta" property as a deep copy', function () {
        const metaData = {foo: {bar: {baz: 'qux'}}};
        const route = new Route({
          method: 'post',
          path: ROOT_PATH,
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

      it('should set an empty object to the "meta" property if the "meta" option is not provided', function () {
        const route = new Route({
          method: 'post',
          path: ROOT_PATH,
          handler: () => undefined,
        });
        expect(route.meta).to.be.eql({});
      });

      it('should set an empty object to the "meta" property if the "meta" option is undefined', function () {
        const route = new Route({
          method: 'post',
          path: ROOT_PATH,
          handler: () => undefined,
          meta: undefined,
        });
        expect(route.meta).to.be.eql({});
      });
    });
  });

  describe('handle', function () {
    it('should invoke the handler with the given RequestContext and return its result', function () {
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
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
