# Vision 项目结构索引

* ### ***/build*** : 项目构建工具目录
    * [build](../../build/build.js) : 项目构建工具脚本
    * builder.config.js : 构建器配置文件
    * rollup.config.js : rollup配置文件
    * webpack.config.js : webpack配置文件
* ### ***/docs*** : 项目文档目录
    * ### */blogs* : 博客文档
    * ### */develop* : 开发文档
        * [Vision.code-snippets](./develop/Vision.code-snippets) : 代码片段(vscode) 
    * ### */framework* : 架构设计文档
    * ### */technology* : 技术方案评估文档
    * ### */tutorials* : 简介教程
    * [DevIndex]() : 项目结构索引
    * [DevDevStandard](./DevStandard.md) : 项目开发规范
* ### ***/src***: 源码目录
    * ### */algo*: 算法模块
        * [Boids.js](../src/algo/Boids.js) : 鸟群算法
        * [L-System.js](../src/algo/LSystem.js): L-系统
        * [Mandelbrot_Set](../src/algo/Mandelbrot_Set.js): 曼德勃罗特集
        * [NNS](../src/algo/NNS.js): 邻近搜索算法模块
        * [OSS](../src/algo/OSS.js): 最优解求解器(PSO的一种简化实现)
    * ### */context* : 绘图上下文容器
        * [canvas](../src/context/canvas.js) : Canvas绘制API封装
    * ### */particle* : 粒子模块(核心模块)
        * [particle](../src/particle/particle.js) : 粒子类
        * [particle_system](../src/particle/particle_system.js) : 粒子系统
        * [field](../src/particle/field.js) : 矢量场
        * [area](../src/particle/area.js) : 区域类
        * [border](../src/particle/border.js) : 边界类
        * [coor](../src/particle/coor.js) : 坐标系
        * [tracker](../src/particle/tracker.js) : 轨迹追踪器
    * ### */utils* : 工具模块
        * [iterator](../src/utils/iterator.js) : 迭代器
        * [random](../src/utils/random.js) : 随机选择器
        * [tools](../src/utils/tools.js) : 常用工具代码封装
    * ### ***/vector*** : 向量模块(核心模块)
        * [vector](../src/vector/vector.js) : 向量类(核心模块)
    * ### */views* : 视觉效果模块(高层次绘制API)
        * [capturer](../src/views/capturer.js) : 截图器
        * [color](../src/views/color.js) : 颜色容器
        * [randerer](../src/views/randerer.js) : 渲染器
        * [views](../src/views/views.js) : 绘制模式封装
* ### ***/test*** : 测试代码目录
* ### ***/tools*** : 辅助开发/设计工具目录
* ### ***/vtp*** : Views模板构建工具
    * [tpBuilder.js](../../vtp/tpBuilder.js): 模板构建器
    * tpBuilder.confs.js: 模板构建器配置文件
    * base.html: 基础模板容器
* ### ***/views*** : 项目应用目录
    * ### */Algorithm* : 算法研究
        * [LSystem - plants](../../views/Algorithm/LSystem/plants.html) : 基于L系统生成植物
        * [Mandelbrot_Set](../../views/Algorithm/Mandelbrot_Set/Mandelbrot_Set.html): 曼德勃罗特集的可视化
        * [OSS](../../views/Algorithm/OSS/optimum_solution_solver.html) : 一种简单的最优化参数求解器
    * ### */Projects* : 视觉效果
        * [GlassBall](../../views/Projects/GlassBall/GlassBall.html) : 玻璃球
        * [Helix](../../views/Projects/Helix/Helix.html) : 螺旋环
        * [NodeLink](../../views/Projects/NodeLink/NodeLink.html) : 游走节点网
        * [Ring - LightRing](../../views/Projects/Ring/LightRing.html) : 光环
        * [The Life of Tree](../../views/Projects/The%20Life%20of%20Tree/The%20Life%20of%20Tree.html) : 树的生命周期
        * [VectorRings](../../views/Projects/VectorRings/VectorRings.html) : 向量环
    * ### */Research* : 研究与想法验证
        * [/Fields](../../views/Research/Fields/) : 矢量场
        * [/FxAnalysis](../../views/Research/FxAnalysis/) : 函数
        * [/LinearAlgebra](../../views/Research/LinearAlgebra/) : 线性代数
        * [/ParticleSystem](../../views/Research/ParticleSystem/) : 粒子系统

