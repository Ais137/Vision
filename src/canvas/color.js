/****************************************
 * Name: color | 颜色
 * Date: 2022-07-018
 * Author: Ais
 * Project: Vision
 * Desc: 颜色容器
 * Version: 0.1
****************************************/

const Vector = require("../vector/vector.js").Vector;

//颜色向量
class ColorVector extends Vector {

    /*----------------------------------------
    @class: 颜色向量(Vector)
    @desc: 
        用向量来描述颜色，一个颜色表达式可以看作RGB空间中的一个向量，之所以采用
        向量的形式来描述颜色在于，可以通过这种方式替换粒子中的位置向量，
        来描述颜色向量在颜色空间中的移动，从而构建颜色渐变器。
    @property: 
        * r/g/b(get/set): 颜色的RGB值分量
        * a(get/set): alpht通道分量
    @method: 
        * color(): 返回颜色表达式 -> 'rgb(r, g, b)'
        * clone(): 复制颜色向量
    @exp:
        * new ColorVector(100, 200, 300).color() -> 'rgb(100, 200, 300)';
    ----------------------------------------*/
    constructor(r=0, g=0, b=0, a=1) {
        super();
        //颜色分量
        this._v = a==1 ? [r, g, b] : [r, g, b, a];
    }

    get r(){ return this._v[0]; }
    get g(){ return this._v[1]; }
    get b(){ return this._v[2]; }
    get a(){ return this._v[3]; }
    set r(val){ this._v[0] = val; }
    set g(val){ this._v[1] = val; }
    set b(val){ this._v[2] = val; }
    set a(val){ this._v[3] = val; }

    color() {
        if(this._v.length==3) {
            return `rgb(${this._v[0]}, ${this._v[1]}, ${this._v[2]})`;
        } else {
            return `rgb(${this._v[0]}, ${this._v[1]}, ${this._v[2]}, ${this._v[3]})`;
        }
    }

    clone() {
        return new ColorVector(...this._v);
    }
}


//颜色渐变器
class ColorGradient {

    /*----------------------------------------
    @class: 线性颜色渐变器
    @desc: 一种迭代器，用于产生渐变色。
    @property: 
        * scv(ColorVector): 起始颜色向量
        * ecv(ColorVector): 终止颜色向量
        * cv(ColorVector): 当前颜色向量
        * n(number): 渐变次数，用于计算每次迭代时的颜色增量
        * _count(number): 内部计数器，用于记录当前迭代次数
        * _dcv(ColorVector): 每次迭代的颜色增量
    @method: 
        * color(): 返回颜色表达式 -> 'rgb(r, g, b)'
    @exp: 
        new ColorGradient([100, 200, 200], [50, 50, 50], 100);
    ----------------------------------------*/
    constructor(start_color, end_color, n) {
        //起始颜色向量
        this.scv = new ColorVector(...start_color);
        //终止颜色向量
        this.ecv = new ColorVector(...end_color);
        //当前颜色
        this.cv = this.scv.clone();
        //渐变次数
        this.n = n; 
        //计数器
        this._count = n;
        //计算颜色增量
        this._dcv = Vector.sub(this.ecv, this.scv).norm(Vector.dist(this.ecv, this.scv)/n);
    }

    color() {
        let color_val = this.cv.color();
        if(this._count > 0) { this.cv.add(this._dcv); }
        this._count--;
        return color_val;
    } 

}


module.exports.ColorVector = ColorVector;
module.exports.ColorGradient = ColorGradient;


