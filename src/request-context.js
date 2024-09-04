import {Errorf} from '@e22m4u/js-format';
import {isReadableStream} from './utils/index.js';
import {isWritableStream} from './utils/index.js';
import {ServiceContainer} from '@e22m4u/js-service';

/**
 * Request context.
 */
export class RequestContext {
  /**
   * Service container.
   *
   * @type {import('@e22m4u/js-service').ServiceContainer}
   */
  container;

  /**
   * Request.
   *
   * @type {import('http').IncomingMessage}
   */
  req;

  /**
   * Response.
   *
   * @type {import('http').ServerResponse}
   */
  res;

  /**
   * Query.
   *
   * @type {object}
   */
  query = {};

  /**
   * Path parameters.
   *
   * @type {object}
   */
  params = {};

  /**
   * Parsed body.
   *
   * @type {*}
   */
  body;

  /**
   * Headers.
   *
   * @type {object}
   */
  headers = {};

  /**
   * Parsed cookie.
   *
   * @type {object}
   */
  cookie = {};

  /**
   * Constructor.
   *
   * @param {ServiceContainer} container
   * @param {import('http').IncomingMessage} request
   * @param {import('http').ServerResponse} response
   */
  constructor(container, request, response) {
    if (!(container instanceof ServiceContainer))
      throw new Errorf(
        'The parameter "container" of RequestContext.constructor ' +
          'should be an instance of ServiceContainer, but %v given.',
        container,
      );
    this.container = container;
    if (
      !request ||
      typeof request !== 'object' ||
      Array.isArray(request) ||
      !isReadableStream(request)
    ) {
      throw new Errorf(
        'The parameter "request" of RequestContext.constructor ' +
          'should be an instance of IncomingMessage, but %v given.',
        request,
      );
    }
    this.req = request;
    if (
      !response ||
      typeof response !== 'object' ||
      Array.isArray(response) ||
      !isWritableStream(response)
    ) {
      throw new Errorf(
        'The parameter "response" of RequestContext.constructor ' +
          'should be an instance of ServerResponse, but %v given.',
        response,
      );
    }
    this.res = response;
  }
}
