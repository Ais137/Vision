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


//线性运动粒子
class LinearMotorParticle extends Particle {

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
     * let lmp = new vision.particle.LinearMotorParticle(
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


//环形运动系统
class CircularMotorParticle extends Particle {

    /**
     * 环形运动: 描述环形运动模式的粒子
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
     * let cmp = new CircularMotorParticle(new Vector(1400, 300), 100, Math.PI/180);
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


//随机游走器
class RandomWalkerParticle extends Particle {
    
    /*----------------------------------------
    @func: 随机游走
    @desc: 给定一组速度向量集，每次随机选择一个速度进行移动
    @property: 
        * ps(Vector): 初始位置
        * rvs(list): 随机速度向量集 -> [Vector(速度向量), wt(权重)]
    ----------------------------------------*/
    /**
     * 随机游走模式: 给定一组速度向量集，每次随机选择一个速度进行移动
     * 
     * @property { Vector } p - 位置向量
     * @property { Object[] } _rvs - 随机速度向量集
     * @property { Vector } _rvs.v - 速度向量
     * @property { number } _rvs.p - 选择概率
     * @property { number } _rvs.ps - 起始概率值
     * @property { number } _rvs.pe - 终止概率值
     * 
     * @param { Vector } ps -  初始位置向量
     * @param { Array[] } rvs - 随机速度向量集: [[Vector(速度向量), wt(权重)], ...]
     * 
     * @example
     * let vd = 3;
     * let rw = new RandomWalkerParticle(new Vector(canvas.cx, canvas.cy), [
     *     [new Vector(-1, -1).mult(vd), 1/8],
     *     [new Vector(0, -1).mult(vd), 1/8],
     *     [new Vector(1, -1).mult(vd), 1/8],
     *     [new Vector(-1, 0).mult(vd), 1/8],
     *     [new Vector(1, 0).mult(vd), 1/8],
     *     [new Vector(-1, 1).mult(vd), 1/8],
     *     [new Vector(0, 1).mult(vd), 1/8],
     *     [new Vector(1, 1).mult(vd), 1/8],
     * ]);
     */
    constructor(ps, rvs) {
        super();
        this.p = ps;
        this._rvs = this._probability(rvs);
    }

    /**
     * 计算概率(基于权重): p[i] = wt[i] / sum(wt)
     * 
     * @param { Array[] } rvs - 随机速度向量集: [[Vector(速度向量), wt(权重)], ...]
     * @returns { Object } 随机速度向量集: [{"v": "速度", "p": "概率", "ps/pe": "概率范围"}, ...]
     */
    _probability(rvs) {
        //计算总权重
        let swt = 0;
        for(let i=0, end=rvs.length; i<end; i++) {
            swt += rvs[i][1];
        }
        //计算每个速度矢量的概率
        let _rvs = [], _ps = 0;
        for(let i=0, end=rvs.length; i<end; i++) {
            let p = (rvs[i][1] || 0) / swt;
            _rvs.push({
                //速度
                "v": rvs[i][0] || new Vector(0, 0),
                //概率
                "p": p,
                //概率范围
                "ps": _ps, "pe": _ps + p
            });
            _ps += p;
        }
        return _rvs;
    }

    /**
     * 从 *随机速度向量集* 中随机选择一个速度向量
     * 
     * @returns { Object } {"v": "速度", "p": "概率", "ps/pe": "概率范围"}
     */
    rv_select() {
        let r = Math.random();
        for(let i=0, end=this._rvs.length; i<end; i++) {
            if(r > this._rvs[i].ps && r <= this._rvs[i].pe) {
                return this._rvs[i].v;
            }
        }
    }

    /** @override */
    action() {
        //选择随机速度
        this.v = this.rv_select();
        return this.p.add(this.v);
    }
}


export { Particle, ForceParticle, LinearMotorParticle, CircularMotorParticle, RandomWalkerParticle };