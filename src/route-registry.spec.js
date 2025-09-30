import {Route} from './route.js';
import {expect} from './chai.js';
import {HttpMethod} from './route.js';
import {format} from '@e22m4u/js-format';
import {RouteRegistry} from './route-registry.js';
import {ServiceContainer} from '@e22m4u/js-service';

describe('RouteRegistry', function () {
  describe('defineRoute', function () {
    it('requires the first parameter to be an Object', function () {
      const s = new RouteRegistry();
      const throwable = v => () => s.defineRoute(v);
      const error = v =>
        format(
          'The route definition should be an Object, but %s was given.',
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
        path: '/path',
        handler: () => undefined,
      })();
    });

    it('returns a new route with the given "method", "path" and "handler"', function () {
      const s = new RouteRegistry();
      const method = HttpMethod.PATCH;
      const path = '/myPath';
      const handler = () => undefined;
      const route = s.defineRoute({method, path, handler});
      expect(route.method).to.be.eq(method);
      expect(route.path).to.be.eq(path);
      expect(route.handler).to.be.eq(handler);
    });

    it('adds a new route to the Trie', function () {
      const s = new RouteRegistry();
      const method = HttpMethod.PATCH;
      const path = '/myPath';
      const handler = () => undefined;
      const route = s.defineRoute({method, path, handler});
      const triePath = `${method}/${path}`;
      const res = s._trie.match(triePath);
      expect(typeof res).to.be.eq('object');
      expect(res.value).to.be.eq(route);
    });
  });

  describe('matchRouteByRequest', function () {
    it('returns the route and parsed parameters', function () {
      const s = new RouteRegistry(new ServiceContainer());
      const handler = () => undefined;
      s.defineRoute({
        method: HttpMethod.GET,
        path: '/foo/:p1/bar/:p2',
        handler,
      });
      const res = s.matchRouteByRequest({
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
});
