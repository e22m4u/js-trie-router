import {expect} from 'chai';
import HttpErrors from 'http-errors';
import {createRequestMock, createResponseMock} from '../utils/index.js';

import {
  RouterErrorSender,
  EXPOSED_ERROR_PROPERTIES,
} from './router-error-sender.js';

describe('RouterErrorSender', function () {
  describe('send', function () {
    it('should send an error response as utf-8 JSON', async function () {
      const error = HttpErrors.Unauthorized();
      const req = createRequestMock();
      const res = createResponseMock();
      const S = new RouterErrorSender();
      S.send(req, res, error);
      const json = await res.getBody();
      const data = JSON.parse(json);
      expect(data).to.be.eql({error: {message: 'Unauthorized'}});
      expect(res.statusCode).to.be.eq(401);
      expect(res.getHeader('Content-Type')).to.be.eq(
        'application/json; charset=utf-8',
      );
    });

    it('should expose only specified properties of the given error', async function () {
      const error = HttpErrors.Unauthorized();
      EXPOSED_ERROR_PROPERTIES.forEach(name => (error[name] = name));
      error.shouldNotBeExposedProp = 'shouldNotBeExposedProp';
      const req = createRequestMock();
      const res = createResponseMock();
      const S = new RouterErrorSender();
      S.send(req, res, error);
      const json = await res.getBody();
      const data = JSON.parse(json);
      const expectedData = {error: {message: 'Unauthorized'}};
      EXPOSED_ERROR_PROPERTIES.forEach(
        name => (expectedData.error[name] = name),
      );
      expect(data.error).not.to.have.property('shouldNotBeExposedProp');
      expect(data).to.be.eql(expectedData);
      expect(res.statusCode).to.be.eq(401);
      expect(res.getHeader('Content-Type')).to.be.eq(
        'application/json; charset=utf-8',
      );
    });
  });

  describe('send404', function () {
    it('should send a plain text', async function () {
      const req = createRequestMock();
      const res = createResponseMock();
      const S = new RouterErrorSender();
      S.send404(req, res);
      const body = await res.getBody();
      expect(body).to.be.eql('404 Not Found');
      expect(res.statusCode).to.be.eq(404);
      expect(res.getHeader('Content-Type')).to.be.eq(
        'text/plain; charset=utf-8',
      );
    });
  });
});
