import {expect} from '../chai.js';
import {format} from '@e22m4u/js-format';
import {fetchRequestBody} from './fetch-request-body.js';
import {createRequestMock} from './create-request-mock.js';

describe('fetchRequestBody', function () {
  it('requires the first parameter to be an IncomingMessage instance', function () {
    const throwable = v => () => fetchRequestBody(v);
    const error = v =>
      format(
        'The first parameter of "fetchRequestBody" should be ' +
          'an IncomingMessage instance, but %s was given.',
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

  it('requires the parameter "bodyBytesLimit" to be an IncomingMessage instance', function () {
    const req = createRequestMock();
    const throwable = v => () => fetchRequestBody(req, v);
    const error = v =>
      format(
        'The parameter "bodyBytesLimit" of "fetchRequestBody" ' +
          'should be a number, but %s was given.',
        v,
      );
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    throwable(10)();
    throwable(0)();
    throwable(undefined)();
  });

  it('returns a string from the string body', async function () {
    const body = 'Lorem Ipsum is simply dummy text.';
    const req = createRequestMock({body});
    const result = await fetchRequestBody(req);
    expect(result).to.be.eq(body);
  });

  it('returns a string from the buffer body', async function () {
    const body = 'Lorem Ipsum is simply dummy text.';
    const req = createRequestMock({body: Buffer.from(body)});
    const result = await fetchRequestBody(req);
    expect(result).to.be.eq(body);
  });

  describe('encoding of the header "content-type"', function () {
    it('throws an error for an unsupported encoding', async function () {
      const body = 'Lorem Ipsum is simply dummy text.';
      const req = createRequestMock({
        body,
        headers: {'content-type': 'text/plain; charset=unknown'},
      });
      const promise = fetchRequestBody(req);
      await expect(promise).to.be.rejectedWith(
        'Request encoding "unknown" is not supported.',
      );
    });

    it('does not throw an error if the header "content-type" does not have a specified charset', async function () {
      const body = 'Lorem Ipsum is simply dummy text.';
      const req = createRequestMock({
        body,
        headers: {'content-type': 'text/plain'},
      });
      const result = await fetchRequestBody(req);
      expect(result).to.be.eq(body);
    });

    it('decodes non-UTF-8 encoding to a plain text', async function () {
      const originalBody = 'Hello, world!';
      const req = createRequestMock({
        body: originalBody,
        encoding: 'latin1',
        headers: {'content-type': `text/plain; charset=latin1`},
      });
      const result = await fetchRequestBody(req);
      expect(result).to.be.eq(originalBody);
    });
  });

  describe('the header "content-length"', function () {
    it('throws an error if the body length is greater than the header', async function () {
      const body = 'Lorem Ipsum is simply dummy text.';
      const bodyLength = Buffer.from(body).byteLength;
      const contentLength = String(bodyLength + 10);
      const req = createRequestMock({
        body,
        headers: {'content-length': contentLength},
      });
      const promise = fetchRequestBody(req);
      await expect(promise).to.be.rejectedWith(
        'Received bytes do not match the "content-length" header.',
      );
    });

    it('throws an error if the body length is lower than the header', async function () {
      const body = 'Lorem Ipsum is simply dummy text.';
      const bodyLength = Buffer.from(body).byteLength;
      const contentLength = String(bodyLength - 10);
      const req = createRequestMock({
        body,
        headers: {'content-length': contentLength},
      });
      const promise = fetchRequestBody(req);
      await expect(promise).to.be.rejectedWith(
        'Received bytes do not match the "content-length" header.',
      );
    });

    it('does not throw an error if the body length does match with the header', async function () {
      const body = 'Lorem Ipsum is simply dummy text.';
      const contentLength = String(Buffer.from(body).byteLength);
      const req = createRequestMock({
        body,
        headers: {'content-length': contentLength},
      });
      const result = await fetchRequestBody(req);
      expect(result).to.be.eq(body);
    });
  });

  describe('the parameter "bodyBytesLimit"', function () {
    it('throws an error if the "content-length" header is greater than the limit', async function () {
      const body = 'Lorem Ipsum is simply dummy text.';
      const bodyLength = Buffer.from(body).byteLength;
      const bodyLimit = bodyLength - 10;
      const req = createRequestMock({
        body,
        headers: {'content-length': String(bodyLength)},
      });
      const error = format(
        'Request body limit is %s bytes, but %s bytes given.',
        bodyLimit,
        bodyLength,
      );
      const promise = fetchRequestBody(req, bodyLimit);
      await expect(promise).to.be.rejectedWith(error);
    });

    it('does not throw an error if the "content-length" header does match with the limit', async function () {
      const body = 'Lorem Ipsum is simply dummy text.';
      const bodyLength = Buffer.from(body).byteLength;
      const req = createRequestMock({
        body,
        headers: {'content-length': String(bodyLength)},
      });
      const result = await fetchRequestBody(req, bodyLength);
      expect(result).to.be.eq(body);
    });

    it('does not throw an error if the "content-length" header is lower than the limit', async function () {
      const body = 'Lorem Ipsum is simply dummy text.';
      const bodyLength = Buffer.from(body).byteLength;
      const req = createRequestMock({
        body,
        headers: {'content-length': String(bodyLength)},
      });
      const result = await fetchRequestBody(req, bodyLength + 10);
      expect(result).to.be.eq(body);
    });

    it('throws an error if the body length is greater than the limit', async function () {
      const body = 'Lorem Ipsum is simply dummy text.';
      const bodyLength = Buffer.from(body).byteLength;
      const bodyLimit = bodyLength - 10;
      const req = createRequestMock({body});
      const error = format(
        'Request body limit is %s bytes, but %s bytes given.',
        bodyLimit,
        bodyLength,
      );
      const promise = fetchRequestBody(req, bodyLimit);
      await expect(promise).to.be.rejectedWith(error);
    });

    it('does not throw an error if the body length does match with the limit', async function () {
      const body = 'Lorem Ipsum is simply dummy text.';
      const bodyLength = Buffer.from(body).byteLength;
      const req = createRequestMock({body});
      const result = await fetchRequestBody(req, bodyLength);
      expect(result).to.be.eq(body);
    });

    it('does not throw an error if the body length is lower than the limit', async function () {
      const body = 'Lorem Ipsum is simply dummy text.';
      const bodyLength = Buffer.from(body).byteLength;
      const bodyLimit = bodyLength + 10;
      const req = createRequestMock({body});
      const result = await fetchRequestBody(req, bodyLimit);
      expect(result).to.be.eq(body);
    });
  });
});
