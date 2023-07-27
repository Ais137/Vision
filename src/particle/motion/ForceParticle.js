/**
 * @module   particle/motion
 * @project  Vision
 * @author   Ais
 * @date     2022-07-10
 * @version  0.1.0
*/


import { Particle } from "../Particle.js";


//作用力粒子
class ForceParticle extends Particle {

    /**
     * @classdesc 作用力粒子: 可进行受力和进行相互作用
     * 
     * @property { Vector } p - 位置向量
     * @property { Vector } v - 速度向量
     * @property { Vector } acc - 加速度
     * @property { number } mass - 质量
     * 
     * @param { Vector } [position=vector(0, 0)] - 初始位置向量
     * @param { Vector } [velocity=vector(0, 0)] - 初始速度向量
     * @param { Vector } [acceleration=vector(0, 0)] - 初始加速度 
     * @param { number } [mass=1] - 质量
     *  
     */
    constructor(position, velocity, acceleration, mass) {
        super();
        this.p = position || new Vector(0, 0);
        this.v = velocity || new Vector(0, 0);
        this.acc = acceleration || new Vector(0, 0);
        this.mass = mass || 1;
    }

    /**
     * 受力作用: 通过受力来改变粒子的加速度(积累效应)
     * 
     * @param { Vector } f - 作用力 
     */
    force(f) {
        this.acc.add(f.clone().mult(1/this.mass));
    }

    /** @override */
    action() {
        this.p.add(this.v.add(this.acc));
        this.acc = new Vector(0, 0);
        return this.p;
    }
}


export { ForceParticle };