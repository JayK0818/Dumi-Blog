---
title: Plugin
group:
  title: Webpack
---

# Plugin

  webpack插件是一个具有 **apply** 方法的JavaScript对象。apply方法会被 webpack compiler调用, 并且在整个
  编译生命周期都可以访问compiler对象。

```js
class CustomWebpackPlugin {
  apply (compiler) {
    compiler.hooks.run.tab(pluginName, (compilation) => {
      console.log('hello...')
    })
  }
}
module.exports = CustomWebpackPlugin
```

## html-webpack-plugin

  This is a webpack plugin that simplifies creation of HTML files to serve your webpack bundles.
  This is especially useful for webpack bundles that includes a hash in the filename which changes every compilation.

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin({
      title: 'html-webpack-plugin',  // document.title   default: Webpack App
      // filename: 'about.html',  //     default: index.html
      // filename: '[name].html',  // 根据入口名字生成
      template: path.join(__dirname, 'src/template.html'),
      inject: 'body', // true | head | body | false
      /*
      inject all assets into the given template or templateContent.
      body: all javascript resources will be placed at the bottom of the body element
      head: will place the scripts in the head element
      true: will add it to the head/body depending on the scriptLoading option.
      false: will disable automatic injections
      */
      // publicPath: '/assets/',  
      // index.html 引用的资源路径 used for script and link tags
      scriptLoading: 'blocking',   // blocking defer module
      favicon: path.join(__dirname, 'src/icon.svg'),  // icon图标
      minify: false,  // true if mode is 'production' otherwise false
      hash: true, // 引入的 js css文件名后带hash值  
      // if true then append a unique webpack compilation hash to all 
      // included scripts and css files
      cache: false,
      chunks: ['app'], // Allows you to add only some chunks
      meta: {     // allows to inject meta tags
        viewport: 'width=device-width,initial-scale=1',
        content: 'webpack,html-webpack-plugin',
        keywords: 'webpack',
        'theme-color': '#4285f4'
      },
      // base: 'http://192.168.0.141:8080', will inject a base tag 
    })
  ]
}
```

## mini-css-extract-plugin

  This plugin extract CSS into separate files. It creates a CSS file per JS file which contains CSS.
  It supports On-Demand-Loading of CSS and SourceMaps;

```js
// webpack.config.js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  plugins: [new MiniCssExtractPlugin({
    filename: '[name].[contenthash:8].css',
    //文件名  default: [name].css
    chunkFilename: '[name].[contenthash:8].css',
    /**
     * determines the name of non-entry chunks files
     * 比如在非入口chunk中引入的css文件, xxx.[hash:8].js中引入了css文件, 则该css文件名也为xxx.[hash:8].css
     * */ 
    attributes: { 
      //if defined, mini-css-extract-plugin will attach given attributes 
      //with their values on <link> element.It only applied to dynamically loaded css chunks
      id: 'hello',
      'data-target': 'hello'
    },
    insert: 'head',// string / function
    /*
    inserts the link tag at the given position for non-initial css chunks.
    */ 
    linkType: 'text/css',  // boolean (false disables the link type attribute)
    /*
    This option allows loading asynchronous chunks with a custom link type.
    */
    ignoreOrder: true // Enable to remove warnings about conflicting order
  })],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      }
    ]
  }
}

// plugin/index.js
import '../style/reset.scss'
const sum = (a, b) => a + b
export { sum }

// index.js
import(/*webpackChunkName: 'plugin' */ './plugins/index.js')

/**
 * plugin.0a2c950be0.js
 * plugin.2fea846a69.css
*/
```

### Minimizing For Production

  To minify the output, use a plugin like css-minimizer-webpack-plugin

```js
// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: []
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].css'
    })
  ],
  optimization: {
    minimize: true  // 开发环境压缩css代码
    minimizer: [
      new CssMinimizerPlugin()
    ]
  }
}
```

  以上配置在 mode 为 production时 会压缩css. 如果想在开发环境下也压缩, 可以设置optimization.minimize 为true

### Extracting all CSS in a single file

```js
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
}
```

## css-minimizer-webpack-plugin

  这个插件使用cssnano优化和压缩css.

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  optimization: {
/*This will enable CSS optimization only in production mode
  If you want to run it also in development set the optimization.minimize 
  option to true
*/
    minimizer: [
      new CssMinimizerPlugin({
        test:/\.css(\?.*)?$/i,  // test to match files against
        include:undefined, // files to include
        exclude:undefined,  // files to exclude
        parallel: true,  //  enable/disable multi-process parallel running.
        minify: CssMinimizerPlugin.cssnanoMinify
        /**
         * 允许覆盖默认的minify函数。
         * 1. CssMinimizerPlugin.cssnanoMinify
         * 2. CssMinimizerPlugin.cleanCssMinify
         * // ...
        */
      })
    ]
  },
  plugins: [new MiniCssExtractPlugin()]
};
```

## copy-webpack-plugin

  Copies individual files or entire directories, which already exist, to the build directory.

```js
// webpack.config.js
const CopyPlugin = require('copy-webpack-plugin')
module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: 'files',
          to: path.resolve(__dirname, 'dist/files'),
          context: path.resolve(__dirname, 'src')
        }
      ]
    })
  ]
}
```

```js
//...
{
  patterns: [
    {
      from: 'files/poem.txt',
      to: path.resolve(__dirname, 'dist/files/poem.txt'),
      context: path.resolve(__dirname, 'src'),
      priority: 10,
      force: true,
    },{
      from: 'files/hello.txt',
      to: path.resolve(__dirname, 'dist/files/poem.txt'),
      context: path.resolve(__dirname, 'src'),
      priority: 20,
      force: true,
    }
  ]
}
```

* priority

  Allows to specify the priority of copying files with the same destination name,Files for the
  patterns with higher priority will be copied later.

* transform

  Allows to modify the file contents

```js
// webpack.config.js
new CopyPlugin({
  patterns: [
    {
      from: 'files',
      to: path.resolve(__dirname, 'dist/files'),
      context: path.resolve(__dirname, 'src'),
      transform(context) {
        return context.toString() + '12345'
      }
    }
  ]
})
```

* concurrency

  limits the number of simultaneous requests to fs

## terser-webpack-plugin

  如果使用webpack v5或者更高版本, 同时希望自定义配置, 那么仍需安装此插件。

```js
// webpack.config.js
module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      test: /\.js(\?.*)?$/i,
      include: undefined,  // 匹配参与压缩的文件
      exclude: undefined, // [/node_modules/] 排除
      extractComments: false, // 是否将注释玻璃到单独的文件中. *.LICENSE.txt
      terserOptions: {
        format: {
          comments: false // 删除所有注释
        }
      }
    })],
  }
}
```

## EnvironmentPlugin

  The EnvironmentPlugin is shorthand for using the DefinePlugin on process.env keys.

```js
module.exports = {
  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'development',  // using development
      DEBUG: true
    })
  ]
}

// not specifying the environment variable raises an 'EnvironmentPlugin.${key}', 
// environment variable is undefined error.
```

## LimitChunkCountPlugin

  While writing your code, you may have already added many code split points to load stuff on demand.After compiling you might
  notice that some chunks are too small - creating large HTTP overhead.
  LimitChunkCountPlugin can post-process your chunks by merging them.

```js
// index.js
import(/*webpackChunkName: 'print1'*/ './typescript/print.ts').then(({print}) => {
  print('hello world1')
})
import(/*webpackChunkName: 'print2'*/ './typescript/print2.js').then(({print}) => {
  print('hello world2')
})
// ....
import(/*webpackChunkName: 'print10'*/ './typescript/print10.js').then(({print}) => {
  print('hello world10')
})
// 在入口文件 点击按钮时 异步加载10个 js文件


// webpack.config.js
const webpack = require('webpack');
module.exports = {
  // ...
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 5,
    }),
  ]
};
```

  在没有配置 new webpack.optimize.LimitChunkCountPlugin时 network面板是这样的

  而在配置了限制生成chunk数量时, 点击按钮加载的js文件是下面这样的, 加上主入口chunk, 一共5个

### MinChunkSizePlugin

  Keep chunk size above the specified limit by merging chunks that are smaller than the minChunkSize.

```js
new webpack.optimize.MinChunkSizePlugin({
  minChunkSize: 10000, // Minimum number of characters
});
```

## webpack-dev-server

```js
module.exports = {
  devServer: {
    static: {
      // 告知服务器从哪里提供内容,也可以传递一个数组, 提供多个选项
      directory: path.join(__dirname, 'public')
    },
    compress: true, // 利用gzips压缩 public/目录当中的所有内容
    port: 9000, // 指定端口
    // 允许可访问的开发服务器白名单
    allowedHosts: [
      'host.com',
      'baidu.com'
    ],
    client: {
      logging: 'warn', // 浏览器中设置日志级别。
      overlay: true,
      overlay: {
        errors: true,
        warnings: false
      },
      progress: true, //在浏览器中显示编译进度
    }，
    https: true, //使用https提供服务
    historyApiFallback: true,
    /**
     * When using HTML5 History API, the index.html page will likely have to be served in
     * place of any 404 responses.
    */
   host: '0.0.0.0',
   hot: true, // 启用webpack的热模块替换
   onAfterSetupMiddleware: function (devServer) {
    devServer.app.get('/api/v1/todos', (res, res) => {
        res.json({
          code: 1,
          msg: 'success',
          data: []
        })
      })
    },
    open: true,  // 在服务启动后自动打开浏览器
    // 开发服务使用 http-proxy-middleware
    proxy: {
      '/api': 'http://xxx:3000',
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: {
          '^/api': ''
        },
        // 如果不想代理所有内容, 可以提供一个函数
        bypass: (req, res, proxyOptions) {

        }
      }
    },
    proxy: [ // 多个特定路径代理到同一个目标
      {
        context: ['/auth', '/api'],
        target: 'https://localhost:3000'
      }
    ],
    server: 'http', // https
  }
}
```
