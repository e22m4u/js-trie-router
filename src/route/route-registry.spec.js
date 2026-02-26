import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {Route, HttpMethod} from './route.js';
import {RouteRegistry} from './route-registry.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {RouterHookRegistry, RouterHookType} from '../hooks/index.js';

describe('RouteRegistry', function () {
  describe('defineRoute', function () {
    it('should require the parameter "routeDef" to be an Object', function () {
      const S = new RouteRegistry();
      const throwable = v => () => S.defineRoute(v);
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
        path: '/path',
        handler: () => undefined,
      })();
    });

    it('should return a new route with the given "method", "path" and "handler"', function () {
      const S = new RouteRegistry();
      const method = HttpMethod.PATCH;
      const path = '/myPath';
      const handler = () => undefined;
      const route = S.defineRoute({method, path, handler});
      expect(route.method).to.be.eq(method);
      expect(route.path).to.be.eq(path);
      expect(route.handler).to.be.eq(handler);
    });

    it('should add a new route to the routes trie', function () {
      const S = new RouteRegistry();
      const method = HttpMethod.PATCH;
      const path = '/myPath';
      const handler = () => undefined;
      const route = S.defineRoute({method, path, handler});
      const triePath = `${method}/${path}`;
      const res = S._trie.match(triePath);
      expect(typeof res).to.be.eq('object');
      expect(res.value).to.be.eq(route);
    });

    it('should invoke "onDefineRoute" hooks with arguments and correct order', function () {
      const S = new RouteRegistry();
      const routeDef = {
        method: HttpMethod.GET,
        path: '/myPath',
        handler: () => undefined,
      };
      const order = [];
      const onDefineRouteHook1 = (...args) => {
        order.push(1);
        expect(args[0]).to.be.eql(routeDef);
        expect(args[1]).to.be.eq(S.container);
      };
      const onDefineRouteHook2 = (...args) => {
        order.push(2);
        expect(args[0]).to.be.eql(routeDef);
        expect(args[1]).to.be.eq(S.container);
      };
      const hooksRegistry = S.getService(RouterHookRegistry);
      hooksRegistry.addHook(RouterHookType.ON_DEFINE_ROUTE, onDefineRouteHook1);
      hooksRegistry.addHook(RouterHookType.ON_DEFINE_ROUTE, onDefineRouteHook2);
      S.defineRoute(routeDef);
      expect(order).to.be.eql([1, 2]);
    });

    it('should allow override the route definition by "onDefineRoute" hooks', function () {
      const S = new RouteRegistry();
      const routeDef = {
        method: HttpMethod.GET,
        path: '/myPath',
        handler: () => undefined,
      };
      const order = [];
      const onDefineRouteHook1 = def => {
        order.push(1);
        return {...def, path: def.path + '/1'};
      };
      const onDefineRouteHook2 = def => {
        order.push(2);
        return {...def, path: def.path + '/2'};
      };
      const hooksRegistry = S.getService(RouterHookRegistry);
      hooksRegistry.addHook(RouterHookType.ON_DEFINE_ROUTE, onDefineRouteHook1);
      hooksRegistry.addHook(RouterHookType.ON_DEFINE_ROUTE, onDefineRouteHook2);
      const route = S.defineRoute(routeDef);
      expect(route.path).to.be.eql('/myPath/1/2');
      expect(order).to.be.eql([1, 2]);
    });

    it('should require the hook "onDefineRoute" return an Object or undefined', function () {
      const routeDef = {
        method: HttpMethod.GET,
        path: '/myPath',
        handler: () => undefined,
      };
      const throwable = v => () => {
        const S = new RouteRegistry();
        const hooksRegistry = S.getService(RouterHookRegistry);
        hooksRegistry.addHook(RouterHookType.ON_DEFINE_ROUTE, () => v);
        S.defineRoute(routeDef);
      };
      const error = s =>
        format(
          'Hook "onDefineRoute" must return an Object or undefined, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(routeDef)();
      throwable(undefined)();
    });
  });

  describe('matchRouteByRequest', function () {
    it('should return the route and parsed parameters', function () {
      const S = new RouteRegistry();
      const handler = () => undefined;
      S.defineRoute({
        method: HttpMethod.GET,
        path: '/foo/:p1/bar/:p2',
        handler,
      });
      const res = S.matchRouteByRequest({
        url: '/foo/baz/bar/qux',
        method: HttpMethod.GET,
      });
      expect(typeof res).to.be.eq('object');
      expect(res.route).to.be.instanceof(Route);
      expect(res.route.method).to.be.eq(HttpMethod.GET);
      expect(res.route.path).to.be.eq('/foo/:p1/bar/:p2');
      expect(res.route.handler).to.be.eq(handler);
      expect(res.params).to.be.eql({p1: 'baz', p2: 'qux'});
    });
  });

  describe('getAllowedMethodsForRequestPath', function () {
    it('should require the parameter "requestPath" to be a String', function () {
      const S = new RouteRegistry();
      const throwable = v => () => S.getAllowedMethodsForRequestPath(v);
      const error = v =>
        format(
          'Parameter "requestPath" must be a String, but %s was given.',
          v,
        );
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
      throwable('str')();
      throwable('')();
    });

    it('should return an empty array if no routes match the path', function () {
      const S = new RouteRegistry(new ServiceContainer());
      S.defineRoute({
        method: HttpMethod.GET,
        path: '/foo',
        handler: () => undefined,
      });
      const res = S.getAllowedMethodsForRequestPath('/bar');
      expect(res).to.be.eql([]);
    });

    it('should return an array with a single method if only one matches', function () {
      const S = new RouteRegistry(new ServiceContainer());
      S.defineRoute({
        method: HttpMethod.POST,
        path: '/foo',
        handler: () => undefined,
      });
      const res = S.getAllowedMethodsForRequestPath('/foo');
      expect(res).to.be.eql([HttpMethod.POST]);
    });

    it('should return an array with multiple methods if several routes match the path', function () {
      const S = new RouteRegistry(new ServiceContainer());
      const handler = () => undefined;
      S.defineRoute({method: HttpMethod.GET, path: '/foo', handler});
      S.defineRoute({method: HttpMethod.POST, path: '/foo', handler});
      S.defineRoute({method: HttpMethod.DELETE, path: '/foo', handler});
      const res = S.getAllowedMethodsForRequestPath('/foo');
      expect(res).to.be.eql([
        HttpMethod.GET,
        HttpMethod.POST,
        HttpMethod.DELETE,
      ]);
    });

    it('should correctly resolve allowed methods for paths with parameters', function () {
      const S = new RouteRegistry(new ServiceContainer());
      const handler = () => undefined;
      S.defineRoute({method: HttpMethod.GET, path: '/users/:id', handler});
      S.defineRoute({method: HttpMethod.PUT, path: '/users/:id', handler});
      S.defineRoute({method: HttpMethod.POST, path: '/users', handler});
      const res = S.getAllowedMethodsForRequestPath('/users/123');
      expect(res).to.be.eql([HttpMethod.GET, HttpMethod.PUT]);
    });

    it('should distinguish between paths with and without trailing slash', function () {
      const S = new RouteRegistry(new ServiceContainer());
      const handler = () => undefined;
      S.defineRoute({method: HttpMethod.GET, path: '/foo', handler});
      S.defineRoute({method: HttpMethod.POST, path: '/foo/', handler});
      const res1 = S.getAllowedMethodsForRequestPath('/foo');
      expect(res1).to.be.eql([HttpMethod.GET]);
      const res2 = S.getAllowedMethodsForRequestPath('/foo/');
      expect(res2).to.be.eql([HttpMethod.POST]);
    });

    it('should check for the explicitly defined OPTIONS method', function () {
      const S = new RouteRegistry(new ServiceContainer());
      S.defineRoute({
        method: HttpMethod.OPTIONS,
        path: '/api',
        handler: () => undefined,
      });
      const res = S.getAllowedMethodsForRequestPath('/api');
      expect(res).to.be.eql([HttpMethod.OPTIONS]);
    });
  });
});
