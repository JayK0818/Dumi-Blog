---
nav: Node
group:
  title: 基础
---

# Net

The _node:net_ module provides an asynchronous network API fro creating stream-based TCP or IPC servers
and clients。

IPC 服务是指进程间的通信服务(Inter-Process Communication Service), 它是一种在操作系统中用于实现不同进程之间的数据交换
和通信的机制。

传输控制协议（TCP，TransmissionControl Protocol）是一种面向连接的、可靠的、基于字节流的传输层通信协议。

## Event

1. close: emitted when the server closes
2. connection: emitted when a new connection is made
3. error: emitted when an error occurs
4. listening: emitted when the server has been bound after calling _server.listen()_
5. drop: when the number of connections reaches the threshold of _server.maxConnections_, the server will drop
   new connections and emit 'drop' event instead.

6. server.close()
   stops the server from accepting new connections and keeps existing connections.
7. server.listen()
   start a server listening for connections. This function is asynchronous. when the server starts listening, the 'listening' event will be emitted.

- server.listen(path, callback)
  start an IPC server listening fro connections on the given path.

- server.listen(port, host, callback)
  start a TCP server listening for connections on the given port and host.

- server.listen({
  backlog: 0,
  host: '0.0.0.0',
  ipv6Only: false,
  path: '',
  port: 9090,
  readableAll: false,
  writableAll: false
  }, callback)

## net.createServer(options connectionListener)

creates a new TCP or IPC server.

```js
const server = net.createServer((socket) => {
  socket.on('end', () => {
    console.log('------end-----');
  });
  socket.write('Hello World!');
});
server.on('listening', () => {
  console.log('-------- start listening ------');
});
server.on('error', (err) => {
  console.log('-------error---------', err);
  if (err.code === 'EADDRINUSE') {
    console.log('端口被占用');
  }
});
server.on('connection', () => {
  console.log('------- connection ---------');
});
server.on('close', () => {
  console.log('-------- close -------');
});
server.listen(8080, () => {
  console.log('server is listening');
});
```

net.isIp()
net.isIPv4()
net.isIPv6()
