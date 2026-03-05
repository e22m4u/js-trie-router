import {format} from '@e22m4u/js-format';
import {DebuggableService} from '../debuggable-service.js';
import {isReadableStream, toPascalCase} from '../utils/index.js';

/**
 * Router data sender.
 */
export class RouterDataSender extends DebuggableService {
  /**
   * Send.
   *
   * @param {import('http').ServerResponse} response
   * @param {*} data
   * @returns {undefined}
   */
  send(response, data) {
    const debug = this.getDebuggerFor(this.send);
    // если ответ контроллера является объектом ServerResponse,
    // или имеются отправленные заголовки, то предполагается,
    // что контроллер уже отправил ответ самостоятельно
    if (data === response || response.headersSent) {
      debug('Skipping response because headers have already been sent.');
      return;
    }
    // если ответ контроллера пуст, то отправляется
    // статус 204 "No Content"
    if (data == null) {
      response.statusCode = 204;
      response.end();
      debug('Empty response has been sent.');
      return;
    }
    // если ответ контроллера является стримом,
    // то поток отправляет бинарные данные
    if (isReadableStream(data)) {
      // если заголовок "Content-Type" не определен ранее,
      // то устанавливается заголовок потоковых данных
      if (!response.getHeader('Content-Type')) {
        response.setHeader('Content-Type', 'application/octet-stream');
      }
      data.pipe(response);
      debug('Sending response with a Stream.');
      return;
    }
    // подготовка данных перед отправкой, и установка
    // нужного заголовка в зависимости от их типа
    let debugMsg;
    switch (typeof data) {
      case 'number':
      case 'boolean':
      case 'object':
        // для бинарных данных предусмотрен специальный "Content-Type",
        // который устанавливается автоматически, если не был определен
        // ранее (к примеру, в обработчике маршрута)
        if (Buffer.isBuffer(data)) {
          if (!response.getHeader('Content-Type')) {
            response.setHeader('Content-Type', 'application/octet-stream');
          }
          debugMsg = 'Buffer has been sent as binary data.';
        }
        // объекты, массивы, числа и логические значения
        // отправляются в виде JSON строки, с соответствующим
        // заголовком "Content-Type" (если не был определен)
        else {
          if (!response.getHeader('Content-Type')) {
            response.setHeader('Content-Type', 'application/json');
          }
          debugMsg = format(
            '%v has been sent as JSON.',
            toPascalCase(typeof data),
          );
          data = JSON.stringify(data);
        }
        break;
      default:
        if (!response.getHeader('Content-Type')) {
          response.setHeader('Content-Type', 'text/plain');
        }
        debugMsg = 'Response data has been sent as plain text.';
        data = String(data);
        break;
    }
    // отправка подготовленных данных
    response.end(data);
    debug(debugMsg);
  }
}
