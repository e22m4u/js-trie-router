import {expect} from '../chai.js';
import {format} from '@e22m4u/js-format';
import {getRequestPath} from './get-request-path.js';

describe('getRequestPath', function () {
  it('requires the argument to be an Object with "url" property', function () {
    const throwable = v => () => getRequestPath(v);
    const error = v =>
      format(
        'The first argument of "getRequestPath" should be ' +
          'an instance of IncomingMessage, but %s given.',
        v,
      );
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    throwable({url: ''})();
  });

  it('returns the request path without query parameters', function () {
    const res = getRequestPath({url: '/test?foo=bar'});
    expect(res).to.be.eq('/test');
  });
});
