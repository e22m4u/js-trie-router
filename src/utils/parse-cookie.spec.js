import {expect} from '../chai.js';
import {format} from '@e22m4u/js-format';
import {parseCookie} from './parse-cookie.js';

describe('parseCookie', function () {
  it('requires the first parameter to be an IncomingMessage instance', function () {
    const throwable = v => () => parseCookie(v);
    const error = v =>
      format(
        'The first parameter of "parseCookie" should be ' +
          'a String, but %s given.',
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

  it('returns cookie parameters', function () {
    const value = 'pkg=math; equation=E%3Dmc%5E2';
    const result = parseCookie(value);
    expect(result).to.have.property('pkg', 'math');
    expect(result).to.have.property('equation', 'E=mc^2');
  });

  it('returns an empty object for an empty string', function () {
    const result = parseCookie('');
    expect(result).to.be.eql({});
  });
});
