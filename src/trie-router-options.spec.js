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
      expect(inst.requestBodyBytesLimit).to.be.eq(value);
    });

    it('should add elements of the option "ignoredMediaTypes" to the current instance', function () {
      const value = ['text/plain', 'text/html'];
      const inst = new TrieRouterOptions({ignoredMediaTypes: value});
      expect(inst.ignoredMediaTypes).to.be.eql(['text/plain', 'text/html']);
    });

    it('should add elements of the option "ignoredMediaTypes" without duplicates', function () {
      const value = ['text/plain', 'text/html', 'text/plain'];
      const inst = new TrieRouterOptions({ignoredMediaTypes: value});
      expect(inst.ignoredMediaTypes).to.be.eql(['text/plain', 'text/html']);
    });

    it('should freeze the option "ignoredMediaTypes" to prevent mutations', function () {
      const mediaTypes = ['text/plain', 'text/html'];
      const inst = new TrieRouterOptions({ignoredMediaTypes: mediaTypes});
      const res = inst.ignoredMediaTypes;
      expect(Object.isFrozen(res)).to.be.true;
    });

    it('should convert ignored media types to lower case', function () {
      const inst = new TrieRouterOptions({ignoredMediaTypes: ['TEXT/PLAIN']});
      expect(inst.ignoredMediaTypes).to.be.eql(['text/plain']);
    });
  });
});
