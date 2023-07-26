/**
 * @module
 * @desc     虚拟渲染上下文容器 
 * @project  Vision
 * @author   Ais
 * @date     2023-06-07
 * @version  0.1.0
*/


import { VisionContext } from "./VisionContext.js";


class VirtualContext extends VisionContext {

    constructor(width=1920, height=1080, BGC=[50, 50, 50]) {
        super(width, height, BGC);
    }

    /** 初始化 */
    init() {
        console.log(`[VirtualContext]: init({width:${this.width}, height:${this.height}, BGC:[${this.BGC}]})`);
        return this;
    }

    /** 刷新画布 */
    refresh(color=null, width=null, height=null) {
        console.log(`[VirtualContext]: refresh({color:[${color||this.BGC}], width:${width||this.width}, height:${height||this.height}})`);
    }

    /** 绘制直线 */
    line(xs, ys, xe, ye, {color=[255, 255, 255], lineWidth=1}={}) {
        console.log(`[VirtualContext]: line({xs:${xs}, ys:${ys}, xe:${xe}, ye:${ye}, color:[${color}], lineWidth:${lineWidth}})`);
    }

    /** 绘制圆 */
    circle(x, y, r, {color=[255, 255, 255], lineWidth=1, fill=false}={}) {
        console.log(`[VirtualContext]: circle({x:${x}, y:${y}, r:${r}, color:[${color}], lineWidth:${lineWidth}, fill:${fill}})`);
    }

    /** 绘制矩形 */
    rect(x, y, rx, ry, {color=[255, 255, 255], lineWidth=1, fill=false}={}) {
        console.log(`[VirtualContext]: rect({x:${x}, y:${y}, rx:${rx}, ry:${ry}, color:[${color}], lineWidth:${lineWidth}, fill:${fill}})`);
    }

    /** 绘制折线 */
    polyline(points, {color=[255, 255, 255], lineWidth=1, close=false}={}) {
        console.log(`[VirtualContext]: polyline({points:${points.length}, color:[${color}], lineWidth:${lineWidth}, close:${close}})`);
    }

    /** 绘制多边形 */
    polygon(points, {color=[255, 255, 255]}={}) {
        console.log(`[VirtualContext]: polyline({points:${points.length}, color:[${color}]})`);
    }

    /** 退出 */
    exit() {
        console.log(`[VirtualContext]: exit`);
    }
}


export { VirtualContext };