/**
 * @module   
 * @desc     粒子(运动)组合器
 * @project  Vision
 * @author   Ais
 * @date     2023-07-27
 * @version  0.1.0
*/


import { Particle } from "./Particle.js";


//粒子(运动)组合器
class ParticleAssembler extends Particle {

    /**
     * @classdesc 粒子(运动)组合器: 将粒子容器的位置矢量叠加进行组合
     * 
     * @property { Vector } po - 坐标原点
     * @property { Particle[] } ps - 粒子容器
     * 
     * @param { Vector } po - 坐标原点
     * @param { Particle[] } ps - 粒子容器
     * 
     * @example
     * let PA = new vision.particle.ParticleAssembler(
     *      po = new Vector(context.cx, context.cy),
     *      ps = [
     *          new SHM(new Vector(), new Vector(3, 5).norm(200), Tools.ATR(4)),
     *          new SHM(new Vector(), new Vector(5, -1).norm(300), Tools.ATR(6)),
     *          new SHM(new Vector(), new Vector(-5, 2).norm(250), Tools.ATR(3)),
     *      ]
     * );
     */
    constructor(po, ps) {
        super(po);
        this.po = po.clone();
        this.ps = ps;
    }

    /**
     * 行为逻辑
     * 
     * @returns { Vector } 粒子的位置向量(this.p) 
     */
    action() {
        this.p = this.po.clone();
        for(let i=0, n=this.ps.length; i<n; i++) {
            this.p.add(this.ps[i].action());
        }
        return this.p;
    }
}


export { ParticleAssembler };