import {expect} from 'chai';
import {HttpMethod, Route} from '../route/index.js';
import {createRouteMock} from './create-route-mock.js';

describe('createRouteMock', function () {
  it('should return an instance of Route with default options', function () {
    const res = createRouteMock();
    expect(res).to.be.instanceof(Route);
    expect(res.method).to.be.eq(HttpMethod.GET);
    expect(res.path).to.be.eq('/');
    expect(res.handler()).to.be.eq('OK');
  });

  it('should set a provided value to the "method" property', function () {
    const res = createRouteMock({method: HttpMethod.POST});
    expect(res.method).to.be.eq(HttpMethod.POST);
  });

  it('should set a provided value to the "path" property', function () {
    const res = createRouteMock({path: '/test'});
    expect(res.path).to.be.eq('/test');
  });

  it('should set a provided value to the "handler" option', function () {
    const res = createRouteMock({handler: () => 'Hey!'});
    expect(res.handler()).to.be.eq('Hey!');
  });
});
