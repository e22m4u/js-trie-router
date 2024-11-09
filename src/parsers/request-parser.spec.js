import {expect} from '../chai.js';
import {HttpMethod} from '../route.js';
import {format} from '@e22m4u/js-format';
import {RequestParser} from './request-parser.js';
import {createRequestMock} from '../utils/index.js';

describe('RequestParser', function () {
  describe('parse', function () {
    it('requires the first argument to be an instance of IncomingMessage', function () {
      const s = new RequestParser();
      const throwable = v => () => s.parse(v);
      const error = v =>
        format(
          'The first argument of RequestParser.parse should be ' +
            'an instance of IncomingMessage, but %s given.',
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

    it('returns the result object if no request body to parse', function () {
      const s = new RequestParser();
      const req = createRequestMock();
      const res = s.parse(req);
      expect(res).to.be.eql({
        query: {},
        cookie: {},
        body: undefined,
        headers: {host: 'localhost'},
      });
    });

    it('returns a Promise of the result object in case of the body parsing', async function () {
      const s = new RequestParser();
      const body = 'Lorem Ipsum is simply dummy text.';
      const req = createRequestMock({
        method: HttpMethod.POST,
        headers: {'content-type': 'text/plain'},
        body,
      });
      const promise = s.parse(req);
      expect(promise).to.be.instanceof(Promise);
      const res = await promise;
      expect(res).to.be.eql({
        query: {},
        cookie: {},
        body,
        headers: {
          host: 'localhost',
          'content-type': 'text/plain',
          'content-length': String(Buffer.from(body).byteLength),
        },
      });
    });

    it('returns the parsed query in the result object', function () {
      const s = new RequestParser();
      const req = createRequestMock({path: '/path?p1=foo&p2=bar'});
      const res = s.parse(req);
      expect(res).to.be.eql({
        query: {p1: 'foo', p2: 'bar'},
        cookie: {},
        body: undefined,
        headers: {host: 'localhost'},
      });
    });

    it('returns the parsed cookie in the result object', function () {
      const s = new RequestParser();
      const req = createRequestMock({headers: {cookie: 'p1=foo; p2=bar;'}});
      const res = s.parse(req);
      expect(res).to.be.eql({
        query: {},
        cookie: {p1: 'foo', p2: 'bar'},
        body: undefined,
        headers: {
          host: 'localhost',
          cookie: 'p1=foo; p2=bar;',
        },
      });
    });

    it('returns the parsed body of the media type "text/plain" in the result object', async function () {
      const s = new RequestParser();
      const body = 'Lorem Ipsum is simply dummy text.';
      const req = createRequestMock({
        method: HttpMethod.POST,
        headers: {'content-type': 'text/plain'},
        body,
      });
      const res = await s.parse(req);
      expect(res).to.be.eql({
        query: {},
        cookie: {},
        body,
        headers: {
          host: 'localhost',
          'content-type': 'text/plain',
          'content-length': String(Buffer.from(body).byteLength),
        },
      });
    });

    it('returns the parsed body of the media type "application/json" in the result object', async function () {
      const s = new RequestParser();
      const body = {foo: 'bar', baz: 'qux'};
      const json = JSON.stringify(body);
      const req = createRequestMock({
        method: HttpMethod.POST,
        headers: {'content-type': 'application/json'},
        body,
      });
      const res = await s.parse(req);
      expect(res).to.be.eql({
        query: {},
        cookie: {},
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
