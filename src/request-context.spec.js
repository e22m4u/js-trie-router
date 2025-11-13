import {expect} from './chai.js';
import {format} from '@e22m4u/js-format';
import {createRequestMock} from './utils/index.js';
import {RequestContext} from './request-context.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {createResponseMock} from './utils/index.js';

describe('RequestContext', function () {
  describe('constructor', function () {
    it('requires the parameter "container" to be the ServiceContainer', function () {
      const req = createRequestMock();
      const res = createResponseMock();
      const throwable = v => () => new RequestContext(v, req, res);
      const error = v =>
        format(
          'The parameter "container" of RequestContext.constructor ' +
            'should be an instance of ServiceContainer, but %s was given.',
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

    it('requires the parameter "request" to be the ServiceContainer', function () {
      const res = createResponseMock();
      const cont = new ServiceContainer();
      const throwable = v => () => new RequestContext(cont, v, res);
      const error = v =>
        format(
          'The parameter "request" of RequestContext.constructor ' +
            'should be an instance of IncomingMessage, but %s was given.',
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

    it('requires the parameter "response" to be the ServiceContainer', function () {
      const req = createRequestMock();
      const cont = new ServiceContainer();
      const throwable = v => () => new RequestContext(cont, req, v);
      const error = v =>
        format(
          'The parameter "response" of RequestContext.constructor ' +
            'should be an instance of ServerResponse, but %s was given.',
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

    it('sets properties from given arguments', function () {
      const req = createRequestMock();
      const res = createResponseMock();
      const cont = new ServiceContainer();
      const ctx = new RequestContext(cont, req, res);
      expect(ctx.cont).to.be.eq(cont);
      expect(ctx.req).to.be.eq(req);
      expect(ctx.res).to.be.eq(res);
    });

    it('sets an empty object to the "meta" property', function () {
      const req = createRequestMock();
      const res = createResponseMock();
      const cont = new ServiceContainer();
      const ctx = new RequestContext(cont, req, res);
      expect(ctx.meta).to.be.eql({});
    });
  });

  describe('method', function () {
    it('returns the method name in upper case', function () {
      const req = createRequestMock({method: 'post'});
      const res = createResponseMock();
      const cont = new ServiceContainer();
      const ctx = new RequestContext(cont, req, res);
      expect(ctx.method).to.be.eq('POST');
    });
  });

  describe('path', function () {
    it('returns the request pathname with the query string', function () {
      const req = createRequestMock({path: '/pathname?foo=bar'});
      const res = createResponseMock();
      const cont = new ServiceContainer();
      const ctx = new RequestContext(cont, req, res);
      expect(req.url).to.be.eq('/pathname?foo=bar');
      expect(ctx.path).to.be.eq('/pathname?foo=bar');
    });
  });

  describe('pathname', function () {
    it('returns the request pathname without the query string', function () {
      const req = createRequestMock({path: '/pathname?foo=bar'});
      const res = createResponseMock();
      const cont = new ServiceContainer();
      const ctx = new RequestContext(cont, req, res);
      expect(req.url).to.be.eq('/pathname?foo=bar');
      expect(ctx.pathname).to.be.eq('/pathname');
    });

    it('sets the cache to the "_pathname" property and uses is for next accesses', function () {
      const req = createRequestMock({path: '/pathname'});
      const res = createResponseMock();
      const cont = new ServiceContainer();
      const ctx = new RequestContext(cont, req, res);
      expect(ctx._pathname).to.be.undefined;
      expect(ctx.pathname).to.be.eq('/pathname');
      expect(ctx._pathname).to.be.eq('/pathname');
      ctx._pathname = '/overridden';
      expect(ctx.pathname).to.be.eq('/overridden');
    });
  });
});
