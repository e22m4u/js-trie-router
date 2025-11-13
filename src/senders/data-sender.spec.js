import {expect} from 'chai';
import {Readable, Writable} from 'stream';
import {DataSender} from './data-sender.js';
import {createResponseMock} from '../utils/index.js';

describe('DataSender', function () {
  describe('send', function () {
    it('does nothing if the data is the given response', function (done) {
      const res = createResponseMock();
      const writable = new Writable();
      writable._write = function () {
        throw new Error('Should not be called');
      };
      writable._final = function () {
        throw new Error('Should not be called');
      };
      res.pipe(writable);
      const s = new DataSender();
      const result = s.send(res, res);
      expect(result).to.be.undefined;
      setTimeout(() => done(), 5);
    });

    it('does nothing if response headers already sent', function (done) {
      const res = createResponseMock();
      res._headersSent = true;
      const writable = new Writable();
      writable._write = function () {
        throw new Error('Should not be called');
      };
      writable._final = function () {
        throw new Error('Should not be called');
      };
      res.pipe(writable);
      const s = new DataSender();
      const result = s.send(res, 'data');
      expect(result).to.be.undefined;
      setTimeout(() => done(), 5);
    });

    it('sends 204 if no data', function (done) {
      const res = createResponseMock();
      res.on('data', () => done(new Error('Should not be called')));
      res.on('error', e => done(e));
      res.on('end', () => {
        expect(res.statusCode).to.be.eq(204);
        done();
      });
      const s = new DataSender();
      const result = s.send(res, undefined);
      expect(result).to.be.undefined;
    });

    it('sends the given readable stream as binary data', function (done) {
      const data = 'text';
      const stream = new Readable();
      stream._read = () => {};
      stream.push(data);
      stream.push(null);
      const res = createResponseMock();
      const writable = new Writable();
      const chunks = [];
      writable._write = function (chunk, encoding, done) {
        chunks.push(chunk);
        done();
      };
      writable._final = function (callback) {
        const sentData = Buffer.concat(chunks).toString('utf-8');
        expect(sentData).to.be.eq(data);
        const ct = res.getHeader('content-type');
        expect(ct).to.be.eq('application/octet-stream');
        callback();
        done();
      };
      res.pipe(writable);
      const s = new DataSender();
      s.send(res, stream);
    });

    it('sends the given Buffer as binary data', function (done) {
      const data = Buffer.from('text');
      const res = createResponseMock();
      const writable = new Writable();
      const chunks = [];
      writable._write = function (chunk, encoding, done) {
        chunks.push(chunk);
        done();
      };
      writable._final = function (callback) {
        const sentData = Buffer.concat(chunks);
        expect(sentData).to.be.eql(sentData);
        const ct = res.getHeader('content-type');
        expect(ct).to.be.eq('application/octet-stream');
        callback();
        done();
      };
      res.pipe(writable);
      const s = new DataSender();
      s.send(res, data);
    });

    it('sends the given string as plain text', function (done) {
      const data = 'text';
      const res = createResponseMock();
      const writable = new Writable();
      const chunks = [];
      writable._write = function (chunk, encoding, done) {
        chunks.push(chunk);
        done();
      };
      writable._final = function (callback) {
        const sentData = Buffer.concat(chunks).toString('utf-8');
        expect(sentData).to.be.eq(data);
        const ct = res.getHeader('content-type');
        expect(ct).to.be.eq('text/plain');
        callback();
        done();
      };
      res.pipe(writable);
      const s = new DataSender();
      s.send(res, data);
    });

    it('sends the given object as JSON', function (done) {
      const data = {foo: 'bar'};
      const res = createResponseMock();
      const writable = new Writable();
      const chunks = [];
      writable._write = function (chunk, encoding, done) {
        chunks.push(chunk);
        done();
      };
      writable._final = function (callback) {
        const sentJson = Buffer.concat(chunks).toString('utf-8');
        const sentData = JSON.parse(sentJson);
        expect(sentData).to.be.eql(data);
        const ct = res.getHeader('content-type');
        expect(ct).to.be.eq('application/json');
        callback();
        done();
      };
      res.pipe(writable);
      const s = new DataSender();
      s.send(res, data);
    });

    it('sends the given boolean as JSON', function (done) {
      const data = true;
      const res = createResponseMock();
      const writable = new Writable();
      const chunks = [];
      writable._write = function (chunk, encoding, done) {
        chunks.push(chunk);
        done();
      };
      writable._final = function (callback) {
        const sentJson = Buffer.concat(chunks).toString('utf-8');
        const sentData = JSON.parse(sentJson);
        expect(sentData).to.be.eql(data);
        const ct = res.getHeader('content-type');
        expect(ct).to.be.eq('application/json');
        callback();
        done();
      };
      res.pipe(writable);
      const s = new DataSender();
      s.send(res, data);
    });

    it('sends the given number as JSON', function (done) {
      const data = 10;
      const res = createResponseMock();
      const writable = new Writable();
      const chunks = [];
      writable._write = function (chunk, encoding, done) {
        chunks.push(chunk);
        done();
      };
      writable._final = function (callback) {
        const sentJson = Buffer.concat(chunks).toString('utf-8');
        const sentData = JSON.parse(sentJson);
        expect(sentData).to.be.eql(data);
        const ct = res.getHeader('content-type');
        expect(ct).to.be.eq('application/json');
        callback();
        done();
      };
      res.pipe(writable);
      const s = new DataSender();
      s.send(res, data);
    });
  });
});
