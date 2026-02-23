import {ValueOrPromise} from '../types.js';
import {RequestContext} from '../request-context.js';
import {IncomingMessage, ServerResponse} from 'http';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Router hook invoker.
 */
export declare class RouterHookInvoker extends DebuggableService {
  /**
   * Invoke on-request hooks.
   *
   * @param {IncomingMessage} request
   * @param {ServerResponse} response
   * @returns {Promise<boolean|undefined>|boolean|undefined}
   */
  invokeOnRequestHooks(
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<boolean | undefined> | boolean | undefined;

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
