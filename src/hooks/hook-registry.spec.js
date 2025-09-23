import {expect} from '../chai.js';
import {format} from '@e22m4u/js-format';
import {HookType} from './hook-registry.js';
import {HookRegistry} from './hook-registry.js';

describe('HookRegistry', function () {
  describe('addHook', function () {
    it('requires the parameter "type" to be a non-empty String', function () {
      const s = new HookRegistry();
      const throwable = v => () => s.addHook(v, () => undefined);
      const error = v => format('The hook type is required, but %s given.', v);
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
      throwable(HookType.PRE_HANDLER)();
    });

    it('requires the parameter "hook" to be a Function', function () {
      const s = new HookRegistry();
      const throwable = v => () => s.addHook(HookType.PRE_HANDLER, v);
      const error = v =>
        format('The hook "preHandler" should be a Function, but %s given.', v);
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
      const s = new HookRegistry();
      const hook = () => undefined;
      Object.values(HookType).forEach(type => s.addHook(type, hook));
      const throwable = () => s.addHook('unknown', hook);
      expect(throwable).to.throw('The hook type "unknown" is not supported.');
    });

    it('sets the given function to the map array by the hook type', function () {
      const s = new HookRegistry();
      const type = HookType.PRE_HANDLER;
      const hook = () => undefined;
      s.addHook(type, hook);
      expect(s._hooks.get(type)).to.include(hook);
    });

    it('returns this', function () {
      const s = new HookRegistry();
      const hook = () => undefined;
      const type = HookType.PRE_HANDLER;
      const res = s.addHook(type, hook);
      expect(res).to.be.eq(s);
    });
  });

  describe('hasHook', function () {
    it('requires the parameter "type" to be a non-empty String', function () {
      const s = new HookRegistry();
      const throwable = v => () => s.hasHook(v, () => undefined);
      const error = v => format('The hook type is required, but %s given.', v);
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
      throwable(HookType.PRE_HANDLER)();
    });

    it('requires the parameter "hook" to be a Function', function () {
      const s = new HookRegistry();
      const throwable = v => () => s.hasHook(HookType.PRE_HANDLER, v);
      const error = v =>
        format('The hook "preHandler" should be a Function, but %s given.', v);
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
      const s = new HookRegistry();
      const hook = () => undefined;
      Object.values(HookType).forEach(type => s.hasHook(type, hook));
      const throwable = () => s.hasHook('unknown', hook);
      expect(throwable).to.throw('The hook type "unknown" is not supported.');
    });

    it('returns true if the given hook is set or false', function () {
      const s = new HookRegistry();
      const type = HookType.PRE_HANDLER;
      const hook = () => undefined;
      expect(s.hasHook(type, hook)).to.be.false;
      s.addHook(type, hook);
      expect(s.hasHook(type, hook)).to.be.true;
    });
  });

  describe('getHooks', function () {
    it('requires the parameter "type" to be a non-empty String', function () {
      const s = new HookRegistry();
      const throwable = v => () => s.getHooks(v);
      const error = v => format('The hook type is required, but %s given.', v);
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
      throwable(HookType.PRE_HANDLER)();
    });

    it('requires the parameter "type" to be a supported hook', function () {
      const s = new HookRegistry();
      Object.values(HookType).forEach(type => s.getHooks(type));
      const throwable = () => s.getHooks('unknown');
      expect(throwable).to.throw('The hook type "unknown" is not supported.');
    });

    it('returns existing hooks', function () {
      const s = new HookRegistry();
      const hook = () => undefined;
      const type = HookType.PRE_HANDLER;
      const res1 = s.getHooks(type);
      expect(res1).to.be.eql([]);
      s.addHook(type, hook);
      const res2 = s.getHooks(type);
      expect(res2).to.have.length(1);
      expect(res2[0]).to.be.eq(hook);
    });

    it('returns an empty array if no hook exists', function () {
      const s = new HookRegistry();
      const res = s.getHooks(HookType.PRE_HANDLER);
      expect(res).to.be.eql([]);
    });
  });
});
