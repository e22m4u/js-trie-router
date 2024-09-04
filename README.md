## @e22m4u/js-trie-router

A pure ES-module of the Node.js HTTP router that uses the
[Trie](https://en.wikipedia.org/wiki/Trie) for routing.

- Uses [path-to-regexp](https://github.com/pillarjs/path-to-regexp) syntax.
- Supports path parameters.
- Parses JSON-body automatically.
- Parses a query string and a `cookie` header.
- Supports `preHandler` and `postHandler` hooks.
- Asynchronous request handler.

## Installation

```bash
npm install @e22m4u/js-trie-router
```

To load an ES-module set `"type": "module"` in the `package.json`
or use the `.mjs` extension.

## Overview

A basic "Hello world." example.

```js
import http from 'http';
import {TrieRouter} from '../src/index.js';
import {HTTP_METHOD} from '../src/route.js';

const server = new http.Server(); // A Node.js HTTP server.
const router = new TrieRouter();  // A TrieRouter instance.

router.defineRoute({
  method: HTTP_METHOD.GET,        // Request method.
  path: '/',                      // Path template like "/user/:id".
  handler(ctx) {                  // Request handler.
    return 'Hello world!';
  },
});

server.on('request', router.requestHandler);
server.listen(3000, 'localhost');

// Open in browser http://localhost:3000
```

### RequestContext

The first parameter of a route handler is a `RequestContext` instance.

- `container: ServiceContainer` is an instance of the [ServiceContainer](https://npmjs.com/package/@e22m4u/js-service)
- `req: IncomingMessage` is a native request from the `http` module
- `res: ServerResponse` is a native response from the `http` module
- `params: ParsedParams` is a key-value object of path parameters
- `query: ParsedQuery` is a key-value object of a parsed query string
- `headers: ParsedHeaders` is a key-value object of request headers
- `cookie: ParsedCookie` is a key-value object of a parsed `cookie` header
- `method: string` is a request method in lower case like `get`, `post` etc.
- `path: string` is a request pathname with a query string
- `pathname: string` is a request pathname without a query string

Here are possible values of RequestContext properties.

```js
router.defineRoute({
  method: 'get',
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
    console.log(ctx.method);   // "get"
    console.log(ctx.path);     // "/users/10?include=city"
    console.log(ctx.pathname); // "/users/10"
    // ...
  },
});
```

### Sending response

Return values of a route handler will be sent as described below.

| value     | content-type             |
|-----------|--------------------------|
| `string`  | text/plain               |
| `number`  | application/json         |
| `boolean` | application/json         |
| `object`  | application/json         |
| `Buffer`  | application/octet-stream |
| `Stream`  | application/octet-stream |

Here is an example of a JSON response.

```js
router.defineRoute({
  // ...
  handler(ctx) {
    // sends "application/json"
    return {foo: 'bar'};
  },
});
```

If the `ServerResponse` has been sent manually, then a return
value of the route handler will be ignored.

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

A route definition allows you to set following hooks:

- `preHandler` is executed before a route handler.
- `postHandler` is executed after a route handler.

If the `preHandler` hook returns a value other than `undefined`
or `null`, it will be used as the server response.

```js
router.defineRoute({
  // ...
  preHandler(ctx) {
    return 'Are you authenticated?';
  },
  handler(ctx) {
    // the request handler will be skipped because
    // the "preHandler" hook returns a non-empty value
    return 'Hello world!';
  },
});
```

A return value of the route handler will be passed as the second
argument to the `preHandler` hook.

```js
router.defineRoute({
  // ...
  handler(ctx) {
    return 'Hello world!';
  },
  preHandler(ctx, data) {
    // after the route handler
    return data.toUpperCase(); // HELLO WORLD!
  },
});
```

### Global hooks

A `Router` instance allows you to set following global hooks:

- `preHandler` is executed before each route handler.
- `postHandler` is executed after each route handler.

The `addHook` method of a `Router` instance accepts a hook name as the first
parameter and the hook function as the second.

```js
router.addHook('preHandler', (ctx) => {
  // executes before each route handler
});

router.addHook('postHandler', (ctx, data) => {
  // executes after each route handler
});
```

Similar to a route hook, if a global hook returns a value other than
`undefined` or `null`, that value will be used as the server response.

## Debug

Set environment variable `DEBUG=jsTrieRouter*` before start.

```bash
DEBUG=jsPathTrie* npm run test
```

## Testing

```bash
npm run test
```

## Contribution

- Bug fixes.
- Grammar correction.
- Documentation improvements.
- Vulnerability fixes.

## License

MIT
