/****************************************
 * Name: 粒子系统/运动系统
 * Date: 2022-07-10
 * Author: Ais
 * Project: Vision
 * Desc: 通过向量描述粒子的运动
 * Version: 0.1
****************************************/

const Vector = require("./vector.js").Vector;


//粒子(基类)
class Particle {

    /*----------------------------------------
    @func: Particle构建器
    @desc: 通过向量描述粒子的运动
    @params: 
        * position(Vector): 位置矢量
        * velocity(Vector): 速度矢量
    @return(Particle): obj
    @exp: 
        let p = new Particle(new Vector(100, 100), new Vector(2, 3));
    ----------------------------------------*/
    constructor(position, velocity) {
        //位置矢量
        this.p = position || new Vector(0, 0);
        //速度矢量
        this.v = velocity || new Vector(0, 0);
    }

    /*----------------------------------------
    @func: 运动模式
    @desc: 描述粒子的运动模式
    @return(Vector): this.p -> 粒子的当前位置 
    ----------------------------------------*/
    action() {
        return this.p.add(this.v).clone();
    }
}


//线性运动粒子
class LinearMotorParticle extends Particle {

    /*----------------------------------------
    @func: 线性运动
    @desc: 描述直线运动模式的粒子
    @params: 
        * ps(Vector): 起始位置
        * pe(Vector): 终止位置
        * v_rate(number): 速率(this.v.norm())
    ----------------------------------------*/
    constructor(ps, pe, v_rate=1) {
        super();
        //起始位置
        this._ps = ps;
        //终止位置
        this._pe = pe;
        //当前位置
        this.p = this._ps.clone();
        //速度
        this.v = Vector.sub(this._pe, this._ps).norm(v_rate);
        /*  
        运动模式:
            * [line]: 移动到pe后停机
            * [loop]: 移动到pe后回到ps
            * [back]: 移动到pe后，ps与pe互换
        */
        this.mode = "line";
        //终止距离误差倍率(用于终点距离的判断: end_dist <= this.v.norm() * this.end_dist_rate)
        this.end_dist_rate = 1.2;
    }
    
    get ps() { return this._ps.clone(); }
    get pe() { return this._pe.clone(); }
    
    //设置终止位置(并重新计算速度方向)
    set pe(vector) {
        this._pe = vector.clone();
        this.v = Vector.sub(this._pe, this.p).norm(this.v.norm());
    }

    /*----------------------------------------
    @func: 设置速率
    @desc: 
        * v_rate: 速度矢量的模长, 每次迭代移动的像素大小
        * v_count: 经过多少次迭代后移动到pe
    @params: 
        * val(number): 速率
    @exp: 
        p.v_rate = 5;
        p.v_count = 300;
    ----------------------------------------*/
    set v_rate(val) { this.v.norm(val); }
    set v_count(val) { this.v.norm(Vector.dist(this._pe, this._ps) / val); }

    /*----------------------------------------
    @func: 停机状态
    @desc: 描述粒子在什么条件下停机(停止运动)
    @return(bool): 状态
    ----------------------------------------*/
    end() {
        return this.p.dist(this._pe) <= this.v.norm() * this.end_dist_rate;
    }

    //运动模式
    action() {
        if(!this.end()) {
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
        return this.p.clone();
    }
}


//环形运动系统
class CircularMotorParticle extends Particle {

    /*----------------------------------------
    @func: 环形运动
    @desc: 描述圆形运动模式的粒子
    @params: 
        * o(Vector): 圆心位置
        * r(number): 旋转半径
        * v_rad(number): 旋转速率(弧度)
        * rad(number): 起始弧度
    ----------------------------------------*/
    constructor(o, r, v_rad, rad=0) {
        super();
        //圆心位置
        this.o = o || new Vector(0, 0);
        //旋转半径
        this.r = r || 1;
        //速率
        this.v_rad = v_rad || (Math.PI/180);
        //当前弧度(-2*PI, 2*PI)
        this.rad = rad;
        //当前坐标(以this.o为原点)
        this.po = new Vector(this.r*Math.sin(this.rad), this.r*Math.cos(this.rad));
        //当前坐标(以(0, 0)为原点)
        this.p = Vector.add(this.po, this.o);
    }

    //运动模式
    action() {
        this.rad += this.v_rad;
        if(this.rad >= 2 * Math.PI) { this.rad -= 2 * Math.PI; } 
        if(this.rad <= -2 * Math.PI) { this.rad += 2 * Math.PI; } 
        this.po.x = this.r * Math.sin(this.rad);
        this.po.y = this.r * Math.cos(this.rad);
        this.p = Vector.add(this.po, this.o);
        return this.p.clone();
    }

}


//随机游走器
class RandomWalker extends Particle {

}



module.exports.Particle = Particle;
module.exports.LinearMotorParticle = LinearMotorParticle;
module.exports.CircularMotorParticle = CircularMotorParticle