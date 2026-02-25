"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.js
var index_exports = {};
__export(index_exports, {
  BodyParser: () => BodyParser,
  CHARACTER_ENCODING_LIST: () => CHARACTER_ENCODING_LIST,
  CookiesParser: () => CookiesParser,
  DataSender: () => DataSender,
  EXPOSED_ERROR_PROPERTIES: () => EXPOSED_ERROR_PROPERTIES,
  ErrorSender: () => ErrorSender,
  HttpMethod: () => HttpMethod,
  QueryParser: () => QueryParser,
  ROOT_PATH: () => ROOT_PATH,
  ROUTER_HOOK_TYPES: () => ROUTER_HOOK_TYPES,
  RequestContext: () => RequestContext,
  RequestParser: () => RequestParser,
  Route: () => Route,
  RouteRegistry: () => RouteRegistry,
  RouterHookInvoker: () => RouterHookInvoker,
  RouterHookRegistry: () => RouterHookRegistry,
  RouterHookType: () => RouterHookType,
  RouterOptions: () => RouterOptions,
  TrieRouter: () => TrieRouter,
  cloneDeep: () => cloneDeep,
  createCookieString: () => createCookieString,
  createError: () => createError,
  createRequestMock: () => createRequestMock,
  createResponseMock: () => createResponseMock,
  createRouteMock: () => createRouteMock,
  fetchRequestBody: () => fetchRequestBody,
  getRequestPathname: () => getRequestPathname,
  hasRequestBody: () => hasRequestBody,
  isPromise: () => isPromise,
  isReadableStream: () => isReadableStream,
  isResponseSent: () => isResponseSent,
  isWritableStream: () => isWritableStream,
  mergeDeep: () => mergeDeep,
  parseContentType: () => parseContentType,
  parseCookieString: () => parseCookieString,
  parseJsonBody: () => parseJsonBody,
  toCamelCase: () => toCamelCase,
  toPascalCase: () => toPascalCase,
  validateRouteDefinition: () => validateRouteDefinition
});
module.exports = __toCommonJS(index_exports);

// src/constants.js
var ROOT_PATH = "/";

// src/route/route.js
var import_js_debug = require("@e22m4u/js-debug");

// src/debuggable-service.js
var import_js_service = require("@e22m4u/js-service");
var MODULE_DEBUG_NAMESPACE = "jsTrieRouter";
var _DebuggableService = class _DebuggableService extends import_js_service.DebuggableService {
  /**
   * Constructor.
   *
   * @param {ServiceContainer} container
   */
  constructor(container = void 0) {
    super(container, {
      namespace: MODULE_DEBUG_NAMESPACE,
      noEnvironmentNamespace: true
    });
  }
};
__name(_DebuggableService, "DebuggableService");
var DebuggableService = _DebuggableService;

// src/utils/clone-deep.js
function cloneDeep(value) {
  if (value == null || typeof value !== "object") {
    return value;
  }
  if (value instanceof Date) {
    return new Date(value.getTime());
  }
  if (Array.isArray(value)) {
    return value.map((item) => cloneDeep(item));
  }
  const proto = Object.getPrototypeOf(value);
  if (proto === Object.prototype || proto === null) {
    const newObj = proto === null ? /* @__PURE__ */ Object.create(null) : {};
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        newObj[key] = cloneDeep(value[key]);
      }
    }
    return newObj;
  }
  return value;
}
__name(cloneDeep, "cloneDeep");

// src/utils/merge-deep.js
function mergeDeep(target, source) {
  const isObject = /* @__PURE__ */ __name((item) => {
    return item && typeof item === "object" && !Array.isArray(item);
  }, "isObject");
  if (Array.isArray(target) && Array.isArray(source)) {
    return [...target, ...source];
  }
  if (isObject(target) && isObject(source)) {
    const result = { ...target };
    Object.keys(source).forEach((key) => {
      const targetValue = target[key];
      const sourceValue = source[key];
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        result[key] = mergeDeep(targetValue, sourceValue);
      } else {
        result[key] = sourceValue;
      }
    });
    return result;
  }
  return source;
}
__name(mergeDeep, "mergeDeep");

// src/utils/is-promise.js
function isPromise(value) {
  if (!value) {
    return false;
  }
  if (typeof value !== "object") {
    return false;
  }
  return typeof value.then === "function";
}
__name(isPromise, "isPromise");

// src/utils/create-error.js
var import_js_format = require("@e22m4u/js-format");
function createError(errorCtor, message, ...args) {
  if (typeof errorCtor !== "function") {
    throw new import_js_format.InvalidArgumentError(
      'Parameter "errorCtor" must be a Function, but %v was given.',
      errorCtor
    );
  }
  if (message != null && typeof message !== "string") {
    throw new import_js_format.InvalidArgumentError(
      'Parameter "message" must be a String, but %v was given.',
      message
    );
  }
  if (message == null) {
    return new errorCtor();
  }
  const interpolatedMessage = (0, import_js_format.format)(message, ...args);
  return new errorCtor(interpolatedMessage);
}
__name(createError, "createError");

// src/utils/to-camel-case.js
var import_js_format2 = require("@e22m4u/js-format");
function toCamelCase(input) {
  if (typeof input !== "string") {
    throw new import_js_format2.InvalidArgumentError(
      'Parameter "input" must be a String, but %v was given.',
      input
    );
  }
  return input.replace(/(^\w|[A-Z]|\b\w)/g, (c) => c.toUpperCase()).replace(/\W+/g, "").replace(/(^\w)/g, (c) => c.toLowerCase());
}
__name(toCamelCase, "toCamelCase");

// src/utils/to-pascal-case.js
function toPascalCase(input) {
  if (!input) {
    return "";
  }
  return input.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/([0-9])([a-zA-Z])/g, "$1 $2").replace(/[-_]+|[^\p{L}\p{N}]/gu, " ").toLowerCase().replace(new RegExp("(?:^|\\s)(\\p{L})", "gu"), (_, letter) => letter.toUpperCase()).replace(/\s+/g, "");
}
__name(toPascalCase, "toPascalCase");

// src/utils/is-response-sent.js
var import_js_format3 = require("@e22m4u/js-format");
function isResponseSent(response) {
  if (!response || typeof response !== "object" || Array.isArray(response) || typeof response.headersSent !== "boolean") {
    throw new import_js_format3.InvalidArgumentError(
      'Parameter "response" must be an instance of ServerResponse, but %v was given.',
      response
    );
  }
  return response.headersSent;
}
__name(isResponseSent, "isResponseSent");

// src/utils/has-request-body.js
function hasRequestBody(request) {
  if (request.headers["transfer-encoding"] !== void 0) {
    return true;
  }
  if (!isNaN(request.headers["content-length"]) && request.headers["content-length"] !== "0") {
    return true;
  }
  return false;
}
__name(hasRequestBody, "hasRequestBody");

// src/utils/create-route-mock.js
function createRouteMock(options = {}) {
  return new Route({
    method: options.method || HttpMethod.GET,
    path: options.path || "/",
    handler: options.handler || (() => "OK")
  });
}
__name(createRouteMock, "createRouteMock");

// src/utils/is-readable-stream.js
function isReadableStream(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  return typeof value.pipe === "function";
}
__name(isReadableStream, "isReadableStream");

// src/utils/parse-content-type.js
var import_js_format4 = require("@e22m4u/js-format");
function parseContentType(input) {
  if (typeof input !== "string") {
    throw new import_js_format4.InvalidArgumentError(
      'Parameter "input" must be a String, but %v was given.',
      input
    );
  }
  const res = { mediaType: void 0, charset: void 0, boundary: void 0 };
  const re = /^\s*([^\s;/]+\/[^\s;/]+)(?:;\s*charset=([^\s;]+))?(?:;\s*boundary=([^\s;]+))?.*$/i;
  const matches = re.exec(input);
  if (matches && matches[1]) {
    res.mediaType = matches[1];
    if (matches[2]) {
      res.charset = matches[2];
    }
    if (matches[3]) {
      res.boundary = matches[3];
    }
  }
  return res;
}
__name(parseContentType, "parseContentType");

// src/utils/is-writable-stream.js
function isWritableStream(value) {
  if (!value || typeof value !== "object") {
    return false;
  }
  return typeof value.end === "function";
}
__name(isWritableStream, "isWritableStream");

// src/utils/fetch-request-body.js
var import_http_errors = __toESM(require("http-errors"), 1);
var import_http = require("http");
var import_js_format5 = require("@e22m4u/js-format");
var CHARACTER_ENCODING_LIST = [
  "ascii",
  "utf8",
  "utf-8",
  "utf16le",
  "utf-16le",
  "ucs2",
  "ucs-2",
  "latin1"
];
function fetchRequestBody(request, bodyBytesLimit = 0) {
  if (!(request instanceof import_http.IncomingMessage)) {
    throw new import_js_format5.InvalidArgumentError(
      'Parameter "request" must be an instance of IncomingMessage, but %v was given.',
      request
    );
  }
  if (typeof bodyBytesLimit !== "number") {
    throw new import_js_format5.InvalidArgumentError(
      'Parameter "bodyBytesLimit" must be a Number, but %v was given.',
      bodyBytesLimit
    );
  }
  return new Promise((resolve, reject) => {
    const contentLength = parseInt(
      request.headers["content-length"] || "0",
      10
    );
    if (bodyBytesLimit && contentLength && contentLength > bodyBytesLimit) {
      throw createError(
        import_http_errors.default.PayloadTooLarge,
        "Request body limit is %s bytes, but %s bytes given.",
        bodyBytesLimit,
        contentLength
      );
    }
    let encoding = "utf-8";
    const contentType = request.headers["content-type"] || "";
    if (contentType) {
      const parsedContentType = parseContentType(contentType);
      if (parsedContentType && parsedContentType.charset) {
        encoding = parsedContentType.charset.toLowerCase();
        if (!CHARACTER_ENCODING_LIST.includes(encoding)) {
          throw createError(
            import_http_errors.default.UnsupportedMediaType,
            "Request encoding %v is not supported.",
            encoding
          );
        }
      }
    }
    const data = [];
    let receivedLength = 0;
    const onData = /* @__PURE__ */ __name((chunk) => {
      receivedLength += chunk.length;
      if (bodyBytesLimit && receivedLength > bodyBytesLimit) {
        cleanupListeners();
        const error = createError(
          import_http_errors.default.PayloadTooLarge,
          "Request body limit is %v bytes, but %v bytes given.",
          bodyBytesLimit,
          receivedLength
        );
        request.unpipe();
        request.destroy();
        reject(error);
        return;
      }
      data.push(chunk);
    }, "onData");
    const onEnd = /* @__PURE__ */ __name(() => {
      cleanupListeners();
      if (contentLength && contentLength !== receivedLength) {
        const error = createError(
          import_http_errors.default.BadRequest,
          'Received bytes do not match the "content-length" header.'
        );
        reject(error);
        return;
      }
      const buffer = Buffer.concat(data);
      const body = buffer.toString(encoding);
      resolve(body || void 0);
    }, "onEnd");
    const onError = /* @__PURE__ */ __name((error) => {
      cleanupListeners();
      reject((0, import_http_errors.default)(400, error));
    }, "onError");
    const cleanupListeners = /* @__PURE__ */ __name(() => {
      request.removeListener("data", onData);
      request.removeListener("end", onEnd);
      request.removeListener("error", onError);
    }, "cleanupListeners");
    request.on("data", onData);
    request.on("end", onEnd);
    request.on("error", onError);
    request.resume();
  });
}
__name(fetchRequestBody, "fetchRequestBody");

// src/utils/parse-cookie-string.js
var import_js_format6 = require("@e22m4u/js-format");
function parseCookieString(input) {
  if (typeof input !== "string") {
    throw new import_js_format6.InvalidArgumentError(
      'Parameter "input" must be a String, but %v was given.',
      input
    );
  }
  return input.split(";").filter((v) => v !== "").map((v) => v.split("=")).reduce((cookies, tuple) => {
    const key = decodeURIComponent(tuple[0]).trim();
    if (key === "__proto__" || key === "constructor" || key === "prototype") {
      return cookies;
    }
    const value = tuple[1] !== void 0 ? decodeURIComponent(tuple[1]).trim() : "";
    cookies[key] = value;
    return cookies;
  }, {});
}
__name(parseCookieString, "parseCookieString");

// src/utils/create-request-mock.js
var import_net = require("net");
var import_tls = require("tls");
var import_http2 = require("http");
var import_querystring = __toESM(require("querystring"), 1);
var import_js_format8 = require("@e22m4u/js-format");

// src/utils/create-cookie-string.js
var import_js_format7 = require("@e22m4u/js-format");
function createCookieString(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    throw new import_js_format7.InvalidArgumentError(
      "Cookie data must be an Object, but %v was given.",
      data
    );
  }
  let cookies = "";
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) {
      continue;
    }
    const val = data[key];
    if (val == null) {
      continue;
    }
    cookies += `${key}=${val}; `;
  }
  return cookies.trim();
}
__name(createCookieString, "createCookieString");

// src/utils/create-request-mock.js
function createRequestMock(options) {
  if (options != null && typeof options !== "object" || Array.isArray(options)) {
    throw new import_js_format8.InvalidArgumentError(
      'Parameter "options" must be an Object, but %v was given.',
      options
    );
  }
  options = options || {};
  if (options.host != null && typeof options.host !== "string") {
    throw new import_js_format8.InvalidArgumentError(
      'Option "host" must be a String, but %v was given.',
      options.host
    );
  }
  if (options.method != null && typeof options.method !== "string") {
    throw new import_js_format8.InvalidArgumentError(
      'Option "method" must be a String, but %v was given.',
      options.method
    );
  }
  if (options.secure != null && typeof options.secure !== "boolean") {
    throw new import_js_format8.InvalidArgumentError(
      'Option "secure" must be a Boolean, but %v was given.',
      options.secure
    );
  }
  if (options.path != null && typeof options.path !== "string") {
    throw new import_js_format8.InvalidArgumentError(
      'Option "path" must be a String, but %v was given.',
      options.path
    );
  }
  if (options.query != null && typeof options.query !== "object" && typeof options.query !== "string" || Array.isArray(options.query)) {
    throw new import_js_format8.InvalidArgumentError(
      'Option "query" must be a String or Object, but %v was given.',
      options.query
    );
  }
  if (options.cookies != null && typeof options.cookies !== "string" && typeof options.cookies !== "object" || Array.isArray(options.cookies)) {
    throw new import_js_format8.InvalidArgumentError(
      'Option "cookies" must be a String or Object, but %v was given.',
      options.cookies
    );
  }
  if (options.headers != null && typeof options.headers !== "object" || Array.isArray(options.headers)) {
    throw new import_js_format8.InvalidArgumentError(
      'Option "headers" must be an Object, but %v was given.',
      options.headers
    );
  }
  if (options.stream != null && !isReadableStream(options.stream)) {
    throw new import_js_format8.InvalidArgumentError(
      'Option "stream" must be a Stream, but %v was given.',
      options.stream
    );
  }
  if (options.encoding != null) {
    if (typeof options.encoding !== "string") {
      throw new import_js_format8.InvalidArgumentError(
        'Option "encoding" must be a String, but %v was given.',
        options.encoding
      );
    }
    if (!CHARACTER_ENCODING_LIST.includes(options.encoding)) {
      throw new import_js_format8.InvalidArgumentError(
        "Character encoding %v is not supported.",
        options.encoding
      );
    }
  }
  if (options.stream) {
    if (options.secure != null) {
      throw new import_js_format8.InvalidArgumentError(
        'The "stream" and "secure" options cannot be used together.'
      );
    }
    if (options.body != null) {
      throw new import_js_format8.InvalidArgumentError(
        'The "stream" and "body" options cannot be used together.'
      );
    }
    if (options.encoding != null) {
      throw new import_js_format8.InvalidArgumentError(
        'The "stream" and "encoding" options cannot be used together.'
      );
    }
  }
  const request = options.stream || createRequestStream(options.secure, options.body, options.encoding);
  request.url = createRequestUrl(options.path || "/", options.query);
  request.headers = createRequestHeaders(
    options.host,
    options.secure,
    options.body,
    options.cookies,
    options.encoding,
    options.headers
  );
  request.method = (options.method || "get").toUpperCase();
  return request;
}
__name(createRequestMock, "createRequestMock");
function createRequestStream(secure, body, encoding) {
  if (encoding != null && typeof encoding !== "string") {
    throw new import_js_format8.InvalidArgumentError(
      'Parameter "encoding" must be a String, but %v was given.',
      encoding
    );
  }
  encoding = encoding || "utf-8";
  let socket = new import_net.Socket();
  if (secure) {
    socket = new import_tls.TLSSocket(socket);
  }
  const request = new import_http2.IncomingMessage(socket);
  if (body != null) {
    if (typeof body === "string") {
      request.push(body, encoding);
    } else if (Buffer.isBuffer(body)) {
      request.push(body);
    } else {
      request.push(JSON.stringify(body));
    }
  }
  request.push(null);
  return request;
}
__name(createRequestStream, "createRequestStream");
function createRequestUrl(path, query) {
  if (typeof path !== "string") {
    throw new import_js_format8.InvalidArgumentError(
      'Parameter "path" must be a String, but %v was given.',
      path
    );
  }
  if (query != null && typeof query !== "string" && typeof query !== "object" || Array.isArray(query)) {
    throw new import_js_format8.InvalidArgumentError(
      'Parameter "query" must be a String or Object, but %v was given.',
      query
    );
  }
  let url = ("/" + path).replace("//", "/");
  if (typeof query === "object") {
    const qs = import_querystring.default.stringify(query);
    if (qs) {
      url += `?${qs}`;
    }
  } else if (typeof query === "string") {
    url += `?${query.replace(/^\?/, "")}`;
  }
  return url;
}
__name(createRequestUrl, "createRequestUrl");
function createRequestHeaders(host, secure, body, cookies, encoding, headers) {
  if (host != null && typeof host !== "string") {
    throw new import_js_format8.InvalidArgumentError(
      'Parameter "host" must be a non-empty String, but %v was given.',
      host
    );
  }
  host = host || "localhost";
  if (secure != null && typeof secure !== "boolean") {
    throw new import_js_format8.InvalidArgumentError(
      'Parameter "secure" must be a String, but %v was given.',
      secure
    );
  }
  secure = Boolean(secure);
  if (cookies != null && typeof cookies !== "object" && typeof cookies !== "string" || Array.isArray(cookies)) {
    throw new import_js_format8.InvalidArgumentError(
      'Parameter "cookies" must be a String or an Object, but %v was given.',
      cookies
    );
  }
  if (headers != null && typeof headers !== "object" || Array.isArray(headers)) {
    throw new import_js_format8.InvalidArgumentError(
      'Parameter "headers" must be an Object, but %v was given.',
      headers
    );
  }
  headers = headers || {};
  if (encoding != null && typeof encoding !== "string") {
    throw new import_js_format8.InvalidArgumentError(
      'Parameter "encoding" must be a String, but %v was given.',
      encoding
    );
  }
  encoding = encoding || "utf-8";
  const obj = { ...headers };
  obj["host"] = host;
  if (secure) {
    obj["x-forwarded-proto"] = "https";
  }
  if (cookies != null) {
    if (typeof cookies === "string") {
      obj["cookie"] = obj["cookie"] ? obj["cookie"] : "";
      obj["cookie"] += obj["cookie"] ? `; ${cookies}` : cookies;
    } else if (typeof cookies === "object") {
      obj["cookie"] = obj["cookie"] ? obj["cookie"] : "";
      const newCookies = createCookieString(cookies);
      obj["cookie"] += obj["cookie"] ? `; ${newCookies}` : newCookies;
    }
  }
  if (obj["content-type"] == null) {
    if (typeof body === "string") {
      obj["content-type"] = "text/plain";
    } else if (Buffer.isBuffer(body)) {
      obj["content-type"] = "application/octet-stream";
    } else if (typeof body === "object" || typeof body === "boolean" || typeof body === "number") {
      obj["content-type"] = "application/json";
    }
  }
  if (body != null && obj["transfer-encoding"] == null && obj["content-length"] == null) {
    if (typeof body === "string") {
      const length = Buffer.byteLength(body, encoding);
      obj["content-length"] = String(length);
    } else if (Buffer.isBuffer(body)) {
      const length = Buffer.byteLength(body);
      obj["content-length"] = String(length);
    } else if (typeof body === "object" || typeof body === "boolean" || typeof body === "number") {
      const json = JSON.stringify(body);
      const length = Buffer.byteLength(json, encoding);
      obj["content-length"] = String(length);
    }
  }
  return obj;
}
__name(createRequestHeaders, "createRequestHeaders");

// src/utils/create-response-mock.js
var import_stream = require("stream");
function createResponseMock() {
  const response = new import_stream.PassThrough();
  response.statusCode = 200;
  patchEncoding(response);
  patchHeaders(response);
  patchBody(response);
  return response;
}
__name(createResponseMock, "createResponseMock");
function patchEncoding(response) {
  Object.defineProperty(response, "_encoding", {
    configurable: true,
    writable: true,
    value: void 0
  });
  Object.defineProperty(response, "setEncoding", {
    configurable: true,
    value: /* @__PURE__ */ __name(function(enc) {
      this._encoding = enc;
      return this;
    }, "value")
  });
  Object.defineProperty(response, "getEncoding", {
    configurable: true,
    value: /* @__PURE__ */ __name(function() {
      return this._encoding;
    }, "value")
  });
}
__name(patchEncoding, "patchEncoding");
function patchHeaders(response) {
  Object.defineProperty(response, "_headersSent", {
    configurable: true,
    writable: true,
    value: false
  });
  Object.defineProperty(response, "headersSent", {
    configurable: true,
    get() {
      return this._headersSent;
    }
  });
  Object.defineProperty(response, "_headers", {
    configurable: true,
    writable: true,
    value: {}
  });
  Object.defineProperty(response, "setHeader", {
    configurable: true,
    value: /* @__PURE__ */ __name(function(name, value) {
      if (this.headersSent) {
        throw new Error(
          "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client"
        );
      }
      const key = name.toLowerCase();
      this._headers[key] = String(value);
      return this;
    }, "value")
  });
  Object.defineProperty(response, "getHeader", {
    configurable: true,
    value: /* @__PURE__ */ __name(function(name) {
      return this._headers[name.toLowerCase()];
    }, "value")
  });
  Object.defineProperty(response, "getHeaders", {
    configurable: true,
    value: /* @__PURE__ */ __name(function() {
      return JSON.parse(JSON.stringify(this._headers));
    }, "value")
  });
}
__name(patchHeaders, "patchHeaders");
function patchBody(response) {
  let resolve, reject;
  const promise = new Promise((rsv, rej) => {
    resolve = rsv;
    reject = rej;
  });
  const data = [];
  response.on("data", (c) => data.push(c));
  response.on("error", (e) => reject(e));
  response.on("end", () => {
    resolve(Buffer.concat(data));
  });
  const originalEnd = response.end.bind(response);
  response.end = function(...args) {
    this._headersSent = true;
    return originalEnd(...args);
  };
  Object.defineProperty(response, "getBody", {
    configurable: true,
    value: /* @__PURE__ */ __name(function() {
      return promise.then((buffer) => {
        const enc = this.getEncoding();
        const str = buffer.toString(enc);
        return data.length ? str : void 0;
      });
    }, "value")
  });
}
__name(patchBody, "patchBody");

// src/utils/get-request-pathname.js
var import_js_format9 = require("@e22m4u/js-format");
function getRequestPathname(request) {
  if (!request || typeof request !== "object" || Array.isArray(request) || typeof request.url !== "string") {
    throw new import_js_format9.InvalidArgumentError(
      'Parameter "request" must be an instance of IncomingMessage, but %v was given.',
      request
    );
  }
  return (request.url || "/").replace(/\?.*$/, "");
}
__name(getRequestPathname, "getRequestPathname");

// src/request-context.js
var import_js_format10 = require("@e22m4u/js-format");
var import_js_service2 = require("@e22m4u/js-service");
var _RequestContext = class _RequestContext {
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
   * @type {import('./route/index.js').RouteMeta}
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
  _pathname = void 0;
  /**
   * Pathname.
   *
   * @returns {string}
   */
  get pathname() {
    if (this._pathname != null) {
      return this._pathname;
    }
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
    if (!(0, import_js_service2.isServiceContainer)(container)) {
      throw new import_js_format10.InvalidArgumentError(
        'Parameter "container" must be an instance of ServiceContainer, but %v was given.',
        container
      );
    }
    this._container = container;
    if (!request || typeof request !== "object" || Array.isArray(request) || !isReadableStream(request)) {
      throw new import_js_format10.InvalidArgumentError(
        'Parameter "request" must be an instance of IncomingMessage, but %v was given.',
        request
      );
    }
    this._request = request;
    if (!response || typeof response !== "object" || Array.isArray(response) || !isWritableStream(response)) {
      throw new import_js_format10.InvalidArgumentError(
        'Parameter "response" must be an instance of ServerResponse, but %v was given.',
        response
      );
    }
    this._response = response;
    if (!(route instanceof Route)) {
      throw new import_js_format10.InvalidArgumentError(
        'Parameter "route" must be an instance of Route, but %v was given.',
        route
      );
    }
    this._route = route;
  }
};
__name(_RequestContext, "RequestContext");
var RequestContext = _RequestContext;

// src/hooks/router-hook-invoker.js
var import_js_format12 = require("@e22m4u/js-format");

// src/hooks/router-hook-registry.js
var import_js_format11 = require("@e22m4u/js-format");
var RouterHookType = {
  ON_DEFINE_ROUTE: "onDefineRoute",
  ON_REQUEST: "onRequest",
  PRE_HANDLER: "preHandler",
  POST_HANDLER: "postHandler"
};
var ROUTER_HOOK_TYPES = Object.values(RouterHookType);
var _RouterHookRegistry = class _RouterHookRegistry {
  /**
   * Hooks.
   *
   * @type {Map<string, Function[]>}
   * @private
   */
  _hooks = /* @__PURE__ */ new Map();
  /**
   * Add hook.
   *
   * @param {string} type
   * @param {Function} hook
   * @returns {this}
   */
  addHook(type, hook) {
    if (!type || typeof type !== "string") {
      throw new import_js_format11.InvalidArgumentError(
        "Hook type is required, but %v was given.",
        type
      );
    }
    if (!Object.values(RouterHookType).includes(type)) {
      throw new import_js_format11.InvalidArgumentError("Hook type %v is not supported.", type);
    }
    if (!hook || typeof hook !== "function") {
      throw new import_js_format11.InvalidArgumentError(
        "Router hook %v must be a Function, but %v was given.",
        type,
        hook
      );
    }
    const hooks = this._hooks.get(type) || [];
    hooks.push(hook);
    this._hooks.set(type, hooks);
    return this;
  }
  /**
   * Has hook.
   *
   * @param {string} type
   * @param {Function} hook
   * @returns {boolean}
   */
  hasHook(type, hook) {
    if (!type || typeof type !== "string") {
      throw new import_js_format11.InvalidArgumentError(
        "Hook type is required, but %v was given.",
        type
      );
    }
    if (!Object.values(RouterHookType).includes(type)) {
      throw new import_js_format11.InvalidArgumentError("Hook type %v is not supported.", type);
    }
    if (!hook || typeof hook !== "function") {
      throw new import_js_format11.InvalidArgumentError(
        "Router hook %v must be a Function, but %v was given.",
        type,
        hook
      );
    }
    const hooks = this._hooks.get(type) || [];
    return hooks.indexOf(hook) > -1;
  }
  /**
   * Get hooks.
   *
   * @param {string} type
   * @returns {Function[]}
   */
  getHooks(type) {
    if (!type || typeof type !== "string") {
      throw new import_js_format11.InvalidArgumentError(
        "Hook type is required, but %v was given.",
        type
      );
    }
    if (!Object.values(RouterHookType).includes(type)) {
      throw new import_js_format11.InvalidArgumentError("Hook type %v is not supported.", type);
    }
    return this._hooks.get(type) || [];
  }
};
__name(_RouterHookRegistry, "RouterHookRegistry");
var RouterHookRegistry = _RouterHookRegistry;

// src/hooks/router-hook-invoker.js
var _RouterHookInvoker = class _RouterHookInvoker extends DebuggableService {
  /**
   * Invoke on-request hooks.
   *
   * @param {IncomingMessage} request
   * @param {ServerResponse} response
   * @returns {Promise<boolean|undefined>|boolean|undefined}
   */
  invokeOnRequestHooks(request, response) {
    if (!request || typeof request !== "object" || Array.isArray(request) || !isReadableStream(request)) {
      throw new import_js_format12.InvalidArgumentError(
        'Parameter "request" must be an instance of IncomingMessage, but %v was given.',
        request
      );
    }
    if (!response || typeof response !== "object" || Array.isArray(response) || !isWritableStream(response)) {
      throw new import_js_format12.InvalidArgumentError(
        'Parameter "response" must be an instance of ServerResponse, but %v was given.',
        response
      );
    }
    if (isResponseSent(response)) {
      return;
    }
    const hooks = this.getService(RouterHookRegistry).getHooks(
      RouterHookType.ON_REQUEST
    );
    let isInterrupted = void 0;
    for (let i = 0; i < hooks.length; i++) {
      const hook = hooks[i];
      const result = hook(request, response, this.container);
      if (isResponseSent(response)) {
        return;
      }
      if (result !== void 0) {
        if (isPromise(result)) {
          return this._continueOnRequestHooksInvocationAsync(
            hooks,
            i + 1,
            result,
            request,
            response
          );
        }
        if (result === true) {
          isInterrupted = result;
          break;
        }
        if (result !== false) {
          throw new import_js_format12.InvalidArgumentError(
            'Hook "onRequest" must return undefined or a Boolean, but %v was given.',
            result
          );
        }
      }
    }
    return isInterrupted;
  }
  /**
   * Continue on-request hooks invocation async.
   *
   * @param {Function[]} hooks
   * @param {number} startIndex
   * @param {Promise} initialPromise
   * @param {IncomingMessage} request
   * @param {ServerResponse} response
   * @returns {Promise<boolean|undefined>}
   */
  async _continueOnRequestHooksInvocationAsync(hooks, startIndex, initialPromise, request, response) {
    let result = await initialPromise;
    if (isResponseSent(response)) {
      return;
    }
    if (result !== void 0) {
      if (result === true) {
        return result;
      }
      if (result !== false) {
        throw new import_js_format12.InvalidArgumentError(
          'Hook "onRequest" must return undefined or a Boolean, but %v was given.',
          result
        );
      }
    }
    let isInterrupted = void 0;
    for (let i = startIndex; i < hooks.length; i++) {
      result = await hooks[i](request, response, this.container);
      if (isResponseSent(response)) {
        return;
      }
      if (result !== void 0) {
        if (result === true) {
          isInterrupted = result;
          break;
        }
        if (result !== false) {
          throw new import_js_format12.InvalidArgumentError(
            'Hook "onRequest" must return undefined or a Boolean, but %v was given.',
            result
          );
        }
      }
    }
    return isInterrupted;
  }
  /**
   * Последовательно вызывает глобальные хуки и хуки маршрута типа "preHandler",
   * пока один из них не вернет отличное от undefined значение или не отправит
   * HTTP-ответ. Метод выполняет хуки в синхронном режиме для улучшения
   * производительности. Если один из хуков возвращает Promise, выполнение
   * оставшейся части цепочки переключается в асинхронный режим.
   *
   * @param {import('../request-context.js').RequestContext} context
   * @returns {Promise<*>|*}
   */
  invokePreHandlerHooks(context) {
    if (!(context instanceof RequestContext)) {
      throw new import_js_format12.InvalidArgumentError(
        'Parameter "context" must be an instance of RequestContext, but %v was given.',
        context
      );
    }
    if (isResponseSent(context.response)) {
      return context.response;
    }
    const hooks = [
      ...this.getService(RouterHookRegistry).getHooks(
        RouterHookType.PRE_HANDLER
      ),
      ...context.route.getHookRegistry().getHooks(RouterHookType.PRE_HANDLER)
    ];
    let result = void 0;
    for (let i = 0; i < hooks.length; i++) {
      const hook = hooks[i];
      result = hook(context);
      if (isResponseSent(context.response)) {
        return context.response;
      }
      if (result !== void 0) {
        if (isPromise(result)) {
          return this._continuePreHandlerHooksInvocationAsync(
            hooks,
            i + 1,
            result,
            context
          );
        }
        return result;
      }
    }
    return;
  }
  /**
   * Асинхронно продолжает выполнение цепочки хуков "preHandler",
   * начиная с указанного индекса. Данный метод вызывается, когда
   * хук в основном синхронном цикле возвращает Promise. Метод ожидает
   * разрешения начального Promise, а затем последовательно выполняет
   * оставшиеся хуки в асинхронном режиме, следуя той же логике
   * прерывания (при получении значения или отправке ответа),
   * что и основной метод.
   *
   * @param {Function[]} hooks
   * @param {number} startIndex
   * @param {Promise} initialPromise
   * @param {import('../request-context.js').RequestContext} context
   * @returns {Promise<*>}
   */
  async _continuePreHandlerHooksInvocationAsync(hooks, startIndex, initialPromise, context) {
    let result = await initialPromise;
    if (isResponseSent(context.response)) {
      return context.response;
    }
    if (result !== void 0) {
      return result;
    }
    for (let i = startIndex; i < hooks.length; i++) {
      result = await hooks[i](context);
      if (isResponseSent(context.response)) {
        return context.response;
      }
      if (result !== void 0) {
        return result;
      }
    }
    return;
  }
  /**
   * Invoke post-handler hooks.
   *
   * @param {import('../request-context.js').RequestContext} context
   * @param {*} initialData
   * @returns {Promise<*>|*}
   */
  invokePostHandlerHooks(context, initialData) {
    if (!(context instanceof RequestContext)) {
      throw new import_js_format12.InvalidArgumentError(
        'Parameter "context" must be an instance of RequestContext, but %v was given.',
        context
      );
    }
    if (isResponseSent(context.response)) {
      return context.response;
    }
    const hooks = [
      ...context.route.getHookRegistry().getHooks(RouterHookType.POST_HANDLER),
      ...this.getService(RouterHookRegistry).getHooks(
        RouterHookType.POST_HANDLER
      )
    ];
    let currentData = initialData;
    for (let i = 0; i < hooks.length; i++) {
      const hook = hooks[i];
      const result = hook(context, currentData);
      if (isResponseSent(context.response)) {
        return context.response;
      }
      if (result !== void 0) {
        if (isPromise(result)) {
          return this._continuePostHandlerHooksInvocationAsync(
            hooks,
            i + 1,
            result,
            context,
            currentData
          );
        }
        currentData = result;
      }
    }
    return currentData;
  }
  /**
   * Continue post-handler hooks invocation async.
   *
   * @param {Function[]} hooks
   * @param {number} startIndex
   * @param {Promise} initialPromise
   * @param {import('../request-context.js').RequestContext} context
   * @param {*} currentData
   * @returns {Promise<*>}
   */
  async _continuePostHandlerHooksInvocationAsync(hooks, startIndex, initialPromise, context, currentData) {
    let result = await initialPromise;
    if (isResponseSent(context.response)) {
      return context.response;
    }
    if (result !== void 0) {
      currentData = result;
    }
    for (let i = startIndex; i < hooks.length; i++) {
      result = await hooks[i](context, currentData);
      if (isResponseSent(context.response)) {
        return context.response;
      }
      if (result !== void 0) {
        currentData = result;
      }
    }
    return currentData;
  }
};
__name(_RouterHookInvoker, "RouterHookInvoker");
var RouterHookInvoker = _RouterHookInvoker;

// src/route/validate-route-definition.js
var import_js_format13 = require("@e22m4u/js-format");
function validateRouteDefinition(routeDef) {
  if (!routeDef || typeof routeDef !== "object" || Array.isArray(routeDef)) {
    throw new import_js_format13.InvalidArgumentError(
      "Route definition must be an Object, but %v was given.",
      routeDef
    );
  }
  if (!routeDef.method || typeof routeDef.method !== "string") {
    throw new import_js_format13.InvalidArgumentError(
      'Option "method" must be a non-empty String, but %v was given.',
      routeDef.method
    );
  }
  if (typeof routeDef.path !== "string") {
    throw new import_js_format13.InvalidArgumentError(
      'Option "path" must be a String, but %v was given.',
      routeDef.path
    );
  }
  if (!routeDef.path.startsWith("/")) {
    throw new import_js_format13.InvalidArgumentError(
      'Option "path" must start with "/", but %v was given.',
      routeDef.path
    );
  }
  if (typeof routeDef.handler !== "function") {
    throw new import_js_format13.InvalidArgumentError(
      'Option "handler" must be a Function, but %v was given.',
      routeDef.handler
    );
  }
  if (routeDef.preHandler !== void 0) {
    if (Array.isArray(routeDef.preHandler)) {
      routeDef.preHandler.forEach((preHandler) => {
        if (typeof preHandler !== "function") {
          throw new import_js_format13.InvalidArgumentError(
            'Hook "preHandler" must be a Function, but %v was given.',
            preHandler
          );
        }
      });
    } else if (typeof routeDef.preHandler !== "function") {
      throw new import_js_format13.InvalidArgumentError(
        'Option "preHandler" must be a Function or an Array, but %v was given.',
        routeDef.preHandler
      );
    }
  }
  if (routeDef.postHandler !== void 0) {
    if (Array.isArray(routeDef.postHandler)) {
      routeDef.postHandler.forEach((postHandler) => {
        if (typeof postHandler !== "function") {
          throw new import_js_format13.InvalidArgumentError(
            'Hook "postHandler" must be a Function, but %v was given.',
            postHandler
          );
        }
      });
    } else if (typeof routeDef.postHandler !== "function") {
      throw new import_js_format13.InvalidArgumentError(
        'Option "postHandler" must be a Function or an Array, but %v was given.',
        routeDef.postHandler
      );
    }
  }
  if (routeDef.meta !== void 0) {
    if (!routeDef.meta || typeof routeDef.meta !== "object" || Array.isArray(routeDef.meta)) {
      throw new import_js_format13.InvalidArgumentError(
        'Option "meta" must be an Object, but %v was given.',
        routeDef.meta
      );
    }
  }
}
__name(validateRouteDefinition, "validateRouteDefinition");

// src/route/route.js
var HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  OPTIONS: "OPTIONS"
};
var DEFAULT_META = Object.freeze({});
var _Route = class _Route extends import_js_debug.Debuggable {
  /**
   * Definition.
   *
   * @type {RouteDefinition}
   */
  _definition;
  /**
   * Get definition.
   *
   * @returns {RouteDefinition}
   */
  getDefinition() {
    return this._definition;
  }
  /**
   * Hook registry.
   *
   * @type {RouterHookRegistry}
   */
  _hookRegistry = new RouterHookRegistry();
  /**
   * Get hook registry.
   *
   * @returns {RouterHookRegistry}
   */
  getHookRegistry() {
    return this._hookRegistry;
  }
  /**
   * Getter of the method.
   *
   * @returns {string}
   */
  get method() {
    return this._definition.method;
  }
  /**
   * Getter of the path.
   *
   * @returns {string}
   */
  get path() {
    return this._definition.path;
  }
  /**
   * Getter of the meta.
   *
   * @returns {object}
   */
  get meta() {
    return this._definition.meta || DEFAULT_META;
  }
  /**
   * Getter of the handler.
   *
   * @returns {*}
   */
  get handler() {
    return this._definition.handler;
  }
  /**
   * Constructor.
   *
   * @param {RouteDefinition} routeDef
   */
  constructor(routeDef) {
    super({
      namespace: MODULE_DEBUG_NAMESPACE,
      noEnvironmentNamespace: true,
      noInstantiationMessage: true
    });
    validateRouteDefinition(routeDef);
    this._definition = cloneDeep(routeDef);
    this._definition.method = this._definition.method.toUpperCase();
    if (routeDef.preHandler !== void 0) {
      const preHandlerHooks = [routeDef.preHandler].flat().filter(Boolean);
      preHandlerHooks.forEach((hook) => {
        this._hookRegistry.addHook(RouterHookType.PRE_HANDLER, hook);
      });
    }
    if (routeDef.postHandler !== void 0) {
      const postHandlerHooks = [routeDef.postHandler].flat().filter(Boolean);
      postHandlerHooks.forEach((hook) => {
        this._hookRegistry.addHook(RouterHookType.POST_HANDLER, hook);
      });
    }
    this.ctorDebug("Created a route %s %v.", this.method, this.path);
  }
  /**
   * Handle request.
   *
   * @param {RequestContext} context
   * @returns {*}
   */
  handle(context) {
    const debug = this.getDebuggerFor(this.handle);
    const requestPath = getRequestPathname(context.request);
    debug("Invoking a route handler %s %v.", this.method, requestPath);
    return this.handler(context);
  }
};
__name(_Route, "Route");
var Route = _Route;

// src/parsers/body-parser.js
var import_http_errors2 = __toESM(require("http-errors"), 1);

// src/router-options.js
var import_js_format14 = require("@e22m4u/js-format");
var _RouterOptions = class _RouterOptions extends DebuggableService {
  /**
   * Request body bytes limit.
   *
   * @type {number}
   * @private
   */
  _requestBodyBytesLimit = 512e3;
  // 512kb
  /**
   * Getter of request body bytes limit.
   *
   * @returns {number}
   */
  get requestBodyBytesLimit() {
    return this._requestBodyBytesLimit;
  }
  /**
   * Set request body bytes limit.
   *
   * @param {number} input
   * @returns {RouterOptions}
   */
  setRequestBodyBytesLimit(input) {
    if (typeof input !== "number" || input < 0) {
      throw new import_js_format14.InvalidArgumentError(
        'Option "requestBodyBytesLimit" must be a positive Number or 0, but %v was given.',
        input
      );
    }
    this._requestBodyBytesLimit = input;
    return this;
  }
};
__name(_RouterOptions, "RouterOptions");
var RouterOptions = _RouterOptions;

// src/parsers/body-parser.js
var import_js_format15 = require("@e22m4u/js-format");
var _BodyParser = class _BodyParser extends DebuggableService {
  /**
   * Parsers.
   *
   * @type {{[mime: string]: Function}}
   */
  _parsers = {
    "text/plain": /* @__PURE__ */ __name((v) => String(v), "text/plain"),
    "application/json": parseJsonBody
  };
  /**
   * Set parser.
   *
   * @param {string} mediaType
   * @param {Function} parser
   * @returns {this}
   */
  defineParser(mediaType, parser) {
    if (!mediaType || typeof mediaType !== "string") {
      throw new import_js_format15.InvalidArgumentError(
        'Parameter "mediaType" must be a non-empty String, but %v was given.',
        mediaType
      );
    }
    if (!parser || typeof parser !== "function") {
      throw new import_js_format15.InvalidArgumentError(
        'Parameter "parser" must be a Function, but %v was given.',
        parser
      );
    }
    this._parsers[mediaType.toLowerCase()] = parser;
    return this;
  }
  /**
   * Has parser.
   *
   * @param {string} mediaType
   * @returns {boolean}
   */
  hasParser(mediaType) {
    if (!mediaType || typeof mediaType !== "string") {
      throw new import_js_format15.InvalidArgumentError(
        'Parameter "mediaType" must be a non-empty String, but %v was given.',
        mediaType
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
    if (!mediaType || typeof mediaType !== "string") {
      throw new import_js_format15.InvalidArgumentError(
        'Parameter "mediaType" must be a non-empty String, but %v was given.',
        mediaType
      );
    }
    const parser = this._parsers[mediaType.toLowerCase()];
    if (!parser) {
      throw new import_js_format15.InvalidArgumentError(
        "Media type %v does not have a parser.",
        mediaType
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
    if (!mediaType || typeof mediaType !== "string") {
      throw new import_js_format15.InvalidArgumentError(
        'Parameter "mediaType" must be a non-empty String, but %v was given.',
        mediaType
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
      "Parsing a request body %s %v.",
      request.method.toUpperCase(),
      getRequestPathname(request)
    );
    if (!hasRequestBody(request)) {
      debug("Skipping body parsing because no body is provided.");
      return;
    }
    const contentType = request.headers["content-type"];
    if (!contentType) {
      debug("Skipping body parsing because no content type is provided.");
      return;
    }
    const { mediaType } = parseContentType(contentType);
    if (!mediaType) {
      throw createError(
        import_http_errors2.default.BadRequest,
        'Unable to parse the "content-type" header.'
      );
    }
    const parser = this._parsers[mediaType.toLowerCase()];
    if (!parser) {
      debug("No body parser for the media type %v.", mediaType);
      return;
    }
    const bodyBytesLimit = this.getService(RouterOptions).requestBodyBytesLimit;
    debug("Fetching a request body.");
    debug("Body limit is %v bytes.", bodyBytesLimit);
    return fetchRequestBody(request, bodyBytesLimit).then((rawBody) => {
      if (rawBody != null) {
        debug("Read %v bytes.", Buffer.byteLength(rawBody, "utf8"));
        return parser(rawBody);
      }
      debug("Request body has no content.");
      return rawBody;
    });
  }
};
__name(_BodyParser, "BodyParser");
var BodyParser = _BodyParser;
function parseJsonBody(input) {
  if (typeof input !== "string") {
    return void 0;
  }
  try {
    return JSON.parse(input);
  } catch (error) {
    throw new import_http_errors2.default.BadRequest(error.message);
  }
}
__name(parseJsonBody, "parseJsonBody");

// src/parsers/query-parser.js
var import_querystring2 = __toESM(require("querystring"), 1);
var _QueryParser = class _QueryParser extends DebuggableService {
  /**
   * Parse
   *
   * @param {import('http').IncomingMessage} request
   * @returns {object}
   */
  parse(request) {
    const debug = this.getDebuggerFor(this.parse);
    const queryStr = request.url.replace(/^[^?]*\??/, "");
    const query = queryStr ? import_querystring2.default.parse(queryStr) : {};
    const queryKeys = Object.keys(query);
    if (queryKeys.length) {
      queryKeys.forEach((key) => {
        debug("Found a query parameter %v with a value %v.", key, query[key]);
      });
    } else {
      debug(
        "Request %s %v had no query parameters.",
        request.method,
        getRequestPathname(request)
      );
    }
    return query;
  }
};
__name(_QueryParser, "QueryParser");
var QueryParser = _QueryParser;

// src/parsers/cookies-parser.js
var _CookiesParser = class _CookiesParser extends DebuggableService {
  /**
   * Parse
   *
   * @param {import('http').IncomingMessage} request
   * @returns {object}
   */
  parse(request) {
    const debug = this.getDebuggerFor(this.parse);
    const cookiesString = request.headers["cookie"] || "";
    const cookies = parseCookieString(cookiesString);
    const cookiesKeys = Object.keys(cookies);
    if (cookiesKeys.length) {
      cookiesKeys.forEach((key) => {
        debug("Found a cookie %v with a value %v.", key, cookies[key]);
      });
    } else {
      debug(
        "Request %s %v had no cookies.",
        request.method,
        getRequestPathname(request)
      );
    }
    return cookies;
  }
};
__name(_CookiesParser, "CookiesParser");
var CookiesParser = _CookiesParser;

// src/parsers/request-parser.js
var import_http3 = require("http");
var import_js_format16 = require("@e22m4u/js-format");
var _RequestParser = class _RequestParser extends DebuggableService {
  /**
   * Parse.
   *
   * @param {IncomingMessage} request
   * @returns {Promise<object>|object}
   */
  parse(request) {
    if (!(request instanceof import_http3.IncomingMessage)) {
      throw new import_js_format16.InvalidArgumentError(
        'Parameter "request" must be an instance of IncomingMessage, but %v was given.',
        request
      );
    }
    const data = {};
    const promises = [];
    const parsedQuery = this.getService(QueryParser).parse(request);
    if (isPromise(parsedQuery)) {
      promises.push(parsedQuery.then((v) => data.query = v));
    } else {
      data.query = parsedQuery;
    }
    const parsedCookies = this.getService(CookiesParser).parse(request);
    if (isPromise(parsedCookies)) {
      promises.push(parsedCookies.then((v) => data.cookies = v));
    } else {
      data.cookies = parsedCookies;
    }
    const parsedBody = this.getService(BodyParser).parse(request);
    if (isPromise(parsedBody)) {
      promises.push(parsedBody.then((v) => data.body = v));
    } else {
      data.body = parsedBody;
    }
    data.headers = Object.assign({}, request.headers);
    return promises.length ? Promise.all(promises).then(() => data) : data;
  }
};
__name(_RequestParser, "RequestParser");
var RequestParser = _RequestParser;

// src/route-registry.js
var import_js_path_trie = require("@e22m4u/js-path-trie");
var import_js_service3 = require("@e22m4u/js-service");
var import_js_format17 = require("@e22m4u/js-format");
var _RouteRegistry = class _RouteRegistry extends DebuggableService {
  /**
   * Constructor.
   *
   * @param {ServiceContainer} [container]
   */
  constructor(container) {
    super(container);
    this._trie = new import_js_path_trie.PathTrie();
  }
  /**
   * Define route.
   *
   * @param {import('./route/index.js').RouteDefinition} routeDef
   * @returns {Route}
   */
  defineRoute(routeDef) {
    const debug = this.getDebuggerFor(this.defineRoute);
    if (!routeDef || typeof routeDef !== "object" || Array.isArray(routeDef)) {
      throw new import_js_format17.InvalidArgumentError(
        "Route definition must be an Object, but %v was given.",
        routeDef
      );
    }
    const hookRegistry = this.getService(RouterHookRegistry);
    const onDefineRouteHooks = hookRegistry.getHooks(
      RouterHookType.ON_DEFINE_ROUTE
    );
    if (onDefineRouteHooks.length) {
      debug('Invoking %v "onDefineRoute" hook(s).', onDefineRouteHooks.length);
      for (const hook of onDefineRouteHooks) {
        const hookResult = hook({ ...routeDef }, this.container);
        if (hookResult !== void 0 && !(hookResult !== null && typeof hookResult === "object" && !Array.isArray(hookResult))) {
          throw new import_js_format17.InvalidArgumentError(
            'Hook "onDefineRoute" must return an Object or undefined, but %v was given.',
            hookResult
          );
        }
        if (hookResult !== void 0) {
          routeDef = hookResult;
        }
      }
      debug("Hooks invoked.");
    }
    const route = new Route(routeDef);
    const triePath = `${route.method}/${route.path}`;
    this._trie.add(triePath, route);
    debug("Registered a route %s %v.", route.method.toUpperCase(), route.path);
    return route;
  }
  /**
   * Match route by request.
   *
   * @param {import('http').IncomingRequest} request
   * @returns {ResolvedRoute|undefined}
   */
  matchRouteByRequest(request) {
    const debug = this.getDebuggerFor(this.matchRouteByRequest);
    const requestPath = getRequestPathname(request);
    debug(
      "Matching routes for the request %s %v.",
      request.method.toUpperCase(),
      requestPath
    );
    const rawTriePath = `${request.method.toUpperCase()}/${requestPath}`;
    const triePath = rawTriePath.replace(/\/+/g, "/");
    const resolved = this._trie.match(triePath);
    if (resolved) {
      const route = resolved.value;
      debug("Matched route is %s %v.", route.method.toUpperCase(), route.path);
      const paramNames = Object.keys(resolved.params);
      if (paramNames.length) {
        paramNames.forEach((name) => {
          debug(
            "Found a path parameter %v with a value %v.",
            name,
            resolved.params[name]
          );
        });
      } else {
        debug("No path parameters found.");
      }
      return { route, params: resolved.params };
    }
    debug(
      "No route found for the request %s %v.",
      request.method.toUpperCase(),
      requestPath
    );
  }
  /**
   * Get allowed methods for request path.
   *
   * @param {string} requestPath
   * @returns {string[]}
   */
  getAllowedMethodsForRequestPath(requestPath) {
    if (typeof requestPath !== "string") {
      throw new import_js_format17.InvalidArgumentError(
        'Parameter "requestPath" must be a String, but %v was given.',
        requestPath
      );
    }
    const debug = this.getDebuggerFor(this.getAllowedMethodsForRequestPath);
    const allowedMethods = [];
    for (const method of Object.values(HttpMethod)) {
      const rawTriePath = `${method}/${requestPath}`;
      const triePath = rawTriePath.replace(/\/+/g, "/");
      if (this._trie.match(triePath)) {
        allowedMethods.push(method);
      }
    }
    if (allowedMethods.length) {
      debug("Allowed methods for %v are: %l.", requestPath, allowedMethods);
    } else {
      debug("Path %v does not have allowed methods.", requestPath);
    }
    return allowedMethods;
  }
};
__name(_RouteRegistry, "RouteRegistry");
var RouteRegistry = _RouteRegistry;

// src/trie-router.js
var import_js_service4 = require("@e22m4u/js-service");
var import_http4 = require("http");

// src/branch/router-branch.js
var import_js_format19 = require("@e22m4u/js-format");

// src/branch/validate-router-branch-definition.js
var import_js_format18 = require("@e22m4u/js-format");
function validateRouterBranchDefinition(branchDef) {
  if (!branchDef || typeof branchDef !== "object" || Array.isArray(branchDef)) {
    throw new import_js_format18.InvalidArgumentError(
      "Branch definition must be an Object, but %v was given.",
      branchDef
    );
  }
  if (branchDef.method !== void 0) {
    throw new import_js_format18.InvalidArgumentError(
      'Option "method" is not supported for the router branch, but %v was given.',
      branchDef.method
    );
  }
  if (branchDef.handler !== void 0) {
    throw new import_js_format18.InvalidArgumentError(
      'Option "handler" is not supported for the router branch, but %v was given.',
      branchDef.handler
    );
  }
  if (typeof branchDef.path !== "string") {
    throw new import_js_format18.InvalidArgumentError(
      'Option "path" must be a String, but %v was given.',
      branchDef.path
    );
  }
  if (!branchDef.path.startsWith("/")) {
    throw new import_js_format18.InvalidArgumentError(
      'Option "path" must start with "/", but %v was given.',
      branchDef.path
    );
  }
  if (branchDef.preHandler !== void 0) {
    if (Array.isArray(branchDef.preHandler)) {
      branchDef.preHandler.forEach((preHandler) => {
        if (typeof preHandler !== "function") {
          throw new import_js_format18.InvalidArgumentError(
            'Hook "preHandler" must be a Function, but %v was given.',
            preHandler
          );
        }
      });
    } else if (typeof branchDef.preHandler !== "function") {
      throw new import_js_format18.InvalidArgumentError(
        'Option "preHandler" must be a Function or an Array, but %v was given.',
        branchDef.preHandler
      );
    }
  }
  if (branchDef.postHandler !== void 0) {
    if (Array.isArray(branchDef.postHandler)) {
      branchDef.postHandler.forEach((postHandler) => {
        if (typeof postHandler !== "function") {
          throw new import_js_format18.InvalidArgumentError(
            'Hook "postHandler" must be a Function, but %v was given.',
            postHandler
          );
        }
      });
    } else if (typeof branchDef.postHandler !== "function") {
      throw new import_js_format18.InvalidArgumentError(
        'Option "postHandler" must be a Function or an Array, but %v was given.',
        branchDef.postHandler
      );
    }
  }
  if (branchDef.meta !== void 0) {
    if (!branchDef.meta || typeof branchDef.meta !== "object" || Array.isArray(branchDef.meta)) {
      throw new import_js_format18.InvalidArgumentError(
        'Option "meta" must be an Object, but %v was given.',
        branchDef.meta
      );
    }
  }
}
__name(validateRouterBranchDefinition, "validateRouterBranchDefinition");

// src/branch/merge-router-branch-definitions.js
function mergeRouterBranchDefinitions(firstDef, secondDef) {
  validateRouterBranchDefinition(firstDef);
  validateRouterBranchDefinition(secondDef);
  const mergedDef = {};
  let fullPath = "/" + (firstDef.path || "");
  if (secondDef.path && secondDef.path !== "/") {
    fullPath += "/" + secondDef.path;
  }
  mergedDef.path = fullPath.replace(/\/+/g, "/");
  if (firstDef.preHandler || secondDef.preHandler) {
    mergedDef.preHandler = [firstDef.preHandler, secondDef.preHandler].flat().filter(Boolean);
  }
  if (firstDef.postHandler || secondDef.postHandler) {
    mergedDef.postHandler = [firstDef.postHandler, secondDef.postHandler].flat().filter(Boolean);
  }
  if (firstDef.meta && !secondDef.meta) {
    mergedDef.meta = firstDef.meta;
  } else if (!firstDef.meta && secondDef.meta) {
    mergedDef.meta = secondDef.meta;
  } else if (firstDef.meta && secondDef.meta) {
    mergedDef.meta = mergeDeep(firstDef.meta, secondDef.meta);
  }
  return { ...firstDef, ...secondDef, ...mergedDef };
}
__name(mergeRouterBranchDefinitions, "mergeRouterBranchDefinitions");

// src/branch/router-branch.js
var _RouterBranch = class _RouterBranch extends DebuggableService {
  /**
   * Router.
   *
   * @type {TrieRouter}
   */
  _router;
  /**
   * Get router.
   *
   * @type {TrieRouter}
   */
  getRouter() {
    return this._router;
  }
  /**
   * Branch definition.
   *
   * @type {RouterBranchDefinition}
   */
  _definition;
  /**
   * Get branch definition.
   *
   * @type {RouterBranchDefinition}
   */
  getDefinition() {
    return this._definition;
  }
  /**
   * Parent branch.
   *
   * @type {RouterBranch|undefined}
   */
  _parentBranch;
  /**
   * Has parent branch.
   *
   * @returns {boolean}
   */
  hasParentBranch() {
    return Boolean(this._parentBranch);
  }
  /**
   * Get parent branch.
   *
   * @returns {RouterBranch|undefined}
   */
  getParentBranch() {
    if (!this._parentBranch) {
      throw new import_js_format19.InvalidArgumentError(
        "Parent branch does not exist in the router branch."
      );
    }
    return this._parentBranch;
  }
  /**
   * Constructor.
   *
   * @param {TrieRouter} router
   * @param {RouterBranchDefinition} branchDef
   * @param {RouterBranch} [parentBranch]
   */
  constructor(router, branchDef, parentBranch) {
    if (!(router instanceof TrieRouter)) {
      throw new import_js_format19.InvalidArgumentError(
        'Parameter "router" must be an instance of TrieRouter, but %v was given.',
        router
      );
    }
    super(router.container);
    this._router = router;
    if (parentBranch !== void 0 && !(parentBranch instanceof _RouterBranch)) {
      throw new import_js_format19.InvalidArgumentError(
        'Parameter "parentBranch" must be an instance of RouterBranch, but %v was given.',
        parentBranch
      );
    }
    this._parentBranch = parentBranch;
    if (parentBranch) {
      const mergedDef = mergeRouterBranchDefinitions(
        parentBranch.getDefinition(),
        branchDef
      );
      this._definition = cloneDeep(mergedDef);
    } else {
      validateRouterBranchDefinition(branchDef);
      this._definition = cloneDeep(branchDef);
    }
    this.ctorDebug("Created a branch %v.", branchDef.path);
    this.ctorDebug("Branch path is %v.", this._definition.path);
  }
  /**
   * Define route.
   *
   * @param {import('../route/index.js').RouteDefinition} routeDef
   * @returns {Route}
   */
  defineRoute(routeDef) {
    validateRouteDefinition(routeDef);
    const { method, handler, ...routeDefAsBranchDef } = routeDef;
    const mergedDef = mergeRouterBranchDefinitions(
      this._definition,
      routeDefAsBranchDef
    );
    mergedDef.method = method;
    mergedDef.handler = handler;
    return this._router.defineRoute(mergedDef);
  }
  /**
   * Create branch.
   *
   * @param {RouterBranch} branchDef
   * @returns {RouterBranch}
   */
  createBranch(branchDef) {
    return new _RouterBranch(this._router, branchDef, this);
  }
};
__name(_RouterBranch, "RouterBranch");
var RouterBranch = _RouterBranch;

// src/senders/data-sender.js
var import_js_format20 = require("@e22m4u/js-format");
var _DataSender = class _DataSender extends DebuggableService {
  /**
   * Send.
   *
   * @param {import('http').ServerResponse} response
   * @param {*} data
   * @returns {undefined}
   */
  send(response, data) {
    const debug = this.getDebuggerFor(this.send);
    if (data === response || response.headersSent) {
      debug("Skipping response because headers have already been sent.");
      return;
    }
    if (data == null) {
      response.statusCode = 204;
      response.end();
      debug("Empty response has been sent.");
      return;
    }
    if (isReadableStream(data)) {
      if (!response.getHeader("content-type")) {
        response.setHeader("content-type", "application/octet-stream");
      }
      data.pipe(response);
      debug("Sending response with a Stream.");
      return;
    }
    let debugMsg;
    switch (typeof data) {
      case "number":
      case "boolean":
      case "object":
        if (Buffer.isBuffer(data)) {
          if (!response.getHeader("content-type")) {
            response.setHeader("content-type", "application/octet-stream");
          }
          debugMsg = "Buffer has been sent as binary data.";
        } else {
          if (!response.getHeader("content-type")) {
            response.setHeader("content-type", "application/json");
          }
          debugMsg = (0, import_js_format20.format)(
            "%v has been sent as JSON.",
            toPascalCase(typeof data)
          );
          data = JSON.stringify(data);
        }
        break;
      default:
        if (!response.getHeader("content-type")) {
          response.setHeader("content-type", "text/plain");
        }
        debugMsg = "Response data has been sent as plain text.";
        data = String(data);
        break;
    }
    response.end(data);
    debug(debugMsg);
  }
};
__name(_DataSender, "DataSender");
var DataSender = _DataSender;

// src/senders/error-sender.js
var import_util = require("util");
var import_statuses = __toESM(require("statuses"), 1);
var EXPOSED_ERROR_PROPERTIES = ["code", "details"];
var _ErrorSender = class _ErrorSender extends DebuggableService {
  /**
   * Handle.
   *
   * @param {import('http').IncomingMessage} request
   * @param {import('http').ServerResponse} response
   * @param {Error} error
   * @returns {undefined}
   */
  send(request, response, error) {
    const debug = this.getDebuggerFor(this.send);
    let safeError = {};
    if (error) {
      if (typeof error === "object") {
        safeError = error;
      } else {
        safeError = { message: String(error) };
      }
    }
    const statusCode = error.statusCode || error.status || 500;
    const body = { error: {} };
    if (safeError.message && typeof safeError.message === "string") {
      body.error.message = safeError.message;
    } else {
      body.error.message = (0, import_statuses.default)(statusCode);
    }
    EXPOSED_ERROR_PROPERTIES.forEach((name) => {
      if (name in safeError) {
        body.error[name] = safeError[name];
      }
    });
    const requestData = {
      url: request.url,
      method: request.method,
      headers: request.headers
    };
    const inspectOptions = {
      showHidden: false,
      depth: null,
      colors: true,
      compact: false
    };
    console.warn((0, import_util.inspect)(requestData, inspectOptions));
    console.warn((0, import_util.inspect)(body, inspectOptions));
    if (error.stack) {
      console.log(error.stack);
    } else {
      console.error(error);
    }
    response.statusCode = statusCode;
    response.setHeader("content-type", "application/json; charset=utf-8");
    response.end(JSON.stringify(body, null, 2), "utf-8");
    debug(
      "%s error has been sent for the request %s %v.",
      statusCode,
      request.method,
      getRequestPathname(request)
    );
  }
  /**
   * Send 404.
   *
   * @param {import('http').IncomingMessage} request
   * @param {import('http').ServerResponse} response
   * @returns {undefined}
   */
  send404(request, response) {
    const debug = this.getDebuggerFor(this.send404);
    response.statusCode = 404;
    response.setHeader("content-type", "text/plain; charset=utf-8");
    response.end("404 Not Found", "utf-8");
    debug(
      "404 error has been sent for the request %s %v.",
      request.method,
      getRequestPathname(request)
    );
  }
};
__name(_ErrorSender, "ErrorSender");
var ErrorSender = _ErrorSender;

// src/trie-router.js
var _TrieRouter = class _TrieRouter extends DebuggableService {
  /**
   * Define route.
   *
   * Example 1:
   * ```
   * const router = new TrieRouter();
   * router.defineRoute({
   *   method: HttpMethod.GET,         // Request method.
   *   path: '/',                      // Path template.
   *   handler: ctx => 'Hello world!', // Request handler.
   * });
   * ```
   *
   * Example 2:
   * ```
   * const router = new TrieRouter();
   * router.defineRoute({
   *   method: HttpMethod.POST,        // Request method.
   *   path: '/users/:id',             // The path template may have parameters.
   *   preHandler(ctx) { ... },        // The hook "preHandler" executes before a route handler.
   *   handler(ctx) { ... },           // Route handler function.
   *   postHandler(ctx, data) { ... }, // The hook "postHandler" executes after a route handler.
   * });
   * ```
   *
   * @param {import('./route-registry.js').RouteDefinition} routeDef
   * @returns {import('./route/index.js').Route}
   */
  defineRoute(routeDef) {
    return this.getService(RouteRegistry).defineRoute(routeDef);
  }
  /**
   * Create branch.
   *
   * Example:
   * ```js
   * const router = new TrieRouter();
   * const apiBranch = router.createBranch({path: 'api'});
   *
   * // GET /api/hello
   * apiBranch.defineRoute({
   *   method: HttpMethod.GET,
   *   path: '/hello',
   *   handler: () => 'Hello World!',
   * });
   * ```
   *
   * @param {import('./branch/index.js').RouterBranchDefinition} branchDef
   * @returns {import('./branch/index.js').RouterBranchDefinition}
   */
  createBranch(branchDef) {
    return new RouterBranch(this, branchDef);
  }
  /**
   * Request listener.
   *
   * Example:
   * ```
   * import http from 'http';
   * import {TrieRouter} from '@e22m4u/js-trie-router';
   *
   * const router = new TrieRouter();
   * const server = new http.Server();
   * server.on('request', router.requestListener); // Sets the request listener.
   * server.listen(3000);                          // Starts listening for connections.
   * ```
   *
   * @returns {Function}
   */
  get requestListener() {
    return this._handleRequest.bind(this);
  }
  /**
   * Handle incoming request.
   *
   * @param {import('http').IncomingMessage} request
   * @param {import('http').ServerResponse} response
   * @returns {Promise<undefined>}
   * @private
   */
  async _handleRequest(request, response) {
    const debug = this.getDebuggerFor(this._handleRequest);
    const requestPath = getRequestPathname(request);
    debug("Handling an incoming request %s %v.", request.method, requestPath);
    try {
      if (isResponseSent(response)) {
        debug("Response has been sent before handling.");
        return;
      }
      const hookInvoker = this.getService(RouterHookInvoker);
      const onRequestHooks = this.getService(RouterHookRegistry).getHooks(
        RouterHookType.ON_REQUEST
      );
      if (onRequestHooks.length) {
        debug('Invoking "onRequest" hooks, %v hook(s) found.');
        let shouldIgnoreRequest = hookInvoker.invokeOnRequestHooks(
          request,
          response
        );
        if (isPromise(shouldIgnoreRequest)) {
          shouldIgnoreRequest = await shouldIgnoreRequest;
        }
        if (isResponseSent(response)) {
          debug('Response has been sent by "onRequest" hook.');
          return;
        }
        if (shouldIgnoreRequest === true) {
          debug('Response handling was interrupted by "onRequest" hook.');
          return;
        }
      }
      const resolved = this.getService(RouteRegistry).matchRouteByRequest(request);
      if (!resolved) {
        if (request.method.toUpperCase() === HttpMethod.OPTIONS) {
          const allowedMethods = this.getService(RouteRegistry).getAllowedMethodsForRequestPath(
            requestPath
          );
          if (allowedMethods.length > 0) {
            debug("Auto-handling OPTIONS request.");
            if (!allowedMethods.includes("OPTIONS")) {
              allowedMethods.push("OPTIONS");
            }
            const allowHeader = allowedMethods.join(", ");
            response.statusCode = 204;
            response.setHeader("Allow", allowHeader);
            response.end();
            return;
          }
        }
        debug(
          "No route found for the request %s %v.",
          request.method,
          requestPath
        );
        this.getService(ErrorSender).send404(request, response);
      } else {
        const { route, params } = resolved;
        const container = new import_js_service4.ServiceContainer(this.container);
        const context = new RequestContext(container, request, response, route);
        container.set(RequestContext, context);
        container.set(import_http4.IncomingMessage, request);
        container.set(import_http4.ServerResponse, response);
        context.params = params;
        const reqDataOrPromise = this.getService(RequestParser).parse(request);
        if (isPromise(reqDataOrPromise)) {
          const reqData = await reqDataOrPromise;
          Object.assign(context, reqData);
        } else {
          Object.assign(context, reqDataOrPromise);
        }
        let data = hookInvoker.invokePreHandlerHooks(context);
        if (isPromise(data)) {
          data = await data;
        }
        if (!isResponseSent(response)) {
          if (data === void 0) {
            data = route.handle(context);
            if (isPromise(data)) {
              data = await data;
            }
          }
          if (isResponseSent(response)) {
            debug("Response has been sent by the route handler.");
            return;
          }
          let postHandlerData = hookInvoker.invokePostHandlerHooks(
            context,
            data
          );
          if (isPromise(postHandlerData)) {
            postHandlerData = await postHandlerData;
          }
          if (isResponseSent(response)) {
            debug('Response has been sent by "postHandler" hook.');
            return;
          }
          if (postHandlerData !== void 0) {
            data = postHandlerData;
          }
        } else {
          debug('Response has been sent by "preHandler" hook.');
          return;
        }
        if (!isResponseSent(response)) {
          this.getService(DataSender).send(response, data);
        }
      }
    } catch (error) {
      this.getService(ErrorSender).send(request, response, error);
      return;
    }
  }
  /**
   * Add hook.
   *
   * @param {import('./hooks/index.js').RouterHookType} type
   * @param {import('./hooks/index.js').RouterHook} hook
   * @returns {this}
   */
  addHook(type, hook) {
    this.getService(RouterHookRegistry).addHook(type, hook);
    return this;
  }
  /**
   * Has hook.
   *
   * @param {import('./hooks/index.js').RouterHookType} type
   * @param {import('./hooks/index.js').RouterHook} hook
   * @returns {boolean}
   */
  hasHook(type, hook) {
    return this.getService(RouterHookRegistry).hasHook(type, hook);
  }
};
__name(_TrieRouter, "TrieRouter");
var TrieRouter = _TrieRouter;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BodyParser,
  CHARACTER_ENCODING_LIST,
  CookiesParser,
  DataSender,
  EXPOSED_ERROR_PROPERTIES,
  ErrorSender,
  HttpMethod,
  QueryParser,
  ROOT_PATH,
  ROUTER_HOOK_TYPES,
  RequestContext,
  RequestParser,
  Route,
  RouteRegistry,
  RouterHookInvoker,
  RouterHookRegistry,
  RouterHookType,
  RouterOptions,
  TrieRouter,
  cloneDeep,
  createCookieString,
  createError,
  createRequestMock,
  createResponseMock,
  createRouteMock,
  fetchRequestBody,
  getRequestPathname,
  hasRequestBody,
  isPromise,
  isReadableStream,
  isResponseSent,
  isWritableStream,
  mergeDeep,
  parseContentType,
  parseCookieString,
  parseJsonBody,
  toCamelCase,
  toPascalCase,
  validateRouteDefinition
});
