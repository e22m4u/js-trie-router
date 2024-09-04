import {expect} from './chai.js';
import {format} from '@e22m4u/js-format';
import {RequestContext} from './request-context.js';
import {ServiceContainer} from '@e22m4u/js-service';
import {createRequestMock} from './utils/create-request-mock.js';
import {createResponseMock} from './utils/create-response-mock.js';

describe('RequestContext', function () {
  describe('constructor', function () {
    it('requires the parameter "container" to be the ServiceContainer', function () {
      const req = createRequestMock();
      const res = createResponseMock();
      const throwable = v => () => new RequestContext(v, req, res);
      const error = v =>
        format(
          'The parameter "container" of RequestContext.constructor ' +
            'should be an instance of ServiceContainer, but %s given.',
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
      const cnt = new ServiceContainer();
      const throwable = v => () => new RequestContext(cnt, v, res);
      const error = v =>
        format(
          'The parameter "request" of RequestContext.constructor ' +
            'should be an instance of IncomingMessage, but %s given.',
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
      const cnt = new ServiceContainer();
      const throwable = v => () => new RequestContext(cnt, req, v);
      const error = v =>
        format(
          'The parameter "response" of RequestContext.constructor ' +
            'should be an instance of ServerResponse, but %s given.',
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
      const cnt = new ServiceContainer();
      const ctx = new RequestContext(cnt, req, res);
      expect(ctx.container).to.be.eq(cnt);
      expect(ctx.req).to.be.eq(req);
      expect(ctx.res).to.be.eq(res);
    });
  });
});
