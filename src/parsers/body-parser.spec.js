import {expect} from 'chai';
import HttpErrors from 'http-errors';
import {format} from '@e22m4u/js-format';
import {HttpMethod} from '../route/index.js';
import {RouterOptions} from '../router-options.js';
import {createRequestMock} from '../utils/index.js';

import {
  BodyParser,
  METHODS_WITH_BODY,
  UNPARSABLE_MEDIA_TYPES,
} from './body-parser.js';

describe('BodyParser', function () {
  describe('defineParser', function () {
    it('should require the parameter "mediaType" to be a non-empty String', function () {
      const parser = new BodyParser();
      const throwable = v => () => parser.defineParser(v, () => undefined);
      const error = v =>
        format(
          'The parameter "mediaType" must be a non-empty String, ' +
            'but %s was given.',
          v,
        );
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
      throwable('text/plain')();
    });

    it('should require the parameter "parser" to be a Function', function () {
      const parser = new BodyParser();
      const throwable = v => () => parser.defineParser('str', v);
      const error = v =>
        format(
          'The parameter "parser" must be a Function, but %s was given.',
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
      throwable(() => undefined)();
    });

    it('should override existing parser', function () {
      const parser = new BodyParser();
      const fn = v => v;
      parser.defineParser('text/plain', fn);
      expect(parser['_parsers']['text/plain']).to.be.eq(fn);
    });

    it('should set a new parser', function () {
      const parser = new BodyParser();
      const fn = v => v;
      parser.defineParser('my/type', fn);
      expect(parser['_parsers']['my/type']).to.be.eq(fn);
    });
  });

  describe('hasParser', function () {
    it('should require the parameter "mediaType" to be a non-empty String', function () {
      const parser = new BodyParser();
      const throwable = v => () => parser.hasParser(v);
      const error = v =>
        format(
          'The parameter "mediaType" must be a non-empty String, ' +
            'but %s was given.',
          v,
        );
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
      throwable('text/plain')();
    });

    it('should return true if the parser is exist', function () {
      const parser = new BodyParser();
      parser.defineParser('type/media', v => v);
      expect(parser.hasParser('type/media')).to.be.true;
    });

    it('should return false if the parser is not exist', function () {
      const parser = new BodyParser();
      expect(parser.hasParser('text/unknown')).to.be.false;
    });
  });

  describe('deleteParser', function () {
    it('should require the parameter "mediaType" to be a non-empty String', function () {
      const parser = new BodyParser();
      const throwable = v => () => parser.deleteParser(v);
      const error = v =>
        format(
          'The parameter "mediaType" must be a non-empty String, ' +
            'but %s was given.',
          v,
        );
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
      throwable('text/plain')();
    });

    it('should remove existing parser', function () {
      const parser = new BodyParser();
      const fn = v => v;
      parser.defineParser('my/type', fn);
      expect(parser['_parsers']['my/type']).to.be.eq(fn);
      parser.deleteParser('my/type');
      expect(parser['_parsers']['my/type']).to.be.undefined;
    });

    it('should throw an error if the media type does not exist', function () {
      const parser = new BodyParser();
      const throwable = () => parser.deleteParser('unknown');
      expect(throwable).to.throw('The parser of "unknown" is not found.');
    });
  });

  describe('parse', function () {
    it('should return undefined when the request method is not supported', async function () {
      const parser = new BodyParser();
      const req = createRequestMock({
        method: 'unsupported',
        body: 'Lorem Ipsum is simply dummy text.',
      });
      const result = await parser.parse(req);
      expect(result).to.be.undefined;
    });

    it('should return undefined when the request method is not supported even if the "content-type" header is specified', async function () {
      const parser = new BodyParser();
      const req = createRequestMock({
        method: 'unsupported',
        headers: {'content-type': 'text/plain'},
        body: 'Lorem Ipsum is simply dummy text.',
      });
      const result = await parser.parse(req);
      expect(result).to.be.undefined;
    });

    it('should return undefined when no "content-type" header is specified', async function () {
      const parser = new BodyParser();
      const req = createRequestMock({method: HttpMethod.POST});
      const result = await parser.parse(req);
      expect(result).to.be.undefined;
    });

    it('should return undefined when the media type is excluded', async function () {
      const parser = new BodyParser();
      for await (const mediaType of UNPARSABLE_MEDIA_TYPES) {
        const req = createRequestMock({
          method: HttpMethod.POST,
          headers: {'content-type': mediaType},
          body: 'Lorem Ipsum is simply dummy text.',
        });
        const result = await parser.parse(req);
        expect(result).to.be.undefined;
      }
    });

    it('should parse the request body for available methods', async function () {
      const parser = new BodyParser();
      const body = 'Lorem Ipsum is simply dummy text.';
      const headers = {'content-type': 'text/plain'};
      for await (const method of Object.values(METHODS_WITH_BODY)) {
        const req = createRequestMock({method, body, headers});
        const result = await parser.parse(req);
        expect(result).to.be.eq(body);
      }
    });

    it('should throw an error for unsupported media type', function () {
      const parser = new BodyParser();
      const req = createRequestMock({
        method: HttpMethod.POST,
        headers: {'content-type': 'media/unknown'},
      });
      const throwable = () => parser.parse(req);
      expect(throwable).to.throw(
        'Media type "media/unknown" is not supported.',
      );
    });

    it('should use the option "bodyBytesLimit" from the RouterOptions', async function () {
      const parser = new BodyParser();
      parser.getService(RouterOptions).setRequestBodyBytesLimit(1);
      const req = createRequestMock({
        method: HttpMethod.POST,
        headers: {
          'content-type': 'text/plain',
          'content-length': '2',
        },
      });
      const promise = parser.parse(req);
      await expect(promise).to.be.rejectedWith(HttpErrors.PayloadTooLarge);
    });

    describe('text/plain', function () {
      it('should return undefined if no request body', async function () {
        const parser = new BodyParser();
        const req = createRequestMock({
          method: HttpMethod.POST,
          headers: {'content-type': 'text/plain'},
        });
        const result = await parser.parse(req);
        expect(result).to.be.undefined;
      });

      it('should return a string from the string body', async function () {
        const body = 'Lorem Ipsum is simply dummy text.';
        const parser = new BodyParser();
        const req = createRequestMock({
          method: HttpMethod.POST,
          headers: {'content-type': 'text/plain'},
          body,
        });
        const result = await parser.parse(req);
        expect(result).to.be.eq(body);
      });

      it('should return a string from the Buffer body', async function () {
        const body = 'Lorem Ipsum is simply dummy text.';
        const parser = new BodyParser();
        const req = createRequestMock({
          method: HttpMethod.POST,
          headers: {'content-type': 'text/plain'},
          body: Buffer.from(body, 'utf-8'),
        });
        const result = await parser.parse(req);
        expect(result).to.be.eq(body);
      });
    });

    describe('application/json', function () {
      it('should return undefined if no request body', async function () {
        const parser = new BodyParser();
        const req = createRequestMock({
          method: HttpMethod.POST,
          headers: {'content-type': 'application/json'},
        });
        const result = await parser.parse(req);
        expect(result).to.be.undefined;
      });

      it('should return parsed JSON from the string body', async function () {
        const body = {foo: 'bar'};
        const parser = new BodyParser();
        const req = createRequestMock({
          method: HttpMethod.POST,
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(body),
        });
        const result = await parser.parse(req);
        expect(result).to.be.eql(body);
      });

      it('should return parsed JSON from the Buffer body', async function () {
        const body = {foo: 'bar'};
        const parser = new BodyParser();
        const req = createRequestMock({
          method: HttpMethod.POST,
          headers: {'content-type': 'application/json'},
          body: Buffer.from(JSON.stringify(body)),
        });
        const result = await parser.parse(req);
        expect(result).to.be.eql(body);
      });
    });
  });
});
