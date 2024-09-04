import {describe} from 'mocha';
import {expect} from './chai.js';
import {format} from '@e22m4u/js-format';
import {RouterOptions} from './router-options.js';

describe('RouterOptions', function () {
  describe('requestBodyBytesLimit', function () {
    it('returns the default value', function () {
      const s = new RouterOptions();
      expect(s.requestBodyBytesLimit).to.be.eq(512000);
    });

    it('returns a value of the property "_requestBodyBytesLimit"', function () {
      const s = new RouterOptions();
      s._requestBodyBytesLimit = 1;
      expect(s.requestBodyBytesLimit).to.be.eq(1);
      s._requestBodyBytesLimit = 2;
      expect(s.requestBodyBytesLimit).to.be.eq(2);
    });
  });

  describe('setRequestBodyBytesLimit', function () {
    it('requires the first parameter to be a positive Number or 0', function () {
      const s = new RouterOptions();
      const throwable = v => () => s.setRequestBodyBytesLimit(v);
      const error = v =>
        format(
          'The option "requestBodyBytesLimit" must be ' +
            'a positive Number or 0, but %s given.',
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
      const s = new RouterOptions();
      expect(s._requestBodyBytesLimit).to.be.eq(512000);
      s.setRequestBodyBytesLimit(0);
      expect(s._requestBodyBytesLimit).to.be.eq(0);
    });
  });
});
