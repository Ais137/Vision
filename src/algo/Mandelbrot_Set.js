/**
 * @module
 * @desc     曼德勃罗特集
 * @project  Vision
 * @author   Ais
 * @date     2022-12-06
 * @version  0.1.0
*/


/** 复数 */
class Complex {

    /**
     * @classdesc 复数: 实现复数计算
     * 
     * @property { number } r - 实部
     * @property { number } i - 虚部
     * 
     * @param { number } r - 实部
     * @param { number } i - 虚部
     * 
     * @example
     * let c = new Complex(1, 1);
     */
    constructor(r, i) {
        //实部
        this.r = r;
        //虚部
        this.i = i;
    }

    /**
     * 复数加法
     * @param { Complex } 操作数 
     * @returns { Complex } this
     */
    add(complex) {
        this.r += complex.r;
        this.i += complex.i;
        return this;
    }

    /**
     * 复数乘法: (a+bi)(c+di)=(ac-bd)+(bc+ad)i
     * @param { Complex } 操作数 
     * @returns { Complex } this
     */
    mult(complex) {
        let a = this.r, b = this.i, c = complex.r, d = complex.i;
        this.r = a * c - b * d;
        this.i = b * c + a * d;
        return this;
    }

    /**
     * 计算模长
     * @returns { number } 模长
     */
    norm() {
        return Math.sqrt(this.r * this.r + this.i * this.i);
    }

}


/**
 * 曼德勃罗特集: Z(n+1) = Z(n) ^ 2 + C
 * 
 * 判断给定参数(C)经过有限次迭代是否收敛
 * 
 * @param { Complex } C - 复数参数 
 * @param { number } n - 迭代次数(int&n>0)
 * 
 * @returns { Array } [是否属于该集合, 迭代次数]
 * 
 * @example
 * Mandelbrot_Set(new Complex(0, 0)) -> [true, n]
 */
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


/**
 * 朱利亚集: Z(n+1) = Z(n) ^ 2 + C
 * 
 * 固定参数C, 判断Z0是否在有限次迭代后收敛
 * 
 * @param { Complex } Z0 - 初始迭代参数 
 * @param { Complex } C - 固定复数参数
 * @param { number } n - 迭代次数(int&n>0)
 * 
 * @returns { Array } [是否属于该集合, 迭代次数]
 * 
 * @example 
 * Julia_Set(new Complex(0, 0), new Complex(-0.8, 0.156)) -> [true, n]
 */
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


export { Complex, Mandelbrot_Set, Julia_Set };