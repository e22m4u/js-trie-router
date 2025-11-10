import {PassThrough} from 'stream';

/**
 * Create response mock.
 *
 * @returns {import('http').ServerResponse}
 */
export function createResponseMock() {
  const res = new PassThrough();
  patchEncoding(res);
  patchHeaders(res);
  patchBody(res);
  return res;
}

/**
 * Patch encoding.
 *
 * @param {object} res
 */
function patchEncoding(res) {
  Object.defineProperty(res, '_encoding', {
    configurable: true,
    writable: true,
    value: undefined,
  });
  Object.defineProperty(res, 'setEncoding', {
    configurable: true,
    value: function (enc) {
      this._encoding = enc;
      return this;
    },
  });
  Object.defineProperty(res, 'getEncoding', {
    configurable: true,
    value: function () {
      return this._encoding;
    },
  });
}

/**
 * Patch headers.
 *
 * @param {object} res
 */
function patchHeaders(res) {
  Object.defineProperty(res, '_headersSent', {
    configurable: true,
    writable: true,
    value: false,
  });
  Object.defineProperty(res, 'headersSent', {
    configurable: true,
    get() {
      return this._headersSent;
    },
  });
  Object.defineProperty(res, '_headers', {
    configurable: true,
    writable: true,
    value: {},
  });
  Object.defineProperty(res, 'setHeader', {
    configurable: true,
    value: function (name, value) {
      if (this.headersSent)
        throw new Error(
          'Error [ERR_HTTP_HEADERS_SENT]: ' +
            'Cannot set headers after they are sent to the client',
        );
      const key = name.toLowerCase();
      this._headers[key] = String(value);
      return this;
    },
  });
  Object.defineProperty(res, 'getHeader', {
    configurable: true,
    value: function (name) {
      return this._headers[name.toLowerCase()];
    },
  });
  Object.defineProperty(res, 'getHeaders', {
    configurable: true,
    value: function () {
      return JSON.parse(JSON.stringify(this._headers));
    },
  });
}

/**
 * Patch body.
 *
 * @param {object} res
 */
function patchBody(res) {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const data = [];
  res.on('data', c => data.push(c));
  res.on('error', e => reject(e));
  res.on('end', () => {
    resolve(Buffer.concat(data));
  });
  // флаг _headersSent должен быть установлен синхронно
  // после вызова метода res.end, так как асинхронная
  // установка (к примеру в res.on('end')) не позволит
  // отследить отправку ответа при синхронном выполнении
  const originalEnd = res.end.bind(res);
  res.end = function (...args) {
    this._headersSent = true;
    return originalEnd(...args);
  };
  Object.defineProperty(res, 'getBody', {
    configurable: true,
    value: function () {
      return promise.then(buffer => {
        const enc = this.getEncoding();
        const str = buffer.toString(enc);
        return data.length ? str : undefined;
      });
    },
  });
}
