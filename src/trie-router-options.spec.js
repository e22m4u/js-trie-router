import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {TrieRouterOptions} from './trie-router-options.js';

describe('TrieRouterOptions', function () {
  describe('constructor', function () {
    it('should require the parameter "options" to be an Object', function () {
      const throwable = v => () => new TrieRouterOptions(v);
      const error = s =>
        format('Parameter "options" must be an Object, but %s was given.', s);
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(null)).to.throw(error('null'));
      throwable({})();
      throwable(undefined)();
    });

    it('should require the option "requestBodyBytesLimit" to be a correct value', function () {
      const throwable = v => () =>
        new TrieRouterOptions({requestBodyBytesLimit: v});
      const error = s =>
        format(
          'Option "requestBodyBytesLimit" must be a positive Number or 0, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(-1)).to.throw(error('-1'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(10)();
      throwable(0)();
      throwable(undefined)();
    });

    it('should require the option "ignoredMediaTypes" to be an Array', function () {
      const throwable = v => () =>
        new TrieRouterOptions({ignoredMediaTypes: v});
      const error = s =>
        format(
          'Option "ignoredMediaTypes" must be an Array, ' + 'but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(['text/plain'])();
      throwable([])();
      throwable(undefined)();
    });

    it('should require elements of the option "ignoredMediaTypes" to be a non-empty String', function () {
      const throwable = v => () =>
        new TrieRouterOptions({ignoredMediaTypes: [v]});
      const error = s =>
        format(
          'Element 0 of the option "ignoredMediaTypes" must be ' +
            'a non-empty String, but %s was given.',
          s,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('text/plain')();
    });

    it('should set the option "requestBodyBytesLimit" to the current instance', function () {
      const value = 10;
      const inst = new TrieRouterOptions({requestBodyBytesLimit: value});
      expect(inst.getRequestBodyBytesLimit()).to.be.eq(value);
    });

    it('should add elements of the option "ignoredMediaTypes" to the current instance', function () {
      const value = ['text/plain', 'text/html'];
      const inst = new TrieRouterOptions({ignoredMediaTypes: value});
      expect(inst.getIgnoredMediaTypes()).to.include(value[0]);
      expect(inst.getIgnoredMediaTypes()).to.include(value[1]);
    });

    it('should add elements of the option "ignoredMediaTypes" without duplicates', function () {
      const value = ['text/plain', 'text/html', 'text/plain'];
      const inst = new TrieRouterOptions({ignoredMediaTypes: value});
      expect(inst.getIgnoredMediaTypes()).to.be.eql([
        'text/plain',
        'text/html',
      ]);
    });

    it('should convert ignored media types to lower case', function () {
      const inst = new TrieRouterOptions({ignoredMediaTypes: ['TEXT/PLAIN']});
      expect(inst.getIgnoredMediaTypes()).to.be.eql(['text/plain']);
    });
  });

  describe('setRequestBodyBytesLimit', function () {
    it('should require the parameter "value" to be a positive number or zero', function () {
      const throwable = v => () => {
        const S = new TrieRouterOptions();
        S.setRequestBodyBytesLimit(v);
      };
      const error = s =>
        format(
          'Parameter "limit" must be a positive Number or 0, but %s was given.',
          s,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(-1)).to.throw(error('-1'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable(10)();
      throwable(0)();
    });

    it('should set the option value to the current instance', function () {
      const S = new TrieRouterOptions();
      const customValue = 10;
      S.setRequestBodyBytesLimit(customValue);
      const res = S.getRequestBodyBytesLimit();
      expect(res).to.be.eq(customValue);
    });

    it('should return the current instance to allow chaining', function () {
      const S = new TrieRouterOptions();
      const res = S.setRequestBodyBytesLimit(10);
      expect(res).to.be.eq(S);
    });
  });

  describe('getRequestBodyBytesLimit', function () {
    it('should return a default value when the option is not specified', function () {
      const defaultValue = 512 * 1024; // 512kb
      const inst = new TrieRouterOptions();
      expect(inst.getRequestBodyBytesLimit()).to.be.eq(defaultValue);
    });

    it('should return a value specified in the constructor', function () {
      const customValue = 10;
      const inst = new TrieRouterOptions({requestBodyBytesLimit: customValue});
      expect(inst.getRequestBodyBytesLimit()).to.be.eq(customValue);
    });
  });

  describe('addIgnoredMediaType', function () {
    it('should require the parameter "mediaType" to be a non-empty String', function () {
      const throwable = v => () => {
        const S = new TrieRouterOptions();
        S.addIgnoredMediaType(v);
      };
      const error = s =>
        format(
          'Parameter "mediaType" must be a non-empty String, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('text/plain')();
    });

    it('should add an ignored media type to the current instance', function () {
      const S = new TrieRouterOptions();
      const mediaType = 'text/plain';
      expect(S.hasIgnoredMediaType(mediaType)).to.be.false;
      S.addIgnoredMediaType(mediaType);
      expect(S.hasIgnoredMediaType(mediaType)).to.be.true;
    });

    it('should return the current instance to allow chaining', function () {
      const S = new TrieRouterOptions();
      const res = S.addIgnoredMediaType('text/plain');
      expect(res).to.be.eq(S);
    });
  });

  describe('hasIgnoredMediaType', function () {
    it('should require the parameter "mediaType" to be a non-empty String', function () {
      const throwable = v => () => {
        const S = new TrieRouterOptions();
        S.hasIgnoredMediaType(v);
      };
      const error = s =>
        format(
          'Parameter "mediaType" must be a non-empty String, ' +
            'but %s was given.',
          s,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(null)).to.throw(error('null'));
      throwable('text/plain')();
    });

    it('should return true when the given type is registered', function () {
      const S = new TrieRouterOptions();
      const mediaType = 'text/plain';
      expect(S.hasIgnoredMediaType(mediaType)).to.be.false;
      S.addIgnoredMediaType(mediaType);
      expect(S.hasIgnoredMediaType(mediaType)).to.be.true;
    });

    it('should lookup the media type in case-insensitive mode', function () {
      const S = new TrieRouterOptions();
      S.addIgnoredMediaType('TeXt/PlAiN');
      expect(S.hasIgnoredMediaType('tExT/pLaIn')).to.be.true;
    });

    it('should not add duplicates even with different cases', function () {
      const S = new TrieRouterOptions();
      S.addIgnoredMediaType('text/plain');
      S.addIgnoredMediaType('TEXT/PLAIN');
      S.addIgnoredMediaType('text/plain');
      const res = S.getIgnoredMediaTypes();
      expect(res).to.have.lengthOf(1);
      expect(res[0]).to.be.eq('text/plain');
    });
  });

  describe('getIgnoredMediaTypes', function () {
    it('should return media types specified in the constructor', function () {
      const mediaTypes = ['text/plain', 'text/html'];
      const S = new TrieRouterOptions({ignoredMediaTypes: mediaTypes});
      const res = S.getIgnoredMediaTypes();
      expect(res).to.be.eql(mediaTypes);
    });

    it('should return media types added by the "addIgnoredMediaType" method', function () {
      const mediaTypes = ['text/plain', 'text/html'];
      const S = new TrieRouterOptions();
      S.addIgnoredMediaType(mediaTypes[0]);
      S.addIgnoredMediaType(mediaTypes[1]);
      const res = S.getIgnoredMediaTypes();
      expect(res).to.be.eql(mediaTypes);
    });

    it('should combine media types specified by the constructor and the "addIgnoredMediaType" method', function () {
      const mediaTypes = ['text/plain', 'text/html'];
      const S = new TrieRouterOptions({ignoredMediaTypes: [mediaTypes[0]]});
      S.addIgnoredMediaType(mediaTypes[1]);
      const res = S.getIgnoredMediaTypes();
      expect(res).to.be.eql(mediaTypes);
    });

    it('should return a clone of the media type list that prevents mutate the state', function () {
      const mediaTypes = ['text/plain', 'text/html'];
      const S = new TrieRouterOptions();
      S.addIgnoredMediaType(mediaTypes[0]);
      S.addIgnoredMediaType(mediaTypes[1]);
      const res1 = S.getIgnoredMediaTypes();
      const res2 = S.getIgnoredMediaTypes();
      expect(res1).to.be.eql(mediaTypes);
      expect(res2).to.be.eql(mediaTypes);
      expect(res1).to.be.not.eq(res2);
      res1[0] = '123';
      const res3 = S.getIgnoredMediaTypes();
      expect(res3).to.be.eql(mediaTypes);
    });
  });
});
