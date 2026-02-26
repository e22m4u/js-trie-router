import {expect} from 'chai';
import HttpErrors from 'http-errors';
import {format} from '@e22m4u/js-format';
import {BodyParser} from './body-parser.js';
import {HttpMethod} from '../route/index.js';
import {createRequestMock} from '../utils/index.js';
import {TrieRouterOptions} from '../trie-router-options.js';

describe('BodyParser', function () {
  describe('defineParser', function () {
    it('should require the parameter "mediaType" to be a non-empty String', function () {
      const S = new BodyParser();
      const throwable = v => () => S.defineParser(v, () => undefined);
      const error = v =>
        format(
          'Parameter "mediaType" must be a non-empty String, ' +
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
      const S = new BodyParser();
      const throwable = v => () => S.defineParser('str', v);
      const error = v =>
        format('Parameter "parser" must be a Function, but %s was given.', v);
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

    it('should set a parser function for the media type', function () {
      const S = new BodyParser();
      const mediaType = 'media/type';
      const parser = v => v;
      expect(S.hasParser(mediaType)).to.be.false;
      S.defineParser(mediaType, parser);
      expect(S.getParser(mediaType)).to.be.eq(parser);
    });

    it('should override an existing parser', function () {
      const S = new BodyParser();
      const mediaType = 'media/type';
      const parser1 = v => v;
      const parser2 = v => v;
      expect(S.hasParser(mediaType)).to.be.false;
      S.defineParser(mediaType, parser1);
      expect(S.getParser(mediaType)).to.be.eq(parser1);
      S.defineParser(mediaType, parser2);
      expect(S.getParser(mediaType)).to.be.eq(parser2);
    });
  });

  describe('hasParser', function () {
    it('should require the parameter "mediaType" to be a non-empty String', function () {
      const S = new BodyParser();
      const throwable = v => () => S.hasParser(v);
      const error = v =>
        format(
          'Parameter "mediaType" must be a non-empty String, ' +
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

    it('should return true if the media type has the parser', function () {
      const S = new BodyParser();
      const mediaType = 'media/type';
      const parser = v => v;
      expect(S.hasParser(mediaType)).to.be.false;
      S.defineParser(mediaType, parser);
      expect(S.hasParser(mediaType)).to.be.true;
    });

    it('should be case-insensitive when looking up the parser', function () {
      const S = new BodyParser();
      const parser = v => v;
      S.defineParser('MeDiA/TyPe', parser);
      expect(S.hasParser('mEdIa/tYpE')).to.be.true;
    });
  });

  describe('getParser', function () {
    it('should require the parameter "mediaType" to be a non-empty String', function () {
      const S = new BodyParser();
      S.defineParser('media/type', v => v);
      const throwable = v => () => S.getParser(v);
      const error = v =>
        format(
          'Parameter "mediaType" must be a non-empty String, ' +
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
      throwable('media/type')();
    });

    it('should throw an error when the media type is not registered', function () {
      const S = new BodyParser();
      const throwable = () => S.getParser('media/unknown');
      expect(throwable).to.throw(
        'Media type "media/unknown" does not have a parser.',
      );
    });

    it('should return an existing parser for the media type', function () {
      const S = new BodyParser();
      const mediaType = 'media/type';
      const parser = v => v;
      S.defineParser(mediaType, parser);
      expect(S.getParser(mediaType)).to.be.eq(parser);
    });

    it('should be case-insensitive when looking up the parser', function () {
      const S = new BodyParser();
      const parser = v => v;
      S.defineParser('MeDiA/TyPe', parser);
      expect(S.getParser('mEdIa/tYpE')).to.be.eq(parser);
    });
  });

  describe('removeParser', function () {
    it('should require the parameter "mediaType" to be a non-empty String', function () {
      const S = new BodyParser();
      const throwable = v => () => S.removeParser(v);
      const error = v =>
        format(
          'Parameter "mediaType" must be a non-empty String, ' +
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

    it('should not throw an error when the parser is not registered', function () {
      const S = new BodyParser();
      const mediaType = 'media/type';
      S.removeParser(mediaType);
    });

    it('should remove a parser function by the media type', function () {
      const S = new BodyParser();
      const mediaType = 'media/type';
      const parser = v => v;
      expect(S.hasParser(mediaType)).to.be.false;
      S.defineParser(mediaType, parser);
      expect(S.hasParser(mediaType)).to.be.true;
      S.removeParser(mediaType);
      expect(S.hasParser(mediaType)).to.be.false;
    });

    it('should be case-insensitive when removing the parser', function () {
      const S = new BodyParser();
      const parser = v => v;
      const mediaType = 'MeDiA/TyPe';
      S.defineParser(mediaType, parser);
      expect(S.hasParser(mediaType)).to.be.true;
      S.removeParser('mEdIa/tYpE');
      expect(S.hasParser(mediaType)).to.be.false;
    });
  });

  describe('parse', function () {
    it('should parse the request body when the "content-type" and "content-length" headers are provided', async function () {
      const S = new BodyParser();
      const body = 'Lorem Ipsum is simply dummy text.';
      const headers = {
        'content-type': 'text/plain',
        'content-length': Buffer.byteLength(body, 'utf-8'),
      };
      for await (const method of Object.values(HttpMethod)) {
        const req = createRequestMock({method, body, headers});
        const result = await S.parse(req);
        expect(result).to.be.eq(body);
      }
    });

    it('should parse the request body when the "content-type" and "transfer-encoding" headers are provided', async function () {
      const S = new BodyParser();
      const body = 'Lorem Ipsum is simply dummy text.';
      const headers = {
        'content-type': 'text/plain',
        'transfer-encoding': 'chunked',
      };
      for await (const method of Object.values(HttpMethod)) {
        const req = createRequestMock({method, body, headers});
        const result = await S.parse(req);
        expect(result).to.be.eq(body);
      }
    });

    it('should skip parsing when the header "content-length" has an invalid value', async function () {
      const S = new BodyParser();
      const body = 'Lorem Ipsum is simply dummy text.';
      const headers = {
        'content-type': 'text/plain',
        'content-length': 'invalid',
      };
      for await (const method of Object.values(HttpMethod)) {
        const req = createRequestMock({method, body, headers});
        const result = await S.parse(req);
        expect(result).to.be.undefined;
      }
    });

    it('should return undefined when no "content-type" header is provided', async function () {
      const S = new BodyParser();
      const req = createRequestMock({method: HttpMethod.POST});
      const result = await S.parse(req);
      expect(result).to.be.undefined;
    });

    it('should throw an error when the media type does not have a registered parser', function () {
      const S = new BodyParser();
      const req = createRequestMock({
        method: HttpMethod.POST,
        headers: {'content-type': 'media/unknown'},
        body: 'Lorem Ipsum is simply dummy text.',
      });
      const throwable = () => S.parse(req);
      expect(throwable).to.throw(
        HttpErrors.UnsupportedMediaType,
        'Media type "media/unknown" is not supported.',
      );
    });

    it('should use the option "bodyBytesLimit" from the TrieRouterOptions', async function () {
      const S = new BodyParser();
      S.useService(TrieRouterOptions, {requestBodyBytesLimit: 1});
      const req = createRequestMock({
        method: HttpMethod.POST,
        headers: {
          'content-type': 'text/plain',
          'content-length': '2',
        },
      });
      const promise = S.parse(req);
      await expect(promise).to.be.rejectedWith(HttpErrors.PayloadTooLarge);
    });

    it('should return undefined when the media type is ignored even when a request body is provided', async function () {
      const S = new BodyParser();
      S.getService(TrieRouterOptions, {ignoredMediaTypes: ['text/plain']});
      const req = createRequestMock({
        method: HttpMethod.POST,
        headers: {'content-type': 'text/plain'},
        body: 'Lorem Ipsum is simply dummy text.',
      });
      const result = await S.parse(req);
      expect(result).to.be.undefined;
    });

    describe('text/plain', function () {
      it('should return undefined when the request does not have a body', async function () {
        const S = new BodyParser();
        const req = createRequestMock({
          method: HttpMethod.POST,
          headers: {'content-type': 'text/plain'},
        });
        const result = await S.parse(req);
        expect(result).to.be.undefined;
      });

      it('should return a string for the string body', async function () {
        const body = 'Lorem Ipsum is simply dummy text.';
        const S = new BodyParser();
        const req = createRequestMock({
          method: HttpMethod.POST,
          headers: {'content-type': 'text/plain'},
          body,
        });
        const result = await S.parse(req);
        expect(result).to.be.eq(body);
      });

      it('should return a string for the Buffer body', async function () {
        const body = 'Lorem Ipsum is simply dummy text.';
        const S = new BodyParser();
        const req = createRequestMock({
          method: HttpMethod.POST,
          headers: {'content-type': 'text/plain'},
          body: Buffer.from(body, 'utf-8'),
        });
        const result = await S.parse(req);
        expect(result).to.be.eq(body);
      });
    });

    describe('application/json', function () {
      it('should return undefined when the request does not have a body', async function () {
        const S = new BodyParser();
        const req = createRequestMock({
          method: HttpMethod.POST,
          headers: {'content-type': 'application/json'},
        });
        const result = await S.parse(req);
        expect(result).to.be.undefined;
      });

      it('should return a parsed JSON for the string body', async function () {
        const body = {foo: 'bar'};
        const S = new BodyParser();
        const req = createRequestMock({
          method: HttpMethod.POST,
          headers: {'content-type': 'application/json'},
          body: JSON.stringify(body),
        });
        const result = await S.parse(req);
        expect(result).to.be.eql(body);
      });

      it('should return a parsed JSON for the Buffer body', async function () {
        const body = {foo: 'bar'};
        const S = new BodyParser();
        const req = createRequestMock({
          method: HttpMethod.POST,
          headers: {'content-type': 'application/json'},
          body: Buffer.from(JSON.stringify(body)),
        });
        const result = await S.parse(req);
        expect(result).to.be.eql(body);
      });
    });
  });
});
