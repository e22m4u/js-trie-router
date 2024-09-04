import {describe} from 'mocha';
import {expect} from '../chai.js';
import {PassThrough} from 'stream';
import {createResponseMock} from './create-response-mock.js';

describe('createResponseMock', function () {
  it('returns an instance of PassThrough', function () {
    const res = createResponseMock();
    expect(res).to.be.instanceof(PassThrough);
  });

  describe('setEncoding', function () {
    it('sets the given encoding and returns the response', function () {
      const res = createResponseMock();
      expect(res._encoding).to.be.undefined;
      const ret = res.setEncoding('utf-8');
      expect(ret).to.be.eq(res);
      expect(res._encoding).to.be.eq('utf-8');
    });
  });

  describe('getEncoding', function () {
    it('returns encoding', function () {
      const res = createResponseMock();
      expect(res._encoding).to.be.undefined;
      const ret1 = res.getEncoding();
      expect(ret1).to.be.undefined;
      res._encoding = 'utf-8';
      const ret2 = res.getEncoding();
      expect(ret2).to.be.eq('utf-8');
    });
  });

  describe('headersSent', function () {
    it('returns false if the response is not sent', function () {
      const res = createResponseMock();
      expect(res._headersSent).to.be.false;
      expect(res.headersSent).to.be.false;
    });

    it('returns a value of the "_headersSent" property', function () {
      const res = createResponseMock();
      expect(res._headersSent).to.be.false;
      expect(res.headersSent).to.be.false;
      res._headersSent = true;
      expect(res.headersSent).to.be.true;
    });
  });

  describe('setHeader', function () {
    it('sets the given header and returns the response', function () {
      const res = createResponseMock();
      expect(res._headers['foo']).to.be.eq(undefined);
      const ret = res.setHeader('foo', 'bar');
      expect(ret).to.be.eq(res);
      expect(res._headers['foo']).to.be.eq('bar');
    });

    it('throws an error if headers is sent', function () {
      const res = createResponseMock();
      res._headersSent = true;
      const throwable = () => res.setHeader('foo');
      expect(throwable).to.throw(
        'Error [ERR_HTTP_HEADERS_SENT]: ' +
          'Cannot set headers after they are sent to the client',
      );
    });

    it('sets the header value as a string', function () {
      const res = createResponseMock();
      expect(res._headers['num']).to.be.eq(undefined);
      const ret = res.setHeader('num', 10);
      expect(ret).to.be.eq(res);
      expect(res._headers['num']).to.be.eq('10');
    });
  });

  describe('getHeader', function () {
    it('returns the header value if exists', function () {
      const res = createResponseMock();
      res._headers['foo'] = 'bar';
      const ret = res.getHeader('foo');
      expect(ret).to.be.eq('bar');
    });

    it('uses case-insensitivity lookup', function () {
      const res = createResponseMock();
      res._headers['foo'] = 'bar';
      const ret = res.getHeader('FOO');
      expect(ret).to.be.eq('bar');
    });
  });

  describe('getHeaders', function () {
    it('returns a copy of the headers object', function () {
      const res = createResponseMock();
      const ret1 = res.getHeaders();
      res._headers['foo'] = 'bar';
      res._headers['baz'] = 'qux';
      const ret2 = res.getHeaders();
      expect(ret1).to.be.eql({});
      expect(ret2).to.be.eql({foo: 'bar', baz: 'qux'});
      expect(ret1).not.to.be.eq(res._headers);
      expect(ret2).not.to.be.eq(res._headers);
    });
  });

  describe('getBody', function () {
    it('returns a promise of the stream content', async function () {
      const body = 'Lorem Ipsum is simply dummy text.';
      const res = createResponseMock();
      res.end(body);
      const promise = res.getBody();
      expect(promise).to.be.instanceof(Promise);
      await expect(promise).to.eventually.be.eq(body);
    });
  });

  describe('Stream', function () {
    it('sets "headerSent" to true when the stream ends', function (done) {
      const res = createResponseMock();
      expect(res.headersSent).to.be.false;
      res.on('end', () => {
        expect(res.headersSent).to.be.true;
        done();
      });
      res.end('test');
    });
  });
});
