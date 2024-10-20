import HttpErrors from 'http-errors';
import {Errorf} from '@e22m4u/js-format';
import {createError} from '../utils/index.js';
import {RouterOptions} from '../router-options.js';
import {fetchRequestBody} from '../utils/index.js';
import {DebuggableService} from '../debuggable-service.js';
import {parseContentType} from '../utils/parse-content-type.js';

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
    if (!mediaType || typeof mediaType !== 'string')
      throw new Errorf(
        'The parameter "mediaType" of BodyParser.defineParser ' +
          'should be a non-empty String, but %v given.',
        mediaType,
      );
    if (!parser || typeof parser !== 'function')
      throw new Errorf(
        'The parameter "parser" of BodyParser.defineParser ' +
          'should be a Function, but %v given.',
        parser,
      );
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
    if (!mediaType || typeof mediaType !== 'string')
      throw new Errorf(
        'The parameter "mediaType" of BodyParser.hasParser ' +
          'should be a non-empty String, but %v given.',
        mediaType,
      );
    return Boolean(this._parsers[mediaType]);
  }

  /**
   * Delete parser.
   *
   * @param {string} mediaType
   * @returns {this}
   */
  deleteParser(mediaType) {
    if (!mediaType || typeof mediaType !== 'string')
      throw new Errorf(
        'The parameter "mediaType" of BodyParser.deleteParser ' +
          'should be a non-empty String, but %v given.',
        mediaType,
      );
    const parser = this._parsers[mediaType];
    if (!parser) throw new Errorf('The parser of %v is not found.', mediaType);
    delete this._parsers[mediaType];
    return this;
  }

  /**
   * Parse.
   *
   * @param {import('http').IncomingMessage} req
   * @returns {Promise<*>|undefined}
   */
  parse(req) {
    if (!METHODS_WITH_BODY.includes(req.method.toUpperCase())) {
      this.debug(
        'Body parsing was skipped for the %s request.',
        req.method.toUpperCase(),
      );
      return;
    }
    const contentType = (req.headers['content-type'] || '').replace(
      /^([^;]+);.*$/,
      '$1',
    );
    if (!contentType) {
      this.debug(
        'Body parsing was skipped because the request has no content type.',
      );
      return;
    }
    const {mediaType} = parseContentType(contentType);
    if (!mediaType)
      throw createError(
        HttpErrors.BadRequest,
        'Unable to parse the "content-type" header.',
      );
    const parser = this._parsers[mediaType];
    if (!parser) {
      if (UNPARSABLE_MEDIA_TYPES.includes(mediaType)) {
        this.debug('Body parsing was skipped for %v.', mediaType);
        return;
      }
      throw createError(
        HttpErrors.UnsupportedMediaType,
        'Media type %v is not supported.',
        mediaType,
      );
    }
    const bodyBytesLimit = this.getService(RouterOptions).requestBodyBytesLimit;
    return fetchRequestBody(req, bodyBytesLimit).then(rawBody => {
      if (rawBody != null) return parser(rawBody);
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
  if (typeof input !== 'string') return undefined;
  try {
    return JSON.parse(input);
  } catch (error) {
    if (process.env['DEBUG'] || process.env['NODE_ENV'] === 'development')
      console.warn(error);
    throw createError(HttpErrors.BadRequest, 'Unable to parse request body.');
  }
}
