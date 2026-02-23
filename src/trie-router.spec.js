import {expect} from 'chai';
import {ROOT_PATH} from './constants.js';
import {TrieRouter} from './trie-router.js';
import {Route, HttpMethod} from './route/index.js';
import {RequestContext} from './request-context.js';
import {ServerResponse, IncomingMessage} from 'http';
import {RouterBranch} from './branch/router-branch.js';
import {DataSender, ErrorSender} from './senders/index.js';
import {RouterHookRegistry, RouterHookType} from './hooks/index.js';
import {createRequestMock, createResponseMock} from './utils/index.js';

describe('TrieRouter', function () {
  describe('defineRoute', function () {
    it('should return an instance of Route', function () {
      const router = new TrieRouter();
      const path = '/path';
      const handler = () => 'ok';
      const res = router.defineRoute({method: HttpMethod.GET, path, handler});
      expect(res).to.be.instanceof(Route);
      expect(res.method).to.be.eq(HttpMethod.GET);
      expect(res.path).to.be.eq(path);
      expect(res.handler).to.be.eq(handler);
    });
  });

  describe('createBranch', function () {
    it('should return an instance of RouterBranch', function () {
      const router = new TrieRouter();
      const res = router.createBranch({path: ROOT_PATH});
      expect(res).to.be.instanceOf(RouterBranch);
    });

    it('should pass the option "path" to the router branch', function () {
      const router = new TrieRouter();
      const branchDef = {path: '/foo'};
      const res = router.createBranch(branchDef);
      expect(res.getDefinition().path).to.be.eq(branchDef.path);
    });
  });

  describe('requestListener', function () {
    it('should be a function', function () {
      const router = new TrieRouter();
      expect(typeof router.requestListener).to.be.eq('function');
    });

    it('should provide the request context to the route handler', function (done) {
      const router = new TrieRouter();
      router.defineRoute({
        method: HttpMethod.GET,
        path: '/test',
        handler: ctx => {
          expect(ctx).to.be.instanceof(RequestContext);
          done();
        },
      });
      const req = createRequestMock({path: '/test'});
      const res = createResponseMock();
      router.requestListener(req, res);
    });

    it('should provide path parameters to the request context', function (done) {
      const router = new TrieRouter();
      router.defineRoute({
        method: HttpMethod.GET,
        path: '/:p1-:p2',
        handler: ({params}) => {
          expect(params).to.be.eql({p1: 'foo', p2: 'bar'});
          done();
        },
      });
      const req = createRequestMock({path: '/foo-bar'});
      const res = createResponseMock();
      router.requestListener(req, res);
    });

    it('should provide query parameters to the request context', function (done) {
      const router = new TrieRouter();
      router.defineRoute({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: ({query}) => {
          expect(query).to.be.eql({p1: 'foo', p2: 'bar'});
          done();
        },
      });
      const req = createRequestMock({path: '?p1=foo&p2=bar'});
      const res = createResponseMock();
      router.requestListener(req, res);
    });

    it('should provide parsed cookies to the request context', function (done) {
      const router = new TrieRouter();
      router.defineRoute({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: ({cookies}) => {
          expect(cookies).to.be.eql({p1: 'foo', p2: 'bar'});
          done();
        },
      });
      const req = createRequestMock({headers: {cookie: 'p1=foo; p2=bar;'}});
      const res = createResponseMock();
      router.requestListener(req, res);
    });

    it('should provide the plain text body to the request context', function (done) {
      const router = new TrieRouter();
      const body = 'Lorem Ipsum is simply dummy text.';
      router.defineRoute({
        method: HttpMethod.POST,
        path: ROOT_PATH,
        handler: ctx => {
          expect(ctx.body).to.be.eq(body);
          done();
        },
      });
      const req = createRequestMock({method: HttpMethod.POST, body});
      const res = createResponseMock();
      router.requestListener(req, res);
    });

    it('should provide the parsed JSON body to the request context', function (done) {
      const router = new TrieRouter();
      const data = {p1: 'foo', p2: 'bar'};
      router.defineRoute({
        method: HttpMethod.POST,
        path: ROOT_PATH,
        handler: ({body}) => {
          expect(body).to.be.eql(data);
          done();
        },
      });
      const req = createRequestMock({method: HttpMethod.POST, body: data});
      const res = createResponseMock();
      router.requestListener(req, res);
    });

    it('should provide request headers to the request context', function (done) {
      const router = new TrieRouter();
      router.defineRoute({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: ({headers}) => {
          expect(headers).to.be.eql({
            host: 'localhost',
            foo: 'bar',
          });
          done();
        },
      });
      const req = createRequestMock({headers: {foo: 'bar'}});
      const res = createResponseMock();
      router.requestListener(req, res);
    });

    it('should provide the route to the request context', function (done) {
      const router = new TrieRouter();
      const metaData = {foo: {bar: {baz: 'qux'}}};
      const currentRoute = router.defineRoute({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        meta: metaData,
        handler: ({route}) => {
          expect(route).to.be.eq(currentRoute);
          done();
        },
      });
      const req = createRequestMock();
      const res = createResponseMock();
      router.requestListener(req, res);
    });

    it('should provide the route meta to the request context', function (done) {
      const router = new TrieRouter();
      const metaData = {role: 'admin'};
      router.defineRoute({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        meta: metaData,
        handler: ({meta}) => {
          expect(meta).to.eql(metaData);
          done();
        },
      });
      const req = createRequestMock();
      const res = createResponseMock();
      router.requestListener(req, res);
    });

    it('should register RequestContext in the request-scope ServiceContainer', function (done) {
      const router = new TrieRouter();
      router.defineRoute({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler(ctx) {
          const res = ctx.container.getRegistered(RequestContext);
          expect(res).to.be.eq(ctx);
          expect(res).to.be.not.eq(router.container);
          done();
        },
      });
      const req = createRequestMock();
      const res = createResponseMock();
      router.requestListener(req, res);
    });

    it('should register IncomingMessage in the request-scope ServiceContainer', function (done) {
      const router = new TrieRouter();
      const req = createRequestMock();
      const res = createResponseMock();
      router.defineRoute({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler(ctx) {
          const result = ctx.container.getRegistered(IncomingMessage);
          expect(result).to.be.eq(req);
          done();
        },
      });
      router.requestListener(req, res);
    });

    it('should register ServerResponse in the request-scope ServiceContainer', function (done) {
      const router = new TrieRouter();
      const req = createRequestMock();
      const res = createResponseMock();
      router.defineRoute({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler(ctx) {
          const result = ctx.container.getRegistered(ServerResponse);
          expect(result).to.be.eq(res);
          done();
        },
      });
      router.requestListener(req, res);
    });

    it('should use DataSender to send the server response', function (done) {
      const router = new TrieRouter();
      const resBody = 'Lorem Ipsum is simply dummy text.';
      router.defineRoute({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => resBody,
      });
      const req = createRequestMock();
      const res = createResponseMock();
      router.setService(DataSender, {
        send(response, data) {
          expect(response).to.be.eq(res);
          expect(data).to.be.eq(resBody);
          done();
        },
      });
      router.requestListener(req, res);
    });

    it('should use ErrorSender to send the server response', function (done) {
      const router = new TrieRouter();
      const error = new Error();
      router.defineRoute({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => {
          throw error;
        },
      });
      const req = createRequestMock();
      const res = createResponseMock();
      router.setService(ErrorSender, {
        send(request, response, err) {
          expect(request).to.be.eq(req);
          expect(response).to.be.eq(res);
          expect(err).to.be.eq(error);
          done();
        },
      });
      router.requestListener(req, res);
    });

    it('should send an error response for invalid JSON body instead of throwing', async function () {
      const router = new TrieRouter();
      router.defineRoute({
        method: HttpMethod.POST,
        path: ROOT_PATH,
        handler() {},
      });
      const req = createRequestMock({
        method: HttpMethod.POST,
        headers: {'content-type': 'application/json'},
        body: 'invalid',
      });
      const res = createResponseMock();
      router.requestListener(req, res);
      const body = await res.getBody();
      expect(res.statusCode).to.be.eq(400);
      expect(JSON.parse(body)).to.be.eql({
        error: {
          message: `Unexpected token 'i', "invalid" is not valid JSON`,
        },
      });
    });

    it('should execute global and route hooks in the exact correct order', async function () {
      const router = new TrieRouter();
      const order = [];
      router.addHook(RouterHookType.ON_REQUEST, () => {
        order.push('global:onRequest');
      });
      router.addHook(RouterHookType.PRE_HANDLER, () => {
        order.push('global:preHandler');
      });
      router.addHook(RouterHookType.POST_HANDLER, (ctx, data) => {
        order.push('global:postHandler');
        return data;
      });
      router.defineRoute({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: () => {
          order.push('route:preHandler');
        },
        handler: () => {
          order.push('handler');
          return 'OK';
        },
        postHandler: (ctx, data) => {
          order.push('route:postHandler');
          return data;
        },
      });
      const req = createRequestMock();
      const res = createResponseMock();
      await router.requestListener(req, res);
      expect(order).to.be.eql([
        'global:onRequest',
        'global:preHandler',
        'route:preHandler',
        'handler',
        'route:postHandler',
        'global:postHandler',
      ]);
    });

    describe('the "onRequest" hooks', function () {
      it('should invoke "onRequest" hooks even when no route is matched (404)', async function () {
        const router = new TrieRouter();
        let hookCalled = false;
        router.addHook(RouterHookType.ON_REQUEST, () => {
          hookCalled = true;
        });
        const req = createRequestMock({path: '/does-not-exist'});
        const res = createResponseMock();
        await router.requestListener(req, res);
        expect(hookCalled).to.be.true;
        expect(res.statusCode).to.be.eq(404);
      });

      it('should interrupt request handling when the hook "onRequest" returns true', async function () {
        const router = new TrieRouter();
        let handlerCalled = false;
        router.addHook(RouterHookType.ON_REQUEST, () => true);
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          handler: () => {
            handlerCalled = true;
            return 'OK';
          },
        });
        const req = createRequestMock({path: ROOT_PATH});
        const res = createResponseMock();
        await router.requestListener(req, res);
        expect(handlerCalled).to.be.false;
        expect(res.headersSent).to.be.false;
      });

      it('should interrupt request handling when the hook "onRequest" sends response headers', async function () {
        const router = new TrieRouter();
        let handlerCalled = false;
        router.addHook(RouterHookType.ON_REQUEST, (req, res) => {
          res.statusCode = 403;
          res.end('Forbidden by onRequest');
        });
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          handler: () => {
            handlerCalled = true;
            return 'OK';
          },
        });
        const req = createRequestMock({path: ROOT_PATH});
        const res = createResponseMock();
        await router.requestListener(req, res);
        const body = await res.getBody();
        expect(handlerCalled).to.be.false;
        expect(res.statusCode).to.be.eq(403);
        expect(body).to.be.eq('Forbidden by onRequest');
      });

      it('should catch synchronous errors from "onRequest" hooks and use ErrorSender', async function () {
        const router = new TrieRouter();
        router.addHook(RouterHookType.ON_REQUEST, () => {
          throw new Error('Sync error in onRequest');
        });
        const req = createRequestMock();
        const res = createResponseMock();
        await router.requestListener(req, res);
        const body = await res.getBody();
        expect(res.statusCode).to.be.eq(500);
        expect(JSON.parse(body)).to.be.eql({
          error: {message: 'Sync error in onRequest'},
        });
      });

      it('should catch asynchronous (rejected Promise) errors from "onRequest" hooks', async function () {
        const router = new TrieRouter();
        router.addHook(RouterHookType.ON_REQUEST, async () => {
          throw new Error('Async error in onRequest');
        });
        const req = createRequestMock();
        const res = createResponseMock();
        await router.requestListener(req, res);
        const body = await res.getBody();
        expect(res.statusCode).to.be.eq(500);
        expect(JSON.parse(body)).to.be.eql({
          error: {message: 'Async error in onRequest'},
        });
      });
    });

    describe('the route-scoped "preHandler" hooks', function () {
      it('should invoke "preHandler" hooks before the route handler', async function () {
        const router = new TrieRouter();
        const order = [];
        const body = 'OK';
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler: [
            () => {
              order.push('preHandler1');
            },
            () => {
              order.push('preHandler2');
            },
          ],
          handler: () => {
            order.push('handler');
            return body;
          },
        });
        const req = createRequestMock();
        const res = createResponseMock();
        router.requestListener(req, res);
        const result = await res.getBody();
        expect(result).to.be.eq(body);
        expect(order).to.be.eql(['preHandler1', 'preHandler2', 'handler']);
      });

      it('should provide the request context to "preHandler" hooks', async function () {
        const router = new TrieRouter();
        const order = [];
        const body = 'OK';
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler: [
            ctx => {
              order.push('preHandler1');
              expect(ctx).to.be.instanceof(RequestContext);
            },
            ctx => {
              order.push('preHandler2');
              expect(ctx).to.be.instanceof(RequestContext);
            },
          ],
          handler: ctx => {
            order.push('handler');
            expect(ctx).to.be.instanceof(RequestContext);
            return body;
          },
        });
        const req = createRequestMock();
        const res = createResponseMock();
        router.requestListener(req, res);
        const result = await res.getBody();
        expect(result).to.be.eq(body);
        expect(order).to.be.eql(['preHandler1', 'preHandler2', 'handler']);
      });

      it('should invoke the route handler when all "preHandler" hooks return undefined', async function () {
        const router = new TrieRouter();
        const order = [];
        const body = 'OK';
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler: [
            () => {
              order.push('preHandler1');
              return undefined;
            },
            () => {
              order.push('preHandler2');
              return undefined;
            },
          ],
          handler: () => {
            order.push('handler');
            return body;
          },
        });
        const req = createRequestMock();
        const res = createResponseMock();
        router.requestListener(req, res);
        const result = await res.getBody();
        expect(result).to.be.eq(body);
        expect(order).to.be.eql(['preHandler1', 'preHandler2', 'handler']);
      });

      it('should prioritize a return value from the hook "preHandler" over the route handler', async function () {
        const router = new TrieRouter();
        const order = [];
        const preHandlerBody = 'foo';
        const handlerBody = 'bar';
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler() {
            order.push('preHandler');
            return preHandlerBody;
          },
          handler: () => {
            order.push('handler');
            return handlerBody;
          },
        });
        const req = createRequestMock();
        const res = createResponseMock();
        router.requestListener(req, res);
        const result = await res.getBody();
        expect(result).to.be.eq(preHandlerBody);
        expect(result).to.be.not.eq(handlerBody);
        expect(order).to.be.eql(['preHandler']);
      });

      it('should skip the route handler when the hook "preHandler" returns a non-undefined value', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler() {
            return 'Response from preHandler';
          },
          handler() {
            throw new Error('Should not be called!');
          },
        });
        const req = createRequestMock({
          method: HttpMethod.GET,
          path: ROOT_PATH,
        });
        const res = createResponseMock();
        await router.requestListener(req, res);
        const responseBody = await res.getBody();
        expect(responseBody).to.equal('Response from preHandler');
      });

      it('should skip the route handler when the hook "preHandler" resolves to a non-undefined value', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler() {
            return Promise.resolve('Response from preHandler');
          },
          handler() {
            throw new Error('Should not be called!');
          },
        });
        const req = createRequestMock({
          method: HttpMethod.GET,
          path: ROOT_PATH,
        });
        const res = createResponseMock();
        await router.requestListener(req, res);
        const responseBody = await res.getBody();
        expect(responseBody).to.equal('Response from preHandler');
      });

      it('should skip the route handler when the hook "preHandler" sends the response manually', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler(ctx) {
            ctx.response.setHeader('Content-Type', 'text/plain');
            ctx.response.end('Response from preHandler');
          },
          handler() {
            throw new Error('Should not be called!');
          },
        });
        const req = createRequestMock({
          method: HttpMethod.GET,
          path: ROOT_PATH,
        });
        const res = createResponseMock();
        await router.requestListener(req, res);
        const responseBody = await res.getBody();
        expect(responseBody).to.equal('Response from preHandler');
      });

      it('should skip the route handler when the hook "preHandler" sends the response manually within a Promise', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler(ctx) {
            return new Promise(resolve => {
              setTimeout(() => {
                ctx.response.setHeader('Content-Type', 'text/plain');
                ctx.response.end('Response from preHandler');
                resolve(undefined);
              }, 10);
            });
          },
          handler() {
            throw new Error('Should not be called!');
          },
        });
        const req = createRequestMock({
          method: HttpMethod.GET,
          path: ROOT_PATH,
        });
        const res = createResponseMock();
        await router.requestListener(req, res);
        const responseBody = await res.getBody();
        expect(responseBody).to.equal('Response from preHandler');
      });

      it('should catch synchronous errors from "preHandler" hooks and use ErrorSender', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler: () => {
            throw new Error('Sync error in preHandler');
          },
          handler: () => 'OK',
        });
        const req = createRequestMock();
        const res = createResponseMock();
        await router.requestListener(req, res);
        const body = await res.getBody();
        expect(res.statusCode).to.be.eq(500);
        expect(JSON.parse(body)).to.be.eql({
          error: {message: 'Sync error in preHandler'},
        });
      });

      it('should catch asynchronous errors from "preHandler" hooks and use ErrorSender', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler: async () => {
            throw new Error('Async error in preHandler');
          },
          handler: () => 'OK',
        });
        const req = createRequestMock();
        const res = createResponseMock();
        await router.requestListener(req, res);
        const body = await res.getBody();
        expect(res.statusCode).to.be.eq(500);
        expect(JSON.parse(body)).to.be.eql({
          error: {message: 'Async error in preHandler'},
        });
      });
    });

    describe('the route-scoped "postHandler" hooks', function () {
      it('should invoke "postHandler" hooks after the route handler', async function () {
        const router = new TrieRouter();
        const order = [];
        const body = 'OK';
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          handler: () => {
            order.push('handler');
            return body;
          },
          postHandler: [
            () => {
              order.push('postHandler1');
            },
            () => {
              order.push('postHandler2');
            },
          ],
        });
        const req = createRequestMock();
        const res = createResponseMock();
        router.requestListener(req, res);
        const result = await res.getBody();
        expect(result).to.be.eq(body);
        expect(order).to.be.eql(['handler', 'postHandler1', 'postHandler2']);
      });

      it('should provide the request context and a return value from the route handler to "postHandler" hooks', async function () {
        const router = new TrieRouter();
        const order = [];
        const body = 'OK';
        let requestContext;
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          handler: ctx => {
            order.push('handler');
            expect(ctx).to.be.instanceof(RequestContext);
            requestContext = ctx;
            return body;
          },
          postHandler: [
            (ctx, data) => {
              order.push('postHandler1');
              expect(ctx).to.be.eq(requestContext);
              expect(data).to.be.eq(body);
            },
            (ctx, data) => {
              order.push('postHandler2');
              expect(ctx).to.be.eq(requestContext);
              expect(data).to.be.eq(body);
            },
          ],
        });
        const req = createRequestMock();
        const res = createResponseMock();
        router.requestListener(req, res);
        const result = await res.getBody();
        expect(result).to.be.eq(body);
        expect(order).to.be.eql(['handler', 'postHandler1', 'postHandler2']);
      });

      it('should send a return value form the route handler when all "postHandler" hooks return undefined', async function () {
        const router = new TrieRouter();
        const order = [];
        const body = 'OK';
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          handler: () => {
            order.push('handler');
            return body;
          },
          postHandler: [
            () => {
              order.push('postHandler1');
              return undefined;
            },
            () => {
              order.push('postHandler2');
              return undefined;
            },
          ],
        });
        const req = createRequestMock();
        const res = createResponseMock();
        router.requestListener(req, res);
        const result = await res.getBody();
        expect(result).to.be.eq(body);
        expect(order).to.be.eql(['handler', 'postHandler1', 'postHandler2']);
      });

      it('should prioritize a return value from the hook "postHandler" over the route handler', async function () {
        const router = new TrieRouter();
        const order = [];
        const handlerBody = 'foo';
        const postHandlerBody = 'bar';
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          handler: () => {
            order.push('handler');
            return handlerBody;
          },
          postHandler() {
            order.push('postHandler');
            return postHandlerBody;
          },
        });
        const req = createRequestMock();
        const res = createResponseMock();
        router.requestListener(req, res);
        const result = await res.getBody();
        expect(result).to.be.not.eq(handlerBody);
        expect(result).to.be.eq(postHandlerBody);
        expect(order).to.be.eql(['handler', 'postHandler']);
      });

      it('should prioritize a return value from the "postHandler" hook over the "preHandler" hook', async function () {
        const router = new TrieRouter();
        const order = [];
        const preHandlerBody = 'foo';
        const handlerBody = 'bar';
        const postHandlerBody = 'baz';
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler() {
            order.push('preHandler');
            return preHandlerBody;
          },
          handler: () => {
            order.push('handler');
            return handlerBody;
          },
          postHandler() {
            order.push('postHandler');
            return postHandlerBody;
          },
        });
        const req = createRequestMock();
        const res = createResponseMock();
        router.requestListener(req, res);
        const result = await res.getBody();
        expect(result).to.be.not.eq(handlerBody);
        expect(result).to.be.eq(postHandlerBody);
        expect(order).to.be.eql(['preHandler', 'postHandler']);
      });

      it('should skip "postHandler" hooks when the hook "preHandler" sends the response manually', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler(ctx) {
            ctx.response.setHeader('Content-Type', 'text/plain');
            ctx.response.end('Response from preHandler');
          },
          handler() {
            throw new Error('Should not be called!');
          },
          postHandler() {
            throw new Error('Should not be called!');
          },
        });
        const req = createRequestMock({
          method: HttpMethod.GET,
          path: ROOT_PATH,
        });
        const res = createResponseMock();
        await router.requestListener(req, res);
        const responseBody = await res.getBody();
        expect(responseBody).to.equal('Response from preHandler');
      });

      it('should skip "postHandler" hooks when the hook "preHandler" sends the response manually within a Promise', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler(ctx) {
            return new Promise(resolve => {
              setTimeout(() => {
                ctx.response.setHeader('Content-Type', 'text/plain');
                ctx.response.end('Response from preHandler');
                resolve(undefined);
              }, 10);
            });
          },
          handler() {
            throw new Error('Should not be called!');
          },
          postHandler() {
            throw new Error('Should not be called!');
          },
        });
        const req = createRequestMock({
          method: HttpMethod.GET,
          path: ROOT_PATH,
        });
        const res = createResponseMock();
        await router.requestListener(req, res);
        const responseBody = await res.getBody();
        expect(responseBody).to.equal('Response from preHandler');
      });

      it('should pass a value from the route handler to the "postHandler" hook', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          handler() {
            return 'Hello World!';
          },
          postHandler(ctx, data) {
            expect(data).to.be.eql('Hello World!');
            return data.toUpperCase();
          },
        });
        const req = createRequestMock({
          method: HttpMethod.GET,
          path: ROOT_PATH,
        });
        const res = createResponseMock();
        await router.requestListener(req, res);
        const responseBody = await res.getBody();
        expect(responseBody).to.equal('HELLO WORLD!');
      });

      it('should pass a value from the "preHandler" hook to the "postHandler" hook', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler() {
            return 'Hello World!';
          },
          handler() {
            throw new Error('Should not be called!');
          },
          postHandler(ctx, data) {
            expect(data).to.be.eql('Hello World!');
            return data.toUpperCase();
          },
        });
        const req = createRequestMock({
          method: HttpMethod.GET,
          path: ROOT_PATH,
        });
        const res = createResponseMock();
        await router.requestListener(req, res);
        const responseBody = await res.getBody();
        expect(responseBody).to.equal('HELLO WORLD!');
      });

      it('should transform a value from the route handler by "postHandler" hooks', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          handler() {
            return 'a';
          },
          postHandler: [(ctx, data) => data + 'b', (ctx, data) => data + 'c'],
        });
        const req = createRequestMock({
          method: HttpMethod.GET,
          path: ROOT_PATH,
        });
        const res = createResponseMock();
        await router.requestListener(req, res);
        const responseBody = await res.getBody();
        expect(responseBody).to.equal('abc');
      });

      it('should transform a value from the "preHandler" hook by "postHandler" hooks', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler() {
            return 'a';
          },
          handler() {
            throw new Error('Should not be called!');
          },
          postHandler: [(ctx, data) => data + 'b', (ctx, data) => data + 'c'],
        });
        const req = createRequestMock({
          method: HttpMethod.GET,
          path: ROOT_PATH,
        });
        const res = createResponseMock();
        await router.requestListener(req, res);
        const responseBody = await res.getBody();
        expect(responseBody).to.equal('abc');
      });

      it('should catch synchronous errors from "postHandler" hooks and use ErrorSender', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          handler: () => 'OK',
          postHandler: () => {
            throw new Error('Sync error in postHandler');
          },
        });
        const req = createRequestMock();
        const res = createResponseMock();
        await router.requestListener(req, res);
        const body = await res.getBody();
        expect(res.statusCode).to.be.eq(500);
        expect(JSON.parse(body)).to.be.eql({
          error: {message: 'Sync error in postHandler'},
        });
      });

      it('should catch asynchronous errors from "postHandler" hooks and use ErrorSender', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          handler: () => 'OK',
          postHandler: async () => {
            throw new Error('Async error in postHandler');
          },
        });
        const req = createRequestMock();
        const res = createResponseMock();
        await router.requestListener(req, res);
        const body = await res.getBody();
        expect(res.statusCode).to.be.eq(500);
        expect(JSON.parse(body)).to.be.eql({
          error: {message: 'Async error in postHandler'},
        });
      });
    });

    describe('OPTIONS method handling', function () {
      it('should automatically return 204 with specific headers for an unhandled OPTIONS request', async function () {
        const router = new TrieRouter();
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/api/resource',
          handler: () => 'OK',
        });
        router.defineRoute({
          method: HttpMethod.POST,
          path: '/api/resource',
          handler: () => 'OK',
        });
        const req = createRequestMock({
          method: 'OPTIONS',
          path: '/api/resource',
        });
        const res = createResponseMock();
        await router.requestListener(req, res);
        expect(res.statusCode).to.be.eq(204);
        expect(res.getHeader('Allow')).to.be.eq('GET, POST, OPTIONS');
      });

      it('should execute a custom OPTIONS handler when it is explicitly defined', async function () {
        const router = new TrieRouter();
        let customOptionsCalled = false;
        router.defineRoute({
          method: HttpMethod.OPTIONS,
          path: '/api/resource',
          handler: () => {
            customOptionsCalled = true;
            return 'Custom OPTIONS response';
          },
        });
        const req = createRequestMock({
          method: HttpMethod.OPTIONS,
          path: '/api/resource',
        });
        const res = createResponseMock();
        await router.requestListener(req, res);
        const body = await res.getBody();
        expect(customOptionsCalled).to.be.true;
        expect(res.statusCode).to.be.eq(200);
        expect(body).to.be.eq('Custom OPTIONS response');
      });

      it('should return 404 for an OPTIONS request if the path does not exist for any method', async function () {
        const router = new TrieRouter();
        const req = createRequestMock({
          method: HttpMethod.OPTIONS,
          path: '/unknown',
        });
        const res = createResponseMock();
        await router.requestListener(req, res);
        expect(res.statusCode).to.be.eq(404);
      });
    });
  });

  describe('addHook', function () {
    it('should register the provided hook', function () {
      const router = new TrieRouter();
      const reg = router.getService(RouterHookRegistry);
      const hook = () => undefined;
      const type = RouterHookType.PRE_HANDLER;
      expect(reg.hasHook(type, hook)).to.be.false;
      const res = router.addHook(type, hook);
      expect(res).to.be.eq(router);
      expect(reg.hasHook(type, hook)).to.be.true;
    });
  });

  describe('hasHook', function () {
    it('should return true if the provided hook is registered', function () {
      const router = new TrieRouter();
      const hook = () => undefined;
      const type = RouterHookType.PRE_HANDLER;
      expect(router.hasHook(type, hook)).to.be.false;
      router.addHook(type, hook);
      expect(router.hasHook(type, hook)).to.be.true;
    });
  });
});
