# JavaScript模块标准选型

Meta:
* Date : 2023-04-26
* Author : Ais
* Desc : JavaScript模块标准选型评估方案

--------------------------------------------------
## 问题场景
Vision项目是基于JavaScript构建的绘制框架，在实现过程中采用模块化的方案，因此需要在项目中引入模块标准。但是由于JavaScript的历史原因，没有一个统一的标准，而是发展出多种模块标准，比如 Nodejs 的 ***CommonJS(CJS)*** 标准，异步加载的 ***Asynchronous Module Definition(AMD)*** 标准，***ES6 Module(ESM)*** 等。这些模块标准的环境与实现都有一定的差异，因此需要针对现有项目选择一种合适的模块标准。

--------------------------------------------------
## 需求分析
Vision项目对模块标准最核心的需求是模块代码可以在Nodejs与浏览器环境中兼容运行。这是基于Vision的核心设计思想 ——— **计算逻辑与绘制逻辑分离**。由于绘制模块的实现需要CanvasAPI，因此需要在浏览器环境兼容该模块标准，同时基于计算逻辑的抽象设计，其可以在Nodejs与浏览器环境同时运行，因此在考虑模块标准的选择时，需要保证两种环境的兼容性。

--------------------------------------------------
## 技术简介
JavaScript模块标准的发展历史

### 1. **文件引入**
JavaScript模块标准的多样性来源与其发展历史，在发展的早期阶段，前端业务中的js需求比较简单。因此其通常是通过 **文件引入** 的方式进行代码的引入，但是这种方式通常会导致不同文件的函数变量的命名冲突和全局作用域污染。
```html
<script src="./moduleA.js"></script>
<script src="./moduleB.js"></script>
```

### 2. **命名空间**
为了解决这个问题，引入了 **命名空间** 的概念，通过将模块的函数和变量绑定到一个对象上来解决命名冲突和全局作用域污染。
```js
var namespace = {}
namespace.add = function(a, b){ 
    return a + b 
}
namespace.add(1, 2)
```
但是这种方案的另一个缺点是，外部代码依然可以修改模块的内部属性。

### 3. **IIFE**
为了对模块内部成员进行访问控制，引入了IIFE(立即执行函数)的概念。
```js
var moduleA = (function() {
    var moduleA = {};
    //模块内部属性
    var prefix = "moduleA";
    moduleA.print = function(msg) {
        console.log(`${prefix}: ${msg}`)
    }
    return moduleA;
})()

moduleA.print("test1")   // > moduleA: test1

moduleA.prefix = "moduleB"
moduleA.print("test2")   // > moduleA: test2
```
上述"模块化方案"依然有很多未解决的问题:
1. 依然存在全局作用域污染
2. 模块的导入顺序依赖

### 4. **CommonJS(CJS)**
*Commonjs* 是 *Nodejs* 采用的模块标准，其通过 ***require*** 和 ***exports*** 来进行依赖模块的加载与模块对外接口的暴露。
```js
//moduleA.js
var prefix = "moduleA";
var print = function(msg) {
    console.log(`${prefix}: ${msg}`)
}
module.exports.print = print;

//test.js
const moduleA = require("./moduleA");
moduleA.print("test")   // > moduleA: test
```
在 *CommonJS* 模块标准中，每个文件是一个模块，有其自己的作用域，模块内部成员是私有的，解决了全局作用域的污染问题。同时依赖模块的加载采用同步的方式进行。

### 5. **AMD，CMD，UMD**
*CommonJS* 主要用于服务器端的 Nodejs，依赖模块采用同步加载机制。而对于浏览器环境，则需要有模块异步加载的机制。*AMD* 采用了异步加载的方式进行依赖模块的加载。模块的加载不影响后续代码的执行，所有依赖该模块的语句，定义在一个回调函数中，依赖模块加载完毕之后，回调函数才会执行。
```js
//模块定义
define(id?, dependencies?, factory)
//模块加载
require([module], callback)
```

### 6. ES6 Module(ESM)
随着ES6的发布，JavaScript在语言标准层面引入了模块标准，*ESM* 通过 ***import*** 和 ***export*** 来进行模块的导入导出。
```js
//moduleA.mjs
let prefix = "moduleA";
let print = function(msg) {
    console.log(`${prefix}: ${msg}`);
}
export { print };

//test.mjs
import { print } from "./moduleA.mjs";
print("test");   // > moduleA: test
```
相较于CJS，ESM采用静态加载的模式，因此可以在编译阶段确定模块的依赖关系。

--------------------------------------------------
## 方案评估
通过对 *ESM, CJS, AMD* 模块标准的综合评估，结合上述 *需求分析* 里的核心需求，决定在项目中采用 ***ESM*** 模块标准的方案，主要理由如下:
1. CJS, AMD 两种方案无法保证浏览器环境与Nodejs环境的兼容性，而在Nodejs中已支持 ESM 模块标准。
2. ESM 是语言标准层面的模块标准，不需要引入额外依赖。
3. ESM 是官方制定的标准，可发展性和稳定性较强。
4. 相较于 CJS，ESM 支持按需导入，不用导入完整模块。

--------------------------------------------------
## 可行性评估
项目目前采用 **CJS** 模块标准，迁移到 **ESM** 会对项目产生以下影响: 
1. 源码目录(/src)中的模块的导入导出需要从 **CJS** 迁移到 **ESM**。
2. 单元测试样例(/test)需要迁移到 **ESM** 导入方式 
3. 项目构建与打包工具需要迁移到 **ESM** 模式

--------------------------------------------------
## 实施方案
1. */src* 源码目录模块的导入导出迁移到 **ESM** 语法。
2. */views* 应用目录导入代码迁移。
3. */test* 单元测试样例导入代码迁移。
4. */build* 项目构建与打包工具迁移到 *ESM* 模式。

--------------------------------------------------
## 参考
* JavaScript 模块化发展历程: https://segmentfault.com/a/1190000023839483
* 如何在NodeJs中使用ESM模块化规范: https://juejin.cn/post/7021877596287664159

