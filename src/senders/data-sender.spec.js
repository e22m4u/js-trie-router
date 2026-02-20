import {expect} from 'chai';
import {Readable, Writable} from 'stream';
import {DataSender} from './data-sender.js';
import {createResponseMock} from '../utils/index.js';

describe('DataSender', function () {
  describe('send', function () {
    it('should not send response when the data is the server response', function (done) {
      const res = createResponseMock();
      const writable = new Writable();
      writable._write = function () {
        throw new Error('Should not be called');
      };
      writable._final = function () {
        throw new Error('Should not be called');
      };
      res.pipe(writable);
      const S = new DataSender();
      const result = S.send(res, res);
      expect(result).to.be.undefined;
      setTimeout(() => done(), 5);
    });

    it('should not send response when response headers already sent', function (done) {
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
      const S = new DataSender();
      const result = S.send(res, 'data');
      expect(result).to.be.undefined;
      setTimeout(() => done(), 5);
    });

    it('should send 204 status code when the data is undefined', function (done) {
      const res = createResponseMock();
      res.on('data', () => done(new Error('Should not be called')));
      res.on('error', e => done(e));
      res.on('end', () => {
        expect(res.statusCode).to.be.eq(204);
        done();
      });
      const S = new DataSender();
      const result = S.send(res, undefined);
      expect(result).to.be.undefined;
    });

    it('should send 204 status code when the data is null', function (done) {
      const res = createResponseMock();
      res.on('data', () => done(new Error('Should not be called')));
      res.on('error', e => done(e));
      res.on('end', () => {
        expect(res.statusCode).to.be.eq(204);
        done();
      });
      const S = new DataSender();
      const result = S.send(res, null);
      expect(result).to.be.undefined;
    });

    it('should send the readable stream as a binary data', function (done) {
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
      const S = new DataSender();
      S.send(res, stream);
    });

    it('should allow override the header "content-type" for a readable stream', function (done) {
      const data = 'text';
      const stream = new Readable();
      stream._read = () => {};
      stream.push(data);
      stream.push(null);
      const res = createResponseMock();
      const contentType = 'custom/type';
      res.setHeader('content-type', contentType);
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
        expect(ct).to.be.eq(contentType);
        callback();
        done();
      };
      res.pipe(writable);
      const S = new DataSender();
      S.send(res, stream);
    });

    it('should send the number value as a JSON string', function (done) {
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
      const S = new DataSender();
      S.send(res, data);
    });

    it('should allow override the header "content-type" for a number value', function (done) {
      const data = 10;
      const res = createResponseMock();
      const contentType = 'custom/type';
      res.setHeader('content-type', contentType);
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
        expect(ct).to.be.eq(contentType);
        callback();
        done();
      };
      res.pipe(writable);
      const S = new DataSender();
      S.send(res, data);
    });

    it('should send the boolean value as a JSON string', function (done) {
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
      const S = new DataSender();
      S.send(res, data);
    });

    it('should allow override the header "content-type" for a boolean value', function (done) {
      const data = true;
      const res = createResponseMock();
      const contentType = 'custom/type';
      res.setHeader('content-type', contentType);
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
        expect(ct).to.be.eq(contentType);
        callback();
        done();
      };
      res.pipe(writable);
      const S = new DataSender();
      S.send(res, data);
    });

    it('should send the Buffer as a binary data', function (done) {
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
      const S = new DataSender();
      S.send(res, data);
    });

    it('should allow override the header "content-type" for a Buffer', function (done) {
      const data = Buffer.from('text');
      const res = createResponseMock();
      const contentType = 'custom/type';
      res.setHeader('content-type', contentType);
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
        expect(ct).to.be.eq(contentType);
        callback();
        done();
      };
      res.pipe(writable);
      const S = new DataSender();
      S.send(res, data);
    });

    it('should send the object value as a JSON string', function (done) {
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
      const S = new DataSender();
      S.send(res, data);
    });

    it('should allow override the header "content-type" for an object value', function (done) {
      const data = {foo: 'bar'};
      const res = createResponseMock();
      const contentType = 'custom/type';
      res.setHeader('content-type', contentType);
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
        expect(ct).to.be.eq(contentType);
        callback();
        done();
      };
      res.pipe(writable);
      const S = new DataSender();
      S.send(res, data);
    });

    it('should send the string value as a plain text', function (done) {
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
      const S = new DataSender();
      S.send(res, data);
    });

    it('should allow override the header "content-type" for a string value', function (done) {
      const data = 'text';
      const res = createResponseMock();
      const contentType = 'custom/type';
      res.setHeader('content-type', contentType);
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
        expect(ct).to.be.eq(contentType);
        callback();
        done();
      };
      res.pipe(writable);
      const S = new DataSender();
      S.send(res, data);
    });
  });
});
