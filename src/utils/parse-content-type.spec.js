import {expect} from '../chai.js';
import {parseContentType} from './parse-content-type.js';

describe('parseContentType', function () {
  it('returns an object with specific properties', function () {
    const res = parseContentType('');
    expect(res).to.be.eql({
      mediaType: undefined,
      charset: undefined,
      boundary: undefined,
    });
  });

  it('parses media type', function () {
    const res1 = parseContentType('text/html');
    expect(res1).to.be.eql({
      mediaType: 'text/html',
      charset: undefined,
      boundary: undefined,
    });
    const res2 = parseContentType('text/html;');
    expect(res2).to.be.eql({
      mediaType: 'text/html',
      charset: undefined,
      boundary: undefined,
    });
  });

  it('parses media type with charset', function () {
    const res1 = parseContentType('text/html; charset=utf-8');
    expect(res1).to.be.eql({
      mediaType: 'text/html',
      charset: 'utf-8',
      boundary: undefined,
    });
    const res2 = parseContentType('text/html; charset=utf-8;');
    expect(res2).to.be.eql({
      mediaType: 'text/html',
      charset: 'utf-8',
      boundary: undefined,
    });
  });

  it('parses media type with boundary', function () {
    const res1 = parseContentType(
      'multipart/form-data; boundary=---WebKitFormBoundary7MA4YWxkTrZu0gW',
    );
    expect(res1).to.be.eql({
      mediaType: 'multipart/form-data',
      charset: undefined,
      boundary: '---WebKitFormBoundary7MA4YWxkTrZu0gW',
    });
    const res2 = parseContentType(
      'multipart/form-data; boundary=---WebKitFormBoundary7MA4YWxkTrZu0gW;',
    );
    expect(res2).to.be.eql({
      mediaType: 'multipart/form-data',
      charset: undefined,
      boundary: '---WebKitFormBoundary7MA4YWxkTrZu0gW',
    });
  });
});
