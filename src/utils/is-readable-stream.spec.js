import {expect} from '../chai.js';
import {Readable} from 'stream';
import {isReadableStream} from './is-readable-stream.js';

describe('isReadableStream', function () {
  it('returns true if the value is a readable stream', function () {
    const value1 = new Readable();
    expect(isReadableStream(value1)).to.be.true;
    const value2 = {pipe: () => undefined};
    expect(isReadableStream(value2)).to.be.true;
  });

  it('returns false if the value is not a stream', function () {
    expect(isReadableStream('string')).to.be.false;
    expect(isReadableStream(5)).to.be.false;
    expect(isReadableStream([])).to.be.false;
    expect(isReadableStream({})).to.be.false;
    expect(isReadableStream(undefined)).to.be.false;
    expect(isReadableStream(null)).to.be.false;
    expect(isReadableStream(NaN)).to.be.false;
    expect(isReadableStream(() => 10)).to.be.false;
  });
});
