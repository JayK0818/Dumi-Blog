---
nav: Node
group:
  title: 基础
---

# Stream

A stream is an abstract interface for working with streaming data in Node.js. The _node:stream_ module
provides an API for implementing the stream interface.

streams can be readable, writable or both. All streams are instances of EventEmitter.

1. Writable: streams to which data can be written (fs.createWriteStream())
   expose methods such as _write()_ and _end()_ that are used to write data onto the stream.

2. Readable: streams from which data can be read (fs.createReadStream());
   use the _EventEmitter_ API for notifying application code when code is available to be read off the stream.

3. Duplex: streams that are both Readable and Writable

4. Transform: Duplex streams that can modify or transform the data as it is written and read.

The _stream/promises_ API provides an alternative set of asynchronous utility functions for streams that return
_Promise_ objects rather than using callbacks.

Both _Writable_ and _Readable_ streams will store data in an internal buffer.

The amount of data potentially buffered depends on the **highWaterMark** option passed into the stream's constructor.

Data is buffered in Readable streams when the implementation call _stream.push(chunk)_. If the consumer of the Stream dose not call _stream.read()_, the data will sit in the internal queue until it is consumed.

Data is buffered in _Writable_ streams when the _writeable.write(chunk)_ method is called repeatedly. While the total size of the internal write buffer is below the threshold set by _highWaterMark_, calls to writable.write() will return true. Once the size of the internal buffer reaches or exceeds the _highWaterMark_, _false_ will be returned.

## pipeline()

stream.pipeline(source, transforms, destination)

```js
const { pipeline } = require('node:stream/promises');
const fs = require('node:fs');
const zlib = require('node:zlib');

async function run() {
  await pipeline(fs.createReadStream('archive.tar'), zlib.createGzip(), fs.createWriteStream('archive.tar.gz'));
  console.log('Pipeline succeeded.');
}
```

```js
const stream = require('node:stream/promises'); // 引入promise版本的 stream

// 一个stream使用方式 (demo 来自node官网)
const server = http.createServer(function (req, res) {
  let body = '';
  req.setEncoding('utf8');
  req.on('data', (chunk) => {
    body += chunk;
  });
  req.on('end', () => {
    try {
      console.log('data', body); // firstName=kyrie&lastName=irving
      res.write('success');
      res.end();
    } catch (err) {
      console.log('err', err);
    }
  });
});
server.listen(3337, () => {
  console.log('app starting at port 3337');
});
```

## Readable streams

Readable streams are an abstraction for a source from which data is consumed.

Readable streams effectively operate in one of two modes: flowing and paused. All readable streams begin in
paused mode but can be switched to flowing mode in one of the following ways:

- Adding a 'data' event handler.
- Calling the _stream.resume()_ method
- Calling the _stream.pipe()_ method to send the data to a writable.
- Each call to _readable.read()_ returns a chunk of data or null.

```js
const rr = fs.createReadStream(path.join(__dirname, 'readme.md'));
rr.on('readable', () => {
  console.log('readable');
  rr.read();
});
rr.on('end', () => {
  console.log('end');
});
```

**readable.pipe()** **readable.resume()** 或者 **readable.read()** 方式会导致 'data' 事件触发。
Or by attaching a listener callback to the 'data' event.
Attaching a 'data' event listener to a stream that has not been explicitly paused will switch the stream into
flowing mode. Data will then be passed as soon as it is available.

The **readable** event is emitted when there is data available to be read from the stream. up to the configured high
water mark

In some cases, attaching a listener for the 'readable' event will cause some amount of data to be read into an
internal buffer.

In general, the **readable.pipe()** and 'data' event mechanisms are easier to understand than the 'readable' event.

```js
const rr = fs.createReadStream(path.join(__dirname, 'readme.md'), {
  highWaterMark: 10 * 1024
});
rr.on('readable', () => {
  console.log('readable');
  const result = rr.read();
  console.log('result:', result);
});
rr.setEncoding('utf8');
rr.on('data', (chunk) => {
  console.log('chunk', chunk);
});
rr.on('end', () => {
  console.log('end');
});
```

The **readable.pipe()** method returns a reference to the destination stream making it possible to set up chains of
piped streams;

```js
const fs = require('node:fs');
const readable = fs.createReadStream(path.join(__dirname, 'hello.txt'));
const writable = fs.createWriteStream(path.join(__dirname, 'copy.txt'));

readable.pipe(writable);

const fs = require('node:fs');
const zlib = require('node:zlib');
const r = fs.createReadStream('file.txt');
const z = zlib.createGzip();
const w = fs.createWriteStream('file.txt.gz');
r.pipe(z).pipe(w);
```

readable.setEncoding(encoding) sets the character encoding for data read from the _Readable_ stream.
By default, no encoding is assigned and stream data will be returned as _Buffer_ objects. Setting an encoding causes
the stream data to be returned as strings of the specified encoding rather than as _Buffer_ objects.

## API from stream implementers

Declare a new JavaScript class that extends one of the four basic stream classes (stream.Writable, stream.Readable,
stream.Duplex or stream.Transform).

```js
const { Writable } = require('node:stream');
class MyWritable extends Writable {
  constructor() {
    super();
  }
  // ...
}
```

## writeable.write(chunk)

The _writeable.write()_ method writes some data to the stream, and calls the supplied _callback_ once the data
has been fully handled.

The return value is _true_ if the internal buffer is less than the _highWaterMark_ configured when the stream was
created after admitting _chunk_.
if _false_ is returned, further attempts to write data to the stream should stop until the 'drain' event is emitted.

[API-for-stream implementers](https://nodejs.org/docs/latest/api/stream.html#api-for-stream-implementers)
