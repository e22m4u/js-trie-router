import {expect} from 'chai';
import {hasRequestBody} from './has-request-body.js';
import {createRequestMock} from './create-request-mock.js';

describe('hasRequestBody', function () {
  it('should return true when a request has the "transfer-encoding" header', function () {
    const req1 = createRequestMock({headers: {}});
    expect(hasRequestBody(req1)).to.be.false;
    const req2 = createRequestMock({headers: {'transfer-encoding': 'chunked'}});
    expect(hasRequestBody(req2)).to.be.true;
  });

  it('should return true when a request has a positive number in the "content-length" header', function () {
    const req1 = createRequestMock({headers: {}});
    expect(hasRequestBody(req1)).to.be.false;
    const req2 = createRequestMock({headers: {'content-length': 'abc'}});
    expect(hasRequestBody(req2)).to.be.false;
    const req3 = createRequestMock({headers: {'content-length': '0'}});
    expect(hasRequestBody(req3)).to.be.false;
    const req4 = createRequestMock({headers: {'content-length': '5'}});
    expect(hasRequestBody(req4)).to.be.true;
  });
});
