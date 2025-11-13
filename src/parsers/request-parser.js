import {IncomingMessage} from 'http';
import {Errorf} from '@e22m4u/js-format';
import {isPromise} from '../utils/index.js';
import {BodyParser} from './body-parser.js';
import {QueryParser} from './query-parser.js';
import {CookiesParser} from './cookies-parser.js';
import {DebuggableService} from '../debuggable-service.js';

/**
 * Request parser.
 */
export class RequestParser extends DebuggableService {
  /**
   * Parse.
   *
   * @param {IncomingMessage} request
   * @returns {Promise<object>|object}
   */
  parse(request) {
    if (!(request instanceof IncomingMessage))
      throw new Errorf(
        'The first argument of RequestParser.parse should be ' +
          'an instance of IncomingMessage, but %v was given.',
        request,
      );
    const data = {};
    const promises = [];
    // парсинг "query" выполняется с проверкой
    // значения, так как парсер может вернуть
    // Promise, и тогда придется разрывать
    // "eventLoop" с помощью "await"
    const parsedQuery = this.getService(QueryParser).parse(request);
    if (isPromise(parsedQuery)) {
      promises.push(parsedQuery.then(v => (data.query = v)));
    } else {
      data.query = parsedQuery;
    }
    // аналогично предыдущей операции, разбираем
    // данные заголовка "cookie" с проверкой
    // значения на Promise, и разрываем
    // "eventLoop" при необходимости
    const parsedCookies = this.getService(CookiesParser).parse(request);
    if (isPromise(parsedCookies)) {
      promises.push(parsedCookies.then(v => (data.cookies = v)));
    } else {
      data.cookies = parsedCookies;
    }
    // аналогично предыдущей операции, разбираем
    // тело запроса с проверкой результата
    // на наличие Promise
    const parsedBody = this.getService(BodyParser).parse(request);
    if (isPromise(parsedBody)) {
      promises.push(parsedBody.then(v => (data.body = v)));
    } else {
      data.body = parsedBody;
    }
    // что бы предотвратить модификацию
    // заголовков, возвращаем их копию
    data.headers = Object.assign({}, request.headers);
    // если имеются асинхронные операции, то результат
    // будет обернут в Promise, в противном случае
    // данные возвращаются сразу
    return promises.length ? Promise.all(promises).then(() => data) : data;
  }
}
