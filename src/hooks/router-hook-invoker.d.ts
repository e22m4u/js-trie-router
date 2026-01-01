import {ServerResponse} from 'http';
import {Route} from '../route/index.js';
import {ValueOrPromise} from '../types.js';
import {RouterHookType} from './router-hook-registry.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Router hook invoker.
 */
export declare class RouterHookInvoker extends DebuggableService {
  /**
   * Invoke and continue until value received.
   *
   * @param route
   * @param hookType
   * @param response
   * @param args
   */
  invokeAndContinueUntilValueReceived(
    route: Route,
    hookType: RouterHookType,
    response: ServerResponse,
    ...args: unknown[]
  ): ValueOrPromise<unknown>;
}
