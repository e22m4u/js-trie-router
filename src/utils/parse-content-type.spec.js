import {expect} from 'chai';
import {parseContentType} from './parse-content-type.js';
import {format} from '@e22m4u/js-format';

describe('parseContentType', function () {
  it('requires the first parameter to be a string', function () {
    const throwable = v => () => parseContentType(v);
    const error = s =>
      format(
        'The first parameter of `parseContentType` ' +
          'should be a String, but %s was given.',
        s,
      );
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable(() => undefined)).to.throw(error('Function'));
    throwable('text/html')();
  });

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
