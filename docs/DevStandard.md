# Development Standard · 开发规范

## 开发文档
对于核心模块或架构设计需要在 **/doc/develop** 目录下编写开发文档来描述设计思想与实现原理。

--------------------------------------------------
## 技术引入
当需要在项目中引入新技术(工具或规范等)时，如果对现有项目开发会产生比较大的影响，需要在 **/doc/technology/** 目录下编写 **技术方案评估文档** 来描述以下信息。
1. 问题场景: 简述问题的背景，描述新技术的引入原因。
2. 需求分析: 描述具体的需求，新技术的引入需要解决什么问题。
3. 技术简介: 对新技术进行简述。
4. 方案评估: 交叉对比备选技术方案，评估最适合项目的技术。
5. 可行性评估: 评估新技术的引入的可行性和对现有项目的开发产生的影响。
6. 实施方案: 具体的实施方案。
7. 参考: 方案评估过程中的参考资源。

Meta(文件元信息):
* Date: 日期
* Author: 提案人
* Desc: 概述

--------------------------------------------------
## 分支管理

### 分支管理策略
在参考 ***GitFlow*** 工作流后，Vision 项目中采用以下分支管理策略。
* ***master*** : 主干分支，受保护分支，正式发布版本的分支，不允许直接提交代码。
* ***dev*** : 开发分支，用于集成新特性，从 *master* 分支构建。
* ***doc*** : 用于生成项目文档的分支，从 *master* 分支构建。
* ***feature/xxx*** : 功能/特性开发分支，从 *dev* 分支构建，*xxx* 为新特性的简要标识。
* ***fix/xxx*** : bug修复分支，从 *dev* 分支构建，*xxx* 为待修复的BUG的简要标识。

[GitFlow工作流简介](https://www.git-tower.com/learn/git/ebook/cn/command-line/advanced-topics/git-flow)

### Commit 信息规范
commit 信息规范参考 *Angular* 提出的标准，主要格式如下:
```
<type>(<scope>): <subject> 
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

其中 ***type*** 字段描述了 commit 的类型，主要有以下选项:
* feat : 新功能/新特性
* fix : bug修复
* docs : 文档变动
* test : 测试更新
* build : 构建系统变更
* pref : 代码性能优化
* style : 代码风格变化
* refactor : 重构  

***scope*** 字段是一个可选项，描述了本次提交涉及到的变更范围。  
***subject*** 字段用于对 commit 的简单描述。  
***body*** 字段用于对 commit 的详细描述。  
***footer*** 页脚字段可以包含有关重大更改，弃用信息，和引用 issues 和 PR 的地方。

一个简单的示例如下 :

```
feat(vector.Vector): 新增静态构建方法

- 新增 Vector.ones 静态构建方法
- 新增 Vector.zeros 静态构建方法
- 新增 Vector.random 静态构建方法

```

详细参考: [Angular-commit规范](https://github.com/angular/angular/blob/main/CONTRIBUTING.md#commit)

--------------------------------------------------
## 注释规范
Vision项目采用 ***jsdoc*** 的注释风格。开发过程中需要在以下位置添加整体描述性注释，以便后续API文档的自动化构建:
* Module(模块)
```js
/**
 * @module
 * @desc     模块描述
 * @project  Vision
 * @author   开发者
 * @date     创建时间(xxxx-xx-xx)
 * @version  版本(0.1.0)
 * @since    (更新时间, 开发者): 更新信息
*/
```
* Class(类)
```js
/** Test */
class Test {

    /**
     * @classdesc 描述信息
     * 
     * @property { number } id - 标识id
     * @property { string } data - 数据
     * 
     * @param { number } id - 标识id
     * @param { string } [data="test"] - 数据
     * 
     * @example
     * let t = new Test(1, "aaa");
     */
    constructor(id, data="test") {
        this.id = id;
        this.data = data;
    }
}
```
* Method(方法)/Function(函数)
```js
/**
 * 方法功能描述
 * 
 * @param { number } a - 参数a
 * @param { number } b - 参数b
 * @returns { number } 返回值
 */
add(a, b) {
    return a+b;
}
```
详细的注释方法参见:   
* [jsdoc官方文档](https://jsdoc.app/)
* [jsdoc中文文档](https://www.jsdoc.com.cn/)

--------------------------------------------------
## 版本管理
对于Vision项目的版本命名采用以下规范

**主版本号.次版本号.修订版本号**

* 主版本号 : 项目结构出现大规模变更，API兼容性发生变化时，需要更新主版本号。 
* 次版本号 : 新增特性或功能积累到一定数量，需要更新次版本号。
* 修订版本号 ：重要Bug修复后需要更新修订版本号。

--------------------------------------------------
## 代码片段 
> Code snippets are templates that make it easier to enter repeating code patterns, such as loops or conditional-statements.  

为了提高开发效率，Vision项目封装了一些常用 **代码片段** 来快速生成代码模板。
具体详见 : [Vision.code-snippets](./develop/Vision.code-snippets)  
可以考虑将其引入编辑器来简化重复代码的生成，代码片段的具体格式参考 [Snippets in Visual Studio Code](https://code.visualstudio.com/docs/editor/userdefinedsnippets)

--------------------------------------------------
## 单元测试