import {Route} from '../route.js';
import {ServerResponse} from 'http';
import {Service} from '../service.js';
import {ValueOrPromise} from '../types.js';
import {HOOK_NAME} from './hook-registry.js';

/**
 * Hook invoker.
 */
export declare class HookInvoker extends Service {
  /**
   * Invoke and continue until value received.
   *
   * @param route
   * @param hookName
   * @param response
   * @param args
   */
  invokeAndContinueUntilValueReceived(
    route: Route,
    hookName: HOOK_NAME,
    response: ServerResponse,
    ...args: unknown[]
  ): ValueOrPromise<unknown>;
}
