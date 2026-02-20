import HttpErrors from 'http-errors';
import {RouterOptions} from '../router-options.js';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {DebuggableService} from '../debuggable-service.js';

import {
  createError,
  parseContentType,
  fetchRequestBody,
  getRequestPathname,
} from '../utils/index.js';

/**
 * Method names to be parsed.
 *
 * @type {string[]}
 */
export const METHODS_WITH_BODY = ['POST', 'PUT', 'PATCH', 'DELETE'];

/**
 * Unparsable media types.
 *
 * @type {string[]}
 */
export const UNPARSABLE_MEDIA_TYPES = ['multipart/form-data'];

/**
 * Body parser.
 */
export class BodyParser extends DebuggableService {
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
   * @param {Function} parser
   * @returns {this}
   */
  defineParser(mediaType, parser) {
    if (!mediaType || typeof mediaType !== 'string') {
      throw new InvalidArgumentError(
        'The parameter "mediaType" must be a non-empty String, ' +
          'but %v was given.',
        mediaType,
      );
    }
    if (!parser || typeof parser !== 'function') {
      throw new InvalidArgumentError(
        'The parameter "parser" must be a Function, but %v was given.',
        parser,
      );
    }
    this._parsers[mediaType] = parser;
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
        'The parameter "mediaType" must be a non-empty String, ' +
          'but %v was given.',
        mediaType,
      );
    }
    return Boolean(this._parsers[mediaType]);
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
        'The parameter "mediaType" must be a non-empty String, ' +
          'but %v was given.',
        mediaType,
      );
    }
    const parser = this._parsers[mediaType];
    if (!parser) {
      throw new InvalidArgumentError(
        'The media type %v does not have a parser.',
        mediaType,
      );
    }
    return parser;
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
        'The parameter "mediaType" must be a non-empty String, ' +
          'but %v was given.',
        mediaType,
      );
    }
    const parser = this._parsers[mediaType];
    if (!parser) {
      throw new InvalidArgumentError(
        'The parser of %v is not found.',
        mediaType,
      );
    }
    delete this._parsers[mediaType];
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
    if (!METHODS_WITH_BODY.includes(request.method.toUpperCase())) {
      debug(
        'Skipping body parsing for the %s method.',
        request.method.toUpperCase(),
      );
      return;
    }
    const contentType = (request.headers['content-type'] || '').replace(
      /^([^;]+);.*$/,
      '$1',
    );
    if (!contentType) {
      debug('Skipping body parsing because no content type is provided.');
      return;
    }
    const {mediaType} = parseContentType(contentType);
    if (!mediaType) {
      throw createError(
        HttpErrors.BadRequest,
        'Unable to parse the "content-type" header.',
      );
    }
    const parser = this._parsers[mediaType];
    if (!parser) {
      if (UNPARSABLE_MEDIA_TYPES.includes(mediaType)) {
        debug('Skipping body parsing for the media type %v.', mediaType);
        return;
      }
      throw createError(
        HttpErrors.UnsupportedMediaType,
        'Media type %v is not supported.',
        mediaType,
      );
    }
    const bodyBytesLimit = this.getService(RouterOptions).requestBodyBytesLimit;
    debug('Fetching a request body.');
    debug('Body limit is %v bytes.', bodyBytesLimit);
    return fetchRequestBody(request, bodyBytesLimit).then(rawBody => {
      if (rawBody != null) {
        debug('Read %v bytes.', Buffer.byteLength(rawBody, 'utf8'));
        return parser(rawBody);
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
    throw createError(HttpErrors.BadRequest, error.message);
  }
}
