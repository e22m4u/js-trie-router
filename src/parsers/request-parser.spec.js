import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {HttpMethod} from '../route/index.js';
import {RequestParser} from './request-parser.js';
import {createRequestMock} from '../utils/index.js';

describe('RequestParser', function () {
  describe('parse', function () {
    it('should require the parameter "request" to be an instance of IncomingMessage', function () {
      const S = new RequestParser();
      const throwable = v => () => S.parse(v);
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
      expect(throwable(() => undefined)).to.throw(error('Function'));
      throwable(createRequestMock())();
    });

    it('should return the result object when the request does not have a body', function () {
      const S = new RequestParser();
      const req = createRequestMock();
      const res = S.parse(req);
      expect(res).to.be.eql({
        query: {},
        cookies: {},
        body: undefined,
        headers: {host: 'localhost'},
      });
    });

    it('should return a Promise of the result object in case of the body parsing', async function () {
      const S = new RequestParser();
      const body = 'Lorem Ipsum is simply dummy text.';
      const req = createRequestMock({
        method: HttpMethod.POST,
        headers: {'content-type': 'text/plain'},
        body,
      });
      const promise = S.parse(req);
      expect(promise).to.be.instanceof(Promise);
      const res = await promise;
      expect(res).to.be.eql({
        query: {},
        cookies: {},
        body,
        headers: {
          host: 'localhost',
          'content-type': 'text/plain',
          'content-length': String(Buffer.from(body).byteLength),
        },
      });
    });

    it('should return the result object with the parsed query', function () {
      const S = new RequestParser();
      const req = createRequestMock({path: '/path?p1=foo&p2=bar'});
      const res = S.parse(req);
      expect(res).to.be.eql({
        query: {p1: 'foo', p2: 'bar'},
        cookies: {},
        body: undefined,
        headers: {host: 'localhost'},
      });
    });

    it('should return the result object with parsed cookies', function () {
      const S = new RequestParser();
      const req = createRequestMock({headers: {cookie: 'p1=foo; p2=bar;'}});
      const res = S.parse(req);
      expect(res).to.be.eql({
        query: {},
        cookies: {p1: 'foo', p2: 'bar'},
        body: undefined,
        headers: {
          host: 'localhost',
          cookie: 'p1=foo; p2=bar;',
        },
      });
    });

    it('should parse "text/plain" body correctly', async function () {
      const S = new RequestParser();
      const body = 'Lorem Ipsum is simply dummy text.';
      const req = createRequestMock({
        method: HttpMethod.POST,
        headers: {'content-type': 'text/plain'},
        body,
      });
      const res = await S.parse(req);
      expect(res).to.be.eql({
        query: {},
        cookies: {},
        body,
        headers: {
          host: 'localhost',
          'content-type': 'text/plain',
          'content-length': String(Buffer.from(body).byteLength),
        },
      });
    });

    it('should parse "application/json" body correctly', async function () {
      const S = new RequestParser();
      const body = {foo: 'bar', baz: 'qux'};
      const json = JSON.stringify(body);
      const req = createRequestMock({
        method: HttpMethod.POST,
        headers: {'content-type': 'application/json'},
        body,
      });
      const res = await S.parse(req);
      expect(res).to.be.eql({
        query: {},
        cookies: {},
        body,
        headers: {
          host: 'localhost',
          'content-type': 'application/json',
          'content-length': String(Buffer.from(json).byteLength),
        },
      });
    });
  });
});
