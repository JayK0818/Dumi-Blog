---
group:
  title: Webpack
---

# Loader

  loader用于对模块的源代码进行转换。 **module.rules**允许你在webpack配置中指定多个loader。
  我们预期loader模块导出为一个函数。并且编写为Node.js兼容的JavaScript.

## babel-loader

  此loader 允许你使用 Babel 和 webpack 转译JavaScript文件。

```shell
npm install -D babel-loader @babel/core @babel/preset-env
```

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}
```

```js
// math.js
const square = (x) => Math.pow(x, 2)
const cube = (x) => Math.pow(x, 3)

class Player {
  constructor(name) {
    this.name = name;
  }
  add(x) {
    return cube(x)
  }
}

export {
  square,
  cube,
  Player
}

// 上面三个方法经过babel转译后，变成了下面的代码
var square = function square(x) {
  return Math.pow(x, 2);
};
var cube = function cube(x) {
  return Math.pow(x, 3);
};
var Player = /*#__PURE__*/function () {
  function Player(name) {
    _classCallCheck(this, Player);
    this.name = name;
  }
  _createClass(Player, [{
    key: "add",
    value: function add(x) {
      return cube(x);
    }
  }]);
  return Player;
}();
```

## style-loader

```js
// injectType: allows to setup how styles will be injected into the DOM
/*
default: styleTag
singletonStyleTag: Automatically injects styles into the DOM using one <style>
*/

// lazyStyleTag:
// injects styles into the DOM using multiple <style></style> on demand.
// webpack.config.js
{
  // ...
  module: {
    rules: [
      {
        test: /\.css$/,
        exclude:/\.lazy\.css$/,
        use:['style-loader','css-loader']
      },
      {
        test: /\.lazy\.css$/,
        use:[
          {
            loader: 'style-loader',
            options: {
              injectType: 'lazyStyleTag'
            }
          },
          'css-loader'
        ]
      }
    ]
  }
}
```

- attributes: the style-loader will attach given attributes with their values on style element.

```js
// ... 
{
  test: /\.css$/,
  use: [{
    loader: 'style-loader',
    options: {
      attributes: {
        id: 123
      }
    }
  }, 'css-loader']
}
```

- insert: default: head  指定style标签插入的位置.

```js
// webpack.config.js
// ...
{
  test: /\.css$/,
  use:[{
    loader:'style-loader',
    options: {
      insert: 'body'
    }
  },'css-loader']
}
```

- Source maps

  The loader automatically inject source maps when previous loader emit them. Therefore,to generate source maps,
  set the sourceMap option to true for the previous loader

## css-loader

  The css-loader interprets @import and url() and will resolve them.

### url: Boolean / Object

  Enable/disable url() resolving

### import:  Boolean / Object
  
  allows to enables/disables @import at-rules handing.

```js
// webpack.config.js
// ...
rules: [
  {
    test: /\.css$/i,
    loader: "css-loader",
    options: {
      url: false  // boolean  设置为false 无法解析背景图片url地址 (本地资源路径)
      url: { // object
        filter: (url, resourcePath) => {
          if(url.includes('webp')) { // 不会处理webp文件 （本地资源路径）
            return true
          }else{
            return false
          }
        }
      },
      import: true  // default: false
      import: {
        filter: (url, media, resourcePath) => {
          if(url.includes('style.css')) {
            return false
          }
          return true
        }
      }
    },
  }
```

  import设置为false时, 浏览器会报警告。
:::danger
 Refused to apply style from '<http://localhost:9008/index.css>' because its MIME type ('text/html') is not a supported stylesheet MIME type, and strict MIME checking is enabled.
:::

### modules

  Allows to enable/disable CSS Modules

  default: undefined

1. undefined:
  enable CSS modules for all files matching /\.module\.\w+$/i.test(filename)

2. true:
  enable CSS modules for all files

3. false:
  disable CSS modules for all files

4. string: disables CSS modules for all files and set the mode option.

```js
// index.js  入口
import './css/index.module.css'
import './css/index.css'

// webpack.config.js
// ...
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader',{
        loader: 'css-loader',
        options: {
          modules: undefined, // default
          modules: true, // 对所有文件启用CSS模块
          modules: false, // 对所有文件禁用CSS模块
          // Using `local` value has same effect like using 'modules:true'
          // 所有文件类名都不会被编译为哈希字符串 使用:local 的css 会会编译为 哈希类名
          modules: 'global',
          modules: 'local' // 所有文件类名都会被编译为哈希字符串 但是使用:global 的 css 除外
          // 当modules配置项为对象时允许基于文件名自动启用CSS模块。
        }
      }]
    }
  ]
}
```

### mode

  CSS modules 允许使用:global(.className)的语法, 声明一个全局规则。凡是这样声明的class, 都不会被编译成哈希字符串。

```js
// webpack.config.js
{
  test: /\.css$/,
  use:['style-loader', {
    loader: 'css-loader',
    options: {
      // 如果没有配置modules.auto, 则对所有文件启用CSS模块。
      modules: {
        auto: undefined,  //enable CSS modules for all files
        auto: true,  // 匹配 module.css的文件
        auto: false, // disable CSS modules
        auto: /\.module\.css/, // enable CSS modules for all files matching 
        auto: function(resourcePath) {
          if(resourcePath.includes('index')) { // 过滤掉所有文件名包含index的文件
            return false
          }
          return true
        },
        localIdentName: '[hash:base64:8]', //hash class 生成的规则
        // name: 文件名
        // folder 文件夹名称
        // path 文件夹的相对路径
        // file filename and path
        // hash hash字符串
        // local : original class 转换前的类名
        /** 建议:
         * 1. 开发环境使用 '[path][name]__[local]'
         * 2. 生产环境使用 '[hash:base64]'
        */
        // Allows to redefine basic loader context for local ident name
        localIdentContext: path.resolve(__dirname, 'src/css')

        // Allows to specify hash function to generate classes. 
        localIdentHashFunction: 'md4'

        // Allows to specify hash digest length to generate class
        localIdentHashDigestLength: 28

        hashStrategy: 'resource-path-and-local-name'  // 生成has的策略
      }
    }
  }]
}
```

### importLoaders

  The options importLoaders allows you to configure how many loaders before css-loader should be applied
  to @import ed resources and CSS modules imports

```js
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use:['style-loader', {
          loader: 'css-loader',
          options: {
            importLoaders: 2
            // 0 => no loaders (default);
            // 1 => postcss-loader;
            // 2 => postcss-loader, sass-loader
          }
        },'postcss-loader', 'sass-loader']
      }
    ]
  }
}
```

## sass-loader

  加载sass/scss文件并编译为css.

```js
// install
npm install sass-loader sass --save-dev

module.exports = {
  module: {
    rules: [
      {
        test: /\.(scss|css)$/i,
        use: [
          'style-loader',
          'css-loader',
          // 将 Sass 编译成 CSS
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true, // enable/disable source map
              sassOptions: {
                indentWidth: 4  // 空格数量
              }
            }
          }
        ]
      }
    ]
  }
}
```

## postcss-loader

  使用 postcss处理 CSS

```shell
npm install --save-dev postcss-loader postcss
npm install postcss-preset-env --save-dev

# 处理写在JS中的样式
npm install --save-dev postcss-js
```

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                parser: 'postcss-js', // 处理js中的样式
                plugins: [
                  [
                    'postcss-preset-env'
                  ]
                ]
              }
            }
          }
        ]
      }
    ]
  }
}
```

:::info
postcss-preset-env包含 autoprefixer, 如果使用了 preset 就无需单独添加 autoprefixer
:::
