---
title: BOM
group:
  title: 基础
---

  浏览器对象模型(Browser Object Model)。

## window对象

  所有浏览器都支持window对象。它表示浏览器窗口。

```js
window.innerWidth // 浏览器窗口的内部宽度
window.innerHeight // 浏览器窗口的内部高度
```

  对于IE 8 7 6 5:

```js
document.documentElement.clientWidth/document.documentElement.clientHeight
document.body.clientWidth / document.body.clientHeight
```

### 打开一个弹窗

  经常会有在当前页面打开弹窗查看某些信息的需求。 有时，在打开弹窗的情况下, 页面内容依然可以滚动,这时需要做一个判断,
  在有滚动条的时候隐藏滚动条,并且防止隐藏滚动条时页面内容抖动。

```js
// --------- 判断页面是否有滚动条 -------
function hasScrollbar() {
  document.body.scrollHeight > (
    window.innerHeight || document.documentElement.clientHeight
  )
}

// --------获取滚动条的宽度 --------
function getScrollBarWidth() {
  const div = document.createElement('div')
  div.style.cssText = 'position:absolute;top:-9999px;'+
  'width:100px;height:100px;overflow:scroll;'
  document.body.appendChild(div)
  const scrollBarWidth = div.offsetWidth - div.clientWidth;
  document.body.removeChild(div)
  return scrollBarWidth;
}
```

### 全局变量

  通过var定义的全局变量不能通过delete操作符删除,而window属性上定义的变量可以删除。

```js
var firstName = 'kyrie'
window.lastName = 'irving'
delete firstName;
delete lastName;
console.log(firstName, window.lastName)  // kyrie undefined
```

  可以通过Object.getOwnPropertyDescriptor()获取一个对象的属性标识符。通过var定义的全局变量
  的配置configure为false,而手动在window上添加的属性configure为true.

```js
Object.getOwnPropertyDescriptor(window,'firstName')
/*
configurable: false
enumerable: true
value: "kyrie"
writable: true
*/

Object.getOwnPropertyDescriptor(window,'lastName')
/*
configurable: true
enumerable: true
value: "irving"
writable: true
*/
```

## Location

  window.location 对象用于获得当前页面的地址 (URL)
  Location对象的href属性是一个字符串,包含URL的完整文本。Location对象的toString()方法返回href的属性值。

```js
function parseUrl(){
  const args = {}
  const query = window.location.search.substring(1)
  const paris = query.split('&')
  for(let i = 0, length = paris.length; i <length; i++){
    const pos = paris[i].indexOf('=')
    if(pos === -1) continue;
    const name = paris.substring(0,pos);
    const value = paris.substring(pos+1)
    args[name] = decodeURIComponent(value)
  }
  return args
}
```

## 定时器

  window.setTimeout() 定时器到期后执行一个函数。

```js
var timeoutID = scope.setTimeout(function[, delay, arg1, arg2, ...]);
```

  返回值timeoutID是一个正整数,表示定时器的编号。 这个值可以传递给clearTimeout()来取消定时器。

:::tip
setTimeout()和setInterval()共用一个编号池, 技术上,clearTimeout()和clearInterval()可以互换, 但是为了避免混淆,
不要混用取消定时函数。
:::

```js
// 监听窗口是否可见
window.addEventListener('focus', () => {
  console.log('focus, I am seen now')
}, false)
window.addEventListener('blur', () => {
  console.log('blur, I am hidden')
})

// -------- visibilitychange ----------
// 当其选项卡的内容变得可见或被隐藏时，会在文档上触发 visibilitychange (能见度更改) 事件。
document.addEventListener('visibilitychange', function(event) {
  console.log(document.visibilityState) // hidden / visible
}, false)

document.addEventListener("visibilitychange", function() {
  if (document.visibilityState === 'visible') {
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }
});
```

## window.load

  load事件在整个页面及其所有以来资源如样式表和图片都完成加载时触发。它与**DOMContentLoaded** 不同,后者只要页面DOM加载完成就触发,
  无需等待依赖资源的加载。
:::tip
所有以 *load* 命名的事件都不会传递到 *window*上。要在 *window* 上捕获 *load* 事件, 相关的 *load* 事件必须直接绑定到 *window* 上。
:::

## window.devicePixelRatio

  window接口的devicePixelRatio返回当前设备的物理分辨率和CSS像素分辨率之比。

  媒体查询以(resolution: 1dppx) 或者(resolution:2dppx) 设置不同分辨率下的样式。

```css
/* 移动端一像素边框的 一种处理方式 */
@media screen and (min-resolution:2dppx) {
  .border-bottom-1px {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    transform: scale(0, .5);
  }
}
```

  canvas 可能在视网膜屏幕上显示得太模糊, 使用window.devicePixelRatio 确定应添加多少额外的像素密度以使图像更清晰。
  下面是mdn的一个例子。

```js
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const size = 200
canvas.style.width = `${size}px`
canvas.style.height = `${size}px`

const scale = window.devicePixelRatio
canvas.width = Math.floor(size * scale)
canvas.height = Math.floor(size * scale)

ctx.scale(scale, scale)
```

[Window.devicePixelRatio](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/devicePixelRatio)

## window.open

  window.open() 方法用于打开一个新的浏览器窗口或者查找一个已经命名的窗口。

```js
button.addEventListener('click', () => {
  const opener = window.open('')
  console.log(opener)
  setTimeout(() => {
    opener.close()
  }, 1000)
}, false)
```

  opener表示对通过window.open()放大打开窗口的引用, 可以通过调用close()方法关闭窗口。

## window.postMessage

  window.postMessage() 方法可以安全地实现跨源通信。该方法提供了一种受控机制来规避同源限制。
  一个窗口可以获得另一个窗口的引用。然后在窗口上调用targetWindow.postMessage() 方法分发一个MessageEvent消息。
  接受消息的窗口可以根据需要自由处理此事件。

```js
window.postMessage(message, targetOrigin, [transfer])
```

```js
button.addEventListener('click', () => {
  const iframe = document.querySelector('.iframe')
  iframe.contentWindow.postMessage('hello world')
}, false)

// iframe
window.addEventListener('click', function(event) {
  console.log(event.data) // 从父窗口传递过来的数据,数据可以是对象或者数组
}, false)
```

## Storage

1. window.localStorage
2. window.sessionStorage

  window.localStorage和window.sessionStorage提供了访问特定域名下会话存储或者本地存储的功能。
  两种方式操作本地数据的API相同,但是window.localStorage存储的数据没有时间限制。除非手动删除, 但是sessionStorage
  存储的数据在窗口关闭后会清除(刷新时不会)。

```js
// Storage.setItem()
window.localStorage.setItem('key', 'hello')
window.localStorage.setItem('key', JSON.stringify([{firstName:'kyrie', lastName:'irving'}]))

// Storage.getItem()
window.localStorage.getItem('key')

// Storage.removeItem()
window.localStorage.removeItem('key')

// Storage.clear()
window.localStorage.clear()
```

  storage event
  当存储区域(localStorage或者sessionStorage)被修改时, 将触发storage事件。

```js
window.addEventListener('storage', (event) => {
  console.log(JSON.parse(event.oldValue))
  console.log(JSON.parse(event.newValue))
  console.log(event.key)  // 键更改时
  console.log(event.type) // storage
  console.log(event.storageArea)
})
```

[MDN-localStorage](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/localStorage)

```js
// 一个模拟localStorage 可以设置过期事件的变通方法
const save_button = document.querySelector('.save-button')
const get_button = document.querySelector('.get-button')

// value 是一个对象, 要存储的键值对对象
function save(key, value, expire) {
  if(typeof value === null) return
  if(Object.prototype.toString.call(value) === '[object Object]') {
    const last_value = JSON.parse(window.localStorage.getItem(key) || '{}')
    window.localStorage.setItem(key, JSON.stringify({
      ...last_value,
      ...value,
      expire: expire ? (Date.now() + expire) : 0
    }))
  }
}

function get(key) {
  const value = JSON.parse(window.localStorage.getItem(key) || '{}')
  if (value.expire) {
    const current = Date.now()
    if (current > value.expire) {
      // 过期时删除存储的值
      window.localStorage.removeItem(key)
      return null
    }
    const { expire, ...data } = value
    return data
  } else {
    return value
  }
}
save_button.addEventListener('click', () => {
  save('__player__', {
    firstName: 'kyrie',
    lastName: 'irving',
    age: 30
  }, 10000)
}, false)


get_button.addEventListener('click', () => {
  const player = get('__player__')
  console.log(player)
}, false)
```

[web-storage-cache](https://www.npmjs.com/package/web-storage-cache)

```js
// 本地存储加密, 分别使用URIComponent和base64加密， 对称加密
const encrypt_button = document.querySelector('.encrypt-button')
const decrypt_button = document.querySelector('.decrypt-button')

encrypt_button.addEventListener('click', () => {
  const player = {
    firstName: 'kyrie',
    lastName: 'irving',
    age: 30
  }
  window.localStorage.setItem('encode_player', encodeURIComponent(JSON.stringify(player)))
  window.localStorage.setItem('base_player', window.btoa(JSON.stringify(player)))
}, false)

decrypt_button.addEventListener('click', () => {
  try {
    const string_1 = window.localStorage.getItem('encode_player')
    if(string_1) {
      const player = JSON.parse(decodeURIComponent(string_1))
      console.log(player)
    }
    const string_2 = window.localStorage.getItem('base_player')
    if(string_2) {
      const player = JSON.parse(window.atob(string_2))
      console.log(player)
    }
  } catch(err) {
    console.log(err)
    return null
  }
}, false)
```

[secure-ls](https://www.npmjs.com/package/secure-ls)

[crypto-js](https://www.npmjs.com/package/crypto-js)

[localstorage-slim](https://www.npmjs.com/package/localstorage-slim)

## window.location

  window.location是一个只读属性,返回一个location对象,其中包含有关文档当前位置的信息。

```js
window.location.href = 'http://www.baidu.com'
window.location.assign('http://www.baidu.com')
window.location.reload(true)
window.location.replace('http://www.baidu.com')
window.location.search  // 地址?后的部分(设置或者获取)
window.location.hash    // #a (设置或者获取)

// window.hashchange
window.addEventListener('hashchange', () => {
  console.log('hash changed')
}, false)
```

## window.navigator

  window.navigator会返回一个navigator对象的引用。可以用于请求运行当前代码的应用程序的相关信息。

```js
// 检测浏览器
function get_browser() {
  const browser_list = ['Chrome', 'Safari', 'Edge', 'Opera', 'Firefox', 'MicroMessenger']
  const urgent = window.navigator.userAgent
  const b_index = browser_list.findIndex(b => urgent.includes(b))
  if(~b_index) {
    return browser_list[b_index]
  }
  return 'unknown'
}
const urgent = get_browser()

// 一个检测浏览器的第三方库 ua-parser-js
```

```js
window.navigator.onLine //检测是否有网络(true/false)

window.addEventListener('online', () => {
  console.log('online', window.navigator.onLine)  // online true
})

window.addEventListener('offline', () => {
  console.log('offline', window.navigator.onLine) // offline false
})
```

```js
// navigator.clipboard 
/*
Clipboard API Navigator接口添加了只读属性clipboard. 可以实现剪贴,复制,粘贴的功能
*/
const clipboard_button = document.querySelector('.clipboard-button')
clipboard_button.addEventListener('click', function() {
  window.navigator.clipboard.writeText('hello world, 你好生活')
}, false)

// 查看复制的内容
window.navigator.clipboard.readText().then(res => {
  console.log(res)
})

// 监听copy事件并设置要复制内容
document.addEventListener('copy', function(e){
  e.clipboardData.setData('text/plain', 'Hello, world!');
  e.clipboardData.setData('text/html', '<b>Hello, world!</b>');
  e.preventDefault();
  //We want our data, not data from any selection, to be written to the clipboard
});
```

## window.history

  window.history对象包含浏览器的历史

1. window.history.back()
2. window.history.forward()
3. window.history.go()

### history.pushState / history.replaceState

  history.pushState(state, title, url) 方法向当前浏览器会话的历史堆栈中添加一个状态。
  history.replaceState(state, title, url) 修改当前历史记录实体。

:::tip
state 是一个JavaScript状态对象,它与pushState()创建的历史记录条目相关联。
title 当前大多数浏览器都忽略此参数.
url   新的历史条目
:::

[MDN-history.pushState](https://developer.mozilla.org/zh-CN/docs/Web/API/History/pushState)

  描述:
  从某种程度上说, 调用pushState() 和 window.location = '#foo'基本上一样, 它们都会在当前都document中创建和激活一个新的历史记录。
  但是pushState()有以下优势:

1. 新的url可以是任何和当前url同源的url,当设置window.location只会在你只设置锚的时候才会使用当前url.
2. window.location = '#foo' 仅仅会在锚的值不是 #foo情况下创建一条新的历史记录
3. 可以在新的历史记录中关联任何数据。
  
### popState

  当活动历史条目更改时,将会触发popstate事件。 如果被激活的历史条目是通过history.pushState()或者history.replaceState()
  的调用影响,popstate事件的state属性包含历史条目的状态对象的副本。
:::tip
history.pushState() 或者 history.replaceState() 不会触发popstate事件。
用户点击浏览器的回退按钮,或者history.back() / history.forward() / history.go() 才会触发。
:::

## queueMicrotask

 微任务(microtask)的执行顺序在所有挂起的任务(pending tasks)完成之后,在对浏览器的事件循环产生控制之前。

```js
console.log('start', Date.now())

setTimeout(() => {
  console.log('setTimeout')
}, 0)
window.queueMicrotask(() => {
  console.log('queueMicrotask')
})
Promise.resolve().then(() => {
  console.log('promise')
})
console.log('end', Date.now())
/*
start 1658498438592
end 1658498438592
queueMicrotask
promise
*/
```

  下面是MDN上的一个queueMicrotask 的polyfill。 使用的是promise创建一个微任务

```js
if(typeof window.queueMicrotask !== 'function') {
  window.queueMicrotask = function(callback) {
    Promise.resolve().then(callback)
  }
}
```

## requestAnimationFrame

  window.requestAnimationFrame()高速浏览器 执行一个动画,并且要求浏览器在下次重绘之前调用指定的
  回调函数更新动画。回调函数执行次数通常是每秒60次。

```js
window.requestAnimationFrame(callback)

/*
返回一个long整数, 可以传递这个值给window.cancelAnimationFrame()以取消回调函数
*/
const animation_id = window.requestAnimationFrame(callback)
window.cancelAnimationFrame(animation_id)
```

```js
// requestAnimationFrame
const container = document.querySelector('.animation-container')
let animation_left = 0
let animation_id = 0
function translate() {
  container.style.transform = `translate3d(${animation_left++}px, 0, 0)`
  animation_id = window.requestAnimationFrame(translate)
  if (animation_left >= 300) {
    window.cancelAnimationFrame(animation_id)
  }
}
translate()


// window.setTimeout()
const container = document.querySelector('.animation-container')
let animation_left = 0
let animation_id = 0
function translate() {
  if(animation_id) {
    clearTimeout(animation_id)
  }
  animation_id = window.setTimeout(() => {
    container.style.transform = `translate3d(${animation_left++}px, 0, 0)`
    if (animation_left >= 300) {
      window.clearTimeout(animation_id)
      return
    }
    translate()
  }, 16)
}
translate()
```

[MDN-requestAnimationFrame](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestAnimationFrame)

## requestIdleCallback

  window.requestIdleCallback() 方法插入一个函数, 这个函数将在浏览器空闲时期被调用。

```js
const handle = window.requestIdleCallback(callback, [, options])

// 返回一个ID, 可以传入window.cancelIdleCallback() 方法用来结束回调
/*
options {
  timeout:如果指定了timeout,并且有一个正值,而回调在timeout毫秒过后还没有调用,那么回调任务将放入事件循环排队
}
*/
```

[MDN-requestIdleCallback](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/requestIdleCallback)
