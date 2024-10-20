import {expect} from './chai.js';
import {DebuggableService} from './debuggable-service.js';

describe('DebuggableService', function () {
  describe('constructor', function () {
    it('sets the debugger to the "debug" property', function () {
      const service = new DebuggableService();
      expect(service.debug).to.be.instanceof(Function);
    });
  });
});
