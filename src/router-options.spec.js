import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {RouterOptions} from './router-options.js';

describe('RouterOptions', function () {
  describe('requestBodyBytesLimit', function () {
    it('returns the default value', function () {
      const S = new RouterOptions();
      expect(S.requestBodyBytesLimit).to.be.eq(512000);
    });

    it('returns a value of the property "_requestBodyBytesLimit"', function () {
      const S = new RouterOptions();
      S._requestBodyBytesLimit = 1;
      expect(S.requestBodyBytesLimit).to.be.eq(1);
      S._requestBodyBytesLimit = 2;
      expect(S.requestBodyBytesLimit).to.be.eq(2);
    });
  });

  describe('setRequestBodyBytesLimit', function () {
    it('requires the parameter "input" to be a positive Number or 0', function () {
      const S = new RouterOptions();
      const throwable = v => () => S.setRequestBodyBytesLimit(v);
      const error = v =>
        format(
          'Option "requestBodyBytesLimit" must be a positive Number or 0, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(-1)).to.throw(error('-1'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      throwable(10)();
      throwable(0)();
    });

    it('sets the given value to the property "_requestBodyBytesLimit"', function () {
      const S = new RouterOptions();
      expect(S._requestBodyBytesLimit).to.be.eq(512000);
      S.setRequestBodyBytesLimit(0);
      expect(S._requestBodyBytesLimit).to.be.eq(0);
    });
  });
});
