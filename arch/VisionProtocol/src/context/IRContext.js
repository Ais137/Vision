/**
 * @module
 * @desc     中间代码渲染上下文容器 
 * @project  Vision
 * @author   Ais
 * @date     
 * @version  0.1.0
*/


import * as fs from "node:fs";
import { VisionContext } from "./VisionContext.js";


/** 中间代码渲染上下文容器 */
class IRContext extends VisionContext {

    constructor(width=1920, height=1080, BGC=[50, 50, 50]) {
        super(width, height, BGC);
        //帧计数器
        this.ft = 0;
    }

    /** 初始化 */
    init(filepath) {
        this._context_ = fs.createWriteStream(filepath);
        return this;
    }

    /** 刷新画布 */
    refresh(color=null, width=null, height=null) {
        console.log(`[IRContext]: ft(${this.ft++})`);
        this._context_.write(JSON.stringify(
            {
                "cmd": "refresh", 
                "param": {
                    "color": color||this.BGC, 
                    "width": width||this.width,
                    "height": height||this.height
                }
            }
        )+"\r\n");
    }

    /** 绘制直线 */
    line(xs, ys, xe, ye, {color=[255, 255, 255], lineWidth=1}={}) {
        this._context_.write(JSON.stringify(
            {
                "cmd": "line",
                "param": {
                    "xs": xs,
                    "ys": ys,
                    "xe": xe,
                    "ye": ye,
                    "color": color,
                    "lineWidth": lineWidth
                }
            }
        )+"\r\n");
    }

    /** 绘制圆 */
    circle(x, y, r, {color=[255, 255, 255], lineWidth=1, fill=false}={}) {
        this._context_.write(JSON.stringify(
            {
                "cmd": "circle",
                "param": {
                    "x": x,
                    "y": y,
                    "r": r,
                    "color": color,
                    "lineWidth": lineWidth,
                    "fill": fill
                }
            }
        )+"\r\n");
    }

    /** 绘制矩形 */
    rect(x, y, rx, ry, {color=[255, 255, 255], lineWidth=1, fill=false}={}) {
        this._context_.write(JSON.stringify(
            {
                "cmd": "rect",
                "param": {
                    "x": x,
                    "y": y,
                    "rx": rx,
                    "ry": ry,
                    "color": color,
                    "lineWidth": lineWidth,
                    "fill": fill
                }
            }
        )+"\r\n");
    }

    /** 绘制折线 */
    polyline(points, {color=[255, 255, 255], lineWidth=1, close=false}={}) {
        //判断点集元素类型
        let isVector = (points[0].v != undefined);
        //判断是否是颜色对象
        let isColor = (color.color != undefined);
        //绘制线段
        let p1 = null, p2 = null, line_color = null;
        for(let i=0, n=points.length, end=(close ? n : n-1); i<end; i++) {
            p1 = isVector ? points[i].v : points[i];
            p2 = isVector ? points[(i+1)%n].v : points[(i+1)%n];
            line_color = isColor ? color.color(true) : color;
            this.line(p1[0], p1[1], p2[0], p2[1], {color: line_color, lineWidth: lineWidth});
        }
    }

    /** 绘制多边形 */
    polygon(points, {color=[255, 255, 255]}={}) {
        this._context_.write(JSON.stringify(
            {
                "cmd": "polyline",
                "param": {
                    "points": points,
                    "color": color,
                }
            }
        )+"\r\n");
    }

    /** 退出 */
    exit() {
        this.refresh();
        this._context_.close();
    }
}


export { IRContext };