import {RequestContext} from '../request-context.js';
import {IncomingMessage, ServerResponse} from 'http';
import {InvalidArgumentError} from '@e22m4u/js-format';
import {DebuggableService} from '../debuggable-service.js';
import {RouterHookRegistry, RouterHookType} from './router-hook-registry.js';

import {
  isPromise,
  isResponseSent,
  isReadableStream,
  isWritableStream,
} from '../utils/index.js';

/**
 * Router hook invoker.
 */
export class RouterHookInvoker extends DebuggableService {
  /**
   * Invoke on-request hooks.
   *
   * @param {IncomingMessage} request
   * @param {ServerResponse} response
   * @returns {Promise<boolean|undefined>|boolean|undefined}
   */
  invokeOnRequestHooks(request, response) {
    if (
      !request ||
      typeof request !== 'object' ||
      Array.isArray(request) ||
      !isReadableStream(request)
    ) {
      throw new InvalidArgumentError(
        'Parameter "request" must be an instance of IncomingMessage, ' +
          'but %v was given.',
        request,
      );
    }
    if (
      !response ||
      typeof response !== 'object' ||
      Array.isArray(response) ||
      !isWritableStream(response)
    ) {
      throw new InvalidArgumentError(
        'Parameter "response" must be an instance of ServerResponse, ' +
          'but %v was given.',
        response,
      );
    }
    // если ответ уже отправлен,
    // то вызов хуков прерывается
    if (isResponseSent(response)) {
      return;
    }
    // итерация по хукам выполняется по индексу,
    // чтобы знать, с какого места продолжать
    // в асинхронном режиме
    const hooks = this.getService(RouterHookRegistry).getHooks(
      RouterHookType.ON_REQUEST,
    );
    let isInterrupted = undefined;
    for (let i = 0; i < hooks.length; i++) {
      const hook = hooks[i];
      // вызов хука выполняется
      // в синхронном режиме
      const result = hook(request, response, this.container);
      // если ответ уже отправлен,
      // то вызов хуков прерывается
      if (isResponseSent(response)) {
        return;
      }
      // если синхронный вызов хука вернул значение отличное
      // от undefined, то требуется проверить данное значение
      // для коррекции режима вызова оставшихся хуков
      if (result !== undefined) {
        // если синхронный вызов хука вернул Promise, то дальнейшее
        // выполнение переключается в асинхронный режим, начиная
        // с индекса следующего хука
        if (isPromise(result)) {
          return this._continueOnRequestHooksInvocationAsync(
            hooks,
            i + 1,
            result,
            request,
            response,
          );
        }
        // если синхронный хук вернул значение true,
        // то выполняется установка флага прерывания
        // обработки запроса и выход из цикла
        if (result === true) {
          isInterrupted = result;
          break;
        }
        // если синхронный хук вернул значение, отличное
        // от логического, то выбрасывается ошибка
        if (result !== false) {
          throw new InvalidArgumentError(
            'Hook "onRequest" must return undefined or a Boolean, ' +
              'but %v was given.',
            result,
          );
        }
      }
    }
    // если все хуки были синхронными, то возвращается
    // значение флага прерывания обработки запроса
    // в результат вызова
    return isInterrupted;
  }

  /**
   * Continue on-request hooks invocation async.
   *
   * @param {Function[]} hooks
   * @param {number} startIndex
   * @param {Promise} initialPromise
   * @param {IncomingMessage} request
   * @param {ServerResponse} response
   * @returns {Promise<boolean|undefined>}
   */
  async _continueOnRequestHooksInvocationAsync(
    hooks,
    startIndex,
    initialPromise,
    request,
    response,
  ) {
    // ожидание Promise, который был получен
    // на предыдущем шаге (в синхронном режиме)
    let result = await initialPromise;
    // если ответ уже отправлен,
    // то вызов хуков прерывается
    if (isResponseSent(response)) {
      return;
    }
    // если Promise разрешился значением, отличным
    // от undefined, то в зависимости от значения,
    // цикл вызова хуков прерывается
    if (result !== undefined) {
      // если Promise разрешился значением true,
      // то данное значение немедленно возвращается
      if (result === true) {
        return result;
      }
      // если Promise вернул значение, отличное
      // от логического, то выбрасывается ошибка
      if (result !== false) {
        throw new InvalidArgumentError(
          'Hook "onRequest" must return undefined or a Boolean, ' +
            'but %v was given.',
          result,
        );
      }
    }
    // продолжение вызова хуков начиная
    // со следующего индекса (асинхронно)
    let isInterrupted = undefined;
    for (let i = startIndex; i < hooks.length; i++) {
      // с этого момента все синхронные
      // хуки выполняются как асинхронные
      result = await hooks[i](request, response, this.container);
      // если ответ уже отправлен,
      // то вызов хуков прерывается
      if (isResponseSent(response)) {
        return;
      }
      // если вызов хука вернул значение отличное
      // от undefined, то выполняется проверка
      // необходимости выхода из цикла
      if (result !== undefined) {
        // если хук вернул значение true, то выполняется
        // установка флага прерывания обработки запроса
        // и выход из цикла
        if (result === true) {
          isInterrupted = result;
          break;
        }
        // если хук вернул значение, отличное
        // от логического, то выбрасывается ошибка
        if (result !== false) {
          throw new InvalidArgumentError(
            'Hook "onRequest" must return undefined or a Boolean, ' +
              'but %v was given.',
            result,
          );
        }
      }
    }
    // передача флага прерывания обработки
    // запроса в результат вызова
    return isInterrupted;
  }

  /**
   * Последовательно вызывает глобальные хуки и хуки маршрута типа "preHandler",
   * пока один из них не вернет отличное от undefined значение или не отправит
   * HTTP-ответ. Метод выполняет хуки в синхронном режиме для улучшения
   * производительности. Если один из хуков возвращает Promise, выполнение
   * оставшейся части цепочки переключается в асинхронный режим.
   *
   * @param {import('../request-context.js').RequestContext} context
   * @returns {Promise<*>|*}
   */
  invokePreHandlerHooks(context) {
    if (!(context instanceof RequestContext)) {
      throw new InvalidArgumentError(
        'Parameter "context" must be an instance of RequestContext, ' +
          'but %v was given.',
        context,
      );
    }
    // если ответ уже отправлен,
    // то возвращается ServerResponse
    if (isResponseSent(context.response)) {
      return context.response;
    }
    // формирование списка вызываемых хуков,
    // в который сначала добавляются глобальные
    // хуки, а потом хуки маршрута
    const hooks = [
      ...this.getService(RouterHookRegistry).getHooks(
        RouterHookType.PRE_HANDLER,
      ),
      ...context.route.getHookRegistry().getHooks(RouterHookType.PRE_HANDLER),
    ];
    let result = undefined;
    // итерация по хукам выполняется по индексу,
    // чтобы знать, с какого места продолжать
    // в асинхронном режиме
    for (let i = 0; i < hooks.length; i++) {
      const hook = hooks[i];
      // вызов хука выполняется
      // в синхронном режиме
      result = hook(context);
      // если ответ уже отправлен,
      // то возвращается ServerResponse
      if (isResponseSent(context.response)) {
        return context.response;
      }
      // если синхронный вызов хука вернул значение отличное
      // от undefined , то требуется проверить данное значение
      // для коррекции режима вызова оставшихся хуков
      if (result !== undefined) {
        // если синхронный вызов хука вернул Promise, то дальнейшее
        // выполнение переключается в асинхронный режим, начиная
        // с индекса следующего хука
        if (isPromise(result)) {
          return this._continuePreHandlerHooksInvocationAsync(
            hooks,
            i + 1,
            result,
            context,
          );
        }
        // если синхронный хук вернул значение отличное
        // от undefined, то данное значение возвращается
        // в качестве результата
        return result;
      }
    }
    // все хуки были синхронными
    // и не вернули значения
    return;
  }

  /**
   * Асинхронно продолжает выполнение цепочки хуков "preHandler",
   * начиная с указанного индекса. Данный метод вызывается, когда
   * хук в основном синхронном цикле возвращает Promise. Метод ожидает
   * разрешения начального Promise, а затем последовательно выполняет
   * оставшиеся хуки в асинхронном режиме, следуя той же логике
   * прерывания (при получении значения или отправке ответа),
   * что и основной метод.
   *
   * @param {Function[]} hooks
   * @param {number} startIndex
   * @param {Promise} initialPromise
   * @param {import('../request-context.js').RequestContext} context
   * @returns {Promise<*>}
   */
  async _continuePreHandlerHooksInvocationAsync(
    hooks,
    startIndex,
    initialPromise,
    context,
  ) {
    // ожидание Promise, который был получен
    // на предыдущем шаге (в синхронном режиме)
    let result = await initialPromise;
    // если ответ уже отправлен,
    // то возвращается ServerResponse
    if (isResponseSent(context.response)) {
      return context.response;
    }
    // если Promise разрешился значением отличным
    // от undefined, то данное значение возвращается
    // в качестве результата
    if (result !== undefined) {
      return result;
    }
    // продолжение вызова хуков начиная
    // со следующего индекса (асинхронно)
    for (let i = startIndex; i < hooks.length; i++) {
      // с этого момента все синхронные
      // хуки выполняются как асинхронные
      result = await hooks[i](context);
      // если ответ уже отправлен,
      // то возвращается ServerResponse
      if (isResponseSent(context.response)) {
        return context.response;
      }
      // если хук вернул значение отличное от undefined,
      // то данное значение возвращается в качестве
      // результата
      if (result !== undefined) {
        return result;
      }
    }
    return;
  }

  /**
   * Invoke post-handler hooks.
   *
   * @param {import('../request-context.js').RequestContext} context
   * @param {*} initialData
   * @returns {Promise<*>|*}
   */
  invokePostHandlerHooks(context, initialData) {
    if (!(context instanceof RequestContext)) {
      throw new InvalidArgumentError(
        'Parameter "context" must be an instance of RequestContext, ' +
          'but %v was given.',
        context,
      );
    }
    // если ответ уже отправлен,
    // то возвращается ServerResponse
    if (isResponseSent(context.response)) {
      return context.response;
    }
    // формирование списка вызываемых хуков,
    // в который сначала добавляются хуки маршрута,
    // а потом глобальные хуки
    const hooks = [
      ...context.route.getHookRegistry().getHooks(RouterHookType.POST_HANDLER),
      ...this.getService(RouterHookRegistry).getHooks(
        RouterHookType.POST_HANDLER,
      ),
    ];
    let currentData = initialData;
    // итерация по хукам выполняется по индексу,
    // чтобы знать, с какого места продолжать
    // в асинхронном режиме
    for (let i = 0; i < hooks.length; i++) {
      const hook = hooks[i];
      // вызов хука выполняется
      // в синхронном режиме
      const result = hook(context, currentData);
      // если ответ уже отправлен,
      // то возвращается ServerResponse
      if (isResponseSent(context.response)) {
        return context.response;
      }
      // если синхронный вызов хука вернул значение отличное
      // от undefined , то требуется проверить данное значение
      // для коррекции режима вызова оставшихся хуков
      if (result !== undefined) {
        // если синхронный вызов хука вернул Promise, то дальнейшее
        // выполнение переключается в асинхронный режим, начиная
        // с индекса следующего хука
        if (isPromise(result)) {
          return this._continuePostHandlerHooksInvocationAsync(
            hooks,
            i + 1,
            result,
            context,
            currentData,
          );
        }
        // если синхронный хук вернул значение отличное
        // от undefined, то данное значение подменяет
        // ответ обработчика
        currentData = result;
      }
    }
    // если все хуки были синхронными
    // то возвращается итоговое значение
    return currentData;
  }

  /**
   * Continue post-handler hooks invocation async.
   *
   * @param {Function[]} hooks
   * @param {number} startIndex
   * @param {Promise} initialPromise
   * @param {import('../request-context.js').RequestContext} context
   * @param {*} currentData
   * @returns {Promise<*>}
   */
  async _continuePostHandlerHooksInvocationAsync(
    hooks,
    startIndex,
    initialPromise,
    context,
    currentData,
  ) {
    // ожидание Promise, который был получен
    // на предыдущем шаге (в синхронном режиме)
    let result = await initialPromise;
    // если ответ уже отправлен,
    // то возвращается ServerResponse
    if (isResponseSent(context.response)) {
      return context.response;
    }
    // если Promise разрешился значением отличным
    // от undefined, то данное значение используется
    // вместо возвращаемых данных основного обработчика
    if (result !== undefined) {
      currentData = result;
    }
    // продолжение вызова хуков начиная
    // со следующего индекса (асинхронно)
    for (let i = startIndex; i < hooks.length; i++) {
      // с этого момента все синхронные
      // хуки выполняются как асинхронные
      result = await hooks[i](context, currentData);
      // если ответ уже отправлен,
      // то возвращается ServerResponse
      if (isResponseSent(context.response)) {
        return context.response;
      }
      // если хук вернул значение отличное от undefined,
      // то данное значение используется вместо возвращаемых
      // данных основного обработчика
      if (result !== undefined) {
        currentData = result;
      }
    }
    // возвращается итоговое значение
    // обработчика маршрута
    return currentData;
  }
}
