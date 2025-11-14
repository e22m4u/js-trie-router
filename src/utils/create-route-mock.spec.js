import {expect} from 'chai';
import {HttpMethod, Route} from '../route.js';
import {createRouteMock} from './create-route-mock.js';

describe('createRouteMock', function () {
  it('returns an instance of Route with default options', function () {
    const res = createRouteMock();
    expect(res).to.be.instanceof(Route);
    expect(res.method).to.be.eq(HttpMethod.GET);
    expect(res.path).to.be.eq('/');
    expect(res.handler()).to.be.eq('OK');
  });

  it('sets the "method" option', function () {
    const res = createRouteMock({method: HttpMethod.POST});
    expect(res.method).to.be.eq(HttpMethod.POST);
  });

  it('sets the "path" option', function () {
    const res = createRouteMock({path: 'test'});
    expect(res.path).to.be.eq('test');
  });

  it('sets the "handler" option', function () {
    const res = createRouteMock({handler: () => 'Hey!'});
    expect(res.handler()).to.be.eq('Hey!');
  });
});
