import http from 'http';
import {TrieRouter} from '../src/index.js';
import {HttpMethod} from '../src/route.js';

const router = new TrieRouter();

// регистрация роута для вывода
// переданных "query" параметров
router.defineRoute({
  method: HttpMethod.GET,
  path: '/showQuery',
  handler: ({query}) => query,
});

// создаем экземпляр HTTP сервера
// и подключаем обработчик запросов
const server = new http.Server();
server.on('request', router.requestListener);

// слушаем входящие запросы
// на указанный адрес и порт
const port = 3000;
const host = '0.0.0.0';
server.listen(port, host, function () {
  const cyan = '\x1b[36m%s\x1b[0m';
  console.log(cyan, 'Server listening on port:', port);
  console.log(cyan, 'Open in browser:', `http://${host}:${port}/showQuery?foo=bar&baz=qux`);
});
