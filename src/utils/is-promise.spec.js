import {expect} from 'chai';
import {isPromise} from './is-promise.js';

describe('isPromise', function () {
  it('should return true if the value is a promise', function () {
    const value = Promise.resolve();
    expect(isPromise(value)).to.be.true;
  });

  it('should return false if the value is not a promise', function () {
    expect(isPromise('string')).to.be.false;
    expect(isPromise(5)).to.be.false;
    expect(isPromise([])).to.be.false;
    expect(isPromise({})).to.be.false;
    expect(isPromise(undefined)).to.be.false;
    expect(isPromise(null)).to.be.false;
    expect(isPromise(NaN)).to.be.false;
    expect(isPromise(() => 10)).to.be.false;
  });
});
