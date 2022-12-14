/****************************************
 * Name: view | 视图绘制
 * Date: 2022-08-01
 * Author: Ais
 * Project: Vision
 * Desc: 常用绘制方法封装
 * Version: 0.1
****************************************/

const color = require("../canvas/color");
const Vector = require("../vector/vector").Vector;


class Views {

    //canvas对象
    canvas = null;

    /*----------------------------------------
    @func: 节点连接器
    @desc: 绘制点距范围在给定区间内的粒子之间的连线
    @params:
        * ps(list:Particle): 节点粒子
        * dr(list:number): 可绘制的点距范围
        * line_color(list|ColorGradient): 连线的颜色
    ----------------------------------------*/
    static nodelink(ps, dr=[0, 100], line_color=[255, 255, 255]) {
        //粒子点距范围
        let pdr = (typeof dr === "number") ? [0, dr] : dr;
        let d = pdr[1] - pdr[0];
        //颜色向量|颜色渐变器
        let cv = line_color.color ? line_color : new color.ColorVector(...line_color);
        //绘制
        for(let i=0, n=ps.length; i<n; i++) {
            let c = cv.color(true);
            for(let k=i; k<n; k++) {
                //计算点距
                let pd = ps[i].p.dist(ps[k].p);
                if(pd >= pdr[0] && pd <= pdr[1]) {
                    Views.canvas.ctx.strokeStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]}, ${1-pd/d})`;
                    Views.canvas.line(ps[i].p, ps[k].p);
                }
            }
        }
    }

    /*----------------------------------------
    @func: 绘制网格
    @params: 
        * co(Vector): 网格中心坐标
        * dx(number,>0): 网格单元长度
        * dy(number,>0): 网格单元高度
        * xR(list:int): x轴坐标范围
        * yR(list:int): y轴坐标范围
        * color(list:int): 线段颜色
        * center(bool): 网格坐标是否居中 -> true(中心坐标位于线段交界点) | false(中心坐标位于网格单元中心)
    @exp: 
        Views.grid({co: grid.co, dx: grid.dx, dy: grid.dy});
    ----------------------------------------*/
    static grid({co, dx, dy, xR, yR, color=[255, 255, 255], center=true}) {
        //中心坐标
        co = co || new Vector(Views.canvas.cx, Views.canvas.cy);
        //网格单元尺寸
        dy = dy || dx;
        //x轴范围
        xR = xR || [-parseInt(Views.canvas.cx/dx)-1, parseInt(Views.canvas.cx/dx)+1];
        let xs = xR[0]*dx+co.x, xe = xR[1]*dx+co.x;
        //y轴范围
        yR = yR || [-parseInt(Views.canvas.cy/dy)-1, parseInt(Views.canvas.cy/dy)+1];
        let ys = yR[0]*dy+co.y, ye = yR[1]*dy+co.y;
        //居中偏移量
        let cdx = (center ? 0 : dx/2), cdy = (center ? 0 : dy/2); 
        //设置颜色
        Views.canvas.ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]||0.25})`
        //绘制x轴平行线
        for(let x=xR[0], n=xR[1]; x<=n; x++) {
            let _x = x*dx+co.x+cdx;
            Views.canvas.line(_x, ys, _x, ye);
        }
        //绘制y轴平行线
        for(let y=yR[0], n=yR[1]; y<=n; y++) {
            let _y = y*dy+co.y+cdy;
            Views.canvas.line(xs, _y, xe, _y);
        }
    }

    /*----------------------------------------
    @func: 光线
    @params:
        * ps(list:Vector): 线的点集
        * Lfx(function): 亮度衰减函数(Lfx应满足在[1, n]区间单调递减)
        * n(int:>0): 光线的层数
        * d(number:>0): 每次光线的宽度
        * cs(list): 起始颜色
        * ce(list): 终止颜色
    ----------------------------------------*/
    static lightLine(ps, {Lfx, n=10, d=3, cs=[255, 255, 255], ce=[0, 0, 0]} = {}) {
        //亮度衰减函数
        Lfx = Lfx || ((x) => {return 1/(x+0.0001);});
        //Lfx函数在[1, n]区间的最值, 用于进行后续归一化处理
        let max = Lfx(1), min = Lfx(n);
        //绘制光线
        Views.canvas.ctx.lineCap = "round";
        for(let i=n; i>0; i--) {
            //计算亮度
            let lr = (Lfx(i) - min) / (max - min);
            let lc = [(cs[0]-ce[0])*lr+ce[0], (cs[1]-ce[1])*lr+ce[1], (cs[2]-ce[2])*lr+ce[2]];
            //绘制光线层
            Views.canvas.ctx.lineWidth = i * d;
            Views.canvas.lines(ps, new color.ColorGradient(lc, ce, ps.length));
        }  
    }

    /*----------------------------------------
    @func: 光环
    @params: 
        * x, y, r(number): 圆心坐标与半径
        * Lfx(function): 亮度衰减函数(Lfx应满足在[1, n]区间单调递减)
        * n(int:>0): 光线的层数
        * cs(list): 起始颜色
        * ce(list): 终止颜色
        * point(bool): true->绘制成光点样式
    ----------------------------------------*/
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
            Views.canvas.colorStyle = `rgb(${lc[0]}, ${lc[1]}, ${lc[2]})`;
            Views.canvas.circle(x, y, dR*i);
            Views.canvas.ctx.fill();
        }  
    }
}


module.exports.Views = Views;

