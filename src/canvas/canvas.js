/****************************************
 * Name: HTML5 Canvas 对象
 * Date: 2022-07-05
 * Author: Ais
 * Project: Vision
 * Desc: 对canvas接口进行二次封装
 * Version: 0.1
****************************************/

class Canvas {

    /*----------------------------------------
    @func: Canvas对象
    @params: 
        * canvas_id(str): canvas标签的id
        * width(int): 画布宽度
        * height(int): 画布高度
        * BGC(str): 画布的背景颜色
    @return(obj): canvas对象
    @exp: 
        const canvas = new Canvas("vision_canvas", 3840, 2160);
    ----------------------------------------*/
    constructor(canvas_id, width, height, BGC='rgb(50, 50, 50)') {
        //获取canvas标签
        this.canvas = document.getElementById(canvas_id);
        //设置canvas尺寸
        this._width = this.canvas.width = width || window.screen.width;
        this._height = this.canvas.height = height || window.screen.height;
        //中心点坐标
        this._cx = parseInt(this._width / 2);
        this._cy = parseInt(this._height / 2);
        //获取绘图上下文(2D)
        this.ctx = this.canvas.getContext("2d");
        //默认背景色
        this.BGC = BGC;
        //point样式
        this.POINT = {
            //大小(半径)
            "R": 2,
            //颜色
            "C": "#FFFFFF"
        }
        this.refresh();
    }

    //设置canvas尺寸
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

    //重置画布尺寸
    resize(width, height) {
        this.width = parseInt(width) || window.screen.width;
        this.height = parseInt(height) || window.screen.height;
    }

    //刷新画布
    refresh(color){
        this.ctx.fillStyle = color || this.BGC;
        this.ctx.fillRect(0, 0, this._width, this._height);
    }

    /*----------------------------------------
    @func: 绘制点(point)
    @desc: 绘制坐标为(x, y)的点
    @params: 
        * x: x坐标参数
        * y: y坐标参数
        * color: 颜色
        * r: 半径
    @exp:
        * point(100, 100)
        * point(Vector(100, 100)) 
        * point({"x":100, "y":100}) 
    ----------------------------------------*/
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

    /*----------------------------------------
    @func: 绘制线段(line)
    @desc: 绘制一条从起始点(xs, ys)到终止点(xe, ye)的线段
    @params: 
        * (xs, ys): 起始点坐标
        * (xe, ye): 终止点坐标
    @exp:
        * line(100, 100, 300, 300)
        * line(Vector(100, 100), Vector(300, 300)) 
    ----------------------------------------*/
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

    /*----------------------------------------
    @func: 绘制线集
    @desc: 根据顶点集绘制线集
    @params: 
        * ps: 顶点集 -> [[x1, y1], [x2, y2], ..., [xn, yn]] || [v1, v2, v3, ..., vn]
        * color(str || Color(颜色对象)): 线段颜色样式 
        * close: 是否闭合
    @exp:
        * lines([[100, 100], [300, 300]])
        * lines([Vector(100, 100), Vector(300, 300)]) 
    ----------------------------------------*/
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

    /*----------------------------------------
    @func: 绘制圆
    @desc: 绘制圆心坐标为(x, y), 半径为r的圆
    @params: 
        * (x, y): 圆心坐标
        * r: 半径
        * color: 颜色
    @exp:
        * circle(100, 100, 5) 
    ----------------------------------------*/
    circle(x, y, r, color=null) {
        if(color){ this.ctx.strokeStyle = this.ctx.fillStyle = color};
        this.ctx.beginPath();
        this.ctx.arc(x, y, r, 0, 2*Math.PI);
        this.ctx.stroke(); 
        color && this.ctx.fill();
    }

    /*----------------------------------------
    @func: 绘制矩形
    @desc: 绘制中心坐标为(x, y), x轴半径为rx, y轴半径为ry的矩形
    @params: 
        * (x, y): 中心坐标
        * rx: x轴半径为rx
        * ry: y轴半径为rx
    @exp:
        * rect(100, 100, 50, 100) 
        * rect(100, 100, 50, 50) 
    ----------------------------------------*/
    rect(x, y, rx, ry) {
        this.ctx.beginPath();
        this.ctx.rect(x-rx, y-ry, rx*2, ry*2);
        this.ctx.stroke();
    }
}


module.exports.Canvas = Canvas;