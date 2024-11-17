---
title: npm-package
group:
  title: 其他
  order: 10
---

## Chalk

  Terminal string styling done right

```js
import chalk from 'chalk';
console.log(chalk.blue('Hello world!'));
```

[chalk](https://github.com/chalk/chalk)

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

[Joi](https://joi.dev/)

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
