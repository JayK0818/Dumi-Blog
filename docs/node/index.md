---
nav: Node
---

# Node.js

单线程 异步非阻塞 IO 配合事件回调通知(主线程是单线程)

```js
const http = require('http');
const sleep = (time) => {
  const t = Date.now() + time * 1000;
  while (Date.now() < t) {}
  return;
};

sleep(10); // 需要等待此函数执行完毕
const server = http.createServer((req, res) => {
  // ...
});
server.listen(3000, () => {});
```

## Install

We strongly recommend using a Node version manager like **nvm** to install Node.js and npm. We do not recommend using
a Node installer, since the Node installation process installs npm in a directory with local permissions and can cause
permissions errors when you run npm packages globally.

```shell
node -v
npm -v
```

## 镜像管理

```shell
npm install nrm -g

nrm ls  查看镜像源
nrm use <镜像名称>
npm config get registry (获取当前的镜像源)
```

## package.json

1. lists the packages your project depends on
2. specifies versions of a package that your project can use
3. makes your build reproducible, and therefore easier to share with other developers

```js
{
   "description": "包的描述", // 可以在npm.js搜索栏搜索关键字
   "keywords": ["lint", "cli"],  // 关键字
   "bin": "./bin/index.js",
   "main": "/main/index.js",     // 主入口
   "vue": "~3.2.1",  // 安装3.2的最新版本, 不低于3.2.1 但是不安装3.3, 安装时不改变大版本号和次要版本号
   "vue-router": "^4.2.1"  // 安装4.x.x的最新版本, 但是不安装5.x.x, 安装时不改变大版本号
   "vuex": "latest",  // 安装最新版本
}
```

主版本号.次要版本.修订号

1.  主版本号: 做了不兼容的 API 修改
2.  次版本: 做了向下兼容的功能性新增
3.  修订号: 向下兼容的问题修正

## Modules

A module is any file or directory in the _node_modules_ directory that can be loaded by the Node.js _require()_ function.

To be loaded by the Node.js _require()_ function, a module must be one of the following:

1.  A folder with a **package.json** file containing a **main** field.
2.  A JavaScript file.

## Login

```shell
npm login # 用户登录

npm whoami # to test you have successfully logged in.
```

## two-factor authentication

Two-factor authentication provides the best possible security for your account against attachers.

You can enable two-factor authentication on your npm user account to protect against unauthorized access to your account
and packages, either by using a **security-key** or **time-based one-time password** from mobile app.

```shell
npm profile enable-2fa auth-and-writes

npm profile enable-2fa auth-only

npm profile disable-2fa

# sending a one-time password from the command line
npm publish xxx --otp=123456
```

## Manage profile settings

```shell
# viewing user account profile settings from the command line

npm profile get

# updating user account profile settings from the command line
npm profile set email xxx@xx.com
npm profile set password 123456
```

## Scopes

When you sign up for an npm user account or create an organization, you are granted a scope that matches your user or organization name.
You can use this scope as a namespace for related packages.

A scope allows you to create a package with the same name as a package created by another user or organization without conflict.

@npm/package-name

Unscoped packages are always public.
Private packages are always scoped.

## Private packages

With npm private packages, you can use the npm registry to host code that is only visible to you and chosen collaborators,
allowing you to manage and use private code alongside public code in your projects.

1. User-scoped private packages
2. Organization-scoped private packages

[semver 版本文档](https://semver.org/lang/zh-CN/)

1. 0.0.1-alpha 内测(内部斑斑)
2. 0.0.1-beta 公测(测试版本)
3. 0.0.1-rc release candidate(即将作为正式版发布)
4. 0.0.1-lts 长期维护

## npm

```shell
npm view vue
npm view react    # 查看已经发布的一些包的信息
```
