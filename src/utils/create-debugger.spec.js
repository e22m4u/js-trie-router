import {expect} from '../chai.js';
import {format} from '@e22m4u/js-format';
import {createDebugger} from './create-debugger.js';

describe('createDebugger', function () {
  it('requires the first parameter to be a String', function () {
    const throwable = v => () => createDebugger(v);
    const error = v =>
      format(
        'The first argument of "createDebugger" should be ' +
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

  it('returns a function', function () {
    const res = createDebugger('name');
    expect(typeof res).to.be.eq('function');
  });
});
