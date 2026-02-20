import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {RouterHookRegistry, RouterHookType} from './router-hook-registry.js';

describe('RouterHookRegistry', function () {
  describe('addHook', function () {
    it('should require the parameter "type" to be a non-empty String', function () {
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

    it('should require the parameter "hook" to be a Function', function () {
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

    it('should require the parameter "type" to be a supported value', function () {
      const S = new RouterHookRegistry();
      const hook = () => undefined;
      Object.values(RouterHookType).forEach(type => S.addHook(type, hook));
      const throwable = () => S.addHook('unknown', hook);
      expect(throwable).to.throw('Hook type "unknown" is not supported.');
    });

    it('should register the hook function for the given type', function () {
      const S = new RouterHookRegistry();
      const type = RouterHookType.PRE_HANDLER;
      const hook = () => undefined;
      expect(S.hasHook(type, hook)).to.be.false;
      S.addHook(type, hook);
      expect(S.hasHook(type, hook)).to.be.true;
    });

    it('should register hook functions in the correct order', function () {
      const S = new RouterHookRegistry();
      const type = RouterHookType.PRE_HANDLER;
      const hook1 = () => undefined;
      const hook2 = () => undefined;
      S.addHook(type, hook1);
      S.addHook(type, hook2);
      const res = S.getHooks(type);
      expect(res).to.be.eql([hook1, hook2]);
    });

    it('should return the current instance', function () {
      const S = new RouterHookRegistry();
      const hook = () => undefined;
      const type = RouterHookType.PRE_HANDLER;
      const res = S.addHook(type, hook);
      expect(res).to.be.eq(S);
    });
  });

  describe('hasHook', function () {
    it('should require the parameter "type" to be a non-empty String', function () {
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

    it('should require the parameter "hook" to be a Function', function () {
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

    it('should require the parameter "type" to be a supported hook', function () {
      const S = new RouterHookRegistry();
      const hook = () => undefined;
      Object.values(RouterHookType).forEach(type => S.hasHook(type, hook));
      const throwable = () => S.hasHook('unknown', hook);
      expect(throwable).to.throw('Hook type "unknown" is not supported.');
    });

    it('should return true when the hook function is registered for the given type', function () {
      const S = new RouterHookRegistry();
      const type1 = RouterHookType.PRE_HANDLER;
      const type2 = RouterHookType.POST_HANDLER;
      const hook = () => undefined;
      expect(S.hasHook(type1, hook)).to.be.false;
      S.addHook(type1, hook);
      expect(S.hasHook(type1, hook)).to.be.true;
      expect(S.hasHook(type2, hook)).to.be.false;
    });
  });

  describe('getHooks', function () {
    it('should require the parameter "type" to be a non-empty String', function () {
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

    it('should require the parameter "type" to be a supported hook', function () {
      const S = new RouterHookRegistry();
      Object.values(RouterHookType).forEach(type => S.getHooks(type));
      const throwable = () => S.getHooks('unknown');
      expect(throwable).to.throw('Hook type "unknown" is not supported.');
    });

    it('should return registered hooks for the given type', function () {
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

    it('should return an empty array if no hook registered', function () {
      const S = new RouterHookRegistry();
      const res = S.getHooks(RouterHookType.PRE_HANDLER);
      expect(res).to.be.eql([]);
    });
  });
});
