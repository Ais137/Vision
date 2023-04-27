/**
 * @module
 * @desc     HTML5 Canvas API: 对canvas接口进行二次封装
 * @project  Vision
 * @author   Ais
 * @date     2022-07-05
 * @version  0.1.0
*/


import { Vector } from "../vector/vector.js";


class Canvas {

    /**
     * @classdesc Canvas API 对象封装
     * 
     * @property { Element } canvas - canvas元素
     * @property { number } width - 画布长度
     * @property { number } height - 画布高度
     * @property { number } cx - 画布中心点x轴坐标
     * @property { number } cy - 画布中心点y轴坐标
     * @property { Object } ctx - 2D绘图上下文对象
     * @property { string } BGC - 背景色
     * @property { Object } POINT - 绘制点样式
     * @property { Object } [POINT.R=2] - 点大小(半径)
     * @property { Object } [POINT.C="#FFFFFF"] - 点颜色
     * @property { string } colorStyle - strokeStyle && fillStyle
     * 
     * @param { string } canvas_id - canvas元素id 
     * @param { number } width - 画布长度 
     * @param { number } height - 画布高度 
     * @param { string } [BGC='rgb(50, 50, 50)'] - 背景色
     * 
     * @example const canvas = new Canvas("vision_canvas", 3840, 2160);
     */
    constructor(canvas_id, width, height, BGC='rgb(50, 50, 50)') {
        this.canvas = document.getElementById(canvas_id);
        this._width = this.canvas.width = width || window.screen.width;
        this._height = this.canvas.height = height || window.screen.height;
        this._cx = parseInt(this._width / 2);
        this._cy = parseInt(this._height / 2);
        this.ctx = this.canvas.getContext("2d");
        this.BGC = BGC;
        this.POINT = {
            //大小(半径)
            "R": 2,
            //颜色
            "C": "#FFFFFF"
        }
        this.refresh();
    }

    get width() { return this._width; }
    set width(w) { this._width = this.canvas.width = w; this._cx = parseInt(this._width / 2); this.refresh(); }
    get height() { return this._height; }
    set height(h) { this._height = this.canvas.height = h; this._cy = parseInt(this._height / 2); this.refresh(); }
    get cx() { return this._cx; }
    get cy() { return this._cy; }

    //设置颜色(strokeStyle && fillStyle)
    set colorStyle(color) {
        this.ctx.strokeStyle = this.ctx.fillStyle = color;
    }

    /**
     * 重置画布尺寸
     * 
     * @param { number } width - 画布长度 
     * @param { number } height - 画布高度 
     */
    resize(width, height) {
        this.width = parseInt(width) || window.screen.width;
        this.height = parseInt(height) || window.screen.height;
    }

    /**
     * 刷新画布
     * 
     * @param { string } color - 背景色，默认采用 this.BGC 
     */
    refresh(color){
        this.ctx.fillStyle = color || this.BGC;
        this.ctx.fillRect(0, 0, this._width, this._height);
    }

    /**
     * 绘制点(point): 绘制坐标为(x, y)的点
     * 
     * @param { number } x - x轴坐标 
     * @param { number } y - y轴坐标
     * @param { string } [color=this.POINT.C] - 颜色
     * @param { string } [r=this.POINT.R] - 半径尺寸 
     * 
     * @example 
     * canvas.point(100, 100);
     * canvas.point(Vector(100, 100));
     * canvas.point({"x":100, "y":100});
     */
    point(x, y, color=null, r=null) {
        if(typeof arguments[0] != "number") {
            x = arguments[0].x; y = arguments[0].y;
        }
        this.ctx.strokeStyle = this.ctx.fillStyle = (color || this.POINT.C);
        this.ctx.beginPath();
        this.ctx.arc(x, y, r || this.POINT.R, 0, 2*Math.PI);
        this.ctx.stroke(); 
        this.POINT.R > 1 && this.ctx.fill();
    }

    /**
     * 绘制线段(line): 绘制一条从起始点(xs, ys)到终止点(xe, ye)的线段
     * 
     * @param { number } xs - 起始点x轴坐标 
     * @param { number } ys - 起始点y轴坐标
     * @param { number } xe - 终止点x轴坐标
     * @param { number } ye - 终止点y轴坐标
     * 
     * @example
     * canvas.line(100, 100, 300, 300);
     * canvas.line(Vector(100, 100), Vector(300, 300));
     */
    line(xs, ys, xe, ye) {
        if(typeof arguments[0] != "number") {
            xs = arguments[0].x; ys = arguments[0].y;
            xe = arguments[1].x; ye = arguments[1].y;
        }
        this.ctx.beginPath();
        this.ctx.moveTo(xs, ys);
        this.ctx.lineTo(xe, ye);   
        this.ctx.stroke(); 
    }

    /**
     * 绘制线集: 根据顶点集绘制线集
     * 
     * @param { Array[] | Vector[] } ps - 顶点集 -> [[x1, y1], [x2, y2], ..., [xn, yn]] || [v1, v2, v3, ..., vn] 
     * @param { string | Color } [color] - 线段颜色样式
     * @param { boolean } [close] - 是否闭合
     * 
     * @example
     * canvas.lines([[100, 100], [300, 300]]);
     * canvas.lines([Vector(100, 100), Vector(300, 300)]);
     */
    lines(ps, color='rgb(255, 255, 255)', close=false) {
        //判断点集元素类型
        let isVector = (ps[0].x != undefined);
        //判断是否是颜色对象
        let isColor = (color.color != undefined);
        //绘制线段
        for(let i=0, n=ps.length, end=(close ? n : n-1); i<end; i++) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = (isColor ? color.color() : color);
            if(isVector) {
                this.ctx.moveTo(ps[i].x, ps[i].y); this.ctx.lineTo(ps[(i+1)%n].x, ps[(i+1)%n].y);
            } else {
                this.ctx.moveTo(ps[i][0], ps[i][1]); this.ctx.lineTo(ps[(i+1)%n][0], ps[(i+1)%n][1]);
            }
            this.ctx.stroke();
        }
    }

    /**
     * 绘制圆: 绘制圆心坐标为(x, y), 半径为r的圆
     * 
     * @param { number } x - 圆心x轴坐标
     * @param { number } y - 圆心y轴坐标
     * @param { number } r - 半径 
     * @param { string } [color] - 填充颜色 
     * 
     * @example
     * canvas.circle(100, 100, 5);
     */
    circle(x, y, r, color=null) {
        if(color){ this.ctx.strokeStyle = this.ctx.fillStyle = color};
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2*Math.PI);
        this.ctx.stroke(); 
        color && this.ctx.fill();
    }

    /**
     * 绘制矩形: 绘制中心坐标为(x, y), x轴半径为rx, y轴半径为ry的矩形
     * 
     * @param { number } x - 矩形中心x坐标 
     * @param { number } y - 矩形中心y坐标 
     * @param { number } rx - 矩形x轴半径 
     * @param { number } ry - 矩形y轴半径
     * 
     * @example
     * canvas.rect(100, 100, 50, 100);
     */
    rect(x, y, rx, ry) {
        this.ctx.beginPath();
        this.ctx.rect(x-rx, y-ry, rx*2, ry*2);
        this.ctx.stroke();
    }
}


export { Canvas };