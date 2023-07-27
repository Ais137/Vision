# Vision

## Overview · 概述
***Vision*** 是一个基于 JavaScript 的图像绘制框架。现阶段主要用于个人进行 **想法验证** 与 **技术栈扩展**，最终目的是构建一个用于 **研究抽象模型(算法)** 与 **可视化** 的计算与渲染框架。

--------------------------------------------------
![Helix](./img/disp/Helix.png)

--------------------------------------------------
## Spark · 火花
> Vison: 视野; 想象; 幻象; 梦幻

正如单词的含义，构建这个项目的目的在于通过代码来进行 **想法的可视化**。最早接触相关的是 *Processing*, 一种基于Java的用于实现电子艺术设计的编程框架。我之所以对此感兴趣是由于，相对于通常的程序设计不同。基于该框架的程序的输出并不是字符，而是*图像*，虽然从本质上都是 *数据*，但相对于字符却可以带给人更加的直观的感受。同时我惊叹于其他人创作的作品。这些作品大多并非出于某种实用性的目的构建，更多的像是用来展示作者的创意或者用于某种思想的表述。

正是出于这种非实用性的目的，带来了*探索的乐趣*，当我构建好一个项目后，常常喜欢通过改变系统中的参数，来观察这一变更会为整个系统带来什么不一样的变化。通过改变对象的参数，是否会产生新的运动模式？将不同的对象之间关联起来构成的整体又会呈现出什么新的模式吗？这样的尝试过程中往往会带来很多预想之外的惊喜，这种探索过程正是我构建此项目的主要原因。

另一个原因是在于进行想法的可视化，有时候在产生一些想法的时候，想要获取这些想法的直观的图像表述，但限于复杂性，用纸和笔来绘制可能达不到预期效果，因此想到通过代码来绘制或者模拟来实现想法的可视化。

总之，我对这个项目的期望是：

> *Vision* 框架是一座桥梁，用于连接想法创意与现实。一种将想法与创意进行可视化的绘制框架。

--------------------------------------------------
## Architecture · 架构
### 基于 **VisionProtocol** 的抽象层设计
在 Vision 项目的早期阶段，渲染模块是基于 CanvasAPI 开发的，这导致了 *渲染模块*([views](./views/)) 与 *渲染上下文对象* 之间的强耦合。需要依赖于浏览器环境的 *Canvas上下文对象* 实现渲染功能。  

为了解决上述问题，通过在 *渲染模块* 与 *渲染上下文对象* 之间引入一个抽象层来进行解耦，整体架构如下:

![VisionProtocol_architecture](./img/tech/VisionProtocol_architecture.png)

通过 **VisionProtocol** 抽象层的架构，*渲染模块* 不再直接调用具体的 *渲染上下文对象*，而是面向 **VisionProtocol** 中的抽象接口进行构建，这种架构解除了渲染模块与渲染上下文对象的耦合，同时消除了渲染模块与运行环境之间的依赖。使其具有更高的抽象性和独立性。

同时在 **VisionProtocol** 的基础上，实现了 **运行环境兼容性架构** 和 **跨语言渲染架构**。

具体设计与实现详见 [VisionProtocol抽象层设计](./arch/VisionProtocol/VisionProtocol.md)

--------------------------------------------------
## Feature · 特性
* ***计算逻辑与渲染逻辑分离的设计***
* ***运行环境兼容性架构*** : 渲染模块可以在多种环境下兼容运行(浏览器与Nodejs)，无需针对不同的环境进行单独适配与开发。
* ***跨语言渲染架构*** : 基于 gRPC 实现的跨语言渲染架构，通过分离渲染层，使渲染模块可以通过异构语言实现的渲染器进行渲染，同时让渲染模块具有无界面离屏渲染的能力。

--------------------------------------------------
## Docs · 核心文档 
* [DevStandard · 开发规范](./docs/DevStandard.md)
* [Spark · 想法与灵感记录](./Spark.md)

--------------------------------------------------
## Blogs · 博客
* [Mandelbrot_Set_Visualization · 曼德勃罗特集的可视化](./docs/blogs/Mandelbrot_Set_Visualization.md)

--------------------------------------------------
## Update · 更新摘要
* [NNS(Nearest Neighbor Search)](./src/algo/NNS.js) : 邻近搜索算法，在数据(向量)集中搜索给定目标的邻近集。
* [ParticleSystem](./src/particle/particle.js) : 粒子系统结构优化，新增Hook机制。
* [Boids](./src/algo/Boids.js) : 集群行为模拟 —— *Boids* 基础模型实现 [(演示)](./views/Research/Boids/boids.html)

--------------------------------------------------
## DevPlan · 开发计划

### 架构层
- [x] 核心架构 : 基于 VisionProtocol 抽象层设计
- [x] 文档自动构建 : 基于源码注释自动生成文档
- [ ] 渲染模块标准化规范
- [ ] 运行环境切换组件
- [ ] 渲染服务化架构设计
- [ ] **Vector** 模块性能优化 : 基于 *WebAssembly* 重构

### 代码层
- [x] particle 模块结构优化
- [x] ParticleAssembler 粒子运动组合器设计 
- [x] 二维平面的周期性运动
- [ ] ParticleSystem 框架钩子系统完善
- [ ] PSO(粒子群优化)算法实现
- [ ] 细胞自动机
- [ ] 贝塞尔曲线
- [ ] 连杆系统

--------------------------------------------------
## Index · 项目目录结构索引(概览)
* */arch* : 架构设计
* */build* : 项目构建工具目录
* */docs* : 项目文档目录
* */src* : 源码目录
* */test* : 测试代码目录
* */tools* : 辅助开发/设计工具目录
* */views* : 项目应用目录
* */vtp* : Views模板构建工具目录

**详细目录结构索引** : [DevIndex](./docs/DevIndex.md) 

--------------------------------------------------
## Build · 项目构建
* 构建项目 
```sh
npm run build
```

* 运行测试(基于jest)
```sh
npm run test
```

* 文档构建(基于jsdoc)
```sh
npm run doc
```

* Views模板构建器
```sh
# 查看当前模板
npm run vtp -- -list
# 生成模板
npm run vtp -- 文件名 模板名  
# exp: npm run vtp -- test pcs
```

--------------------------------------------------
## Application · 应用
### [*Mandelbrot_Set*](./views/Algorithm/Mandelbrot_Set/Mandelbrot_Set.html)
![Mandelbrot_Set](./img/disp/Mandelbrot_Set.png)
### [*LightRing*](./views/Projects/Ring/LightRing.html)
![LightRing](./img/disp/LightRing.png)
### [*L-System*](./views/Algorithm/LSystem/plants.html)
![L-System](./img/disp/plants.png)
### [*Helix*](./views/Projects/Helix/Helix.html)
![Helix](./img/disp/Helix_2.png)
### [*Boids*](./views/Research/Boids/boids_M0S1.html)
![Boids](./img/disp/boids_M0S1.png)
### [*TransfGravityParticle*](./views/Research/ParticleSystem/TransfGravityParticle.html)
![TransfGravityParticle](./img/disp/TransfGravityParticle.png)
### [*The Life of Tree*](./views/Projects/The%20Life%20of%20Tree/The%20Life%20of%20Tree.html)
![The Life of Tree](./img/disp/TheLifeofTree.png)