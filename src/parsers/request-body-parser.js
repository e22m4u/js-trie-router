import HttpErrors from 'http-errors';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {DebuggableService} from '../debuggable-service.js';
import {TrieRouterOptions} from '../trie-router-options.js';

import {
  createError,
  hasRequestBody,
  parseContentType,
  fetchRequestBody,
  getRequestPathname,
} from '../utils/index.js';

/**
 * Request body parser.
 */
export class RequestBodyParser extends DebuggableService {
  /**
   * Parsers.
   *
   * @type {{[mime: string]: Function}}
   */
  _parsers = {
    'text/plain': v => String(v),
    'application/json': parseJsonBody,
  };

  /**
   * Set parser.
   *
   * @param {string} mediaType
   * @param {Function} parserFn
   * @returns {this}
   */
  defineParser(mediaType, parserFn) {
    if (!mediaType || typeof mediaType !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "mediaType" must be a non-empty String, ' +
          'but %v was given.',
        mediaType,
      );
    }
    if (!parserFn || typeof parserFn !== 'function') {
      throw new InvalidArgumentError(
        'Parameter "parserFn" must be a Function, but %v was given.',
        parserFn,
      );
    }
    this._parsers[mediaType.toLowerCase()] = parserFn;
    return this;
  }

  /**
   * Has parser.
   *
   * @param {string} mediaType
   * @returns {boolean}
   */
  hasParser(mediaType) {
    if (!mediaType || typeof mediaType !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "mediaType" must be a non-empty String, ' +
          'but %v was given.',
        mediaType,
      );
    }
    return Boolean(this._parsers[mediaType.toLowerCase()]);
  }

  /**
   * Get parser.
   *
   * @param {string} mediaType
   * @returns {Function}
   */
  getParser(mediaType) {
    if (!mediaType || typeof mediaType !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "mediaType" must be a non-empty String, ' +
          'but %v was given.',
        mediaType,
      );
    }
    const parserFn = this._parsers[mediaType.toLowerCase()];
    if (!parserFn) {
      throw new InvalidArgumentError(
        'Media type %v does not have a parser.',
        mediaType,
      );
    }
    return parserFn;
  }

  /**
   * Remove parser.
   *
   * @param {string} mediaType
   * @returns {this}
   */
  removeParser(mediaType) {
    if (!mediaType || typeof mediaType !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "mediaType" must be a non-empty String, ' +
          'but %v was given.',
        mediaType,
      );
    }
    delete this._parsers[mediaType.toLowerCase()];
    return this;
  }

  /**
   * Parse.
   *
   * @param {import('http').IncomingMessage} request
   * @returns {Promise<*>|undefined}
   */
  parse(request) {
    const debug = this.getDebuggerFor(this.parse);
    debug(
      'Parsing a request body %s %v.',
      request.method.toUpperCase(),
      getRequestPathname(request),
    );
    // если запрос не содержит тела,
    // то парсинг тела пропускается
    if (!hasRequestBody(request)) {
      debug('Skipping body parsing because no body is provided.');
      return;
    }
    // если запрос содержит тело, но "content-type"
    // не определен, то парсинг тела пропускается
    const contentType = request.headers['content-type'];
    if (!contentType) {
      debug('Skipping body parsing because no content type is provided.');
      return;
    }
    // если содержание заголовка "content-type"
    // разобрать не удалось, то выбрасывается ошибка
    const {mediaType} = parseContentType(contentType);
    if (!mediaType) {
      throw createError(
        HttpErrors.BadRequest,
        'Unable to parse the "content-type" header.',
      );
    }
    // если текущий медиа тип исключен
    // настройками, то парсинг пропускается
    const options = this.getService(TrieRouterOptions);
    const mediaTypeLc = mediaType.toLowerCase();
    const isMediaTypeIgnored = options.ignoredMediaTypes.includes(mediaTypeLc);
    if (isMediaTypeIgnored) {
      debug('Media type %v is ignored.', mediaType);
      return;
    }
    // если парсер для текущего медиа типа
    // не определен, то выбрасывается ошибка
    const parserFn = this._parsers[mediaTypeLc];
    if (!parserFn) {
      throw createError(
        HttpErrors.UnsupportedMediaType,
        'Media type %v is not supported.',
        mediaType,
      );
    }
    // определение максимального количества
    // байт, извлекаемых из тела запроса
    const bodyBytesLimit = options.requestBodyBytesLimit;
    debug('Fetching a request body.');
    debug('Body limit is %v bytes.', bodyBytesLimit);
    // извлечение тела запроса для последующего
    // разбора соответствующим парсером
    return fetchRequestBody(request, bodyBytesLimit).then(rawBody => {
      if (rawBody != null) {
        debug('Read %v bytes.', Buffer.byteLength(rawBody, 'utf8'));
        return parserFn(rawBody);
      }
      debug('Request body has no content.');
      return rawBody;
    });
  }
}

/**
 * Parse json body.
 *
 * @param {string} input
 * @returns {*|undefined}
 */
export function parseJsonBody(input) {
  if (typeof input !== 'string') {
    return undefined;
  }
  try {
    return JSON.parse(input);
  } catch (error) {
    throw new HttpErrors.BadRequest(error.message);
  }
}
