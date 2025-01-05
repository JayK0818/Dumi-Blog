---
title: 排序
group:
  title: 算法
---

## 冒泡排序

在待排序的一组数中，将相邻的两个数进行比较，若前面的数比后面的数大就交换两数，否则不交换；如此下去，直至最终完成排序。

```js
const bubble_sort = (list = []) => {
  const length = list.length;
  if (length <= 1) {
    return list
  }
  for (let i = 0; i < length; i++) {
    // 每次排序的已经将最大的元素排在数组末尾了, 下一次遍历的时候无需再比较了
    // 所以下标 再减 i
    for (let j = 0; j < length - 1 - i; j++) {
      if (list[j] >= list[j + 1]) {
        const temp = list[j]
        list[j] = list[j + 1]
        list[j + 1] = temp
      }
    }
  }
  return list
}
```

  空间复杂度O(1), 时间复杂度(O^2)

## 插入排序

  循环数组中每个元素, 每个数依次往前对比, 比前面的数字小， 则移动到前面

```js

const insert_sort = (array = []) => {
  const length = array.length
  if (length < 2) return array
  const swap = (array, i, j) => {
    [array[i], array[j]] = [array[j], array[i]]
  }
  // 将数组的第一个元素作为起始元素, 从第二个元素开始依次插入
  for (let i = 1; i < length; i++) {
    for (let j = i; j > 0; j--) {
      // 如果左边的值的顺序 小于右侧的, 则两个值 交换位置
      if (array[j] < array[j - 1]) {
        swap(array, j, j - 1)
      }
    }
  }
  return array
}
```

  空间复杂度O(1), 时间复杂度(O^2)

## 归并排序

```js
/**
 * @description 归并排序, 将数组分为两部分, 递归排序,然后合并两个部分
 * N(log(N))
*/
function merge(left = [], right = []) {
  const arr = []
  while (left.length && right.length) {
    // 从数组末尾开始比较, 从大到小排序
    if (left[0] < right[0]) {
      arr.push(left.shift())
    } else {
      arr.push(right.shift())
    }
  }
  return [...arr, ...left, ...right]
}

function mergeSort(arr) {
  if (arr.length < 2) return arr
  const mid_idx = Math.floor(arr.length / 2)
  const left = arr.slice(0, mid_idx)
  const right = arr.slice(mid_idx)
  return merge(mergeSort(left), mergeSort(right))
}
```

## 快速排序

```js
/**
 * @description 快速排序
*/
const quick_sort = (array = []) => {
  const length = array.length
  if (length <= 2) return array
  const mid_idx = Math.floor(length / 2)
  const val = array[mid_idx]
  const left = []
  const right = []
  for (let i = 0; i < length; i++) {
    if (i === mid_idx) continue
    if (val < array[i]) {
      right.push(array[i])
    } else {
      left.push(array[i])
    }
  }
  return quick_sort(left).concat(val).concat(quick_sort(right))
}
```

## 选择排序

```js
/**
 * @description 选择排序
 * 遍历数组, 每次在当前的index上,找到剩余数组中最小值的索引。然后进行 值交换
*/
const select_sort = (array = []) => {
/*   const swap = (array, i, j) => {
    const v1 = array[j]
    array[j] = array[i]
    array[i] = v1
  } */
  const swap = (array, i, j) => {
    [array[i], array[j]] = [array[j], array[i]]
  }
  const length = array.length
  if (length <= 1) return array
  for (let i = 0; i < length; i++) {
    let min_idx = i
    for (let j = i + 1; j < length; j++) {
      if (array[j] < array[min_idx]) {
        min_idx = j
      }
    }
    swap(array, i, min_idx)
  }
  return array
}
```
