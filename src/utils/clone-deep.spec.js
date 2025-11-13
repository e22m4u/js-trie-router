import {expect} from 'chai';
import {cloneDeep} from './clone-deep.js';

describe('cloneDeep', function () {
  it('returns a deep copy of a given object', function () {
    const value = {
      stringProp: 'string',
      numberProp: 10,
      booleanProp: true,
      arrayProp: [1, 2, 3],
      objectProp: {
        foo: 'string',
        bar: 'string',
      },
      dateProp: new Date(),
      nullProp: null,
    };
    const result = cloneDeep(value);
    expect(result).to.be.eql(value);
    expect(result).to.be.not.eq(value);
    expect(result.arrayProp).to.be.not.eq(value.arrayProp);
    expect(result.arrayProp).to.be.eql(value.arrayProp);
    expect(result.objectProp).to.be.not.eq(value.objectProp);
    expect(result.objectProp).to.be.eql(value.objectProp);
    expect(result.dateProp).to.be.not.eq(value.dateProp);
    expect(result.dateProp.getTime()).to.be.eq(value.dateProp.getTime());
  });

  describe('primitives and nullish values', function () {
    it('should return strings as is', function () {
      expect(cloneDeep('hello')).to.eq('hello');
    });

    it('should return numbers as is', function () {
      expect(cloneDeep(123)).to.eq(123);
      expect(cloneDeep(0)).to.eq(0);
    });

    it('should return booleans as is', function () {
      expect(cloneDeep(true)).to.eq(true);
      expect(cloneDeep(false)).to.eq(false);
    });

    it('should return null as is', function () {
      expect(cloneDeep(null)).to.be.null;
    });

    it('should return undefined as is', function () {
      expect(cloneDeep(undefined)).to.be.undefined;
    });

    it('should return symbols as is', function () {
      const sym = Symbol('test');
      expect(cloneDeep(sym)).to.eq(sym);
    });
  });

  describe('plain objects', function () {
    it('should create a deep copy of a nested object', function () {
      const original = {
        a: 1,
        b: {
          c: 2,
          d: {e: 'hello'},
        },
      };
      const cloned = cloneDeep(original);
      expect(cloned).to.be.not.eq(original);
      expect(cloned).to.be.eql(original);
      expect(cloned.b).to.be.not.eq(original.b);
      expect(cloned.b.d).to.be.not.eq(original.b.d);
    });

    it('should correctly clone an object with various data types', function () {
      const original = {
        stringProp: 'string',
        numberProp: 10,
        booleanProp: true,
        arrayProp: [1, {id: 2}],
        objectProp: {foo: 'bar'},
        dateProp: new Date(),
        nullProp: null,
      };
      const cloned = cloneDeep(original);
      expect(cloned).to.be.eql(original);
      expect(cloned).to.be.not.eq(original);
      expect(cloned.arrayProp).to.be.not.eq(original.arrayProp);
      expect(cloned.arrayProp[1]).to.be.not.eq(original.arrayProp[1]);
      expect(cloned.objectProp).to.be.not.eq(original.objectProp);
      expect(cloned.dateProp).to.be.not.eq(original.dateProp);
    });

    it('should handle objects created with Object.create(null)', function () {
      const original = Object.create(null);
      original.a = 1;
      const cloned = cloneDeep(original);
      expect(cloned).to.be.eql(original);
      expect(cloned).to.be.not.eq(original);
      expect(Object.getPrototypeOf(cloned)).to.be.null;
    });
  });

  describe('arrays', function () {
    it('should create a deep copy of an array with objects', function () {
      const original = [{a: 1}, {b: 2}];
      const cloned = cloneDeep(original);
      expect(cloned).to.be.not.eq(original);
      expect(cloned).to.be.eql(original);
      expect(cloned[0]).to.be.not.eq(original[0]);
    });

    it('should create a deep copy of a nested array', function () {
      const original = [1, [2, 3, [4]]];
      const cloned = cloneDeep(original);
      expect(cloned).to.be.not.eq(original);
      expect(cloned).to.be.eql(original);
      expect(cloned[1]).to.be.not.eq(original[1]);
      expect(cloned[1][2]).to.be.not.eq(original[1][2]);
    });
  });

  describe('dates', function () {
    it('should create a new Date instance with the same time value', function () {
      const original = new Date();
      const cloned = cloneDeep(original);
      expect(cloned).to.be.not.eq(original);
      expect(cloned.getTime()).to.eq(original.getTime());
    });
  });

  describe('complex/reference types (should not be cloned)', function () {
    it('should return the same instance for functions', function () {
      const originalFn = () => 42;
      const cloned = cloneDeep(originalFn);
      expect(cloned).to.be.eq(originalFn);
    });

    it('should return the same instance for class instances', function () {
      class MyClass {
        constructor(name) {
          this.name = name;
        }
      }
      const originalInstance = new MyClass('test');
      const cloned = cloneDeep(originalInstance);
      expect(cloned).to.be.eq(originalInstance);
      expect(cloned).to.be.instanceOf(MyClass);
    });

    it('should NOT clone properties of class instances', function () {
      class MyClassWithObject {
        constructor() {
          this.data = {value: 10};
        }
      }
      const originalInstance = new MyClassWithObject();
      const cloned = cloneDeep(originalInstance);
      expect(cloned).to.be.eq(originalInstance);
      expect(cloned.data).to.be.eq(originalInstance.data);
    });

    it('should handle objects containing reference types correctly', function () {
      const fn = () => {};
      class MyClass {}
      const instance = new MyClass();
      const original = {
        a: 1,
        myFn: fn,
        myInstance: instance,
        nested: {
          b: 2,
          myInstanceRef: instance,
        },
      };
      const cloned = cloneDeep(original);
      expect(cloned).to.not.equal(original);
      expect(cloned.nested).to.not.equal(original.nested);
      expect(cloned.myFn).to.be.eq(original.myFn);
      expect(cloned.myInstance).to.be.eq(original.myInstance);
      expect(cloned.nested.myInstanceRef).to.be.eq(original.myInstance);
    });
  });

  describe('Edge Cases', function () {
    it('should throw on circular references', function () {
      const obj = {};
      obj.a = obj;
      expect(() => cloneDeep(obj)).to.throw(
        RangeError,
        /Maximum call stack size exceeded/,
      );
    });
  });
});
