/****************************************
 * Name: Field | 场
 * Date: 2022-07-13
 * Author: Ais
 * Project: Vision
 * Desc: 在给定区域内影响粒子行为
 * Version: 0.1
****************************************/

const Vector = require("./vector.js").Vector;


//基类
class Filed {

    //作用力
    force(p) { 

    }
}


//引力场
class Gravity extends Filed {

    constructor(gp, mass) {
        super();
        //引力场中心坐标
        this.gp = gp || new Vector(0, 0);
        //场心质量
        this.mass = mass || 1;
        //引力常数(6.67e-11)
        this.G = 0.0000000000667;
    }

    force(fp) {
        let r = this.gp.dist(fp.p);
        // let g = Vector.sub(fp.p, this.gp).norm(this.G * (this.mass * fp.mass) / r*r);
        let g = Vector.sub(this.gp, fp.p).norm(this.G * (this.mass * fp.mass) / r*r);
        fp.force(g);
    }
}


module.exports.Filed = Filed;
module.exports.Gravity = Gravity;