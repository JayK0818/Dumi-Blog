---
title: 其他
group:
  title: Package
order: 100
---

## Chalk

  Terminal string styling done right

```js
import chalk from 'chalk';
console.log(chalk.blue('Hello world!'));
```

[chalk](https://github.com/chalk/chalk)

## validate-npm-package-name

   Give me a string an I'll tell you if it's a valid npm package name.

[validate-npm-package-name](https://www.npmmirror.com/package/validate-npm-package-name)

## only-allow

   Force a specific package manager to be used on a project

```json
{
  "packageManager": "pnpm@9.11.0", // 指定包管理类型以及指定版本
   "scripts": {
      "preinstall": "npx only-allow pnpm"
   },
   "engines": { // 开发环境
      "node": "=16.15.1",
      "pnpm": "=7.5.1"
   },
   "peerDependencies": {
      "react": ">=16.8.0"
   }
}
```

## node-cron

Cron is a tool that allows you to execute something on a schedule. This is typically done using the cron syntax.

```shell
npm install cron --save
```

```js
import { CronJob } from 'cron'
const job = new CronJob('* * * * * *', function() {
  console.log('hello world!')
})
```

```js
// CronJob() 函数的一些方法
job.start(); // runs your job
job.stop(); // stops your job
job.lastDate(); // tells you the last execution date
job.nextDate(); // provides the next date that will trigger an **onTick**
```

## Events

**Event Emitter** package provides a simple observer implementation, allowing you to subscribe and listen for various events that occur in your application.

```js
npm install @nestjs/event-emitter

// app.module.ts
import { EventEmitterModule } from '@nestjs/event-emitter'
@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false // set this to 'true' to use wildcards
    })
  ]
})

// event.controller.ts
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter'
@Controller()
export class EventController {
  constructor(eventEmitter: EventEmitter2) {}
  // 触发事件
  this.eventEmitter.emit('order.created', 'hello world')
  // 监听事件 (listening to events)
  @OnEvent('order.created')
  handleOrderCreatedEvent(payload: string) {
    console.log(payload)  // hello world
  }
}

/**
 * options
*/
EventEmitterModule.forRoot({
  wildcard: true  // 可以使用数组/通配符 的方式触发事件
/**
 * this.eventEmitter(['order', 'created'], 'hello world')
 * this.eventEmitter('order.*', 'hello world')
*/
})
```

```js
@Controller()
export class {
  @OnEvent('**') // create an event listener that catches all events
  handleEverything(payload: any) {
    // handle and process an event
  }
}
```

## cross-env

  Runs scripts that set and use environment variables across platforms

```shell
npm install --save-dev cross-env
```

```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack --config build/webpack.config.js"
  }
}
```

  The **cross-env** module expose two bins: **cross-env** and **cross-env-shell**.

## morgan

  HTTP request logger middleware for node.js

```js
const morgan = require('morgan');

// using the predefined format string
morgan('tiny')

// using format string
morgan(':method :url :status :res[content-length] - :response-time ms');


// 接受tokens.type(req, res)的参数
morgan.token('type', (req, res) => {
  return req.headers['content-type']
})
morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms'
  ].join(' ')
})
```

## rotating-file-stream

  Creates a stream.Writable to a file which is rotated. Rotation behavior can be deeply customized.

  rfs.createStream(filename | Function, options)

```js
const rfs = require('rotating-file-stream')
const stream = rfs.createStream('file.log', {
  size: '10M',
  interval: '1d',
  compress: 'gzip'
})
```

  The most complex problem about file name is :how to call the rotated file name

```js
// 官网的一个demo, 定义生成日志文件名的逻辑
const pad = num => (num > 9 ? "" : "0") + num;
const generator = () => {
  const date = new Date()
  const month = time.getFullYear() + "" + pad(time.getMonth() + 1);
  const day = pad(time.getDate());
  const hour = pad(time.getHours());
  const minute = pad(time.getMinutes());
  return `${month}/${month}${day}-${hour}${minute}.log`;
};

const rfs = require("rotating-file-stream");
const stream = rfs.createStream(generator, {
  size: "10M",
  interval: "30m"
});
```

## EJS

  高效的嵌入式JavaScript模版引擎

[EJS](https://ejs.bootcss.com/#features)

## UUID-Online

  在线生成UUID字符的网站

[UUID-Online](https://www.uuid.online/)

## nrm

  npm register manager

[nrm](https://www.npmmirror.com/package/nrm)

[unplugin-auto-import](https://www.npmmirror.com/package/unplugin-auto-import) Register global imports on demand for vite and webpack

[mongo-express](https://github.com/mongo-express/mongo-express) A web-based MongoBD admin interface written with Node.js Express, and Bootstrap 5
