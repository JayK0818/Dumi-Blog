---
nav: Node
---

# Mongoose V8.8.3

  Mongoose is a MongoDB object modeling tool designed to work in asynchronous environment.

```js
const mongoose = require('mongoose')
// 连接数据库
await mongoose.connect('mongodb://127.0.0.1:17017/test', {
  autoIndex: false,
  autoCreate: false,
  serverSelectionTimeoutMS: 30 * 1000,
  /**
   * If you call mongoose.connect() when your standalone MongoDB server is down,
   * your mongoose.connect() call
   * will only throw an error after 30 seconds
  */
})

// connection events
mongoose.connection.on('connected', () => console.log('connected'));
mongoose.connection.on('open', () => console.log('open'));
mongoose.connection.on('disconnected', () => console.log('disconnected'));
mongoose.connection.on('reconnected', () => console.log('reconnected'));
mongoose.connection.on('disconnecting', () => console.log('disconnecting'));
mongoose.connection.on('close', () => console.log('close'));
```

## Schema

  Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.

```js
const { Schema } = mongoose

const blogSchema = new Schema({
  title: String,    // shorthand for { type: String }
  author: String,
  body: String,
  isPublished: {
    type: Boolean,
    required: true
  },
  comments: [
    {
      body: String
      date: Date
    }
  ],
  tags: {
    type: [String],
    index: true // MongoDB supports secondary indexes. Disable automatically calls *createIndex* in production
  }
  // ...
});

const personSchema = new Schema({
  name: {
    first: String
    last: String
  },
  author: {
    type: ObjectId,
    ref: Person
  }
}, {
  virtuals: { // 类似于 Vue computed计算属性
    fullName: {
      get () {
        return this.name.firstName + ' ' + this.name.last;
      },
      set (v) {
        this.name.first = v.substr(0, v.indexOf(' '));
        this.name.last = v.substr(v.indexOf(' ') + 1);
      }
    }
  },
  timestamps: {
    createAt: 'created_at',
    updatedAt: 'updated_at'
  },
  selectPopulatedPaths: true
})
```

  If you use *toJSON()* or *toObject()* mongoose will not include virtuals by default. Pass *{ virtuals: true }*

```js
doc.toObject({ virtuals: true });
// Equivalent:
doc.toJSON({ virtuals: true });
```

  To use our schema definition, we need to convert out blogSchema into a Model we can work with.

  An instance of model is called a document.
  
```js
const Blog = mongoose.model('Blog', blogSchema)
// 数据库会自动创建一个 blogs集合
// Mongoose lets you start using your models immediately, without waiting for mongoose to establish a connection
// to MongoDB.

/**
 * When you create a new document with the automatically added )id property, Mongoose creates a new _id
 * of type ObjectId to your document.
*/
const doc = new Blog()
doc._id instanceof mongoose.Types.ObjectId
```

## Statics

  You can also add static functions to your model.

- Add a function property to the second argument of the schema-constructor

- Add a function property to **schema.statics**

- Call the **Schema#static()** function

```js
const animalSchema = new Schema({ name: String, type: String },
  {
    statics: {
      findByName(name) {
        return this.find({ name: new RegExp(name, 'i') });
      }
    }
  });

animalSchema.statics.findByName = function(name) {
  return this.find({ name: new RegExp(name, 'i') });
};
animalSchema.static('findByBreed', function(breed) { return this.find({ breed }); })
```

## SchemeType

- String
- Number
- Date
- Buffer
- Boolean
- Mixed
- ObjectId
- Array
- Map
- Schema
- UUID
- BigInt

```js
const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    index: true
  },
  type: {
    type: String, // 如果想要定义一个字段为type
    lowercase: true, // if you want to lowercase a string before saving
    required: true, // if true adds a required validator for this property
    default: 'hello', // function is also work, the return value of the function is used as the default
    validate: () => {},
    get: () {
    },
    set () {
    }
  },
})

const blog = new mongoose.Schema({
  // String
  title: {
    type: String,
    lowercase: true,
    uppercase: true,
    trim: true,
    enum: [],
    minLength: 10,
    maxLength: 10,
  },
  // Number
  age: {
    type: Number,
    min: 10,
    max: 100,
    enum: []
  },
  // Date
  createdAt: {
    type: Date,
    min,
    max,
    expires
  },
  // ObjectId
  id: mongoose.ObjectId,
  // Boolean
  isPublished: {
    type: Boolean,
    default: 1, // 1 '1' 'true' true, 'yes'
  }
  // Map
  socialMediaHandles: {
    type: Map,
    of: String, // keys are always strings. you specify the type of values using 'of'
  },
  // UUID
  randomId: {
    type: Schema.Types.UUID
  }
})
```

  To create UUIDs, we recommend using Node's built-in UUID generator

```js
const { randomUUID } = require('crypto')
const schema = new mongoose.Schema({
  docId: {
    type: 'UUID',
    default: () => randomUUID()
  }
})
```

## Subdocuments

  Subdocuments are documents embedded in other documents. Mongoose has two distinct notions of subdocuments:
  array of subdocuments and single nested subdocuments.

```js
const childSchema = new Schema({
  name: String,
  // 设置默认值
  age: {
    type: Number,
    default: 0
  }
})

const parentSchema = new Schema({
  children: [childSchema],
  child: childSchema
})

// finding a subdocument
const doc = parent.children.id(_id)

// create a subdocument by using create() method
const doc = parent.children.create({ name: 'Hello' })

// remove subdocument
parent.children.id(_id).deleteOne()
```

  Note that populated documents are not subdocuments in Mongoose. Subdocuments are similar to normal documents.
  The major difference is that subdocuments are not saved individually. they area saved whenever their top-level
  parent document is saved.

```js
const Parent = mongoose.model('Parent', parentSchema);
const parent = new Parent({ children: [{ name: 'Matt' }, { name: 'Sarah' }] });
parent.children[0].name = 'Matthew';

await parent.save()
```

  Each subdocument has an *_id* by default.
  Sometimes, you need to get the parent of a subdocument, You can access the parent using the **parent()** function.

```js
const schema = new Schema({
  doc: [{ name: String }]
});
const Model = mongoose.model('Test', schema)
const doc = new Model({
  doc: [{ name: 'hello' }]
})
doc.doc[0].parent();
```

## Model

```js
const userSchema = new mongoose.Schema({
  name: String,
  password: String
})

const userModel = mongoose.model('user', userSchema)
// 第一个参数是单数形式的集合名.
// mongoose automatically looks for the plural, lowercased version of your model name.

const user = new userModel({
  username: 'hello',
  password: '123456'
})
await user.save()


// query
await userModel.find()
await userModel.findOne({
  username: 'hello'
})
// 删除
await userModel.deleteOne({
  username: 'hello'
})

// 更新
await userModel.updateOne({
  username: 'hello'
}, {
  username: 'word'
})

// 监听
userModel.watch().on('change', () => {
  console.log(data)
})
```

  **ObjectId** is a class, and ObjectIds are objects, When you convert an ObjectId to a string, using toString()

## Queries

- Model.deleteMany()
- Model.deleteOne()
- Model.find()
- Model.findById()
- Model.findByIdAndDelete()
- Model.findByIdAndRemove()
- Model.findByIdAndUpdate()
- Model.findOne()
- Model.findOneAndDelete()
- Model.findOneAndReplace()
- Model.findOneAndUpdate()
- Model.replaceOne()
- Model.updateMany()
- Model.updateOne()

  A mongoose query can be executed in one of two ways

1. 回调函数
2. .then()

```js
const PersonModel = mongoose.model('Person', personSchema)
const person = await PersonModel.findOne({
  name: 'hello'
});

const query = PersonModel.findOne({
  name: 'hello'
})

// 🈯只返回这两个字段
query.select('name age')
// execute the query at a later time
const person = await query.exec()

// 也可以使用链式调用的语法
await Person.
  find({
    occupation: /host/,
    'name.last': 'Ghost',
    age: { $gt: 17, $lt: 66 },
    likes: { $in: ['vaporizing', 'talking'] }
  }).
  limit(10).
  sort({ occupation: -1 }).
  select({ name: 1, occupation: 1 }).
  exec();
```

## Validation

  1. Validation is defined in the SchemaType
  2. Validation is middleware. Mongoose registers validation as a **pre('save')** hook on every schema by default.
  3. When you call Model#save, Mongoose also runs subdocument validation.
  4. The **unique** option is not a validator.
  5. You can disable automatic validation before save by setting the validationBeforeSaveOption

```js
// built-in validators

const mongoose = require('mongoose')
const Schema = new mongoose.Schema({
  eggs: {
    type: Number,
    min: [6, '验证错误时的message']
  },
  bacon: {
    type: Number,
    required:[true, 'why no bacon?']
  },
  drink: {
    type: String,
    enum: ['Coffee', 'Tea']
  }
});

/**
 * By default, documents are automatically validated before they are saved to the database.
*/
const UserSchema = new mongoose.Schema({
  name: string
})
UserSchema.set('validateBeforeSave', false) // 取消参数校验, 会跳过校验保存数据至数据库

// 自定义错误信息
const userSchema = new Schema({
  age: {
    type: Number,
    minLength: [6, 'Must be at least 6, got {VALUE}'] // 使用数组的方式
  },
  drink: {
    type: String,
    enum: {
      values: ['Coffee'],
      message: '{VALUE} is not supported'
    }
  }
})

// 自定义校验方式
const userSchema = new Schema({
  phone: {
    type: String,
    validate: {
      validator (v) => {
        return /\d{3}-\d{3}-\d{4}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
      /**
       * props: {
            validator: [Function: validator],
            message: [Function: message],
            type: 'user defined',
            path: 'phone',
            fullPath: undefined,
            value: '123'
          }
      */
    },
    required: [true, 'phone number is required']
  }
})
```

  Custom validators can also be asynchronous. If your validator function returns a promise, mongoose
  will wait for that promise to settle.

```js
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    validate: () => Promise.reject(new Error('something went wrong!'))
  },
   email: {
    type: String,
    validate: {
      validator: () => Promise.resolve(false),
      message: 'Email validation failed'
    }
  }
})
```

## Middleware

  Middleware is specified on the schema level and is useful for writing plugins.

1. document middleware
2. model middleware
3. aggregate middleware
4. query middleware: query middleware executes when you call **exec()** or **then()** on a Query object.

```js
// Define Middleware before compiling Models

const schema = new mongoose.Schema({
  name: String
})
// 在调用 mongoose.model() 之前注册, 记得调用next()方法
schema.pre('save', (next, options) => {
  console.log('save-middleware')
  next()
})
schema.prev('validate', (next) => {
  console.log('validate-middleware-invoke')
  next()
})
const User = mongoose.model('User', schema)
```

  The **save** function triggers **validate()** hooks. All **pre('validate')** and **post('validate')**
  hooks get called before any **prev('save')** hooks.

```js
//打印顺序 ----- 以下代码来自官网
schema.pre('validate', function() {
  console.log('this gets printed first');
});
schema.post('validate', function() {
  console.log('this gets printed second');
});
schema.pre('save', function() {
  console.log('this gets printed third');
});
schema.post('save', function() {
  console.log('this gets printed fourth');
});
```

```js
// query-middleware
UserSchema.pre('find', (next) => {
console.log('find-middleware-invoke')
next()
})
UserSchema.pre('countDocuments', () => {
console.log('countDocuments-middleware-invoke')
})
UserSchema.pre('findOne', () => {
console.log('findOne-middleware-invoke')
})

UserSchema.pre('updateOne', {
  document: true,
  query: false
})
// register updateOne middleware as document middleware.
// You need to set both *document* and *query* properties in the passed object.

// user.controller.js
async getUser () {
   async user_list() {
  try {
   const user_list = await this.ctx.model.User.find()
   const count = await this.ctx.model.User.countDocuments()
   const target = await this.ctx.model.User.findOne()
  //  执行相应操作, 以上对应的中间件会执行
  } catch (err) {
   console.log(err)
  }
 }
}
```

[mongoose-middleware](https://mongoosejs.com/docs/middleware.html) Mongoose Middleware

## populate

  Mongoose has a powerful alternative called **populate()**, which lets you reference documents in other collections.

```js
 const TodoSchema = new mongoose.Schema({
  text: {
   type: String,
   required: true,
  },
  user: {
   type: mongoose.Schema.Types.ObjectId,
   ref: 'User',
   required: true,
  },
 })
```

  The **ref** option is what tells Mongoose which model to use during population.

```js
const todo = new Todo({
  text: 'hello world',
  user: '67433ab40ac7668cce0f07e7' // assign the _id from the user
  // we recommend using ObjectIds as _id properties
})
await todo.save()

const todo = await Model.find().populate('user')
// the value is replaced with the mongoose document returned from the database
/**
 * [
*     {
      "_id": "674874446e895e6117ef024a",
      "text": "1122212345222",
      "user": {
          "_id": "67433ab40ac7668cce0f07e7",
          "username": "hello123",
          "password": "123456789",
          "__v": 0
      },
      "__v": 0
    }
  ]
*/

// 手动设置为一个document的引用
const todo = await Todo.findOne()
todo.user = await User.findOne({ name: 'hello' })
/**
 * todo: {
    _id: new ObjectId("6748743e6e895e6117ef0248"),
    text: 'hello world',
    user: {
      _id: new ObjectId("6745d760ef7d2f8e3ec10056"),
      username: 'hello',
      password: '123456789',
      phone: '152-098-9139',
      __v: 0
    },
    __v: 0
  }
 * 
*/

// 如果文档引用不存在(比如删除之后), 那么获取数据为null
[
  {
    "_id": "6748743e6e895e6117ef0248",
    "text": "1122212345222222",
    "user": null,
    "__v": 0
  },
  {
    "_id": "674874446e895e6117ef024a",
    "text": "1122212345222",
    "user": null,
    "__v": 0
  },
  {
    "_id": "674874466e895e6117ef024c",
    "text": "112221234522212",
    "user": null,
    "__v": 0
  }
]
```

### Field Selection

  有时我们可能只需要返回一部分字段。This can be accomplished by passing the usual field name syntax as the second argument
  to the populated method

```js
const todo = await Todo.find()
  .populate('user', 'username') // 只返回用户的username, _id会默认返回

// 调用populate多次 (the same path)
const todo = await Todo.find()
  .populate('user', 'username')
  .populate('user', 'password') // 最后一次操作有效

/**
 * [
 * 
 *  {
      "_id": "674874446e895e6117ef024a",
      "text": "1122212345222",
      "user": {
          "_id": "6745d760ef7d2f8e3ec10056",
          "password": "123456789"
      },
    },
    {
      "_id": "674874466e895e6117ef024c",
      "text": "112221234522212",
      "user": null,
    }
  ]
*/

// ------- 传递一个对象 ---------
await Todo.find()
  .populate({
    path: 'user',
    select: 'username -_id',  // 显式的移除_id属性
  })
```

:::warning
The Document#populate() method does not support chaining. You need to call populate() multiple times,
or with an array of paths, to populate multiple paths.

```js
await person.populate(['storied', 'fans'])
```

:::

### Populating across multiple levels

  You have a user schema which keeps track of the user's friends

```js
// UserSchema
const UserSchema = new mongoose.Schema({
  //...
  friends: [
    {
      type: Mongoose.schema.Types.MongooseId,
      ref: 'User'
    }
  ]
})

/**
 * Populate let you get a list of a user's friends, but what if you also wanted a user's friends?
*/
const User.find()
  .populate({
    path: 'friends',
    populate: {
      path: 'friends',  // 朋友的朋友
    }
  })

// 添加好友时 可以直接push一个用户id, 或者 document
const user = await this.ctx.model.User.findById('xxxxxxxxx')
await me.friends.push(user)
// or
await me.friends.push('xxxxxxxx')

await me.save()

/**
 * {
    "_id": "6745d760ef7d2f8e3ec10056",
    "username": "hello12a12",
    "friends": [
        {
            "username": "hell",
            "password": "123456789"
        },
        {
            "username": "hell",
            "password": "123456789"
        },
    ]
}
*/
```

### Dynamic References

  Mongoose can also populate from multiple collections based on the value of a property in the document.

  A user may comment on either a blog post or a product.

```js
const CommentSchema = new Schema({
  body: {
    type: String,
    required: true
  },
  doc: {
    type: Schema.Types.ObjectId, // doc _id 可以是 BlogPost的_id 或者 Product的_id
    required: true
    refPath: 'docModel'
  }
  docModel: {
    type: String,
    required: true,
    enum: ['BlogPost', 'Product']
  }
})

const comments = await Comment.find().populate('doc')
// 会同时拉取对 blog 和 product的评论
```

  以下这种方式也可以, 分别定义 blog 和 product属性, 然后对每个属性使用 populate()

```js
const CommentSchema = new mongoose.Schema({
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Blog'
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }
})
const comments = await Comment.find()
  .populate('product')
  .populate('blog')
```

  但是如果 需要再 添加对其他类型的评论 如 articles, musics, 那么又得再次添加相应属性, 然后再依次调用populate().

```js
// dynamic references via ref TODO:
const commentSchema = new Schema({
  verifiedBuyer: Boolean,
  doc: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: function () {
      return this.verifiedBuyer ? 'Product' : 'BlogPost'
    }
  }
})
```

[Principle of Least Cardinality](https://dev.to/swyx/4-things-i-learned-from-mastering-mongoose-js-25e#4-principle-of-least-cardinality)
