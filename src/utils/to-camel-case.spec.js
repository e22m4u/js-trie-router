import {expect} from 'chai';
import {format} from '@e22m4u/js-format';
import {toCamelCase} from './to-camel-case.js';

describe('toCamelCase', function () {
  it('should require the parameter "input" to be a String', function () {
    const throwable = v => () => toCamelCase(v);
    const error = v =>
      format('Parameter "input" must be a String, but %s was given.', v);
    expect(throwable(10)).to.throw(error('10'));
    expect(throwable(0)).to.throw(error('0'));
    expect(throwable(true)).to.throw(error('true'));
    expect(throwable(false)).to.throw(error('false'));
    expect(throwable(null)).to.throw(error('null'));
    expect(throwable({})).to.throw(error('Object'));
    expect(throwable([])).to.throw(error('Array'));
    expect(throwable(undefined)).to.throw(error('undefined'));
    throwable('str')();
    throwable('')();
  });

  it('should return a given string in camel case', function () {
    expect(toCamelCase('TestString')).to.be.eq('testString');
    expect(toCamelCase('test-string')).to.be.eq('testString');
    expect(toCamelCase('test string')).to.be.eq('testString');
    expect(toCamelCase('Test string')).to.be.eq('testString');
  });
});
