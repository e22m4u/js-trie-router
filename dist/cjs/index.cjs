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
  HookInvoker: () => HookInvoker,
  HookRegistry: () => HookRegistry,
  HookType: () => HookType,
  HttpMethod: () => HttpMethod,
  METHODS_WITH_BODY: () => METHODS_WITH_BODY,
  QueryParser: () => QueryParser,
  RequestContext: () => RequestContext,
  RequestParser: () => RequestParser,
  Route: () => Route,
  RouteRegistry: () => RouteRegistry,
  RouterOptions: () => RouterOptions,
  TrieRouter: () => TrieRouter,
  UNPARSABLE_MEDIA_TYPES: () => UNPARSABLE_MEDIA_TYPES,
  createCookiesString: () => createCookiesString,
  createDebugger: () => createDebugger,
  createError: () => createError,
  createRequestMock: () => createRequestMock,
  createResponseMock: () => createResponseMock,
  fetchRequestBody: () => fetchRequestBody,
  getRequestPathname: () => getRequestPathname,
  isPromise: () => isPromise,
  isReadableStream: () => isReadableStream,
  isResponseSent: () => isResponseSent,
  isWritableStream: () => isWritableStream,
  parseContentType: () => parseContentType,
  parseCookies: () => parseCookies,
  parseJsonBody: () => parseJsonBody,
  toCamelCase: () => toCamelCase
});
module.exports = __toCommonJS(index_exports);

// src/route.js
var import_js_format14 = require("@e22m4u/js-format");

// src/hooks/hook-invoker.js
var import_js_format13 = require("@e22m4u/js-format");

// src/utils/is-promise.js
function isPromise(value) {
  if (!value) return false;
  if (typeof value !== "object") return false;
  return typeof value.then === "function";
}
__name(isPromise, "isPromise");

// src/utils/create-error.js
var import_js_format = require("@e22m4u/js-format");
var import_js_format2 = require("@e22m4u/js-format");
function createError(errorCtor, message, ...args) {
  if (typeof errorCtor !== "function")
    throw new import_js_format2.Errorf(
      'The first argument of "createError" should be a constructor, but %v was given.',
      errorCtor
    );
  if (message != null && typeof message !== "string")
    throw new import_js_format2.Errorf(
      'The second argument of "createError" should be a String, but %v was given.',
      message
    );
  if (message == null) return new errorCtor();
  const interpolatedMessage = (0, import_js_format.format)(message, ...args);
  return new errorCtor(interpolatedMessage);
}
__name(createError, "createError");

// src/utils/parse-cookies.js
var import_js_format3 = require("@e22m4u/js-format");
function parseCookies(input) {
  if (typeof input !== "string")
    throw new import_js_format3.Errorf(
      'The first parameter of "parseCookies" should be a String, but %v was given.',
      input
    );
  return input.split(";").filter((v) => v !== "").map((v) => v.split("=")).reduce((cookies, tuple) => {
    const key = decodeURIComponent(tuple[0]).trim();
    const value = tuple[1] !== void 0 ? decodeURIComponent(tuple[1]).trim() : "";
    cookies[key] = value;
    return cookies;
  }, {});
}
__name(parseCookies, "parseCookies");

// src/utils/to-camel-case.js
var import_js_format4 = require("@e22m4u/js-format");
function toCamelCase(input) {
  if (typeof input !== "string")
    throw new import_js_format4.Errorf(
      'The first argument of "toCamelCase" should be a String, but %v was given.',
      input
    );
  return input.replace(/(^\w|[A-Z]|\b\w)/g, (c) => c.toUpperCase()).replace(/\W+/g, "").replace(/(^\w)/g, (c) => c.toLowerCase());
}
__name(toCamelCase, "toCamelCase");

// src/utils/create-debugger.js
var import_debug = __toESM(require("debug"), 1);
var import_js_format5 = require("@e22m4u/js-format");
function createDebugger(name) {
  if (typeof name !== "string")
    throw new import_js_format5.Errorf(
      'The first argument of "createDebugger" should be a String, but %v was given.',
      name
    );
  const debug = (0, import_debug.default)(`jsTrieRouter:${name}`);
  return function(message, ...args) {
    const interpolatedMessage = (0, import_js_format5.format)(message, ...args);
    return debug(interpolatedMessage);
  };
}
__name(createDebugger, "createDebugger");

// src/utils/is-response-sent.js
var import_js_format6 = require("@e22m4u/js-format");
function isResponseSent(res) {
  if (!res || typeof res !== "object" || Array.isArray(res) || typeof res.headersSent !== "boolean") {
    throw new import_js_format6.Errorf(
      'The first argument of "isResponseSent" should be an instance of ServerResponse, but %v was given.',
      res
    );
  }
  return res.headersSent;
}
__name(isResponseSent, "isResponseSent");

// src/utils/is-readable-stream.js
function isReadableStream(value) {
  if (!value || typeof value !== "object") return false;
  return typeof value.pipe === "function";
}
__name(isReadableStream, "isReadableStream");

// src/utils/parse-content-type.js
var import_js_format7 = require("@e22m4u/js-format");
function parseContentType(input) {
  if (typeof input !== "string")
    throw new import_js_format7.Errorf(
      'The parameter "input" of "parseContentType" should be a String, but %v was given.',
      input
    );
  const res = { mediaType: void 0, charset: void 0, boundary: void 0 };
  const re = /^\s*([^\s;/]+\/[^\s;/]+)(?:;\s*charset=([^\s;]+))?(?:;\s*boundary=([^\s;]+))?.*$/i;
  const matches = re.exec(input);
  if (matches && matches[1]) {
    res.mediaType = matches[1];
    if (matches[2]) res.charset = matches[2];
    if (matches[3]) res.boundary = matches[3];
  }
  return res;
}
__name(parseContentType, "parseContentType");

// src/utils/is-writable-stream.js
function isWritableStream(value) {
  if (!value || typeof value !== "object") return false;
  return typeof value.end === "function";
}
__name(isWritableStream, "isWritableStream");

// src/utils/fetch-request-body.js
var import_http_errors = __toESM(require("http-errors"), 1);
var import_http = require("http");
var import_js_format8 = require("@e22m4u/js-format");
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
function fetchRequestBody(req, bodyBytesLimit = 0) {
  if (!(req instanceof import_http.IncomingMessage))
    throw new import_js_format8.Errorf(
      'The first parameter of "fetchRequestBody" should be an IncomingMessage instance, but %v was given.',
      req
    );
  if (typeof bodyBytesLimit !== "number")
    throw new import_js_format8.Errorf(
      'The parameter "bodyBytesLimit" of "fetchRequestBody" should be a number, but %v was given.',
      bodyBytesLimit
    );
  return new Promise((resolve, reject) => {
    const contentLength = parseInt(req.headers["content-length"] || "0", 10);
    if (bodyBytesLimit && contentLength && contentLength > bodyBytesLimit)
      throw createError(
        import_http_errors.default.PayloadTooLarge,
        "Request body limit is %s bytes, but %s bytes given.",
        bodyBytesLimit,
        contentLength
      );
    let encoding = "utf-8";
    const contentType = req.headers["content-type"] || "";
    if (contentType) {
      const parsedContentType = parseContentType(contentType);
      if (parsedContentType && parsedContentType.charset) {
        encoding = parsedContentType.charset.toLowerCase();
        if (!CHARACTER_ENCODING_LIST.includes(encoding))
          throw createError(
            import_http_errors.default.UnsupportedMediaType,
            "Request encoding %v is not supported.",
            encoding
          );
      }
    }
    const data = [];
    let receivedLength = 0;
    const onData = /* @__PURE__ */ __name((chunk) => {
      receivedLength += chunk.length;
      if (bodyBytesLimit && receivedLength > bodyBytesLimit) {
        req.removeAllListeners();
        const error = createError(
          import_http_errors.default.PayloadTooLarge,
          "Request body limit is %v bytes, but %v bytes given.",
          bodyBytesLimit,
          receivedLength
        );
        reject(error);
        return;
      }
      data.push(chunk);
    }, "onData");
    const onEnd = /* @__PURE__ */ __name(() => {
      req.removeAllListeners();
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
      req.removeAllListeners();
      reject((0, import_http_errors.default)(400, error));
    }, "onError");
    req.on("data", onData);
    req.on("end", onEnd);
    req.on("error", onError);
    req.resume();
  });
}
__name(fetchRequestBody, "fetchRequestBody");

// src/utils/create-request-mock.js
var import_net = require("net");
var import_tls = require("tls");
var import_http2 = require("http");
var import_querystring = __toESM(require("querystring"), 1);
var import_js_format10 = require("@e22m4u/js-format");

// src/utils/create-cookies-string.js
var import_js_format9 = require("@e22m4u/js-format");
function createCookiesString(data) {
  if (!data || typeof data !== "object" || Array.isArray(data))
    throw new import_js_format9.Errorf(
      'The first parameter of "createCookiesString" should be an Object, but %v was given.',
      data
    );
  let cookies = "";
  for (const key in data) {
    if (!Object.prototype.hasOwnProperty.call(data, key)) continue;
    const val = data[key];
    if (val == null) continue;
    cookies += `${key}=${val}; `;
  }
  return cookies.trim();
}
__name(createCookiesString, "createCookiesString");

// src/utils/create-request-mock.js
function createRequestMock(patch) {
  if (patch != null && typeof patch !== "object" || Array.isArray(patch)) {
    throw new import_js_format10.Errorf(
      'The first parameter of "createRequestMock" should be an Object, but %v was given.',
      patch
    );
  }
  patch = patch || {};
  if (patch.host != null && typeof patch.host !== "string")
    throw new import_js_format10.Errorf(
      'The parameter "host" of "createRequestMock" should be a String, but %v was given.',
      patch.host
    );
  if (patch.method != null && typeof patch.method !== "string")
    throw new import_js_format10.Errorf(
      'The parameter "method" of "createRequestMock" should be a String, but %v was given.',
      patch.method
    );
  if (patch.secure != null && typeof patch.secure !== "boolean")
    throw new import_js_format10.Errorf(
      'The parameter "secure" of "createRequestMock" should be a Boolean, but %v was given.',
      patch.secure
    );
  if (patch.path != null && typeof patch.path !== "string")
    throw new import_js_format10.Errorf(
      'The parameter "path" of "createRequestMock" should be a String, but %v was given.',
      patch.path
    );
  if (patch.query != null && typeof patch.query !== "object" && typeof patch.query !== "string" || Array.isArray(patch.query)) {
    throw new import_js_format10.Errorf(
      'The parameter "query" of "createRequestMock" should be a String or Object, but %v was given.',
      patch.query
    );
  }
  if (patch.cookies != null && typeof patch.cookies !== "string" && typeof patch.cookies !== "object" || Array.isArray(patch.cookies)) {
    throw new import_js_format10.Errorf(
      'The parameter "cookies" of "createRequestMock" should be a String or Object, but %v was given.',
      patch.cookies
    );
  }
  if (patch.headers != null && typeof patch.headers !== "object" || Array.isArray(patch.headers)) {
    throw new import_js_format10.Errorf(
      'The parameter "headers" of "createRequestMock" should be an Object, but %v was given.',
      patch.headers
    );
  }
  if (patch.stream != null && !isReadableStream(patch.stream))
    throw new import_js_format10.Errorf(
      'The parameter "stream" of "createRequestMock" should be a Stream, but %v was given.',
      patch.stream
    );
  if (patch.encoding != null) {
    if (typeof patch.encoding !== "string")
      throw new import_js_format10.Errorf(
        'The parameter "encoding" of "createRequestMock" should be a String, but %v was given.',
        patch.encoding
      );
    if (!CHARACTER_ENCODING_LIST.includes(patch.encoding))
      throw new import_js_format10.Errorf(
        "Character encoding %v is not supported.",
        patch.encoding
      );
  }
  if (patch.stream) {
    if (patch.secure != null)
      throw new import_js_format10.Errorf(
        'The "createRequestMock" does not allow specifying the "stream" and "secure" options simultaneously.'
      );
    if (patch.body != null)
      throw new import_js_format10.Errorf(
        'The "createRequestMock" does not allow specifying the "stream" and "body" options simultaneously.'
      );
    if (patch.encoding != null)
      throw new import_js_format10.Errorf(
        'The "createRequestMock" does not allow specifying the "stream" and "encoding" options simultaneously.'
      );
  }
  const req = patch.stream || createRequestStream(patch.secure, patch.body, patch.encoding);
  req.url = createRequestUrl(patch.path || "/", patch.query);
  req.headers = createRequestHeaders(
    patch.host,
    patch.secure,
    patch.body,
    patch.cookies,
    patch.encoding,
    patch.headers
  );
  req.method = (patch.method || "get").toUpperCase();
  return req;
}
__name(createRequestMock, "createRequestMock");
function createRequestStream(secure, body, encoding) {
  if (encoding != null && typeof encoding !== "string")
    throw new import_js_format10.Errorf(
      'The parameter "encoding" of "createRequestStream" should be a String, but %v was given.',
      encoding
    );
  encoding = encoding || "utf-8";
  let socket = new import_net.Socket();
  if (secure) socket = new import_tls.TLSSocket(socket);
  const req = new import_http2.IncomingMessage(socket);
  if (body != null) {
    if (typeof body === "string") {
      req.push(body, encoding);
    } else if (Buffer.isBuffer(body)) {
      req.push(body);
    } else {
      req.push(JSON.stringify(body));
    }
  }
  req.push(null);
  return req;
}
__name(createRequestStream, "createRequestStream");
function createRequestUrl(path, query) {
  if (typeof path !== "string")
    throw new import_js_format10.Errorf(
      'The parameter "path" of "createRequestUrl" should be a String, but %v was given.',
      path
    );
  if (query != null && typeof query !== "string" && typeof query !== "object" || Array.isArray(query)) {
    throw new import_js_format10.Errorf(
      'The parameter "query" of "createRequestUrl" should be a String or Object, but %v was given.',
      query
    );
  }
  let url = ("/" + path).replace("//", "/");
  if (typeof query === "object") {
    const qs = import_querystring.default.stringify(query);
    if (qs) url += `?${qs}`;
  } else if (typeof query === "string") {
    url += `?${query.replace(/^\?/, "")}`;
  }
  return url;
}
__name(createRequestUrl, "createRequestUrl");
function createRequestHeaders(host, secure, body, cookies, encoding, headers) {
  if (host != null && typeof host !== "string")
    throw new import_js_format10.Errorf(
      'The parameter "host" of "createRequestHeaders" a non-empty String, but %v was given.',
      host
    );
  host = host || "localhost";
  if (secure != null && typeof secure !== "boolean")
    throw new import_js_format10.Errorf(
      'The parameter "secure" of "createRequestHeaders" should be a String, but %v was given.',
      secure
    );
  secure = Boolean(secure);
  if (cookies != null && typeof cookies !== "object" && typeof cookies !== "string" || Array.isArray(cookies)) {
    throw new import_js_format10.Errorf(
      'The parameter "cookies" of "createRequestHeaders" should be a String or Object, but %v was given.',
      cookies
    );
  }
  if (headers != null && typeof headers !== "object" || Array.isArray(headers)) {
    throw new import_js_format10.Errorf(
      'The parameter "headers" of "createRequestHeaders" should be an Object, but %v was given.',
      headers
    );
  }
  headers = headers || {};
  if (encoding != null && typeof encoding !== "string")
    throw new import_js_format10.Errorf(
      'The parameter "encoding" of "createRequestHeaders" should be a String, but %v was given.',
      encoding
    );
  encoding = encoding || "utf-8";
  const obj = { ...headers };
  obj["host"] = host;
  if (secure) obj["x-forwarded-proto"] = "https";
  if (cookies != null) {
    if (typeof cookies === "string") {
      obj["cookie"] = obj["cookie"] ? obj["cookie"] : "";
      obj["cookie"] += obj["cookie"] ? `; ${cookies}` : cookies;
    } else if (typeof cookies === "object") {
      obj["cookie"] = obj["cookie"] ? obj["cookie"] : "";
      const newCookies = createCookiesString(cookies);
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
  if (body != null && obj["content-length"] == null) {
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
  const res = new import_stream.PassThrough();
  patchEncoding(res);
  patchHeaders(res);
  patchBody(res);
  return res;
}
__name(createResponseMock, "createResponseMock");
function patchEncoding(res) {
  Object.defineProperty(res, "_encoding", {
    configurable: true,
    writable: true,
    value: void 0
  });
  Object.defineProperty(res, "setEncoding", {
    configurable: true,
    value: /* @__PURE__ */ __name(function(enc) {
      this._encoding = enc;
      return this;
    }, "value")
  });
  Object.defineProperty(res, "getEncoding", {
    configurable: true,
    value: /* @__PURE__ */ __name(function() {
      return this._encoding;
    }, "value")
  });
}
__name(patchEncoding, "patchEncoding");
function patchHeaders(res) {
  Object.defineProperty(res, "_headersSent", {
    configurable: true,
    writable: true,
    value: false
  });
  Object.defineProperty(res, "headersSent", {
    configurable: true,
    get() {
      return this._headersSent;
    }
  });
  Object.defineProperty(res, "_headers", {
    configurable: true,
    writable: true,
    value: {}
  });
  Object.defineProperty(res, "setHeader", {
    configurable: true,
    value: /* @__PURE__ */ __name(function(name, value) {
      if (this.headersSent)
        throw new Error(
          "Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client"
        );
      const key = name.toLowerCase();
      this._headers[key] = String(value);
      return this;
    }, "value")
  });
  Object.defineProperty(res, "getHeader", {
    configurable: true,
    value: /* @__PURE__ */ __name(function(name) {
      return this._headers[name.toLowerCase()];
    }, "value")
  });
  Object.defineProperty(res, "getHeaders", {
    configurable: true,
    value: /* @__PURE__ */ __name(function() {
      return JSON.parse(JSON.stringify(this._headers));
    }, "value")
  });
}
__name(patchHeaders, "patchHeaders");
function patchBody(res) {
  let resolve, reject;
  const promise = new Promise((res2, rej) => {
    resolve = res2;
    reject = rej;
  });
  const data = [];
  res.on("data", (c) => data.push(c));
  res.on("error", (e) => reject(e));
  res.on("end", () => {
    res._headersSent = true;
    resolve(Buffer.concat(data));
  });
  Object.defineProperty(res, "getBody", {
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
var import_js_format11 = require("@e22m4u/js-format");
function getRequestPathname(req) {
  if (!req || typeof req !== "object" || Array.isArray(req) || typeof req.url !== "string") {
    throw new import_js_format11.Errorf(
      'The first argument of "getRequestPathname" should be an instance of IncomingMessage, but %v was given.',
      req
    );
  }
  return (req.url || "/").replace(/\?.*$/, "");
}
__name(getRequestPathname, "getRequestPathname");

// src/hooks/hook-registry.js
var import_js_format12 = require("@e22m4u/js-format");
var HookType = {
  PRE_HANDLER: "preHandler",
  POST_HANDLER: "postHandler"
};
var _HookRegistry = class _HookRegistry {
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
    if (!type || typeof type !== "string")
      throw new import_js_format12.Errorf("The hook type is required, but %v was given.", type);
    if (!Object.values(HookType).includes(type))
      throw new import_js_format12.Errorf("The hook type %v is not supported.", type);
    if (!hook || typeof hook !== "function")
      throw new import_js_format12.Errorf(
        "The hook %v should be a Function, but %v was given.",
        type,
        hook
      );
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
    if (!type || typeof type !== "string")
      throw new import_js_format12.Errorf("The hook type is required, but %v was given.", type);
    if (!Object.values(HookType).includes(type))
      throw new import_js_format12.Errorf("The hook type %v is not supported.", type);
    if (!hook || typeof hook !== "function")
      throw new import_js_format12.Errorf(
        "The hook %v should be a Function, but %v was given.",
        type,
        hook
      );
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
    if (!type || typeof type !== "string")
      throw new import_js_format12.Errorf("The hook type is required, but %v was given.", type);
    if (!Object.values(HookType).includes(type))
      throw new import_js_format12.Errorf("The hook type %v is not supported.", type);
    return this._hooks.get(type) || [];
  }
};
__name(_HookRegistry, "HookRegistry");
var HookRegistry = _HookRegistry;

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

// src/hooks/hook-invoker.js
var _HookInvoker = class _HookInvoker extends DebuggableService {
  /**
   * Invoke and continue until value received.
   *
   * @param {Route} route
   * @param {string} hookType
   * @param {import('http').ServerResponse} response
   * @param {*[]} args
   * @returns {Promise<*>|*}
   */
  invokeAndContinueUntilValueReceived(route, hookType, response, ...args) {
    if (!route || !(route instanceof Route))
      throw new import_js_format13.Errorf(
        'The parameter "route" of the HookInvoker.invokeAndContinueUntilValueReceived should be a Route instance, but %v was given.',
        route
      );
    if (!hookType || typeof hookType !== "string")
      throw new import_js_format13.Errorf(
        'The parameter "hookType" of the HookInvoker.invokeAndContinueUntilValueReceived should be a non-empty String, but %v was given.',
        hookType
      );
    if (!Object.values(HookType).includes(hookType))
      throw new import_js_format13.Errorf("The hook type %v is not supported.", hookType);
    if (!response || typeof response !== "object" || Array.isArray(response) || typeof response.headersSent !== "boolean") {
      throw new import_js_format13.Errorf(
        'The parameter "response" of the HookInvoker.invokeAndContinueUntilValueReceived should be a ServerResponse instance, but %v was given.',
        response
      );
    }
    const hooks = [
      ...this.getService(HookRegistry).getHooks(hookType),
      ...route.hookRegistry.getHooks(hookType)
    ];
    let result = void 0;
    for (const hook of hooks) {
      if (isResponseSent(response)) {
        result = response;
        break;
      }
      if (result == null) {
        result = hook(...args);
      } else if (isPromise(result)) {
        result = result.then((prevVal) => {
          if (isResponseSent(response)) {
            return;
          }
          if (prevVal != null) return prevVal;
          return hook(...args);
        });
      } else {
        break;
      }
    }
    return result;
  }
};
__name(_HookInvoker, "HookInvoker");
var HookInvoker = _HookInvoker;

// src/route.js
var import_js_debug = require("@e22m4u/js-debug");
var HttpMethod = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE"
};
var _Route = class _Route extends import_js_debug.Debuggable {
  /**
   * Method.
   *
   * @type {string}
   * @private
   */
  _method;
  /**
   * Getter of the method.
   *
   * @returns {string}
   */
  get method() {
    return this._method;
  }
  /**
   * Path template.
   *
   * @type {string}
   * @private
   */
  _path;
  /**
   * Getter of the path.
   *
   * @returns {string}
   */
  get path() {
    return this._path;
  }
  /**
   * Handler.
   *
   * @type {RouteHandler}
   * @private
   */
  _handler;
  /**
   * Getter of the handler.
   *
   * @returns {*}
   */
  get handler() {
    return this._handler;
  }
  /**
   * Hook registry.
   *
   * @type {HookRegistry}
   * @private
   */
  _hookRegistry = new HookRegistry();
  /**
   * Getter of the hook registry.
   *
   * @returns {HookRegistry}
   */
  get hookRegistry() {
    return this._hookRegistry;
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
    if (!routeDef || typeof routeDef !== "object" || Array.isArray(routeDef))
      throw new import_js_format14.Errorf(
        "The first parameter of Route.constructor should be an Object, but %v was given.",
        routeDef
      );
    if (!routeDef.method || typeof routeDef.method !== "string")
      throw new import_js_format14.Errorf(
        'The option "method" of the Route should be a non-empty String, but %v was given.',
        routeDef.method
      );
    this._method = routeDef.method.toUpperCase();
    if (typeof routeDef.path !== "string")
      throw new import_js_format14.Errorf(
        'The option "path" of the Route should be a String, but %v was given.',
        routeDef.path
      );
    this._path = routeDef.path;
    if (typeof routeDef.handler !== "function")
      throw new import_js_format14.Errorf(
        'The option "handler" of the Route should be a Function, but %v was given.',
        routeDef.handler
      );
    this._handler = routeDef.handler;
    if (routeDef.preHandler != null) {
      const preHandlerHooks = Array.isArray(routeDef.preHandler) ? routeDef.preHandler : [routeDef.preHandler];
      preHandlerHooks.forEach((hook) => {
        this._hookRegistry.addHook(HookType.PRE_HANDLER, hook);
      });
    }
    if (routeDef.postHandler != null) {
      const postHandlerHooks = Array.isArray(routeDef.postHandler) ? routeDef.postHandler : [routeDef.postHandler];
      postHandlerHooks.forEach((hook) => {
        this._hookRegistry.addHook(HookType.POST_HANDLER, hook);
      });
    }
    this.ctorDebug("A new route %s %v was created.", this._method, this._path);
  }
  /**
   * Handle request.
   *
   * @param {RequestContext} context
   * @returns {*}
   */
  handle(context) {
    const debug = this.getDebuggerFor(this.handle);
    const requestPath = getRequestPathname(context.req);
    debug(
      "Invoking the Route handler for the request %s %v.",
      this.method.toUpperCase(),
      requestPath
    );
    return this._handler(context);
  }
};
__name(_Route, "Route");
var Route = _Route;

// src/trie-router.js
var import_http4 = require("http");
var import_http5 = require("http");

// src/senders/data-sender.js
var import_js_format15 = require("@e22m4u/js-format");
var _DataSender = class _DataSender extends DebuggableService {
  /**
   * Send.
   *
   * @param {import('http').ServerResponse} res
   * @param {*} data
   * @returns {undefined}
   */
  send(res, data) {
    const debug = this.getDebuggerFor(this.send);
    if (data === res || res.headersSent) {
      debug(
        "Response sending was skipped because its headers where sent already."
      );
      return;
    }
    if (data == null) {
      res.statusCode = 204;
      res.end();
      debug("The empty response was sent.");
      return;
    }
    if (isReadableStream(data)) {
      res.setHeader("Content-Type", "application/octet-stream");
      data.pipe(res);
      debug("The stream response was sent.");
      return;
    }
    let debugMsg;
    switch (typeof data) {
      case "object":
      case "boolean":
      case "number":
        if (Buffer.isBuffer(data)) {
          res.setHeader("content-type", "application/octet-stream");
          debugMsg = "The Buffer was sent as binary data.";
        } else {
          res.setHeader("content-type", "application/json");
          debugMsg = (0, import_js_format15.format)("The %v was sent as JSON.", typeof data);
          data = JSON.stringify(data);
        }
        break;
      default:
        res.setHeader("content-type", "text/plain");
        debugMsg = "The response data was sent as plain text.";
        data = String(data);
        break;
    }
    res.end(data);
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
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   * @param {Error} error
   * @returns {undefined}
   */
  send(req, res, error) {
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
      if (name in safeError) body.error[name] = safeError[name];
    });
    const requestData = {
      url: req.url,
      method: req.method,
      headers: req.headers
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
    res.statusCode = statusCode;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify(body, null, 2), "utf-8");
    debug(
      "The %s error was sent for the request %s %v.",
      statusCode,
      req.method,
      getRequestPathname(req)
    );
  }
  /**
   * Send 404.
   *
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   * @returns {undefined}
   */
  send404(req, res) {
    const debug = this.getDebuggerFor(this.send404);
    res.statusCode = 404;
    res.setHeader("content-type", "text/plain; charset=utf-8");
    res.end("404 Not Found", "utf-8");
    debug(
      "The 404 error was sent for the request %s %v.",
      req.method,
      getRequestPathname(req)
    );
  }
};
__name(_ErrorSender, "ErrorSender");
var ErrorSender = _ErrorSender;

// src/parsers/body-parser.js
var import_http_errors2 = __toESM(require("http-errors"), 1);
var import_js_format17 = require("@e22m4u/js-format");

// src/router-options.js
var import_js_format16 = require("@e22m4u/js-format");
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
    if (typeof input !== "number" || input < 0)
      throw new import_js_format16.Errorf(
        'The option "requestBodyBytesLimit" must be a positive Number or 0, but %v was given.',
        input
      );
    this._requestBodyBytesLimit = input;
    return this;
  }
};
__name(_RouterOptions, "RouterOptions");
var RouterOptions = _RouterOptions;

// src/parsers/body-parser.js
var METHODS_WITH_BODY = ["POST", "PUT", "PATCH", "DELETE"];
var UNPARSABLE_MEDIA_TYPES = ["multipart/form-data"];
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
    if (!mediaType || typeof mediaType !== "string")
      throw new import_js_format17.Errorf(
        'The parameter "mediaType" of BodyParser.defineParser should be a non-empty String, but %v was given.',
        mediaType
      );
    if (!parser || typeof parser !== "function")
      throw new import_js_format17.Errorf(
        'The parameter "parser" of BodyParser.defineParser should be a Function, but %v was given.',
        parser
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
    if (!mediaType || typeof mediaType !== "string")
      throw new import_js_format17.Errorf(
        'The parameter "mediaType" of BodyParser.hasParser should be a non-empty String, but %v was given.',
        mediaType
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
    if (!mediaType || typeof mediaType !== "string")
      throw new import_js_format17.Errorf(
        'The parameter "mediaType" of BodyParser.deleteParser should be a non-empty String, but %v was given.',
        mediaType
      );
    const parser = this._parsers[mediaType];
    if (!parser) throw new import_js_format17.Errorf("The parser of %v is not found.", mediaType);
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
    const debug = this.getDebuggerFor(this.parse);
    if (!METHODS_WITH_BODY.includes(req.method.toUpperCase())) {
      debug(
        "Body parsing was skipped for the %s request.",
        req.method.toUpperCase()
      );
      return;
    }
    const contentType = (req.headers["content-type"] || "").replace(
      /^([^;]+);.*$/,
      "$1"
    );
    if (!contentType) {
      debug(
        "Body parsing was skipped because the request had no content type."
      );
      return;
    }
    const { mediaType } = parseContentType(contentType);
    if (!mediaType)
      throw createError(
        import_http_errors2.default.BadRequest,
        'Unable to parse the "content-type" header.'
      );
    const parser = this._parsers[mediaType];
    if (!parser) {
      if (UNPARSABLE_MEDIA_TYPES.includes(mediaType)) {
        debug("Body parsing was skipped for %v.", mediaType);
        return;
      }
      throw createError(
        import_http_errors2.default.UnsupportedMediaType,
        "Media type %v is not supported.",
        mediaType
      );
    }
    const bodyBytesLimit = this.getService(RouterOptions).requestBodyBytesLimit;
    return fetchRequestBody(req, bodyBytesLimit).then((rawBody) => {
      if (rawBody != null) return parser(rawBody);
      return rawBody;
    });
  }
};
__name(_BodyParser, "BodyParser");
var BodyParser = _BodyParser;
function parseJsonBody(input) {
  if (typeof input !== "string") return void 0;
  try {
    return JSON.parse(input);
  } catch (error) {
    throw createError(import_http_errors2.default.BadRequest, error.message);
  }
}
__name(parseJsonBody, "parseJsonBody");

// src/parsers/query-parser.js
var import_querystring2 = __toESM(require("querystring"), 1);
var _QueryParser = class _QueryParser extends DebuggableService {
  /**
   * Parse
   *
   * @param {import('http').IncomingMessage} req
   * @returns {object}
   */
  parse(req) {
    const debug = this.getDebuggerFor(this.parse);
    const queryStr = req.url.replace(/^[^?]*\??/, "");
    const query = queryStr ? import_querystring2.default.parse(queryStr) : {};
    const queryKeys = Object.keys(query);
    if (queryKeys.length) {
      queryKeys.forEach((key) => {
        debug("The query parameter %v had the value %v.", key, query[key]);
      });
    } else {
      debug(
        "The request %s %v had no query parameters.",
        req.method,
        getRequestPathname(req)
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
   * @param {import('http').IncomingMessage} req
   * @returns {object}
   */
  parse(req) {
    const debug = this.getDebuggerFor(this.parse);
    const cookiesString = req.headers["cookie"] || "";
    const cookies = parseCookies(cookiesString);
    const cookiesKeys = Object.keys(cookies);
    if (cookiesKeys.length) {
      cookiesKeys.forEach((key) => {
        debug("The cookie %v had the value %v.", key, cookies[key]);
      });
    } else {
      debug(
        "The request %s %v had no cookies.",
        req.method,
        getRequestPathname(req)
      );
    }
    return cookies;
  }
};
__name(_CookiesParser, "CookiesParser");
var CookiesParser = _CookiesParser;

// src/parsers/request-parser.js
var import_http3 = require("http");
var import_js_format18 = require("@e22m4u/js-format");
var _RequestParser = class _RequestParser extends DebuggableService {
  /**
   * Parse.
   *
   * @param {IncomingMessage} req
   * @returns {Promise<object>|object}
   */
  parse(req) {
    if (!(req instanceof import_http3.IncomingMessage))
      throw new import_js_format18.Errorf(
        "The first argument of RequestParser.parse should be an instance of IncomingMessage, but %v was given.",
        req
      );
    const data = {};
    const promises = [];
    const parsedQuery = this.getService(QueryParser).parse(req);
    if (isPromise(parsedQuery)) {
      promises.push(parsedQuery.then((v) => data.query = v));
    } else {
      data.query = parsedQuery;
    }
    const parsedCookies = this.getService(CookiesParser).parse(req);
    if (isPromise(parsedCookies)) {
      promises.push(parsedCookies.then((v) => data.cookies = v));
    } else {
      data.cookies = parsedCookies;
    }
    const parsedBody = this.getService(BodyParser).parse(req);
    if (isPromise(parsedBody)) {
      promises.push(parsedBody.then((v) => data.body = v));
    } else {
      data.body = parsedBody;
    }
    data.headers = Object.assign({}, req.headers);
    return promises.length ? Promise.all(promises).then(() => data) : data;
  }
};
__name(_RequestParser, "RequestParser");
var RequestParser = _RequestParser;

// src/route-registry.js
var import_js_format19 = require("@e22m4u/js-format");
var import_js_path_trie = require("@e22m4u/js-path-trie");
var import_js_service2 = require("@e22m4u/js-service");
var _RouteRegistry = class _RouteRegistry extends DebuggableService {
  /**
   * Constructor.
   *
   * @param {ServiceContainer} container
   */
  constructor(container) {
    super(container);
    this._trie = new import_js_path_trie.PathTrie();
  }
  /**
   * Define route.
   *
   * @param {import('./route.js').RouteDefinition} routeDef
   * @returns {Route}
   */
  defineRoute(routeDef) {
    const debug = this.getDebuggerFor(this.defineRoute);
    if (!routeDef || typeof routeDef !== "object" || Array.isArray(routeDef))
      throw new import_js_format19.Errorf(
        "The route definition should be an Object, but %v was given.",
        routeDef
      );
    const route = new Route(routeDef);
    const triePath = `${route.method}/${route.path}`;
    this._trie.add(triePath, route);
    debug(
      "The route %s %v was registered.",
      route.method.toUpperCase(),
      route.path
    );
    return route;
  }
  /**
   * Match route by request.
   *
   * @param {import('http').IncomingRequest} req
   * @returns {ResolvedRoute|undefined}
   */
  matchRouteByRequest(req) {
    const debug = this.getDebuggerFor(this.matchRouteByRequest);
    const requestPath = (req.url || "/").replace(/\?.*$/, "");
    debug(
      "Matching routes with the request %s %v.",
      req.method.toUpperCase(),
      requestPath
    );
    const triePath = `${req.method.toUpperCase()}/${requestPath}`;
    const resolved = this._trie.match(triePath);
    if (resolved) {
      const route = resolved.value;
      debug(
        "The route %s %v was matched.",
        route.method.toUpperCase(),
        route.path
      );
      const paramNames = Object.keys(resolved.params);
      if (paramNames.length) {
        paramNames.forEach((name) => {
          debug(
            "The path parameter %v had the value %v.",
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
      "No matched route for the request %s %v.",
      req.method.toUpperCase(),
      requestPath
    );
  }
};
__name(_RouteRegistry, "RouteRegistry");
var RouteRegistry = _RouteRegistry;

// src/request-context.js
var import_js_format20 = require("@e22m4u/js-format");
var import_js_service3 = require("@e22m4u/js-service");
var import_js_service4 = require("@e22m4u/js-service");
var _RequestContext = class _RequestContext {
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
   * Method.
   *
   * @returns {string}
   */
  get method() {
    return this.req.method.toUpperCase();
  }
  /**
   * Path.
   *
   * @returns {string}
   */
  get path() {
    return this.req.url;
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
    if (this._pathname != null) return this._pathname;
    this._pathname = getRequestPathname(this.req);
    return this._pathname;
  }
  /**
   * Constructor.
   *
   * @param {ServiceContainer} container
   * @param {import('http').IncomingMessage} request
   * @param {import('http').ServerResponse} response
   */
  constructor(container, request, response) {
    if (!(0, import_js_service4.isServiceContainer)(container))
      throw new import_js_format20.Errorf(
        'The parameter "container" of RequestContext.constructor should be an instance of ServiceContainer, but %v was given.',
        container
      );
    this.container = container;
    if (!request || typeof request !== "object" || Array.isArray(request) || !isReadableStream(request)) {
      throw new import_js_format20.Errorf(
        'The parameter "request" of RequestContext.constructor should be an instance of IncomingMessage, but %v was given.',
        request
      );
    }
    this.req = request;
    if (!response || typeof response !== "object" || Array.isArray(response) || !isWritableStream(response)) {
      throw new import_js_format20.Errorf(
        'The parameter "response" of RequestContext.constructor should be an instance of ServerResponse, but %v was given.',
        response
      );
    }
    this.res = response;
  }
};
__name(_RequestContext, "RequestContext");
var RequestContext = _RequestContext;

// src/trie-router.js
var import_js_service5 = require("@e22m4u/js-service");
var _TrieRouter = class _TrieRouter extends DebuggableService {
  /**
   * Define route.
   *
   * Example 1:
   * ```
   * const router = new TrieRouter();
   * router.defineRoute({
   *   method: HttpMethod.GET,        // Request method.
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
   *   preHandler(ctx) { ... },        // The "preHandler" executes before a route handler.
   *   handler(ctx) { ... },           // Request handler function.
   *   postHandler(ctx, data) { ... }, // The "postHandler" executes after a route handler.
   * });
   * ```
   *
   * @param {import('./route-registry.js').RouteDefinition} routeDef
   * @returns {import('./route.js').Route}
   */
  defineRoute(routeDef) {
    return this.getService(RouteRegistry).defineRoute(routeDef);
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
   * @param {import('http').IncomingMessage} req
   * @param {import('http').ServerResponse} res
   * @returns {Promise<undefined>}
   * @private
   */
  async _handleRequest(req, res) {
    const debug = this.getDebuggerFor(this._handleRequest);
    const requestPath = (req.url || "/").replace(/\?.*$/, "");
    debug(
      "Preparing to handle an incoming request %s %v.",
      req.method,
      requestPath
    );
    const resolved = this.getService(RouteRegistry).matchRouteByRequest(req);
    if (!resolved) {
      debug("No route for the request %s %v.", req.method, requestPath);
      this.getService(ErrorSender).send404(req, res);
    } else {
      const { route, params } = resolved;
      const container = new import_js_service5.ServiceContainer(this.container);
      const context = new RequestContext(container, req, res);
      container.set(RequestContext, context);
      container.set(import_http5.IncomingMessage, req);
      container.set(import_http4.ServerResponse, res);
      context.params = params;
      let data;
      try {
        const reqDataOrPromise = this.getService(RequestParser).parse(req);
        if (isPromise(reqDataOrPromise)) {
          const reqData = await reqDataOrPromise;
          Object.assign(context, reqData);
        } else {
          Object.assign(context, reqDataOrPromise);
        }
        const hookInvoker = this.getService(HookInvoker);
        data = hookInvoker.invokeAndContinueUntilValueReceived(
          route,
          HookType.PRE_HANDLER,
          res,
          context
        );
        if (isPromise(data)) data = await data;
        if (!isResponseSent(res) && data == null) {
          data = route.handle(context);
          if (isPromise(data)) data = await data;
          let postHandlerData = hookInvoker.invokeAndContinueUntilValueReceived(
            route,
            HookType.POST_HANDLER,
            res,
            context,
            data
          );
          if (isPromise(postHandlerData))
            postHandlerData = await postHandlerData;
          if (postHandlerData != null) data = postHandlerData;
        }
      } catch (error) {
        this.getService(ErrorSender).send(req, res, error);
        return;
      }
      if (!isResponseSent(res)) {
        this.getService(DataSender).send(res, data);
      }
    }
  }
  /**
   * Add hook.
   *
   * Example:
   * ```
   * import {TrieRouter} from '@e22m4u/js-trie-router';
   * import {HookType} from '@e22m4u/js-trie-router';
   *
   * // Router instance.
   * const router = new TrieRouter();
   *
   * // Adds the "preHandler" hook for each route.
   * router.addHook(
   *   HookType.PRE_HANDLER,
   *   ctx => { ... },
   * );
   *
   * // Adds the "postHandler" hook for each route.
   * router.addHook(
   *   HookType.POST_HANDLER,
   *   ctx => { ... },
   * );
   * ```
   *
   * @param {string} type
   * @param {Function} hook
   * @returns {this}
   */
  addHook(type, hook) {
    this.getService(HookRegistry).addHook(type, hook);
    return this;
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
  HookInvoker,
  HookRegistry,
  HookType,
  HttpMethod,
  METHODS_WITH_BODY,
  QueryParser,
  RequestContext,
  RequestParser,
  Route,
  RouteRegistry,
  RouterOptions,
  TrieRouter,
  UNPARSABLE_MEDIA_TYPES,
  createCookiesString,
  createDebugger,
  createError,
  createRequestMock,
  createResponseMock,
  fetchRequestBody,
  getRequestPathname,
  isPromise,
  isReadableStream,
  isResponseSent,
  isWritableStream,
  parseContentType,
  parseCookies,
  parseJsonBody,
  toCamelCase
});
