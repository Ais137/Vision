/****************************************
 * Name: 曼德勃罗特集
 * Date: 2022-12-06
 * Author: Ais
 * Project: 
 * Desc: 
 * Version: 0.1
****************************************/

//复数
class Complex {

    /*----------------------------------------
    @class: 复数
    @desc: 实现复数计算
    @property: 
        * r(number): 实部
        * i(number): 虚部
    @method: 
        * add: 加法
        * mult: 乘法
        * norm: 求模
    @exp: 
        let c = new Complex(1, 1);
    ----------------------------------------*/
    constructor(r, i) {
        //实部
        this.r = r;
        //虚部
        this.i = i;
    }

    /*----------------------------------------
    @func: 复数加法
    ----------------------------------------*/
    add(complex) {
        this.r += complex.r;
        this.i += complex.i;
        return this;
    }

    /*----------------------------------------
    @func: 复数乘法
    @desc: (a+bi)(c+di)=(ac-bd)+(bc+ad)i
    ----------------------------------------*/
    mult(complex) {
        let a = this.r, b = this.i, c = complex.r, d = complex.i;
        this.r = a * c - b * d;
        this.i = b * c + a * d;
        return this;
    }

    /*----------------------------------------
    @func: 求模长
    ----------------------------------------*/
    norm() {
        return Math.sqrt(this.r * this.r + this.i * this.i);
    }

}


/*----------------------------------------
@func: 曼德勃罗特集: Z(n+1) = Z(n) ^ 2 + C
@desc: 判断给定参数(C)经过有限次迭代是否收敛
@params: 
    * C(Complex): 复数参数
    * n(int>0): 迭代次数
@return(type): [是否属于该集合, 迭代次数]
@exp: 
    Mandelbrot_Set(new Complex(0, 0)) -> [true, n]
----------------------------------------*/
const Mandelbrot_Set = function(C, n=500) {
    let z = new Complex(0, 0);
    for(let i=0; i<=n; i++) {
        z = z.mult(z).add(C);
        if(z.norm() > 2) {
            return [false, i];
        }
    }
    return [true, n]
}


/*----------------------------------------
@func: 朱利亚集: Z(n+1) = Z(n) ^ 2 + C
@desc: 固定参数C, 判断Z0是否在有限次迭代后收敛
@params: 
    * Z0(Complex): 初始迭代参数
    * C(Complex): 固定复数参数
    * n(int>0): 迭代次数
@return(type): [是否属于该集合, 迭代次数]
@exp: 
    Julia_Set(new Complex(0, 0), new Complex(-0.8, 0.156)) -> [true, n]
----------------------------------------*/
const Julia_Set = function(Z0, C, n=500) {
    let z = Z0;
    for(let i=0; i<=n; i++) {
        z = z.mult(z).add(C);
        if(z.norm() > 2) {
            return [false, i];
        }
    }
    return [true, n]
}



module.exports.Complex = Complex;
module.exports.Mandelbrot_Set = Mandelbrot_Set;
module.exports.Julia_Set = Julia_Set;

