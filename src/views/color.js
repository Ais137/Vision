/**
 * @module
 * @desc     颜色容器
 * @project  Vision
 * @author   Ais
 * @date     2022-07-18
 * @version  0.1.0
*/


import { Vector } from "../vector/vector.js";


//颜色向量
class ColorVector extends Vector {

    /**
     * 颜色向量(Vector):  
     * 用向量来描述颜色，一个颜色表达式可以看作RGB空间中的一个向量，之所以采用
     * 向量的形式来描述颜色在于，可以通过这种方式替换粒子中的位置向量，
     * 来描述颜色向量在颜色空间中的移动，从而构建颜色渐变器。
     * 
     * @property { number[] } v - 颜色向量容器(内部存储结构)
     * @property { get/set } r - R分量(this.v[0])
     * @property { get/set } g - G分量(this.v[1])
     * @property { get/set } b - B分量(this.v[2])
     * @property { get/set } a - alpht通道分量(this.v[3])
     * 
     * @param { number } [r=0] - R分量(int & [0, 255]) 
     * @param { number } [g=0] - G分量(int & [0, 255])  
     * @param { number } [b=0] - B分量(int & [0, 255])  
     * @param { number } [a=1] - alpht通道分量([0, 1])
     * 
     * @example
     * let color = new ColorVector(100, 200, 300);
     * color.color();  //'rgb(100, 200, 300)'
     */
    constructor(r=0, g=0, b=0, a=1) {
        (a==1) ? super(r, g, b) : super(r, g, b, a);
    }

    get r(){ return this.v[0]; }
    get g(){ return this.v[1]; }
    get b(){ return this.v[2]; }
    get a(){ return this.v[3] || 1; }
    set r(val){ this.v[0] = val; }
    set g(val){ this.v[1] = val; }
    set b(val){ this.v[2] = val; }
    set a(val){ this.v[3] = val; }

    /**
     * 返回颜色值
     * 
     * @returns { Array } 颜色值
     */
    color() {
        return [...this.v];
    }

    /** 复制颜色 */
    clone() {
        return new ColorVector(...this.v);
    }
}


//颜色渐变器
class ColorGradient {

    /**
     * @classdesc 线性颜色渐变器: 用于产生渐变色
     * 
     * @property { ColorVector } scv  - 起始颜色向量
     * @property { ColorVector } ecv  - 终止颜色向量
     * @property { ColorVector } cv   - 当前颜色向量
     * @property { number } n - 渐变次数，用于计算每次迭代时的颜色增量
     *  
     * @param { ColorVector } start_color - 起始颜色向量
     * @param { ColorVector } end_color - 终止颜色向量 
     * @param { number } n - 渐变次数
     * 
     * @example
     * let cg = new ColorGradient([100, 200, 200], [50, 50, 50], 100);
     */
    constructor(start_color, end_color, n) {
        this.scv = new ColorVector(...start_color);
        this.ecv = new ColorVector(...end_color);
        this.cv = this.scv.clone();
        this.n = n; 
        //内部计数器，用于记录当前迭代次数
        this._count = n;
        //计算颜色增量: 每次迭代的颜色增量
        this._dcv = Vector.sub(this.ecv, this.scv).norm(Vector.dist(this.ecv, this.scv)/n);
    }

    /**
     * 迭代并返回颜色值
     * 
     * @returns { Array } 颜色值
     */
    color() {
        let color_val = this.cv.color();
        if(this._count > 0) { this.cv.add(this._dcv); }
        this._count--;
        return color_val;
    } 

    /** 迭代终止条件 */
    isEnd() {
        return !(this._count > 0);
    }

}


export { ColorVector, ColorGradient };