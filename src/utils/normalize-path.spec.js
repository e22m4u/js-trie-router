import {expect} from 'chai';
import {normalizePath} from './normalize-path.js';

describe('normalizePath', function () {
  describe('input validation', function () {
    it('should return a root path "/" if value is null', function () {
      expect(normalizePath(null)).to.equal('/');
    });

    it('should return a root path "/" if value is undefined', function () {
      expect(normalizePath(undefined)).to.equal('/');
    });

    it('should return a root path "/" if value is a number', function () {
      expect(normalizePath(123)).to.equal('/');
    });

    it('should return a root path "/" if value is an object', function () {
      expect(normalizePath({})).to.equal('/');
    });
  });

  describe('path normalization', function () {
    it('should replace multiple slashes with a single slash', function () {
      expect(normalizePath('//api///users//')).to.equal('/api/users');
    });

    it('should trim a given string but preserve whitespace characters', function () {
      expect(normalizePath(' /my folder/ ')).to.equal('/my folder');
      expect(normalizePath('path\twith\ntabs')).to.equal('/path\twith\ntabs');
    });

    it('should remove leading and trailing slashes before applying the final format', function () {
      expect(normalizePath('/foo/bar/')).to.equal('/foo/bar');
    });

    it('should handle an empty string by returning "/" by default', function () {
      expect(normalizePath('')).to.equal('/');
    });
  });

  describe('the "noStartingSlash" option', function () {
    it('should always prepend a leading slash when the option is false', function () {
      expect(normalizePath('foo/bar', false)).to.equal('/foo/bar');
    });

    it('should not prepend a leading slash when the option is true', function () {
      expect(normalizePath('/foo/bar/', true)).to.equal('foo/bar');
    });

    it('should return an empty string if the input results in an empty path', function () {
      expect(normalizePath('', true)).to.equal('');
      expect(normalizePath('///', true)).to.equal('');
    });
  });
});
