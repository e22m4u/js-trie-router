## @e22m4u/js-trie-router

A pure ES-module of the Node.js HTTP router that uses the
[Trie](https://en.wikipedia.org/wiki/Trie) for routing.

- Uses [path-to-regexp](https://github.com/pillarjs/path-to-regexp) syntax.
- Supports path parameters.
- Parses JSON-body automatically.
- Parses a query string and the Cookie header.
- Supports `preHandler` and `postHandler` hooks.
- Asynchronous request handler.

## Installation

```bash
npm install @e22m4u/js-trie-router
```

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

The first parameter of the `Router` handler is the `RequestContext` instance.

- `container: ServiceContainer`
- `req: IncomingMessage`
- `res: ServerResponse`
- `query: ParsedQuery`
- `headers: ParsedHeaders`
- `cookie: ParsedCookie`

The `RequestContext` can be destructured.

```js
router.defineRoute({
  // ...
  handler({req, res, query, headers, cookie}) {
    console.log(req);     // IncomingMessage
    console.log(res);     // ServerResponse
    console.log(query);   // {id: '10', ...}
    console.log(headers); // {'cookie': 'foo=bar', ...}
    console.log(cookie);  // {foo: 'bar', ...}
    // ...
  },
});
```

### Sending response

Return values of the `Route` handler will be sent as described below.

| type    | content-type             |
|---------|--------------------------|
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

If the `ServerResponse` has been sent manually, then the return
value will be ignored.

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

## Debug

Set environment variable `DEBUG=jsTrieRouter*` before start.

```bash
DEBUG=jsPathTrie* npm run test
```

## Testing

```bash
npm run test
```

## License

MIT
