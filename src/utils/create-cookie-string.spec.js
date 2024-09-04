import {expect} from '../chai.js';
import {format} from '@e22m4u/js-format';
import {createCookieString} from './create-cookie-string.js';

describe('createCookieString', function () {
  it('requires the first argument to be an object', function () {
    const throwable = v => () => createCookieString(v);
    const error = v =>
      format(
        'The first parameter of "createCookieString" should be ' +
          'an Object, but %s given.',
        v,
      );
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    throwable({key: 'value'})();
    throwable({})();
  });

  it('returns an empty string if no keys', function () {
    expect(createCookieString({})).to.be.eq('');
  });

  it('returns a cookies string from a given object', function () {
    const data = {foo: 'bar', baz: 'quz'};
    const result = createCookieString(data);
    expect(result).to.be.eq('foo=bar; baz=quz;');
  });
});
