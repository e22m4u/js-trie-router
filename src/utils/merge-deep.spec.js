import {expect} from 'chai';
import {mergeDeep} from './merge-deep.js';

describe('mergeDeep', function () {
  describe('basic object merging', function () {
    it('should merge two flat objects with different keys', function () {
      const target = {a: 1};
      const source = {b: 2};
      const result = mergeDeep(target, source);
      expect(result).to.deep.equal({a: 1, b: 2});
    });

    it('should overwrite values in the target with values from the source', function () {
      const target = {a: 1, b: 10};
      const source = {a: 2};
      const result = mergeDeep(target, source);
      expect(result).to.deep.equal({a: 2, b: 10});
    });

    it('should return the source if the target is empty', function () {
      const target = {};
      const source = {a: 1};
      const result = mergeDeep(target, source);
      expect(result).to.deep.equal({a: 1});
    });
  });

  describe('nested object merging', function () {
    it('should recursively merge nested objects', function () {
      const target = {
        settings: {
          theme: 'dark',
          notifications: {email: true},
        },
      };
      const source = {
        settings: {
          notifications: {sms: true},
        },
      };
      const result = mergeDeep(target, source);
      expect(result).to.deep.equal({
        settings: {
          theme: 'dark',
          notifications: {
            email: true,
            sms: true,
          },
        },
      });
    });

    it('should overwrite nested primitive values', function () {
      const target = {config: {verbose: true}};
      const source = {config: {verbose: false}};
      const result = mergeDeep(target, source);
      expect(result.config.verbose).to.be.false;
    });
  });

  describe('array handling', function () {
    it('should concatenate arrays when both values are arrays', function () {
      const target = {list: [1, 2]};
      const source = {list: [3, 4]};
      const result = mergeDeep(target, source);
      expect(result.list).to.deep.equal([1, 2, 3, 4]);
      expect(Array.isArray(result.list)).to.be.true;
    });

    it('should concatenate arrays at the root level', function () {
      const target = ['a'];
      const source = ['b'];
      const result = mergeDeep(target, source);
      expect(result).to.deep.equal(['a', 'b']);
    });

    it('should concatenate nested arrays', function () {
      const target = {data: {ids: [1]}};
      const source = {data: {ids: [2]}};
      const result = mergeDeep(target, source);
      expect(result.data.ids).to.deep.equal([1, 2]);
    });
  });

  describe('type mismatches and edge cases', function () {
    it('should overwrite an object with a primitive value', function () {
      const target = {a: {nested: true}};
      const source = {a: 5};
      const result = mergeDeep(target, source);
      expect(result).to.deep.equal({a: 5});
    });

    it('should overwrite a primitive with an object', function () {
      const target = {a: 5};
      const source = {a: {nested: true}};
      const result = mergeDeep(target, source);
      expect(result).to.deep.equal({a: {nested: true}});
    });

    it('should overwrite an array with an object', function () {
      const target = {a: [1, 2]};
      const source = {a: {val: 1}};
      const result = mergeDeep(target, source);
      expect(result).to.deep.equal({a: {val: 1}});
    });

    it('should overwrite an object with an array', function () {
      const target = {a: {val: 1}};
      const source = {a: [1, 2]};
      const result = mergeDeep(target, source);
      expect(result).to.deep.equal({a: [1, 2]});
    });

    it('should handle null values correctly', function () {
      const target = {a: 1};
      const source = {a: null};
      const result = mergeDeep(target, source);
      expect(result).to.deep.equal({a: null});
    });
  });

  describe('immutability', function () {
    it('should not mutate the original target object', function () {
      const target = {a: 1, nested: {x: 1}};
      const source = {b: 2, nested: {y: 2}};
      const targetClone = JSON.parse(JSON.stringify(target));
      mergeDeep(target, source);
      expect(target).to.deep.equal(targetClone);
    });

    it('should not mutate the original source object', function () {
      const target = {a: 1};
      const source = {b: 2, nested: {y: 2}};
      const sourceClone = JSON.parse(JSON.stringify(source));
      mergeDeep(target, source);
      expect(source).to.deep.equal(sourceClone);
    });

    it('should return a new object reference', function () {
      const target = {a: 1};
      const source = {b: 2};
      const result = mergeDeep(target, source);
      expect(result).to.not.equal(target);
      expect(result).to.not.equal(source);
    });

    it('should create new references for nested merged objects', function () {
      const target = {nested: {a: 1}};
      const source = {nested: {b: 2}};
      const result = mergeDeep(target, source);
      expect(result.nested).to.not.equal(target.nested);
    });

    it('should create new references for concatenated arrays', function () {
      const target = {list: [1]};
      const source = {list: [2]};
      const result = mergeDeep(target, source);
      expect(result.list).to.not.equal(target.list);
      expect(result.list).to.not.equal(source.list);
    });
  });
});
