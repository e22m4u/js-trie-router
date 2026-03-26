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
  - [Параметры маршрутизатора](#параметры-маршрутизатора)
  - [Контекст запроса](#контекст-запроса)
  - [Отправка ответа](#отправка-ответа)
  - [Парсинг тела запроса](#парсинг-тела-запроса)
  - [Жизненный цикл](#жизненный-цикл)
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

## Расширения

Расширение функционала выполняется с помощью NPM модулей.

| модуль                                                                                         | описание                                       |
|------------------------------------------------------------------------------------------------|------------------------------------------------|
| [@e22m4u/js-trie-router-cors](https://www.npmjs.com/package/@e22m4u/js-trie-router-cors)       | Модуль поддержки CORS (кросс-доменные запросы) |
| [@e22m4u/js-trie-router-openapi](https://www.npmjs.com/package/@e22m4u/js-trie-router-openapi) | Модуль для создания OpenAPI 3.1 документа      |

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

server.on('request', router.handleRequest); // подключение обработчика
server.listen(3000, 'localhost');           // прослушивание запросов

// Open in browser http://localhost:3000
```

*i. Для указания метода запроса рекомендуется использовать
константу `HttpMethod`, чтобы избежать опечаток.*

### Параметры маршрутизатора

Конструктор класса `TrieRouter` принимает необязательный объект с параметрами
в качестве первого аргумента. Параметры позволяют задать глобальные лимиты
и правила обработки входящих запросов.

```js
import {TrieRouter} from '@e22m4u/js-trie-router';

const router = new TrieRouter({
  // Устанавливает ограничение на размер входящего тела запроса
  // в байтах (значение по умолчанию: 524288). Если размер данных
  // превысит этот лимит, маршрутизатор автоматически прервет загрузку
  // и отправит клиенту ошибку 413 Payload Too Large.
  requestBodyBytesLimit: 512 * 1024, // 512kb
  // Указывает медиа-типы (заголовок Content-Type), которые встроенный
  // парсер должен игнорировать и оставить свойство ctx.body пустым.
  // Это полезно, если потоковую загрузку файлов или бинарных данных
  // планируется обрабатывать вручную или через сторонние библиотеки
  // (значение по умолчанию не содержит каких-либо медиа-типов).
  ignoredMediaTypes: [
    'application/octet-stream',
    'multipart/form-data',
  ],
});
```

При работе с глобальным сервис-контейнером, объект с параметрами необходимо
передавать вторым аргументом, как это показано ниже.

```js
import {TrieRouter} from '@e22m4u/js-trie-router';
import {ServiceContainer} from '@e22m4u/js-service';

const app = new ServiceContainer();
const router = app.getService(TrieRouter, {
  requestBodyBytesLimit: 512 * 1024,
});
```

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

### Парсинг тела запроса

Для разбора тела входящего запроса отслеживается заголовок `Content-Type`,
определяющий формат передаваемых данных. По умолчанию маршрутизатор включает
парсеры для следующих форматов:

- `application/json` разбирается как *JSON*;
- `text/plain` преобразуется в строку;

Если входящий запрос содержит данные, но для его формата не найден подходящий
парсер, маршрутизатор прервет обработку запроса и вернет ошибку
*415 Unsupported Media Type*.

```json
{
  "error": {
    "message": "Media type \"application/octet-stream\" is not supported."
  }
}
```

Чтобы избежать появления ошибки для форматов, которые предполагается
обрабатывать особым способом, предусмотрен параметр маршрутизатора
`ignoredMediaTypes` для игнорирования указанных медиа-типов. Параметр
позволяет пропустить встроенный парсинг, как это сделано в примере ниже.

```js
import {TrieRouter, HttpMethod} from '@e22m4u/js-trie-router';

// создание экземпляра маршрутизатора
// с указанием исключаемых медиа-типов
const router = new TrieRouter({
  ignoredMediaTypes: [
    'application/octet-stream',
    'multipart/form-data'
  ],
});

// регистрация маршрута для обработки файлов
router.defineRoute({
  method: HttpMethod.POST,
  path: '/upload',
  handler(ctx) {
    // свойство body остается пустым, далее
    // выполняется доступ к нативному потоку
    const stream = ctx.request;
    return 'OK';
  }
});
```

#### Регистрация пользовательского парсера

Для расширения поддерживаемых форматов предусмотрена возможность регистрации
пользовательской функции парсинга для определенного медиа-типа. Управление
такими функциями выполняется сервисом `RequestBodyParser`, который доступен
через глобальный контейнер маршрутизатора.

```js
// доступ к сервису через маршрутизатор
const bodyParser = router.getService(RequestBodyParser);
// bodyParser.defineParser(mediaType, parserFn); см. далее
```

Регистрируемая функция принимает извлеченные данные в виде строки и возвращает
преобразованный результат. Итоговое значение впоследствии будет доступно
в контексте обработки запроса.

```js
import queryString from 'querystring';
import {TrieRouter, HttpMethod, RequestBodyParser} from '@e22m4u/js-trie-router';

const router = new TrieRouter();
const bodyParser = router.getService(RequestBodyParser);

// регистрация парсера для обработки данных формы
bodyParser.defineParser(
  'application/x-www-form-urlencoded',
  (input) => queryString.parse(input),
);

// определение маршрута
router.defineRoute({
  method: HttpMethod.POST,
  path: '/submit',
  handler(ctx) {
    // свойство содержит результат
    // работы новой парсер-функции
    return ctx.body;
  }
});
```

### Жизненный цикл

Для понимания того, как маршрутизатор обрабатывает входящий запрос, ниже
представлен порядок выполнения внутреннего конвейера и всех доступных хуков.

**На этапе запуска приложения**

1. [Глобальные хуки `onDefineRoute`](#ondefineroute).  
  \- Вызываются при регистрации маршрута.

**При получении входящего HTTP-запроса**

1. [Глобальные хуки `onRequest`](#onrequest).  
  \- Вызываются до поиска маршрута и разбора входящих данных.

2. Поиск маршрута.  
  \- Если маршрут не найден, отправляется ответ `404`, а дальнейшая обработка
  прерывается.

3. Создание `RequestContext` и парсинг.  
  \- Создается экземпляр контекста, разбирается строка запроса, заголовки
  и извлекается тело запроса.

4. [Глобальные хуки `preHandler`](#prehandler-глобальный).  
  \- Вызываются последовательно. Если хук возвращает значение или отправляет
  ответ, цикл прерывается.

5. [Хуки маршрута `preHandler`](#prehandler-для-маршрута).   
  \- Вызываются для конкретного маршрута. Правила прерывания такие же,
  как у глобальных хуков.

6. Основной обработчик (функция `handler`).  
  \- Обработчик запроса вызывается для формирования ответа сервера.

7. [Хуки маршрута `postHandler`](#posthandler-для-маршрута).  
  \- Получают результат обработчика и могут трансформировать его перед
  отправкой.

8. [Глобальные хуки `postHandler`](#posthandler-глобальный).  
  \- Завершают цепочку трансформации ответа.

9. Отправка ответа.  
  \- Маршрутизатор сериализует итоговые данные, устанавливает заголовки
  и отправляет клиенту.

Процесс обработки запроса обернут в глобальный `try/catch` блок. Любая ошибка,
выброшенная на любом этапе (в хуках, при разборе тела или в самом обработчике),
будет перехвачена и передана в `RouterErrorSender` для формирования ответа
с ошибкой.

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

Если хук `preHandler` возвращает значение отличное от `undefined`, то такое
значение будет использовано в качестве ответа сервера, а вызов следующих хуков
и основного обработчика маршрута будет прерван.

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
то вызов следующих хуков и основного обработчика прерывается.

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

Данный хук выполняется после вызова основного обработчика маршрута
(или после `preHandler`, если тот завершил запрос досрочно). Его главной
задачей является перехват и трансформация данных перед отправкой клиенту.
Хук принимает контекст запроса первым аргументом, а вторым данные для отправки.

```js
router.defineRoute({
  method: HttpMethod.GET,
  path: '/hello',
  handler(ctx) {
    return 'Hello World!';
  },
  postHandler(ctx, data) {
    console.log(data); // > Hello World!
  },
});
```

В отличие от `preHandler`, хуки `postHandler` работают по принципу конвейера.
Значение, возвращаемое хуком (если оно отлично от `undefined`), автоматически
заменяет собой текущие данные. Обновленный результат передается следующему
зарегистрированному хуку.

```js
router.defineRoute({
  method: HttpMethod.GET,
  path: '/users/:id',
  handler(ctx) {
    // основной обработчик ничего не знает о формате ответа, 
    // он просто возвращает "сырые" данные из базы
    return {id: 1, name: 'John Doe', passwordHash: 'secret'};
  },
  postHandler: [
    // удаление чувствительных данных
    (ctx, data) => {
      const {passwordHash, ...safeUser} = data;
      // возврат безопасного объекта, который заменит собой
      // исходные данные и будет передан в следующий хук
      // (или отправлен клиенту, если следующего хука нет)
      return safeUser; 
    },
    // стандартизация ответа
    (ctx, data) => {
      return {success: true, payload: data};
    }
  ],
});

// итоговый JSON, который уйдет клиенту:
// {
//   "success": true,
//   "payload": {"id": 1, "name": "John Doe"}
// }
```

Единственным условием для досрочного прерывания вызова `postHandler` хуков
является принудительная отправка HTTP-ответа внутри самого хука с использованием
нативного объекта `ctx.response`. В таком случае выполнение оставшихся хуков
прерывается.

```js
router.defineRoute({
  method: HttpMethod.GET,
  path: '/report',
  handler() {
    // основной обработчик возвращает сырые данные
    return {status: 'pending', id: 123};
  },
  postHandler: [
    (ctx, data) => {
      // принудительная отправка ответа напрямую 
      // через нативный объект ServerResponse
      ctx.response.statusCode = 202;
      ctx.response.setHeader('Content-Type', 'text/plain; charset=utf-8');
      ctx.response.end('Отчет еще формируется, попробуйте позже.');
    },
    (ctx, data) => {
      // данный хук никогда не будет выполнен, так как ответ
      // уже был отправлен предыдущим хуком
      return {...data, formatted: true};
    },
  ],
});
```

### Глобальные хуки

Экземпляр маршрутизатора `TrieRouter` позволяет задавать глобальные хуки,
которые выполняются на различных этапах жизненного цикла.

- [`onDefineRoute`](#ondefineroute) выполняется перед регистрацией маршрута;
- [`onRequest`](#onrequest) выполняется при получении входящего HTTP-запроса;
- [`preHandler`](#prehandler-глобальный) выполняется перед вызовом обработчика каждого маршрута;
- [`postHandler`](#posthandler-глобальный) выполняется после вызова обработчика каждого маршрута;

Добавить глобальные хуки можно методом маршрутизатора `addHook`.

#### onDefineRoute

Перед регистрацией каждого маршрута выполняются хуки `onDefineRoute`. Данный
хук может быть только синхронным. В первый аргумент вызова передается копия
определения маршрута, а во второй экземпляр сервис-контейнера.

```js
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

#### onRequest

Глобальный хук `onRequest` выполняется самым первым при получении входящего
запроса. В этот момент маршрутизатор еще не начал поиск подходящего маршрута,
не разобрал тело запроса и не создавал `RequestContext` (контекст запроса).

Хук принимает три аргумента:

- `request: IncomingMessage` нативный экземпляр запроса;
- `response: ServerResponse` нативный экземпляр ответа;
- `container: ServiceContainer` сервис-контейнер приложения;

Это идеальное место для установки общих CORS-заголовков, раннего логирования
или блокировки нежелательных запросов (например, по IP).

```js
router.addHook(RouterHookType.ON_REQUEST, (req, res, container) => {
  // логирование входящего запроса до начала любой обработки
  console.log(`[Incoming]: ${req.method} ${req.url}`);
  // установка глобальных заголовков
  res.setHeader('X-Powered-By', 'TrieRouter');
});
```

Если хук отправляет ответ клиенту (например, вызывает `res.end()`) или явно
возвращает логическое значение `true`, маршрутизатор немедленно прерывает
обработку запроса. Поиск маршрута, чтение тела и вызов остальных хуков
выполнены не будут.

```js
router.addHook(RouterHookType.ON_REQUEST, (req, res) => {
  const clientIp = req.socket.remoteAddress;
  // пример блокировки запроса на самом раннем этапе
  if (clientIp === '192.168.0.100') {
    res.statusCode = 403;
    res.end('Access denied');
    return true; // прерывает дальнейшее выполнение
  }
});
```

Если хук `onRequest` возвращает значение, оно обязано быть логическим типом
или `undefined`. Также допускается `Promise`, разрешающийся этими значениями.
Попытка вернуть строку или объект приведет к выбросу ошибки.

#### preHandler (глобальный)

Глобальный хук `preHandler` вызывается перед каждым обработчиком маршрута,
и может быть полезен для аутентификации или других проверок доступа. Хук
будет вызван только в том случае, если для данного запроса найден
соответствующий маршрут.

```js
router.addHook(RouterHookType.PRE_HANDLER, (ctx) => {
  // вызывается перед каждым обработчиком маршрута
  const token = ctx.headers['Authorization'];
  if (token === 'secret-key') {
    ctx.state.authenticated = true;
  }
});
```

Если глобальный хук `preHandler` возвращает значение отличное от `undefined`,
то такое значение будет использовано как ответ сервера. При этом, вызов
следующих хуков и основного обработчика маршрута будет прерван.

```js
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

Глобальный хук `postHandler` работает по такому же принципу, как и одноименный
хук на уровне маршрута, но применяется абсолютно ко всем обработанным запросам.
Хук принимает контекст запроса первым аргументом, а вторым данные для отправки.

```js
router.addHook(RouterHookType.POST_HANDLER, (ctx, data) => {
  // GET /hello
  console.log(data); // > Hello World!
});

// регистрация маршрута
router.defineRoute({
  method: HttpMethod.GET,
  path: '/hello',
  handler() {
    return 'Hello World!';
  },
});
```

Глобальные хуки `postHandler` позволяют применять трансформацию ко всем ответам
маршрутизатора. Это может быть использовано для приведения ответов к единому
формату, когда результат работы любого маршрута автоматически оборачивается
в стандартизированную структуру с добавлением метаинформации.

```js
router.addHook(RouterHookType.POST_HANDLER, (ctx, data) => {
  // обертка ответа в единую структуру
  return {
    meta: {
      timestamp: Date.now(),
      path: ctx.pathname
    },
    data: data
  };
});

// регистрация маршрута
router.defineRoute({
  method: HttpMethod.GET,
  path: '/hello',
  handler() {
    return 'Hello World!';
  },
});

// запрос: GET /hello
// ответ сервера:
// { 
//   "meta": {"timestamp": 1672531200000, "path": "/hello"},
//   "data": "Hello World!" 
// }
```

Если внутри хука выполнена отправка HTTP-ответа через методы нативного
объекта `ctx.response` (например, для перенаправления), то выполнение
цепочки хуков немедленно прерывается, и все последующие хуки игнорируются.

```js
router.addHook(RouterHookType.POST_HANDLER, (ctx, data) => {
  // если обработчик вернул команду на редирект
  if (data === 'REDIRECT_TO_LOGIN') {
    // принудительная отправка ответа через ServerResponse
    ctx.response.statusCode = 302;
    ctx.response.setHeader('Location', '/login');
    ctx.response.end();
    // на данном этапе выполнение цепочки хуков прекращается
    return;
  }
  return data;
});

router.addHook(RouterHookType.POST_HANDLER, (ctx, data) => {
  // этот код не будет выполнен, если предыдущий хук
  // уже отправил ответ клиенту (вызвал ctx.response.end)
  return {result: data};
});

// регистрация маршрута
router.defineRoute({
  method: HttpMethod.GET,
  path: '/dashboard',
  handler() {
    return 'REDIRECT_TO_LOGIN';
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
  console.log(ctx.meta); // > {foo: 'bar'}
});

router.defineRoute({
  method: HttpMethod.GET,
  path: '/',
  meta: {foo: 'bar'}, // <= метаданные
  handler(ctx) {
    return 'Hello World!';
  },
});

server.on('request', router.handleRequest);
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
    console.log(ctx.meta); // > {access: 'admin'}
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

### Обработка ошибок

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

#### Перехват и логирование ошибок

По умолчанию маршрутизатор не выводит информацию об ошибках в консоль,
чтобы не нарушать формат логов приложения и не допускать утечки чувствительных
данных (например, токенов из заголовков запроса).

Если требуется реализовать собственное логирование, то можно переопределить
встроенный сервис `RouterErrorSender`. Для этого потребуется унаследовать
класс данного сервиса и подменить стандартную реализацию в контейнере
маршрутизатора.

```js
import {TrieRouter, RouterErrorSender} from '@e22m4u/js-trie-router';

// создание собственного сервиса обработки ошибок
class CustomErrorSender extends RouterErrorSender {
  send(request, response, error) {
    // логирование ошибки удобным способом
    console.error(`[Error on ${request.method} ${request.url}]:`, error);
    // вызов родительского метода для стандартной
    // отправки JSON-ответа с ошибкой клиенту
    super.send(request, response, error);
  }
}

const router = new TrieRouter();
// подмена стандартного сервиса новым экземпляром,
// передавая текущий контейнер в конструктор (обязательно)
router.setService(RouterErrorSender, new CustomErrorSender(router.container));
// ... регистрация маршрутов и запуск сервера
```

*При необходимости можно переопределить метод `send404(request, response)`,
чтобы отслеживать запросы к несуществующим маршрутам или изменять формат
ответа.*

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
