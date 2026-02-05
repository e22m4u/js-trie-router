import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {RouterHookRegistry, RouterHookType} from './router-hook-registry.js';

describe('RouterHookRegistry', function () {
  describe('addHook', function () {
    it('requires the parameter "type" to be a non-empty String', function () {
      const S = new RouterHookRegistry();
      const throwable = v => () => S.addHook(v, () => undefined);
      const error = v => format('Hook type is required, but %s was given.', v);
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
      throwable(RouterHookType.PRE_HANDLER)();
    });

    it('requires the parameter "hook" to be a Function', function () {
      const S = new RouterHookRegistry();
      const throwable = v => () => S.addHook(RouterHookType.PRE_HANDLER, v);
      const error = v =>
        format(
          'Router hook "preHandler" must be a Function, but %s was given.',
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
      throwable(() => undefined)();
    });

    it('requires the parameter "type" to be a supported hook', function () {
      const S = new RouterHookRegistry();
      const hook = () => undefined;
      Object.values(RouterHookType).forEach(type => S.addHook(type, hook));
      const throwable = () => S.addHook('unknown', hook);
      expect(throwable).to.throw('Hook type "unknown" is not supported.');
    });

    it('sets the given function to the map array by the hook type', function () {
      const S = new RouterHookRegistry();
      const type = RouterHookType.PRE_HANDLER;
      const hook = () => undefined;
      S.addHook(type, hook);
      expect(S._hooks.get(type)).to.include(hook);
    });

    it('returns this', function () {
      const S = new RouterHookRegistry();
      const hook = () => undefined;
      const type = RouterHookType.PRE_HANDLER;
      const res = S.addHook(type, hook);
      expect(res).to.be.eq(S);
    });
  });

  describe('hasHook', function () {
    it('requires the parameter "type" to be a non-empty String', function () {
      const S = new RouterHookRegistry();
      const throwable = v => () => S.hasHook(v, () => undefined);
      const error = v => format('Hook type is required, but %s was given.', v);
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
      throwable(RouterHookType.PRE_HANDLER)();
    });

    it('requires the parameter "hook" to be a Function', function () {
      const S = new RouterHookRegistry();
      const throwable = v => () => S.hasHook(RouterHookType.PRE_HANDLER, v);
      const error = v =>
        format(
          'Router hook "preHandler" must be a Function, but %s was given.',
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
      throwable(() => undefined)();
    });

    it('requires the parameter "type" to be a supported hook', function () {
      const S = new RouterHookRegistry();
      const hook = () => undefined;
      Object.values(RouterHookType).forEach(type => S.hasHook(type, hook));
      const throwable = () => S.hasHook('unknown', hook);
      expect(throwable).to.throw('Hook type "unknown" is not supported.');
    });

    it('returns true if the given hook is set or false', function () {
      const S = new RouterHookRegistry();
      const type = RouterHookType.PRE_HANDLER;
      const hook = () => undefined;
      expect(S.hasHook(type, hook)).to.be.false;
      S.addHook(type, hook);
      expect(S.hasHook(type, hook)).to.be.true;
    });
  });

  describe('getHooks', function () {
    it('requires the parameter "type" to be a non-empty String', function () {
      const S = new RouterHookRegistry();
      const throwable = v => () => S.getHooks(v);
      const error = v => format('Hook type is required, but %s was given.', v);
      expect(throwable('')).to.throw(error('""'));
      expect(throwable(10)).to.throw(error('10'));
      expect(throwable(0)).to.throw(error('0'));
      expect(throwable(true)).to.throw(error('true'));
      expect(throwable(false)).to.throw(error('false'));
      expect(throwable(null)).to.throw(error('null'));
      expect(throwable({})).to.throw(error('Object'));
      expect(throwable([])).to.throw(error('Array'));
      expect(throwable(undefined)).to.throw(error('undefined'));
      expect(throwable(() => undefined)).to.throw(error('Function'));
      throwable(RouterHookType.PRE_HANDLER)();
    });

    it('requires the parameter "type" to be a supported hook', function () {
      const S = new RouterHookRegistry();
      Object.values(RouterHookType).forEach(type => S.getHooks(type));
      const throwable = () => S.getHooks('unknown');
      expect(throwable).to.throw('Hook type "unknown" is not supported.');
    });

    it('returns existing hooks', function () {
      const S = new RouterHookRegistry();
      const hook = () => undefined;
      const type = RouterHookType.PRE_HANDLER;
      const res1 = S.getHooks(type);
      expect(res1).to.be.eql([]);
      S.addHook(type, hook);
      const res2 = S.getHooks(type);
      expect(res2).to.have.length(1);
      expect(res2[0]).to.be.eq(hook);
    });

    it('returns an empty array if no hook exists', function () {
      const S = new RouterHookRegistry();
      const res = S.getHooks(RouterHookType.PRE_HANDLER);
      expect(res).to.be.eql([]);
    });
  });
});
