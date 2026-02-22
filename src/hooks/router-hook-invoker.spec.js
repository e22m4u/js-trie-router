import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {ROOT_PATH} from '../constants.js';
import {Route, HttpMethod} from '../route/index.js';
import {createRequestMock, createResponseMock} from '../utils/index.js';
import {RouterHookInvoker} from './router-hook-invoker.js';
import {RouterHookRegistry, RouterHookType} from './router-hook-registry.js';
import {RequestContext} from '../request-context.js';

describe('RouterHookInvoker', function () {
  describe('invokePreHandlerHooks', function () {
    it('should require the parameter "context" to be an instance of RequestContext', function () {
      const S = new RouterHookInvoker();
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => 'OK',
      });
      const req = createRequestMock();
      const res = createResponseMock();
      const throwable = v => () => S.invokePreHandlerHooks(v);
      const error = v =>
        format(
          'Parameter "context" must be an instance of RequestContext, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      throwable(new RequestContext(S.container, req, res, route))();
    });

    it('should skip hooks invocation and return ServerResponse when response headers has been sent', function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      res._headersSent = true;
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook2');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: [
          () => {
            order.push('routeHook1');
          },
          () => {
            order.push('routeHook2');
          },
        ],
        handler: () => undefined,
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const result = S.invokePreHandlerHooks(ctx);
      expect(result).to.be.eq(ctx.response);
      expect(order).to.be.empty;
    });

    it('should prioritize global hooks over route hooks', function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook2');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: [
          () => {
            order.push('routeHook1');
          },
          () => {
            order.push('routeHook2');
          },
        ],
        handler: () => undefined,
      });
      const ctx = new RequestContext(S.container, req, res, route);
      S.invokePreHandlerHooks(ctx);
      expect(order).to.be.eql([
        'globalHook1',
        'globalHook2',
        'routeHook1',
        'routeHook2',
      ]);
    });

    it('should stop global hooks invocation if any of them returns a non-undefined value', function () {
      const responseDataList = ['str', '', 10, 0, true, false, null];
      responseDataList.forEach(responseData => {
        const S = new RouterHookInvoker();
        const req = createRequestMock();
        const res = createResponseMock();
        const order = [];
        S.getService(RouterHookRegistry).addHook(
          RouterHookType.PRE_HANDLER,
          () => {
            order.push('globalHook1');
          },
        );
        S.getService(RouterHookRegistry).addHook(
          RouterHookType.PRE_HANDLER,
          () => {
            order.push('globalHook2');
            return responseData;
          },
        );
        S.getService(RouterHookRegistry).addHook(
          RouterHookType.PRE_HANDLER,
          () => {
            throw new Error('Should not be called!');
          },
        );
        const route = new Route({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler: [
            () => {
              throw new Error('Should not be called!');
            },
            () => {
              throw new Error('Should not be called!');
            },
          ],
          handler: () => undefined,
        });
        const ctx = new RequestContext(S.container, req, res, route);
        const result = S.invokePreHandlerHooks(ctx);
        expect(result).to.be.eq(responseData);
        expect(order).to.be.eql(['globalHook1', 'globalHook2']);
      });
    });

    it('should stop global hooks invocation if any of them resolves a non-undefined value', async function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const order = [];
      const responseData = 'OK';
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        async () => {
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        async () => {
          order.push('globalHook2');
          return responseData;
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          throw new Error('Should not be called!');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: [
          () => {
            throw new Error('Should not be called!');
          },
        ],
        handler: () => undefined,
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const promise = S.invokePreHandlerHooks(ctx);
      expect(promise).to.be.instanceof(Promise);
      const result = await promise;
      expect(result).to.be.eq(responseData);
      expect(order).to.be.eql(['globalHook1', 'globalHook2']);
    });

    it('should stop global hooks invocation and return ServerResponse if a hook sends response headers', async function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        async () => {
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        async ctx => {
          order.push('globalHook2');
          ctx.response._headersSent = true;
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        async () => {
          throw new Error('Should not be called!');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: [
          async () => {
            throw new Error('Should not be called!');
          },
        ],
        handler: () => undefined,
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const promise = S.invokePreHandlerHooks(ctx);
      expect(promise).to.be.instanceof(Promise);
      const result = await promise;
      expect(result).to.be.eq(res);
      expect(order).to.be.eql(['globalHook1', 'globalHook2']);
    });

    it('should stop route hooks invocation if any of them returns a non-undefined value', function () {
      const responseDataList = ['str', '', 10, 0, true, false, null];
      responseDataList.forEach(responseData => {
        const S = new RouterHookInvoker();
        const req = createRequestMock();
        const res = createResponseMock();
        const order = [];
        S.getService(RouterHookRegistry).addHook(
          RouterHookType.PRE_HANDLER,
          () => {
            order.push('globalHook1');
          },
        );
        S.getService(RouterHookRegistry).addHook(
          RouterHookType.PRE_HANDLER,
          () => {
            order.push('globalHook2');
          },
        );
        const route = new Route({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          preHandler: [
            () => {
              order.push('routeHook1');
            },
            () => {
              order.push('routeHook2');
              return responseData;
            },
            () => {
              throw new Error('Should not be called!');
            },
          ],
          handler: () => undefined,
        });
        const ctx = new RequestContext(S.container, req, res, route);
        const result = S.invokePreHandlerHooks(ctx);
        expect(result).to.be.eq(responseData);
        expect(order).to.be.eql([
          'globalHook1',
          'globalHook2',
          'routeHook1',
          'routeHook2',
        ]);
      });
    });

    it('should stop route hooks invocation if any of them resolves a non-undefined value', async function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const order = [];
      const responseData = 'OK';
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        async () => {
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        async () => {
          order.push('globalHook2');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: [
          async () => {
            order.push('routeHook1');
          },
          async () => {
            order.push('routeHook2');
            return responseData;
          },
          async () => {
            throw new Error('Should not be called!');
          },
        ],
        handler: () => undefined,
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const promise = S.invokePreHandlerHooks(ctx);
      expect(promise).to.be.instanceof(Promise);
      const result = await promise;
      expect(result).to.be.eq(responseData);
      expect(order).to.be.eql([
        'globalHook1',
        'globalHook2',
        'routeHook1',
        'routeHook2',
      ]);
    });

    it('should stop route hooks invocation and return ServerResponse if a hook sends response headers', async function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        async () => {
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        async () => {
          order.push('globalHook2');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: [
          async () => {
            order.push('routeHook1');
          },
          async ctx => {
            order.push('routeHook2');
            ctx.response._headersSent = true;
          },
          async () => {
            throw new Error('Should not be called!');
          },
        ],
        handler: () => undefined,
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const promise = S.invokePreHandlerHooks(ctx);
      expect(promise).to.be.instanceof(Promise);
      const result = await promise;
      expect(result).to.be.eq(res);
      expect(order).to.be.eql([
        'globalHook1',
        'globalHook2',
        'routeHook1',
        'routeHook2',
      ]);
    });

    it('should skip hooks invocation and return ServerResponse when response headers has been sent by the global hook', function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook2');
          res._headersSent = true;
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook3');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: [
          () => {
            order.push('routeHook1');
          },
          () => {
            order.push('routeHook2');
          },
        ],
        handler: () => undefined,
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const result = S.invokePreHandlerHooks(ctx);
      expect(result).to.be.eq(res);
      expect(order).to.be.eql(['globalHook1', 'globalHook2']);
    });

    it('should skip route hooks invocation and return ServerResponse when response headers are send by the route hook', function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook2');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: [
          () => {
            order.push('routeHook1');
          },
          () => {
            order.push('routeHook2');
            res._headersSent = true;
          },
          () => {
            order.push('routeHook3');
          },
        ],
        handler: () => undefined,
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const result = S.invokePreHandlerHooks(ctx);
      expect(result).to.be.eq(res);
      expect(order).to.be.eql([
        'globalHook1',
        'globalHook2',
        'routeHook1',
        'routeHook2',
      ]);
    });

    it('should return a Promise when some of global hooks returns a Promise', async function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        async () => {
          order.push('globalHook2');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook3');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: [
          () => {
            order.push('routeHook1');
          },
          () => {
            order.push('routeHook2');
          },
        ],
        handler: () => undefined,
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const promise = S.invokePreHandlerHooks(ctx);
      expect(promise).to.be.instanceof(Promise);
      await expect(promise).to.eventually.be.undefined;
      expect(order).to.be.eql([
        'globalHook1',
        'globalHook2',
        'globalHook3',
        'routeHook1',
        'routeHook2',
      ]);
    });

    it('should return a Promise when all global hooks return a Promise', async function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        async () => {
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        async () => {
          order.push('globalHook2');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: [
          () => {
            order.push('routeHook1');
          },
          () => {
            order.push('routeHook2');
          },
        ],
        handler: () => undefined,
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const promise = S.invokePreHandlerHooks(ctx);
      expect(promise).to.be.instanceof(Promise);
      await expect(promise).to.eventually.be.undefined;
      expect(order).to.be.eql([
        'globalHook1',
        'globalHook2',
        'routeHook1',
        'routeHook2',
      ]);
    });

    it('should return a Promise when some of route hooks returns a Promise', async function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook2');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: [
          () => {
            order.push('routeHook1');
          },
          async () => {
            order.push('routeHook2');
          },
          () => {
            order.push('routeHook3');
          },
        ],
        handler: () => undefined,
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const promise = S.invokePreHandlerHooks(ctx);
      expect(promise).to.be.instanceof(Promise);
      await expect(promise).to.eventually.be.undefined;
      expect(order).to.be.eql([
        'globalHook1',
        'globalHook2',
        'routeHook1',
        'routeHook2',
        'routeHook3',
      ]);
    });

    it('should return a Promise when all route hooks return a Promise', async function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          order.push('globalHook2');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: [
          async () => {
            order.push('routeHook1');
          },
          async () => {
            order.push('routeHook2');
          },
        ],
        handler: () => undefined,
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const promise = S.invokePreHandlerHooks(ctx);
      expect(promise).to.be.instanceof(Promise);
      await expect(promise).to.eventually.be.undefined;
      expect(order).to.be.eql([
        'globalHook1',
        'globalHook2',
        'routeHook1',
        'routeHook2',
      ]);
    });
  });

  describe('invokePostHandlerHooks', function () {
    it('should require the parameter "context" to be an instance of RequestContext', function () {
      const S = new RouterHookInvoker();
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => 'OK',
      });
      const req = createRequestMock();
      const res = createResponseMock();
      const throwable = v => () => S.invokePostHandlerHooks(v);
      const error = v =>
        format(
          'Parameter "context" must be an instance of RequestContext, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('str')).to.throw(error('"str"'));
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      throwable(new RequestContext(S.container, req, res, route))();
    });

    it('should skip invocation and return ServerResponse when response headers has been sent', function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      res._headersSent = true;
      const initialData = 'OK';
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        () => {
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        () => {
          order.push('globalHook2');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => initialData,
        postHandler: [
          () => {
            order.push('routeHook1');
          },
          () => {
            order.push('routeHook2');
          },
        ],
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const result = S.invokePostHandlerHooks(ctx);
      expect(result).to.be.eq(ctx.response);
      expect(order).to.be.empty;
    });

    it('should prioritize route hooks over global hooks', function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const initialData = 'OK';
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        () => {
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        () => {
          order.push('globalHook2');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => initialData,
        postHandler: [
          () => {
            order.push('routeHook1');
          },
          () => {
            order.push('routeHook2');
          },
        ],
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const result = S.invokePostHandlerHooks(ctx, initialData);
      expect(result).to.be.eq(initialData);
      expect(order).to.be.eql([
        'routeHook1',
        'routeHook2',
        'globalHook1',
        'globalHook2',
      ]);
    });

    it('should pass RequestContext and the initial data to hook arguments', function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const order = [];
      const initialData = 'OK';
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        (ctx, data) => {
          expect(ctx).to.be.instanceOf(RequestContext);
          expect(data).to.be.eq(initialData);
          order.push('globalHook1');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        (ctx, data) => {
          expect(ctx).to.be.instanceOf(RequestContext);
          expect(data).to.be.eq(initialData);
          order.push('globalHook2');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => initialData,
        postHandler: [
          (ctx, data) => {
            expect(ctx).to.be.instanceOf(RequestContext);
            expect(data).to.be.eq(initialData);
            order.push('routeHook1');
          },
          (ctx, data) => {
            expect(ctx).to.be.instanceOf(RequestContext);
            expect(data).to.be.eq(initialData);
            order.push('routeHook2');
          },
        ],
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const result = S.invokePostHandlerHooks(ctx, initialData);
      expect(result).to.be.eql(initialData);
      expect(order).to.be.eql([
        'routeHook1',
        'routeHook2',
        'globalHook1',
        'globalHook2',
      ]);
    });

    it('should keep the current data if a route hook returns undefined', function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const initialData = {key: 'value'};
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => initialData,
        postHandler: [
          () => undefined,
          (ctx, data) => ({...data, modified: true}),
        ],
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const result = S.invokePostHandlerHooks(ctx, initialData);
      expect(result).to.be.eql({key: 'value', modified: true});
    });

    it('should keep the current data if a global hook returns undefined', function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const initialData = {key: 'value'};
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        () => undefined,
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        (ctx, data) => ({...data, modified: true}),
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => initialData,
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const result = S.invokePostHandlerHooks(ctx, initialData);
      expect(result).to.be.eql({key: 'value', modified: true});
    });

    it('should overwrite the current data with null if a route hook returns null', function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const initialData = 'Sensitive Data';
      const order = [];
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => initialData,
        postHandler: [
          () => {
            order.push('routeHook1');
            return null;
          },
          (ctx, data) => {
            order.push('routeHook2');
            expect(data).to.be.null;
            return data;
          },
        ],
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const result = S.invokePostHandlerHooks(ctx, initialData);
      expect(result).to.be.null;
      expect(order).to.be.eql(['routeHook1', 'routeHook2']);
    });

    it('should overwrite the current data with null if a global hook returns null', function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const initialData = 'Sensitive Data';
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        () => {
          order.push('globalHook1');
          return null;
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        (ctx, data) => {
          order.push('globalHook2');
          expect(data).to.be.null;
          return data;
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => initialData,
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const result = S.invokePostHandlerHooks(ctx, initialData);
      expect(result).to.be.null;
      expect(order).to.be.eql(['globalHook1', 'globalHook2']);
    });

    it('should transform the initial data with route hooks and global hooks', function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const initialData = 'a';
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        (ctx, data) => data + 'd',
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        (ctx, data) => data + 'e',
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => initialData,
        postHandler: [(ctx, data) => data + 'b', (ctx, data) => data + 'c'],
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const result = S.invokePostHandlerHooks(ctx, initialData);
      expect(result).to.be.eq('abcde');
    });

    it('should transform the initial data with asynchronous hooks', async function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const initialData = 'a';
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        (ctx, data) => Promise.resolve(data + 'd'),
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        (ctx, data) => Promise.resolve(data + 'e'),
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => initialData,
        postHandler: [
          (ctx, data) => Promise.resolve(data + 'b'),
          (ctx, data) => Promise.resolve(data + 'c'),
        ],
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const result = await S.invokePostHandlerHooks(ctx, initialData);
      expect(result).to.be.eq('abcde');
    });

    it('should stop invocation and return ServerResponse when the route hook sends response manually', function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const initialData = 'OK';
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        () => {
          throw new Error('Should not be called!');
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        () => {
          throw new Error('Should not be called!');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => initialData,
        postHandler: [
          () => {
            order.push('routeHook1');
          },
          (ctx, data) => {
            order.push('routeHook2');
            ctx.response.statusCode = 200;
            ctx.response.setHeader('Content-Type', 'text/plain');
            ctx.response.end(data);
          },
          () => {
            throw new Error('Should not be called!');
          },
        ],
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const result = S.invokePostHandlerHooks(ctx, initialData);
      expect(result).to.be.eq(ctx.response);
      expect(order).to.be.eql(['routeHook1', 'routeHook2']);
    });

    it('should stop invocation and return ServerResponse when the global hook sends response manually', function () {
      const S = new RouterHookInvoker();
      const req = createRequestMock();
      const res = createResponseMock();
      const initialData = 'OK';
      const order = [];
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        (ctx, data) => {
          order.push('globalHook1');
          ctx.response.statusCode = 200;
          ctx.response.setHeader('Content-Type', 'text/plain');
          ctx.response.end(data);
        },
      );
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.POST_HANDLER,
        () => {
          throw new Error('Should not be called!');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => initialData,
        postHandler: [
          () => {
            order.push('routeHook1');
          },
          () => {
            order.push('routeHook2');
          },
        ],
      });
      const ctx = new RequestContext(S.container, req, res, route);
      const result = S.invokePostHandlerHooks(ctx, initialData);
      expect(result).to.be.eq(ctx.response);
      expect(order).to.be.eql(['routeHook1', 'routeHook2', 'globalHook1']);
    });
  });
});
