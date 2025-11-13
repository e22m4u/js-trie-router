import {expect} from 'chai';
import {Writable} from 'stream';
import {isWritableStream} from './is-writable-stream.js';

describe('isWritableStream', function () {
  it('returns true if the value is a writable stream', function () {
    const value1 = new Writable();
    expect(isWritableStream(value1)).to.be.true;
    const value2 = {end: () => undefined};
    expect(isWritableStream(value2)).to.be.true;
  });

  it('returns false if the value is not a stream', function () {
    expect(isWritableStream('string')).to.be.false;
    expect(isWritableStream(5)).to.be.false;
    expect(isWritableStream([])).to.be.false;
    expect(isWritableStream({})).to.be.false;
    expect(isWritableStream(undefined)).to.be.false;
    expect(isWritableStream(null)).to.be.false;
    expect(isWritableStream(NaN)).to.be.false;
    expect(isWritableStream(() => 10)).to.be.false;
  });
});
