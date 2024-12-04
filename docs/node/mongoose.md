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
    enum: ['Music', 'Article']
  }
})
```

```js
// 创建评论

class UserController extends egg.Controller {
 async create_music_comment() {
  const { id, text } = this.ctx.request.body
  const comment = new this.ctx.model.Comment({
    doc: id,
    text,
    docModel: 'Music',
  })
  await comment.save()
 }
async create_article_comment() {
  const { id, text } = this.ctx.request.body
  const comment = new this.ctx.model.Comment({
   doc: id,
   text,
   docModel: 'Music',
  })
  await comment.save()
 }
}


const comments = await Comment.find().populate('doc')
// 会同时拉取对 music 和 article的评论

/**
 * [
    {
        "_id": "674b0cead183f3e350445dc5",
        "text": "好文章1123436984",
        "doc": {
            "_id": "674b0a8bea3d6496b648c688",
            "text": "匆匆"
        },
        "docModel": "Article",
        "__v": 0
    },
    {
        "_id": "674b0d192adfb22f81dba8b7",
        "text": "好音乐112",
        "doc": {
            "_id": "674b0a4511b0c3ad9a6085e7",
            "text": "听爸爸的话"
        },
        "docModel": "Music",
    },
]
 * 
*/
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

  ref也可以为一个函数 用来定义判断评论的是哪个Model下的数据

```js
// dynamic references via ref 
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

### Populate Virtuals

  one-to-many relationships. (一对多)

```js
const AuthorSchema = new Schema({
  name: String
})
const BlogSchema = new Schema({
  title: String,
  author: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  }
})
```

  these two schemas, do not support populating an author's list of blog posts. That's where **virtual populate** comes in.

```js
UserSchema.virtual('articles', {
  ref: 'Article', // 指向哪个model
  localField: '_id', // 用户表的id字段
  foreignField: 'author',  // Article中关联用户的字段
  // Another option for populate virtuals is match. This option adds an extra filter condition to
  // the query Mongoose uses to populate
  match: {
    published: false
  }
})

const articles = await this.ctx.model.User.findById('xxxxxx').populate('articles')
```

:::warning
Keep in mind that virtuals are not included in **toJSON()** and **toObject()** output by default. set the
*virtuals: true* options on your schema's toJSON() and toObject() options.

```js
const userSchema = new Schema({
  // ...
}, {
  toJSON: {
    virtuals: true // res.json() JSON.stringify() include virtuals
  },
  toObject: {
    virtuals: true
  }
})
```

:::

[Principle of Least Cardinality](https://dev.to/swyx/4-things-i-learned-from-mastering-mongoose-js-25e#4-principle-of-least-cardinality)

### Transform populated documents

  You can manipulate populated documents using the **transform** option. If you specify a **transform** function,
  Mongoose will call this function on every populated document in the result with two arguments

1. The populated document
2. The original id used to populate the document

```js
const articles = await Article.find().populate({
  path: 'user',
  transform: (doc, id) => {
    console.log(doc, id)
    return doc
  }
})
```

### Populate Maps

```js
const BrandSchema = new Schema({
  name: String,
  members: {
    type: Map,
    of: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }
});

// 创建一条数据
class BrandController extends egg.Controller {
  async create_brand () {
    const { singer, writer, name } = this.ctx.request.body
    const brand = new this.ctx.model.Brand({
      name,
      members: {
        writer,
        singer
      }
    })
    await brand.save()
  }
}

// 获取数据时使用populate
const brand = await this.ctx.model.find().populate('members.$*')
/**
 *  {
      "_id": "674bdd14c4b41d790f41989b",
      "name": "飞鹤",
      "members": {
        "singer": {
          "_id": "6745d760ef7d2f8e3ec10056",
          "username": "hello12a12",
        },
        "writer": {
          "_id": "67471c6971f2142a6fdfb58f",
          "username": "hello",
        }
      },
    }
 * 
*/
```

[mongoose-auto-populate](https://plugins.mongoosejs.io/plugins/autopopulate#it-supports-document-arrays)

## plugins

  plugins allow for applying pre-packaged capabilities to extend their functionality. This is a very powerful feature.

```js
// 给文档添加一个 添加一个 loadedAt
module.exports = function loadedAtPlugin(schema, options) {
  schema.virtual('loadedAt').
    get(function() { return this._loadedAt; }).
    set(function(v) { this._loadedAt = v; });

  schema.post(['find', 'findOne'], function(docs) {
    if (!Array.isArray(docs)) {
      docs = [docs];
    }
    const now = new Date();
    for (const doc of docs) {
      doc.loadedAt = now;
    }
  });
};

UserSchema.plugin(loadedAtPlugin)

// 全局Plugin
const mongoose = require('mongoose')
mongoose.plugin(loadedAtPlugin)
```

:::danger
You should make sure to apply plugins before you call **mongoose.model()**
:::

[mongoose-plugin](https://plugins.mongoosejs.io/)

## Timestamps

  Mongoose schemas support a **timestamps** option, If you set *timestamps: true*, Mongoose will add
  two properties of type Date to your schema:

  1. createdAt
  2. updatedAt

```js
const UserSchema = new mongoose.Schema({
  username: String
}, {
  timestamps: true,
  timestamps: { // 自定义属性吗
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})
const User = mongoose.model('User', UserSchema)
const user = new User({
  username: 'hello'
})
await user.save()

/**
 * 
* {
    "_id": "674db7a82fcca47db71132ea",
    "username": "张三123",
    "createdAt": "2024-12-02T13:35:36.510Z",
    "updatedAt": "2024-12-02T13:35:36.510Z",
  }
*/
```

:::info
The **createdAt** property is immutable, and Mongoose overwrites any user-specified updates to
**updatedAt** by default.
:::

```js
 async update_user() {
  const { username, id } = this.ctx.request.body
  /**
   * replaceOne() and findOneAndReplace() overwrite all non-_id properties. 
   * including immutable properties like createdAt
   */
  await this.ctx.model.User.findOneAndReplace(
   {
    _id: id,
   },
   {
    username,
   }
  )
 }
```

## TypeScript

```js
import { Schema, model, HydratedDocument } from 'mongoose'

interface User {
  name: string
  email: string
}

const UserSchema = new Schema<User>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
})

const User = model<User>('User', UserSchema)

const user: HydratedDocument<User> = new User({
  name: 'kyrie',
  email: '123456@qq.com'
})
```

  To define a property of type **ObjectId**, you should use **Types.ObjectId** in the TypeScript document
  interface.

```js
import { Schema, Types } from 'mongoose'
interface User {
  name: String
  organization: Types.ObjectId
}

const userSchema = new Schema<User>({
  name: {
    type: String
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization'
  }
})
```

## MongoDB

1. database: 数据库
2. collection: 数据库表/集合
3. document: 数据记录行/文档
4. field: 数据字段

### Mongo shell安装

  数据库和mongosh安装在 /usr/local 目录下, 安装之后配置环境变量.

```shell
cd ~/.zshrc
export PATH='/usr/local/mongodb/bin:$PATH'
export PATH='/usr/local/mongosh/bin:$PATH'

mongod --version
```

  MongoDB Shell 是MongoDB提供的官方交互式界面。允许用户与MongoDB数据库进行交互,执行命令和操作数据库。

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

### 嵌入式文档
  
  MongoDB使用 点符号来访问数组的元素和访问嵌入式文档的字段。

```js
db.inventory.insertMany([
  {
    item: 'journal',
    qty: 25,
    size: { h: 14, w: 21, uom: 'cm' },
    status: 'A'
  }
])

db.inventory.find({
  "size.uom": "in"
});
// 匹配嵌入式文档
db.inventory.find({
  size: { h: 14, w: 21, uom: 'cm' }
});

// 匹配数组
db.inventory.find({
  tags: ['red', 'blank']
})

// 嵌入式文档数组
[
  {
    item: 'journal',
    stock: [
      { warehouse: 'A', qty: 5 },
      { warehouse: 'C', qty: 15 }
    ]
  }
]
// 查询嵌套在数组中的文档
db.inventory.find({
  stock: { warehouse: 'A', qty: 5 } // 整个嵌入式文档的相等匹配要求与指定文档精确匹配, 包括字段顺序。
})

db.inventory.find({
  stock: { qty: 5, warehouse: 'A' } // 这么查询不匹配inventory中的任何文档
})

// 指定文档的查询条件 (使用.表示法查询)
db.inventory.find({
  "stock.qty": { $lte: 20 }
})
```

  MongoDB不建议对嵌入文档进行比较, 因为这些操作需要与指定的文档完全匹配, 包括字段顺序。

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

### 限制返回字段

```js
const res = db.inventory.find({
  status: 'A'
}).project({
  item: 1,
  status: 1
})
// 匹配文档中仅返回 item, status 和默认情况下的 _id 字段

db.inventory.find({
  status: 'A'
}).project({
  item: 1,
  status: 1,
  _id: 0
})
// 删除返回的_id字段。


const cursor = db
.collection('inventory')
.find({
  status: 'A'
})
.project({ item: 1, status: 1, 'size.uom': 1 }) // 返回嵌入式文档中指定字段
```

### 批量写入

```js
  db.pizzas.bulkWrite([
    { insertOne: { document: { _id: 3, type: "beef", size: "medium", price: 6 } } },
    { insertOne: { document: { _id: 4, type: "sausage", size: "large", price: 10 } } },
    { updateOne: {
        filter: { type: "cheese" },
        update: { $set: { price: 8 } }
    } },
    { deleteOne: { filter: { type: "pepperoni"} } },
    { replaceOne: {
        filter: { type: "vegan" },
        replacement: { type: "tofu", size: "small", price: 4 }
    } }
  ])
```

### 管道聚合(Aggregation Pipeline)

  聚合管道由一个或多个处理文档的阶段组成.

- 每个阶段对输入文档执行一个操作。
- 从一个阶段输出的文档将传递到下一个阶段。

```js
// 以下demo 来自官网
db.orders.insertMany( [
   { _id: 0, name: "Pepperoni", size: "small", price: 19,
     quantity: 10, date: ISODate( "2021-03-13T08:14:30Z" ) },
   { _id: 1, name: "Pepperoni", size: "medium", price: 20,
     quantity: 20, date : ISODate( "2021-03-13T09:13:24Z" ) },
   { _id: 2, name: "Pepperoni", size: "large", price: 21,
     quantity: 30, date : ISODate( "2021-03-17T09:22:12Z" ) },
   { _id: 3, name: "Cheese", size: "small", price: 12,
     quantity: 15, date : ISODate( "2021-03-13T11:21:39.736Z" ) },
   { _id: 4, name: "Cheese", size: "medium", price: 13,
     quantity:50, date : ISODate( "2022-01-12T21:23:13.331Z" ) },
   { _id: 5, name: "Cheese", size: "large", price: 14,
     quantity: 10, date : ISODate( "2022-01-12T05:08:13Z" ) },
   { _id: 6, name: "Vegan", size: "small", price: 17,
     quantity: 10, date : ISODate( "2021-01-13T05:08:13Z" ) },
   { _id: 7, name: "Vegan", size: "medium", price: 18,
     quantity: 10, date : ISODate( "2021-01-13T05:10:13Z" ) }
])

// 聚合
db.orders.aggregate( [
   // Stage 1: Filter pizza order documents by pizza size
   {
      $match: { size: "medium" }
   },
   // Stage 2: Group remaining documents by pizza name and calculate total quantity
   {
      $group: { _id: "$name", totalQuantity: { $sum: "$quantity" } }
   }
])

// 输出
[
   { _id: 'Cheese', totalQuantity: 50 },
   { _id: 'Vegan', totalQuantity: 10 },
   { _id: 'Pepperoni', totalQuantity: 20 }
]
```

  在MongoDB中, 存储在集合中的每个文档都需要一个唯一的 **_id** 字段作为主键。如果插入的文档省略了 **_id** 字段,
  MongoDB驱动程序会自动为 **_id** 字段生成一个 ObjectId.

### 操作符

1. $eq    等于
2. $ne    不等于
3. $gt    大于
4. $gte   大于等于
5. $lt    小于
6. $lte   小于等于
7. $in    在指定的数组中 (在对同一字段进行相同检查时, 请使用$in)
8. $nin   不在指定的数组中
9. $and   符合所有条件
10. $or   符合任意条件
11. $exists 字段是否存在
12. $type   字段的类型

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

### Limit/Skip

  limit() 用于限制查询结果返回的文档数量, 而skip()用于跳过指定数量的文档。

```shell
db.users.find().skip(20).limit(10)
```

:::danger
当结合 skip() 和 limit() 时，skip() 应该在 limit() 之前使用，以避免意外行为
:::

[MongoDB查询谓词与投影](https://www.mongodb.com/zh-cn/docs/manual/reference/operator/query/#std-label-query-projection-operators-top)

[MongoDB下载](https://www.mongodb.com/try/download/community)
[MongoDB-Shell](https://www.mongodb.com/try/download/shell)
[MongoDB-Compass](https://www.mongodb.com/try/download/compass)
