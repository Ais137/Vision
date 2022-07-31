/****************************************
 * Name: Field | 矢量场
 * Date: 2022-07-13
 * Author: Ais
 * Project: Vision
 * Desc: 在给定区域内影响粒子行为
 * Version: 0.1
****************************************/

const Vector = require("./vector.js").Vector;
const Area = require('./area.js');


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
        this.area = area || new Area.BaseArea();
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

    //引力作用
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


// //匀加速场
// class AccFiled extends Filed {
    
//     constructor(area) {
//         super();
//         //场作用范围
//         this.area = new area.BaseArea();
//         //加速度
//         this.A = 0.01;
//     }

//     force(fp) {
//         if(this.area.in(fp.p)) {
//             fp.force(fp.v.clone().norm(fp.mass * this.A));
//         }
//     }
// }


module.exports.Field = Field;
module.exports.Gravity = Gravity;