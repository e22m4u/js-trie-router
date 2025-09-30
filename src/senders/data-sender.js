import {format} from '@e22m4u/js-format';
import {isReadableStream} from '../utils/index.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Data sender.
 */
export class DataSender extends DebuggableService {
  /**
   * Send.
   *
   * @param {import('http').ServerResponse} res
   * @param {*} data
   * @returns {undefined}
   */
  send(res, data) {
    const debug = this.getDebuggerFor(this.send);
    // если ответ контроллера является объектом
    // ServerResponse, или имеются отправленные
    // заголовки, то считаем, что контроллер
    // уже отправил ответ самостоятельно
    if (data === res || res.headersSent) {
      debug(
        'Response sending was skipped because ' +
          'its headers where sent already.',
      );
      return;
    }
    // если ответ контроллера пуст, то отправляем
    // статус 204 "No Content"
    if (data == null) {
      res.statusCode = 204;
      res.end();
      debug('The empty response was sent.');
      return;
    }
    // если ответ контроллера является стримом,
    // то отправляем его как бинарные данные
    if (isReadableStream(data)) {
      res.setHeader('Content-Type', 'application/octet-stream');
      data.pipe(res);
      debug('The stream response was sent.');
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
          res.setHeader('content-type', 'application/octet-stream');
          debugMsg = 'The Buffer was sent as binary data.';
        } else {
          res.setHeader('content-type', 'application/json');
          debugMsg = format('The %v was sent as JSON.', typeof data);
          data = JSON.stringify(data);
        }
        break;
      default:
        res.setHeader('content-type', 'text/plain');
        debugMsg = 'The response data was sent as plain text.';
        data = String(data);
        break;
    }
    // отправка подготовленных данных
    res.end(data);
    debug(debugMsg);
  }
}
