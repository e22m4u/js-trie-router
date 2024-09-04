import {expect} from '../chai.js';
import {CookieParser} from './cookie-parser.js';

describe('CookieParser', function () {
  describe('parse', function () {
    it('returns cookie parameters', function () {
      const parser = new CookieParser();
      const value = 'pkg=math; equation=E%3Dmc%5E2';
      const result = parser.parse({url: '', headers: {cookie: value}});
      expect(result).to.have.property('pkg', 'math');
      expect(result).to.have.property('equation', 'E=mc^2');
    });

    it('returns an empty object if no cookies', function () {
      const parser = new CookieParser();
      const result = parser.parse({url: '', headers: {}});
      expect(result).to.be.eql({});
    });

    it('returns an empty object for an empty string', function () {
      const parser = new CookieParser();
      const result = parser.parse({url: '', headers: {cookie: ''}});
      expect(result).to.be.eql({});
    });
  });
});
