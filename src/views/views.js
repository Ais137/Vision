/**
 * @module
 * @desc     高级绘制模块: 常用绘制方法封装
 * @project  Vision
 * @author   Ais
 * @date    2022-08-01
 * @version  0.1.0
*/


import { Vector } from "../vector/vector.js";
import { ColorVector, ColorGradient } from "./color.js";


/**
 * @classdesc 高级绘制模块: 常用绘制方法封装
 * 
 * @property { VisionContext } context - 绘图上下文容器
 * 
 * @example
 * const Views = vision.Views; Views.context = context;
 */
class Views {

    //绘图上下文容器
    context = null;

    /**
     * 节点连接器: 绘制点距范围在给定区间内的粒子之间的连线
     * 
     * @param { Particle[] } ps - 节点粒子
     * @param { number[] } dr - 可绘制的点距范围，只绘制距离在该范围内的粒子连线
     * @param { Array | ColorGradient } line_color - 连线的颜色，支持渐变色
     * 
     * @example  
     * Views.nodelink(pcs.ps, [50, 100], [0, 175, 175]);
     * Views.nodelink(pcs.ps, 100, new ColorGradient([0, 0, 0], [255, 255, 255], 100));
     */
    static nodelink(ps, dr=[0, 100], line_color=[255, 255, 255]) {
        //粒子点距范围
        let pdr = (typeof dr === "number") ? [0, dr] : dr;
        let d = pdr[1] - pdr[0];
        //颜色向量|颜色渐变器
        let cv = line_color.color ? line_color : new ColorVector(...line_color);
        //绘制
        for(let i=0, n=ps.length; i<n; i++) {
            let c = cv.color();
            for(let k=i; k<n; k++) {
                //计算点距
                let pd = ps[i].p.dist(ps[k].p);
                if(pd >= pdr[0] && pd <= pdr[1]) {
                    Views.context.line(ps[i].p.x, ps[i].p.y, ps[k].p.x, ps[k].p.y, {color: [...c, 1-pd/d]});
                }
            }
        }
    }
    
    /**
     * 绘制网格
     * 
     * @param { Object } params - 绘制参数
     * @param { Vector } params.co - 网格中心坐标
     * @param { number } params.dx - 网格单元长度(dx>0)
     * @param { number } params.dy - 网格单元高度(dy>0)
     * @param { number[] } params.xR - x轴坐标范围
     * @param { number[] } params.yR - y轴坐标范围
     * @param { number[] } [params.color=[255, 255, 255]] - 线段颜色
     * @param { boolean } [params.center=true] - 网格坐标是否居中 -> true(中心坐标位于线段交界点) | false(中心坐标位于网格单元中心)
     * 
     * @example
     * Views.grid({co: new Vector(canvas.cx, canvas.cy), dx: 10, dy: 10});
     */
    static grid({co, dx, dy, xR, yR, color=[255, 255, 255], center=true}) {
        //中心坐标
        co = co || new Vector(Views.context.cx, Views.context.cy);
        //网格单元尺寸
        dy = dy || dx;
        //x轴范围
        xR = xR || [-parseInt(Views.context.cx/dx)-1, parseInt(Views.context.cx/dx)+1];
        let xs = xR[0]*dx+co.x, xe = xR[1]*dx+co.x;
        //y轴范围
        yR = yR || [-parseInt(Views.context.cy/dy)-1, parseInt(Views.context.cy/dy)+1];
        let ys = yR[0]*dy+co.y, ye = yR[1]*dy+co.y;
        //居中偏移量
        let cdx = (center ? 0 : dx/2), cdy = (center ? 0 : dy/2); 
        //绘制x轴平行线
        for(let x=xR[0], n=xR[1]; x<=n; x++) {
            let _x = x*dx+co.x+cdx;
            Views.context.line(_x, ys, _x, ye, {color: [color[0], color[1], color[2], color[3]||0.25]});
        }
        //绘制y轴平行线
        for(let y=yR[0], n=yR[1]; y<=n; y++) {
            let _y = y*dy+co.y+cdy;
            Views.context.line(xs, _y, xe, _y, {color: [color[0], color[1], color[2], color[3]||0.25]});
        }
    }

    /**
     * 光线
     * 
     * @param { Vector[] } ps - 线的顶点集
     * @param { Object } params - 绘制参数
     * @param { Function } [params.Lfx=(x) => {return 1/(x+0.0001);}] - 亮度衰减函数(Lfx应满足在[1, n]区间单调递减)
     * @param { number } [params.n=10] - 光线的层数(int & n>0)
     * @param { number } [params.d=3] - 每层光线的宽度
     * @param { number[] } [params.cs=[255, 255, 255]] - 起始颜色
     * @param { number[] } [params.ce=[0, 0, 0]] - 终止颜色
     * 
     * @example
     * Views.lightLine(ps);
     */
    static lightLine(ps, {Lfx, n=10, d=3, cs=[255, 255, 255], ce=[0, 0, 0]} = {}) {
        //亮度衰减函数
        Lfx = Lfx || ((x) => {return 1/(x+0.0001);});
        //Lfx函数在[1, n]区间的最值, 用于进行后续归一化处理
        let max = Lfx(1), min = Lfx(n);
        //绘制光线
        // Views.context.ctx.lineCap = "round";
        for(let i=n; i>0; i--) {
            //计算亮度
            let lr = (Lfx(i) - min) / (max - min);
            let lc = [(cs[0]-ce[0])*lr+ce[0], (cs[1]-ce[1])*lr+ce[1], (cs[2]-ce[2])*lr+ce[2]];
            //绘制光线层
            Views.context.polyline(ps, {color: new ColorGradient(lc, ce, ps.length), lineWidth: i * d});
        }  
    }

    /**
     * 光环
     * 
     * @param { number } x - 圆心x轴坐标
     * @param { number } y - 圆心y轴坐标
     * @param { number } r - 半径
     * @param { Object } params - 绘制参数
     * @param { Function } [params.Lfx=(x) => {return 1/(x+0.0001);}] - 亮度衰减函数(Lfx应满足在[1, n]区间单调递减)
     * @param { number } [params.n=50] - 光线的层数(int & n>0)
     * @param { number[] } [params.cs=[255, 255, 255]] - 起始颜色
     * @param { number[] } [params.ce=[0, 0, 0]] - 终止颜色
     * @param { boolean } [params.point=false] - (true)绘制成光点样式
     * 
     */
    static lightRing(x, y, r, {Lfx, n=50, cs=[255, 255, 255], ce=[0, 0, 0], point=false}={}) {
        //亮度衰减函数
        Lfx = Lfx || ((x) => {return 1/(x+0.0001);});
        //Lfx函数在[1, n]区间的最值, 用于进行后续归一化处理
        let max = Lfx(1), min = Lfx(n);
        //计算环宽
        let dR = r / n;
        //绘制
        for(let i=n; i>0; i--) {
            //计算亮度
            let lr = (Lfx(point ? i : n-i) - min) / (max - min);
            let lc = [(cs[0]-ce[0])*lr+ce[0], (cs[1]-ce[1])*lr+ce[1], (cs[2]-ce[2])*lr+ce[2]];
            //绘制光环
            Views.context.circle(x, y, dR*i, {color: lc});
        }  
    }

    /**
     * 绘制粒子轨迹: 解决“循环边界”下的轨迹绘制异常，通过将完整轨迹按照阈值进行分段绘制。
     * 
     * @param { Vector[] } trail - 轨迹点向量
     * @param { Object } params - 绘制参数
     * @param { number } [params.split_x=100] - x轴分量分段阈值: 点间隔超过阈值的将被拆分
     * @param { number } [params.split_y=100] - y轴分量分段阈值
     * @param { string } [params.color=[255, 255, 255]] - 轨迹颜色(支持渐变对象)
     * 
     * @example
     * trail(pcs.ps[i].tracker.trail, {"color": new ColorGradient([50, 50, 50], [255, 255, 255], pcs.ps[i].tracker.trail.length)});
     */
    static trail(trail, {split_x=100, split_y=100, color=[255, 255, 255]}={}) {
        let split_trail = [[]];
        //按照分量分段阈值对轨迹进行分段
        for(let i=0, n=trail.length-1; i<n; i++) {
            split_trail[split_trail.length-1].push(trail[i])
            if(Math.abs(trail[i].x-trail[i+1].x)>split_x | Math.abs(trail[i].y-trail[i+1].y)>split_y) {
                split_trail.push([]);
            }
        }
        for(let i=0, n=split_trail.length; i<n; i++) {
            if(split_trail[i].length <= 1) { continue; }
            Views.context.polyline(split_trail[i], {color: color});
        }
    }
}


export { Views };