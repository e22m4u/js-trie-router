import {expect} from 'chai';
import {RequestQueryParser} from './request-query-parser.js';

describe('RequestQueryParser', function () {
  describe('parse', function () {
    it('should return query parameters', function () {
      const parser = new RequestQueryParser();
      const value = 'foo=bar&baz=qux';
      const result = parser.parse({url: `/test?${value}`});
      expect(result).to.be.eql({foo: 'bar', baz: 'qux'});
    });

    it('should return an empty object when the url does not have a query string', function () {
      const parser = new RequestQueryParser();
      const result = parser.parse({url: `/test`});
      expect(result).to.be.eql({});
    });

    it('should return an empty object when the url has an empty query string', function () {
      const parser = new RequestQueryParser();
      const result = parser.parse({url: `/test?`});
      expect(result).to.be.eql({});
    });
  });
});
