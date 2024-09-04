import http from 'http';
import {TrieRouter} from '../src/index.js';
import {HTTP_METHOD} from '../src/route.js';

const router = new TrieRouter();

// регистрация роута для вывода
// переданных параметров пути
router.defineRoute({
  method: HTTP_METHOD.GET,
  path: '/showParams/:p1/:p2',
  handler: ({params}) => params,
});

// создаем экземпляр HTTP сервера
// и подключаем обработчик запросов
const server = new http.Server();
server.on('request', router.requestHandler);

// слушаем входящие запросы
// на указанный адрес и порт
const port = 3000;
const host = '0.0.0.0';
server.listen(port, host, function () {
  const cyan = '\x1b[36m%s\x1b[0m';
  console.log(cyan, 'Server listening on port:', port);
  console.log(cyan, 'Open in browser:', `http://${host}:${port}/showParams/foo/bar`);
});
