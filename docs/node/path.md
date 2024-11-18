---
nav: Node
group:
  title: 基础
---

# Path

Node.js 路径处理模块

## path.sep

平台的路径分隔符

## basename

path.basename() method returns the last portion of a path.

```js
console.log('basename:', path.basename(__filename));
// index.js   返回当前的文件名
```

## dirname

path.dirname() method returns the directory name of a path

```js
path.dirname(__filename);
path.dirname(__filename) === __dirname; // true
```

## path.extname

The **path.extname** method returns the extension of the _path_.

```js
console.log('extname', path.extname('hello.txt')); //.txt
console.log(path.extname(__filename)); // .js
console.log(path.extname(__dirname)); // ''
```

## path.isAbsolute

The **path.isAbsolute** method determines if _path_ is an absolute path.

```js
console.log(path.isAbsolute('/hello.txt')); // true
console.log(path.isAbsolute('./hello.txt')); // false
console.log(path.isAbsolute('')); // false
console.log(path.isAbsolute('/')); // true
```

## path.join()

The **path.join()** method joins all given path segments together using the platform-specific separator as a
delimiter, then normalizes the resulting path.

```js
console.log(path.join('hello', 'world', 'hello.txt')); // hello/world/hello.txt
console.log(path.join('/', 'src', 'main.js')); //    /src/main.js
console.log(path.join('./', 'src', 'main.js')); //    src/main.js
```

## path.resolve()

The **path.resolve()** method resolves a sequence of paths or path segments into an absolute path.

If no path segments are passed, path.resolve() will return the absolute path of the current working directory.

```js
const path = require('path');

console.log('basename:', path.basename(__filename));
// index.js
console.log('dirname:', path.basename(__dirname));
// path

// ---------- path.dirname()
console.log('dirname', path.dirname(__filename));
// /Users/root/Desktop/javascript-study-notes/Node/path
console.log(__dirname === path.dirname(__filename)); // true

// --------------- extname ------------
console.log('extname', path.extname('hello.txt')); //.txt
console.log(path.extname(__filename)); // .js
console.log(path.extname(__dirname)); // ''

// ------------ isAbsolutePath -----------------
console.log(path.isAbsolute(__dirname)); // true
console.log(path.isAbsolute('/hello.txt')); // true
console.log(path.isAbsolute('./hello.txt')); // false
console.log(path.isAbsolute('')); // false
console.log(path.isAbsolute('/')); // true

// --------------- join -------------
console.log(path.join('hello', 'world', 'hello.txt')); // hello/world/hello.txt
console.log(path.join('/', 'src', 'main.js')); //    /src/main.js
console.log(path.join('./', 'src', 'main.js')); //    src/main.js
console.log(path.join('', 'a', 'main.js')); // a/main.js
console.log(path.join('..', 'a', 'main.js')); // ../a/main.js

// ------------- sep ----------
console.log(path.sep); //  /

// ---------- format -----------
console.log(path.parse('/a/b/c/hello.js'));
/*
{
  root: '/',
  dir: '/a/b/c',
  base: 'hello.js',
  ext: '.js',
  name: 'hello'
}
*/

console.log(path.parse(__dirname));
/*
{
  root: '/',
  dir: '/Users/root/Desktop/javascript-study-notes/Node',
  base: 'path',
  ext: '',
  name: 'path'
}
*/

console.log(path.parse(__filename));
/**
 * {
      root: '/',
      dir: '/Users/root/Desktop/javascript-study-notes/Node/path',
      base: 'index.js',
      ext: '.js',
      name: 'index'
    }
*/

// --------------- resolve --------------
console.log(path.resolve('..', 'hello', 'main.js'));
//   /Users/root/Desktop/javascript-study-notes/Node/hello/main.js

console.log(path.resolve('./', 'main.js'));
//      /Users/root/Desktop/javascript-study-notes/Node/path/main.js

console.log(path.resolve());
// /Users/root/Desktop/javascript-study-notes/Node/path

console.log(path.resolve('a', 'b', 'c'));
```
