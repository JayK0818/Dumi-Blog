---
nav: Node
group:
  title: 基础
---

# Global 对象

clearImmediate
setImmediate
clearInterval
clearTimeout
setInterval
setTimeout
atob
btoa
performance
fetch
crypto
**filename
**dirname

```js
console.log(global);

/**
 * <ref *1> Object [global] {
  global: [Circular *1],
  clearImmediate: [Function: clearImmediate],
  setImmediate: [Function: setImmediate] {
    [Symbol(nodejs.util.promisify.custom)]: [Getter]
  },
  clearInterval: [Function: clearInterval],
  clearTimeout: [Function: clearTimeout],
  setInterval: [Function: setInterval],
  setTimeout: [Function: setTimeout] {
    [Symbol(nodejs.util.promisify.custom)]: [Getter]
  },
  queueMicrotask: [Function: queueMicrotask],
  structuredClone: [Function: structuredClone],
  atob: [Getter/Setter],
  btoa: [Getter/Setter],
  performance: [Getter/Setter],
  fetch: [Function: fetch],
  crypto: [Getter]
}
 * 
*/

console.log(this, this === global); // 默认空对象 false

console.log(__dirname, __filename);

/**
 * /Users/jinkang/Desktop/javascript-study-notes/Node/global /Users/jinkang/Desktop/javascript-study-notes/Node/global/global.js
 */
console.log('----------------------------------');
(function () {
  console.log(arguments.callee.toString());
  console.log(this, global, this === global); // true
})();

console.log(JSON.stringify(arguments, null, 2));
/**
 * {
    "0": {},
    "2": {
      "id": ".",
      "path": "/Users/root/Desktop/javascript-study-notes/Node/global",
      "exports": {},
      "filename": "/Users/root/Desktop/javascript-study-notes/Node/global/global.js",
      "loaded": false,
      "children": [],
      "paths": [
        "/Users/root/Desktop/javascript-study-notes/Node/global/node_modules",
        "/Users/root/Desktop/javascript-study-notes/Node/node_modules",
        "/Users/root/Desktop/javascript-study-notes/node_modules",
        "/Users/root/Desktop/node_modules",
        "/Users/root/node_modules",
        "/Users/node_modules",
        "/node_modules"
      ]
    },
    "3": "/Users/root/Desktop/javascript-study-notes/Node/global/global.js",
    "4": "/Users/root/Desktop/javascript-study-notes/Node/global"
  }
 * 
*/
```

```js
const path = require('path');

console.log(__filename); // 当前文件路径
console.log(__dirname); // 当前文件夹路径

// console.log(process.env.__dirname)
// console.log(process.env.__filename)
console.log(process.pid); // 1442
console.log(process.platform); // darwin
console.log(process.arch); // arm64
console.log(process.title); // node
console.log(process.execPath); // /usr/local/bin/node

console.log('start');
setTimeout(() => {
  console.log('setTimeout');
}, 0);
console.log(process.cwd());
process.nextTick(() => {
  console.log('nextTick');
});
console.log('end');
/**
 * 1. start
 * 2. /Users/root/Desktop/javascript-study-notes/Node/global
 * 3. end
 * 4. nextTick
 * 5. setTimeout
 */

console.log(process.cwd() === __dirname); // true

// ----------- path -----------
console.log('-------- path start ---------');
console.log(path.dirname(__dirname));
// /Users/root/Desktop/javascript-study-notes/Node
console.log(path.dirname(__filename));
// /Users/root/Desktop/javascript-study-notes/Node/global
console.log(path.extname(__filename)); // .js
// path.isAbsolute(path) 是否为绝对路径
console.log(path.isAbsolute(path.resolve(__dirname, 'hello.txt'))); // true
console.log(path.isAbsolute(path.join(__dirname, 'hello.txt'))); // true

console.log(path.isAbsolute('/foo/bar')); // true
console.log(path.isAbsolute('./foo/bar')); // false
console.log(path.isAbsolute('.')); // false

console.log(path.join('foo', 'bar', 'baz/asdf')); // foo/bar/baz/asdf
console.log(path.join('foo', 'bar')); // foo/bar

console.log(path.parse(path.resolve(__dirname)));
/*
{
  root: '/',
  dir: '/Users/root/Desktop/javascript-study-notes/Node',
  base: 'global',
  ext: '',
  name: 'global'
}
*/
console.log(path.parse(path.join(__dirname)));
/*
{
  root: '/',
  dir: '/Users/root/Desktop/javascript-study-notes/Node',
  base: 'global',
  ext: '',
  name: 'global'
}
*/

console.log('resolve-path', path.resolve('/foo/bar', 'baz')); // /foo/bar/baz
console.log('resolve-path', path.resolve('/foo/bar', './baz')); // /foo/bar/baz
console.log('resolve-path', path.resolve('/foo/bar', '/baz')); // /baz

console.log('join-path', path.join('/foo/bar', './baz')); // /foo/bar/baz
console.log('join-path', path.join('/foo/bar', 'baz')); // /foo/bar/baz
console.log('join-path', path.join('/foo/bar', '/baz')); // /foo/bar/baz
```

## process

process 是一个全局变量, 即 global 对象的属性
它用于描述当前 Node.js 进程状态的对象, 提供了一个与操作系统的简单接口。

exit: 进程准备退出
beforeExit: node 清空事件循环
signal: 进程接受到信号时触发。

```js
const fs = require('fs');
const path = require('path');

(function () {
  process.on('exit', function (code) {
    // 只会执行同步代码
    console.log('退出码:', code); // 0
  });
  process.on('beforeExit', (code) => {
    // 此处可执行异步代码
    console.log('退出之前:', code);
  });
  console.log('程序执行结束');
})();

// ----------- process属性 -----------------
(function () {
  // process.stdout   标准输出流
  console.log('stdout:', process.stdout);
  // process.stdin    标准输入流
  console.log('stdin', process.stdin);
  console.log('argv', process.argv); // 命令执行脚本时的各个参数
  // 第一个参数为node, 第二个参数问当前执行文件路径， 第三个参数为接受的参数
  /**
   * argv [
        '/usr/local/bin/node',
        '/Users/root/Desktop/javascript-study-notes/Node/process/index.js',
        'a'
      ]
   * 
  */
  console.log('env:', process.env);
  console.log('version', process.version);
  console.log('pid:', process.pid);
  console.log('arch', process.arch);
  console.log('platform:', process.platform);
  // 执行当前脚本的Node二进制文件的绝对路径
  console.log('execPath:', process.execPath);
  // []
  console.log('execArgv:', process.execArgv);
  /**
   * version v20.17.0
      pid: 8759
      arch arm64
      platform: darwin
  */
})();

// ------------------ process 方法 ------------------------
(function () {
  console.log('cwd:', process.cwd());
  console.log('memoryUsage', process.memoryUsage());
  /**
   * 
   *  cwd: /Users/root/Desktop/javascript-study-notes/Node/process
      memoryUsage {
        rss: 33374208, 常驻内存
        heapTotal: 4505600,
        heapUsed: 3868144,
        external: 1402314,
        arrayBuffers: 10515
      }
  */
  for (let i = 0; i < 10 * 1000000; i++) {
    // { user: 49665, system: 12768 }
  }

  // user: 用户态CPU时间 执行用户模式
  // system: 系统态CUP时间 执行内核模式
  console.log(process.cpuUsage());
  // { user: 41698, system: 11421 }
  console.log(process.uptime());
})();

// --------------- 标准流输出 -------------------
(function () {
  console.log = function (data) {
    process.stdout.write('----' + data + '-------\n');
  };
  console.log('hello');
  console.log('world');

  const readStream = fs.createReadStream('./app.js');
  readStream.pipe(process.stdout);

  process.stdin.pipe(process.stdout);
})();
```
