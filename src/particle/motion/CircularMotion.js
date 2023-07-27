/**
 * @module   particle/motion
 * @project  Vision
 * @author   Ais
 * @date     2022-07-10
 * @version  0.1.0
*/


import { Particle } from "../Particle.js";


//圆周运动
class CircularMotion extends Particle {

    /**
     * 圆周运动: 描述圆周运动模式的粒子
     * 
     * @property { Vector } o - 圆心位置
     * @property { number } r - 旋转半径
     * @property { number } w - 角速度 
     * @property { number } rad - 当前弧度
     * @property { Vector } po - 当前坐标(以this.o为原点)
     * @property { Vector } p - 当前坐标(以(0, 0)为原点)
     * 
     * @param { Vector } [o=vector(0, 0)] - 圆心位置
     * @param { number } [r=1] - 旋转半径
     * @param { number } [w=(Math.PI/180)] - 角速度 
     * @param { number } [rad=0] - 初始弧度位置
     * 
     * @example 
     * let cmp = new CircularMotion(new Vector(1400, 300), 100, Math.PI/180);
     */
    constructor(o, r=1, w=(Math.PI/180), rad=0) {
        super();
        this.o = o || new Vector(0, 0);
        this.r = r;
        this.w = w;
        this.rad = rad;
        this.po = new Vector(this.r*Math.sin(this.rad), this.r*Math.cos(this.rad));
        this.p = Vector.add(this.po, this.o);
    }

    /** @override */
    action() {
        this._p = this.p.clone();
        this.rad += this.w;
        if(this.rad >= 2 * Math.PI) { this.rad -= 2 * Math.PI; } 
        if(this.rad <= -2 * Math.PI) { this.rad += 2 * Math.PI; } 
        this.po.x = this.r * Math.sin(this.rad);
        this.po.y = this.r * Math.cos(this.rad);
        this.p = Vector.add(this.po, this.o);
        this.v = this.p.clone().sub(this._p);
        return this.p;
    }

}


export { CircularMotion };