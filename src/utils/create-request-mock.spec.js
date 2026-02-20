import {Socket} from 'net';
import {Stream} from 'stream';
import {TLSSocket} from 'tls';
import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {createRequestMock} from './create-request-mock.js';
import {CHARACTER_ENCODING_LIST} from './fetch-request-body.js';

describe('createRequestMock', function () {
  it('should require the parameter "options" to be an Object', function () {
    const throwable = v => () => createRequestMock(v);
    const error = v =>
      format('The parameter "options" must be an Object, but %s was given.', v);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    throwable({})();
    throwable(undefined)();
    throwable(null)();
  });

  it('should require the parameter "host" to be a String', function () {
    const throwable = v => () => createRequestMock({host: v});
    const error = v =>
      format('The parameter "host" must be a String, but %s was given.', v);
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable({})).to.throw(error('Object'));
    throwable('str')();
    throwable('')();
    throwable(undefined)();
    throwable(null)();
  });

  it('should require the parameter "method" to be a String', function () {
    const throwable = v => () => createRequestMock({method: v});
    const error = v =>
      format('The parameter "method" must be a String, but %s was given.', v);
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable({})).to.throw(error('Object'));
    throwable('str')();
    throwable('')();
    throwable(undefined)();
    throwable(null)();
  });

  it('should require the parameter "secure" to be a Boolean', function () {
    const throwable = v => () => createRequestMock({secure: v});
    const error = v =>
      format('The parameter "secure" must be a Boolean, but %s was given.', v);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable({})).to.throw(error('Object'));
    throwable(true)();
    throwable(false)();
    throwable(undefined)();
    throwable(null)();
  });

  it('should require the parameter "path" to be a String', function () {
    const throwable = v => () => createRequestMock({path: v});
    const error = v =>
      format('The parameter "path" must be a String, but %s was given.', v);
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable({})).to.throw(error('Object'));
    throwable('str')();
    throwable('')();
    throwable(undefined)();
    throwable(null)();
  });

  it('should require the parameter "query" to be a String or Object', function () {
    const throwable = v => () => createRequestMock({query: v});
    const error = v =>
      format(
        'The parameter "query" must be a String or Object, but %s was given.',
        v,
      );
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    throwable('str')();
    throwable('')();
    throwable({foo: 'bar'})();
    throwable({})();
    throwable(undefined)();
    throwable(null)();
  });

  it('should require the parameter "cookies" to be a String or Object', function () {
    const throwable = v => () => createRequestMock({cookies: v});
    const error = v =>
      format(
        'The parameter "cookies" must be a String or Object, but %s was given.',
        v,
      );
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    throwable('str')();
    throwable('')();
    throwable({foo: 'bar'})();
    throwable({})();
    throwable(undefined)();
    throwable(null)();
  });

  it('should require the parameter "headers" to be an Object', function () {
    const throwable = v => () => createRequestMock({headers: v});
    const error = v =>
      format('The parameter "headers" must be an Object, but %s was given.', v);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    throwable({foo: 'bar'})();
    throwable({})();
    throwable(undefined)();
    throwable(null)();
  });

  it('should require the parameter "stream" to be a Stream', function () {
    const throwable = v => () => createRequestMock({stream: v});
    const error = v =>
      format('The parameter "stream" must be a Stream, but %s was given.', v);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable({})).to.throw(error('Object'));
    throwable(new Stream())();
    throwable(undefined)();
    throwable(null)();
  });

  it('should require the parameter "encoding" to be a String', function () {
    const throwable = v => () => createRequestMock({encoding: v});
    const error = v =>
      format('The parameter "encoding" must be a String, but %s was given.', v);
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable({})).to.throw(error('Object'));
    throwable('utf-8')();
    throwable(undefined)();
    throwable(null)();
  });

  it('should require the parameter "encoding" to be a correct value', function () {
    const throwable = v => () => createRequestMock({encoding: v});
    const error = v => format('Character encoding %s is not supported.', v);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    CHARACTER_ENCODING_LIST.forEach(v => throwable(v)());
  });

  it('should not allow the option "stream" with the option "secure" simultaneously', function () {
    const throwable = v => () =>
      createRequestMock({stream: new Stream(), secure: v});
    const error =
      'The option "stream" cannot be used with the option "secure" ' +
      'simultaneously.';
    expect(throwable(true)).to.throw(error);
    expect(throwable(false)).to.throw(error);
    throwable(undefined)();
    throwable(null)();
  });

  it('should not allow the option "stream" with the option "body" simultaneously', function () {
    const throwable = v => () =>
      createRequestMock({stream: new Stream(), body: v});
    const error =
      'The option "stream" cannot be used with the option "body" ' +
      'simultaneously.';
    expect(throwable('str')).to.throw(error);
    expect(throwable({foo: 'bar'})).to.throw(error);
    expect(throwable(Buffer.from('str'))).to.throw(error);
    throwable(undefined)();
    throwable(null)();
  });

  it('should not allow the option "stream" with the option "encoding" simultaneously', function () {
    const throwable = v => () =>
      createRequestMock({stream: new Stream(), encoding: v});
    const error =
      'The option "stream" cannot be used with the option "encoding" ' +
      'simultaneously.';
    expect(throwable('utf-8')).to.throw(error);
    throwable(undefined)();
    throwable(null)();
  });

  it('should use "localhost" as the default host', function () {
    const req = createRequestMock();
    expect(req.headers['host']).to.be.eq('localhost');
  });

  it('should use "GET" as the default method', function () {
    const req = createRequestMock();
    expect(req.method).to.be.eq('GET');
  });

  it('should use the Socket class by default', function () {
    const req = createRequestMock();
    expect(req.socket).to.be.instanceof(Socket);
  });

  it('should use the default path "/" without a query string', function () {
    const req = createRequestMock();
    expect(req.url).to.be.eq('/');
  });

  it('should use the header "host" by default', function () {
    const req = createRequestMock();
    expect(req.headers).to.be.eql({host: 'localhost'});
  });

  it('should use "utf-8" encoding by default', async function () {
    const body = 'test';
    const req = createRequestMock({body: Buffer.from(body)});
    const chunks = [];
    const data = await new Promise((resolve, reject) => {
      req.on('data', chunk => chunks.push(Buffer.from(chunk)));
      req.on('error', err => reject(err));
      req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
    expect(data).to.be.eql(body);
  });

  it('should use an instance of Socket when the parameter "secure" is false', function () {
    const req = createRequestMock({secure: false});
    expect(req.socket).to.be.instanceof(Socket);
  });

  it('should use an instance of TLSSocket when the parameter "secure" is true', function () {
    const req = createRequestMock({secure: true});
    expect(req.socket).to.be.instanceof(TLSSocket);
  });

  it('should pass a string body to the stream with "utf-8" encoding by default', async function () {
    const body = 'requestBody';
    const req = createRequestMock({body});
    const chunks = [];
    const data = await new Promise((resolve, reject) => {
      req.on('data', chunk => chunks.push(Buffer.from(chunk)));
      req.on('error', err => reject(err));
      req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    });
    expect(data).to.be.eq(body);
  });

  it('should pass a string body to the stream with "ascii" encoding', async function () {
    const body = 'requestBody';
    const req = createRequestMock({body, encoding: 'ascii'});
    const chunks = [];
    const data = await new Promise((resolve, reject) => {
      req.on('data', chunk => chunks.push(Buffer.from(chunk)));
      req.on('error', err => reject(err));
      req.on('end', () => resolve(Buffer.concat(chunks).toString('ascii')));
    });
    expect(data).to.be.eq(body);
  });

  it('should pass a binary data to the stream', async function () {
    const body = Buffer.from('test');
    const req = createRequestMock({body});
    const chunks = [];
    const data = await new Promise((resolve, reject) => {
      req.on('data', chunk => chunks.push(Buffer.from(chunk)));
      req.on('error', err => reject(err));
      req.on('end', () => resolve(Buffer.concat(chunks)));
    });
    expect(data).to.be.eql(body);
  });

  it('should set the path value to the request url', function () {
    const req = createRequestMock({path: 'test'});
    expect(req.url).to.be.eq('/test');
  });

  it('should set the path value to the request url with the prefix "/"', function () {
    const req = createRequestMock({path: '/test'});
    expect(req.url).to.be.eq('/test');
  });

  it('should set the query string to the request url', async function () {
    const req = createRequestMock({query: 'p1=foo&p2=bar'});
    expect(req.url).to.be.eq('/?p1=foo&p2=bar');
  });

  it('should set the query string to the request url with the prefix "?"', async function () {
    const req = createRequestMock({query: '?p1=foo&p2=bar'});
    expect(req.url).to.be.eq('/?p1=foo&p2=bar');
  });

  it('should construct the request url from "path" and "query" parameters', function () {
    const req1 = createRequestMock({
      path: 'test',
      query: 'p1=foo&p2=bar',
    });
    const req2 = createRequestMock({
      path: '/test',
      query: {p1: 'baz', p2: 'qux'},
    });
    expect(req1.url).to.be.eq('/test?p1=foo&p2=bar');
    expect(req2.url).to.be.eq('/test?p1=baz&p2=qux');
  });

  it('should set the parameter "method" in upper case', async function () {
    const req1 = createRequestMock({method: 'get'});
    const req2 = createRequestMock({method: 'post'});
    expect(req1.method).to.be.eq('GET');
    expect(req2.method).to.be.eq('POST');
  });

  it('should not affect the url when the parameter "host" is specified', async function () {
    const req = createRequestMock({host: 'myHost'});
    expect(req.url).to.be.eq('/');
    expect(req.headers['host']).to.be.eq('myHost');
  });

  it('should set the header "x-forwarded-proto" when the parameter "secure" is true', async function () {
    const req = createRequestMock({secure: true});
    expect(req.headers['x-forwarded-proto']).to.be.eq('https');
  });

  it('should set the header "cookie" from a String', function () {
    const req = createRequestMock({cookies: 'test'});
    expect(req.headers['cookie']).to.be.eq('test');
  });

  it('should set the header "cookie" from an Object', function () {
    const req = createRequestMock({cookies: {p1: 'foo', p2: 'bar'}});
    expect(req.headers['cookie']).to.be.eq('p1=foo; p2=bar;');
  });

  it('should set the header "content-type" for a String body', function () {
    const req = createRequestMock({body: 'test'});
    expect(req.headers['content-type']).to.be.eq('text/plain');
  });

  it('should set the header "content-type" for a Buffer body', function () {
    const req = createRequestMock({body: Buffer.from('test')});
    expect(req.headers['content-type']).to.be.eq('application/octet-stream');
  });

  it('should set the header "content-type" for an Object body', function () {
    const req = createRequestMock({body: {foo: 'bar'}});
    expect(req.headers['content-type']).to.be.eq('application/json');
  });

  it('should set the header "content-type" for an Array body', function () {
    const req = createRequestMock({body: [1, 2]});
    expect(req.headers['content-type']).to.be.eq('application/json');
  });

  it('should set the header "content-type" for a Boolean body', function () {
    const req1 = createRequestMock({body: true});
    const req2 = createRequestMock({body: true});
    expect(req1.headers['content-type']).to.be.eq('application/json');
    expect(req2.headers['content-type']).to.be.eq('application/json');
  });

  it('should set the header "content-type" for a Number body', function () {
    const req = createRequestMock({body: 10});
    expect(req.headers['content-type']).to.be.eq('application/json');
  });

  it('should not override the header "content-type" from the provided options', function () {
    const req = createRequestMock({
      body: Buffer.from('test'),
      headers: {'content-type': 'media/type'},
    });
    expect(req.headers['content-type']).to.be.eq('media/type');
  });

  it('should calculate the header "content-length" automatically', function () {
    const body = 'test';
    const length = Buffer.byteLength(body);
    const req = createRequestMock({body});
    expect(req.headers['content-length']).to.be.eq(String(length));
  });

  it('should not override the header "content-length" from the provided options', function () {
    const req = createRequestMock({
      body: 'test',
      headers: {'content-length': '100'},
    });
    expect(req.headers['content-length']).to.be.eq('100');
  });
});
