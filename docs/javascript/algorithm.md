---
title: 介绍
group:
  title: 算法
---

## 常见数据结构

* 数组/字符串
* 链表
* 栈
* 队列
* 双端队列
* 树

## 高级数据结构

* 优先队列
* 图
* 前缀树
* 线段树
* 树状数组

## 复杂度

复杂度: 往往会忽略常量,低阶,系数等对增长趋势不产生决定影响的因子。

1. 时间
2. 空间

时间复杂度 O: 时间复杂度的表示法
O(n) n: 表示的数据规模

## 常用时间复杂度

* O(1)
* O(log n)
* O(n)
* O(n log n)
* O(n^2)
* O(n^3)

### 只关注循环执行次数最多的那一段代码

```js
function fn() {
  for (let i = 0; i < 100; i++) {}
}
// O(n)
```

### 总复杂度等于量级最大的那段代码复杂度

```js
function fn() {
  for (let i = 0; i < 100; i++) {}
  for (let j = 0; j < 100; j++) {
    for (let k = 0; k < 100; k++) {}
  }
}
// O(n^2)
```

### 嵌套代码的复杂度等于嵌套内外代码复杂度的乘积

```js
function f(n) {
  let sum = 0;
  for (let i = 0; i < 1000; i++) {
    sum += m(i);
  }
}

function m(n) {
  for (let i = 0; i <= n; i++) {}
}
// O(n * n)
```

### 多个循环规模求加法

```js
function fn(m, n) {
  for (let i = 0; i < m; i++) {
    // ...
  }
  for (let i = 0; i < n; i++) {
    // ...
  }
}
// O(m + n)
```

### 多个规模求乘法

```js
function f1(m, n) {
  for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
      // ...
    }
  }
}
// O(m * n)
```
