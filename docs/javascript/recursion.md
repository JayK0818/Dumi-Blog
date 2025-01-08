---
title: 递归
group:
  title: 算法
---

# 递归

  递归算法是一种调用自身函数的算法。使用递归时需要明确终止条件, 否则可能导致爆栈 （ Maximum call stack size exceeded）

## 阶乘

  计算n的阶乘。

```js
 function factorial(n) {
  if (n == 1) {
   return n
  }
  return n * factorial(n - 1)
 }
 console.log(factorial(5)) // 120
 console.log(factorial(100)) // 9.33262154439441e+157
```

## 斐波那契数列

  斐波那契数列的定义如下：数列的前两项是0和1，从第三项开始，每一项都是前两项的和，即0, 1, 1, 2, 3, 5, 8, 13, 21, 34

```js
function fibonacci(n = 0) {
  if (n <= 0) {
    return 0
  }
  if (n === 1) {
    return 1
  }
  return fibonacci(n - 1) + fibonacci(n - 2);
}
// console.log(fibonacci(40)) // 容易卡顿, 重复计算

function fibonacci(n = 0) {
  const arr = [0, 1]
  for (let i = 2; i <= n; i++) {
    arr[i] = arr[i - 1] + arr[i - 2]
  }
  return arr[n];
}
console.log(fibonacci(100))
```
