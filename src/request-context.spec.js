import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {RequestContext} from './request-context.js';
import {ServiceContainer} from '@e22m4u/js-service';

import {
  createRouteMock,
  createRequestMock,
  createResponseMock,
} from './utils/index.js';

describe('RequestContext', function () {
  describe('constructor', function () {
    it('should require the parameter "container" to be an instance of ServiceContainer', function () {
      const req = createRequestMock();
      const res = createResponseMock();
      const route = createRouteMock();
      const throwable = v => () => new RequestContext(v, req, res, route);
      const error = v =>
        format(
          'Parameter "container" must be an instance of ServiceContainer, ' +
            'but %s was given.',
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
      throwable(new ServiceContainer())();
    });

    it('should require the parameter "request" to be an instance of IncomingMessage', function () {
      const res = createResponseMock();
      const route = createRouteMock();
      const cont = new ServiceContainer();
      const throwable = v => () => new RequestContext(cont, v, res, route);
      const error = v =>
        format(
          'Parameter "request" must be an instance of IncomingMessage, ' +
            'but %s was given.',
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
      throwable(createRequestMock())();
    });

    it('should require the parameter "response" to be an instance of ServerResponse', function () {
      const req = createRequestMock();
      const route = createRouteMock();
      const cont = new ServiceContainer();
      const throwable = v => () => new RequestContext(cont, req, v, route);
      const error = v =>
        format(
          'Parameter "response" must be an instance of ServerResponse, ' +
            'but %s was given.',
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
      throwable(createResponseMock())();
    });

    it('should require the parameter "route" to be an instance of Route', function () {
      const req = createRequestMock();
      const res = createResponseMock();
      const cont = new ServiceContainer();
      const throwable = v => () => new RequestContext(cont, req, res, v);
      const error = v =>
        format(
          'Parameter "route" must be an instance of Route, but %s was given.',
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
      throwable(createRouteMock())();
    });

    it('should set properties from provided arguments', function () {
      const req = createRequestMock();
      const res = createResponseMock();
      const route = createRouteMock();
      const cont = new ServiceContainer();
      const ctx = new RequestContext(cont, req, res, route);
      expect(ctx.container).to.be.eq(cont);
      expect(ctx.request).to.be.eq(req);
      expect(ctx.response).to.be.eq(res);
    });
  });

  describe('method', function () {
    it('should return the method name in upper case', function () {
      const req = createRequestMock({method: 'post'});
      const res = createResponseMock();
      const route = createRouteMock();
      const cont = new ServiceContainer();
      const ctx = new RequestContext(cont, req, res, route);
      expect(ctx.method).to.be.eq('POST');
    });
  });

  describe('path', function () {
    it('should return the request pathname with the query string', function () {
      const req = createRequestMock({url: '/pathname?foo=bar'});
      const res = createResponseMock();
      const route = createRouteMock();
      const cont = new ServiceContainer();
      const ctx = new RequestContext(cont, req, res, route);
      expect(req.url).to.be.eq('/pathname?foo=bar');
      expect(ctx.path).to.be.eq('/pathname?foo=bar');
    });
  });

  describe('pathname', function () {
    it('should return the request pathname without the query string', function () {
      const req = createRequestMock({url: '/pathname?foo=bar'});
      const res = createResponseMock();
      const route = createRouteMock();
      const cont = new ServiceContainer();
      const ctx = new RequestContext(cont, req, res, route);
      expect(req.url).to.be.eq('/pathname?foo=bar');
      expect(ctx.pathname).to.be.eq('/pathname');
    });

    it('should set the cache to the property "_pathname" and use it for the next access', function () {
      const req = createRequestMock({url: '/pathname'});
      const res = createResponseMock();
      const route = createRouteMock();
      const cont = new ServiceContainer();
      const ctx = new RequestContext(cont, req, res, route);
      expect(ctx._pathname).to.be.undefined;
      expect(ctx.pathname).to.be.eq('/pathname');
      expect(ctx._pathname).to.be.eq('/pathname');
      ctx._pathname = '/overridden';
      expect(ctx.pathname).to.be.eq('/overridden');
    });
  });

  describe('state', function () {
    it('should has an empty object by default', function () {
      const req = createRequestMock({url: '/pathname'});
      const res = createResponseMock();
      const route = createRouteMock();
      const cont = new ServiceContainer();
      const ctx = new RequestContext(cont, req, res, route);
      expect(ctx.state).to.be.eql({});
    });
  });
});
