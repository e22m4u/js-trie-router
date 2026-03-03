import {Socket} from 'net';
import {TLSSocket} from 'tls';
import {IncomingMessage} from 'http';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {isReadableStream} from './is-readable-stream.js';
import {CHARACTER_ENCODING_LIST} from './fetch-request-body.js';

/**
 * @typedef {{
 *   host?: string;
 *   method?: string;
 *   secure?: boolean;
 *   url?: string;
 *   headers?: object;
 *   body?: unknown;
 *   stream?: import('stream').Readable;
 *   encoding?: import('buffer').BufferEncoding;
 * }} RequestOptions
 */

/**
 * Supported options.
 */
const SUPPORTED_OPTIONS = [
  'host',
  'method',
  'secure',
  'url',
  'headers',
  'body',
  'stream',
  'encoding',
];

/**
 * Create request mock.
 *
 * @param {RequestOptions} [options]
 * @returns {import('http').IncomingMessage}
 */
export function createRequestMock(options) {
  if (options !== undefined) {
    if (!options || typeof options !== 'object' || Array.isArray(options)) {
      throw new InvalidArgumentError(
        'Parameter "options" must be an Object, but %v was given.',
        options,
      );
    }
    Object.keys(options).forEach(optionName => {
      if (!SUPPORTED_OPTIONS.includes(optionName)) {
        throw new InvalidArgumentError(
          'Option %v is not supported.',
          optionName,
        );
      }
    });
    // options.host
    if (options.host !== undefined && typeof options.host !== 'string') {
      throw new InvalidArgumentError(
        'Option "host" must be a String, but %v was given.',
        options.host,
      );
    }
    // options.method
    if (options.method !== undefined && typeof options.method !== 'string') {
      throw new InvalidArgumentError(
        'Option "method" must be a String, but %v was given.',
        options.method,
      );
    }
    // options.secure
    if (options.secure !== undefined && typeof options.secure !== 'boolean') {
      throw new InvalidArgumentError(
        'Option "secure" must be a Boolean, but %v was given.',
        options.secure,
      );
    }
    // option.url
    if (options.url !== undefined) {
      if (typeof options.url !== 'string') {
        throw new InvalidArgumentError(
          'Option "url" must be a String, but %v was given.',
          options.url,
        );
      }
      if (options.url.indexOf('#') !== -1) {
        throw new InvalidArgumentError(
          'Option "url" must not contain "#", but %v was given.',
          options.url,
        );
      }
    }
    // options.headers
    if (options.headers !== undefined) {
      if (
        !options.headers ||
        typeof options.headers !== 'object' ||
        Array.isArray(options.headers)
      ) {
        throw new InvalidArgumentError(
          'Option "headers" must be an Object, but %v was given.',
          options.headers,
        );
      }
      // options.headers[k]
      Object.keys(options.headers).forEach(headerName => {
        const headerValue = options.headers[headerName];
        if (headerValue !== undefined) {
          if (typeof headerValue !== 'string' && !Array.isArray(headerValue)) {
            throw new InvalidArgumentError(
              'Header %v must be a String or an Array, but %v was given.',
              headerName,
              headerValue,
            );
          }
          // options.headers[k][n]
          if (Array.isArray(headerValue)) {
            headerValue.forEach((headerEl, index) => {
              if (typeof headerEl !== 'string') {
                throw new InvalidArgumentError(
                  'Element %d of the header %v must be a String, ' +
                    'but %v was given.',
                  index,
                  headerName,
                  headerEl,
                );
              }
            });
          }
        }
      });
    }
    // options.stream
    if (options.stream !== undefined && !isReadableStream(options.stream)) {
      throw new InvalidArgumentError(
        'Option "stream" must be a Stream, but %v was given.',
        options.stream,
      );
    }
    // options.encoding
    if (options.encoding !== undefined) {
      if (typeof options.encoding !== 'string') {
        throw new InvalidArgumentError(
          'Option "encoding" must be a String, but %v was given.',
          options.encoding,
        );
      }
      if (!CHARACTER_ENCODING_LIST.includes(options.encoding)) {
        throw new InvalidArgumentError(
          'Character encoding %v is not supported.',
          options.encoding,
        );
      }
    }
    // если передан поток, выполняется
    // проверка на несовместимые опции
    if (options.stream) {
      if (options.secure !== undefined) {
        throw new InvalidArgumentError(
          'The "stream" and "secure" options cannot be used together.',
        );
      }
      if (options.body !== undefined) {
        throw new InvalidArgumentError(
          'The "stream" and "body" options cannot be used together.',
        );
      }
      if (options.encoding !== undefined) {
        throw new InvalidArgumentError(
          'The "stream" and "encoding" options cannot be used together.',
        );
      }
    }
  }
  options = options || {};
  let request;
  if (options.stream) {
    // перенаправление данных из переданного потока
    // в новый IncomingMessage, чтобы сохранить
    // работу проверки instanceof
    const socket = new Socket();
    request = new IncomingMessage(socket);
    options.stream.on('data', chunk => request.push(chunk));
    options.stream.on('end', () => request.push(null));
    options.stream.on('error', err => request.emit('error', err));
  } else {
    request = createRequestStream(
      options.secure,
      options.body,
      options.encoding,
    );
  }
  // добавление свойств сокета
  // для определения IP адреса
  Object.defineProperty(request.socket, 'remoteAddress', {value: '127.0.0.1'});
  Object.defineProperty(request.socket, 'localAddress', {value: '127.0.0.1'});
  // определение остальных свойств
  // экземпляра IncomingMessage
  request.httpVersion = '1.1';
  request.url = options.url || '/';
  request.headers = createRequestHeaders(
    options.host,
    options.secure,
    options.body,
    options.encoding,
    options.headers,
  );
  request.method = (options.method || 'get').toUpperCase();
  return request;
}

/**
 * Create request stream.
 *
 * @param {boolean|null|undefined} secure
 * @param {*} body
 * @param {import('buffer').BufferEncoding|null|undefined} encoding
 * @returns {import('http').IncomingMessage}
 */
function createRequestStream(secure, body, encoding) {
  if (encoding !== undefined && typeof encoding !== 'string') {
    throw new InvalidArgumentError(
      'Parameter "encoding" must be a String, but %v was given.',
      encoding,
    );
  }
  encoding = encoding || 'utf-8';
  // для безопасного подключения
  // использует обертка TLSSocket
  let socket = new Socket();
  // при использовании опции "secure"
  // создается новый экземпляр TLSSocket
  if (secure) {
    socket = new TLSSocket(socket);
  }
  const request = new IncomingMessage(socket);
  // тело запроса должно являться
  // строкой или бинарными данными
  if (body != null) {
    if (typeof body === 'string') {
      request.push(body, encoding);
    } else if (Buffer.isBuffer(body)) {
      request.push(body);
    } else {
      request.push(JSON.stringify(body), encoding);
    }
  }
  // передача "null" определяет
  // конец данных
  request.push(null);
  return request;
}

/**
 * Create request headers.
 *
 * @param {string|null|undefined} host
 * @param {boolean|null|undefined} secure
 * @param {*} body
 * @param {import('buffer').BufferEncoding|null|undefined} encoding
 * @param {object|null|undefined} headers
 * @returns {object}
 */
function createRequestHeaders(host, secure, body, encoding, headers) {
  if (host !== undefined && typeof host !== 'string') {
    throw new InvalidArgumentError(
      'Parameter "host" must be a non-empty String, but %v was given.',
      host,
    );
  }
  host = host || 'localhost';
  if (secure !== undefined && typeof secure !== 'boolean') {
    throw new InvalidArgumentError(
      'Parameter "secure" must be a Boolean, but %v was given.',
      secure,
    );
  }
  secure = Boolean(secure);
  if (
    (headers !== undefined && typeof headers !== 'object') ||
    Array.isArray(headers)
  ) {
    throw new InvalidArgumentError(
      'Parameter "headers" must be an Object, but %v was given.',
      headers,
    );
  }
  headers = headers || {};
  if (encoding !== undefined && typeof encoding !== 'string') {
    throw new InvalidArgumentError(
      'Parameter "encoding" must be a String, but %v was given.',
      encoding,
    );
  }
  encoding = encoding || 'utf-8';
  const res = {};
  Object.keys(headers).forEach(headerName => {
    res[headerName.toLowerCase()] = headers[headerName];
  });
  if (res.host === undefined) {
    res['host'] = host;
  }
  if (secure) {
    res['x-forwarded-proto'] = 'https';
  }
  // установка заголовка "content-type"
  // в зависимости от тела запроса
  if (body != null && !('content-type' in res)) {
    if (typeof body === 'string') {
      res['content-type'] = 'text/plain';
    } else if (Buffer.isBuffer(body)) {
      res['content-type'] = 'application/octet-stream';
    } else if (
      typeof body === 'object' ||
      typeof body === 'boolean' ||
      typeof body === 'number'
    ) {
      res['content-type'] = 'application/json';
    }
  }
  // подсчет количества байт тела
  // для заголовка "content-length"
  if (
    body != null &&
    res['transfer-encoding'] == null &&
    res['content-length'] == null
  ) {
    if (typeof body === 'string') {
      const length = Buffer.byteLength(body, encoding);
      res['content-length'] = String(length);
    } else if (Buffer.isBuffer(body)) {
      const length = Buffer.byteLength(body);
      res['content-length'] = String(length);
    } else if (
      typeof body === 'object' ||
      typeof body === 'boolean' ||
      typeof body === 'number'
    ) {
      const json = JSON.stringify(body);
      const length = Buffer.byteLength(json, encoding);
      res['content-length'] = String(length);
    }
  }
  return res;
}
