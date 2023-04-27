/**
 * @module
 * @desc     矢量场: 在给定区域内影响粒子行为
 * @project  Vision
 * @author   Ais
 * @date     2022-07-13
 * @version  0.1.0
*/


import { Vector } from "../vector/vector.js";
import { BaseArea } from "./area.js";


//矢量场(基类)
class Field {

    /**
     * @classdesc 矢量力场: 影响场范围内的粒子行为(对粒子进行力的作用)
     * 
     * @property { BaseArea } area - 场作用范围
     * 
     * @param { BaseArea } area - 场作用范围
     */
    constructor(area) {
        this.area = area || new BaseArea();
    }

    /**
     * 场作用力函数: 描述场对粒子的作用力
     * 
     * @param { ForceParticle } fp - 目标受力粒子
     */
    force(fp) {}
}


//引力场
class Gravity extends Field {

    //引力常数(6.67e-11|0.0000000000667)
    static G = 0.01;

    /**
     * @classdesc 引力场: 模拟引力效果  
     * 引力作用: F = G * (m*M) / r^2  
     * 考虑视觉效果，引力常数G的默认值为(G=0.01)  
     * 
     * @property { Vector } gp - 引力场中心质点坐标
     * @property { number } mass - 场心质点质量大小(mass>0)
     * @property { number } G - 引力常数，(G>0)为引力，(G<0)为斥力
     * @property { Area } area - 引力场作用范围(默认为无限大)
     *  
     * @param { Vector } gp - 引力场中心质点坐标
     * @param { number } [mass=1] - 场心质点质量大小(mass>0)
     * 
     * @example
     * let gf = new Gravity(new Vector(canvas.cx, canvas.cy));
     */
    constructor(gp, mass=1) {
        super();
        this.gp = gp || new Vector(0, 0);
        this.mass = mass;
        this.G = Gravity.G;
    }

    /** @override */
    force(fp) {
        if(this.area.in(fp.p)) {
            let r = this.gp.dist(fp.p);
            let g = Vector.sub(this.gp, fp.p).norm(this.G * (this.mass * fp.mass) / r*r);
            fp.force(g);
        }
    }

    /**
     * 计算两个粒子间的引力
     * 
     * @param { ForceParticle } fp1 - 目标受力粒子1 
     * @param { ForceParticle } fp2 - 目标受力粒子2
     */
    static gravity(fp1, fp2) {
        let r = Vector.dist(fp1.p, fp2.p);
        let g = Gravity.G * (fp1.mass * fp2.mass) / r*r;
        fp1.force(Vector.sub(fp2.p, fp1.p).norm(g));
        fp2.force(Vector.sub(fp1.p, fp2.p).norm(g));
    }
}


//匀加速场
class AccelerateField extends Field {

    /**
     * @classdesc 匀加速场: 对场内粒子施加固定力的作用  
     * 匀加速场作用: F = A  
     * 
     * @property { Vector } A - 场内加速度
     * 
     * @param { Vector } A - 场内作用加速度 
     * @param { Area } area - 场作用范围
     * 
     * @example
     * let field = new AccelerateField(new Vector(0.1, -0.1));
     */
    constructor(A, area) {
        super(area);
        this.A = A;
    }

    /** @override */
    force(fp) {
        fp.force(this.A);
    }
}


//减速场
class DecelerateField extends Field {
            
    /**
     * @classdesc 减速场: 对场内粒子施加减速作用   
     * 减速作用: F = D * v  
     * 
     * @property { number } D - 减速系数
     * 
     * @param { number } [D=0.015] - 减速系数
     * @param { Area } area - 场作用范围
     * 
     * @example
     * let field = new DecelerateField(0.01, new vision.area.CircleArea(new Vector(canvas.cx, canvas.cy), 400));
     */
    constructor(D, area) {
        super(area);
        this._D = -Math.abs(D || 0.015);
    }

    get D() { return this._D; }
    set D(val) { this._D = -Math.abs(val); }
    
    /** @override */
    force(fp) {
        if(this.area.in(fp.p)) {
            fp.force(fp.v.clone().norm(this.D * fp.v.norm() * fp.mass));
        }
    }

}


//偏转场
class DeflectField extends Field {

    /**
     * @classdesc 偏转场: 对场内粒子的速度产生偏转作用  
     * 偏转作用: v_val(线速度) = r(半径) * w(角速度)  
     * 
     * @property { number } W - 偏转角速度(弧度), W>0(顺时针旋转) 
     * 
     * @param { number } [W=0.017] - 偏转角速度(弧度)
     * @param { Area } area - 场作用范围
     * 
     * @example
     * let field = new DeflectField(Tools.ATR(5));
     */
    constructor(W, area) {
        super(area);
        //偏转角速度
        this.W = W || 0.017;
    }

    /** @override */
    force(fp) {
        if(this.area.in(fp.p)) {
            fp.force(Vector.sub(fp.v.clone().rotate(this.W), fp.v));
        }
    }
}


export { Field, Gravity, AccelerateField, DecelerateField, DeflectField };