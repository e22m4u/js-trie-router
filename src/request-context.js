import {Route} from './route.js';
import {Errorf} from '@e22m4u/js-format';
import {ServiceContainer, isServiceContainer} from '@e22m4u/js-service';

import {
  isReadableStream,
  isWritableStream,
  getRequestPathname,
} from './utils/index.js';

/**
 * Request context.
 */
export class RequestContext {
  /**
   * Service container.
   *
   * @type {ServiceContainer}
   */
  _container;

  /**
   * Getter of service container.
   *
   * @type {ServiceContainer}
   */
  get container() {
    return this._container;
  }

  /**
   * Request.
   *
   * @type {import('http').IncomingMessage}
   */
  _request;

  /**
   * Getter of request.
   *
   * @type {import('http').IncomingMessage}
   */
  get request() {
    return this._request;
  }

  /**
   * Response.
   *
   * @type {import('http').ServerResponse}
   */
  _response;

  /**
   * Getter of response.
   *
   * @type {import('http').ServerResponse}
   */
  get response() {
    return this._response;
  }

  /**
   * Route
   *
   * @type {Route}
   */
  _route;

  /**
   * Getter of route.
   *
   * @type {Route}
   */
  get route() {
    return this._route;
  }

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
   * Headers.
   *
   * @type {object}
   */
  headers = {};

  /**
   * Parsed cookies.
   *
   * @type {object}
   */
  cookies = {};

  /**
   * Parsed body.
   *
   * @type {*}
   */
  body;

  /**
   * State.
   *
   * @type {object}
   */
  state = {};

  /**
   * Route meta.
   *
   * @type {import('./route.js').RouteMeta}
   */
  get meta() {
    return this.route.meta;
  }

  /**
   * Method.
   *
   * @returns {string}
   */
  get method() {
    return this.request.method.toUpperCase();
  }

  /**
   * Path.
   *
   * @returns {string}
   */
  get path() {
    return this.request.url;
  }

  /**
   * Pathname.
   *
   * @type {string|undefined}
   * @private
   */
  _pathname = undefined;

  /**
   * Pathname.
   *
   * @returns {string}
   */
  get pathname() {
    if (this._pathname != null) return this._pathname;
    this._pathname = getRequestPathname(this.request);
    return this._pathname;
  }

  /**
   * Constructor.
   *
   * @param {ServiceContainer} container
   * @param {import('http').IncomingMessage} request
   * @param {import('http').ServerResponse} response
   * @param {Route} route
   */
  constructor(container, request, response, route) {
    if (!isServiceContainer(container))
      throw new Errorf(
        'The parameter "container" of RequestContext.constructor ' +
          'should be an instance of ServiceContainer, but %v was given.',
        container,
      );
    this._container = container;
    if (
      !request ||
      typeof request !== 'object' ||
      Array.isArray(request) ||
      !isReadableStream(request)
    ) {
      throw new Errorf(
        'The parameter "request" of RequestContext.constructor ' +
          'should be an instance of IncomingMessage, but %v was given.',
        request,
      );
    }
    this._request = request;
    if (
      !response ||
      typeof response !== 'object' ||
      Array.isArray(response) ||
      !isWritableStream(response)
    ) {
      throw new Errorf(
        'The parameter "response" of RequestContext.constructor ' +
          'should be an instance of ServerResponse, but %v was given.',
        response,
      );
    }
    this._response = response;
    if (!(route instanceof Route)) {
      throw new Errorf(
        'The parameter "route" of RequestContext.constructor ' +
          'should be an instance of Route, but %v was given.',
        route,
      );
    }
    this._route = route;
  }
}
