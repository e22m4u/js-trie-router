import {Socket} from 'net';
import {TLSSocket} from 'tls';
import {IncomingMessage} from 'http';
import queryString from 'querystring';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {isReadableStream} from './is-readable-stream.js';
import {createCookieString} from './create-cookie-string.js';
import {CHARACTER_ENCODING_LIST} from './fetch-request-body.js';

/**
 * @typedef {{
 *   host?: string;
 *   method?: string;
 *   secure?: boolean;
 *   path?: string;
 *   query?: string | object;
 *   cookies?: object;
 *   headers?: object;
 *   body?: string;
 *   stream?: import('stream').Readable;
 *   encoding?: import('buffer').BufferEncoding;
 * }} RequestOptions
 */

/**
 * Create request mock.
 *
 * @param {RequestOptions} options
 * @returns {import('http').IncomingMessage}
 */
export function createRequestMock(options) {
  if (
    (options != null && typeof options !== 'object') ||
    Array.isArray(options)
  ) {
    throw new InvalidArgumentError(
      'The parameter "options" must be an Object, but %v was given.',
      options,
    );
  }
  options = options || {};
  if (options.host != null && typeof options.host !== 'string') {
    throw new InvalidArgumentError(
      'The parameter "host" must be a String, but %v was given.',
      options.host,
    );
  }
  if (options.method != null && typeof options.method !== 'string') {
    throw new InvalidArgumentError(
      'The parameter "method" must be a String, but %v was given.',
      options.method,
    );
  }
  if (options.secure != null && typeof options.secure !== 'boolean') {
    throw new InvalidArgumentError(
      'The parameter "secure" must be a Boolean, but %v was given.',
      options.secure,
    );
  }
  if (options.path != null && typeof options.path !== 'string') {
    throw new InvalidArgumentError(
      'The parameter "path" must be a String, but %v was given.',
      options.path,
    );
  }
  if (
    (options.query != null &&
      typeof options.query !== 'object' &&
      typeof options.query !== 'string') ||
    Array.isArray(options.query)
  ) {
    throw new InvalidArgumentError(
      'The parameter "query" must be a String or Object, but %v was given.',
      options.query,
    );
  }
  if (
    (options.cookies != null &&
      typeof options.cookies !== 'string' &&
      typeof options.cookies !== 'object') ||
    Array.isArray(options.cookies)
  ) {
    throw new InvalidArgumentError(
      'The parameter "cookies" must be a String or Object, but %v was given.',
      options.cookies,
    );
  }
  if (
    (options.headers != null && typeof options.headers !== 'object') ||
    Array.isArray(options.headers)
  ) {
    throw new InvalidArgumentError(
      'The parameter "headers" must be an Object, but %v was given.',
      options.headers,
    );
  }
  if (options.stream != null && !isReadableStream(options.stream)) {
    throw new InvalidArgumentError(
      'The parameter "stream" must be a Stream, but %v was given.',
      options.stream,
    );
  }
  if (options.encoding != null) {
    if (typeof options.encoding !== 'string') {
      throw new InvalidArgumentError(
        'The parameter "encoding" must be a String, but %v was given.',
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
    if (options.secure != null) {
      throw new InvalidArgumentError(
        'The option "stream" cannot be used with the option "secure" ' +
          'simultaneously.',
      );
    }
    if (options.body != null) {
      throw new InvalidArgumentError(
        'The option "stream" cannot be used with the option "body" ' +
          'simultaneously.',
      );
    }
    if (options.encoding != null) {
      throw new InvalidArgumentError(
        'The option "stream" cannot be used with the option "encoding" ' +
          'simultaneously.',
      );
    }
  }
  // если передан поток, он будет использован
  // в качестве объекта запроса, в противном
  // случае создается новый
  const request =
    options.stream ||
    createRequestStream(options.secure, options.body, options.encoding);
  request.url = createRequestUrl(options.path || '/', options.query);
  request.headers = createRequestHeaders(
    options.host,
    options.secure,
    options.body,
    options.cookies,
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
  if (encoding != null && typeof encoding !== 'string') {
    throw new InvalidArgumentError(
      'The parameter "encoding" must be a String, but %v was given.',
      encoding,
    );
  }
  encoding = encoding || 'utf-8';
  // для безопасного подключения
  // использует обертка TLSSocket
  let socket = new Socket();
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
      request.push(JSON.stringify(body));
    }
  }
  // передача "null" определяет
  // конец данных
  request.push(null);
  return request;
}

/**
 * Create request url.
 *
 * @param {string} path
 * @param {string|object|null|undefined} query
 * @returns {string}
 */
function createRequestUrl(path, query) {
  if (typeof path !== 'string') {
    throw new InvalidArgumentError(
      'The parameter "path" must be a String, but %v was given.',
      path,
    );
  }
  if (
    (query != null && typeof query !== 'string' && typeof query !== 'object') ||
    Array.isArray(query)
  ) {
    throw new InvalidArgumentError(
      'The parameter "query" must be a String or Object, but %v was given.',
      query,
    );
  }
  let url = ('/' + path).replace('//', '/');
  if (typeof query === 'object') {
    const qs = queryString.stringify(query);
    if (qs) {
      url += `?${qs}`;
    }
  } else if (typeof query === 'string') {
    url += `?${query.replace(/^\?/, '')}`;
  }
  return url;
}

/**
 * Create request headers.
 *
 * @param {string|null|undefined} host
 * @param {boolean|null|undefined} secure
 * @param {*} body
 * @param {string|object|null|undefined} cookies
 * @param {import('buffer').BufferEncoding|null|undefined} encoding
 * @param {object|null|undefined} headers
 * @returns {object}
 */
function createRequestHeaders(host, secure, body, cookies, encoding, headers) {
  if (host != null && typeof host !== 'string') {
    throw new InvalidArgumentError(
      'The parameter "host" must be a non-empty String, but %v was given.',
      host,
    );
  }
  host = host || 'localhost';
  if (secure != null && typeof secure !== 'boolean') {
    throw new InvalidArgumentError(
      'The parameter "secure" must be a String, but %v was given.',
      secure,
    );
  }
  secure = Boolean(secure);
  if (
    (cookies != null &&
      typeof cookies !== 'object' &&
      typeof cookies !== 'string') ||
    Array.isArray(cookies)
  ) {
    throw new InvalidArgumentError(
      'The parameter "cookies" must be a String or an Object, ' +
        'but %v was given.',
      cookies,
    );
  }
  if (
    (headers != null && typeof headers !== 'object') ||
    Array.isArray(headers)
  ) {
    throw new InvalidArgumentError(
      'The parameter "headers" must be an Object, but %v was given.',
      headers,
    );
  }
  headers = headers || {};
  if (encoding != null && typeof encoding !== 'string') {
    throw new InvalidArgumentError(
      'The parameter "encoding" must be a String, but %v was given.',
      encoding,
    );
  }
  encoding = encoding || 'utf-8';
  const obj = {...headers};
  obj['host'] = host;
  if (secure) {
    obj['x-forwarded-proto'] = 'https';
  }
  // формирование заголовка Cookie
  // из строки или объекта
  if (cookies != null) {
    if (typeof cookies === 'string') {
      obj['cookie'] = obj['cookie'] ? obj['cookie'] : '';
      obj['cookie'] += obj['cookie'] ? `; ${cookies}` : cookies;
    } else if (typeof cookies === 'object') {
      obj['cookie'] = obj['cookie'] ? obj['cookie'] : '';
      const newCookies = createCookieString(cookies);
      obj['cookie'] += obj['cookie'] ? `; ${newCookies}` : newCookies;
    }
  }
  // установка заголовка "content-type"
  // в зависимости от тела запроса
  if (obj['content-type'] == null) {
    if (typeof body === 'string') {
      obj['content-type'] = 'text/plain';
    } else if (Buffer.isBuffer(body)) {
      obj['content-type'] = 'application/octet-stream';
    } else if (
      typeof body === 'object' ||
      typeof body === 'boolean' ||
      typeof body === 'number'
    ) {
      obj['content-type'] = 'application/json';
    }
  }
  // подсчет количества байт тела
  // для заголовка "content-length"
  if (body != null && obj['content-length'] == null) {
    if (typeof body === 'string') {
      const length = Buffer.byteLength(body, encoding);
      obj['content-length'] = String(length);
    } else if (Buffer.isBuffer(body)) {
      const length = Buffer.byteLength(body);
      obj['content-length'] = String(length);
    } else if (
      typeof body === 'object' ||
      typeof body === 'boolean' ||
      typeof body === 'number'
    ) {
      const json = JSON.stringify(body);
      const length = Buffer.byteLength(json, encoding);
      obj['content-length'] = String(length);
    }
  }
  return obj;
}
