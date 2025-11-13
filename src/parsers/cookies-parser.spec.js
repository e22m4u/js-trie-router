import {expect} from 'chai';
import {CookiesParser} from './cookies-parser.js';

describe('CookiesParser', function () {
  describe('parse', function () {
    it('returns parsed cookies as a plain object', function () {
      const parser = new CookiesParser();
      const value = 'pkg=math; equation=E%3Dmc%5E2';
      const result = parser.parse({url: '', headers: {cookie: value}});
      expect(result).to.have.property('pkg', 'math');
      expect(result).to.have.property('equation', 'E=mc^2');
    });

    it('returns an empty object if no cookies', function () {
      const parser = new CookiesParser();
      const result = parser.parse({url: '', headers: {}});
      expect(result).to.be.eql({});
    });

    it('returns an empty object for an empty string', function () {
      const parser = new CookiesParser();
      const result = parser.parse({url: '', headers: {cookie: ''}});
      expect(result).to.be.eql({});
    });
  });
});
