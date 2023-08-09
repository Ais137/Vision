/**
 * @module   
 * @desc     粒子类: 基于向量模拟抽象粒子的运动
 * @project  Vision
 * @author   Ais
 * @date     2022-07-10
 * @version  0.1.0
*/


import { Vector } from "../vector/vector.js";


//粒子(基类)
class Particle {

    /**
     * @classdesc 粒子基类: 基于向量模拟抽象粒子的运动
     * 
     * @property { Vector } p - 位置向量
     * @property { Vector } v - 速度向量
     * 
     * @param { Vector } [position=vector(0, 0)] - 初始位置向量
     * @param { Vector } [velocity=vector(0, 0)] - 初始速度向量
     * 
     * @example
     * let p = new Particle(new Vector(100, 100), new Vector(2, 3));
     */
    constructor(position, velocity) {
        this.p = position || new Vector(0, 0);
        this.v = velocity || new Vector(0, 0);
    }

    /**
     * 运动模式: 描述粒子的运动模式
     * 
     * @returns { Vector } 粒子的位置向量(this.p)
     */
    action() {
        return this.p.add(this.v);
    }

    /**
     * 停机状态: 描述粒子的停机状态
     * 
     * @returns { boolean } 停机状态
     */
    isEnd() {
        return false;
    }
}


export { Particle };