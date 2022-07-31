/****************************************
 * Name: point_capturer
 * Date: 2022-07-12
 * Author: Ais
 * Project: Vision
 * Desc: 捕获鼠标点击坐标
 * Version: 0.1
****************************************/

const Vector = require("../vector/vector").Vector;


class PointCapturer {

    /*----------------------------------------
    @name: 坐标捕获器
    @desc: 捕获鼠标点击的坐标点
    @property: 
        * canvas(Canvas): 绘制容器
        * points(list): 坐标点容器，存储捕获的坐标点
        * p(Vector): 当前鼠标坐标
        * style(obj): 坐标点的绘制样式
        * is_vector(bool): 坐标点的存储类型 -> true(Vector(x, y)) || false([x, y])
        * is_disp(bool): 是否绘制捕获的坐标点
        * is_line(bool): 是否将坐标连线
        * is_close(bool): 当is_line=true, 是否绘制闭合线
    @return(type): 
    @exp: 
    ----------------------------------------*/
    constructor(canvas) {
        //canvas容器
        this.canvas = canvas;
        //坐标点容器
        this.points = [];
        //当前坐标
        this.p = new Vector(0, 0);
        //坐标点样式
        this.style = {
            //半径
            r: 3,
            //颜色
            c: 'rgb(255, 255, 255)'
        }
        //坐标点类型
        this.is_vector = true;
        //是否绘制坐标点
        this.is_disp = false;
        //是否连线
        this.is_line = false;
        //连线是否闭合
        this.is_close = false
    }

    //捕获
    capture(element_id) {
        let _this = this;
        document.getElementById(element_id).addEventListener("mousemove", function(event) {
            _this.p = new Vector(event.clientX, event.clientY);
        });
        document.getElementById(element_id).addEventListener("mousedown", function(event) {
            //添加坐标点
            if(event.button == 0) {
                let x = event.clientX, y = event.clientY;
                _this.points.push(_this.is_vector ? new Vector(x, y) : [x, y]);
                _this.is_disp && _this.disp();
            //清空坐标点
            } else if(event.button == 2) {
                _this.points = [];
                _this.is_disp && _this.canvas.reflush();
            }
        });
    }

    //绘制
    disp() {
        this.canvas.reflush();
        //绘制当前坐标点
        this.canvas.colorStyle = this.style.c;
        this.canvas.circle(this.p.x, this.p.y, this.style.r);
        this.canvas.ctx.fill();
        //绘制捕获的坐标点
        for(let i=0, end=this.points.length; i<end; i++) {
            this.canvas.colorStyle = this.style.c;
            if(this.is_vector) {
                this.canvas.circle(this.points[i].x, this.points[i].y, this.style.r);
            } else {
                this.canvas.circle(this.points[i][0], this.points[i][1], this.style.r);
            }
            this.canvas.ctx.fill();
        }
        if(this.is_line) {
            this.canvas.ctx.strokeStyle = this.style.c;
            this.canvas.lines(this.points, this.is_close);
        }
    }

    //导出
    export(to_str=false) {
        let _points = this.points;
        if(this.is_vector) {
            _points = [];
            for(let i=0, end=this.points.length; i<end; i++) {
                _points.push([this.points[i].x, this.points[i].y]);
            }
        } 
        return to_str==false ? _points : JSON.stringify(_points);
    }
}


module.exports.PointCapturer = PointCapturer;