---
title: Getting-Start
group:
  title: Webpack
---

## 入口

  --config 可以指定配置文件, 默认配置文件 webpack.config.js

```json
{
  "build": "webpack --config webpack.prod.js",
  "serve": "webpack"
}
```

```js
module.exports = {
  mode:'development',
  // 或者从命令行传递 webpack --mode=development
  mode: 'production',
  context: path.resolve(__dirname, 'app') // 基础目录,(绝对路径)
  entry: path.resolve(__dirname, 'src/index.js'), // 入口
  output: { // 出口
    path: path.resolve(__dirname, 'src/dist'),
    filename: 'bundle.js',
    /*
    fullhash: 完整的hash值
    id: 此chunk的id
    name: 此chunk的名称
    chunkhash: 此chunk的hash, 包含该chunk的所有元素
    contenthash: 只包含该内容类型的元素
    chunkFilename: 非初始 chunk文件的名称, 这些文件名需要在运行时根据chunk发送的请求去生成。
    */
    chunkLoading: 'jsonp', // 加载chunk的方法(jsonp(web) import(ESM))
    clean: true, // 在生成文件之前清空output目录
    publicPath: ''  // 按需加载或加载外部资源 每个url的前缀
  }
}

// 也可以导出函数
module.exports = function (env, arg) {
  return {
    mode: 'production',
    // ...
  }
}

/**
 * 动态加载的模块 不是 入口起点。每个HTML页面都有一个入口起点。SPA: 一个入口起点, 多页应用: 多个入口起点
*/
```

  如果传入一个字符串或者字符串数组, chunk会被命名为 **main**, 如果传入一个对象, 则每个属性的 (key) 会是chunk的名称。
  (入口的输出文件名是从 output.filename中提取出来的)

```js
module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'dist')
  }
  // 以上打包输出 main.js
  entry: {
    main: path.join(__dirname, 'src/index.js'),
    greet: path.join(__dirname, 'src/greet.js'),
  },
  // 以上打包输出 main.js, greet.js
  entry: {
    main: path.join(__dirname, 'src/index.js'),
    greet: path.join(__dirname, 'src/greet.js'),
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js'
  }
  // 以上打包输出 main.bundle.js, greet.bundle.js
  entry: {
    main: {
    import: path.join(__dirname, 'src/index.js'),
    dependOn: 'react',
    },
    greet: {
    import: path.join(__dirname, 'src/greet.js'),
    dependOn: 'react',
    },
    react: ['react'],
  },
  // 将依赖的公共第三方库拆分出来
}
```

## Output

  指示webpack输出 [bundle, asset]等资源的位置。

```js
module.exports = {
  output: {
    chunkFilename: '[name.bundle].js', // 非初始 chunk 文件的名称。
    /**
     * 1. 动态导入的js文件
    */
    chunkFormat: 'commonjs',
    clean: true,  // 打包时清空之前的 output目录
    filename: '[name].bundle.js', // 每个输出bundle的名称。---> 使用入口名称
    filename: '[id].bundle.js',   // 使用内部 chunk id
    filename: '[contenthash].bundle.js', // 使用由内容生成的hash
    filename: '[name].[contenthash].bundle.js',  // -----> 使用多个组合
    globalObject: 'this', // 决定使用哪个全局对象来挂载library.
    hashDigest: 'hex',    // 生成hash时使用的编码方式
    hashDigestLength: 20, // 打包生成的文件名中使用hash的长度
    path: path.resolve(process.cwd(), 'dist'), // 对应一个绝对路径，
  }
}
```

## TypeScript

```js
import * as webpack from 'webpack';

const config: webpack.Configuration = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    // ...
  }
}

export default config;
```

  output.filename 的文件 hash长度 可以使用 hash:16 contenthash:16等指定, 或者通过指定 output.hashDigestLength
  在全局配置长度。

## 管理资源

### style-loader/css-loader

  模块loader可以链式调用。链中的每个loader都将对资源进行转换。链会逆序执行。第一个loader将其结果传递给
  下一个loader,依此类推。

```js
// style-loader  Inject CSS into the DOM
//在背后使用了module.hot.accept,在css依赖模块更新之后,会将其patch到<style>标签中

// src/index.js
import './style.css'
function createElement() {
  const div = document.createElement('div')
  div.classList.add('item')
  div.textContent = '你好生活'
  return div
}
document.body.appendChild(createElement())

// webpack.config.js
module.exports = {
  // ...
  entry: path.resolve(__dirname, 'src/index.js'),
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use:['style-loader', 'css-loader']
      }
    ]
  }
}
```

### 资源模块

  资源模块(asset module)是一种模块类型, 它允许使用资源文件(字体,图标等), 而无需配置额外的loader.

1. asset/resource:  发送一个单独的文件并导出URL.
2. asset/inline:    导出一个资源的data URI
3. asset/source:    导出资源的源代码
4. asset:           在导出一个data URI 和 发送一个单独的文件之间自动选择。小于8kb的文件,将会视为inline模块类型。

```js
module.exports = {
// ...
  module: {
    rules: [
      {
        test: /\.(png|webp|jpg|jpeg)$/,
        type: 'asset/source'  // 'asset/resource' 'asset/inline' 'asset'
      }
    ]
  }
}
```

1. asset/inline
2. asset/resource
3. asset/source

  默认情况下, asset/resource 模块以 hash|ext|query 文件名发送到输出目录,可以在webpack配置中设置output.assetModuleFilename来修改模板字符串

```js
module.exports = {
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    assetModuleFilename: 'images/[hash][ext][query]'
  }
}
```

  webpack按照 type:'asset' 打包资源文件时,自动地在 resource 和 inline之间进行选择: 小于8kb的文件,将会视为inline模块类型,
  否则会被视为resource模块类型。
  可以通过 选项 parser.dataUrlCondition.maxSize 配置。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.png$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024  // 1024kb
          }
        }
      }
    ]
  }
}
```

## 代码分离

  代码分离是把代码分离到不同的bundle中, 然后可以按需加载或并行加载这些文件。代码分离可以获取更小的bundle.

  常用的代码分离方法有三种:

1. 入口起点: 使用entry 配置手动的分离代码
2. 防止重复: 使用SplitChunksPlugin 去重和分离chunk
3. 动态导入: 通过模块的内联函数调用分离代码

### 配置多个入口

```js
// webpack.config.js
// - 多个入口
module.exports = {
  mode: 'development',
  entry: {
    app: path.resolve(__dirname, 'src/index.js'),
    main: path.resolve(__dirname, 'src/main.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  }
  // ...
}
```

  上面配置会将bundle打包成 app.bundle.js 和 main.bundle.js, 但是会有一个问题, 两个入口文件中都引入了lodash,
  这样配置会在两个bundle中造成重复引用。

```js
// webpack.config.js
{
  entry: {
    app: {
      import: path.resolve(__dirname, 'src/index.js'),
      dependOn: 'shared'
    },
    main: {
      import:  path.resolve(__dirname, 'src/main.js'),
      dependOn: 'shared'
    },
    shared: 'lodash'
  },
  optimization: {
    runtimeChunk: 'single'
  }
}
```

### SplitChunksPlugin

  可以将公共的依赖模块提取到已有的入口chunk中。或者提取到一个新生成的chunk.

  默认情况下, 它只会影响到按需加载的chunks, 因为修改initial chunks 会影响到项目的HTML文件中的脚本文件。

```js
// webpack.config.js
module.exports = {
  mode: 'development',
  // ... 
  entry: {
    app: path.resolve(__dirname, 'src/index.js'),
    main: path.resolve(__dirname, 'src/main.js')
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        antd: {
          name: 'antd-chunk',
          test: /antd/,
          priority: 100,
          // 如果当前chunk包含已经从主bundle中拆分出来的模块, 则它将被重用。
          reuseExistingChunk: true
        },
        vendors: {
          name: 'vendors-chunk',
          test: /node_modules/,
          priority: 90
        }
      }
    }
  }
}
```

### 动态导入

  使用import()语法来实现动态导入

```js
// main.js
function print(message) {
  console.log(message)
}
export default print

// index.js
const button = document.createElement('button')
button.textContent = 'click'
button.addEventListener('click', function() {
  import(/*webpackChunkName: 'print'*/ './main.js').then(fn => {
    console.log(fn)
    fn.default('hello')
  })
}, false)
document.body.appendChild(button)


// webpack.config.js
{
  // ...
  entry: path.resolve(__dirname, 'src/index.js'),
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      chunks: 'all'
    }
  }
}
```

  当点击button按钮的时候, 会异步加载 print.bundle.js 文件, 默认导出的函数 挂载 在 对象的default 属性上
  
### prefetch / preload

  prefetch(预获取) / preload (预加载)

```js
import(/*webpackPrefetch: true*/ './util/index.js')
```

  prefetch: 只要父chunk完成加载, webpack就会添加prefetch hint(预取指示)

  preload:

1. preload chunk 会在父chunk加载时, 以并行方式开始加载. 而prefetch chunk会在父chunk加载结束后开始加载
2. preload chunk 具有中等优先级, 并立即下载。 prefetch chunk会在浏览器闲置时下载
3. preload chunk会在父chunk中立即请求,用于当下时刻, prefetch chunk会用于未来的某个时刻。

```js
// src/index.js 
// 改造一下上面的例子
import(/*webpackPrefetch: true*/ './main.js').then(fn => {
  fn.default('hello')
})

//会在html 生成下面的 引用
//<link rel="prefetch" as="script" href="http://localhost:9098/src_main_js.bundle.js">
```

## 缓存

  命中缓存可以降低网络流量, 使网站加载速度更快。

  webpack提供了一种称为 substitution(可替换模板字符串)的方式, 通过带括号字符串来模板化文件名。
  其中, [contenthash] substitution将根据资源内容创建出唯一hash. 当资源内容发生变化时,[contenthash]也会发生改变。

  在介绍 hash 之前先介绍一下 contenthash fullhash 和 chunkhash 之间的区别

### fullhash

  如果使用hash的话, 每次修改任何一个文件, 所有打包生成的文件名hash都会改变, 所以一旦修改了任何一个文件, 整个项目的缓存都将失效。

### chunkhash

  chunkhash是根据不同的入口文件进行依赖文件解析,构建对应的chunk。生成对应的hash值。将上面的demo文件名改为 chunkhash 再次打包:

  不同的bundle 的hash值不一致, 但是css文件是作为模块引入到Javascript中的, 所以对应的css文件hash 和 bundle.js hash值一致。

  这样就产生了一个问题：如果仅修改js文件 但是不修改css文件, 或者只修改css文件 不修改 js文件, 会导致两者的 hash值都发生改变。

### contenthash

  contenthash 将根据资源内容创建出唯一 hash。当资源内容发生变化时,contenthash 也会发生变化。

  webpack还提供了一个优化功能,可以使用optimization.runtimeChunk 选项将runtime代码拆分为一个单独的chunk. 将其设置为
  single为所有chunk创建一个runtime bundle.

```js
// webpack.config.js
{
  // ...
  optimization:{
    runtimeChunk: 'single'
  }
}
```

  runtimeChunk 指的是webpack的运行环境和模块信息清单, 模块信息清单在每次有模块变更hash时 都会变。将这部分内容单独打包出来,
  就不会因为某个模块的变更导致模块信息的模块缓存失效.

```js
// webpack.config.js
module.exports = {
  mode: 'development',
  entry: {
    app: path.resolve(__dirname, 'src/index.js'),
    // index.js中异步导入了一个js文件 print.js
  },
  output: {
    filename: '[name].[contenthash:8].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true
  },
  optimization: {
    runtimeChunk: 'single'
  }
}
```

  此时, 更新index.js文件, 只有app.js的hash值会改变, 而如果更改 print.js 则 print.bundle.js和 runtime.bundle.js
  hash值都将更改。

## Resolve

  这些选项能够设置模块如何被解析。

1. alias

  创建 import 或者 require 的别名, 来确保模块引入变得更简单

```js
// webpack.config.js
const path = require('path')
module.exports = {
  // ...
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    }
  }
}
```

* resolve.enforceExtension

  如果是true, 将不允许无扩展名文件, 默认false

* extensions

  尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件
  并跳过其余的后缀。

```js
// webpack.config.js
module.exports = {
  // ...
  resolve: {
    // 尝试按顺序解析这些后缀名。
    extensions: ['.js', '.jsx', '.ts'],
    // 解析目录时要使用的文件名 例如 import * as D3 from 'd3'
    mainFields: ['browser', 'module', 'main'],
    mainFiles: ['index'],
    // webpack解析模块时 应该搜索的目录
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    // 模块解析失败, 重定向至某个模块
    fallback: {
      xyz: path.resolve(__dirname, 'path/to/file.js')
    }
  }
}
```

  能够是用户在引入模块时不带扩展

```js
import { print } from './print'
print('hello world')
```

## Module

  这些选项决定了如果处理项目中的不同类型的模块。

```js
module.exports = {
  module: {
    noParse: /jquery|lodash/, // 防止webpack解析这些文件。
    rules: [
      // 每个规则可以分为三部分 1.条件 2.结果 3.嵌套规则
      {
        test: /\.css$/,
        oneOf: [ // 当规则匹配时, 只使用第一个匹配的规则
          {
            resourceQuery: /inline/,
            use: 'url-loader'
          }
        ]
      },{
        test: /\.png$/,
        type: 'asset/resource',
        generator: { // 对指定的资源模式指定 publicPath
          publicPath: 'assets/', // url('./abc.png')---> 加载 assets/abc.png 
          filename: 'static/[hash:12][ext]', // 打包时生成的文件名
        }
      },
      {
        type: 'asset',
        type: 'asset/resource',
        type: 'asset/inline',
        // ...
      },
      {
        // 传入多个loaders, 从右向左被应用。
        use: ['style-loader', {
          loader: 'css-loader',
          options: {}
        }]
      }
    ]
  }
}
```

## 优化

### optimization.chunkIds

  告知webpack当选择模块 id 时 需要使用哪种算法。开发环境 **optimization.chunkIds** 会被设置为 *named*.
  生产环境会被设置为 *deterministic*

  开发环境下的chunks 文件名为 src_plugins_plugin-a_js.js / src_plugins_plugin-b_js.js。而在生产环境下则为
  570.js / 571.js

### optimization.minimize

  告知webpack 使用 TerserPlugin 或其他在 **optimization.minimizer** 定义的插件压缩 bundle.

```js
module.exports = {
  minimize: true,
  minimizer: [
    new CssMinimizerPlugin(),
    new TerserPlugin()
  ],
  optimization: {
    removeEmptyChunks: true, // 如果chunk为空, 告知webpack移除这些chunk.
    // 会为每个入口添加一个只含有runtime的额外chunk.
    runtimeChunk: 'single',
    chunkIds: 'named',
    moduleIds: 'named' // 模块id的算法
  }
}
```
