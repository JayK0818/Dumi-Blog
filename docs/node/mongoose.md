---
nav: Node
---

# Mongoose

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
// 在调用 mongoose.model() 之前注册
schema.pre('save', (next, options) => {
  console.log('save-middleware')
  next()
})
const User = mongoose.model('User', schema)
```

  The **save** function triggers **validate()** hooks. All **pre('validate')** and **post('validate')**
  hooks get called before any **prev('save')** hooks.
