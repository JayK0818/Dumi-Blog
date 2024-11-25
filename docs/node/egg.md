---
nav: Node
---

# Egg

## 快速开始

```bash
mkdir egg-application
cd egg-application
npm init -y
pnpm add egg --save
pnpm add egg-bin --save-dev
```

```json
{
  "scripts": {
    "dev": "egg-bin dev",
    "start": "egg-bin dev --port 9000"
  }
}
```

[egg目录结构](https://www.eggjs.org/zh-CN/basics/structure)

## Controller

  Controller基类有下列属性:

1. ctx - 当前请求的 **Context** 实例
2. app - 应用的 **Application** 实例
3. config - 应用的配置
4. service - 应用所有的 **service**
5. logger - logger对象.

```js
// controller
const Controller = require('egg').Controller
class UserController extends Controller {
  async create () {
    // 获取参数
    const query = this.ctx.query
    const params = this.ctx.params
    // 访问/123?keywords=123
    /**
     * query { keywords: '123' }
       params: { id: '123' }
    */
  }
}
```

### Query

  当 Query String 中的key重复时, **ctx.query**只取第一次出现的值。
  **ctx.queries** 同样解析了 Query String, 但是不会丢弃任何重复数据, 而是将它们放进一个数组。

```js
console.log(this.ctx.query)
console.log(this.ctx.queries)
/**
 * {
 *  category: ['egg'],
 *  id: ['1', '2', ;3]
 * }
*/

// route params
// 请求: /user/123
console.log(this.ctx.params) // { id: 123 }
```

### Body

  框架内置了 **bodyParser**中间件。将解析到的数据挂载到 **ctx.request.body**上。

```js
// 修改bodyParser 对请求体大小的限制
// config/config.default.js
module.exports = {
  bodyParser: {
    jsonLimit: '1mb',
    formLimit: '1mb'
  },
  multipart: {
    mode: 'file', // 文件上传模式
    fileExtensions: ['.apk'] // 增加对 '.apk' 扩展名的文件支持
  }
}
```

### 参数校验

  参数校验是通过 **parameter**完成.

```js
const parameter = require('parameter')
const rule = {
  name: 'string',
  age: 'int',
  gender: ['male', 'female', 'unknown']
}
const errors = parameter.validate(rule, {
  name: 'hello',
  age: 30,
  gender: 'male'
})
```

  通过 **ctx.validate()** 直接对参数校验

```js
const { Controller } = require('egg')
class UserController extends Controller {
  async login () {
    const ctx = this.ctx
    ctx.validate({
      username: 'string',
      password: 'string',
      age: {
        type: 'int',
        max: 100,
        min: 18
      }
    })
    // 调用service
    await ctx.service.user.create(ctx.request.body)
  }
}
```

1. Service不是单例, 它是请求级别的对象。框架在每次请求中初次访问 **ctx.service.xxx**时才进行实例化。
2. 一个Service文件仅包含一个类, 该类通过 **module.exports** 导出
3. Service文件必须放在 **app/service**目录下。

### Response

```js
class UserController extends Controller {
  create () {
    // http状态码
    this.ctx.status = 200
    // 响应内容
    this.ctx.body = {
      name: 'egg',
      category: 'framework'
    }
    // 设置响应头
    this.ctx.set('show-response-time', Date.now())
  }
}
```

自定义Controller基类

```js
// app/core/base_controller.js
const { Controller } = require('egg')
class BaseController extends Controller {
  get user () {
    return this.ctx.session.user
  }
}
```

## Router

  Router主要用来描述请求URL和具体承担执行动作的Controller的对应关系。

```js
module.exports = app => {
  // router和controller的映射
  // app/controller/sub/post.js 可以在router中这样使用
  app.router.post('create', 'api/posts', app.controller.sub.post.create)
  // 简写形式
  app.router.post('create', 'sub.post.create')
  // 内部重定向
  app.router.redirect('/', '/home/index', 302)
  // 中间件的使用
  app.router.get('/search', app.middleware.uppercase(), app.controller.search.index)
}
```

## Service

  Service就是在复杂业务场景下做业务逻辑封装的一个抽象层, 抽象出的Service可以被多个Controller重复使用。

```js
const Service = require('egg').Service
class UserService extends Service {
  async find(id) {
    const user = await this.ctx.db.query(id)
  }
}
```

## Config

  Egg奉行 *约定优于配置*

  config.default.js
  config.prod.js
  config.dev.js

```js
// config/config.default.js 默认配置
module.exports = (app) => {
   /**
   * app {
      name: 'egg-application',
      baseDir: '/Users/root/Desktop/egg-application',
      env: 'local',
      scope: '',
      HOME: '/Users/root',
      pkg: {
        name: 'egg-application',
        version: '1.0.0',
        main: 'index.js',
        scripts: { dev: 'egg-bin dev --port 9090' },
        keywords: [],
        author: '',
        license: 'ISC',
        description: '',
        dependencies: { egg: '^3.28.0' },
        devDependencies: { 'egg-bin': '^6.10.0' }
      },
      root: '/Users/root/Desktop/egg-application'
    }
   * 
  */
}
```

  config.default.js 为默认配置文件, 所有环境都会加载这个配置文件。prod环境会加载 **config.prod.js** 和 **config.default.js**
  文件, **config.prod.js**会覆盖**config.default.js**的同名配置。

```js
// config.default.js
module.exports = {
  keys: 'key1, key2',   // cookie密钥
}
```

## 异常处理

  在app/middleware 目录下创建一个 **error_handler.js**文件, 创建一个中间件

```js
module.exports = () => {
 return async function errorHandler(ctx, next) {
  try {
   await next()
  } catch (err) {
   // 所有的异常都会触发 app 上的一个 error 事件，框架会记录一条错误日志
   ctx.app.emit('error', err, ctx)

   const status = err.status || 500
   // 在生产环境中，500 错误的详细内容不返回给客户端，因为可能含有敏感信息
   const error =
    status === 500 && ctx.app.config.env === 'prod'
     ? 'Internal Server Error'
     : Array.isArray(err.errors)
     ? err.errors.map((item) => item.message).join('/n')
     : err?.message

   // 从 error 对象读出各属性，设置到响应中
   ctx.body = {
    code: 0,
    msg: error,
   }
   ctx.status = status
  }
 }
}

// config/config.default.js
module.exports = {
  middleware: ['errorHandler'] // 加载中间件
}

// 通过 this.ctx.throw(500, error) 抛出异常
```

## Plugin

[egg-router-plus](https://www.npmmirror.com/package/egg-router-plus) provide sub router for egg

[egg-validate](https://www.npmmirror.com/package/egg-validate) validate plugin for egg

[parameter](https://github.com/node-modules/parameter) A parameter verify tools

[egg-router-group](https://github.com/zzzs/egg-router-group) have the ability to route group operations for egg.

[egg-mongoose](https://www.npmmirror.com/package/egg-mongoose) Egg's mongoose plugin
