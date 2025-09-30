import {expect} from '../chai.js';
import {format} from '@e22m4u/js-format';
import {parseCookies} from './parse-cookies.js';

describe('parseCookies', function () {
  it('requires the first parameter to be an IncomingMessage instance', function () {
    const throwable = v => () => parseCookies(v);
    const error = v =>
      format(
        'The first parameter of "parseCookies" should be ' +
          'a String, but %s was given.',
        v,
      );
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    throwable('str')();
    throwable('')();
  });

  it('returns cookies as a plain object', function () {
    const value = 'pkg=math; equation=E%3Dmc%5E2';
    const result = parseCookies(value);
    expect(result).to.have.property('pkg', 'math');
    expect(result).to.have.property('equation', 'E=mc^2');
  });

  it('returns an empty object for an empty string', function () {
    const result = parseCookies('');
    expect(result).to.be.eql({});
  });

  it('parses an empty cookie as an empty string', function () {
    const result = parseCookies('foo=bar; baz');
    expect(result).to.be.eql({foo: 'bar', baz: ''});
  });
});
