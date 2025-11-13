import {Socket} from 'net';
import {TLSSocket} from 'tls';
import {IncomingMessage} from 'http';
import queryString from 'querystring';
import {Errorf} from '@e22m4u/js-format';
import {isReadableStream} from './is-readable-stream.js';
import {createCookiesString} from './create-cookies-string.js';
import {CHARACTER_ENCODING_LIST} from './fetch-request-body.js';

/**
 * @typedef {{
 *   host?: string;
 *   method?: string;
 *   secure?: boolean;
 *   path?: string;
 *   query?: object;
 *   cookies?: object;
 *   headers?: object;
 *   body?: string;
 *   stream?: import('stream').Readable;
 *   encoding?: import('buffer').BufferEncoding;
 * }} RequestPatch
 */

/**
 * Create request mock.
 *
 * @param {RequestPatch} patch
 * @returns {import('http').IncomingMessage}
 */
export function createRequestMock(patch) {
  if ((patch != null && typeof patch !== 'object') || Array.isArray(patch)) {
    throw new Errorf(
      'The first parameter of "createRequestMock" ' +
        'should be an Object, but %v was given.',
      patch,
    );
  }
  patch = patch || {};
  if (patch.host != null && typeof patch.host !== 'string')
    throw new Errorf(
      'The parameter "host" of "createRequestMock" ' +
        'should be a String, but %v was given.',
      patch.host,
    );
  if (patch.method != null && typeof patch.method !== 'string')
    throw new Errorf(
      'The parameter "method" of "createRequestMock" ' +
        'should be a String, but %v was given.',
      patch.method,
    );
  if (patch.secure != null && typeof patch.secure !== 'boolean')
    throw new Errorf(
      'The parameter "secure" of "createRequestMock" ' +
        'should be a Boolean, but %v was given.',
      patch.secure,
    );
  if (patch.path != null && typeof patch.path !== 'string')
    throw new Errorf(
      'The parameter "path" of "createRequestMock" ' +
        'should be a String, but %v was given.',
      patch.path,
    );
  if (
    (patch.query != null &&
      typeof patch.query !== 'object' &&
      typeof patch.query !== 'string') ||
    Array.isArray(patch.query)
  ) {
    throw new Errorf(
      'The parameter "query" of "createRequestMock" ' +
        'should be a String or Object, but %v was given.',
      patch.query,
    );
  }
  if (
    (patch.cookies != null &&
      typeof patch.cookies !== 'string' &&
      typeof patch.cookies !== 'object') ||
    Array.isArray(patch.cookies)
  ) {
    throw new Errorf(
      'The parameter "cookies" of "createRequestMock" ' +
        'should be a String or Object, but %v was given.',
      patch.cookies,
    );
  }
  if (
    (patch.headers != null && typeof patch.headers !== 'object') ||
    Array.isArray(patch.headers)
  ) {
    throw new Errorf(
      'The parameter "headers" of "createRequestMock" ' +
        'should be an Object, but %v was given.',
      patch.headers,
    );
  }
  if (patch.stream != null && !isReadableStream(patch.stream))
    throw new Errorf(
      'The parameter "stream" of "createRequestMock" ' +
        'should be a Stream, but %v was given.',
      patch.stream,
    );
  if (patch.encoding != null) {
    if (typeof patch.encoding !== 'string')
      throw new Errorf(
        'The parameter "encoding" of "createRequestMock" ' +
          'should be a String, but %v was given.',
        patch.encoding,
      );
    if (!CHARACTER_ENCODING_LIST.includes(patch.encoding))
      throw new Errorf(
        'Character encoding %v is not supported.',
        patch.encoding,
      );
  }
  // если передан поток, выполняется
  // проверка на несовместимые опции
  if (patch.stream) {
    if (patch.secure != null)
      throw new Errorf(
        'The "createRequestMock" does not allow specifying the ' +
          '"stream" and "secure" options simultaneously.',
      );
    if (patch.body != null)
      throw new Errorf(
        'The "createRequestMock" does not allow specifying the ' +
          '"stream" and "body" options simultaneously.',
      );
    if (patch.encoding != null)
      throw new Errorf(
        'The "createRequestMock" does not allow specifying the ' +
          '"stream" and "encoding" options simultaneously.',
      );
  }
  // если передан поток, он будет использован
  // в качестве объекта запроса, в противном
  // случае создается новый
  const request =
    patch.stream ||
    createRequestStream(patch.secure, patch.body, patch.encoding);
  request.url = createRequestUrl(patch.path || '/', patch.query);
  request.headers = createRequestHeaders(
    patch.host,
    patch.secure,
    patch.body,
    patch.cookies,
    patch.encoding,
    patch.headers,
  );
  request.method = (patch.method || 'get').toUpperCase();
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
  if (encoding != null && typeof encoding !== 'string')
    throw new Errorf(
      'The parameter "encoding" of "createRequestStream" ' +
        'should be a String, but %v was given.',
      encoding,
    );
  encoding = encoding || 'utf-8';
  // для безопасного подключения
  // использует обертка TLSSocket
  let socket = new Socket();
  if (secure) socket = new TLSSocket(socket);
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
  if (typeof path !== 'string')
    throw new Errorf(
      'The parameter "path" of "createRequestUrl" ' +
        'should be a String, but %v was given.',
      path,
    );
  if (
    (query != null && typeof query !== 'string' && typeof query !== 'object') ||
    Array.isArray(query)
  ) {
    throw new Errorf(
      'The parameter "query" of "createRequestUrl" ' +
        'should be a String or Object, but %v was given.',
      query,
    );
  }
  let url = ('/' + path).replace('//', '/');
  if (typeof query === 'object') {
    const qs = queryString.stringify(query);
    if (qs) url += `?${qs}`;
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
  if (host != null && typeof host !== 'string')
    throw new Errorf(
      'The parameter "host" of "createRequestHeaders" ' +
        'a non-empty String, but %v was given.',
      host,
    );
  host = host || 'localhost';
  if (secure != null && typeof secure !== 'boolean')
    throw new Errorf(
      'The parameter "secure" of "createRequestHeaders" ' +
        'should be a String, but %v was given.',
      secure,
    );
  secure = Boolean(secure);
  if (
    (cookies != null &&
      typeof cookies !== 'object' &&
      typeof cookies !== 'string') ||
    Array.isArray(cookies)
  ) {
    throw new Errorf(
      'The parameter "cookies" of "createRequestHeaders" ' +
        'should be a String or Object, but %v was given.',
      cookies,
    );
  }
  if (
    (headers != null && typeof headers !== 'object') ||
    Array.isArray(headers)
  ) {
    throw new Errorf(
      'The parameter "headers" of "createRequestHeaders" ' +
        'should be an Object, but %v was given.',
      headers,
    );
  }
  headers = headers || {};
  if (encoding != null && typeof encoding !== 'string')
    throw new Errorf(
      'The parameter "encoding" of "createRequestHeaders" ' +
        'should be a String, but %v was given.',
      encoding,
    );
  encoding = encoding || 'utf-8';
  const obj = {...headers};
  obj['host'] = host;
  if (secure) obj['x-forwarded-proto'] = 'https';
  // формирование заголовка Cookie
  // из строки или объекта
  if (cookies != null) {
    if (typeof cookies === 'string') {
      obj['cookie'] = obj['cookie'] ? obj['cookie'] : '';
      obj['cookie'] += obj['cookie'] ? `; ${cookies}` : cookies;
    } else if (typeof cookies === 'object') {
      obj['cookie'] = obj['cookie'] ? obj['cookie'] : '';
      const newCookies = createCookiesString(cookies);
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
