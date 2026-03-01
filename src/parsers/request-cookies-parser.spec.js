import {expect} from 'chai';
import {RequestCookiesParser} from './request-cookies-parser.js';

describe('RequestCookiesParser', function () {
  describe('parse', function () {
    it('should return parsed cookies as a plain object', function () {
      const parser = new RequestCookiesParser();
      const value = 'pkg=math; equation=E%3Dmc%5E2';
      const result = parser.parse({url: '', headers: {cookie: value}});
      expect(result).to.have.property('pkg', 'math');
      expect(result).to.have.property('equation', 'E=mc^2');
    });

    it('should return an empty object if no cookie header is specified', function () {
      const parser = new RequestCookiesParser();
      const result = parser.parse({url: '', headers: {}});
      expect(result).to.be.eql({});
    });

    it('should return an empty object if the cookie header has an empty string', function () {
      const parser = new RequestCookiesParser();
      const result = parser.parse({url: '', headers: {cookie: ''}});
      expect(result).to.be.eql({});
    });
  });
});
