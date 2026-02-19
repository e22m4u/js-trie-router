import {expect} from 'chai';
import {DebuggableService} from './debuggable-service.js';
import {DebuggableService as BaseDebuggableService} from '@e22m4u/js-service';

describe('DebuggableService', function () {
  describe('constructor', function () {
    it('should extend BaseDebuggableService', function () {
      const service = new DebuggableService();
      expect(service).to.be.instanceOf(BaseDebuggableService);
    });
  });

  describe('debug', function () {
    it('should be a function', function () {
      const service = new DebuggableService();
      expect(service.debug).to.be.instanceOf(Function);
    });
  });
});
