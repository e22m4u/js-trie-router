import {Route} from '../route.js';
import {Errorf} from '@e22m4u/js-format';
import {DebuggableService} from '../debuggable-service.js';
import {isPromise, isResponseSent} from '../utils/index.js';
import {HookRegistry, RouterHookType} from './hook-registry.js';

/**
 * Hook invoker.
 */
export class HookInvoker extends DebuggableService {
  /**
   * Invoke and continue until value received.
   *
   * @param {Route} route
   * @param {string} hookType
   * @param {import('http').ServerResponse} response
   * @param {*[]} args
   * @returns {Promise<*>|*}
   */
  invokeAndContinueUntilValueReceived(route, hookType, response, ...args) {
    if (!route || !(route instanceof Route))
      throw new Errorf(
        'The parameter "route" of ' +
          'the HookInvoker.invokeAndContinueUntilValueReceived ' +
          'should be a Route instance, but %v was given.',
        route,
      );
    if (!hookType || typeof hookType !== 'string')
      throw new Errorf(
        'The parameter "hookType" of ' +
          'the HookInvoker.invokeAndContinueUntilValueReceived ' +
          'should be a non-empty String, but %v was given.',
        hookType,
      );
    if (!Object.values(RouterHookType).includes(hookType))
      throw new Errorf('The hook type %v is not supported.', hookType);
    if (
      !response ||
      typeof response !== 'object' ||
      Array.isArray(response) ||
      typeof response.headersSent !== 'boolean'
    ) {
      throw new Errorf(
        'The parameter "response" of ' +
          'the HookInvoker.invokeAndContinueUntilValueReceived ' +
          'should be a ServerResponse instance, but %v was given.',
        response,
      );
    }
    // если ответ уже отправлен,
    // то возвращается ServerResponse
    if (isResponseSent(response)) {
      return response;
    }
    // так как хуки роута выполняются
    // после глобальных, то объединяем
    // их в данной последовательности
    const hooks = [
      ...this.getService(HookRegistry).getHooks(hookType),
      ...route.hookRegistry.getHooks(hookType),
    ];
    let result = undefined;
    // итерация по хукам выполняется по индексу,
    // чтобы знать, с какого места продолжать
    // в асинхронном режиме
    for (let i = 0; i < hooks.length; i++) {
      const hook = hooks[i];
      // вызов хука выполняется
      // в синхронном режиме
      result = hook(...args);
      // если ответ уже отправлен,
      // то возвращается ServerResponse
      if (isResponseSent(response)) {
        return response;
      }
      // если синхронный вызов хука вернул значение отличное
      // от undefined и null, то требуется проверить данное
      // значение для коррекции режима вызова оставшихся хуков
      if (result != null) {
        // если синхронный вызов хука вернул Promise, то дальнейшее
        // выполнение переключается в асинхронный режим, начиная
        // с индекса следующего хука
        if (isPromise(result)) {
          return (async () => {
            // ожидание Promise, который был получен
            // на предыдущем шаге (в синхронном режиме)
            let asyncResult = await result;
            // если ответ уже отправлен,
            // то возвращается ServerResponse
            if (isResponseSent(response)) {
              return response;
            }
            // если Promise разрешился значением отличным
            // от undefined и null, то данное значение
            // возвращается в качестве результата
            if (asyncResult != null) {
              return asyncResult;
            }
            // продолжение вызова хуков начиная
            // со следующего индекса (асинхронно)
            for (let j = i + 1; j < hooks.length; j++) {
              // с этого момента все синхронные
              // хуки выполняются как асинхронные
              asyncResult = await hooks[j](...args);
              // если ответ уже отправлен,
              // то возвращается ServerResponse
              if (isResponseSent(response)) {
                return response;
              }
              // если хук вернул значение отличное
              // от undefined и null, то данное значение
              // возвращается в качестве результата
              if (asyncResult != null) {
                return asyncResult;
              }
            }
            return;
          })();
        }
        // если синхронный хук вернул значение отличное
        // от undefined и null, то данное значение
        // возвращается в качестве результата
        return result;
      }
    }
    // все хуки были синхронными
    // и не вернули значения
    return;
  }
}
