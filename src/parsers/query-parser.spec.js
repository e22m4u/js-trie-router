import {expect} from '../chai.js';
import {QueryParser} from './query-parser.js';

describe('QueryParser', function () {
  describe('parse', function () {
    it('returns query parameters', function () {
      const parser = new QueryParser();
      const value = 'foo=bar&baz=qux';
      const result = parser.parse({url: `/test?${value}`});
      expect(result).to.be.eql({foo: 'bar', baz: 'qux'});
    });

    it('returns an empty object if no query', function () {
      const parser = new QueryParser();
      const result = parser.parse({url: `/test`});
      expect(result).to.be.eql({});
    });

    it('returns an empty object for an empty query', function () {
      const parser = new QueryParser();
      const result = parser.parse({url: `/test?`});
      expect(result).to.be.eql({});
    });
  });
});
