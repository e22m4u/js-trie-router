import {expect} from '../chai.js';
import {format} from '@e22m4u/js-format';
import {createError} from './create-error.js';

describe('createError', function () {
  it('requires the first parameter to be a constructor', function () {
    const throwable = v => () => createError(v);
    const error = v =>
      format(
        'The first argument of "createError" should be ' +
          'a constructor, but %s was given.',
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
    throwable(Error)();
  });

  it('requires the second parameter to be a String', function () {
    const throwable = v => () => createError(Error, v);
    const error = v =>
      format(
        'The second argument of "createError" should be ' +
          'a String, but %s was given.',
        v,
      );
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    throwable('str')();
    throwable('')();
    throwable(null)();
    throwable(undefined)();
  });

  it('interpolates the given message with arguments', function () {
    const res = createError(Error, 'My %s', 'message');
    expect(res.message).to.be.eq('My message');
  });
});
