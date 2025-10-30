import {Route} from '../route.js';
import {ServerResponse} from 'http';
import {ValueOrPromise} from '../types.js';
import {RouterHookType} from './hook-registry.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Hook invoker.
 */
export declare class HookInvoker extends DebuggableService {
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
