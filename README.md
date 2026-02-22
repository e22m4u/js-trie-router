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
- Поддержка ветвления маршрутов с общим префиксом.

## Содержание

- [Установка](#установка)
- [Расширения](#расширения)
- [Использование](#использование)
  - [Контекст запроса](#контекст-запроса)
  - [Отправка ответа](#отправка-ответа)
  - [Хуки маршрута](#хуки-маршрута)
  - [Глобальные хуки](#глобальные-хуки)
  - [Метаданные маршрута](#метаданные-маршрута)
  - [Состояние запроса](#состояние-запроса)
  - [Ветвление маршрутов](#ветвление-маршрутов)
  - [Обработка ошибок](#обработка-ошибок)
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

## Использование

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
    console.log(ctx.state);     // {}
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

- [`preHandler`](#prehandler-для-маршрута) выполняется перед вызовом обработчика;
- [`postHandler`](#posthandler-для-маршрута) выполняется после вызова обработчика;

#### preHandler (для маршрута)

Перед вызовом обработчика маршрута может потребоваться выполнение
таких операции как авторизация и проверка параметров запроса. Для
этого можно использовать хук `preHandler`.

```js
router.defineRoute({ // регистрация маршрута
  // ...
  preHandler(ctx) {
    // перед обработчиком маршрута
    console.log(`Incoming request ${ctx.method} ${ctx.path}`);
    // > Incoming request GET /myPath
  },
  handler(ctx) {
    return 'Hello world!';
  },
});
```

Если хук `preHandler` возвращает значение отличное от `undefined` и `null`,
то такое значение будет использовано в качестве ответа сервера, а вызов
следующих хуков и основного обработчика маршрута будет прерван.

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
    throw new Error('Should not be called!');
  },
});
```

Допускается определение множества хуков `preHandler`, которые вызываются
последовательно перед основным обработчиком. В примере ниже используются
синхронные хуки, но маршрутизатор поддерживает и асинхронное выполнение,
при котором также сохраняется порядок вызова.

```js
router.defineRoute({ // регистрация маршрута
  // ...
  preHandler: [
    (ctx) => console.log('First hook invoked!'),
    (ctx) => console.log('Second hook invoked!'),
  ],
  handler(ctx) {
    // > First hook invoked!
    // > Second hook invoked!
    return 'OK';
  },
});
```

Кроме возвращаемого значения, маршрутизатор отслеживает состояние отправки
ответа через экземпляр `ServerResponse`. Если сервер уже отправил ответ,
то вызов следующих хуков и основного обработчика маршрута прерывается.

```js
router.defineRoute({ // регистрация маршрута
  // ...
  preHandler: [
    (ctx) => {
      // отправка ответа через ServerResponse
      ctx.response.statusCode = 200;
      ctx.response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      ctx.response.end('OK');
    },
    (ctx) => {
      // данный хук не будет вызван, так как
      // предыдущий уже отправил ответ 200 "OK"
      throw new Error('Should not be called!');
    }
  ],
  handler(ctx) {
    // основной обработчик не будет вызван, так как
    // хук "preHandler" уже отправил ответ 200 "OK"
    throw new Error('Should not be called!');
  },
});
```

#### postHandler (для маршрута)

Данный хук работает аналогично `preHandler`, с той лишь разницей,
что выполняется после вызова основного обработчика маршрута и позволяет
модифицировать его результат, который принимает вторым аргументом.

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

Экземпляр маршрутизатора `TrieRouter` позволяет задавать глобальные хуки,
которые имеют более высокий приоритет перед хуками маршрута, и выполняются
в первую очередь.

- [`onDefineRoute`](#ondefineroute) выполняется перед регистрацией маршрута;
- [`preHandler`](#prehandler-глобальный) выполняется перед вызовом обработчика каждого маршрута;
- [`postHandler`](#posthandler-глобальный) выполняется после вызова обработчика каждого маршрута;

Добавить глобальные хуки можно методом маршрутизатора `addHook`.

#### onDefineRoute

Перед регистрацией каждого маршрута выполняются хуки `onDefineRoute`. Данный
хук может быть только синхронным. В первый аргумент вызова передается копия
определения маршрута, а во второй экземпляр сервис-контейнера.

```js
import {TrieRouter, RouterHookType} form '@e22m4u/js-trie-router';

const router = new TrieRouter();

router.addHook(RouterHookType.ON_DEFINE_ROUTE, (routeDef, container) => {
  // выполняется перед добавлением маршрута
  console.log(routeDef);
  // {
  //   method: 'GET',
  //   path: '/users',
  //   handler() {...}
  //   ...
  // }
});

// router.defineRoute(...)
```

Возвращаемым значением данного хука может быть модифицированное определение
маршрута, либо `undefined`. Чтобы изменения параметров маршрута были учтены
маршрутизатором, требуется передать новое определение в качестве результата.

```js
import {TrieRouter, RouterHookType} form '@e22m4u/js-trie-router';

const router = new TrieRouter();

router.addHook(RouterHookType.ON_DEFINE_ROUTE, (routeDef, container) => {
  // позволяет модифицировать определение
  // маршрута в момент его регистрации
  routeDef.method = HttpMethod.POST;
  routeDef.path = '/myPath';
  routeDef.handler = () => 'OK';
  // так как аргументом "routeDef" является копия
  // оригинального определения, требуется передать
  // модифицированный аргумент в результат вызова
  return routeDef;
});

// router.defineRoute(...)
```

#### preHandler (глобальный)

Глобальный хук `preHandler` вызывается перед каждым обработчиком маршрута,
и может быть полезен для аутентификации или других проверок доступа. Хук
будет вызван только в том случае, если для данного запроса найден
соответствующий маршрут.

```js
import {TrieRouter, HttpMethod, RouterHookType} form '@e22m4u/js-trie-router';

const router = new TrieRouter();

router.addHook(RouterHookType.PRE_HANDLER, (ctx) => {
  // вызывается перед каждым обработчиком маршрута
  const token = ctx.headers['Authorization'];
  if (token === 'secret-key') {
    ctx.state.authenticated = true;
  }
});
```

Если глобальный хук `preHandler` возвращает значение отличное от `undefined`
и `null`, то такое значение будет использовано как ответ сервера. При этом,
вызов следующих хуков и основного обработчика маршрута будет прерван.

```js
import {TrieRouter, HttpMethod, RouterHookType} form '@e22m4u/js-trie-router';

const router = new TrieRouter();

router.addHook(RouterHookType.PRE_HANDLER, (ctx) => {
  // вызывается перед каждым обработчиком маршрута
  return 'Hello World!';
});

router.addHook(RouterHookType.PRE_HANDLER, (ctx) => {
  // данный хук не будет вызван, так как
  // предыдущий уже отправил ответ "Hello World!"
  throw new Error('Should not be called!');
});

// регистрация маршрута
router.defineRoute({
  method: HttpMethod.GET,
  path: '/',
  handler() {
    // данный обработчик не будет вызван, так как
    // глобальный хук уже отправил ответ "Hello World!"
    throw new Error('Should not be called!');
  },
});
```

Кроме возвращаемого значения, маршрутизатор отслеживает состояние отправки
ответа через экземпляр `ServerResponse`. Если сервер уже отправил ответ,
то вызов следующих хуков и основного обработчика маршрута будет прерван.

```js
import {TrieRouter, RouterHookType} form '@e22m4u/js-trie-router';

const router = new TrieRouter();

router.addHook(RouterHookType.PRE_HANDLER, (ctx) => {
  // отправка ответа через ServerResponse
  ctx.response.statusCode = 200;
  ctx.response.setHeader('Content-Type', 'text/plain; charset=utf-8');
  ctx.response.end('OK');
});

router.addHook(RouterHookType.PRE_HANDLER, (ctx) => {
  // данный хук не будет вызван, так как
  // предыдущий уже отправил ответ 200 "OK"
  throw new Error('Should not be called!');
});

// регистрация маршрута
router.defineRoute({
  method: HttpMethod.GET,
  path: '/',
  handler() {
    // данный обработчик не будет вызван, так как
    // глобальный хук уже отправил ответ 200 "OK"
    throw new Error('Should not be called!');
  },
});
```

#### postHandler (глобальный)

Данный хук работает аналогично `preHandler`, с той лишь разницей,
что выполняется после вызова основного обработчика маршрута и позволяет
модифицировать его результат, который принимает вторым аргументом.

```js
import {TrieRouter, RouterHookType} form '@e22m4u/js-trie-router';

const router = new TrieRouter();

router.addHook(RouterHookType.POST_HANDLER, (ctx, data) => {
  // вызывается после каждого обработчика маршрута
  return data.toUpperCase(); // 'HELLO WORLD!'
});

// регистрация маршрута
router.defineRoute({
  method: HttpMethod.GET,
  path: '/',
  handler() {
    return 'Hello World!';
  },
});
```

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

import {
  TrieRouter,
  HttpMethod,
  RouterHookType,
} from '@e22m4u/js-trie-router';

const server = new http.Server();
const router = new TrieRouter();

// глобальный pre-handler хук, который срабатывает
// перед основным обработчиком каждого маршрута
router.addHook(RouterHookType.PRE_HANDLER, (ctx) => {
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

import {
  TrieRouter,
  HttpMethod,
  RouterHookType,
} from '@e22m4u/js-trie-router';

const router = new TrieRouter();

// глобальный хук авторизации
router.addHook(RouterHookType.PRE_HANDLER, (ctx) => {
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

### Ветвление маршрутов

Механизм ветвления позволяет группировать маршруты по общему префиксу пути.
Созданная ветка предоставляет методы для объявления маршрутов и создания
вложенных веток. Параметры ветки объединяются с параметрами родителя.
Пути объединяются, массивы хуков объединяются, а объект метаданных
подвергается глубокому слиянию.

```js
const router = new TrieRouter();

// создание ветки для api
const apiBranch = router.createBranch({
  path: '/api',
  // опционально:
  //   preHandler: ...
  //   postHandler: ...
  //   meta: ...
});

// маршрут будет доступен по адресу /api/users
apiBranch.defineRoute({
  method: HttpMethod.GET,
  path: '/users',
  handler: () => 'Users list',
});
```

Ветки позволяют задавать общие хуки и метаданные для группы маршрутов.
Это удобно для реализации проверок авторизации или логирования в рамках
определенного раздела приложения.

```js
const adminBranch = router.createBranch({
  path: '/admin',
  meta: {access: 'admin'}, // общие метаданные
  preHandler: (ctx) => {
    // проверка прав доступа для всей ветки
  },
});

adminBranch.defineRoute({
  method: HttpMethod.GET,
  path: '/dashboard',
  handler: (ctx) => {
    // маршрут наследует префикс /admin и метаданные
    console.log(ctx.meta); // {access: 'admin'}
    return 'Dashboard';
  },
});

// GET /admin/dashboard
```

Допускается создание вложенных веток любой глубины.

```js
    
const apiBranch = router.createBranch({path: '/api'});
const v1Branch = apiBranch.createBranch({path: '/v1'});

v1Branch.defineRoute({
  method: HttpMethod.GET,
  path: '/status',
  handler: () => 'API v1 working',
});

// GET /api/v1/status
```

## Обработка ошибок

Маршрутизатор автоматически перехватывает любые ошибки, выброшенные из хуков
или обработчика маршрута. По умолчанию, любая ошибка приводит к ответу сервера
со статусом *500 Internal Server Error*.

Для более гибкого управления HTTP-статусами рекомендуется использовать
библиотеку [http-errors](https://www.npmjs.com/package/http-errors).
Стандартный обработчик ошибок спроектирован для работы с данной библиотекой
и автоматически извлекает `statusCode`, `message` и другие свойства ошибки.

```js
import HttpErrors from 'http-errors';

router.defineRoute({
  method: HttpMethod.GET,
  path: '/users/:id',
  handler(ctx) {
    const {id} = ctx.params;
    const user = findUserById(id); // логика поиска пользователя
    if (!user) {
      // выброс ошибки 404 Not Found
      // маршрутизатор перехватит ее и отправит JSON-ответ
      throw new HttpErrors.NotFound('Пользователь не найден');
    }
    if (!hasAccess(ctx.state.currentUser, user)) {
      // ошибка 403 Forbidden с дополнительными данными
      // свойства "code" и "details" будут добавлены к ответу
      const error = new HttpErrors.Forbidden('Доступ запрещен');
      error.code = 'ACCESS_DENIED';
      error.details = {reason: 'Недостаточно прав'};
      throw error;
    }
    return user;
  },
});
```

Структура ответа будет зависеть от данных, содержащихся в объекте ошибки.
Например, первая ошибка из примера выше `HttpErrors.NotFound` приведет
к ответу со статусом `404` и телом, содержащим указанное сообщение.

```json
{
  "error": {
    "message": "Пользователь не найден"
  }
}
```

Если объект ошибки содержит дополнительные поля (например, `details`
или `code`), они автоматически включаются в ответ. Что позволяет
передавать клиенту более детальную информацию.

```json
{
  "error": {
    "code": "ACCESS_DENIED",
    "message": "Доступ запрещен",
    "details": {
      "reason": "Недостаточно прав"
    }
  }
}
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
