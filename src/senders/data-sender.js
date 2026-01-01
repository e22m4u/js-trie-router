import {format} from '@e22m4u/js-format';
import {DebuggableService} from '../debuggable-service.js';
import {isReadableStream, toPascalCase} from '../utils/index.js';

/**
 * Data sender.
 */
export class DataSender extends DebuggableService {
  /**
   * Send.
   *
   * @param {import('http').ServerResponse} response
   * @param {*} data
   * @returns {undefined}
   */
  send(response, data) {
    const debug = this.getDebuggerFor(this.send);
    // если ответ контроллера является объектом
    // ServerResponse, или имеются отправленные
    // заголовки, то считаем, что контроллер
    // уже отправил ответ самостоятельно
    if (data === response || response.headersSent) {
      debug('Response skipped because headers already sent.');
      return;
    }
    // если ответ контроллера пуст, то отправляем
    // статус 204 "No Content"
    if (data == null) {
      response.statusCode = 204;
      response.end();
      debug('Empty response sent.');
      return;
    }
    // если ответ контроллера является стримом,
    // то отправляем его как бинарные данные
    if (isReadableStream(data)) {
      response.setHeader('Content-Type', 'application/octet-stream');
      data.pipe(response);
      debug('Stream response sent.');
      return;
    }
    // подготовка данных перед отправкой, и установка
    // нужного заголовка в зависимости от их типа
    let debugMsg;
    switch (typeof data) {
      case 'object':
      case 'boolean':
      case 'number':
        if (Buffer.isBuffer(data)) {
          // тип Buffer отправляется
          // как бинарные данные
          response.setHeader('content-type', 'application/octet-stream');
          debugMsg = 'Buffer sent as binary data.';
        } else {
          response.setHeader('content-type', 'application/json');
          debugMsg = format('%v sent as JSON.', toPascalCase(typeof data));
          data = JSON.stringify(data);
        }
        break;
      default:
        response.setHeader('content-type', 'text/plain');
        debugMsg = 'Response data sent as plain text.';
        data = String(data);
        break;
    }
    // отправка подготовленных данных
    response.end(data);
    debug(debugMsg);
  }
}
