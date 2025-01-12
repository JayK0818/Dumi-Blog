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

## 平铺数组

```js
const array_flat = (list = []) => {
  let ret = []
  for (const item of list) {
    if (Array.isArray(item)) {
      ret = ret.concat(array_flat(item))
    } else {
      ret.push(item)
    }
  }
  return ret
}
const list = [1, 2, 3, [1, 2, [1, 2, 3, [4, 5, [6, 7, [10, 11, [20]]]]]]]
console.log(array_flat(list))
// [1, 2, 3, 1, 2, 1, 2, 3, 4, 5, 6, 7, 10, 11, 20]



 // 使用reduce
const array_reduce_flat = (list = []) => {
return list.reduce(
  (p, n) => p.concat(Array.isArray(n) ? array_reduce_flat(n) : n),
  []
)
}
console.log(array_reduce_flat(list))
// [1, 2, 3, 1, 2, 1, 2, 3, 4, 5, 6, 7, 10, 11, 20]
```

## 平铺数组中对象

```js
const list = [
  {
   id: 1,
   name: '衣服',
   children: [
    {
     parent_id: 1,
     id: 11,
     name: '上衣'
    },
    {
     parent_id: 1,
     id: 12,
     name: '裤子',
     children: [
      {
       id: 121,
       parent_id: 12,
       name: '牛仔裤',
       children: [
        {
         parent_id: 121,
         id: 1211,
         name: '春夏(牛仔裤)'
        },
        {
         parent_id: 121,
         id: 1222,
         name: '春秋(牛仔裤)'
        }
       ]
      },
      {
       id: 122,
       parent_id: 12,
       name: '休闲裤'
      }
     ]
    }
   ]
  },
  {
   id: 2,
   name: '手机',
   children: [
    {
     parent_id: 2,
     id: 21,
     name: '华为',
     children: [
      {
       id: 211,
       parent_id: 21,
       name: '红色'
      },
      {
       id: 212,
       parent_id: 21,
       name: '白色'
      }
     ]
    },
    {
     parent_id: 2,
     id: 22,
     name: '苹果'
    }
   ]
  }
 ]

const ret = []
const flat_list = (list = []) => {
  for (const item of list) {
    ret.push(item)
    if (Array.isArray(item.children) && item.children.length) {
    flat_list(item.children)
    }
  }
  ret.forEach((item) => {
    Reflect.deleteProperty(item, 'children')
  })
  return ret
}
console.log(flat_list(list))
/**
 *
[
  {
    "id": 1,
    "name": "衣服"
  },
  {
    "parent_id": 1,
    "id": 11,
    "name": "上衣"
  },
  {
    "parent_id": 1,
    "id": 12,
    "name": "裤子"
  },
  {
    "id": 121,
    "parent_id": 12,
    "name": "牛仔裤"
  },
  {
    "parent_id": 121,
    "id": 1211,
    "name": "春夏(牛仔裤)"
  },
  {
    "parent_id": 121,
    "id": 1222,
    "name": "春秋(牛仔裤)"
  },
  {
    "id": 122,
    "parent_id": 12,
    "name": "休闲裤"
  },
  {
    "id": 2,
    "name": "手机"
  },
  {
    "parent_id": 2,
    "id": 21,
    "name": "华为"
  },
  {
    "id": 211,
    "parent_id": 21,
    "name": "红色"
  },
  {
    "id": 212,
    "parent_id": 21,
    "name": "白色"
  },
  {
    "parent_id": 2,
    "id": 22,
    "name": "苹果"
  }
]
*/
```

## 将数组转为树

```js
// 将上述拉平的数组 转化为树
const transform_list = (list = [], parent_id = 0) => {
  const ret = []
  for (const item of list) {
    if (item.parent_id === parent_id) {
      // 以当前项的id作为父节点, 寻找它的子集
      const children = transform_list(list, item.id)
      if (children.length) {
        item.children = children
      }
      ret.push(item)
    }
  }
  return ret
}
const build_tree = (list = [], parent_id = 0) => {
  return list
   .filter((item) => item.parent_id === parent_id)
   .map((item) => {
    return {
     ...item,
     children: build_tree(list, item.id)
    }
  })
}

 // 通过map转换
const transform_list_base_map = (list = []) => {
  const map = {}
  for (const item of list) {
   map[item.id] = {
    ...item,
    children: []
   }
  }
  const tree = []
  for (const id in map) {
  // 判断当前项父级id 项是否存在, 存在的话 加入其父级children
   const parent_id = map[id].parent_id
   if (parent_id) {
    map[parent_id].children.push(map[id])
   } else {
    tree.push(map[id])
   }
  }
  return tree
}
```
