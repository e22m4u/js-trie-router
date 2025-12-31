import http from 'http';
import {TrieRouter, HttpMethod} from '../src/index.js';

const router = new TrieRouter();

// создание ветки маршрутизатора с адресом "api",
// указанный путь будет использован как префикс
// для маршрутов данной ветки
const apiBranch = router.createBranch({path: 'api'});

// определение маршрута в рамках ветки "api",
// маршрут будет доступен по адресу "/api/status"
apiBranch.defineRoute({
  method: HttpMethod.GET,
  path: '/status',
  handler: () => 'API is working',
});

// создание экземпляра HTTP сервера
// и подключение обработчика запросов
const server = new http.Server();
server.on('request', router.requestListener);

// прослушивание входящих запросов
// на указанный адрес и порт
const port = 3000;
const host = '0.0.0.0';
server.listen(port, host, function () {
  const cyan = '\x1b[36m%s\x1b[0m';
  console.log(cyan, 'Server listening on port:', port);
  console.log(
    cyan,
    'Open in browser:',
    `http://${host}:${port}/api/status`,
  );
});
