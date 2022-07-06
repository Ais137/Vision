/****************************************
 * Name: HTML5 Canvas 对象
 * Date: 2022-07-05
 * Author: Ais
 * Project: 
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
        this.reflush();
    }

    //设置canvas尺寸
    get width() { return this._width; }
    set width(w) { this._width = this.canvas.width = w; this._cx = parseInt(this._width / 2); this.reflush(); }
    get height() { return this._height; }
    set height(h) { this._height = this.canvas.height = h; this._cy = parseInt(this._height / 2); this.reflush(); }
    get cx() { return this._cx; }
    get cy() { return this._cy; }

    //重置画布尺寸
    resize(width, height) {
        this.width = parseInt(width) || window.screen.width;
        this.height = parseInt(height) || window.screen.height;
    }

    //刷新画布
    reflush(color){
        this.ctx.fillStyle = color || this.BGC;
        this.ctx.fillRect(0, 0, this._width, this._height);
    }

    /*----------------------------------------
    @func: 绘制点(point)
    @desc: 绘制坐标为(x, y)的点
    @params: 
        * x: x坐标参数
        * y: y坐标参数
    @exp:
        * point(x, y)
        * point([x, y])
        * point(vector) 
        * point({"x":x, "y":y}) 
    ----------------------------------------*/
    point(x, y) {
        if(typeof arguments[0] === "number") {
            x = arguments[0]; y = arguments[1];
        } else if (arguments[0].length) {
            x = arguments[0][0]; y = arguments[0][1];
        } else {
            x = arguments[0].x; y = arguments[0].y;
        }
        this.ctx.strokeStyle = this.ctx.fillStyle = this.POINT.C;
        this.ctx.beginPath();
        this.ctx.arc(x, y, this.POINT.R, 0, 2*Math.PI);
        this.ctx.stroke(); 
        this.POINT.R > 1 && this.ctx.fill();
    }

    //线
    line() {

    }

    //圆
    circle() {

    }

    //矩形
    rect() {
        
    }
}


module.exports.Canvas = Canvas;