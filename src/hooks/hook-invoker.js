import {Route} from '../route.js';
import {Service} from '../service.js';
import {Errorf} from '@e22m4u/js-format';
import {isPromise} from '../utils/index.js';
import {HOOK_NAME} from './hook-registry.js';
import {HookRegistry} from './hook-registry.js';
import {isResponseSent} from '../utils/index.js';

/**
 * Hook invoker.
 */
export class HookInvoker extends Service {
  /**
   * Invoke and continue until value received.
   *
   * @param {Route} route
   * @param {string} hookName
   * @param {import('http').ServerResponse} response
   * @param {*[]} args
   * @returns {Promise<*>|*}
   */
  invokeAndContinueUntilValueReceived(route, hookName, response, ...args) {
    if (!route || !(route instanceof Route))
      throw new Errorf(
        'The parameter "route" of ' +
          'the HookInvoker.invokeAndContinueUntilValueReceived ' +
          'should be a Route instance, but %v given.',
        route,
      );
    if (!hookName || typeof hookName !== 'string')
      throw new Errorf(
        'The parameter "hookName" of ' +
          'the HookInvoker.invokeAndContinueUntilValueReceived ' +
          'should be a non-empty String, but %v given.',
        hookName,
      );
    if (!Object.values(HOOK_NAME).includes(hookName))
      throw new Errorf('The hook name %v is not supported.', hookName);
    if (
      !response ||
      typeof response !== 'object' ||
      Array.isArray(response) ||
      typeof response.headersSent !== 'boolean'
    ) {
      throw new Errorf(
        'The parameter "response" of ' +
          'the HookInvoker.invokeAndContinueUntilValueReceived ' +
          'should be a ServerResponse instance, but %v given.',
        response,
      );
    }
    // так как хуки роута выполняются
    // после глобальных, то объединяем
    // их в данной последовательности
    const hooks = [
      ...this.getService(HookRegistry).getHooks(hookName),
      ...route.hookRegistry.getHooks(hookName),
    ];
    // последовательный вызов хуков будет прерван,
    // если один из них вернет значение (или Promise)
    // отличное от "undefined" и "null"
    let result = undefined;
    for (const hook of hooks) {
      // если ответ уже был отправлен,
      // то завершаем обход
      if (isResponseSent(response)) {
        result = response;
        break;
      }
      // если выполняется первый хук, или предыдущий
      // хук вернул пустое значение, то выполняем
      // следующий, записывая возвращаемое
      // значение в результат
      if (result == null) {
        result = hook(...args);
      }
      // если какой-то из предыдущих хуков вернул
      // Promise, то последующие значения будут
      // оборачиваться именно им
      else if (isPromise(result)) {
        result = result.then(prevVal => {
          // если ответ уже был отправлен,
          // то останавливаем выполнение
          if (isResponseSent(response)) {
            result = response;
            return;
          }
          // если предыдущий Promise вернул значение
          // отличное от "undefined" и "null",
          // то завершаем обход
          if (prevVal != null) return prevVal;
          return hook(...args);
        });
      }
      // если предыдущий хук вернул значение
      // отличное от "undefined" и "null",
      // то завершаем обход
      else {
        break;
      }
    }
    return result;
  }
}
