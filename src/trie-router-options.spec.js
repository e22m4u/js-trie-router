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
      throwable({});
      throwable(undefined);
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
      throwable(10);
      throwable(0);
      throwable(undefined);
    });
  });
});
