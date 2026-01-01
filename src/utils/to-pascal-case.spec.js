import {expect} from 'chai';
import {toPascalCase} from './to-pascal-case.js';

describe('toPascalCase', function () {
  it('returns a PascalCase string', function () {
    expect(toPascalCase('hello world')).to.be.eq('HelloWorld');
    expect(toPascalCase('snake_case')).to.be.eq('SnakeCase');
    expect(toPascalCase('kebab-case')).to.be.eq('KebabCase');
    expect(toPascalCase('alreadyCamel')).to.be.eq('AlreadyCamel');
    expect(toPascalCase('AlreadyPascal')).to.be.eq('AlreadyPascal');
    expect(toPascalCase(' single word ')).to.be.eq('SingleWord');
    expect(toPascalCase('')).to.be.eq('');
    expect(toPascalCase('1number')).to.be.eq('1Number');
  });
});
