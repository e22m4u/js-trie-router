import {ValueOrPromise} from '../types.js';
import {RequestContext} from '../request-context.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Router hook invoker.
 */
export declare class RouterHookInvoker extends DebuggableService {
  /**
   * Invoke pre-handler hooks.
   *
   * @param context
   */
  invokePreHandlerHooks(context: RequestContext): ValueOrPromise<unknown>;

  /**
   * Invoke post-handler hooks.
   *
   * @param context
   * @param initialData
   */
  invokePostHandlerHooks(
    context: RequestContext,
    initialData: unknown,
  ): ValueOrPromise<unknown>;
}
