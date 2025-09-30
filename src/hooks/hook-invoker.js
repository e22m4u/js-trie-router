import {Route} from '../route.js';
import {Errorf} from '@e22m4u/js-format';
import {isPromise} from '../utils/index.js';
import {HookType} from './hook-registry.js';
import {HookRegistry} from './hook-registry.js';
import {isResponseSent} from '../utils/index.js';
import {DebuggableService} from '../debuggable-service.js';

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
    if (!Object.values(HookType).includes(hookType))
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
    // так как хуки роута выполняются
    // после глобальных, то объединяем
    // их в данной последовательности
    const hooks = [
      ...this.getService(HookRegistry).getHooks(hookType),
      ...route.hookRegistry.getHooks(hookType),
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
