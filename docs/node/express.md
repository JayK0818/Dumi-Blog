---
title: Express
---

  Express 是基于Node.js 平台 快速 开放 极简的Web开发框架

```js
const express = require('express')
const app = express()
/**
 * create a middleware that adds a X-Response-Time header to responses.
 */
app.use(responseTime())

// 设置模版引擎
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// 静态资源
app.use(
  express.static(path.join(__dirname, './public'), {
    extensions: ['html'],
  })
)
// 中间件
app.use((req, res, next) => {
  console.log(
    chalk.bold.yellow(`
    Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}
    Method: ${req.method}
    URL: ${req.url}`)
  )
  next()
})
// local variables within the application
app.locals.title = 'express application'

/**
 * This is a built-in middleware function in Express. It parses incoming
 * requests with JSON payloads and is based on body-parser.
*/
app.use(
  express.json({
    inflate: true, // enables or disables handling deflated (compressed) bodies
    limit: '200kb', // controls the maximum request body size
    reviver: null, // passed directly to JSON.parse as second argument.
    type: ['application/json'], // determine what media type the middleware will parse.
  })
)

/**
 * app.use(express.raw()) This is a built-in middleware function in Express,
 * It parses incoming request payloads into a Buffer
  app.use(express.text()) This is a built-in middleware function in Express,
  It parses incoming request payloads into a string
*/

/**
 * It parses incoming requests with urlencoded payloads and is based on body-parser.
 */
app.use(
  express.urlencoded({
    extended: true,
    // allows to choose between parsing the URL-encoded data
    // with the querystring library or the qs library
    type: 'application/x-www-form-urlencoded',
    // determine what media type the middleware will parse
    parameterLimit: 1000,
    // controls the maximum number of parameters
  })
)
```

## Middleware

  Middleware functions are functions that have access to the request, response object and the next function
  in applications's request-response cycle.

```js
// Application-level middleware
const app = express()
app.use((req, res, next) => {
  console.log('Time:', Date.now())
  next()
})
// 限定请求路径
app.use('/user', (req, res, next) => {
  next()
});

// 一个拦截响应的中间件
app.use((req, res, next) => {
  const _json = res.json
  res.json = data => {
    res.json = _json
    return res.json({
      code: 200,
      data,
      msg: 'success'
    })
  }
  next()
})

// Router-level middleware
const router = express.Router()

router.use(function (req, res, next) {
  next()
});
```

  It is important to ensure that Express catches all errors that occur while running route handlers and middleware.

```js
app.get('/', (req, res) => {
  throw new Error('Broken') // Express will catch this on its own
})

app.get('/', function (req, res, next) {
  fs.readFile('/file-does-not-exist', function (err, data) {
    if (err) {
      next(err) // Pass errors to Express.
    } else {
      res.send(data)
    }
  })
})
```

  Express comes with a built-in error handler that takes care of any errors that might be encountered in the app.
  This default error-handing middleware function is added at the end of the middleware function stack.

```js
app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
});

// 或者定义不同类别的错误处理中间件
app.use(logErrors)
app.use(clientErrorHandler)
app.use(errorHandler)

// 在某个路由中
const addTodo = (req, res, next) => {
/*   try {
    console.log(a)
    res.json('hello world!123456')
  } catch (err) {
    next(err)
  } */
  console.log(a)
  // 以上两种方式的错误都会被 错误中间件捕获
}

// 404处理
app.use((req, res, next) => {
  res.status(404).json({
    code: 0,
    message: 'Not Found'
  })
})
```

## Express-validator

  Express middleware for the validator module.

```shell
npm install express-validator
```

- body()
- cookie()
- header()
- param()
- query()

```js
// 验证错误
import { validationResult, query } from 'express-validator';

// .trim() 会删除字符串的空格
app.post('/hello', query('person').trim().notEmpty(), (req, res) => {
  const result = validationResult(req)
  // result to figure out if the request is valid of not
});

// 自定义验证
app.post(
  '/create-user',
  body('email').custom(async value => {
    // 判断用户是否已经注册
    const user = await UserCollection.findUserByEmail(value);
    if (user) {
      throw new Error('E-mail already in use');
    }
  }),
  (req, res) => {
    // Handle the request
  },
);

// ----- 当body中有多个参数需要校验时 -------------
const validate = validations => {
  return async (req, res, next) => {
    for (const validation of validations) {
      const result = await validation.run(req);
      if (!result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
      }
    }
    next();
  };
};
app.post('/sign', validate([
  body('email').isEmail(),
  body('password').isLength({ min: 6 })
]), async (req, res, next) => {
  const user = await User.create({ ... });
})
```

- isArray()
- isObject()
- isString()
- notEmpty()
- isEmail()
- isJWT()
- isLength({ min, max })

## connect-mongo

  MongoDB session store for Express and Connect.

```shell
npm install connect-mongo
```

```js
const session = require('express-session')
const MongoStore = require('connect-mongo')

app.use(session({
  // session-options,
  store: MongoStore.create({
    mongoUrl: 'mongodb://127.0.0.1:27017/mongodb',
    autoRemove: 'interval', // 自动删除过期的session
    autoRemoveInterval: 10, // 间隔 10分钟
    // 其他选项
    dbName: 'mongodb', // 数据库名称
    collectionName: 'sessions',   // 集合名称
  });
}))
```

## cors

  CORS is a node.js package for providing a middleware that can be used to enable CORS with various options.

```js
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors({
  origin: 'http://xxx.com',
  origin: function (origin, callback) {
    if (white_list.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('not allowed by CORS'))
    }
  },
  origin: ['http://www.x1.com', 'htp://www.x2.com'],
  // configures the Access-Control-Allow-Origin
  methods: 'GET,POST',
  // configures the Access-Control-Allow-Methods
  allowHeaders: ['Content-Type', 'Authorization'],
  // configures the Access-Control-Allow-Headers
  credentials: true,
  // Configures the Access-Control-Allow-Credentials
  maxAge: 5,
  // Configures the Access-Control-Max-Age
  preflightContinue: false
  // pass the CORS preflight response to the next handler.
}))
```

## body-parser

  Parse incoming request bodies in a middleware before your handlers, available
  under the **req.body** property.

```js
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: false
}))
// parse application/json
app.use(bodyParser.json())
```

## express-rate-limit

```js
const allowlist = ['192.168.0.56', '192.168.0.21']

import { limiter } from 'express-rate-limit'
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // How long to remember requests for, in milliseconds
  limit: 100, // how many requests to allow.
  message: 'hello world', // response to return after limit is reached
  legacyHeaders: true,  // enable the X-Rate-Limit header
  standardHeaders: 'draft-7',
  store: new MongoStore({
    uri: 'mongodb://127.0.0.1/mongodb',
    user: 'root',
    password: '123456',
    collectionName: 'rate-limit'
  }),
  skip(req, res) => { // 白名单跳过
    return allowlist.includes(req.ip),
  }
});
app.use(limiter)
```

## rate-limit-mongo

  MongoDB store for the **express-rate-limit** middleware.

```shell
npm install --save rate-limit-mongo
```

```js
const MongoStore = require('rate-limit-mongo')
const store = new MongoStore({
  uri: 'http://127.0.0.1:27017/mongodb',
  user: 'root',
  password: '123456',
  expireTimeMs: 15 * 60 * 1000, // should match windowMs
  collectionName: 'expressRateRecords', // name of collection for storing records
})
```

## express-session

```js
const session = require('express-session')
const express = require('express')

const app = express()
app.use(
  session({
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 2,
      sameSite: true,
      secure: false,
      // When setting this to true, clients will not send the cookie back to the server in the future if the browser done not have an HTTPS connection.
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    /**
     * Force the session to be saved back to the session store, even if the session was never
    modified during the request
    */
    rolling: false,
    // Force the session identifier cookie to be set on every response.
    // The expiration is reset to the original maxAge
    saveUninitialized: false,
    store: mongoStore.create({ // 存储session
      autoRemove: 'interval',
      autoRemoveInterval: 10, // in minutes
      mongoUrl: 'mongodb://127.0.0.1:27017/mongodb',
    }),
  })
)
```

## compression

  The following compression codings are supported:

  1. deflate
  2. gzip

  The middleware will attempt to compress response bodies for all requests that traverse through the middleware

```js
const app = require('express')()
const compression = require('compression')

app.use(compression({
  chunkSize: 1234,
  filter: () => true, // A function decide if the response should be considered for compression
  level: -1, // A higher level will result in better compression.(0 - 9)
  // -1 表示默认的压缩等级
  threshold: '1kb', // The byte threshold for the response body size before compression
  // is considered for the response (压缩的阈值)
}))
```

## helmet

  help secure Express/Connect apps with various Http headers

```js
const app = require('express')()
const helmet = require('helmet')

app.use(helmet({
  // configure the content-security-policy header
  contentSecurityPolicy: {
    directives: {
      "script-src": ["'self'", "example.com"],
    }
  },
  contentSecurityPolicy: false
}))
```

## Joi

  The most powerful schema description language and data validator for JavaScript.

```js
const Joi = require('joi')
const schema = Joi.object({
  username: Joi.string()
    .min(3)
    .max(30),
  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
  access_token: [Joi.string(), Joi.number()]
});

// validate
schema.validate({ username: 'hello', password: '12345' })
```

[express中文官网](https://www.expressjs.com.cn/)

[Twelve-Factor](https://12factor.net/config)

[express-validator](https://express-validator.github.io/docs/) - Express middleware for the validator module.

[express中间件列表](https://www.expressjs.com.cn/resources/middleware.html)

[express-rate-limit](https://express-rate-limit.mintlify.app/overview) - Basic IP rating-limiting middleware for Express

[Awesome-Nodejs](https://github.com/Viure/awesome-nodejs)

[connect-mongo](https://www.npmmirror.com/package/connect-mongo) - MongoDB session store for Express and Connect

[cors](https://www.npmmirror.com/package/cors/home) - Node.jsCORS middleware

[body-parser](https://www.npmmirror.com/package/body-parser) - Node.js body parsing middleware

[formidable](https://www.npmmirror.com/package/formidable) - A Node.js module for parsing form data, especially file uploads

[rate-limit-mongo](https://www.npmjs.com/package/rate-limit-mongo) - MongoDB store for the express-rate-limit middleware

[express-session](https://www.npmmirror.com/package/express-session) - Simple session middleware for express

[compression](https://www.npmmirror.com/package/compression) - Node.js compression middleware

[helmet](https://www.npmmirror.com/package/helmet) - help secure Express/Connect apps with various HTTP headers.

[joi](https://joi.dev/) - Object schema validation
