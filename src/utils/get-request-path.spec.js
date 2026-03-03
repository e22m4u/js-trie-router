import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {getRequestPath} from './get-request-path.js';

describe('getRequestPath', function () {
  it('should require the parameter "request" to be an Object with the "url" property', function () {
    const throwable = v => () => getRequestPath(v);
    const error = v =>
      format(
        'Parameter "request" must be an instance of IncomingMessage, ' +
          'but %s was given.',
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

  it('should return the request path with a query string', function () {
    const res1 = getRequestPath({url: 'pathname?foo=bar'});
    const res2 = getRequestPath({url: '/pathname?foo=bar'});
    const res3 = getRequestPath({url: 'http://example.com/pathname?foo=bar'});
    expect(res1).to.be.eq('pathname?foo=bar');
    expect(res2).to.be.eq('/pathname?foo=bar');
    expect(res3).to.be.eq('/pathname?foo=bar');
  });

  it('should preserve a trailing slash', function () {
    const res1 = getRequestPath({url: '/pathname/'});
    expect(res1).to.be.eq('/pathname/');
    const res2 = getRequestPath({url: '/pathname/?foo=bar'});
    expect(res2).to.be.eq('/pathname/?foo=bar');
  });
});
