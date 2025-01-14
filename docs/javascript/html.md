---
title: HTML
group:
  title: 基础
---

## meta

  HTML meta 元素表示那些不能由其他HTML元相关元素表示的 **元数据** 信息。

1. name
2. http-equiv: 编译指示指令
3. charset: 文档字符编码, 如果存在该属性, 则其值必须是字符串 **utf-8**
4. itemprop

[MDN-mate标签](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/meta)

```html
<meta charset="utf-8" />

<!-- 3秒后刷新页面 -->
<meta http-equiv="refresh" content="3;url=https://www.mozilla.org" />
```

## script

  渲染引擎在解析HTML时, 若遇到script标签引用文件, 则会暂停解析过程, 文件加载后会切换至JavaScript引擎在执行对应代码,
  代码执行完成之后再切换至渲染引擎继续渲染页面。

1. async
  立即请求文件, 但不阻塞渲染引擎, 文件加载完毕后阻塞渲染引擎并立即执行文件内容。(脚本会并行请求, 无法保证请求顺序)
2. defer
  立即请求文件, 但不阻塞渲染引擎, 等到解析完HTML之后再执行文件内容. 触发 DOMContentLoaded事件之前执行。
  (脚本加载顺序按照它们在页面上出现的顺序加载。)
3. module
  同defer

## link

  link元素规定了当前文档与某个外部资源的关系。

```html
<!-- rel 表示关系 -->
<link href="main.css" rel="stylesheet" />

<link rel="icon" href="favicon.ico" />

<link
  rel="apple-touch-icon"
  sizes="114x114"
  href="apple-icon-114.png"
  type="image/png" />
```

  样式文件管理模式/目录结构

* base 模版代码
* components  组件相关样式
* layout      布局相关
* pages       页面相关
* themes      主题样式
* vendors     第三方样式文件

  CSS类名命名推荐: BEM (Block, Element, Modifier)

  工具命名: Css-Modules

### disabled

  仅对于 *rel="stylesheet"*而言, disabled 布尔属性表示是否应该加载所述样式表并将其应用于文档。
  如果在加载 HTML 时指定了disabled，则在页面加载过程中不会加载样式表。

### preload

  link 元素的 **rel** 属性的 preload值 允许你在 HTML的 head 中声明获取请求, 指定页面很快就需要的资源。这些资源是你希望在页面
  生命周期的早期就开始加载的。

```html
<html>
  <head>
    <link rel='preload' href='main.js' as='script'/>
  </head>
</html>
```

  在预加载启用**CORS**的资源, 需要特别注意在你的 link 元素上设置 crossorigin 属性。

  监听样式表加载

```js
const stylesheet = document.getElementById("link");
stylesheet.onload = () => {
};
stylesheet.onerror = () => {
  console.log("加载样式表时发生错误！");
};
```

## OGP

  Open Graph Protocol: 开放图表协议, 增加文档信息来提升社交网页在被分享时的预览效果。

```html
<meta property="og:title" content="The Rock" />
<meta property="og:type" content="video.movie" />
<meta property="og:url" content="https://www.imdb.com/title/tt0117500/" />
<meta property="og:image" content="https://ia.media-imdb.com/images/rock.jpg" />
```

[ogp](https://ogp.me/)
