# Mandelbrot_Set_Visualization · 曼德勃罗特集的可视化
![MBS](../../img/disp/Mandelbrot_Set.png)

## [Code](../../views/Algorithm/Mandelbrot_Set/Mandelbrot_Set.html)

------------------------------------------------------------
## Index
1. 曼德勃罗特集合概念简述
2. 代码实现思路
3. 坐标系变换
4. 绘制集合
5. 并行计算: 使用WebWorker渲染高分辨率图像

------------------------------------------------------------
## 曼德勃罗特集合 概念简述
> 曼德博集合（英语：Mandelbrot set，或译为曼德布洛特复数集合）是一种在复平面上组成分形的点的集合，以数学家本华·曼德博的名字命名。曼德博集合与朱利亚集合有些相似的地方，例如使用相同的复二次多项式来进行迭代。

其迭代表达式如下

 *Z(n+1) = Z(n) ^ 2 + C*

其中 *Z* 和 *C* 为复数。通过上述表达式进行迭代
* Z(0) = (0, 0)
* Z(1) = Z(0) ^ 2 + C
* ...
* Z(n+1) = Z(n) ^ 2 + C

构成一个序列 [|Z(0)|, |Z(1)|, |Z(2)|, ..., |Z(n)|], (|Z|为复数的模长)， 

对于不同的参数 *C*，这个序列可能发散也可能收敛到有限范围。

曼德勃罗特集 *M* 是使序列不发散到无限大的所有复数 *C* 的集合。

**PS: 下述用 MBS 来代指曼德勃罗特集**

------------------------------------------------------------
## 代码实现思路
基本思路如下: 
1. 给定一个复数 *C*, 通过 *Z(n+1) = Z(n) ^ 2 + C* 进行迭代，判断该复数C是否在集合中。
2. 扫描定义域内的复数，判断是否在集合中。
3. 根据结果集进行绘制。

需要注意的是，在判断 *C* 是否在 *MBS* 中时，序列的迭代过程是有限的，因此通过引入一个变量 *n* 来控制迭代次数。 

迭代过程的代码实现如下:
```
const Mandelbrot_Set = function(C, n=500) {
    let z = new Complex(0, 0);
    //迭代过程
    for(let i=0; i<=n; i++) {
        //Z(n+1) = Z(n) ^ 2 + C
        z = z.mult(z).add(C);
        //判断是否在集合内: |Z(n)| <= 2
        if(z.norm() > 2) {
            return [false, i];
        }
    }
    return [true, n]
}
```

------------------------------------------------------------
## 坐标系变换
在实现迭代过程后，下一步是通过扫描复数 *C* 的定义域，并将其映射到屏幕坐标，这个过程中就涉及到两个坐标系之间的变换。

在使用canvas进行绘图时，Canvas屏幕像素坐标系(PCS)如下:
```
  o(0, 0) ----------> (+x)  dx=1(pixel)
  |
  | 
  |
  V
 (+y)                 
```
其中坐标原点 o(0, 0) 位于屏幕左上角，x轴正方向水平向右，y轴正方向垂直向下，坐标系刻度为1个像素单元。

而在计算 MBS 时，复数 *C* 的定义域则是在复数坐标系中。因此需要在渲染时，需要将屏幕坐标系中的坐标变换到计算用的复数坐标系。

```
 (+y)
 ^
 | 
 |        
 |         
 o(0, 0) ----------> (+x)  dx=实数域
```

核心变换逻辑如下:
```
//坐标系
class RCS extends CoordinateSystem {
    ...
    
    to(vector) {
        let x = (vector.x - this._co.x) * this._scale;
        let y = (-1)*(vector.y - this._co.y) * this._scale;
        return Vector.v(x, y);
    }
    
    ...

```
其中 **this._co** 表示在屏幕坐标系的原点坐标，**this._scale** 则为坐标系刻度(1个像素对于的坐标增量)

完整的代码详见 [particle.coor.RCS](../../src/particle/coor.js)

------------------------------------------------------------
## 绘制集合
核心绘制代码如下:

```
const MBS_renderer = function() {
    //构建图像容器
    let img = new ImageData(confs.width, confs.height);
    //构建曼德勃罗特集
    let C0 = new MBS.Complex(...confs.C0);
    for(let y=0; y<confs.height; y++) {
        for(let x=0; x<confs.width; x++) {
            //计算
            let res = MBS.Mandelbrot_Set(new MBS.Complex(...rcs.to([x, y])).add(C0), confs.n);
            //绘制
            let c = color(confs, res);
            let i = (y * confs.width + x) * 4;
            img.data[i] = c[0], img.data[i+1] = c[1], img.data[i+2] = c[2], img.data[i+3] = 255; 
        }
    }
    canvas.ctx.putImageData(img, confs.offset_x, confs.offset_y);
}
```

通过嵌套的 for 循环扫描整个屏幕的像素坐标，并通过坐标系映射到计算坐标，经过迭代后进行颜色的填充。

对于图像颜色的填充，最简单的方案是采用"二值化"的方式进行填充，即集合内的点填充 [0, 0, 0], 集合外的点填充 [255, 255, 255],

但为了使视觉效果更好，可以采用另一种填充方案。比如，集合内的点填充一个固定值 [0, 0, 0], 而对于集合外的点，根据其发散程度来填充。
```
const color = function(confs, res) {
    if(res.flag) {
        //集合内的点: [0, 0, 0]
        return confs.color_in;
    } else {
        //集合外的点
        let r = res.i / confs.n;
        return [confs.color_out[0]*r, confs.color_out[1]*r, confs.color_out[2]*r];
    }
}
```
其中 res.i 为迭代过程中 |Z(n)| >= 2 (发散)时的迭代次数。


------------------------------------------------------------
## 并行计算: 使用 *WebWorker* 渲染高分辨率图像
在进行 "MBS" 的计算和渲染时，当绘制的尺寸越大，其渲染时间越长。因此在渲染高分辨率图像时，会导致很大的延迟，
因此考虑通过 *WebWorker* 进行并行计算和渲染。

核心思路是通过将目标渲染区域切分成子区域，并通过分配到 *WebWorker* 集群中实现并行计算，然后在主进程进行绘制。 

基本代码框架如下:

主进程
```
//构建工作线程
let workers = [];
for(let i=0; i<confs.N; i++) {
    workers[i] = new Worker(window.URL.createObjectURL(blob));
    workers[i].onmessage = function(event) {
        canvas.ctx.putImageData(event.data.img, event.data.p[0], event.data.p[1]);
    }
}
//构建渲染任务
const MBS_renderer = function(workers, confs) {
    let dy = parseInt(confs.height / workers.length);
    for(let i=0; i<workers.length; i++) {
        workers[i].postMessage({
            "task": {"p": [0, i*dy], "dx": confs.width, "dy": dy}, 
            "confs": confs
        });
    }
}
```

工作进程
```
//执行渲染任务
onmessage = function(event) {
    //任务参数 {"p": [x, y], "dx": n, "dy": n}
    let task = event.data.task;
    //渲染参数
    let confs = event.data.confs;
    //构建实数坐标系: 将屏幕像素坐标系映射到 MBS 计算用的坐标系
    let rcs = new RCS(co = confs.pco, scale = (confs.dod[1]-confs.dod[0])/confs.width/confs.zr);
    //构建图像容器
    let img = new ImageData(task.dx, task.dy);
    //构建曼德勃罗特集
    let C0 = new Complex(...confs.C0);
    for(let y=0; y<task.dy; y++) {
        for(let x=0; x<task.dx; x++) {
            //计算
            let _x = task.p[0] + x, _y = task.p[1] + y;
            let res = Mandelbrot_Set(new Complex(...rcs.to([_x, _y])).add(C0), confs.n);
            //绘制
            let c = color(confs, res);
            let i = (y * task.dx + x) * 4;
            img.data[i] = c[0], img.data[i+1] = c[1], img.data[i+2] = c[2], img.data[i+3] = 255; 
        }
    }
    postMessage({"img": img, "p": task.p});
}
```

具体代码详见: [Mandelbrot_Set__ver_WebWorker](../../views/Algorithm/Mandelbrot_Set/Mandelbrot_Set__ver_WebWorker.html)