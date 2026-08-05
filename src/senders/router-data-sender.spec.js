import {expect} from 'chai';
import {Readable} from 'stream';
import {createResponseMock} from '../utils/index.js';
import {RouterDataSender} from './router-data-sender.js';

describe('RouterDataSender', function () {
  describe('send', function () {
    it('should not send the response when the data is the server response', function () {
      const res = createResponseMock();
      const S = new RouterDataSender();
      const result = S.send(res, res);
      expect(result).to.be.undefined;
      expect(res.headersSent).to.be.false;
    });

    it('should not send the response when response headers are already sent', function () {
      const res = createResponseMock();
      res._headersSent = true;
      const S = new RouterDataSender();
      const result = S.send(res, 'data');
      expect(result).to.be.undefined;
    });

    it('should send 204 status code when the data is undefined', async function () {
      const res = createResponseMock();
      const S = new RouterDataSender();
      S.send(res, undefined);
      const body = await res.getBody();
      expect(body).to.be.undefined;
      expect(res.statusCode).to.be.eq(204);
    });

    it('should send 204 status code when the data is null', async function () {
      const res = createResponseMock();
      const S = new RouterDataSender();
      S.send(res, null);
      const body = await res.getBody();
      expect(body).to.be.undefined;
      expect(res.statusCode).to.be.eq(204);
    });

    it('should send the readable stream as a binary data', async function () {
      const data = 'text';
      const stream = new Readable({
        read() {
          this.push(data);
          this.push(null);
        },
      });
      const res = createResponseMock();
      const S = new RouterDataSender();
      S.send(res, stream);
      const body = await res.getBody();
      expect(body).to.be.eq(data);
      expect(res.getHeader('Content-Type')).to.be.eq(
        'application/octet-stream',
      );
    });

    it('should allow override the "Content-Type" header for a readable stream', async function () {
      const data = 'text';
      const stream = new Readable({
        read() {
          this.push(data);
          this.push(null);
        },
      });
      const res = createResponseMock();
      const contentType = 'custom/type';
      res.setHeader('Content-Type', contentType);
      const S = new RouterDataSender();
      S.send(res, stream);
      const body = await res.getBody();
      expect(body).to.be.eq(data);
      expect(res.getHeader('Content-Type')).to.be.eq(contentType);
    });

    it('should send a number value as a JSON string', async function () {
      const data = 10;
      const res = createResponseMock();
      const S = new RouterDataSender();
      S.send(res, data);
      const json = await res.getBody();
      expect(JSON.parse(json)).to.be.eql(data);
      expect(res.getHeader('Content-Type')).to.be.eq('application/json');
    });

    it('should allow override the "Content-Type" header for a number value', async function () {
      const data = 10;
      const res = createResponseMock();
      const contentType = 'custom/type';
      res.setHeader('Content-Type', contentType);
      const S = new RouterDataSender();
      S.send(res, data);
      const json = await res.getBody();
      expect(JSON.parse(json)).to.be.eql(data);
      expect(res.getHeader('Content-Type')).to.be.eq(contentType);
    });

    it('should send a boolean value as a JSON string', async function () {
      const data = true;
      const res = createResponseMock();
      const S = new RouterDataSender();
      S.send(res, data);
      const json = await res.getBody();
      expect(JSON.parse(json)).to.be.eql(data);
      expect(res.getHeader('Content-Type')).to.be.eq('application/json');
    });

    it('should allow override the "Content-Type" header for a boolean value', async function () {
      const data = true;
      const res = createResponseMock();
      const contentType = 'custom/type';
      res.setHeader('Content-Type', contentType);
      const S = new RouterDataSender();
      S.send(res, data);
      const json = await res.getBody();
      expect(JSON.parse(json)).to.be.eql(data);
      expect(res.getHeader('Content-Type')).to.be.eq(contentType);
    });

    it('should send an instance of Buffer as a binary data', async function () {
      const data = Buffer.from('text');
      const res = createResponseMock();
      const S = new RouterDataSender();
      S.send(res, data);
      const body = await res.getBody();
      expect(body).to.be.eq('text');
      expect(res.getHeader('Content-Type')).to.be.eq(
        'application/octet-stream',
      );
    });

    it('should allow override the "Content-Type" header for a Buffer', async function () {
      const data = Buffer.from('text');
      const res = createResponseMock();
      const contentType = 'custom/type';
      res.setHeader('Content-Type', contentType);
      const S = new RouterDataSender();
      S.send(res, data);
      const body = await res.getBody();
      expect(body).to.be.eq('text');
      expect(res.getHeader('Content-Type')).to.be.eq(contentType);
    });

    it('should send an object value as a JSON string', async function () {
      const data = {foo: 'bar'};
      const res = createResponseMock();
      const S = new RouterDataSender();
      S.send(res, data);
      const json = await res.getBody();
      expect(JSON.parse(json)).to.be.eql(data);
      expect(res.getHeader('Content-Type')).to.be.eq('application/json');
    });

    it('should allow override the "Content-Type" header for an object value', async function () {
      const data = {foo: 'bar'};
      const res = createResponseMock();
      const contentType = 'custom/type';
      res.setHeader('Content-Type', contentType);
      const S = new RouterDataSender();
      S.send(res, data);
      const json = await res.getBody();
      expect(JSON.parse(json)).to.be.eql(data);
      expect(res.getHeader('Content-Type')).to.be.eq(contentType);
    });

    it('should send a string value as a plain text', async function () {
      const data = 'text';
      const res = createResponseMock();
      const S = new RouterDataSender();
      S.send(res, data);
      const body = await res.getBody();
      expect(body).to.be.eq(data);
      expect(res.getHeader('Content-Type')).to.be.eq('text/plain');
    });

    it('should allow override the "Content-Type" header for a string value', async function () {
      const data = 'text';
      const res = createResponseMock();
      const contentType = 'custom/type';
      res.setHeader('Content-Type', contentType);
      const S = new RouterDataSender();
      S.send(res, data);
      const body = await res.getBody();
      expect(body).to.be.eq(data);
      expect(res.getHeader('Content-Type')).to.be.eq(contentType);
    });
  });
});
