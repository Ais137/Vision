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
    @class: Particle(粒子)
    @desc: 通过向量描述粒子的运动
    @property: 
        * position(Vector): 位置矢量
        * velocity(Vector): 速度矢量
    @method:
        * action(): 描述粒子运动模式 -> 粒子位置矢量(Vector)
        * end(): 粒子停机状态 -> bool
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
        return this.p.add(this.v);
    }

    /*----------------------------------------
    @func: 停机状态
    @desc: 描述粒子的停机状态
    @return(bool):  
    ----------------------------------------*/
    end() {
        return false;
    }
}


//粒子系统(基类)
class ParticleSystem {

    /*----------------------------------------
    @class: ParticleSystem(粒子系统)
    @desc: 描述粒子集群
    @property: 
        * ps(list:Particle): 粒子容器
        * max_pn(number[N+]): 最大粒子数(>=0)
        * gen_pn(number[N+]): 迭代过程粒子生成数
        * GENR(bool): 粒子生成开关, 用于在迭代过程(action)中生成新的粒子
        * DSTR(bool): 粒子销毁开关, 当容器中的粒子进入停机状态时，从容器中移除该粒子
        * _END(bool): 粒子系统停机状态
    @method:
        * init(): 对粒子系统进行初始化
        * build(): 生成新的粒子
        * action(): 描述粒子集群的行为模式
        * end(): 返回粒子系统的停机状态
    @exp: 
        let ptcs = new ParticleSystem().init();
    ----------------------------------------*/
    constructor() {
        //粒子容器
        this.ps = [];
        //最大粒子数
        this.max_pn = Infinity;
        //迭代过程粒子生成数
        this.gen_pn = 1;
        //粒子生成开关
        this.GENR = false;
        //粒子销毁开关
        this.DSTR = true;
        //粒子系统停机标记
        this._END = false;
    }

    /*----------------------------------------
    @func: 初始化
    @desc: 对粒子系统进行初始化
    @return(this) 
    ----------------------------------------*/
    init() {
        this.ps = [];
        return this;
    }

    /*----------------------------------------
    @func: 构建器
    @desc: 生成新的粒子，并添加到容器中
    @warning: 在重新该方法时，需要注意尽量不添加形参，这是由于当
    this.GENR = true 时，会在action调用 this.build() 来构建新粒子
    ----------------------------------------*/
    build() {
        if(this.ps.length < this.max_pn) {
            //this.ps.push(new Particle());
        }
    }

    /*----------------------------------------
    @func: 行为模式(迭代过程)
    @desc: 描述粒子集群的行为模式
    ----------------------------------------*/
    action() {
        let _ps = [], _END = true;
        for(let i=0, n=this.ps.length; i<n; i++) {
            //判断粒子的停机状态
            let isEND = this.ps[i].end(); _END = isEND && _END;
            if(!isEND) {
                //调用粒子的行为模式方法
                this.ps[i].action(); _ps.push(this.ps[i]);
            } else {
                //根据"粒子销毁开关"判断是否销毁停机粒子
                (this.DSTR == false) && _ps.push(this.ps[i]);
            }
        }
        //更新粒子容器和停机状态标记
        this.ps = _ps; this._END = _END;
        //生成新的粒子
        if(this.GENR) {
            for(let i=0, n=this.gen_pn; i<n; i++) {
                this.build();
            }
        }
    }

    /*----------------------------------------
    @func: 停机状态
    @desc: 返回粒子系统的停机状态
    ----------------------------------------*/
    end() {
        return this._END;
    }
}


//力粒子
class ForceParticle extends Particle {

    /*----------------------------------------
    @func: 可受力粒子
    @property: 
        * ps(Vector): 起始位置
        * pe(Vector): 终止位置
        * v_rate(number): 速率(this.v.norm())
    ----------------------------------------*/
    constructor(position, velocity, acceleration, mass) {
        super();
        //位置矢量
        this.p = position || new Vector(0, 0);
        //速度矢量
        this.v = velocity || new Vector(0, 0);
        //加速度
        this.acc = acceleration || new Vector(0, 0);
        //质量
        this.mass = mass || 1;
    }

    /*----------------------------------------
    @func: 受力(积累效应)
    @desc: 通过受力来改变粒子的加速度
    @params: 
        * f(Vector): 作用力
    ----------------------------------------*/
    force(f) {
        this.acc.add(f.clone().mult(1/this.mass));
    }

    action() {
        this.p.add(this.v.add(this.acc));
        this.acc = new Vector(0, 0);
        return this.p;
    }
}


//线性运动粒子
class LinearMotorParticle extends Particle {

    /*----------------------------------------
    @func: 线性运动
    @desc: 描述直线运动模式的粒子
    @property: 
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
        this.v = Vector.sub(this._pe, this._ps).norm(Math.abs(v_rate));
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
        return this.p;
    }
}


//环形运动系统
class CircularMotorParticle extends Particle {

    /*----------------------------------------
    @func: 环形运动
    @desc: 描述圆形运动模式的粒子
    @property: 
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
    constructor(ps, rvs) {
        super();
        //初始位置
        this.p = ps;
        //随机速度向量集
        this._rvs = this._probability(rvs);
    }

    //计算概率(基于权重): p[i] = wt[i] / sum(wt)
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

    //随机选择速度
    rv_select() {
        let r = Math.random();
        for(let i=0, end=this._rvs.length; i<end; i++) {
            if(r > this._rvs[i].ps && r <= this._rvs[i].pe) {
                return this._rvs[i].v;
            }
        }
    }

    //运动模式
    action() {
        //选择随机速度
        this.v = this.rv_select();
        return this.p.add(this.v);
    }
}



module.exports.Particle = Particle;
module.exports.ParticleSystem = ParticleSystem;
module.exports.ForceParticle = ForceParticle;
module.exports.LinearMotorParticle = LinearMotorParticle;
module.exports.CircularMotorParticle = CircularMotorParticle;
module.exports.RandomWalkerParticle = RandomWalkerParticle;