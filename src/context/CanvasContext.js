/**
 * @module   
 * @desc     Canvas渲染上下文容器 
 * @project  Vision
 * @author   Ais
 * @date     2023-06-07
 * @version  0.1.0
*/


import { VisionContext } from "./VisionContext.js";


class CanvasContext extends VisionContext {
    
    /**
     * @classdesc Canvas渲染上下文容器
     * 
     * @property { Object } _canvas_  - canvas元素对象
     * @property { Object } _context_ - canvas 2d 上下文对象
     * 
     * @param { number } width  - 画布宽度 
     * @param { number } height - 画布高度 
     * @param { number[] } BGC  - 背景颜色
     * 
     * @example 
     * const context = new CanvasContext(1920, 1080, [0, 0, 0]).init("vision_canvas");
     */
    constructor(width, height, BGC=[0, 0, 0]) {
        super(
            width || window.screen.width || 1920, 
            height || window.screen.height || 2080, 
            BGC
        );
        this._canvas_ = null;
        this._context_ = null;        
    }

    /**
     * 初始化: 创建 Canvas2D 上下文对象对象
     * 
     * @param { string } canvas_element_id - canvas元素id 
     * @returns { Object } this
     */
    init(canvas_element_id) {
        this._canvas_ = document.getElementById(canvas_element_id);
        this._canvas_.width = this._width, this._canvas_.height = this._height;
        this._context_ = this._canvas_.getContext("2d");
        this.refresh()
        return this;
    }

    /**
     * 刷新画布
     * 
     * @param { number[] } color - 背景颜色
     * @param { number } width - 画布宽度
     * @param { number } height - 画布高度
     * 
     * @example
     * context.refresh();
     */
    refresh(color=null, width=null, height=null){
        this._context_.fillStyle = CanvasContext.RGB(...(color || this.BGC));
        this._context_.fillRect(0, 0, width || this.width, height || this.height);
    }

    /**
     * 绘制直线
     * 
     * @param { number } xs - 起始点坐标 x 分量
     * @param { number } ys - 起始点坐标 y 分量
     * @param { number } xe - 终止点坐标 x 分量
     * @param { number } ye - 终止点坐标 y 分量
     * @param { Object } style - 绘制参数
     * @param { number[] } [style.color=[255, 255, 255]] - 线段颜色
     * @param { number } [style.lineWidth=1] - 线段宽度 
     * 
     * @example
     * context.line(0, 0, context.width, context.height, {color: [0, 255, 0], lineWidth: 3});
     */
    line(xs, ys, xe, ye, {color=[255, 255, 255], lineWidth=1}={}) {
        let _strokeStyle = CanvasContext.RGB(...color);
        if(this._context_.strokeStyle != _strokeStyle) { this._context_.strokeStyle = _strokeStyle; }
        if(this._context_.lineWidth != lineWidth) { this._context_.lineWidth = lineWidth; }
        this._context_.beginPath();
        this._context_.moveTo(xs, ys);
        this._context_.lineTo(xe, ye);   
        this._context_.stroke(); 
    }

    /**
     * 绘制圆
     * 
     * @param { number } x - 圆心坐标 x 分量
     * @param { number } y - 圆心坐标 y 分量
     * @param { number } r - 圆半径
     * @param { Object } style - 绘制参数
     * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
     * @param { number } [style.lineWidth=1] - 线段宽度 
     * @param { boolean } [style.fill=false] - 填充状态
     * 
     * @example
     * context.circle(context.cx, context.cy, 100, {color: [0, 175, 175]});
     */
    circle(x, y, r=2, {color=[255, 255, 255], lineWidth=1, fill=true}={}) {
        let _color = CanvasContext.RGB(...color);
        if(this._context_.strokeStyle != _color) { this._context_.strokeStyle = _color; }
        if(fill && this._context_.fillStyle != _color) { this._context_.fillStyle = _color; }
        if(this._context_.lineWidth != lineWidth) { this._context_.lineWidth = lineWidth; }
        this._context_.beginPath();
        this._context_.arc(x, y, r, 0, 2*Math.PI);
        this._context_.stroke(); 
        fill && this._context_.fill();
    }

    /**
     * 绘制矩形
     * 
     * @param { number } x - 矩形中心坐标 x 分量
     * @param { number } y - 矩形中心坐标 y 分量
     * @param { number } rx - 矩形 x 轴半径
     * @param { number } ry - 矩形 y 轴半径
     * @param { Object } style - 绘制参数
     * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
     * @param { number } [style.lineWidth=1] - 线段宽度 
     * @param { boolean } [style.fill=false] - 填充状态
     * 
     * @example
     * context.rect(context.cx, context.cy, 500, 200, {color: [255, 0, 0]});
     */
    rect(x, y, rx, ry, {color=[255, 255, 255], lineWidth=1, fill=false}={}) {
        let _color = CanvasContext.RGB(...color);
        if(this._context_.strokeStyle != _color) { this._context_.strokeStyle = _color; }
        if(fill && this._context_.fillStyle != _color) { this._context_.fillStyle = _color; }
        if(this._context_.lineWidth != lineWidth) { this._context_.lineWidth = lineWidth; }
        this._context_.beginPath();
        this._context_.rect(x-rx, y-ry, rx*2, ry*2);
        this._context_.stroke();
        fill && this._context_.fill();
    }

    /**
     * 绘制折线
     * 
     * @param { Point[] } points - 点集: [[x1, y1], [x2, y2], ...]
     * @param { Object } style - 绘制参数
     * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
     * @param { number } [style.lineWidth=1] - 线段宽度 
     * @param { boolean } [style.close=false] - 线段闭合状态
     * 
     * @example
     * context.polyline([[100, 100], [300, 100], [500, 300], [400, 700]], {color:[0, 100, 255]});
     */
    polyline(points, {color=[255, 255, 255], lineWidth=1, close=false}={}) {
        //判断点集元素类型
        let isVector = (points[0].v != undefined);
        //判断是否是颜色对象
        let isColor = (color.color != undefined);
        //绘制线段
        for(let i=0, n=points.length, end=(close ? n : n-1); i<end; i++) {
            let p1 = isVector ? points[i].v : points[i];
            let p2 = isVector ? points[(i+1)%n].v : points[(i+1)%n];
            let line_color = isColor ? color.color() : color;
            this.line(p1[0], p1[1], p2[0], p2[1], {color: line_color, lineWidth: lineWidth});
        }
    }

    /**
     * 绘制多边形
     * 
     * @abstract
     * @param { Point[] } points - 点集: [[x1, y1], [x2, y2], ...]
     * @param { Object } style - 绘制参数
     * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
     * 
     * @example
     * context.polygon([[300, 500], [700, 500], [800, 700], [200, 700]], {color: [0, 200, 200]});
     */
    polygon(points, {color=[255, 255, 255]}={}) {
        //填充颜色
        let _color = CanvasContext.RGB(...color);
        if(this._context_.fillStyle != _color) { this._context_.fillStyle = _color; }
        //判断点集元素类型
        let isVector = (points[0].v != undefined);
        //绘制多边形
        this._context_.beginPath();
        let p = isVector ? points[0].v : points[0];
        this._context_.moveTo(p[0], p[1]);
        for(let i=1, n=points.length; i<n; i++) {
            p = isVector ? points[i].v : points[i];
            this._context_.lineTo(p[0], p[1]);
        }
        this._context_.fill();
    }

    /**
     * 颜色转换: 将RGBA颜色数组转换成颜色字符串(rgb格式)
     * 
     * @param { int } r - R分量 
     * @param { int } g - G分量 
     * @param { int } b - B分量
     * @param { int } a - a分量
     * @returns { string } 颜色字符串
     * 
     * @example
     * CanvasContext.RGB(50, 50, 50);   //rgb(50, 50, 50)
     * CanvasContext.RGB(50, 50, 50, 0.5);   //rgb(50, 50, 50, 0.5)
     */
    static RGB(r, g, b, a=1) {
        return (a==1) ? `rgb(${r}, ${g}, ${b})` : `rgb(${r}, ${g}, ${b}, ${a})`;
    }

    /**
     * 颜色转换: 将RGB颜色数组转换成颜色字符串(Hex格式)
     * 
     * @param { int } r - R分量 
     * @param { int } g - G分量 
     * @param { int } b - B分量
     * @returns { string } 颜色字符串
     * 
     * @example
     * CanvasContext.RGBtoHex(50, 50, 50);   //#323232
     * CanvasContext.RGBtoHex(0, 175, 175);  //#00afaf
     */
    static RGBtoHex(r, g, b) {
        r = parseInt(r > 255 ? 255 : (r < 0 ? 0 : r));
        r = r < 16 ? `0${r.toString(16)}` : r.toString(16); 
        g = parseInt(g > 255 ? 255 : (g < 0 ? 0 : g));
        g = g < 16 ? `0${g.toString(16)}` : g.toString(16); 
        b = parseInt(b > 255 ? 255 : (b < 0 ? 0 : b));
        b = b < 16 ? `0${b.toString(16)}` : b.toString(16); 
        return `#${r}${g}${b}`;
    }
}


export { CanvasContext };
