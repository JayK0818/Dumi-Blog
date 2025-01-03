---
nav: Node
group:
  title: 基础
---

# EventEmitter

Much of the Node.js core API is built around an idiomatic asynchronous event-driven architecture in which certain kinds of objects (called "emitters") emit named events that cause Function objects ("listeners") to be called

1. fs.ReadStream emits an event when the file is opened
2. a stream emits an event whenever data is available to be read.
3. As a best practice, listeners should always be added for the 'error' events.

All objects that emit events are instances of the _EventEmitter_ class.

The _EventEmitter_ class is defined and exposed by the _node:events_ module.
The _EventEmitter_ instance will emit it's own _newListener_ event before a listener is added to its internal array of listeners.
DOM _EventTarget_ instances may be hierarchical, there is no concept of hierarchy and event propagation in Node.js.

```js
const emitter = new EventEmitter();
emitter.once('newListener', (event, listener) => {
  if (event === 'update') {
    console.log(listener.toString());
    emitter.on('update', listener);
  }
});
emitter.on('update', () => {
  console.log('A');
});
emitter.emit('update'); // 输出两次 A
```

```js
const EventEmitter = require('node:events');

const emitter = new EventEmitter();
emitter.on('event', () => {
  console.log('event occurred');
});

emitter.emit('event');

//传递参数
emitter.on('event', 'hello', 'world');

// 只执行一次
let m = 0;
emitter.once('event', () => {
  m += 1;
  console.log('m:', m); // 1
});
emitter.emit('event');
emitter.emit('event');

// add an error event
emitter.on('error', (err) => {
  console.log('whoops! there was an error!');
});
emitter.emit('error', new Error('whoops!!!'));

// ----------- 部分源码 ----------------
if (existing === undefined) {
  events[type] = listener;
  ++target._eventsCount;
} else {
  if (typeof existing === 'function') {
    existing = events[type] = prepend ? [listener, existing] : [existing, listener];
  } else if (prepend) {
    existing.unshift(listener);
  } else {
    existing.push(listener);
  }
}
```

## Asynchronous

The _EventEmitter_ calls all listeners synchronously in the order in which they were registered.
Switch to an asynchronous mode of operation using the _setImmediate()_ or _process.nextTick()_

```js
emitter.on('update', () => {
  process.nextTick(() => {
    console.log('process.nextTick');
  });
  setImmediate(() => {
    console.log('setImmediate');
  });
  setTimeout(() => {
    console.log('setTimeout');
  }, 1000);
});

emitter.emit('update');
```

emitter.eventNames()
emitter.getMaxListeners() / emitter.setMaxListeners(n)
emitter.off(eventName, listener)
emitter.on(eventName, listener)
emitter.prependListener(): add the event listener to the beginning of the listeners array.
emitter.removeAllListeners(eventName)
emitter.removeListener(eventName, listener)

事件循环:

- timers: 执行 setTimeout 和 setInterval
- pending callbacks: 执行系统操作的回调, 例如 tcp udp
- idle, prepare: 只在系统内部执行
- poll: 执行与 I/O 相关回调
- check: 执行 setImmediate 中的回调
- close callback: 执行 close 事件中的回调

  浏览器只有两个任务队列, Node.js 中有六个任务队列
  NodeJs 中 process.nextTick 优先于 Promise.then()
