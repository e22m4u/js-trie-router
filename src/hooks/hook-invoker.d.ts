import {Route} from '../route.js';
import {ServerResponse} from 'http';
import {ValueOrPromise} from '../types.js';
import {HOOK_NAME} from './hook-registry.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Hook invoker.
 */
export declare class HookInvoker extends DebuggableService {
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
