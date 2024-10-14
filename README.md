## @e22m4u/js-trie-router

*English | [Русский](./README-ru.md)*

HTTP router for Node.js based on
a [prefix tree](https://en.wikipedia.org/wiki/Trie) (trie).

- Supports [path-to-regexp](https://github.com/pillarjs/path-to-regexp) syntax.
- Parses JSON request body automatically.
- Parses query string and `cookie` header.
- Supports `preHandler` and `postHandler` hooks.
- Supports asynchronous handlers.

## Installation

```bash
npm install @e22m4u/js-trie-router
```

To load the ES-module, you need to set `"type": "module"`
in the `package.json` file, or use the `.mjs` extension.

## Overview

A basic example of creating a router instance, defining
a route and startup Node.js HTTP server.

```js
import http from 'http';
import {TrieRouter} from '@e22m4u/js-trie-router';

const server = new http.Server(); // Node.js HTTP server
const router = new TrieRouter();  // TrieRouter instance

router.defineRoute({              // route definition
  method: 'GET',                  // request method "GET", "POST", etc.
  path: '/',                      // path template, example "/user/:id"
  handler(ctx) {                  // route handler
    return 'Hello world!';
  },
});

server.on('request', router.requestListener); // inject request listener
server.listen(3000, 'localhost');             // listen for requests

// Open in browser http://localhost:3000
```

### Request context

The first parameter of a route handler is an instance
of the `RequestContext` class which has a properties
set with contents of a parsed request data.

- `container: ServiceContainer` instance of [service container](https://npmjs.com/package/@e22m4u/js-service)
- `req: IncomingMessage` native incoming request stream
- `res: ServerResponse` native server response stream
- `params: ParsedParams` key-value object with path parameters
- `query: ParsedQuery` key-value object with query string parameters
- `headers: ParsedHeaders` key-value object with request headers
- `cookie: ParsedCookie` key-value object of parsed `cookie` header
- `method: string` request method in uppercase, e.g. `GET`, `POST`, etc.
- `path: string` path including query string, e.g. `/myPath?foo=bar`
- `pathname: string` request path, e.g. `/myMath`

Example of accessing the context from a route handler.

```js
router.defineRoute({
  method: 'GET',
  path: '/users/:id',
  handler(ctx) {
    // GET /users/10?include=city
    // Cookie: foo=bar; baz=qux;
    console.log(ctx.req);      // IncomingMessage
    console.log(ctx.res);      // ServerResponse
    console.log(ctx.params);   // {id: 10}
    console.log(ctx.query);    // {include: 'city'}
    console.log(ctx.headers);  // {cookie: 'foo=bar; baz=qux;'}
    console.log(ctx.cookie);   // {foo: 'bar', baz: 'qux'}
    console.log(ctx.method);   // "GET"
    console.log(ctx.path);     // "/users/10?include=city"
    console.log(ctx.pathname); // "/users/10"
    // ...
  },
});
```

### Response sending

Return value of a route handler is used as response data.
Value type affects representation of a response data. For example,
if a response data is of type `object`, it will be automatically
serialized to JSON.

| value     | content-type             |
|-----------|--------------------------|
| `string`  | text/plain               |
| `number`  | application/json         |
| `boolean` | application/json         |
| `object`  | application/json         |
| `Buffer`  | application/octet-stream |
| `Stream`  | application/octet-stream |

Example of sending data as JSON.

```js
router.defineRoute({     // register a route
  // ...
  handler(ctx) {         // incoming request handler
    return {foo: 'bar'}; // response will be encoded to JSON
  },
});
```

The request context `ctx` contains a native instance
of the `ServerResponse` class from the `http` module,
which can be used for manual response management.

```js
router.defineRoute({
  // ...
  handler(ctx) {
    res.statusCode = 404;
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.end('404 Not Found', 'utf-8');
  },
});
```

### Route hooks

Defining a route with the `defineRoute` method allows setting
hooks to monitor and intercept incoming requests and responses
for a specific route.

- `preHandler` executes before calling a route handler
- `postHandler` executes after calling a route handler

#### preHandler

Before calling a route handler, operations such as authorization
and request validation may be performed in the `preHandler`
hook.

```js
router.defineRoute({ // register a route
  // ...
  preHandler(ctx) {
    // called before the route handler
    console.log(`Incoming request ${ctx.method} ${ctx.path}`);
    // Incoming request GET /myPath
  },
  handler(ctx) {
    return 'Hello world!';
  },
});
```

A route handler will not be called if `preHandler` hook
returns a value other than `undefined` and `null`, because
that value will be sent as response data.

```js
router.defineRoute({ // register a route
  // ...
  preHandler(ctx) {
    // return the response data
    return 'Are you authorized?';
  },
  handler(ctx) {
    // this handler will not be called
    // because the "preHandler" hook
    // has already sent the data
  },
});
```

#### postHandler

Return value of a route handler will be passed as a second
argument of `postHandler` hook. If return value is not
`undefined` and `null` that value will be sent as server
response. The hook may be useful to modify response data
before send.

```js
router.defineRoute({
  // ...
  handler(ctx) {
    // return the response data
    return 'Hello world!';
  },
  postHandler(ctx, data) {
    // modify the response data before send
    return data.toUpperCase(); // HELLO WORLD!
  },
});
```

### Global hooks

A `TrieRouter` instance allows setting global hooks
that have higher priority over route hooks and are
called first.

- `preHandler` executes before calling a handler of each route
- `postHandler` executes after calling a handler of each route

Global hooks can be added using the `addHook` method
of a router instance, where the first parameter
is the hook name, and the second is a function.

```js
router.addHook('preHandler', (ctx) => {
  // called before a route handler
});

router.addHook('postHandler', (ctx, data) => {
  // called after a route handler
});
```

Similar to route hooks, if a global hook returns
a value other than `undefined` and `null`, that
value will be sent as response data.

## Debugging

Set the `DEBUG` variable to enable log output.

```bash
DEBUG=jsTrieRouter* npm run test
```

## Testing

```bash
npm run test
```

## License

MIT
