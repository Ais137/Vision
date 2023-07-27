/**
 * @module   particle/motion
 * @project  Vision
 * @author   Ais
 * @date     2022-07-25
 * @version  0.1.0
*/


import { Particle } from "../Particle";


//简谐运动
class SimpleHarmonicMotion extends Particle {

    /**
     * @classdesc 简谐运动
     * 
     * @property { Vector } p0 - 中心位置(平衡位置)
     * @property { Vector } v0 - 单位速度(振动方向): 由 this.v 的单位化生成
     * @property { number } A  - 振幅: 由 this.v 的模长生成
     * @property { number } w  - 角速度
     * @property { number } rad0 - 初始弧度
     * @property { number } _rad - 当前弧度
     * 
     * @param { Vector } p - 中心位置(平衡位置)
     * @param { Vector } v - 速度矢量: 其模长确定振幅(A), 单位向量确定振动方向
     * @param { number } w - 角速度
     * @param { number } rad - 初始弧度
     * 
     * @example
     * let p = new SimpleHarmonicMotion(new Vector(), new Vector(3, 5).norm(200), 0.05);
     */
    constructor(p, v, w, rad=0) {
        super(p, v);
        //中心位置(平衡位置)
        this.p0 = this.p.clone();
        //单位速度(振动方向)
        this.v0 = this.v.clone().norm(1);
        //振幅
        this.A = this.v.norm();
        //角速度
        this.w = w;
        //初始弧度
        this.rad0 = rad
        //当前弧度
        this._rad = rad;
        //2*PI
        this._2PI = 2*Math.PI;
    }

    /**
     * 简谐运动的行为逻辑
     * 
     * @returns { Vector } 粒子的位置向量(this.p)
     */
    action() {
        //计算当前弧度
        this._rad += this.w;
        if(this._rad > this._2PI) { this._rad -= this._2PI };
        //计算位置
        this.p = this.v0.clone().mult(this.A*Math.sin(this._rad));
        return this.p;
    }

    /**
     * 获取振动周期
     */
    get T() {
        return (2*Math.PI)/this.w;
    }

    /**
     * 获取简谐运动的表达式
     */
    expression() {
        let A = this.A.toFixed(2);
        let w = this.w.toFixed(2);
        let rad0 = this.rad0.toFixed(2);
        return `(${A})*sin((${w})*t+(${rad0}))`;
    }
}


export { SimpleHarmonicMotion };