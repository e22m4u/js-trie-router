## @e22m4u/js-trie-router

ES-модуль HTTP роутера для Node.js, использующий
[Trie](https://en.wikipedia.org/wiki/Trie)
для разрешения маршрутов.

- Поддержка [path-to-regexp](https://github.com/pillarjs/path-to-regexp) синтаксиса.
- Автоматический парсинг JSON-тела запроса.
- Парсинг строки запроса и заголовка `cookie`.
- Поддержка `preHandler` и `postHandler` хуков.
- Позволяет использовать асинхронные обработчики.

## Установка

```bash
npm install @e22m4u/js-trie-router
```

Для загрузки ES-модуля требуется установить `"type": "module"` в файле
`package.json`, или использовать `.mjs` расширение.

## Обзор

Базовый пример создания экземпляра роутера, объявления маршрута
и передачи слушателя запросов `http` серверу.

```js
import http from 'http';
import {TrieRouter} from '@e22m4u/js-path-trie';

const server = new http.Server(); // создание экземпляра HTTP сервера
const router = new TrieRouter();  // создание экземпляра роутера

router.defineRoute({
  method: 'GET',                  // метод запроса "GET", "POST" и т.д.
  path: '/',                      // шаблон пути, пример "/user/:id"
  handler(ctx) {                  // обработчик маршрута
    return 'Hello world!';
  },
});

server.on('request', router.requestListener); // подключение роутера
server.listen(3000, 'localhost');             // прослушивание запросов

// Open in browser http://localhost:3000
```

### Контекст запроса

Первый параметр обработчика маршрута принимает экземпляр класса
`RequestContext` с набором свойств, содержащих разобранные
данные входящего запроса.

- `container: ServiceContainer` экземпляр [сервис-контейнера](https://npmjs.com/package/@e22m4u/js-service)
- `req: IncomingMessage` нативный поток входящего запроса
- `res: ServerResponse` нативный поток ответа сервера
- `params: ParsedParams` объект ключ-значение с параметрами пути
- `query: ParsedQuery` объект ключ-значение с параметрами строки запроса
- `headers: ParsedHeaders` объект ключ-значение с заголовками запроса 
- `cookie: ParsedCookie` объект ключ-значение разобранного заголовка `cookie`
- `method: string` метод запроса в верхнем регистре, например `GET`, `POST` и т.д.
- `path: string` путь включающий строку запроса, например `/myPath?foo=bar`
- `pathname: string` путь запроса, например `/myMath`

Пример доступа к контексту из обработчика маршрута.

```js
router.defineRoute({
  method: 'GET',
  path: '/users/:id',
  handler(ctx) {
    // GET /users/10?include=city
    // Cookie: foo=bar; baz=qux;
    console.log(ctx.req);      // IncomingMessage
    console.log(ctx.res);      // ServerResponse
    console.log(ctx.params);   // {id: 10}
    console.log(ctx.query);    // {include: 'city'}
    console.log(ctx.headers);  // {cookie: 'foo=bar; baz=qux;'}
    console.log(ctx.cookie);   // {foo: 'bar', baz: 'qux'}
    console.log(ctx.method);   // "GET"
    console.log(ctx.path);     // "/users/10?include=city"
    console.log(ctx.pathname); // "/users/10"
    // ...
  },
});
```

### Отправка ответа

Возвращаемое значение обработчика маршрута используется в качестве ответа
сервера. Тип значения влияет на представление возвращаемых данных. Например,
если результатом будет являться тип `object`, то такое значение автоматически
сериализуется в JSON.

| value     | content-type             |
|-----------|--------------------------|
| `string`  | text/plain               |
| `number`  | application/json         |
| `boolean` | application/json         |
| `object`  | application/json         |
| `Buffer`  | application/octet-stream |
| `Stream`  | application/octet-stream |

Пример возвращаемого значения обработчиком маршрута.

```js
router.defineRoute({     // регистрация маршрута
  // ...
  handler(ctx) {         // обработчик входящего запроса
    return {foo: 'bar'}; // ответ будет представлен в виде JSON
  },
});
```

Контекст запроса `ctx` содержит нативный экземпляр класса `ServerResponse`
модуля `http`, который может быть использован для ручного управления ответом.

```js
router.defineRoute({
  // ...
  handler(ctx) {
    res.statusCode = 404;
    res.setHeader('content-type', 'text/plain; charset=utf-8');
    res.end('404 Not Found', 'utf-8');
  },
});
```

### Хуки маршрута

Определение маршрута методом `defineRoute` позволяет задать хуки
для отслеживания и перехвата входящего запроса и ответа
конкретного маршрута.

- `preHandler` выполняется перед вызовом обработчика
- `postHandler` выполняется после вызова обработчика

#### preHandler

Перед вызовом обработчика маршрута может потребоваться выполнение
таких операции как авторизация и проверка параметров запроса. Для
этого можно использовать хук `preHandler`.

```js
router.defineRoute({ // регистрация маршрута
  // ...
  preHandler(ctx) {
    // вызывается перед обработчиком
    console.log(`Incoming request ${ctx.method} ${ctx.path}`);
    // Incoming request GET /myPath
  },
  handler(ctx) {
    return 'Hello world!';
  },
});
```

Если хук `preHandler` возвращает значение отличное от `undefined` и `null`,
то такое значение будет использовано в качестве ответа сервера, а вызов
обработчика маршрута будет пропущен.

```js
router.defineRoute({ // регистрация маршрута
  // ...
  preHandler(ctx) {
    // возвращение ответа сервера
    return 'Are you authorized?';
  },
  handler(ctx) {
    // данный обработчик не вызывается, так как
    // хук "preHandler" уже отправил ответ
  },
});
```

#### postHandler

Возвращаемое значение обработчика маршрута передается вторым аргументом
хука `postHandler`. По аналогии с `preHandler`, если возвращаемое
значение отличается от `undefined` и `null`, то такое значение будет
использовано в качестве ответа сервера. Это может быть полезно для
модификации возвращаемого ответа.

```js
router.defineRoute({
  // ...
  handler(ctx) {
    return 'Hello world!';
  },
  postHandler(ctx, data) {
    // выполняется после обработчика маршрута
    return data.toUpperCase(); // HELLO WORLD!
  },
});
```

### Глобальные хуки

Экземпляр роутера `TrieRouter` позволяет задать глобальные хуки, которые
имеют более высокий приоритет перед хуками маршрута, и вызываются
в первую очередь.

- `preHandler` выполняется перед вызовом обработчика
- `postHandler` выполняется после вызова обработчика

Добавить глобальные хуки можно методом `addHook` экземпляра роутера,
где первым параметром передается название хука, а вторым его функция.

```js
router.addHook('preHandler', (ctx) => {
  // вызов перед обработчиком маршрута
});

router.addHook('postHandler', (ctx, data) => {
  // вызов после обработчика маршрута
});
```

Аналогично хукам маршрута, если глобальный хук возвращает значение
отличное от `undefined` и `null`, то такое значение будет использовано
как ответ сервера.

## Отладка

Установка переменной `DEBUG` перед командой запуска включает вывод логов.

```bash
DEBUG=jsPathTrie* npm run test
```

## Тестирование

```bash
npm run test
```

## Лицензия

MIT
