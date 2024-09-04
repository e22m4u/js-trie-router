import {expect} from './chai.js';
import {Service} from './service.js';

describe('Service', function () {
  describe('constructor', function () {
    it('sets the debugger to the "debug" property', function () {
      const service = new Service();
      expect(service.debug).to.be.instanceof(Function);
    });
  });
});
