import {Route} from '../route/index.js';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {DebuggableService} from '../debuggable-service.js';
import {isPromise, isResponseSent} from '../utils/index.js';
import {RouterHookRegistry, RouterHookType} from './router-hook-registry.js';

/**
 * Router hook invoker.
 */
export class RouterHookInvoker extends DebuggableService {
  /**
   * Последовательно вызывает глобальные хуки и хуки маршрута указанного
   * типа, пока один из них не вернет отличное от undefined и null значение
   * или не отправит HTTP-ответ. Метод выполняет хуки в синхронном режиме
   * для улучшения производительности. Если один из хуков возвращает Promise,
   * выполнение оставшейся части цепочки переключается в асинхронный режим.
   *
   * @param {Route} route
   * @param {string} hookType
   * @param {import('http').ServerResponse} response
   * @param {*[]} args
   * @returns {Promise<*>|*}
   */
  invokeAndContinueUntilValueReceived(route, hookType, response, ...args) {
    if (!route || !(route instanceof Route)) {
      throw new InvalidArgumentError(
        'Parameter "route" must be an instance of Route, ' +
          'but %v was given.',
        route,
      );
    }
    if (!hookType || typeof hookType !== 'string') {
      throw new InvalidArgumentError(
        'Parameter "hookType" must be a non-empty String, ' +
          'but %v was given.',
        hookType,
      );
    }
    if (!Object.values(RouterHookType).includes(hookType)) {
      throw new InvalidArgumentError(
        'Hook type %v is not supported.',
        hookType,
      );
    }
    if (
      !response ||
      typeof response !== 'object' ||
      Array.isArray(response) ||
      typeof response.headersSent !== 'boolean'
    ) {
      throw new InvalidArgumentError(
        'Parameter "response" must be an instance of ServerResponse, ' +
          'but %v was given.',
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
      ...this.getService(RouterHookRegistry).getHooks(hookType),
      ...route.getHookRegistry().getHooks(hookType),
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
          return this._continueHooksInvocationAsync(
            hooks,
            i + 1,
            result,
            response,
            args,
          );
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

  /**
   * Асинхронно продолжает выполнение цепочки хуков, начиная с указанного
   * индекса. Данный метод вызывается, когда хук в основном синхронном цикле
   * возвращает Promise. Метод ожидает разрешения начального Promise, а затем
   * последовательно выполняет оставшиеся хуки в асинхронном режиме, следуя
   * той же логике прерывания (при получении значения или отправке ответа),
   * что и основной метод.
   *
   * @param {Function[]} hooks
   * @param {number} startIndex
   * @param {Promise} initialPromise
   * @param {import('http').ServerResponse} response
   * @param {*} args
   * @returns {Promise<*>}
   */
  async _continueHooksInvocationAsync(
    hooks,
    startIndex,
    initialPromise,
    response,
    args,
  ) {
    // ожидание Promise, который был получен
    // на предыдущем шаге (в синхронном режиме)
    let result = await initialPromise;
    // если ответ уже отправлен,
    // то возвращается ServerResponse
    if (isResponseSent(response)) {
      return response;
    }
    // если Promise разрешился значением отличным
    // от undefined и null, то данное значение
    // возвращается в качестве результата
    if (result != null) {
      return result;
    }
    // продолжение вызова хуков начиная
    // со следующего индекса (асинхронно)
    for (let i = startIndex; i < hooks.length; i++) {
      // с этого момента все синхронные
      // хуки выполняются как асинхронные
      result = await hooks[i](...args);
      // если ответ уже отправлен,
      // то возвращается ServerResponse
      if (isResponseSent(response)) {
        return response;
      }
      // если хук вернул значение отличное
      // от undefined и null, то данное значение
      // возвращается в качестве результата
      if (result != null) {
        return result;
      }
    }
    return;
  }
}
