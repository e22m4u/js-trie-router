import {Writable} from 'stream';
import {expect} from 'chai';
import HttpErrors from 'http-errors';
import {ErrorSender} from './error-sender.js';
import {createRequestMock} from '../utils/index.js';
import {createResponseMock} from '../utils/index.js';
import {EXPOSED_ERROR_PROPERTIES} from './error-sender.js';

describe('ErrorSender', function () {
  describe('send', function () {
    it('sends error as utf-8 JSON', function (done) {
      const error = HttpErrors.Unauthorized();
      const req = createRequestMock();
      const res = createResponseMock();
      const writable = new Writable();
      const chunks = [];
      writable._write = function (chunk, encoding, done) {
        chunks.push(chunk);
        done();
      };
      writable._final = function (callback) {
        const json = Buffer.concat(chunks).toString('utf-8');
        const data = JSON.parse(json);
        expect(data).to.be.eql({error: {message: 'Unauthorized'}});
        expect(res.statusCode).to.be.eq(401);
        const ct = res.getHeader('content-type');
        expect(ct).to.be.eq('application/json; charset=utf-8');
        callback();
        done();
      };
      res.pipe(writable);
      const s = new ErrorSender();
      s.send(req, res, error);
    });

    it('exposes only specified properties of the given error', function (done) {
      const error = HttpErrors.Unauthorized();
      EXPOSED_ERROR_PROPERTIES.forEach(name => (error[name] = name));
      error.shouldNotBeExposedProp = 'shouldNotBeExposedProp';
      const req = createRequestMock();
      const res = createResponseMock();
      const writable = new Writable();
      const chunks = [];
      writable._write = function (chunk, encoding, done) {
        chunks.push(chunk);
        done();
      };
      writable._final = function (callback) {
        const json = Buffer.concat(chunks).toString('utf-8');
        const data = JSON.parse(json);
        const expectedData = {error: {message: 'Unauthorized'}};
        EXPOSED_ERROR_PROPERTIES.forEach(
          name => (expectedData.error[name] = name),
        );
        expect(data.error).not.to.have.property('shouldNotBeExposedProp');
        expect(data).to.be.eql(expectedData);
        expect(res.statusCode).to.be.eq(401);
        const ct = res.getHeader('content-type');
        expect(ct).to.be.eq('application/json; charset=utf-8');
        callback();
        done();
      };
      res.pipe(writable);
      const s = new ErrorSender();
      s.send(req, res, error);
    });
  });

  describe('send404', function () {
    it('sends plain text', function (done) {
      const req = createRequestMock();
      const res = createResponseMock();
      const writable = new Writable();
      const chunks = [];
      writable._write = function (chunk, encoding, done) {
        chunks.push(chunk);
        done();
      };
      writable._final = function (callback) {
        const body = Buffer.concat(chunks).toString('utf-8');
        expect(body).to.be.eql('404 Not Found');
        expect(res.statusCode).to.be.eq(404);
        const ct = res.getHeader('content-type');
        expect(ct).to.be.eq('text/plain; charset=utf-8');
        callback();
        done();
      };
      res.pipe(writable);
      const s = new ErrorSender();
      s.send404(req, res);
    });
  });
});
