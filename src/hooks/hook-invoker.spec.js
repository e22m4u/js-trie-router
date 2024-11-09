import {expect} from '../chai.js';
import {Route} from '../route.js';
import {HttpMethod} from '../route.js';
import {format} from '@e22m4u/js-format';
import {HookName} from './hook-registry.js';
import {HookInvoker} from './hook-invoker.js';
import {HookRegistry} from './hook-registry.js';
import {createResponseMock} from '../utils/index.js';

describe('HookInvoker', function () {
  describe('invokeAndContinueUntilValueReceived', function () {
    it('requires the parameter "route" to be a Route instance', function () {
      const s = new HookInvoker();
      const res = createResponseMock();
      const throwable = v => () =>
        s.invokeAndContinueUntilValueReceived(v, HookName.PRE_HANDLER, res);
      const error = v =>
        format(
          'The parameter "route" of ' +
            'the HookInvoker.invokeAndContinueUntilValueReceived ' +
            'should be a Route instance, but %s given.',
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
          path: '/',
          handler: () => undefined,
        }),
      )();
    });

    it('requires the parameter "hookName" to be a non-empty String', function () {
      const s = new HookInvoker();
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
        handler: () => undefined,
      });
      const res = createResponseMock();
      const throwable = v => () =>
        s.invokeAndContinueUntilValueReceived(route, v, res);
      const error = v =>
        format(
          'The parameter "hookName" of ' +
            'the HookInvoker.invokeAndContinueUntilValueReceived ' +
            'should be a non-empty String, but %s given.',
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
      throwable(HookName.PRE_HANDLER)();
    });

    it('requires the parameter "hookName" to be a supported hook', function () {
      const s = new HookInvoker();
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
        handler: () => undefined,
      });
      const res = createResponseMock();
      Object.values(HookName).forEach(name =>
        s.invokeAndContinueUntilValueReceived(route, name, res),
      );
      const throwable = () =>
        s.invokeAndContinueUntilValueReceived(route, 'unknown', res);
      expect(throwable).to.throw('The hook name "unknown" is not supported.');
    });

    it('requires the parameter "response" to be an instance of ServerResponse', function () {
      const s = new HookInvoker();
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
        handler: () => undefined,
      });
      const throwable = v => () =>
        s.invokeAndContinueUntilValueReceived(route, HookName.PRE_HANDLER, v);
      const error = v =>
        format(
          'The parameter "response" of ' +
            'the HookInvoker.invokeAndContinueUntilValueReceived ' +
            'should be a ServerResponse instance, but %s given.',
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

    it('invokes global hooks in priority', function () {
      const s = new HookInvoker();
      const order = [];
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook1');
      });
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook2');
      });
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
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
      s.invokeAndContinueUntilValueReceived(
        route,
        HookName.PRE_HANDLER,
        createResponseMock(),
      );
      expect(order).to.be.eql([
        'globalHook1',
        'globalHook2',
        'routeHook1',
        'routeHook2',
      ]);
    });

    it('stops global hooks invocation if any of them returns a value', function () {
      const s = new HookInvoker();
      const order = [];
      const ret = 'OK';
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook1');
      });
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook2');
        return ret;
      });
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook3');
      });
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
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
      const result = s.invokeAndContinueUntilValueReceived(
        route,
        HookName.PRE_HANDLER,
        createResponseMock(),
      );
      expect(result).to.be.eq(ret);
      expect(order).to.be.eql(['globalHook1', 'globalHook2']);
    });

    it('stops route hooks invocation if any of them returns a value', function () {
      const s = new HookInvoker();
      const order = [];
      const ret = 'OK';
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook1');
      });
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook2');
      });
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
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
      const result = s.invokeAndContinueUntilValueReceived(
        route,
        HookName.PRE_HANDLER,
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

    it('stops global hooks invocation and returns the given response if it was sent', function () {
      const s = new HookInvoker();
      const order = [];
      const res = createResponseMock();
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook1');
      });
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook2');
        res._headersSent = true;
      });
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook3');
      });
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
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
      const result = s.invokeAndContinueUntilValueReceived(
        route,
        HookName.PRE_HANDLER,
        res,
      );
      expect(result).to.be.eq(res);
      expect(order).to.be.eql(['globalHook1', 'globalHook2']);
    });

    it('stops route hooks invocation and returns the given response if it was sent', function () {
      const s = new HookInvoker();
      const order = [];
      const res = createResponseMock();
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook1');
      });
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook2');
      });
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
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
      const result = s.invokeAndContinueUntilValueReceived(
        route,
        HookName.PRE_HANDLER,
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

    it('returns a Promise if any global hook is asynchronous', async function () {
      const s = new HookInvoker();
      const order = [];
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook1');
      });
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, async () => {
        order.push('globalHook2');
      });
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook3');
      });
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
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
      const promise = s.invokeAndContinueUntilValueReceived(
        route,
        HookName.PRE_HANDLER,
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

    it('returns a Promise if entire global hooks are asynchronous', async function () {
      const s = new HookInvoker();
      const order = [];
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, async () => {
        order.push('globalHook1');
      });
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, async () => {
        order.push('globalHook2');
      });
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
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
      const promise = s.invokeAndContinueUntilValueReceived(
        route,
        HookName.PRE_HANDLER,
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

    it('returns a Promise if any route hook is asynchronous', async function () {
      const s = new HookInvoker();
      const order = [];
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook1');
      });
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook2');
      });
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
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
      const promise = s.invokeAndContinueUntilValueReceived(
        route,
        HookName.PRE_HANDLER,
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

    it('returns a Promise if entire route hooks are asynchronous', async function () {
      const s = new HookInvoker();
      const order = [];
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook1');
      });
      s.getService(HookRegistry).addHook(HookName.PRE_HANDLER, () => {
        order.push('globalHook2');
      });
      const route = new Route({
        method: HttpMethod.GET,
        path: '/',
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
      const promise = s.invokeAndContinueUntilValueReceived(
        route,
        HookName.PRE_HANDLER,
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
