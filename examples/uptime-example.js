import http from 'http';
import {TrieRouter} from '../src/index.js';
import {HttpMethod} from '../src/route.js';

const router = new TrieRouter();

// регистрация маршрута для вывода
// времени работы сервера
router.defineRoute({
  method: HttpMethod.GET,
  path: '/',
  handler() {
    const uptimeSec = process.uptime();
    const days = Math.floor(uptimeSec / (60 * 60 * 24));
    const hours = Math.floor((uptimeSec / (60 * 60)) % 24);
    const mins = Math.floor((uptimeSec / 60) % 60);
    const secs = Math.floor(uptimeSec % 60);
    let res = 'Uptime';
    if (days) res += ` ${days}d`;
    if (days || hours) res += ` ${hours}h`;
    if (days || hours || mins) res += ` ${mins}m`;
    res += ` ${secs}s`;
    return res;
  },
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
  console.log(cyan, 'Open in browser:', `http://${host}:${port}`);
});
