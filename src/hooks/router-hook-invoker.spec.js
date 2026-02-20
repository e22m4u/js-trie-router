import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {ROOT_PATH} from '../constants.js';
import {Route, HttpMethod} from '../route/index.js';
import {createResponseMock} from '../utils/index.js';
import {RouterHookInvoker} from './router-hook-invoker.js';
import {RouterHookRegistry, RouterHookType} from './router-hook-registry.js';

describe('RouterHookInvoker', function () {
  describe('invokeAndContinueUntilValueReceived', function () {
    it('should require the parameter "route" to be an instance of Route', function () {
      const S = new RouterHookInvoker();
      const res = createResponseMock();
      const throwable = v => () =>
        S.invokeAndContinueUntilValueReceived(
          v,
          RouterHookType.PRE_HANDLER,
          res,
        );
      const error = v =>
        format(
          'Parameter "route" must be an instance of Route, ' +
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
      throwable(
        new Route({
          method: HttpMethod.GET,
          path: ROOT_PATH,
          handler: () => undefined,
        }),
      )();
    });

    it('should require the parameter "hookType" to be a non-empty String', function () {
      const S = new RouterHookInvoker();
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => undefined,
      });
      const res = createResponseMock();
      const throwable = v => () =>
        S.invokeAndContinueUntilValueReceived(route, v, res);
      const error = v =>
        format(
          'Parameter "hookType" must be a non-empty String, ' +
            'but %s was given.',
          v,
        );
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      throwable(RouterHookType.PRE_HANDLER)();
    });

    it('should require the parameter "hookType" to be a supported hook', function () {
      const S = new RouterHookInvoker();
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => undefined,
      });
      const res = createResponseMock();
      Object.values(RouterHookType).forEach(type =>
        S.invokeAndContinueUntilValueReceived(route, type, res),
      );
      const throwable = () =>
        S.invokeAndContinueUntilValueReceived(route, 'unknown', res);
      expect(throwable).to.throw('Hook type "unknown" is not supported.');
    });

    it('should require the parameter "response" to be an instance of ServerResponse', function () {
      const S = new RouterHookInvoker();
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        handler: () => undefined,
      });
      const throwable = v => () =>
        S.invokeAndContinueUntilValueReceived(
          route,
          RouterHookType.PRE_HANDLER,
          v,
        );
      const error = v =>
        format(
          'Parameter "response" must be an instance of ServerResponse, ' +
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
      throwable(createResponseMock())();
    });

    it('should prioritize global hooks over route hooks', function () {
      const S = new RouterHookInvoker();
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
      S.invokeAndContinueUntilValueReceived(
        route,
        RouterHookType.PRE_HANDLER,
        createResponseMock(),
      );
      expect(order).to.be.eql([
        'globalHook1',
        'globalHook2',
        'routeHook1',
        'routeHook2',
      ]);
    });

    it('should stop global hooks invocation if any of them returns a non-nullish value', function () {
      const S = new RouterHookInvoker();
      const order = [];
      const ret = 'OK';
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
          return ret;
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
      const result = S.invokeAndContinueUntilValueReceived(
        route,
        RouterHookType.PRE_HANDLER,
        createResponseMock(),
      );
      expect(result).to.be.eq(ret);
      expect(order).to.be.eql(['globalHook1', 'globalHook2']);
    });

    it('should stop route hooks invocation if any of them returns a non-nullish value', function () {
      const S = new RouterHookInvoker();
      const order = [];
      const ret = 'OK';
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
            return ret;
          },
          () => {
            order.push('routeHook3');
          },
        ],
        handler: () => undefined,
      });
      const result = S.invokeAndContinueUntilValueReceived(
        route,
        RouterHookType.PRE_HANDLER,
        createResponseMock(),
      );
      expect(result).to.be.eq(ret);
      expect(order).to.be.eql([
        'globalHook1',
        'globalHook2',
        'routeHook1',
        'routeHook2',
      ]);
    });

    it('should ignore hooks and return the given response when response headers are sent before hooks invocation', function () {
      const S = new RouterHookInvoker();
      const res = createResponseMock();
      res._headersSent = true;
      S.getService(RouterHookRegistry).addHook(
        RouterHookType.PRE_HANDLER,
        () => {
          throw new Error('Should not be called');
        },
      );
      const route = new Route({
        method: HttpMethod.GET,
        path: ROOT_PATH,
        preHandler: [
          () => {
            throw new Error('Should not be called');
          },
        ],
        handler: () => undefined,
      });
      const result = S.invokeAndContinueUntilValueReceived(
        route,
        RouterHookType.PRE_HANDLER,
        res,
      );
      expect(result).to.be.eq(res);
    });

    it('should stop global hooks invocation and return the given response when response headers are sent by the global hook', function () {
      const S = new RouterHookInvoker();
      const order = [];
      const res = createResponseMock();
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
      const result = S.invokeAndContinueUntilValueReceived(
        route,
        RouterHookType.PRE_HANDLER,
        res,
      );
      expect(result).to.be.eq(res);
      expect(order).to.be.eql(['globalHook1', 'globalHook2']);
    });

    it('should stop route hooks invocation and return the given response when response headers are send by the route hook', function () {
      const S = new RouterHookInvoker();
      const order = [];
      const res = createResponseMock();
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
      const result = S.invokeAndContinueUntilValueReceived(
        route,
        RouterHookType.PRE_HANDLER,
        res,
      );
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
      const promise = S.invokeAndContinueUntilValueReceived(
        route,
        RouterHookType.PRE_HANDLER,
        createResponseMock(),
      );
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
      const promise = S.invokeAndContinueUntilValueReceived(
        route,
        RouterHookType.PRE_HANDLER,
        createResponseMock(),
      );
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
      const promise = S.invokeAndContinueUntilValueReceived(
        route,
        RouterHookType.PRE_HANDLER,
        createResponseMock(),
      );
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
      const promise = S.invokeAndContinueUntilValueReceived(
        route,
        RouterHookType.PRE_HANDLER,
        createResponseMock(),
      );
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
});
