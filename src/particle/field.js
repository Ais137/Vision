/****************************************
 * Name: Field | 矢量场
 * Date: 2022-07-13
 * Author: Ais
 * Project: Vision
 * Desc: 在给定区域内影响粒子行为
 * Version: 0.1
****************************************/


import { Vector } from "../vector/vector.js";
import { BaseArea } from "./area.js";


//矢量场(基类)
class Field {

    /*----------------------------------------
    @func: 矢量力场
    @desc: 影响场范围内的粒子行为(对粒子进行力的作用)
    @property: 
        * area(BaseArea): 场作用范围
    ----------------------------------------*/
    constructor(area) {
        //场作用范围
        this.area = area || new BaseArea();
    }

    /*----------------------------------------
    @func: 场作用力函数
    @desc: 描述场对粒子的作用力
    @params: 
        * fp(ForceParticle): 受力粒子
    ----------------------------------------*/
    force(fp) {}
}


//引力场
class Gravity extends Field {

    //引力常数(6.67e-11|0.0000000000667)
    static G = 0.01;

    /*----------------------------------------
    @func: 引力场
    @desc: 模拟引力效果
    @property: 
        * gp(Vector): 引力场中心质点坐标
        * mass(number): 场心指点质量大小
        * G(number): 引力常数, 当(G<0)时，表现为斥力
        * area(Area): 引力场作用范围(默认为无限大)
    ----------------------------------------*/
    constructor(gp, mass=1) {
        super();
        //引力场中心坐标
        this.gp = gp || new Vector(0, 0);
        //场心质量
        this.mass = mass;
        //引力常数
        this.G = Gravity.G;
    }

    /*----------------------------------------
    @func: 引力作用
    @desc: F = G * (m*M) / r^2
    ----------------------------------------*/
    force(fp) {
        if(this.area.in(fp.p)) {
            let r = this.gp.dist(fp.p);
            let g = Vector.sub(this.gp, fp.p).norm(this.G * (this.mass * fp.mass) / r*r);
            fp.force(g);
        }
    }

    //计算两个粒子间的引力
    static gravity(fp1, fp2) {
        let r = Vector.dist(fp1.p, fp2.p);
        let g = Gravity.G * (fp1.mass * fp2.mass) / r*r;
        fp1.force(Vector.sub(fp2.p, fp1.p).norm(g));
        fp2.force(Vector.sub(fp1.p, fp2.p).norm(g));
    }
}


//匀加速场
class AccelerateField extends Field {

    /*----------------------------------------
    @class: 匀加速场
    @desc: 对场内粒子施加固定力的作用
    @property: 
        * A(vector): 加速度
        * area(Area): 场作用范围
    ----------------------------------------*/
    constructor(A, area) {
        super(area);
        //加速度
        this.A = A;
    }

    /*----------------------------------------
    @func: 引力作用
    @desc: F = A
    ----------------------------------------*/
    force(fp) {
        fp.force(this.A);
    }
}


//减速场
class DecelerateField extends Field {
            
    /*----------------------------------------
    @class: 减速场
    @desc: 对场内粒子施加减速作用
    @property: 
        * _D(number): 减速系数
        * area(Area): 场作用范围
    ----------------------------------------*/
    constructor(D, area) {
        super(area);
        //减速系数
        this._D = -Math.abs(D || 0.015);
    }

    get D() { return this._D; }
    set D(val) { this._D = -Math.abs(val); }
    
    /*----------------------------------------
    @func: 减速作用
    @desc: F = D * v
    ----------------------------------------*/
    force(fp) {
        if(this.area.in(fp.p)) {
            fp.force(fp.v.clone().norm(this.D * fp.v.norm() * fp.mass));
        }
    }

}


//偏转场
class DeflectField extends Field {

    /*----------------------------------------
    @class: 偏转场
    @desc: 对场内粒子的速度产生偏转作用
    @property: 
        * W(number): 偏转角速度(弧度), W>0(顺时针旋转) 
        * area(Area): 场作用范围
    @exp: 
    ----------------------------------------*/
    constructor(W, area) {
        super(area);
        //偏转角速度
        this.W = W || 0.017;
    }

    /*----------------------------------------
    @func: 偏转作用
    @desc: v_val(线速度) = r(半径) * w(角速度)
    ----------------------------------------*/
    force(fp) {
        if(this.area.in(fp.p)) {
            fp.force(Vector.sub(fp.v.clone().rotate(this.W), fp.v));
        }
    }
}


export { Field, Gravity, AccelerateField, DecelerateField, DeflectField };