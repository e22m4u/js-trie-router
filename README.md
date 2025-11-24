## @e22m4u/js-trie-router

![npm version](https://badge.fury.io/js/@e22m4u%2Fjs-trie-router.svg)
![license](https://img.shields.io/badge/license-mit-blue.svg)

HTTP маршрутизатор для Node.js на основе
[префиксного дерева](https://ru.wikipedia.org/wiki/Trie) (trie).

- Поддержка [path-to-regexp](https://github.com/pillarjs/path-to-regexp) синтаксиса.
- Автоматический парсинг JSON-тела запроса.
- Парсинг строки запроса и заголовка `Cookie`.
- Поддержка `preHandler` и `postHandler` хуков.
- Позволяет использовать асинхронные обработчики.

## Содержание

- [Установка](#установка)
- [Обзор](#обзор)
  - [Контекст запроса](#контекст-запроса)
  - [Отправка ответа](#отправка-ответа)
  - [Хуки маршрута](#хуки-маршрута)
    - [preHandler](#prehandler)
    - [postHandler](#posthandler)
  - [Глобальные хуки](#глобальные-хуки)
  - [Метаданные маршрута](#метаданные-маршрута)
  - [Состояние запроса](#состояние-запроса)
- [Отладка](#отладка)
- [Тестирование](#тестирование)
- [Лицензия](#лицензия)

## Установка

Требуется Node.js 16 и выше.

```bash
npm install @e22m4u/js-trie-router
```

Модуль поддерживает ESM и CommonJS стандарты.

*ESM*

```js
import {TrieRouter} from '@e22m4u/js-trie-router';
```

*CommonJS*

```js
const {TrieRouter} = require('@e22m4u/js-trie-router');
```

## Обзор

Базовый пример создания экземпляра роутера, объявления маршрута
и передачи слушателя запросов HTTP серверу.

```js
import http from 'http';
import {TrieRouter, HttpMethod} from '@e22m4u/js-trie-router';

const server = new http.Server(); // создание экземпляра HTTP сервера
const router = new TrieRouter();  // создание экземпляра роутера

router.defineRoute({
  method: HttpMethod.GET,   // метод запроса "GET", "POST" и т.д.
  path: '/',                // шаблон пути, пример "/user/:id"
  handler(ctx) {            // обработчик маршрута
    return 'Hello world!';
  },
});

server.on('request', router.requestListener); // подключение роутера
server.listen(3000, 'localhost');             // прослушивание запросов

// Open in browser http://localhost:3000
```

*i. Для указания метода запроса рекомендуется использовать
константу `HttpMethod`, чтобы избежать опечаток.*

### Контекст запроса

Первый параметр обработчика маршрута принимает экземпляр класса
`RequestContext` с набором свойств, содержащих разобранные
данные входящего запроса.

- `params: ParsedParams` объект ключ-значение с параметрами пути;
- `query: ParsedQuery` объект ключ-значение с параметрами строки запроса;
- `headers: ParsedHeaders` объект ключ-значение с заголовками запроса;
- `cookies: ParsedCookies` объект ключ-значение разобранного заголовка `Cookie`;
- `method: HttpMethod` метод запроса в верхнем регистре, например `GET`, `POST` и т.д.;
- `path: string` путь включающий строку запроса, например `/myPath?foo=bar`;
- `pathname: string` путь запроса, например `/myPath`;
- `body: unknown` тело запроса;

Дополнительные свойства:

- `container: ServiceContainer` экземпляр [сервис-контейнера](https://npmjs.com/package/@e22m4u/js-service);
- `request: IncomingMessage` нативный поток входящего запроса;
- `response: ServerResponse` нативный поток ответа сервера;
- `route: Route` экземпляр текущего маршрута;
- `meta: object` геттер для доступа к метаданным маршрута (`route.meta`);
- `state: object` объект для обмена данными между хуками и обработчиком;

Пример доступа к контексту из обработчика маршрута.

```js
router.defineRoute({
  method: HttpMethod.GET,
  path: '/users/:id',
  meta: {prop: 'value'},
  handler(ctx) {
    // GET /users/10?include=city
    // Cookie: foo=bar; baz=qux;
    console.log(ctx.params);    // {id: 10}
    console.log(ctx.query);     // {include: 'city'}
    console.log(ctx.headers);   // {cookie: 'foo=bar; baz=qux;'}
    console.log(ctx.cookies);   // {foo: 'bar', baz: 'qux'}
    console.log(ctx.method);    // "GET"
    console.log(ctx.path);      // "/users/10?include=city"
    console.log(ctx.pathname);  // "/users/10"
    // дополнительные свойства
    console.log(ctx.container); // ServiceContainer
    console.log(ctx.request);   // IncomingMessage
    console.log(ctx.response);  // ServerResponse
    console.log(ctx.route);     // Route
    console.log(ctx.meta);      // {prop: 'value'}
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
  // для доступа к свойству `response` (ServerResponse)
  // используется деструктуризация контекста запроса,
  // что аналогично записи handler(ctx) { ctx.response ... 
  handler({response}) {
    response.statusCode = 404;
    response.setHeader('content-type', 'text/plain; charset=utf-8');
    response.end('404 Not Found', 'utf-8');
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
    // перед обработчиком маршрута
    console.log(`Incoming request ${ctx.method} ${ctx.path}`);
    // > incoming request GET /myPath
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
    // данный обработчик не будет вызван, так как
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
    // после обработчика маршрута
    return data.toUpperCase(); // HELLO WORLD!
  },
});
```

### Глобальные хуки

Экземпляр роутера `TrieRouter` позволяет задать глобальные хуки, которые
имеют более высокий приоритет перед хуками маршрута, и вызываются
в первую очередь.

- `preHandler` выполняется перед вызовом обработчика каждого маршрута;
- `postHandler` выполняется после вызова обработчика каждого маршрута;

Добавить глобальные хуки можно методами экземпляра `TrieRouter`.

```js
router.addPreHandler((ctx) => {
  // перед обработчиком маршрута
});
router.addPostHandler((ctx, data) => {
  // после обработчика маршрута
});
```

Аналогично хукам маршрута, если глобальный хук возвращает значение
отличное от `undefined` и `null`, то такое значение будет использовано
как ответ сервера.

### Метаданные маршрута

Иногда требуется связать с маршрутом дополнительные, статические данные, которые
могут быть использованы хуками для расширения функционала. Например, это могут
быть схемы для валидации данных, правила доступа или настройки кэширования.
Для этой цели определение маршрута поддерживает необязательное свойство `meta`.

Маршрутизатор передает в контекст запроса найденный маршрут. Контекст,
в свою очередь, предоставляет доступ к мета-данным этого маршрута через
свойство `meta`, откуда их могут прочитать обработчики или хуки.

```js
import http from 'http';
import {TrieRouter, HttpMethod} from '@e22m4u/js-trie-router';

const server = new http.Server();
const router = new TrieRouter();

// глобальный pre-handler хук, который срабатывает
// перед основным обработчиком каждого маршрута
router.addPreHandler((ctx) => {
  // доступ к метаданным текущего маршрута
  console.log(ctx.meta); // {foo: 'bar'}
});

router.defineRoute({
  method: HttpMethod.GET,
  path: '/',
  meta: {foo: 'bar'}, // <= метаданные
  handler(ctx) {
    return 'Hello World!';
  },
});

server.on('request', router.requestListener);
server.listen(3000, 'localhost');
```

### Состояние запроса

Объект `ctx.state` инициализируется как пустой объект `{}` для каждого нового
запроса. Он предназначен для передачи динамических данных (например, профиля
пользователя после авторизации) из `preHandler` хуков в основной обработчик
маршрута или `postHandler` хуки.

```js
import http from 'http';
import {TrieRouter, HttpMethod} from '@e22m4u/js-trie-router';

const router = new TrieRouter();

// глобальный хук авторизации
router.addPreHandler((ctx) => {
  // логика получения пользователя (например, из заголовков)
  const user = {id: 1, name: 'John', role: 'admin'};
  // сохранение данных в state
  ctx.state.user = user;
});

router.defineRoute({
  method: HttpMethod.GET,
  path: '/profile',
  handler(ctx) {
    // доступ к данным, установленным в хуке
    const user = ctx.state.user;
    return `Hello, ${user.name}!`;
  },
});
```

## Отладка

Установка переменной `DEBUG` включает вывод логов.

```bash
DEBUG=jsTrieRouter* npm run test
```

## Тестирование

```bash
npm run test
```

## Лицензия

MIT
