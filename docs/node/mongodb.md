---
nav: Node
---

# MongoDB

1. database: 数据库
2. collection: 数据库表/集合
3. document: 数据记录行/文档
4. field: 数据字段

## Mongo shell 安装

数据库和 mongosh 安装在 /usr/local 目录下, 安装之后配置环境变量.

```shell
cd ~/.zshrc
export PATH='/usr/local/mongodb/bin:$PATH'
export PATH='/usr/local/mongosh/bin:$PATH'

mongod --version
```

MongoDB Shell 是 MongoDB 提供的官方交互式界面。允许用户与 MongoDB 数据库进行交互,执行命令和操作数据库。

```shell
mongosh --version #查看安装版本
# 2.3.2

mongosh # 使用默认端口27017连接到本地主机上运行的MongoDB部署。
# mongosh "mongodb://localhost:27017"

mongosh "mongodb://localhost:9999"
mongosh --port 9999

# Current Mongosh Log ID: 6750573febe07a6a93e9ea4d
# Connecting to:  mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.2
# Using MongoDB:  8.0.1
# Using Mongosh:  2.3.2
```

```shell
show dbs
# admin     40.00 KiB
# config    72.00 KiB 当Mongo用户分片设置时, config数据库在内部使用, 用于保存分片的相关信息
# local     88.00 KiB 这个数据库永远不会被复制

use database # 创建数据库

db.collection.insertOne()
# 插入一条数据
db.collection.insertMany()
# 多条数据

db.collection.find()
# SELECT * FROM movies
db.collection.find({
  title: 'Hello'
})

# 更新
db.collection.updateOne()
db.collection.updateMany()
db.collection.replaceOne()

db.collection.deleteMany()
db.collection.deleteOne()
```

## 嵌入式文档

MongoDB 使用 点符号来访问数组的元素和访问嵌入式文档的字段。

```js
db.inventory.insertMany([
  {
    item: 'journal',
    qty: 25,
    size: { h: 14, w: 21, uom: 'cm' },
    status: 'A'
  }
]);

db.inventory.find({
  'size.uom': 'in'
});
// 匹配嵌入式文档
db.inventory.find({
  size: { h: 14, w: 21, uom: 'cm' }
});

// 匹配数组
db.inventory.find({
  tags: ['red', 'blank']
})[
  // 嵌入式文档数组
  {
    item: 'journal',
    stock: [
      { warehouse: 'A', qty: 5 },
      { warehouse: 'C', qty: 15 }
    ]
  }
];
// 查询嵌套在数组中的文档
db.inventory.find({
  stock: { warehouse: 'A', qty: 5 } // 整个嵌入式文档的相等匹配要求与指定文档精确匹配, 包括字段顺序。
});

db.inventory.find({
  stock: { qty: 5, warehouse: 'A' } // 这么查询不匹配inventory中的任何文档
});

// 指定文档的查询条件 (使用.表示法查询)
db.inventory.find({
  'stock.qty': { $lte: 20 }
});
```

MongoDB 不建议对嵌入文档进行比较, 因为这些操作需要与指定的文档完全匹配, 包括字段顺序。

```js
"<array>.<index>"

{
  contributes: [ "Turing machine", "Turing test"],
}
// "contributes.1" 指定contributes第一个元素

{
  name: { first: "Alan", last: "Turing" },
  contact: { phone: { type: "cell", number: "111-222-3333" } },
  // “name.last”
  // "contact.phone.number"
}
```

## 限制返回字段

```js
const res = db.inventory
  .find({
    status: 'A'
  })
  .project({
    item: 1,
    status: 1
  });
// 匹配文档中仅返回 item, status 和默认情况下的 _id 字段

db.inventory
  .find({
    status: 'A'
  })
  .project({
    item: 1,
    status: 1,
    _id: 0
  });
// 删除返回的_id字段。

const cursor = db
  .collection('inventory')
  .find({
    status: 'A'
  })
  .project({ item: 1, status: 1, 'size.uom': 1 }); // 返回嵌入式文档中指定字段
```

## 批量写入

```js
db.pizzas.bulkWrite([
  { insertOne: { document: { _id: 3, type: 'beef', size: 'medium', price: 6 } } },
  { insertOne: { document: { _id: 4, type: 'sausage', size: 'large', price: 10 } } },
  {
    updateOne: {
      filter: { type: 'cheese' },
      update: { $set: { price: 8 } }
    }
  },
  { deleteOne: { filter: { type: 'pepperoni' } } },
  {
    replaceOne: {
      filter: { type: 'vegan' },
      replacement: { type: 'tofu', size: 'small', price: 4 }
    }
  }
]);
```

## 管道聚合(Aggregation Pipeline)

聚合管道由一个或多个处理文档的阶段组成.

- 每个阶段对输入文档执行一个操作。
- 从一个阶段输出的文档将传递到下一个阶段。

```js
// 以下demo 来自官网
db.orders.insertMany([
  { _id: 0, name: 'Pepperoni', size: 'small', price: 19, quantity: 10, date: ISODate('2021-03-13T08:14:30Z') },
  { _id: 1, name: 'Pepperoni', size: 'medium', price: 20, quantity: 20, date: ISODate('2021-03-13T09:13:24Z') },
  { _id: 2, name: 'Pepperoni', size: 'large', price: 21, quantity: 30, date: ISODate('2021-03-17T09:22:12Z') },
  { _id: 3, name: 'Cheese', size: 'small', price: 12, quantity: 15, date: ISODate('2021-03-13T11:21:39.736Z') },
  { _id: 4, name: 'Cheese', size: 'medium', price: 13, quantity: 50, date: ISODate('2022-01-12T21:23:13.331Z') }
]);

// 聚合
db.orders.aggregate([
  // Stage 1: Filter pizza order documents by pizza size
  {
    $match: { size: 'medium' }
  },
  // Stage 2: Group remaining documents by pizza name and calculate total quantity
  {
    $group: { _id: '$name', totalQuantity: { $sum: '$quantity' } }
  }
])[
  // 输出
  ({ _id: 'Cheese', totalQuantity: 50 }, { _id: 'Vegan', totalQuantity: 10 }, { _id: 'Pepperoni', totalQuantity: 20 })
];
```

在 MongoDB 中, 存储在集合中的每个文档都需要一个唯一的 **\_id** 字段作为主键。如果插入的文档省略了 **\_id** 字段,
MongoDB 驱动程序会自动为 **\_id** 字段生成一个 ObjectId.

## 操作符

1. $eq 等于
2. $ne 不等于
3. $gt 大于
4. $gte 大于等于
5. $lt 小于
6. $lte 小于等于
7. $in    在指定的数组中 (在对同一字段进行相同检查时, 请使用$in)
8. $nin 不在指定的数组中
9. $and 符合所有条件
10. $or 符合任意条件
11. $exists 字段是否存在
12. $type 字段的类型

```shell
db.users.find({ username: { $in: ['jayk0720'] } })

# [
#   {
#     _id: ObjectId('6739ec88b2c5cdf42106ecdb'),
#     username: 'jayk0720',
#     password: '$argon2id$v=19$m=65536,t=3,p=4$VcdXk05tD9SJ6iC3dEmzPg$x4x151B3xBDtT/6FNnMoWbmFtObY591ibk6WBR4jnbM',
#     email: '112394053@qq.ocom',
#   }
# ]
```

## Limit/Skip

limit() 用于限制查询结果返回的文档数量, 而 skip()用于跳过指定数量的文档。

```shell
db.users.find().skip(20).limit(10)
```

:::info
当结合 skip() 和 limit() 时，skip() 应该在 limit() 之前使用，以避免意外行为
:::

## Sort

在 MongoDB 中, 使用 sort 排序, sort() 方法可以通过参数指定排序的字段. **1** 表示升序, **-1** 表示降序。

```shell
db.users.insertMany([
  { username: 'jayk' },
  { username: 'lebron' },
  { username: 'durant' }
])

db.users.find().sort({ username: 1 })
# { _id: ObjectId("67511fd5115a00ec49f9e176"), username: 'durant' },
# { _id: ObjectId("67511fc0115a00ec49f9e174"), username: 'jayk' },
# { _id: ObjectId("67511fca115a00ec49f9e175"), username: 'lebron' }

db.users.find().sort({ username: -1 })
# { _id: ObjectId("67511fca115a00ec49f9e175"), username: 'lebron' },
# { _id: ObjectId("67511fc0115a00ec49f9e174"), username: 'jayk' },
# { _id: ObjectId("67511fd5115a00ec49f9e176"), username: 'durant' },
```

[MongoDB 查询谓词与投影](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/query/#std-label-query-projection-operators-top)

[MongoDB 下载](https://www.mongodb.com/try/download/community)
[MongoDB-Shell](https://www.mongodb.com/try/download/shell)
[MongoDB-Compass](https://www.mongodb.com/try/download/compass)
