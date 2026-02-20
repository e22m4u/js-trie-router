import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {isResponseSent} from './is-response-sent.js';

describe('isResponseSent', function () {
  it('should require the parameter "response" to be an Object with the "headersSent" property', function () {
    const throwable = v => () => isResponseSent(v);
    const error = v =>
      format(
        'Parameter "response" must be an instance of ServerResponse, ' +
          'but %s was given.',
        v,
      );
    expect(throwable('str')).to.throw(error('"str"'));
    expect(throwable('')).to.throw(error('""'));
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    throwable({headersSent: true})();
    throwable({headersSent: false})();
  });

  it('should return true when the property "headersSent" is true', function () {
    const res = isResponseSent({headersSent: true});
    expect(res).to.be.true;
  });

  it('should return false when the property "headersSent" is false', function () {
    const res = isResponseSent({headersSent: false});
    expect(res).to.be.false;
  });
});
