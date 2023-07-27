/**
 * @module   particle/motion
 * @project  Vision
 * @author   Ais
 * @date     2022-07-10
 * @version  0.1.0
*/


import { Particle } from "../Particle.js";


//线性运动
class LinearMotion extends Particle {

    /**
     * @classdesc 线性运动: 描述直线运动模式的粒子
     * 
     * @property { Vector } p - 位置向量
     * @property { Vector } v - 速度向量
     * @property { Vector } ps - 初始位置向量
     * @property { Vector } pe - 终止位置向量
     * @property { Enum } [mode="line"] - 运动模式   
     * {"line": 移动到pe后停机, "loop": 移动到pe后回到ps, "back":移动到pe后，ps与pe互换}
     * @property { number } [end_dist_rate=1.2] - 终止距离误差倍率  
     * 用于终点距离的判断: end_dist <= this.v.norm() * this.end_dist_rate  
     * 
     * @param { Vector } ps - 初始位置向量
     * @param { Vector } pe - 终止位置向量
     * @param { number } [v_rate=1] - 设置粒子运动速率
     * 
     * @example 
     * let lmp = new vision.particle.LinearMotion(
     *     new Vector(200, 200), 
     *     new Vector(1000, 200),
     *     v_rate = 5
     * );
     */
    constructor(ps, pe, v_rate=1) {
        super();
        this._ps = ps;
        this._pe = pe;
        this.p = this._ps.clone();
        this.v = Vector.sub(this._pe, this._ps).norm(Math.abs(v_rate));
        this.mode = "line";
        this.end_dist_rate = 1.2;
    }
    
    get ps() { return this._ps.clone(); }
    get pe() { return this._pe.clone(); }
    
    //设置终止位置(并重新计算速度方向)
    set pe(vector) {
        this._pe = vector.clone();
        this.v = Vector.sub(this._pe, this.p).norm(this.v.norm());
    }

    /** 
     * 设置速率: 速度矢量的模长, 每次迭代移动的像素大小
     * 
     * @param { number } val - 速率(val>0)
     * @example p.v_rate = 5;
     */
    set v_rate(val) { this.v.norm(val); }
    /**
     * 设置速率: 经过多少次迭代后移动到 **pe**
     * 
     * @param { number } val - 速率(val>0)
     * @example p.v_count = 300;
     */
    set v_count(val) { this.v.norm(Vector.dist(this._pe, this._ps) / val); }

    /** @override */
    isEnd() {
        return this.p.dist(this._pe) <= this.v.norm() * this.end_dist_rate;
    }

    /** @override */
    action() {
        if(!this.isEnd()) {
            this.p.add(this.v);
        } else {
            switch(this.mode){
                case "loop": {
                    this.p = this._ps.clone();
                    break;
                }
                case "back": {
                    this.p = this._pe.clone();
                    this._pe = this._ps.clone();
                    this._ps = this.p.clone();
                    this.v.mult(-1);
                    break;
                }
                default: {
                    this.p = this._pe.clone();
                }
            }
        }
        return this.p;
    }
}


export { LinearMotion };