import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {ROOT_PATH} from '../constants.js';
import {Route, HttpMethod} from './route.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {RequestContext} from '../request-context.js';
import {RouterHookRegistry, RouterHookType} from '../hooks/index.js';
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
        handler: () => 'Ok',
      })();
    });

    it('should require the "method" option to be a non-empty String', function () {
      const throwable = v => () =>
        new Route({
          method: v,
          path: ROOT_PATH,
          handler: () => 'Ok',
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
        new Route({
          method: HttpMethod.GET,
          path: v,
          handler: () => 'Ok',
        });
      const error = v =>
        format('Option "path" must be a String, but %s was given.', v);
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

    it('should require the "path" option to start with a forward slash', function () {
      const throwable = v => () =>
        new Route({
          method: HttpMethod.GET,
          path: v,
          handler: () => 'Ok',
        });
      const error = s =>
        format('Option "path" must start with "/", but %s was given.', s);
      expect(throwable('path')).to.throw(error('"path"'));
      expect(throwable('')).to.throw(error('""'));
      throwable('/path')();
      throwable('/')();
    });

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

    it('should require the "preHandler" option to be a Function or an Array', function () {
      const throwable = v => () =>
        new Route({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler: v,
          handler: () => 'Ok',
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

    it('should require each element in the "preHandler" option to be a Function', function () {
      const throwable = v => () =>
        new Route({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler: [v],
          handler: () => 'Ok',
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

    it('should require the "postHandler" option to be a Function or an Array', function () {
      const throwable = v => () =>
        new Route({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          postHandler: v,
          handler: () => 'Ok',
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

    it('should require each element in the "postHandler" option to be a Function', function () {
      const throwable = v => () =>
        new Route({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          postHandler: [v],
          handler: () => 'Ok',
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
        new Route({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          handler: () => 'Ok',
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

    it('should clone a given definition in the current instance', function () {
      const definition = {
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => 'Ok',
      };
      const route = new Route(definition);
      const res = route.getDefinition();
      expect(res).to.be.eql(definition);
      expect(res).to.be.not.eq(definition);
    });

    it('should convert the "method" option to upper case', function () {
      const definition = {
        method: 'get',
        path: ROOT_PATH,
        handler: () => 'Ok',
      };
      const route = new Route(definition);
      const res = route.getDefinition();
      expect(res.method).to.be.eq('GET');
    });

    it('should add a single pre-handler to the hook registry', function () {
      const preHandler = () => undefined;
      const definition = {
        method: 'get',
        path: ROOT_PATH,
        handler: () => 'Ok',
        preHandler,
      };
      const route = new Route(definition);
      const hookReg = route.getHookRegistry();
      const res = hookReg.hasHook(RouterHookType.PRE_HANDLER, preHandler);
      expect(res).to.be.true;
    });

    it('should add each pre-handler from the array to the hook registry', function () {
      const preHandler1 = () => undefined;
      const preHandler2 = () => undefined;
      const definition = {
        method: 'get',
        path: ROOT_PATH,
        handler: () => 'Ok',
        preHandler: [preHandler1, preHandler2],
      };
      const route = new Route(definition);
      const hookReg = route.getHookRegistry();
      const res1 = hookReg.hasHook(RouterHookType.PRE_HANDLER, preHandler1);
      const res2 = hookReg.hasHook(RouterHookType.PRE_HANDLER, preHandler2);
      expect(res1).to.be.true;
      expect(res2).to.be.true;
    });

    it('should add a single post-handler to the hook registry', function () {
      const postHandler = () => undefined;
      const definition = {
        method: 'get',
        path: ROOT_PATH,
        handler: () => 'Ok',
        postHandler,
      };
      const route = new Route(definition);
      const hookReg = route.getHookRegistry();
      const res = hookReg.hasHook(RouterHookType.POST_HANDLER, postHandler);
      expect(res).to.be.true;
    });

    it('should add each post-handlers from the array to the hook registry', function () {
      const postHandler1 = () => undefined;
      const postHandler2 = () => undefined;
      const definition = {
        method: 'get',
        path: ROOT_PATH,
        handler: () => 'Ok',
        postHandler: [postHandler1, postHandler2],
      };
      const route = new Route(definition);
      const hookReg = route.getHookRegistry();
      const res1 = hookReg.hasHook(RouterHookType.POST_HANDLER, postHandler1);
      const res2 = hookReg.hasHook(RouterHookType.POST_HANDLER, postHandler2);
      expect(res1).to.be.true;
      expect(res2).to.be.true;
    });
  });

  describe('getDefinition', function () {
    it('should return a clone of the original route definition', function () {
      const definition = {
        method: HttpMethod.GET,
        path: '/myPath',
        handler: () => 'Ok',
      };
      const route = new Route(definition);
      expect(route.getDefinition()).to.be.eql(definition);
    });
  });

  describe('getHookRegistry', function () {
    it('should return the same hook registry instance on subsequent calls', function () {
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => 'Ok',
      });
      const res1 = route.getHookRegistry();
      const res2 = route.getHookRegistry();
      expect(res1).to.be.instanceOf(RouterHookRegistry);
      expect(res2).to.be.eq(res1);
    });
  });

  describe('method', function () {
    it('should return a value of the "method" option', function () {
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => 'Ok',
      });
      expect(route.method).to.be.eq(HttpMethod.GET);
    });
  });

  describe('path', function () {
    it('should return a value of the "path" option', function () {
      const value = '/myPath';
      const route = new Route({
        method: HttpMethod.GET,
        path: value,
        handler: () => 'Ok',
      });
      expect(route.path).to.be.eq(value);
    });
  });

  describe('meta', function () {
    it('should return a value of the "meta" option', function () {
      const value = {foo: 'bar'};
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => 'Ok',
        meta: value,
      });
      expect(route.meta).to.be.eql(value);
    });

    it('should return an empty object if the "meta" option is not provided', function () {
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => 'Ok',
      });
      expect(route.meta).to.be.eql({});
    });

    it('should return an empty object if the "meta" option is undefined', function () {
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => 'Ok',
        meta: undefined,
      });
      expect(route.meta).to.be.eql({});
    });
  });

  describe('handler', function () {
    it('should return a value of the "handler" option', function () {
      const value = () => 'Ok';
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: value,
      });
      expect(route.handler).to.be.eq(value);
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
