import {Socket} from 'net';
import {Stream} from 'stream';
import {TLSSocket} from 'tls';
import {expect} from '../chai.js';
import {format} from '@e22m4u/js-format';
import {createRequestMock} from './create-request-mock.js';
import {CHARACTER_ENCODING_LIST} from './fetch-request-body.js';

describe('createRequestMock', function () {
  it('requires the first argument to be an Object', function () {
    const throwable = v => () => createRequestMock(v);
    const error = v =>
      format(
        'The first parameter of "createRequestMock" ' +
          'should be an Object, but %s was given.',
        v,
      );
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

  it('requires the parameter "host" to be a String', function () {
    const throwable = v => () => createRequestMock({host: v});
    const error = v =>
      format(
        'The parameter "host" of "createRequestMock" ' +
          'should be a String, but %s was given.',
        v,
      );
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

  it('requires the parameter "method" to be a String', function () {
    const throwable = v => () => createRequestMock({method: v});
    const error = v =>
      format(
        'The parameter "method" of "createRequestMock" ' +
          'should be a String, but %s was given.',
        v,
      );
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

  it('requires the parameter "secure" to be a Boolean', function () {
    const throwable = v => () => createRequestMock({secure: v});
    const error = v =>
      format(
        'The parameter "secure" of "createRequestMock" ' +
          'should be a Boolean, but %s was given.',
        v,
      );
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

  it('requires the parameter "path" to be a String', function () {
    const throwable = v => () => createRequestMock({path: v});
    const error = v =>
      format(
        'The parameter "path" of "createRequestMock" ' +
          'should be a String, but %s was given.',
        v,
      );
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

  it('requires the parameter "query" to be a String or Object', function () {
    const throwable = v => () => createRequestMock({query: v});
    const error = v =>
      format(
        'The parameter "query" of "createRequestMock" ' +
          'should be a String or Object, but %s was given.',
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

  it('requires the parameter "cookies" to be a String or Object', function () {
    const throwable = v => () => createRequestMock({cookies: v});
    const error = v =>
      format(
        'The parameter "cookies" of "createRequestMock" ' +
          'should be a String or Object, but %s was given.',
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

  it('requires the parameter "headers" to be an Object', function () {
    const throwable = v => () => createRequestMock({headers: v});
    const error = v =>
      format(
        'The parameter "headers" of "createRequestMock" ' +
          'should be an Object, but %s was given.',
        v,
      );
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

  it('requires the parameter "stream" to be a Stream', function () {
    const throwable = v => () => createRequestMock({stream: v});
    const error = v =>
      format(
        'The parameter "stream" of "createRequestMock" ' +
          'should be a Stream, but %s was given.',
        v,
      );
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

  it('requires the parameter "encoding" to be a String', function () {
    const throwable = v => () => createRequestMock({encoding: v});
    const error = v =>
      format(
        'The parameter "encoding" of "createRequestMock" ' +
          'should be a String, but %s was given.',
        v,
      );
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

  it('requires the parameter "encoding" to be the BufferEncoding', function () {
    const throwable = v => () => createRequestMock({encoding: v});
    const error = v => format('Character encoding %s is not supported.', v);
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    CHARACTER_ENCODING_LIST.forEach(v => throwable(v)());
  });

  it('does not allow the option "secure" with the "stream"', function () {
    const throwable = v => () =>
      createRequestMock({stream: new Stream(), secure: v});
    const error =
      'The "createRequestMock" does not allow specifying the ' +
      '"stream" and "secure" options simultaneously.';
    expect(throwable(true)).to.throw(error);
    expect(throwable(false)).to.throw(error);
    throwable(undefined)();
    throwable(null)();
  });

  it('does not allow the option "body" with the "stream"', function () {
    const throwable = v => () =>
      createRequestMock({stream: new Stream(), body: v});
    const error =
      'The "createRequestMock" does not allow specifying the ' +
      '"stream" and "body" options simultaneously.';
    expect(throwable('str')).to.throw(error);
    expect(throwable({foo: 'bar'})).to.throw(error);
    expect(throwable(Buffer.from('str'))).to.throw(error);
    throwable(undefined)();
    throwable(null)();
  });

  it('does not allow the option "encoding" with the "stream"', function () {
    const throwable = v => () =>
      createRequestMock({stream: new Stream(), encoding: v});
    const error =
      'The "createRequestMock" does not allow specifying the ' +
      '"stream" and "encoding" options simultaneously.';
    expect(throwable('utf-8')).to.throw(error);
    throwable(undefined)();
    throwable(null)();
  });

  it('uses the default host "localhost"', function () {
    const req = createRequestMock();
    expect(req.headers['host']).to.be.eq('localhost');
  });

  it('uses the default method "GET"', function () {
    const req = createRequestMock();
    expect(req.method).to.be.eq('GET');
  });

  it('uses the Socket class by default', function () {
    const req = createRequestMock();
    expect(req.socket).to.be.instanceof(Socket);
  });

  it('uses the default path "/" without a query string', function () {
    const req = createRequestMock();
    expect(req.url).to.be.eq('/');
  });

  it('uses by default only the "host" header', function () {
    const req = createRequestMock();
    expect(req.headers).to.be.eql({host: 'localhost'});
  });

  it('uses "utf-8" encoding by default', async function () {
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

  it('uses Socket if the parameter "secure" is false', function () {
    const req = createRequestMock({secure: false});
    expect(req.socket).to.be.instanceof(Socket);
  });

  it('uses TLSSocket if the parameter "secure" is true', function () {
    const req = createRequestMock({secure: true});
    expect(req.socket).to.be.instanceof(TLSSocket);
  });

  it('sets the string body to the stream and uses "utf-8" encoding by default', async function () {
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

  it('sets the string body to the stream with "ascii" encoding', async function () {
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

  it('sets the binary data to the stream', async function () {
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

  it('set the path value to the request url', function () {
    const req = createRequestMock({path: 'test'});
    expect(req.url).to.be.eq('/test');
  });

  it('set the path value to the request url with the prefix "/"', function () {
    const req = createRequestMock({path: '/test'});
    expect(req.url).to.be.eq('/test');
  });

  it('sets the query string to the request url', async function () {
    const req = createRequestMock({query: 'p1=foo&p2=bar'});
    expect(req.url).to.be.eq('/?p1=foo&p2=bar');
  });

  it('sets the query string to the request url with the prefix "?"', async function () {
    const req = createRequestMock({query: '?p1=foo&p2=bar'});
    expect(req.url).to.be.eq('/?p1=foo&p2=bar');
  });

  it('set parameters "path" and "query" to the request url', function () {
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

  it('sets the parameter "method" in uppercase', async function () {
    const req1 = createRequestMock({method: 'get'});
    const req2 = createRequestMock({method: 'post'});
    expect(req1.method).to.be.eq('GET');
    expect(req2.method).to.be.eq('POST');
  });

  it('the parameter "host" does not affect the url', async function () {
    const req = createRequestMock({host: 'myHost'});
    expect(req.url).to.be.eq('/');
    expect(req.headers['host']).to.be.eq('myHost');
  });

  it('the parameter "secure" sets the header "x-forwarded-proto"', async function () {
    const req = createRequestMock({secure: true});
    expect(req.headers['x-forwarded-proto']).to.be.eq('https');
  });

  it('sets the header "cookie" from a String', function () {
    const req = createRequestMock({cookies: 'test'});
    expect(req.headers['cookie']).to.be.eq('test');
  });

  it('sets the header "cookie" from an Object', function () {
    const req = createRequestMock({cookies: {p1: 'foo', p2: 'bar'}});
    expect(req.headers['cookie']).to.be.eq('p1=foo; p2=bar;');
  });

  it('set the header "content-type" for a String body', function () {
    const req = createRequestMock({body: 'test'});
    expect(req.headers['content-type']).to.be.eq('text/plain');
  });

  it('set the header "content-type" for a Buffer body', function () {
    const req = createRequestMock({body: Buffer.from('test')});
    expect(req.headers['content-type']).to.be.eq('application/octet-stream');
  });

  it('set the header "content-type" for an Object body', function () {
    const req = createRequestMock({body: {foo: 'bar'}});
    expect(req.headers['content-type']).to.be.eq('application/json');
  });

  it('set the header "content-type" for a Boolean body', function () {
    const req1 = createRequestMock({body: true});
    const req2 = createRequestMock({body: true});
    expect(req1.headers['content-type']).to.be.eq('application/json');
    expect(req2.headers['content-type']).to.be.eq('application/json');
  });

  it('set the header "content-type" for a Number body', function () {
    const req = createRequestMock({body: 10});
    expect(req.headers['content-type']).to.be.eq('application/json');
  });

  it('does not override the header "content-type"', function () {
    const req = createRequestMock({
      body: Buffer.from('test'),
      headers: {'content-type': 'media/type'},
    });
    expect(req.headers['content-type']).to.be.eq('media/type');
  });

  it('calculate the header "content-length"', function () {
    const body = 'test';
    const length = Buffer.byteLength(body);
    const req = createRequestMock({body});
    expect(req.headers['content-length']).to.be.eq(String(length));
  });

  it('does not override the header "content-length"', function () {
    const req = createRequestMock({
      body: 'test',
      headers: {'content-length': '100'},
    });
    expect(req.headers['content-length']).to.be.eq('100');
  });
});
