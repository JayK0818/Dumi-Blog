---
title: DOM
group:
  title: 基础
---

## 介绍

  文档对象模型（DOM）是 web 上构成文档结构和内容的对象的数据表示。DOM不是JavaScript语言的一部分。而是用于建立网站的Web API.
  DOM被设计成与特定编程语言相独立。

## HTML到DOM

  1. 字节流解码
  2. 输入流预处理 (将字符数据进行统一格式化)
  3. 令牌化: 将字符数据转换为令牌(Token), 解析HTML生成 DOM树 (匹配到字符 <, 进入 *标签打开状态*, 匹配到字符 /, 进入*标签结束状态*)

## Node.nodeType

  只读属性 **nodeType** 表示该节点的类型。可用来区分不同类型的节点

1. Node.ELEMENT_NODE (1) 元素节点
2. Node.ATTRIBUTE_NODE (2) 属性
3. Node.TEXT_NODE (3)   文本节点
4. Node.COMMENT_NODE (8) 注释节点

## Node.textContent

  Node 接口的 textContent 属性表示一个节点及其后代的文本内容返回一个字符串或者 null
  在节点上设置 textContent属性的话,会删除它的所有的子节点,并替换为一个具有给定值的文本节点。

* 如果节点是一个document,则textContent返回null, 如果想获取整个文档的文本,可以使用document.documentElement.textContent

```hml
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Node</title>
  <style>
    body{padding: 0;margin: 0;}
  </style>
</head>
<body>
  <div>hello world</div>
  <script src='./src/text-content.js'></script>
  <script>
    function print(message){
      console.log(message)
    }
    print('hello world')
  </script>
</body>
</html>
```

```js
document.textContent  // null

// 在一段html代码获取的文本为, 包括style和script之间的文本
document.documentElement.textContent
// Node
// body{padding: 0;margin: 0;}
// hello world
```

* 在节点设置textContent属性的话,会删除它的所有子节点,并替换为一个具有给定值的文本节点。

### 与innerText的区别

  1. textContent会获取所有元素的内容,包括 script 和 style 元素, 而innerText只展示给人看的元素。

```js
<div class='wrapper'>
  <div style='opacity:0'>opacity:0</div>
  <div>now you can see me</div>
  <div style='visibility:none;'>visibility</div>
  <div style='display:none;'>display:none</div>
</div>
```

  在上面类名为wrapper的div的子元素, 使用textContent和innerText的区别为 innerText无法获取display:none的文本

```js
document.querySelector('.wrapper').textContent
/*
opacity:0
now you can see me
visibility
display:none
*/

document.querySelector('.wrapper').innerText
/*
opacity:0
now you can see me
visibility
*/
```

* textContent 会返回节点中的每一个元素。相反,innerText 受 CSS 样式的影响,并且不会返回隐藏元素的文本。
  此外,由于 innerText 受 CSS 样式的影响,它会触发回流（ reflow ）去确保是最新的计算样式。

### 与innerHTML区别

  Element.innerHTML通常返回HTML。但是textContent通常具有更好的性能,因为文本不会被解析为html,此外,使用textContent可以
  防止XSS攻击。

```js
divElement.innerHTML = `<h1>我是新插入的html</h1>`; // 浏览器会解析html
divElement.textContent = `<h1>我是新插入的html</h1>`; // 直接插入标签,不会解析html
```

[MDN-textContent](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/textContent)

## Node.insertBefore()

  在参考节点之前插入一个拥有指定父节点的子节点。如果给定的子节点是对文档中现有节点对引用,inertBefore()会将其从当前位置
  移动到新位置。

  1. 如果引用节点为null,则将指定对节点添加到指定父节点的子节点列表的末尾。
  2. 如果给定的子节点是DocumentFragment,那么DocumentFragment的全部内容将被移动到指定父节点的子节点列表中.

  函数返回被插入过的子节点;当newNode是DocumentFragment时,返回空DocumentFragment.

[MDN-Node.insertBefore(newNode,referenceNode)](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore)

## childNodes

  Node.childNodes包含指定的子节点集合,该集合为即时更新的集合(live collection).

```js
const nodeList = elementNodeReference.childNodes
```

  包含文本节点,注释节点,各种元素节点(p,div)等

## firstChild/lastChild

  返回元素的第一个/最后一个字节点, 如果没有的话返回null

## parentNode/parentElement

  Node.parentNode 返回指定的节点在DOM树中的父节点。可能是一个(element节点),也可能是一个(Document)节点 或者 （DocumentFragment)节点。

  Node.parentElement 返回当前节点的父元素节点,如果该元素没有父节点,或者父节点不是一个DOM元素,则返回null.

## NodeList

  NodeList对象是节点的集合。通常是由属性, 如Node.childNodes 和 方法 document.querySelectorAll返回的。

  在一些情况下, NodeList是一个实时集合,如果文档节点发生变化,NoList也会随之变化。如Node.childNodes是实时的。
  在其他情况下, NodeList是一个静态集合。也就意味着对文档对象模型的任何改动都不会影响集合的内容。如document.querySelectorAll()

```html
<div id="node-list">
  <span class="text">1</span>
  <span class="text">2</span>
</div>

<script>
  const nodeList = document.querySelector('#node-list')
  const childNodes = nodeList.childNodes
  const text = document.querySelectorAll('#node-list .text')

  button.addEventListener('click', function() {
    const span = document.createElement('span')
    span.textContent = [...text].length + 1
    nodeList.appendChild(span)

    console.log(text.length)  // 一直都是2
    console.log(childNodes.length, childNodes)
    // 随着插入元素的增加而增加
  }, false)
</script>
```

### 遍历NodeList

  NodeList.entries() / NodeList.values() / Node.keys() / Node.forEach()

```js
// forEach
text.forEach(text => {
  console.log('each', text)
  // <span class="text">1</span>
  // <span class="text">2</span>
})

// entries
console.log(text.entries())
for(const tag of text.entries()){
  console.log(tag)
}
/*
[0, span.text]
[1, span.text]
*/


// keys
for(const key of text.keys()){
  console.log(key)  // 0 1
}

// values
for(const value of text.values()){
  console.log(value)
  // <span class="text">1</span>
  // <span class="text">2</span>
}
```

  不要尝试使用for...in 来遍历一个NodeList对象中的元素。 此时会把NodeList对象中的length和item属性遍历出来。此外,
  for...in不会保证访问这些属性的顺序。

```js
for(const key in text){
  console.log('key', key)
  /*
  0 ,1 ,entries ,keys ,values ,forEach ,length ,item
  */
}
```

  for...of 循环将会正确的遍历 NodeList对象。

```js
for(const tag of text){
  console.log('tag', tag)
// <span class="text">1</span>
// <span class="text">2</span>
}
```

### 深度遍历DOM数

```html
<div id="node-container">
  <!-- player -->
  <ul>
    <li>kyrie</li>
    <li>lebron</li>
    <li>
      <img src="" alt="">
    </li>
  </ul>
  hello world
</div>
```

```js
function visitNode(n) { // 访问节点信息
  switch(n.nodeType) {
    case n.ELEMENT_NODE:
      console.info('------- element -------', n.nodeName)
      break;
    case n.TEXT_NODE:
      if(n.textContent.trim()){
        console.info('------- text -------', n.textContent)
      }
      break;
    case n.COMMENT_NODE:
      console.info('------- comment------', n.textContent)
      break;
  }
}

// ----- 深度遍历 ----- 
function traverse(root){
  visitNode(root)
  const childNodes = root.childNodes
  if(childNodes.length > 0) {
    childNodes.forEach(n => {
      traverse(n)
    })
  }
}
/*
------- element ------- DIV
------- comment------  player 
------- element ------- UL
------- element ------- LI
------- text ------- kyrie
------- element ------- LI
------- text ------- lebron
------- element ------- LI
------- element ------- IMG
------- text -------  hello world
*/

// 上面的方法使用的是递归, 可以使用while循环改写
/*
同级dom节点, 从数组末尾取出dom元素读取信息, 如果其有子节点, 将子节点
反转 添加进数组。
*/
function traverse(root) {
  const array = [root]
  while(array.length > 0) {
    const node = array.pop()
    if(node == null) break;
    visitNode(node)
    const childNodes = node.childNodes
    if(childNodes && childNodes.length) {
      Array.from(childNodes).reverse().forEach(n => {
        array.push(n)
      })
    }
  }
}
/*
------- element ------- DIV
------- comment------  player 
------- element ------- UL
------- element ------- LI
------- text ------- kyrie
------- element ------- LI
------- text ------- lebron
------- element ------- LI
------- element ------- IMG
------- text -------  hello world
*/ 
```

### 广度遍历DOM数

```js
/*把同一层的所有DOM节点添加进数组,依次遍历,如果有子节点,然后将子节点遍历添加进数组*/
// 从头部取出父节点,如果有子节点然后将子节点依次push进数组
function traverse(root) {
  const array = [root]
  while(array.length > 0) {
    const node = array.shift()
    if(node == null) break;
    visitNode(node)
    if(node.childNodes && node.childNodes.length > 0) {
      node.childNodes.forEach(n => {
        array.push(n)
      })
    }
  }
}
/*
------- element ------- DIV
------- comment------  player 
------- element ------- UL
------- text ------- hello world
------- element ------- LI
------- element ------- LI
------- element ------- LI
------- text ------- kyrie
------- text ------- lebron
------- element ------- IMG
*/
```

```js
// Node节点继承关系
function inherit_node (node) {
  const result = []
  let proto = node
  while(proto.__proto__) {
    const name = proto.__proto__.constructor.name
    result.push(name)
    proto = proto.__proto__
  }
  return result
}

console.log(inherit_node(document.createElement('div')))
// ['HTMLDivElement', 'HTMLElement', 'Element', 'Node', 'EventTarget', 'Object']
console.log(inherit_node(document.createTextNode('hello')))
// ['Text', 'CharacterData', 'Node', 'EventTarget', 'Object']
console.log(inherit_node(document))
// ['HTMLDocument', 'Document', 'Node', 'EventTarget', 'Object']
```

## Node.contains()

  **Node.contains()** 方法返回一个布尔值, 表示一个节点是否是给定节点的后代, 即该节点本身, 直接子节点, 子节点的后代等。

```js
const ele = document.getElementById('dropdown')
const handle_click = (event) => {
  console.log(ele?.contains(event.target))
}
```

## Element.attributes

  Element.attributes 属性返回该元素所有属性节点的一个实时集合.该集合是一个NamedNodeMap对象。不是Array,没有**Array**的方法。 可以使用
  *for...of*枚举一个元素的所有属性

```html
<div class='name' id='hello' data-id='123' style='color:red;'></div>

<script>
const oDiv = document.querySelector('.name');
oDiv.attributes // 返回
/*
{
  0: class='name',
  1: id='hello',
  2: data-id='123',
  3: style='color:red;'
}
*/

for(const value of Object.values(attribute.attributes)){
  console.log('value:', value)
}
/*
value: class=​"name"
value: id=​"hello"
value: data-id=​"123"
value: style=​"color:​red;​"
*/

for(const [key,value] of Object.entries(attribute.attributes)){
  console.log(key, value)
}
/*
0 class=​"name"
1 id=​"hello"
2 data-id=​"123"
3 style=​"color:​red;​"
*/
</script>
```

:::tip
遍历attributes对象,每个attribute也是一个对象, 可以通过attribute.name 和 attribute.value 属性获取属性名和值.
:::

## Element.getAttribute()

  **getAttribute()** 返回元素上一个指定的属性值, 如果指定的属性不存在, 则返回 null 或 空字符串。

```js
const ele = document.getElementById('box')
ele?.getAttribute('disabled')
```

### Element.removeAttribute()

  **Element.removeAttribute()** 方法移除当前元素上具有指定名称的属性。如果指定的属性不存在, 则 **removeAttribute()**
  直接返回而不会产生错误。

```js
const ele = document.getElementById('box')
ele?.removeAttribute('disabled')
```

## Element.setAttribute()

  **Element.setAttribute()** 用于设置指定元素上的某个属性值。如果属性已经存在, 则更新该值。否则添加一个新的属性值。

```js
const ele = document.getElementById('box')
ele?.setAttribute('disabled', true)
```

  (任何指定的非字符串的值都会自动转换为字符串)。

## Element.children

  Element.children 是一个只读属性,返回一个Node的子*elements*, 是一个动态更新的 HTMLCollection。

```js
const children = nodeReference.children
for (let i = 0; i < children.length; i++) {
  console.log(children[i])
  // 对nodeReference进行操作和更新,都会立即更新children的值
}
```

## Element.classList

  Element.classList是一个只读属性,返回一个元素**class**属性的动态 DOMTokenList**集合。相比将 *element.className*作为空格分隔
  的字符串来使用, *classList*是一种更方便的访问元素的类别。

1. add()
2. remove()
3. replace()
4. toggle()

```js
element.classList.add('hello')
element.classList.add('world')
console.log(element.classList)
// DOMTokenList(2) ['hello', 'world', value: 'hello world']

element.classList.toggle('text')  //因为之前没有text类名
// ['hello', 'world', 'text', value: 'hello world text']

element.classList.toggle('text')
// DOMTokenList(2) ['hello', 'world', value: 'hello world']

element.classList.replace('foo', 'bar') // 将类名foo 替换为 bar

element.className // 'hello world'
```

[MDN-Element.classList](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMTokenList/replace)

## Element.className

  获取/设置元素的class类名 (多个类名以空格分隔)

```js
const ele = document.getElementById('container')
ele.className   // 'container header'
```

## Element.lastElementChild

  只读属性 **Element.lastElementChild** 返回元素的 最后一个字元素, 没有的话返回 **null**
  (仅包含元素节点, 如果要获取包含文本.注释等非元素节点, 使用 Node.lastChild)

## Element.hasAttribute()

  hasAttribute 返回一个布尔值，指示该元素是否包含有指定的属性（attribute）。

## Element.clientWidth / Element.clientHeight

  内联元素以及没有CSS样式的元素的clientWidth属性值为0. Element.clientWidth属性表示元素的内部宽度。该属性包括
  内边距padding,但不包括边框border,外边距margin和垂直滚动条.
:::tip
该属性值会被四舍五入为一个整数。如果你需要一个小数值，可使用 element.getBoundingClientRect()。
:::
  Element.clientWidth是一个只读属性。

  如果包含滚动条, clientHeight可以通过CSS height + CSS padding - 水平滚动条的高度来计算。

## Element.clientLeft / Element.clientTop

  Element.clientTop: 一个元素顶部边框的宽度。不包括顶部外边距或内边距。*clientTop*是只读的。
  Element.clientLeft: 表示一个元素的左边框的宽度, *clientLeft* 不包括左外边距和左内边距。该属性是只读的

:::danger
如果只设置了边框宽度,没有设置边框样式,则返回0

```css
.box {
  border-top-width: 10px;
  border-left-width: 20px;
}
```

```js
box.clientLeft  // 0
box.clientTop   // 0
```

:::

## Element.offsetParent

该属性是一个只读属性,返回一个指向最近的(closest,指包含层级上的最近)包含该元素的定位元素。如果没有定位的元素,则
offsetParent为最近的table table cell 或根元素。当元素的display设置为none,offsetParent返回Null。
  
:::tip

1. 在webkit中,如果元素为隐藏的 或者该元素的style.position被设置为fixed,则该属性返回null
2. 在IE9中,如果该元素的style.position被设置为fixed,则该属性返回Null,(display:none)无影响。

:::

## Element.offsetWidth

  HTMLElement.offsetWidth是一个只读属性,返回一个元素的布局宽度。 offsetWidth是测量包含元素的边框(border)
  水平线上的内边距(padding) 垂直方向滚动条(scrollbar)(如果存在的话),以及CSS设置的宽度(width)的值。

:::tip
这个属性将会四舍五入为一个整数, 如果想要获取一个小数值, 可以使用element.getBoundingClientRect()。
:::

[MDN-Element.offsetHeight](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/offsetWidth)

## Element.scrollHeight

  Element.scrollHeight 是一个只读属性, 返回一个元素内容高度的度量。包含由于溢出导致的视图中不可见的内容。
  (包含元素的padding,但不包含元素的border和margin)。
  同样, 该属性也会对值进行取整。

:::tip
该属性值会被四舍五入为一个整数。如果你需要一个小数值，可使用 element.getBoundingClientRect()。
:::
[MDN-Element.scrollHeight](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/scrollHeight)

```css
.box{
  width:100px;
  height:100px;
  padding:10px;
  margin:5px;
  border:5px;
  box-sizing:border-box;
  overflow:auto;
}
.inner{
  background-color:#98c379;
  width:400px;
  height:400px;
}
```

上面是一个div, 里面包含一个更大的div, 可以分别点击 不同按钮 获取它的尺寸数据。

### 判断元素是否滚动到底

  scrollTop是一个非整数, 而scrollHeight 和 clientHeight 是四舍五入的, 因此确认滚动区域是否滚动到底的
  唯一方法是查看滚动量是否接近某个阀值。
:::tip
  在使用显示比例缩放的系统上, scrollTop可能会提供一个小数。
:::

## Element.scrollWidth

  **Element.scrollWidth** 只读属性是元素内容宽度的一种度量, 包括由于溢出而在屏幕上不可见的内容。

:::tip
该属性会将值取成整数。
:::

## Element.animate()

  创建一个新的 Animation 的便捷方法, 将它应用于元素。然后运行动画。

```js
ele?.animate({
  transform: 'rotate(0) scale(1)'
}, {
  transform: 'rotate(360deg) scale(0)'
}, {
  duration: 2 * 1000,
  iterations: 1
})
```

## Document

* 显式地创建一个元素

```js
const div = document.createElement('div')
const comment = document.createComment('注释')
const text = document.createTextNode('文本')
const fragment = document.createDocumentFragment()
```

* 挂载元素

```js
// 1 append 最后一个子元素之后插入节点
const body = document.querySelector('body')
body.append(document.createTextNode('hello world')) // body的子元素

// 2. before 在节点之前插入元素
const element = document.createElement('div')
document.body.appendChild(element)
element.before(document.createTextNode('你好,世界'))  // text和element同级,text在element前

// 3. prepend 在第一个节点之前插入元素
element.prepend(document.createTextNode('我是前面的元素'))

// 4. after 在节点之后插入元素
element.after(document.createTextNode('hello')) // 和element同级, text在element后

// 5. element.insertAdjacentHTML(position, string)
const insert = document.createElement('div')
document.body.appendChild(insert)

insert.insertAdjacentHTML('afterbegin', '<p>after-begin</p>')
insert.insertAdjacentHTML('afterend', '<p>after-end</p>')
insert.insertAdjacentHTML('beforebegin', '<p>before-begin</p>')
insert.insertAdjacentHTML('beforeend', '<p>before-end</p>')
/*
<p>before-begin</p>
<div>
  <p>after-begin</p>
  <p>before-end</p>
</div>
<p>after-end</p>
*/

// 5. element.insertAdjacentText(position, text)
insert.insertAdjacentText('afterbegin', 'HELLO')
insert.insertAdjacentText('beforeend', 'WORLD')

// 6. element.insertAdjacentElement(position, element)
message.insertAdjacentElement('beforeend', document.createElement('div'))
message.insertAdjacentElement('beforebegin', document.createTextNode('hello')) // 报错,不是一个element
```

* 删除元素

```js
// 把对象从所属的DOM树中删除
const message = document.createElement('div')
message.textContent = 'hello world, 你好世界';
document.body.appendChild(message)
message.remove()
```

* outerHTML

  element DOM接口的outerHTML属性获取描述元素的序列化HTML片段。也可以设置为指定字符串解析的节点替换元素。

```js
const content = document.body.outerHTML
element.outerHTML = "<p>This paragraph replaced the original div.</p>";
/*
element不再是文档树的一部分,新段替换了它(不在页面中显示, 但是仍然在内存中)
*/
```

## MutationObserver

  MutationObserver接口提供了监视对DOM树所做更改的能力。该功能是DOM3 Events规范的一部分。

```js
// 一个DEMO
const targetNode = document.querySelector('.mutation-container')
const observer_button = document.querySelector('.mutation-observer-button')

const observer = new MutationObserver(function(mutationList, observer) {
  // observer是一个微任务
  setTimeout(() => {
    console.log('我执行了')
  }, 0)
  for(const mutation of mutationList) {
    console.log('mutation:', mutation)
  }
})
observer.observe(targetNode, {
  attributes: true, // 属性变化
  childList: true,  // 子节点变化
  subtree: true     // 后代节点变化
})

observer_button.addEventListener('click', () => {
  targetNode.style.color = 'red'
  targetNode.setAttribute('data-id', Math.random().toString().substring(0, 6))
  /*
  {
    attributeName: 'style',
    type: 'attributes',
    oldValue: ''
  }
  */ 
  const element = document.createElement('img')
  targetNode.appendChild(element) /*
    {
      attributeName: null,
      type: 'childList'
    }
  */
}, false)
```

  MutationObserver的disconnect()方法停止观察对象,可以通过调用observe()方法重用观察者。

```js
observer.disconnect();
```
