import {Route} from './route.js';
import {expect} from './chai.js';
import {HttpMethod} from './route.js';
import {HookType} from './hooks/index.js';
import {TrieRouter} from './trie-router.js';
import {HookRegistry} from './hooks/index.js';
import {DataSender} from './senders/index.js';
import {ErrorSender} from './senders/index.js';
import {createRequestMock} from './utils/index.js';
import {createResponseMock} from './utils/index.js';
import {RequestContext} from './request-context.js';

describe('TrieRouter', function () {
  describe('defineRoute', function () {
    it('returns the Route instance', function () {
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

  describe('requestListener', function () {
    it('should be a function', function () {
      const router = new TrieRouter();
      expect(typeof router.requestListener).to.be.eq('function');
    });

    it('passes request context to the route handler', function (done) {
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

    it('passes path parameters to the request context', function (done) {
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

    it('passes query parameters to the request context', function (done) {
      const router = new TrieRouter();
      router.defineRoute({
        method: HttpMethod.GET,
        path: '/',
        handler: ({query}) => {
          expect(query).to.be.eql({p1: 'foo', p2: 'bar'});
          done();
        },
      });
      const req = createRequestMock({path: '?p1=foo&p2=bar'});
      const res = createResponseMock();
      router.requestListener(req, res);
    });

    it('passes parsed cookie to the request context', function (done) {
      const router = new TrieRouter();
      router.defineRoute({
        method: HttpMethod.GET,
        path: '/',
        handler: ({cookie}) => {
          expect(cookie).to.be.eql({p1: 'foo', p2: 'bar'});
          done();
        },
      });
      const req = createRequestMock({headers: {cookie: 'p1=foo; p2=bar;'}});
      const res = createResponseMock();
      router.requestListener(req, res);
    });

    it('passes plain text body to the request context', function (done) {
      const router = new TrieRouter();
      const body = 'Lorem Ipsum is simply dummy text.';
      router.defineRoute({
        method: HttpMethod.POST,
        path: '/',
        handler: ctx => {
          expect(ctx.body).to.be.eq(body);
          done();
        },
      });
      const req = createRequestMock({method: HttpMethod.POST, body});
      const res = createResponseMock();
      router.requestListener(req, res);
    });

    it('passes parsed JSON body to the request context', function (done) {
      const router = new TrieRouter();
      const data = {p1: 'foo', p2: 'bar'};
      router.defineRoute({
        method: HttpMethod.POST,
        path: '/',
        handler: ({body}) => {
          expect(body).to.be.eql(data);
          done();
        },
      });
      const req = createRequestMock({method: HttpMethod.POST, body: data});
      const res = createResponseMock();
      router.requestListener(req, res);
    });

    it('passes headers to the request context', function (done) {
      const router = new TrieRouter();
      router.defineRoute({
        method: HttpMethod.GET,
        path: '/',
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

    it('uses DataSender to send the response', function (done) {
      const router = new TrieRouter();
      const resBody = 'Lorem Ipsum is simply dummy text.';
      router.defineRoute({
        method: HttpMethod.GET,
        path: '/',
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

    it('uses ErrorSender to send the response', function (done) {
      const router = new TrieRouter();
      const error = new Error();
      router.defineRoute({
        method: HttpMethod.GET,
        path: '/',
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

    describe('hooks', function () {
      it('invokes entire "preHandler" hooks before the route handler', async function () {
        const router = new TrieRouter();
        const order = [];
        const body = 'OK';
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
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

      it('invokes entire "preHandler" hooks after the route handler', async function () {
        const router = new TrieRouter();
        const order = [];
        const body = 'OK';
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
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

      it('passes the request context to the "preHandler" hooks', async function () {
        const router = new TrieRouter();
        const order = [];
        const body = 'OK';
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
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

      it('passes the request context and return value from the route handler to the "postHandler" hooks', async function () {
        const router = new TrieRouter();
        const order = [];
        const body = 'OK';
        let requestContext;
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
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

      it('invokes the route handler if entire "preHandler" hooks returns undefined or null', async function () {
        const router = new TrieRouter();
        const order = [];
        const body = 'OK';
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
          preHandler: [
            () => {
              order.push('preHandler1');
              return undefined;
            },
            () => {
              order.push('preHandler2');
              return null;
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

      it('sends a returns value from the route handler if entire "postHandler" hooks returns undefined or null', async function () {
        const router = new TrieRouter();
        const order = [];
        const body = 'OK';
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
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
              return null;
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

      it('sends a return value from the "preHandler" hook in the first priority', async function () {
        const router = new TrieRouter();
        const order = [];
        const preHandlerBody = 'foo';
        const handlerBody = 'bar';
        const postHandlerBody = 'baz';
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
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
        expect(result).to.be.eq(preHandlerBody);
        expect(result).not.to.be.eq(handlerBody);
        expect(result).not.to.be.eq(postHandlerBody);
        expect(order).to.be.eql(['preHandler']);
      });

      it('sends a return value from the "postHandler" hook in the second priority', async function () {
        const router = new TrieRouter();
        const order = [];
        const handlerBody = 'foo';
        const postHandlerBody = 'bar';
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
          preHandler() {
            order.push('preHandler');
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
        expect(result).not.to.be.eq(handlerBody);
        expect(result).to.be.eq(postHandlerBody);
        expect(order).to.be.eql(['preHandler', 'handler', 'postHandler']);
      });

      it('sends a return value from the root handler in the third priority', async function () {
        const router = new TrieRouter();
        const order = [];
        const body = 'OK';
        router.defineRoute({
          method: HttpMethod.GET,
          path: '/',
          preHandler() {
            order.push('preHandler');
          },
          handler: () => {
            order.push('handler');
            return body;
          },
          postHandler() {
            order.push('postHandler');
          },
        });
        const req = createRequestMock();
        const res = createResponseMock();
        router.requestListener(req, res);
        const result = await res.getBody();
        expect(result).to.be.eq(body);
        expect(order).to.be.eql(['preHandler', 'handler', 'postHandler']);
      });
    });
  });

  describe('_handleRequest', function () {
    it('should register the RequestContext in the request-scope ServiceContainer', function (done) {
      const router = new TrieRouter();
      router.defineRoute({
        method: HttpMethod.GET,
        path: '/',
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
  });

  describe('addHook', function () {
    it('adds the given hook to the HookRegistry and returns itself', function () {
      const router = new TrieRouter();
      const reg = router.getService(HookRegistry);
      const type = HookType.PRE_HANDLER;
      const hook = () => undefined;
      expect(reg.hasHook(type, hook)).to.be.false;
      const res = router.addHook(type, hook);
      expect(res).to.be.eq(router);
      expect(reg.hasHook(type, hook)).to.be.true;
    });
  });
});
