import HttpErrors from 'http-errors';
import {IncomingMessage} from 'http';
import {Errorf} from '@e22m4u/js-format';
import {createError} from './create-error.js';
import {parseContentType} from './parse-content-type.js';

/**
 * Character encoding list.
 */
export const CHARACTER_ENCODING_LIST = [
  'ascii',
  'utf8',
  'utf-8',
  'utf16le',
  'utf-16le',
  'ucs2',
  'ucs-2',
  'latin1',
];

/**
 * Fetch request body.
 *
 * @param {IncomingMessage} req
 * @param {number} bodyBytesLimit
 * @returns {Promise<string|undefined>}
 */
export function fetchRequestBody(req, bodyBytesLimit = 0) {
  if (!(req instanceof IncomingMessage))
    throw new Errorf(
      'The first parameter of "fetchRequestBody" should be ' +
        'an IncomingMessage instance, but %v was given.',
      req,
    );
  if (typeof bodyBytesLimit !== 'number')
    throw new Errorf(
      'The parameter "bodyBytesLimit" of "fetchRequestBody" ' +
        'should be a number, but %v was given.',
      bodyBytesLimit,
    );
  return new Promise((resolve, reject) => {
    // сравнение внутреннего ограничения
    // размера тела запроса с заголовком
    // "content-length"
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    if (bodyBytesLimit && contentLength && contentLength > bodyBytesLimit)
      throw createError(
        HttpErrors.PayloadTooLarge,
        'Request body limit is %s bytes, but %s bytes given.',
        bodyBytesLimit,
        contentLength,
      );
    // определение кодировки
    // по заголовку "content-type"
    let encoding = 'utf-8';
    const contentType = req.headers['content-type'] || '';
    if (contentType) {
      const parsedContentType = parseContentType(contentType);
      if (parsedContentType && parsedContentType.charset) {
        encoding = parsedContentType.charset.toLowerCase();
        if (!CHARACTER_ENCODING_LIST.includes(encoding))
          throw createError(
            HttpErrors.UnsupportedMediaType,
            'Request encoding %v is not supported.',
            encoding,
          );
      }
    }
    // подготовка массива загружаемых байтов
    // и счетчика для отслеживания их объема
    const data = [];
    let receivedLength = 0;
    // обработчик проверяет объем загружаемых
    // данных и складывает их в массив
    const onData = chunk => {
      receivedLength += chunk.length;
      if (bodyBytesLimit && receivedLength > bodyBytesLimit) {
        req.removeAllListeners();
        const error = createError(
          HttpErrors.PayloadTooLarge,
          'Request body limit is %v bytes, but %v bytes given.',
          bodyBytesLimit,
          receivedLength,
        );
        reject(error);
        return;
      }
      data.push(chunk);
    };
    // кода данные полностью загружены, нужно удалить
    // обработчики событий, и сравнить полученный объем
    // данных с заявленным в заголовке "content-length"
    const onEnd = () => {
      req.removeAllListeners();
      if (contentLength && contentLength !== receivedLength) {
        const error = createError(
          HttpErrors.BadRequest,
          'Received bytes do not match the "content-length" header.',
        );
        reject(error);
        return;
      }
      // объединение массива байтов в буфер, кодирование
      // результата в строку, и передача полученных данных
      // в ожидающий Promise
      const buffer = Buffer.concat(data);
      const body = buffer.toString(encoding);
      resolve(body || undefined);
    };
    // при ошибке загрузки тела запроса,
    // удаляются обработчики событий,
    // и отклоняется ожидающий Promise
    // ошибкой с кодом 400
    const onError = error => {
      req.removeAllListeners();
      reject(HttpErrors(400, error));
    };
    // добавление обработчиков прослушивающих
    // события входящего запроса и возобновление
    // потока данных
    req.on('data', onData);
    req.on('end', onEnd);
    req.on('error', onError);
    req.resume();
  });
}
