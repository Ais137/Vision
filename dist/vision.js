(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.vision = {}));
})(this, (function (exports) { 'use strict';

    /****************************************
     * Name: Vector | 向量系统
     * Date: 2022-06-20
     * Author: Ais
     * Project: Vision
     * Desc: Vision框架核心组件
     * Version: 0.1
     * Update:
        * (2023-01-30, Ais): 暴露 this._v 属性，提高计算性能。
    ****************************************/


    let Vector$1 = class Vector {

        /*----------------------------------------
        @func: Vector构建器
        @desc: 通过函数参数作为向量分量构建向量，默认构建(0, 0)的二维向量
        @return(Vector): obj(Vector)
        @exp: 
            let v = new Vector(1, 2, 3) -> v(1, 2, 3)
        ----------------------------------------*/
        constructor(...v) {
            //向量分量
            this.v = v.length > 0 ? [...v] : [0, 0];
        }

        //static builder
        static V(...v) {
            return new Vector(...v);
        }
        static v(...v) {
            return new Vector(...v);
        }

        //builder -> v(1, 1, 1, ...)
        static ones(dim=2) {
            return new Vector(...Array(dim).fill(1))
        }

        //builder -> v(0, 0, 0, ...)
        static zeros(dim=2) {
            return new Vector(...Array(dim).fill(0))
        }

        /*----------------------------------------
        @func: builder -> 生成随机向量
        @desc: 生成指定范围内的随机向量
        @params: 
            * range(list): 向量分量范围, 其长度决定了向量的维度
            * isint(false): 分量值类型 true(int) | false(float)
        @return(Vector): Vector(obj)
        @exp: 
            Vector.random([[1, 3], [1, 3]]) -> v(1.13, 2.54)
            Vector.random([[1, 3], [1, 3]], true) -> v(1, 2)
            Vector.random([[1, 3], [1, 3], [4, 7]]) -> v(2.13, 0.54, 5.56)
        ----------------------------------------*/
        static random(range=[], isint=false) {
            let v = [], r = 0;
            for(let i=0, end=range.length; i<end; i++){
                r = Math.random() * (range[i][1] - range[i][0]) + range[i][0];
                isint ? v.push(parseInt(r)) : v.push(r);
            }
            return new Vector(...v);
        }

        /*----------------------------------------
        @func: builder -> 生成随机二维向量
        @desc: 生成一个圆范围内的随机向量
        @params: 
            * sR/eR(number:>0): 向量模长范围
        @return(Vector)
        @exp: 
            Vector.rcv(300) -> 向量模长为300, 方向随机
            Vector.rcv(100, 300) -> 向量模长范围为(100, 300), 方向随机
        ----------------------------------------*/
        static rcv(sR, eR=null) {
            let rad = Math.random() * (Math.PI * 2);
            let r = (eR == null ? Math.random()*sR : Math.random()*(eR-sR)+sR);
            return new Vector(Math.cos(rad)*r, Math.sin(rad)*r);
        }

        //分量接口
        get x(){ return this.v[0]; }
        get y(){ return this.v[1]; }
        get z(){ return this.v[2]; }
        set x(val){ this.v[0] = val; }
        set y(val){ this.v[1] = val; }
        set z(val){ this.v[2] = val; }

        /*----------------------------------------
        @func: 加法
        @desc: 向量的对应分量相加
        @params: 
            * vector(Vector): 操作数
        @return(Vector): this
        @exp: 
            1. 维数相同的情况
            let v1 = new Vector(1, 2, 3);
            let v2 = new Vector(4, 5, 6);
            v1.add(v2) -> v(5, 7, 9) -> v1
            2. 维数不同的情况
            let v1 = new Vector(1, 2, 3);
            * v1.add(new Vector(1, 2, 3, 4, 5)) -> v(2, 4, 6) -> v1
            * v1.add(new Vector(1, 2)) -> v(2, 4, 3) -> v1
        ----------------------------------------*/
        add(vector){
            let v = vector.v;
            for(let i=0, end=this.v.length; i<end; i++) {
                this.v[i] += (v[i] || 0);
            }
            return this;
        }
        static add(...vector) {
            let v = Vector.zeros(vector[0].dim());
            for(let i=0, end=vector.length; i<end; i++) {
                v.dim()<vector[i].dim() && v.dim(vector[i].dim());
                v.add(vector[i]);
            }
            return v;
        }

        /*----------------------------------------
        @func: 标量乘法
        @desc: 数k乘以向量的每个分量
        @params: 
            * k(int/float): 操作数
        @return(Vector): this 
        @exp: 
            let v1 = new Vector(1, 2, 3);
            v1.mult(2) -> v(2, 4, 6) -> v1
        ----------------------------------------*/
        mult(k) {
            for(let i=0, end=this.v.length; i<end; i++) {
                this.v[i] *= k;
            }
            return this;
        }
        static mult(vector, k) {
            return vector.clone().mult(k);
        }

        /*----------------------------------------
        @func: 减法
        @desc: 加法的一种特殊情况
        @params: 
            * vector(Vector): 操作数
        @return(Vector): this 
        ----------------------------------------*/
        sub(vector){
            //向量方法实现
            // return this.add(vector.clone().mult(-1));
            //计算优化实现
            let v = vector.v;
            for(let i=0, end=this.v.length; i<end; i++) {
                this.v[i] -= (v[i] || 0);
            }
            return this;
        }
        static sub(...vector) {
            let v = vector[0].clone();
            for(let i=1, end=vector.length; i<end; i++) {
                v.sub(vector[i]);
            }
            return v;
        }

        /*----------------------------------------
        @func: dot product | 标量积(点积)
        @desc: v1·v2 -> sum(v1[i]*v2[i]) -> |v1|*|v2|*cos(rad)
        @params: 
            * vector(Vector): 操作数
        @return(float)
        ----------------------------------------*/
        dot(vector) {
            let t = 0, v = vector.v;
            for(let i=0, end=this.v.length; i<end; i++) {
                t += this.v[i] * (v[i] || 0);
            }
            return t;
        }
        inner(vector) {
            return this.dot(vector);
        }

        /*----------------------------------------
        @func: Linear Combination | 线性组合
        @desc: lc = v1*w[1] + v2*w[2] + ... + vn*w[n]
        @params: 
            * vectors(list:Vector): 向量组
            * w(list:number): 权
        @condition: vectors[i].dim() == w.length
        @return(Vector)
        @ exp:
            LC([
                new Vector(1, 1),
                new Vector(2, 2),
                new Vector(3, 3),
            ], [6, 3, 2]) -> Vector(18, 18)
        ----------------------------------------*/
        static LC(vectors, w) {
            let v = Vector.zeros(vectors[0].dim());
            for(let i=0, n=vectors.length; i<n; i++) {
                v.add(vectors[i].clone().mult(w[i]));
            }
            return v;
        }

        /*----------------------------------------
        @func: Linear Mapping | 线性映射
        @desc: 对向量进行线性变换，有以下两种实现方式
            * 行向量: 设 vi 为 m[i] 构成的行向量,
            则 LM(m) -> o.add(v.dot(vi)), 即 v 与 vi 的点积之和
            * 列向量: 设 vk 为 m[i][k=(1, 2, 3...)] 的列向量
            则 LM(m) -> LC(vk, v), 即以 v 的分量为权，对m的列向量的线性组合
        @params: 
            * m(list:list): 矩阵(数组形式)
        @return(Vector)
        ----------------------------------------*/
        LM(m) {
            let _v = [];
            for(let i=0, endi=m.length; i<endi; i++) {
                //[Vector]: _v.push(this.dot(new Vector(...m[i])));
                let _vi = 0;
                for(let k=0, endk=m[i].length; k<endk; k++) {
                    _vi += m[i][k] * (this.v[k] || 0);
                }
                _v.push(_vi);
            }
            this.v = _v;
            return this;
        }
        static LM(vector, m) {
            return vector.clone().map(m);
        }

        /*----------------------------------------
        @func: 线性插值
        @desc: v(t) = (1-t)*v1 + t*v2 -> v1 + t*(v2-v1)
        @params: 
            * vector(Vector): 目标向量
            * t(float): 0<=t<=1 
        @return(Vector)
        ----------------------------------------*/
        lerp(vector, t) {
            return (t>0 && t<1) ? vector.clone().sub(this).mult(t).add(this) : (t<=0 ? this.clone() : vector.clone());
        }
        static lerp(v_from, v_to, t) {
            return v_from.lerp(v_to, t);
        }

        /*----------------------------------------
        @func: 二维向量的旋转变换
        @desc: 对向量(dim=2)进行旋转(线性变换)
        @params: 
            * rad(number): 旋转角度
            * angle(bool): rad参数格式 -> true(弧度) | false(角度)
        @return(Vector)
        @exp:
            * v.rotate(Math.PI/4)
            * v.rotate(45, true)
        ----------------------------------------*/
        rotate(rad, angle=false) {
            /* 
            [Vector]:
            this.v = this.LM([
                [Math.cos(rad), -Math.sin(rad)],
                [Math.sin(rad), Math.cos(rad)],
            ])
            */
            rad = angle ? (Math.PI/180*rad) : rad;
            let cos_rad = Math.cos(rad), sin_rad = Math.sin(rad);
            let x = this.v[0] * cos_rad - this.v[1] * sin_rad;
            let y = this.v[0] * sin_rad + this.v[1] * cos_rad;
            this.v[0] = x, this.v[1] = y;
            return this;
        }
        static rotate(vector, rad) {
            return vector.clone().rotate(rad);
        }

        /*----------------------------------------
        @func: 维度(分量数)(get/set)
        @desc: get/set
        @params: 
            * n(int): 新的维度
        @return(int): 向量的维度(分量数)
            * v.dim() -> int
            * v.dim(3) -> this
        @exp:
            let v = new Vector([1, 1, 2, 7])
            v.dim() -> 4
            v.dim(3) -> v(1, 1, 2) -> v
            v.dim(5) -> v(1, 1, 2, 7, 0) -> v
        ----------------------------------------*/
        dim(n=null) {
            if(n!=null) {
                let v = [], _n = parseInt(n);
                for(let i=0; i<_n; i++) {
                    v[i] = this.v[i] || 0;
                }
                this.v = v;
                return this;
            } else {
                return this.v.length;
            }
        }

        /*----------------------------------------
        @func: 模(get/set)
        @desc: 向量的模长
        @params: 
            * n(int/float): 设置的模长
        @return(float): 向量的模长
            * v.norm() -> float
            * v.norm(3) -> this
        ----------------------------------------*/
        norm(n=null) {
            //计算模长
            let t = 0;
            for(let i=0, end=this.v.length; i<end; i++) {
                t += this.v[i] * this.v[i];
            }
            let v_norm = Math.sqrt(t);
            //设置模长
            (n!=null) && (v_norm != 0) && this.mult(n/v_norm);
            return (n==null) ? v_norm : this;
        }

        //单位化
        normalization() {
            let _norm = this.norm();
            (_norm != 0) && this.mult(1/_norm);
            return this;
        }

        /*----------------------------------------
        @func: 限制器
        @desc: 限制向量的模长, 当模长超过边界值的时候，设置模长为邻近的边界值
        @params: 
            * max(int/float): 最大值边界
            * min(int/float): 最小值边界
        @return(Vector): this
        @exp:
            v.limit(5) -> (0 < v.norm() <5)
            v.limit(2, 5) -> (2 < v.norm() <=5)
        ----------------------------------------*/
        limit(max, min=null) {
            let _max, _min, _norm = this.norm();
            if(min == null){_min=0, _max=Math.abs(max);} else {_min=Math.abs(max), _max=Math.abs(min);}
            (_norm>=_min && _norm<=_max) ? null : this.norm(_norm>_max ? _max : _min);
            return this;
        }

        /*----------------------------------------
        @func: 克隆/复制
        @desc: 复制向量
        @return(Vector)
        ----------------------------------------*/
        clone() {
            return new Vector(...this.v);
        }
        copy() {
            return this.clone();
        }

        /*----------------------------------------
        @func: 计算欧式距离
        @desc: 计算两个向量之间的欧式距离(坐标视角)
        @params: 
            * vector(Vector): 目标向量
        @return(float): 距离
        @exp: 
            v1.dist(v2) -> v1与v2的距离
            v1.dist() -> v1到原点的距离(v.norm())
        ----------------------------------------*/
        dist(vector=null) {
            //向量法实现
            // return this.clone().sub(vector).norm();
            //计算优化
            if(vector == null) {
                return this.norm();
            } else {
                let t = 0, v = vector.v;
                for(let i=0, end=this.v.length; i<end; i++) {
                    t += (this.v[i] - v[i]) * (this.v[i] - v[i]);
                }
                return Math.sqrt(t);
            }
        }
        static dist(v1, v2) {
            return v1.dist(v2);
        }

        /*----------------------------------------
        @func: 计算弧度(dim()==2)
        @desc: 计算两个向量之间的弧度差(极坐标视角)
        @params: 
            * vector(Vector): 目标向量
        @return(float): 弧度差
        @exp: 
            v1.rad(v2) -> v1与v2的弧度差
            v1.rad() -> v1与x轴正方向的弧度差
        ----------------------------------------*/
        rad(vector=null) {
            let x = this.v[0], y = this.v[1];
            let rad = Math.atan(y/x);
            rad = (x>=0) ? (y >= 0 ? rad : Math.PI*2 + rad) : (Math.PI + rad);
            return  vector ? rad - vector.rad() : rad;
        }
        static rad(v1, v2) {
            return v1.rad(v2);
        }

        /*----------------------------------------
        @func: 整数化
        @desc: 将分量转换成整数
        ----------------------------------------*/
        toint() {
            for(let i=0, end=this.v.length; i<end; i++) { this.v[i] = parseInt(this.v[i]);}
        }

        /*----------------------------------------
        @func: 向量分量范围判断
        @desc: 判断向量的分量是否在指定范围
        @params: 
            * range(list): 分量范围
        @return(bool): 判定结果 
        @exp: 
            new Vector(1, 2).in([[1, 5], [1, 5]]) -> true
            new Vector(1, 2).in([[1, 5], [0, 1]]) -> false
        ----------------------------------------*/
        in(range=[]) {
            for(let i=0, end=range.length; i<end; i++) {
                if(!(this.v[i] >= range[i][0] && this.v[i] <= range[i][1])) {
                    return false;
                }
            }
            return true;
        }
        static in(vector, range) {
            return vector.in(range);
        }

        /*----------------------------------------
        @func: 从坐标数组中构建向量
        @desc: [[x1, y1], [x2, y2], ..., [xn, yn]] -> [v1, v2, ..., vn]
        @params: 
            * ps(list:list): 坐标点的数组形式
        @return(list:Vector): 坐标点的向量形式 
        @exp: 
            Vector.vpoints([[100, 100], [200, 200]]) -> [Vector(100, 100), Vector(200, 200)]
        ----------------------------------------*/
        static vpoints(ps) {
            let vps = [];
            for(let i=0, n=ps.length; i<n; i++) {
                vps.push(new Vector(...ps[i]));
            }
            return vps;
        }

    };

    var vector = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Vector: Vector$1
    });

    /****************************************
     * Name: 粒子系统/运动系统
     * Date: 2022-07-10
     * Author: Ais
     * Project: Vision
     * Desc: 基于向量模拟抽象粒子的运动
     * Version: 0.1
     * Update:
        * (2023-03-06, Ais): ParticleSystem(粒子系统)结构优化 
    ****************************************/


    //粒子(基类)
    class Particle {

        /*----------------------------------------
        @class: Particle | 粒子
        @desc: 基于向量模拟抽象粒子的运动
        @property: 
            * position(Vector): 位置矢量
            * velocity(Vector): 速度矢量
        @method:
            * action: 描述粒子运动模式
            * isEnd: 粒子停机状态
        @exp: 
            let p = new Particle(new Vector(100, 100), new Vector(2, 3));
        ----------------------------------------*/
        constructor(position, velocity) {
            //位置矢量
            this.p = position || new Vector$1(0, 0);
            //速度矢量
            this.v = velocity || new Vector$1(0, 0);
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
        @return(bool)
        ----------------------------------------*/
        isEnd() {
            return false;
        }
    }


    //作用力粒子
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
            this.p = position || new Vector$1(0, 0);
            //速度矢量
            this.v = velocity || new Vector$1(0, 0);
            //加速度
            this.acc = acceleration || new Vector$1(0, 0);
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
            this.acc = new Vector$1(0, 0);
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
            this.v = Vector$1.sub(this._pe, this._ps).norm(Math.abs(v_rate));
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
            this.v = Vector$1.sub(this._pe, this.p).norm(this.v.norm());
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
        set v_count(val) { this.v.norm(Vector$1.dist(this._pe, this._ps) / val); }

        /*----------------------------------------
        @func: 停机状态
        @desc: 描述粒子在什么条件下停机(停止运动)
        @return(bool): 状态
        ----------------------------------------*/
        isEnd() {
            return this.p.dist(this._pe) <= this.v.norm() * this.end_dist_rate;
        }

        //运动模式
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
            this.o = o || new Vector$1(0, 0);
            //旋转半径
            this.r = r || 1;
            //速率
            this.v_rad = v_rad || (Math.PI/180);
            //当前弧度(-2*PI, 2*PI)
            this.rad = rad;
            //当前坐标(以this.o为原点)
            this.po = new Vector$1(this.r*Math.sin(this.rad), this.r*Math.cos(this.rad));
            //当前坐标(以(0, 0)为原点)
            this.p = Vector$1.add(this.po, this.o);
        }

        //运动模式
        action() {
            this._p = this.p.clone();
            this.rad += this.v_rad;
            if(this.rad >= 2 * Math.PI) { this.rad -= 2 * Math.PI; } 
            if(this.rad <= -2 * Math.PI) { this.rad += 2 * Math.PI; } 
            this.po.x = this.r * Math.sin(this.rad);
            this.po.y = this.r * Math.cos(this.rad);
            this.p = Vector$1.add(this.po, this.o);
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
                    "v": rvs[i][0] || new Vector$1(0, 0),
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

    /****************************************
     * Name: 鸟群算法(boids: bird-oid object)
     * Date: 2023-03-19
     * Author: Ais
     * Project: Vision
     * Desc: 集群行为模拟
     * Version: 0.1
     * Update: 
    ****************************************/


    //鸟群个体(基准模型:M0)
    class Boid extends Particle {

        //基础规则集
        static RuleSet = {
            /*----------------------------------------
            @func: 对齐行为
            @desc: 个体的速度倾向于与感知野中其他个体的速度保持一致
            ----------------------------------------*/
            alignment: (tp, ns) => {
                let v_ali = new Vector$1(0, 0);
                for(let i=0, n=ns.length; i<n; i++) { 
                    v_ali.add(ns[i].v); 
                }
                return v_ali.mult(1/ns.length);
            },
            /*----------------------------------------
            @func: 分离行为
            @desc: 个体有远离周围个体的趋势，防止相互碰撞
            ----------------------------------------*/
            separation: (tp, ns) => {
                let v_sep = new Vector$1(0, 0);
                for(let i=0, n=ns.length; i<n; i++) { 
                    let r = tp.p.dist(ns[i].p);
                    v_sep.add(Vector$1.sub(tp.p, ns[i].p).norm(1/r*r)); 
                }
                return v_sep;
            },
            /*----------------------------------------
            @func: 靠近行为
            @desc: 个体有向感知野中其他个体中心位置的移动趋势
            ----------------------------------------*/
            cohesion: (tp, ns) => {
                //计算视野范围内对象的中心位置
                let center = new Vector$1(0, 0);
                for(let i=0, n=ns.length; i<n; i++) { 
                    center.add(ns[i].p); 
                }
                center.mult(1/ns.length);
                return Vector$1.sub(center, tp.p);
            }
        }

        /*----------------------------------------
        @class: Boid
        @desc: 鸟群个体(基准模型)，集群行为模拟
        @property: 
            * R(number): 感知(视野)范围
            * K(list:number): 种群特征值(权重数组)，用于与规则集产生的向量进行线性组合。
            * visual_field(callable): 视野场，用于定义个体的感知野，默认采用半径R的环形视野。
            * rules(list:callable): 集群行为规则集 
        @method: 
            * rules_action: 对个体进行规则集的作用，在 action 之前调用。
            * action: 行为迭代
        @exp: 
        ----------------------------------------*/
        constructor(p, v, R, K) {
            super(p, v);
            //感知(视野)范围
            this.R = R;
            //种群特征值
            this.K = K;
            //视野场(hook point)
            this.visual_field = (tp, ns) => { return ns };
            //集群行为规则集
            this.rules = [
                Boid.RuleSet.alignment,
                Boid.RuleSet.separation,
                Boid.RuleSet.cohesion
            ];
            //速度增量
            this.acc = new Vector$1(0, 0);
        }

        /*----------------------------------------
        @func: 规则集作用
        @desc: 对个体进行规则集的作用，在 action 之前调用。
        @params: 
            * ns(list:Boid): 个体感知野范围内的邻近集
        ----------------------------------------*/
        rules_action(ns) {
            if(ns.length == 0) { return }
            ns = this.visual_field(this, ns);
            let rule_vectors = [];
            for(let i=0, n=this.rules.length; i<n; i++) {
                rule_vectors[i] = this.rules[i](this, ns);
            }
            this.acc.add(Vector$1.LC(rule_vectors, this.K));
        }

        //行为迭代
        action() {
            this.p.add(this.v.add(this.acc));
            this.acc = new Vector$1(0, 0);
            return this.p;
        }
    }


    /*----------------------------------------
    @func: 鸟群模型规则集作用中间件
    @desc: 作为粒子系统(ParticleSystem)的action中间件，用于 Boid.rules_action 的调用。
    @params: 
        * nns(NNS.NearestNeighborSearch): 邻近搜索算法模块
    @return(type): boids_rules_middleware(callable), ParticleSystem action 中间件
    @exp: 
        pcs.action_middlewares.before.push(
            boids_middlewares(
                new vision.NNS.GridNNS([], function(obj){ return obj.p }, 100)
            )
        );
    ----------------------------------------*/
    const boids_middlewares = function(nns) {
        //鸟群集群运动
        return function boids_rules_middleware(ps) {
            nns.build(ps);
            for (let i = ps.length; i--;) {
                ps[i].rules_action(nns.near(ps[i], ps[i].R));
            }
        }
    };

    var Boids = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Boid: Boid,
        boids_middlewares: boids_middlewares
    });

    /****************************************
     * Name: L-System | L系统
     * Date: 2022-09-11
     * Author: Ais
     * Project: 
     * Desc: 一种并行重写系统和一种形式语法
     * Version: 0.1
    ****************************************/

    //L系统
    class LSystem {

        /*----------------------------------------
        @class: L系统
        @desc: 
            G = (S, V, P)
        @property: 
            * S(str): 系统起始状态(公理)
            * V(list:str): 符号表(终结符号&非终结符)
            * P(obj|map): 生成式
            * ops(obj|map): 符号->行为映射表
        @method: 
            * method: func
        @exp: 
            ls = new LSystem({
                "S": "A",
                "V": ["A", "B", "[", "]"],
                "P": {
                    "A": "B[A]A",
                    "B": "BB"
                },
                "ops": {
                    "A": (st) => {
                        canvas.line(st.p.clone(), st.p.add(st.v));
                    },
                    "B": (st) => {
                        canvas.line(st.p.clone(), st.p.add(st.v));
                    },
                    "[": (st) => {
                        st.stack.unshift([st.p.clone(), st.v.clone()]);
                        st.v.rotate(st.rad);
                    },
                    "]": (st) => {
                        let status = st.stack.shift();
                        st.p = status[0], st.v = status[1];
                        st.v.rotate(-st.rad);
                    }
                }
            });
        ----------------------------------------*/
        constructor({S="", V=[], P={}, ops={}} = {}) {
            //系统起始状态(公理)
            this.S = S;
            //符号表(终结符号&非终结符)
            this.V = V;
            //生成式
            this.P = P;
            //符号->行为映射表
            this.ops = ops;
        }

        /*----------------------------------------
        @func: 迭代
        @desc: 根据生成式生成下一代语句
        @params: 
            * s(str): 语句
        @return(str) 
        ----------------------------------------*/
        next(s=this.S) {
            let _s = "";
            for(let i=0, n=s.length; i<n; i++) {
                _s += (s[i] in this.P ? this.P[s[i]] : s[i]);
            }
            return _s;
        } 

        /*----------------------------------------
        @func: 推导(重复迭代)
        @desc: 根据生成式从公理出发推导到第n代语句
        @params: 
            * n(int:>=0): 迭代代数
        @return(str): 语句
        ----------------------------------------*/
        gen(n=0) {
            let s = this.S;
            for(let i=0; i<n; i++) {
                s = this.next(s);
            }
            return s;
        }

        /*----------------------------------------
        @func: 推导(迭代器)
        @desc: 以迭代器的形式进行推导，用于输出中间代语句
        @params: 
            * n(int:>=0): 迭代代数
        @return(iterator): 迭代器
        @exp: 
            it = ls.iter(5);
            it.next().value;
        ----------------------------------------*/
        *iter(n=0) {
            let s = this.S;
            for(let i=0; i<n; i++) {
                s = this.next(s);
                yield s;
            }
        }

        /*----------------------------------------
        @func: 绘制/行动
        @desc: 根据语句和ops进行绘制
        @params: 
            * s(str): 语句
            * status(obj): 状态表
        @return(status): 状态表
        @exp: 
            ls.act(ls.gen(5), {
                "p": new Vector(canvas.cx, canvas.height),
                "v": new Vector(0, -10),
                "rad": Tools.ATR(45),
                "stack": []
            })
        ----------------------------------------*/
        act(s, status) {
            for(let i=0, n=s.length; i<n; i++) {
                (s[i] in this.ops) && this.ops[s[i]](status);
            }
            return status;
        }

        /*----------------------------------------
        @func: 绘制/行动(迭代器模式)
        @exp: 
            act_it = ls.act(ls.gen(3), {
                "p": new Vector(canvas.cx, canvas.height),
                "v": new Vector(0, -1),
                "rad": Tools.ATR(25),
                "stack": []
            });
            act_it.next();
        ----------------------------------------*/
        *actIter(s, status) {
            for(let i=0, n=s.length; i<n; i++) {
                yield (s[i] in this.ops) && this.ops[s[i]](status);
            }
        }

    }

    /****************************************
     * Name: 曼德勃罗特集
     * Date: 2022-12-06
     * Author: Ais
     * Project: 
     * Desc: 
     * Version: 0.1
    ****************************************/

    //复数
    class Complex {

        /*----------------------------------------
        @class: 复数
        @desc: 实现复数计算
        @property: 
            * r(number): 实部
            * i(number): 虚部
        @method: 
            * add: 加法
            * mult: 乘法
            * norm: 求模
        @exp: 
            let c = new Complex(1, 1);
        ----------------------------------------*/
        constructor(r, i) {
            //实部
            this.r = r;
            //虚部
            this.i = i;
        }

        /*----------------------------------------
        @func: 复数加法
        ----------------------------------------*/
        add(complex) {
            this.r += complex.r;
            this.i += complex.i;
            return this;
        }

        /*----------------------------------------
        @func: 复数乘法
        @desc: (a+bi)(c+di)=(ac-bd)+(bc+ad)i
        ----------------------------------------*/
        mult(complex) {
            let a = this.r, b = this.i, c = complex.r, d = complex.i;
            this.r = a * c - b * d;
            this.i = b * c + a * d;
            return this;
        }

        /*----------------------------------------
        @func: 求模长
        ----------------------------------------*/
        norm() {
            return Math.sqrt(this.r * this.r + this.i * this.i);
        }

    }


    /*----------------------------------------
    @func: 曼德勃罗特集: Z(n+1) = Z(n) ^ 2 + C
    @desc: 判断给定参数(C)经过有限次迭代是否收敛
    @params: 
        * C(Complex): 复数参数
        * n(int>0): 迭代次数
    @return(type): [是否属于该集合, 迭代次数]
    @exp: 
        Mandelbrot_Set(new Complex(0, 0)) -> [true, n]
    ----------------------------------------*/
    const Mandelbrot_Set = function(C, n=500) {
        let z = new Complex(0, 0);
        for(let i=0; i<=n; i++) {
            z = z.mult(z).add(C);
            if(z.norm() > 2) {
                return [false, i];
            }
        }
        return [true, n]
    };


    /*----------------------------------------
    @func: 朱利亚集: Z(n+1) = Z(n) ^ 2 + C
    @desc: 固定参数C, 判断Z0是否在有限次迭代后收敛
    @params: 
        * Z0(Complex): 初始迭代参数
        * C(Complex): 固定复数参数
        * n(int>0): 迭代次数
    @return(type): [是否属于该集合, 迭代次数]
    @exp: 
        Julia_Set(new Complex(0, 0), new Complex(-0.8, 0.156)) -> [true, n]
    ----------------------------------------*/
    const Julia_Set = function(Z0, C, n=500) {
        let z = Z0;
        for(let i=0; i<=n; i++) {
            z = z.mult(z).add(C);
            if(z.norm() > 2) {
                return [false, i];
            }
        }
        return [true, n]
    };

    /****************************************
     * Name: Nearest Neighbor Search | 邻近搜索算法
     * Date: 2023-01-30
     * Author: Ais
     * Project: Vision
     * Desc: 在向量集中搜索给定目标向量的邻近集
     * Version: 0.1
    ****************************************/


    //邻近搜索算法(基类)
    class NearestNeighborSearch {

        /*----------------------------------------
        @class: NearestNeighborSearch 
        @desc: 邻近搜索算法模块，用于在向量集中搜索给定目标向量的邻近元素集
        @property: 
            * ps(list:obj): 对象集，算法基于该属性进行数据结构的构建与邻近集的计算
            * vect(callable): 向量提取器(可调用对象), 用于从对象中提取向量作为算法处理单元
            * IS_LOOP_BORDER(bool): 循环边界标记, 用于标记算法是否在循环边界下进行计算
        @method: 
            * build: 构建算法的数据结构
            * near: 根据距离(dist)计算目标对象(tp)的邻近集
            * k_near: 计算离给定目标对象(tp)最近的“k”个对象
            * nps: 根据对象集生成每个元素的邻近集
        @exp: 
            let NNS = new NearestNeighborSearch(ps, function(particle){return particle.p;});
        @question: 怎样让算法模块支持其他距离计算方式
            NNS(NearestNeighborSearch)算法模块通过 "vect" 属性从对象中提取出一个向量对象(Vector)
            作为算法的计算处理单元，默认情况下通过 "Vector.dist" 计算的是欧式距离，为了使算法模块支持
            其他的距离计算类型(比如曼哈顿距离)，可以从 "Vector" 类派生一个子类，并重写 "dist" 方法来实现。
        ----------------------------------------*/
        constructor(ps, vect) {
            /*----------------------------------------
            @func: 向量提取器
            @desc: 
                给定一个对象，从中提取出向量对象(Vector)作为算法的处理单元
                设计该属性的目的是为了提高模块可处理对象的适应性，并让算法的处理单元统一成向量对象。
            @params: 
                * obj(obj): 任意对象
            @return(Vector): 对象的某个向量属性
            @exp: 
                this.vect = function(particle_obj) { return particle_obj.p }
            ----------------------------------------*/
            this.vect = vect || function(obj) { return obj; };
            //对象集: 用于算法数据结构(状态)的构建
            this.ps = ps;
            //循环边界标记: 该标记为(true)时, 在有边界限制的情况下需要将边界当成循环边界进行处理
            this.IS_LOOP_BORDER = false;
        }

        /*----------------------------------------
        @func: 构建算法的数据结构
        @desc: 
            更新 this.ps 属性并基于对象集(ps)构建算法数据结构，主要用于使用数据结构(状态)进行邻近集计算的算法实现，
            当ps的状态发生变化时，通过该方法重新构建内部数据结构。
        @params: 
            * ps(list:obj): 对象集
        @return(this) 
        @exp: 
            let NNS = new NearestNeighborSearch(ps).build();
            let NNS = new NearestNeighborSearch().build(ps);
        ----------------------------------------*/
        build(ps=null) {
            this.ps = ps || this.ps;
            return this;
        }

        /*----------------------------------------
        @func: 生成距离(dist)邻近集
        @desc: 根据距离(dist)计算目标对象(tp)在对象集(ps)中的邻近集
        @params: 
            * tp(obj): 目标对象(与对象集(ps)中的元素类型一致，或者具有必要属性(从鸭子类型的观点来看))
            * dist(number:>=0): 算法的判定距离
        @return(list:obj): [ps[i], ps[k], ps[j], ...]
        @exp: 
            let ns = new NearestNeighborSearch(ps).near(tp, 100);
        ----------------------------------------*/
        near(tp, dist) {
            return [];
        }

        /*----------------------------------------
        @func: 生成"k"邻近集
        @desc: 给定目标对象(tp), 计算在对象集(ps)中, 离"tp"最近的"k"个元素
        @params: 
            * tp(obj): 目标对象
            * k(int:>0): k个最近的元素(k >= nps.length)
        @return(list:obj): [ps[i], ps[k], ps[j], ...]
        @exp: 
            let ns = new NearestNeighborSearch(ps).k_near(tp, 5);
        ----------------------------------------*/
        k_near(tp, k) {
            return [];
        }

        /*----------------------------------------
        @func: 计算对象集的邻近集
        @desc: 计算给定对象集中每个元素的邻近集
        @params: 
            * d(number): dist or k, 根据模式确定
            * mode(enum): "dist" || "k" 
        @return(list:obj): [{"tp": ps[i], "nps": [...]}, ...]
        @exp: 
            let ns = new NearestNeighborSearch(ps).nps(100);
            let ns = new NearestNeighborSearch(ps).nps(5, "k");
        @TODO: 计算结构优化
        ----------------------------------------*/
        nps(d, mode="dist") {
            //@ERR: 该方式将导致"this"的隐式绑定丢失, 从而导致目标方法(near || k_near)被调用时，无法引用 this.vect 属性。
            // let _near = (mode=="dist" ? this.near : this.k_near);
            let _near = (mode=="dist" ? this.near : this.k_near).bind(this);
            let np_set = [];
            for(let i=0, n=this.ps.length; i<n; i++) {
                let _nps = _near(this.ps[i], d);
                (_nps.length > 0) && np_set.push({"tp": this.ps[i], "nps": _nps});
            }
            return np_set;
        }

        /*----------------------------------------
        @func: 将邻近集转换成图结构
        @desc: 
        @params: 
            * nps(list: ns): 邻近集
        @return(type): 
        @exp: 
        ----------------------------------------*/
        static toGraph(nps) {
            return ;
        }
    }


    //线性邻近搜索
    class LinearNNS extends NearestNeighborSearch {

        /*----------------------------------------
        @class: LinearNNS 
        @desc: 线性邻近搜索，通过遍历对象集(ps)来计算目标对象(tp)的邻近集
        @algo:
            由于该算法结构简单，并且不要维护内部数据结构支撑算法计算(无状态)，因此适用于 ps 对象动态变化的场景，
            比如可以在 boids 算法中用来计算邻近视野中的对象。但是缺点也很明显，算法的计算量依赖于 ps 的规模，
            当 ps 规模过大时，算法效率会很低。
        @exp: 
            let LNNS = new LinearNNS(ps, function(particle){return particle.p;});
        ----------------------------------------*/
        constructor(ps, vect) {
            super(ps, vect);
        }

        /*----------------------------------------
        @func: dist邻近集
        ----------------------------------------*/
        near(tp, dist, ps=null) {
            ps = ps || this.ps;
            let tp_v = this.vect(tp), nps = [];
            for(let i=0, n=ps.length; i<n; i++) {
                (!(tp === ps[i]) && tp_v.dist(this.vect(ps[i])) <= dist) && nps.push(ps[i]);
            }
            return nps;
        }

        /*----------------------------------------
        @func: k邻近集
        ----------------------------------------*/
        k_near(tp, k, ps=null) {
            ps = ps || this.ps;
            let tp_v = this.vect(tp), dist_ps = [];
            for(let i=0, n=ps.length; i<n; i++) { 
                if(tp === ps[i]) { continue; }
                //计算当前元素与目标元素的距离
                let dist = tp_v.dist(this.vect(ps[i]));
                if(dist_ps.length == 0) {
                    dist_ps.push({"dist": dist, "p": ps[i]});
                    continue;
                }
                //当前元素距离小于邻近集中的最大距离(插入排序)
                if(dist < dist_ps[dist_ps.length-1].dist || dist_ps.length < k) {
                    for(let j=dist_ps.length-1; j>=0; j--) {
                        if(dist>=dist_ps[j].dist) {
                            dist_ps.splice(j+1, 0, {"dist": dist, "p": ps[i]});
                            break;
                        }
                        //邻近集中的最小距离
                        if(j==0) {
                            dist_ps.splice(0, 0, {"dist": dist, "p": ps[i]});
                        }
                    }
                    (dist_ps.length > k) && dist_ps.pop(); 
                }
            }
            //格式化
            let nps = [];
            for(let i=0; i<dist_ps.length; i++) {
                nps.push(dist_ps[i].p);
            }
            return nps;
        }

    }


    //网格邻近搜索
    class GridNNS extends LinearNNS {

        /*----------------------------------------
        @class: GridNNS 
        @desc: 网格邻近搜索，基于 LinearNNS 算法进行优化。
        @algo:
            算法的基本思路是将目标数据(ps)的向量空间划分成网格，网格中的单元格尺寸为"dn", 单元格维度取决于
            目标数据维度。通过将目标数据(ps)映射到网格空间中的位置矢量，来存储目标数据对象。在这种映射下，
            位置间距小于单元格对角线长度(最大距离)的对象会存储在相同的单元格(或邻近的单元格)，在进行邻近搜索时，
            将目标对象(tp)映射到网格空间坐标，并直接读取该单元格(或半径R内邻近单元格)中存储的对象。得到一个近似邻近集，
            再对这个近似解进行精确搜索。以减少 LinearNNS 算法中的无效计算。
            GridNNS 算法有以下特征:
                * "dn" 参数对算法的影响: 
                    "dn"参数越小，算法所需的存储空间越大，"dn"参数越大，算法的计算量越接近 LinearNNS 算法。
                    当 dn 大于等于目标数据边界大小的情况下，退化成 LinearNNS 算法。
                * 动态数据: 
                    相对于 LinearNNS 算法，该算法是一个具有内部状态的算法，因此在 "ps" 变动的场景下，需要通过 "build" 方法更新内部状态。
                * 有限空间: 
                    该算法适用于数据集聚集在一个有限空间下，当数据集中离散点过多，会导致更多的存储空间开销。
                * 数据集分量范围限制:
                    对于数据集的 dsr(数据集分量范围) 不能为负数，因为在将数据的向量坐标映射到存储容器索引时，存储容器的索引范围是 [0, N+)，因此数据集中的
                    向量分量不能为负数。但是可以通过对数据集进行整体平移来解决该限制。这是由于在采用欧式距离计算的情况下，该邻近搜索算法具有"平移不变性"，
                    即对数据集整体平移一个向量(v)，给定目标向量(同时进行平移操作)的邻近集不变。
                * 边界条件: 
                    当目标数据在 dsr(数据集分量范围) 外时，算法需要对该情况进行特殊处理。 
        @property:
            * dn(int|>0): 网格单元大小
            * dsr(list:[min, max]): 数据集分量范围，其长度等于数据集向量维度。每个单元代表数据集对应的分量范围。
            * dst(Vector): 数据集非负平移量，用于解决"数据集分量范围限制"，基于 dsr 构建。在存储数据到 grid 容器时，需要对目标数据进行平移操作。
            * size(arr:number|>0): 要划分成网格的原始空间尺寸。
            * grid(GridNNS.GridContainer): 网格数据存储容器，为算法提供数据结构支撑。
        @method:
            * GridContainer(static): 网格数据存储容器构造器
        @exp: 
            let GNNS = new GridNNS(ps, function(particle){return particle.p;}, 150).build();
            let GNNS = new GridNNS(ps, function(particle){return particle.p;}, 150, [0, canvas.width, 0, canvas.height]).build();
        ----------------------------------------*/
        constructor(ps, vect, dn=100, dsr=null) {
            super(ps, vect);
            //网格单元大小
            this.dn = dn;
            //数据集分量范围
            this.dsr = dsr;
            //数据集非负平移量
            this.dst = null;
            //网格容器尺寸(像素坐标)
            this.size = null;
            //网格数据存储容器(算法数据结构)
            // this.grid = GridNNS.GridContainer(this.dn, this.size);
            this.grid = null;
        }

        //网格数据存储容器构造器
        static GridContainer(dn, size) {

            //网格数据存储容器
            class GridContainer {

                /*----------------------------------------
                @class: GridContainer 
                @desc: 网格数据存储容器，为 "GridNNS" 算法提供数据结构支撑。
                @algo:
                    * 数据结构设计:
                    该数据容器通过一维数组(实际存储结构)来模拟高维数组(逻辑存储结构)。
                    内部采用一个映射算法(index), 将高维数组坐标映射到实际存储结构的一维数组索引。
                    之所以采用"坐标映射索引"而不是"数组下标索引"的原因在于，"数组下标索引"无法适配
                    高维数据的场景，对于二维数组来说，需要通过 "arr[y][x]" 这种硬编码的方式进行数据
                    的访问，但是当维数变化时，该方式就不适用了，比如三维数组(arr[z][y][x])。
                    * 坐标映射算法设计:
                    设 
                        ds = [x, y, z, ...] 为高维数组(逻辑存储结构)的尺寸，
                        p  = [x, y, z, ...] 为高维数组上数据的坐标向量
                    则 index(dim) 坐标映射索引函数的递归结构如下:
                        index(1) -> p[x]
                        index(2) -> (ds[x] * p[y]) + index(1) 
                                 -> (ds[x] * p[y]) + p[x]
                        index(3) -> (ds[x] * ds[y] * p[z]) + index(2) 
                                 -> (ds[x] * ds[y] * p[z]) + (ds[x] * p[y]) + p[x]
                        ...
                    由上述归纳可得:
                        index(n) -> (1 * ds[x] * ... * ds[n-1]) * p[n-1] + index(n-1)
                    FIN
                @property: 
                    * dn(int|>0): 网格单元大小
                    * size(arr:number|>0): 要划分成网格的原始空间尺寸。
                    * dsize(arr:int|>0): 网格空间尺寸
                    * length(int|>=0): 存储容器长度
                    * _data(arr): 存储容器(一维数组)
                    * _cache_ds(arr): 用于根据向量位置坐标计算存储容器索引的计算缓存
                    * _cache_gns(arr): 用于缓存网格邻域坐标集
                @method: 
                    * toGrid: 将数据集向量映射到网格空间坐标
                    * index: 坐标映射算法
                    * gns: 根据维数和邻域半径计算网格空间的邻域坐标集
                    * set: 存储数据
                    * get: 获取数据
                @exp: 
                ----------------------------------------*/
                constructor(dn, size) {
                    //网格单元大小
                    this.dn = dn;
                    //原始空间尺寸(像素坐标)
                    this.size = size;
                    //网格空间尺寸(网格坐标)
                    this.dsize = [];
                    //存储容器长度
                    this.length = 1;
                    //计算存储容器尺寸
                    for(let i=this.size.length; i--; ) {
                        let di = Math.ceil(this.size[i]/this.dn) + 1;
                        this.length *= di; this.dsize[i] = di;
                    }
                    //构建存储容器(一维数组容器，映射到虚拟高维数组)
                    this._data = new Array(this.length);
                    //计算缓存: 维度-尺寸系数
                    this._cache_ds = null;
                    //计算缓存: 网格邻域坐标集(r=1)
                    this._cache_gns = this.gns(this.dsize.length, 1);
                }

                /*----------------------------------------
                @func: 将数据集向量映射到网格空间坐标
                @params: 
                    * vector(Vector): 数据集向量
                @return(Vector): 对应的网格空间坐标 
                ----------------------------------------*/
                toGrid(vector) {
                    let v = [];
                    for(let i=0, n=vector.dim(); i<n; i++) {
                        v[i] = Math.ceil(vector.v[i]/this.dn);
                    }
                    return new Vector$1(...v);
                }

                /*----------------------------------------
                @func: 坐标映射算法 
                @desc: 计算网格空间坐标(逻辑存储结构)对应存储容器的索引(实际存储结构)
                @params: 
                    * vector(Vector): 网格空间坐标向量
                @return(int): 存储容器索引 
                ----------------------------------------*/
                index(vector) {
                    /* 
                    //递归实现 
                    //n(维数) | ds(dsize) | p(坐标向量)
                    let _index = function(n, ds, p) {
                        if(n==1) {
                            return p[0];
                        } else {
                            let k = 1;
                            for(let i=0; i<n-1; i++) { k*=ds[i]; }
                            return (k * p[n-1]) + _index(n-1, ds, p);
                        }
                    } 
                    */
                    //计算缓存优化: 维度-尺寸系数
                    if(!this._cache_ds) {
                        this._cache_ds = [1];
                        for(let i=0, n=this.dsize.length-1, k=1; i<n; i++) {
                            k *= this.dsize[i];
                            this._cache_ds.push(k);
                        }
                    }
                    //计算索引
                    let i = 0;
                    for(let k=vector.dim(); k--; ) {
                        i += (this._cache_ds[k] * vector.v[k]);
                    }
                    return i;
                }

                /*----------------------------------------
                @func: 计算网格邻域坐标集
                @desc: 根据"维数"和"邻域半径"计算网格空间的邻域坐标集
                @algp:
                    网格邻域坐标集生成算法如下:
                    * dim(1): 
                        [
                            [-1], [0], [1]
                        ]
                    * dim(2):
                        [
                            [-1, -1], [-1, 0], [-1, 1],
                            [ 0, -1], [ 0, 0], [ 0, 1],
                            [ 1, -1], [ 1, 0], [ 1, 1], 
                        ]
                    由上述归纳可知: 
                        dim(n) = (dim(1) x dim(1)) ^ (n-1)
                    其中 x 为笛卡尔积运算，
                    即
                        以 dim(1) 为基，与其自身进行 n 次笛卡尔积运算。
                    设 r 为邻域半径，则基的定义如下
                        base = [-r, -r+1, -r+2, ..., 0, 1, 2, r]
                    则有 
                        dim(n) = (base x base) ^ (n-1)
                    FIN
                @params: 
                    * dim(int|>0): 网格坐标维数
                    * r(int|>=1): 邻域半径
                @return(list:Vector): 网格邻域坐标集
                ----------------------------------------*/
                gns(dim, r=1) {
                    //笛卡尔积
                    let cartesian_product = function(a, b) {
                        let ps = [];
                        for(let i=0, endi=a.length; i<endi; i++) {
                            for(let k=0, endk=b.length; k<endk; k++) {
                                ps.push([...a[i], ...b[k]]);
                            }
                        }
                        return ps;
                    };
                    //生成基坐标
                    let base = [];
                    for(let i=-r; i<=r; i++) { base.push([i]); }
                    //生成网格邻域集
                    let _gns = base;
                    for(let i=0; i<dim-1; i++) { _gns = cartesian_product(_gns, base); }
                    return _gns;
                }

                /*----------------------------------------
                @func: 存储数据
                @desc: 在原始坐标向量(p)映射的网格坐标位置存储值(val)
                @params: 
                    * p(Vector): 原始坐标向量
                    * val(obj): 数据值
                @return(bool): 操作状态 
                ----------------------------------------*/
                set(p, val) {
                    let i = this.index(this.toGrid(p));
                    if(i<0 || i>this.length) { return false; }
                    if(this._data[i]) {
                        this._data[i].push(val);
                    } else {
                        this._data[i] = [val];
                    }
                    return true;
                }

                /*----------------------------------------
                @func: 获取数据
                @desc: 获取原始坐标向量(p)映射的网格坐标位置的邻域半径(r)内的数据对象
                @params: 
                    * p(Vector): 原始坐标向量
                    * r(int|>=0): 邻域半径 
                @return(list:obj): 数据对象列表 
                ----------------------------------------*/
                get(p, r=0) {
                    //网格中心坐标
                    let po = this.toGrid(p);
                    //返回网格中心坐标位置的数据
                    if(r <= 0) { 
                        return this._data[this.index(po)] || []; 
                    }
                    //生成网格邻域坐标集
                    let _gns = r==1 ? this._cache_gns : this.gns(p.dim(), r);
                    //遍历网格邻域坐标集获取数据对象
                    let data = [];
                    for(let k=0, n=_gns.length; k<n; k++) {
                        let i = this.index(new Vector$1(..._gns[k]).add(po));
                        data = [...data, ...(this._data[i] || [])];
                    }
                    return data;
                }
            }
            return new GridContainer(dn, size);
        }

        /*----------------------------------------
        @func: 构建算法的数据结构
        @desc: 将数据集存储到网格容器中
        ----------------------------------------*/
        build(ps=null) {
            //数据集
            this.ps = ps || this.ps;
            //计算数据集分量范围
            if(this.dsr==null) {
                //计算边界向量(由数据集向量分量范围构建)
                let max = this.vect(this.ps[0]).clone(), min = max.clone();
                for(let i=1, n=this.ps.length; i<n; i++) {
                    let p = this.vect(this.ps[i]);
                    for(let k=0, end=p.v.length; k<end; k++) {
                        if(max.v[k] < p.v[k]) { max.v[k] = p.v[k]; }
                        if(min.v[k] > p.v[k]) { min.v[k] = p.v[k]; }
                    }
                }
                this.dsr = [];
                for(let i=0; i<min.v.length; i++) {
                    this.dsr[i] = [min.v[i], max.v[i]];
                }
            }
            //计算数据集网格容器尺寸(this.size)与数据集非负平移量(this.dst)
            this.size = [], this.dst = [];
            for(let i=0, n=this.dsr.length; i<n; i++) {
                this.size[i] = this.dsr[i][1] - this.dsr[i][0];
                this.dst[i] = this.dsr[i][0] < 0 ? -this.dsr[i][0] : 0;
            }
            this.dst = new Vector$1(...this.dst);
            //构建网格数据存储容器
            this.grid = GridNNS.GridContainer(this.dn, this.size);
            //将数据集存储到网格容器中
            for(let i=0, n=this.ps.length; i<n; i++) {
                this.grid.set(this.vect(this.ps[i]).clone().add(this.dst), this.ps[i]);
            }
            return this;
        }

        /*----------------------------------------
        @func: dist邻近集
        ----------------------------------------*/
        near(tp, dist) {
            //计算网格邻域半径
            let R = Math.ceil(dist/this.dn);
            //计算网格近似邻近集
            let gnps = this.grid.get(this.vect(tp).clone().add(this.dst), R);
            //计算临近集
            return super.near(tp, dist, gnps);
        }

        /*----------------------------------------
        @func: k邻近集
        @algo: 当数据集离散程度较大时，在极端情况下，该算法的计算效率要低于 "LinearNNS.k_near"。
        @TODO: 计算优化，网格坐标系环形单元格坐标计算算法
        ----------------------------------------*/
        k_near(tp, k) {
            //计算最大网格半径
            let max_R = Math.max(...this.grid.dsize), R = 1;
            //计算网格近似邻近集
            let gnps = [];
            while(gnps.length<k && R<=max_R) {
                gnps = this.grid.get(this.vect(tp).clone().add(this.dst), R++);
            }
            gnps = this.grid.get(this.vect(tp).clone().add(this.dst), Math.min(R+1, max_R));
            //计算临近集
            return super.k_near(tp, k, gnps);
        }
    }


    //KD树-邻近搜索
    class KDTreeNNS extends NearestNeighborSearch {

    }

    var NNS = /*#__PURE__*/Object.freeze({
        __proto__: null,
        GridNNS: GridNNS,
        KDTreeNNS: KDTreeNNS,
        LinearNNS: LinearNNS,
        NearestNeighborSearch: NearestNeighborSearch
    });

    /****************************************
     * Name: optimum solution solver | 最优解通用求解器
     * Date: 2022-07-11
     * Author: Ais
     * Project: Vision
     * Desc: 给定一个目标函数，计算该函数的数值最优解
     * Version: 0.1
    ****************************************/


    /***************************************  
    算法思路:
    给定一个目标函数f(x), 其中x是定义域为R*n的向量。现在构造一个求解器s(solver), solver有一个临近坐标集，
    这个集合是其每次迭代后的可能位置。solver在每次迭代时从中选取f(x)的最优解进行移动，直到停机(当临近集中
    的所有值都不是最优时停机)。
    通过上述算法构建的solver求解的可能是局部最优解。为了应对这种情况，可能通过构建一个求解器集群来避免。
    通过随机生成solver的初始位置，让N个solver均匀分布在定义域上。但这N个solver停机时，从中选择一个
    最优解作为全局最优解。
    ****************************************/

    //局部最优解求解器
    class Solver extends Particle {

        /*----------------------------------------
        @func: 局部最优值求解器
        @desc: 通过迭代来求解指定域下目标函数的局部最优解
        @params: 
            * tfunc(function): 目标函数
            * ps(Vector): 起始位置
            * val_type(str): 最优解类型(min || max)
        ----------------------------------------*/
        constructor(tfunc, ps, val_type="min") {
            super();
            //目标函数
            this.tfunc = tfunc;
            //求解域(定义域的子域)
            this.dod = [];
            //最优值类型
            this.val_type = val_type;
            //局部最优解坐标
            this.p = ps;
            //最优值
            this.val = (this.val_type == "min" ? Infinity : -Infinity);
            //速度集(临近坐标集)
            this.vs = [];
            //停机状态
            this._END = false;
        }

        action() {
            if(!this._END) {
                let _END = true;
                for(let i=0, end=this.vs.length; i<end; i++) {
                    //计算目标函数值
                    let _pv = Vector$1.add(this.p, this.vs[i]);
                    let _val = this.tfunc(_pv);
                    //移动到最优解坐标
                    if((this.val_type=="min" && _val <= this.val) || (this.val_type=="max" && val >= this.val)) {
                        this.val = _val; this.p = _pv;
                        _END = false;
                    }
                    //停机(超过求解域)
                    if(!_pv.in(this.dod)) { _END = true; }
                }
                this._END = _END;
            }
            return this.p;
        }

        end() { return this._END; }
    }


    //求解器集群
    class OptimumSolutionSolvers {

        /*----------------------------------------
        @func: 求解器集群
        @desc: 通过在求解域上均匀分布的求解器来求解全局最优值
        @property: 
            * n(number): 求解器数量
            * count(number): 迭代计数器, 用于控制迭代次数
            * tfunc(function): 目标函数
            * dod(list:number): 求解域 -> [[0, width], [0, height]]
            * vs(list:Vector): 求解器速度集, 默认采用8个临近点
            * vsd(number): 默认速度集的步长
            * val_type(str): 最优解类型(min || max)
            * os_val(number): 最优解值
            * os_p(Vector): 最优解坐标
        @return(type): 
        @exp: 
        ----------------------------------------*/
        constructor() {
            //求解器数量
            this.n = 30;
            //求解器集群
            this.solvers = [];
            //迭代次数
            this.count = Infinity;
            //目标函数
            this.tfunc = null;
            //求解域
            this.dod = [];
            //求解器速度集
            this.vs = null;
            //求解器速度集步长
            this.vsd = 1;
            //最优值类型
            this.val_type = "min";
            //最优值
            this.os_val = null;
            //最优值坐标
            this.os_p = null;
            //停机状态
            this._END = false;
        }

        //初始化求解器
        init() {
            //最优解初始值
            this.os_val = (this.val_type == "min" ? Infinity : -Infinity);
            //构建速度集
            if(this.vs == null) {
                this.vs = [
                    new Vector$1(-1, -1).norm(this.vsd), new Vector$1(0, -1).norm(this.vsd), new Vector$1(1, -1).norm(this.vsd),
                    new Vector$1(-1, 0).norm(this.vsd),                                    new Vector$1(1, 0).norm(this.vsd),
                    new Vector$1(-1, 1).norm(this.vsd),  new Vector$1(0, 1).norm(this.vsd),  new Vector$1(1, 1).norm(this.vsd),
                ];
            }
            //构建求解器
            for(let i=0; i<this.n; i++) {
                let _solver = new Solver(this.tfunc, Vector$1.random(this.dod), this.val_type);
                _solver.dod = this.dod; _solver.vs = this.vs;
                this.solvers.push(_solver);
            }
        }
        
        //迭代
        next() {
            if(this._END || this.count<0) {
                this._END = true;
                return this.os_p;
            }
            let _END = true;
            for(let i=0, end=this.solvers.length; i<end; i++) {
                this.solvers[i].action();
                _END = _END & this.solvers[i].end();
                if((this.val_type=="min" && this.solvers[i].val <= this.os_val) || (this.val_type=="max" && this.solvers[i].val >= this.os_val)) {
                    this.os_val = this.solvers[i].val; this.os_p = this.solvers[i].p;
                }
            }
            this._END = _END;
            this.count--;
            return this.os_p;
        }

        //停机状态
        end() { return this._END; }
    }

    var __index__$4 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Complex: Complex,
        Julia_Set: Julia_Set,
        LSystem: LSystem,
        Mandelbrot_Set: Mandelbrot_Set,
        NNS: NNS,
        OptimumSolutionSolvers: OptimumSolutionSolvers,
        boids: Boids
    });

    /****************************************
     * Name: HTML5 Canvas 对象
     * Date: 2022-07-05
     * Author: Ais
     * Project: Vision
     * Desc: 对canvas接口进行二次封装
     * Version: 0.1
    ****************************************/


    class Canvas {

        /*----------------------------------------
        @func: Canvas对象
        @params: 
            * canvas_id(str): canvas标签的id
            * width(int): 画布宽度
            * height(int): 画布高度
            * BGC(str): 画布的背景颜色
        @return(obj): canvas对象
        @exp: 
            const canvas = new Canvas("vision_canvas", 3840, 2160);
        ----------------------------------------*/
        constructor(canvas_id, width, height, BGC='rgb(50, 50, 50)') {
            //获取canvas标签
            this.canvas = document.getElementById(canvas_id);
            //设置canvas尺寸
            this._width = this.canvas.width = width || window.screen.width;
            this._height = this.canvas.height = height || window.screen.height;
            //中心点坐标
            this._cx = parseInt(this._width / 2);
            this._cy = parseInt(this._height / 2);
            //获取绘图上下文(2D)
            this.ctx = this.canvas.getContext("2d");
            //默认背景色
            this.BGC = BGC;
            //point样式
            this.POINT = {
                //大小(半径)
                "R": 2,
                //颜色
                "C": "#FFFFFF"
            };
            this.refresh();
        }

        //设置canvas尺寸
        get width() { return this._width; }
        set width(w) { this._width = this.canvas.width = w; this._cx = parseInt(this._width / 2); this.refresh(); }
        get height() { return this._height; }
        set height(h) { this._height = this.canvas.height = h; this._cy = parseInt(this._height / 2); this.refresh(); }
        get cx() { return this._cx; }
        get cy() { return this._cy; }

        //设置颜色(strokeStyle && fillStyle)
        set colorStyle(color) {
            this.ctx.strokeStyle = this.ctx.fillStyle = color;
        }

        //重置画布尺寸
        resize(width, height) {
            this.width = parseInt(width) || window.screen.width;
            this.height = parseInt(height) || window.screen.height;
        }

        //刷新画布
        refresh(color){
            this.ctx.fillStyle = color || this.BGC;
            this.ctx.fillRect(0, 0, this._width, this._height);
        }

        /*----------------------------------------
        @func: 绘制点(point)
        @desc: 绘制坐标为(x, y)的点
        @params: 
            * x: x坐标参数
            * y: y坐标参数
            * color: 颜色
            * r: 半径
        @exp:
            * point(100, 100)
            * point(Vector(100, 100)) 
            * point({"x":100, "y":100}) 
        ----------------------------------------*/
        point(x, y, color=null, r=null) {
            if(typeof arguments[0] != "number") {
                x = arguments[0].x; y = arguments[0].y;
            }
            this.ctx.strokeStyle = this.ctx.fillStyle = (color || this.POINT.C);
            this.ctx.beginPath();
            this.ctx.arc(x, y, r || this.POINT.R, 0, 2*Math.PI);
            this.ctx.stroke(); 
            this.POINT.R > 1 && this.ctx.fill();
        }

        /*----------------------------------------
        @func: 绘制线段(line)
        @desc: 绘制一条从起始点(xs, ys)到终止点(xe, ye)的线段
        @params: 
            * (xs, ys): 起始点坐标
            * (xe, ye): 终止点坐标
        @exp:
            * line(100, 100, 300, 300)
            * line(Vector(100, 100), Vector(300, 300)) 
        ----------------------------------------*/
        line(xs, ys, xe, ye) {
            if(typeof arguments[0] != "number") {
                xs = arguments[0].x; ys = arguments[0].y;
                xe = arguments[1].x; ye = arguments[1].y;
            }
            this.ctx.beginPath();
            this.ctx.moveTo(xs, ys);
            this.ctx.lineTo(xe, ye);   
            this.ctx.stroke(); 
        }

        /*----------------------------------------
        @func: 绘制线集
        @desc: 根据顶点集绘制线集
        @params: 
            * ps: 顶点集 -> [[x1, y1], [x2, y2], ..., [xn, yn]] || [v1, v2, v3, ..., vn]
            * color(str || Color(颜色对象)): 线段颜色样式 
            * close: 是否闭合
        @exp:
            * lines([[100, 100], [300, 300]])
            * lines([Vector(100, 100), Vector(300, 300)]) 
        ----------------------------------------*/
        lines(ps, color='rgb(255, 255, 255)', close=false) {
            //判断点集元素类型
            let isVector = (ps[0].x != undefined);
            //判断是否是颜色对象
            let isColor = (color.color != undefined);
            //绘制线段
            for(let i=0, n=ps.length, end=(close ? n : n-1); i<end; i++) {
                this.ctx.beginPath();
                this.ctx.strokeStyle = (isColor ? color.color() : color);
                if(isVector) {
                    this.ctx.moveTo(ps[i].x, ps[i].y); this.ctx.lineTo(ps[(i+1)%n].x, ps[(i+1)%n].y);
                } else {
                    this.ctx.moveTo(ps[i][0], ps[i][1]); this.ctx.lineTo(ps[(i+1)%n][0], ps[(i+1)%n][1]);
                }
                this.ctx.stroke();
            }
        }

        /*----------------------------------------
        @func: 绘制圆
        @desc: 绘制圆心坐标为(x, y), 半径为r的圆
        @params: 
            * (x, y): 圆心坐标
            * r: 半径
            * color: 颜色
        @exp:
            * circle(100, 100, 5) 
        ----------------------------------------*/
        circle(x, y, r, color=null) {
            if(color){ this.ctx.strokeStyle = this.ctx.fillStyle = color;}        this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, 2*Math.PI);
            this.ctx.stroke(); 
            color && this.ctx.fill();
        }

        /*----------------------------------------
        @func: 绘制矩形
        @desc: 绘制中心坐标为(x, y), x轴半径为rx, y轴半径为ry的矩形
        @params: 
            * (x, y): 中心坐标
            * rx: x轴半径为rx
            * ry: y轴半径为rx
        @exp:
            * rect(100, 100, 50, 100) 
            * rect(100, 100, 50, 50) 
        ----------------------------------------*/
        rect(x, y, rx, ry) {
            this.ctx.beginPath();
            this.ctx.rect(x-rx, y-ry, rx*2, ry*2);
            this.ctx.stroke();
        }
    }

    var __index__$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Canvas: Canvas
    });

    /****************************************
     * Name: 区域
     * Date: 2022-07-13
     * Author: Ais
     * Project: Vision
     * Desc: 描述一个封闭区域，并给定一个点是否在区域内的判定算法(in)
     * Version: 0.1
     * Update:
     *     [2022-07-14]: 增加区域反转功能, 将method(in)的判定反转 
    ****************************************/


    //基类
    class BaseArea {

        /*----------------------------------------
        @func: 判断一个给定坐标是否在区域内
        @params:
            * p(Vector||list): 坐标 -> Vector(x, y) || [x, y]
        @return(bool) 
        ----------------------------------------*/
        in(p) {
            return true;
        }
    }


    //顶点集区域
    class Area extends BaseArea {

        /*----------------------------------------
        @func: 顶点集区域
        @desc: 通过一系列顶点坐标描述一个封闭区域
        @property: 
            * vps(list:Vector): 构成区域的顶点集
            * offset(number): 判定算法(in)的计算误差
            * reverse(bool): 区域反转标记, 将method(in)的判定反转
        ----------------------------------------*/
        constructor(vpoints, reverse=false) {
            super();
            //顶点集
            this.vps = vpoints;
            //计算误差
            this.offset = (Math.PI/180)*5;
            //区域反转标记
            this.reverse = reverse;
        }

        /*----------------------------------------
        @func: 点是否在区域内的判定算法
        @algorithm: 
            求解目标点(p)与区域的顶点集(vps)构成的凸多边形的内角和(rads),
            当 rads == Math.PI*2 时，p在区域内部，反之不在。
        @Waring: 该判定算法仅支持凸多边形
        @params: 
            * p(Vector||list): 目标点
        ----------------------------------------*/
        in(p) {
            p = p.v ? p : new Vector$1(...p);
            //计算内角和
            let rads = 0, n = this.vps.length;
            for(let i=0; i<n; i++) {
                let _rad = Math.abs(Vector$1.rad(Vector$1.sub(this.vps[i%n], p), Vector$1.sub(this.vps[(i+1)%n], p)));
                rads += (_rad>Math.PI ? 2*Math.PI-_rad : _rad);
            }
            return this.reverse ^ (rads > Math.PI*2-this.offset) && (rads < Math.PI*2+this.offset) 
        }
    }


    //矩形区域
    class RectArea extends BaseArea {

        /*----------------------------------------
        @func: 矩形区域
        @desc: 通过分量范围来描述一个矩形区域(任意维)
        @property: 
            * borders(list:list): 分量范围 
        @exp:
            new ReactArea([[100, 300], [100, 300]]) -> 中心点为(200, 200), 边长为100的矩形区域
        ----------------------------------------*/
        constructor(borders, reverse=false) {
            super();
            //矩形边界范围
            this.borders = borders;
            //区域反转标记
            this.reverse = reverse;
        }

        in(p) {
            p = p.v ? p : new Vector$1(...p);
            for(let i=0, n=this.borders.length; i<n; i++) {
                if((p.v[i] < this.borders[i][0]) || (p.v[i] > this.borders[i][1])) {
                    return this.reverse ^ false;
                }
            }
            return this.reverse ^ true;
        }
    }


    //圆形区域
    class CircleArea extends BaseArea {

        /*----------------------------------------
        @func: 圆形区域
        @desc: 描述一个圆形区域(任意维)
        @property: 
            * po(Vector): 中心坐标
            * r(number): 半径 
        ----------------------------------------*/
        constructor(po, r, reverse=false) {
            super();
            //中心坐标
            this.po = po;
            //半径
            this.r = r;
            //区域反转标记
            this.reverse = reverse;
        }

        in(p) {
            p = p.v ? p : new Vector$1(...p);
            return this.reverse ^ (p.dist(this.po) < this.r);
        }
    }

    var area = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Area: Area,
        BaseArea: BaseArea,
        CircleArea: CircleArea,
        RectArea: RectArea
    });

    /****************************************
     * Name: 边界
     * Date: 2022-07-11
     * Author: Ais
     * Project: Vision
     * Desc: 对到达边界的粒子进行处理
     * Version: 0.1
     * Update:
     *     2022-07-27: 对limit()添加"r"(质心到边界的距离)参数，以支持在考虑粒子具有形状属性的情况下的限制作用
    ****************************************/

    //边界限制器(基类)
    class Border {

        /*----------------------------------------
        @func: 越界处理函数
        @desc: 当目标发生越界时，通过该函数进行处理。
        @params:
            * p_obj(Particle): 目标粒子
            * r(number): 形状半径
        ----------------------------------------*/
        limit(p_obj, r=0) {
            return p_obj;
        } 
    }


    //矩形反射边界
    class RectReflectBorder extends Border {

        /*----------------------------------------
        @func: 矩形反射边界
        @desc: 当目标越界时，其垂直与反射面的速度分量将被反转，产生反射效果。
        @property: 
            * borders(list): 边界范围 
            * on_line(bool): 当该参数为true时，越界时会重置目标位置到边界线上
        ----------------------------------------*/
        constructor(borders, on_line=true) {
            super();
            //分量限制范围
            this.borders = borders || [];
            //边界线模式
            this.on_line = on_line;
        }

        limit(p_obj, r=0) {
            for(let i=0; i<this.borders.length; i++) {
                if(p_obj.p.v[i]-r <= this.borders[i][0]) {
                    this.on_line ? p_obj.p.v[i] = this.borders[i][0]+r : null;
                    p_obj.v.v[i] = -p_obj.v.v[i];
                }
                if(p_obj.p.v[i]+r >= this.borders[i][1]) {
                    this.on_line ? p_obj.p.v[i] = this.borders[i][1]-r : null;
                    p_obj.v.v[i] = -p_obj.v.v[i];
                }
            }
            return p_obj;
        }
    }


    //矩形循环边界
    class RectLoopBorder extends Border {

        /*----------------------------------------
        @func: 矩形循环边界
        @desc: 当目标发生越界时，目标移动到当前边界的相对边界处。
        @property: 
            * borders(list): 边界范围 
        @exp:
            RectLoopBorder([[0, 500], [0, 500]]);
        ----------------------------------------*/
        constructor(borders) {
            super();
            //分量限制范围
            this.borders = borders || [];
        }

        limit(p_obj, r=0) {
            for(let i=0; i<this.borders.length; i++) {
                if(p_obj.p.v[i]-r <= this.borders[i][0]) {
                    p_obj.p.v[i] = this.borders[i][1]-r;
                } else if(p_obj.p.v[i]+r >= this.borders[i][1]) {
                    p_obj.p.v[i] = this.borders[i][0]+r;
                }
            }
            return p_obj;
        }
    }


    //环形反射边界
    class RingReflectBorder extends Border {

        /*----------------------------------------
        @class: 环形反射边界
        @desc: 圆形边界，目标越界时进行速度反射
        @property: 
            * po(Vector): 边界圆心坐标
            * r(number,>0): 边界半径
        ----------------------------------------*/
        constructor(po, r) {
            super();
            //边界圆心坐标
            this.po = po;
            //边界半径
            this.r = r;
        }

        limit(p_obj, r=0) {
            if(this.po.dist(p_obj.p)+r > this.r) {
                //反射面法向量
                let rv = Vector.sub(this.po, p_obj.p).normalization();
                //修正位置坐标
                p_obj.p = Vector.add(this.po, rv.clone().mult(-(this.r-r)));
                //反射速度向量
                p_obj.v = Vector.sub(p_obj.v, rv.clone().mult(rv.dot(p_obj.v)*2));
            }
            return p_obj;
        }
    }


    //环形循环边界
    class RingLoopBorder extends Border {

        /*----------------------------------------
        @class: 环形循环边界
        @desc: 圆形边界，目标越界时将其移动到目标与圆心坐标的对角位置
        @property: 
            * po(Vector): 边界圆心坐标
            * r(number,>0): 边界半径
        ----------------------------------------*/
        constructor(po, r) {
            super();
            //边界圆心坐标
            this.po = po;
            //边界半径
            this.r = r;
        }

        limit(p_obj, r=0) {
            if(this.po.dist(p_obj.p)+r > this.r) {
                //反射面法向量
                let rv = Vector.sub(this.po, p_obj.p).normalization();
                //修正位置坐标(当前相对与圆心的对角位置)
                p_obj.p = Vector.add(this.po, rv.clone().mult((this.r-r)));
            }
            return p_obj;
        }
    }

    var border = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Border: Border,
        RectLoopBorder: RectLoopBorder,
        RectReflectBorder: RectReflectBorder,
        RingLoopBorder: RingLoopBorder,
        RingReflectBorder: RingReflectBorder
    });

    /****************************************
     * Name: Coordinate System | 坐标系
     * Date: 2022-08-01
     * Author: Ais
     * Project: Vision
     * Desc: 构建坐标系, 对向量进行坐标变换
     * Version: 0.2
    ****************************************/


    /****************************************  
    (PCS)屏幕像素坐标系(Canvas画布坐标)

      o(0, 0) ----------> (+x)
      |
      | 
      |
      V
     (+y)

     * o(0, 0): 坐标原点位于屏幕左上角
     * +x: x轴正方向水平向右
     * +y: y轴正方向垂直向下
     * scale: 标度为正整数(1), 代表一个像素
    ****************************************/


    //坐标系(基类)
    class CoordinateSystem {

        /*----------------------------------------
        @func: MCS(主坐标系) -> CS(当前坐标系)
        @desc: 从主坐标系转换到当前坐标系
        @params:
            * vector(Vector): 目标向量
        @return(Vector)
        ----------------------------------------*/
        to(vector) {
            return vector;
        }

        /*----------------------------------------
        @func: CS -> MCS
        @desc: 从当前坐标系转换到主坐标系
        @params:
            * vector(Vector): 目标向量
        @return(Vector)
        ----------------------------------------*/
        from(vector) {
            return vector;
        }
    }


    //实数坐标系
    class RCS extends CoordinateSystem {

        /*----------------------------------------
        @class: 实数坐标系
        @desc: 将屏幕像素坐标系映射到实数域中进行计算
        @property: 
            * _co(Vector): 屏幕像素坐标系原点坐标
            * _scale(number & R+ & >0): 标度比例，一个像素对应的值 
        @method: 
            * to: PCS(屏幕像素坐标系) -> CS(当前坐标系)
            * from: CS(当前坐标系) -> PCS(屏幕像素坐标系)
            * zoom: 对坐标系标度进行缩放
            * move: 对屏幕像素坐标系原点坐标(co)进行平移
        @exp: 
            let rcs = new RCS(Vector.v(canvas.cx, canvas.cy), 0.5);
        ----------------------------------------*/
        constructor(co, scale=1) {
            super();
            //屏幕像素坐标系原点坐标
            this._co = co;
            //标度
            this._scale = scale;
        }
        
        get scale() { return this._scale; }
        set scale(val) {
            if(val <= 0) { throw Error(`scale(${val}) must be in (0, Inf)`); }
            this._scale = val;
        }
        get co() { return this._co.clone(); }

        /*----------------------------------------
        @func: PCS(屏幕像素坐标系) -> CS(当前坐标系)
        ----------------------------------------*/
        to(vector) {
            let x = ((vector.v ? vector.x : vector[0]) - this._co.x) * this._scale;
            let y = (-1)*((vector.v ? vector.y : vector[1]) - this._co.y) * this._scale;
            return vector.v ? Vector$1.v(x, y) : [x, y];
        }

        /*----------------------------------------
        @func: CS(当前坐标系) -> PCS(屏幕像素坐标系)
        ----------------------------------------*/
        from(vector) {
            let x = ((vector.v ? vector.x : vector[0]) / this._scale) + this._co.x;
            let y = ((-1)*(vector.v ? vector.y : vector[1]) / this._scale) + this._co.y;
            return vector.v ? Vector$1.v(x, y) : [x, y];
        }

        /*----------------------------------------
        @func: 缩放
        @desc: 
            对坐标系标度进行缩放
            当 "zr>0" 时，进行 "放大"，标度变小
            当 "zr<0" 时，进行 "缩小"， 标度变大。
        @params: 
            * zr(number): 缩放值
        @return(this) 
        @exp: 
            * 放大2倍: coor.zoom(2)
            * 缩写2倍: coor.zoom(-2)
        ----------------------------------------*/
        zoom(zr) {
            zr > 0 ? this.scale /= Math.abs(zr) : this.scale *=  Math.abs(zr);
            return this;
        }

        /*----------------------------------------
        @func: 平移
        @desc: 对屏幕像素坐标系原点坐标(pco)进行平移
        @params: 
            * vector(Vector): 平移坐标
        @return(this) 
        @exp: 
            向右平移100个像素: coor.move(Vector.v(-100, 0));
        ----------------------------------------*/
        move(vector) {
            this._co.add(vector.v ? vector : Vector$1.v(...vector));
            return this;
        }
    }


    //网格坐标系
    class Grid extends CoordinateSystem {

        /*----------------------------------------
        @class: Grid(网格坐标系)
        @desc: 将屏幕像素坐标系映射到网格坐标系
        @property: 
            * co(vector): 坐标原点
            * dx/dy(int>=1): 网格单元尺寸
            * RY(bool): y轴反转标记 -> true(向上) | false(向下)
        @exp: 
            let grid = new Grid(new Vector(canvas.cx, canvas.cy), 10, 10, true);
        ----------------------------------------*/
        constructor(co, dx=1, dy=1, RY=false) {
            super();
            //坐标原点
            this.co = co;
            //网格单元尺寸
            this._dx = dx;
            this._dy = dy;
            //反转Y轴
            this._RY = RY ? -1 : 1;
        }

        get dx() { return this._dx; }
        set dx(val) {
            if(val < 1) { throw Error(`dx(${val}) must be in [1, Inf)`); }
            this._dx = Math.round(val);
        }
        
        get dy() { return this._dy; }
        set dy(val) {
            if(val < 1) { throw Error(`dy(${val}) must be in [1, Inf)`); }
            this._dy = Math.round(val);
        }

        get RY() { return (this._RY == -1); }
        set RY(val) {
            this._RY = val ? -1 : 1;
        }
        
        /*----------------------------------------
        @func: PCS -> Grid
        @desc: 单元格内的坐标会映射到同一点
        ----------------------------------------*/
        to(vector) {
            let x = Math.round(((vector.v ? vector.v[0] : vector[0]) - this.co.x) / this.dx);
            let y = Math.round(((vector.v ? vector.y : vector[1]) - this.co.y) / this.dy) * this._RY;
            return vector.v ? Vector$1.v(x, y) : [x, y];
        }

        /*----------------------------------------
        @func: Grid -> PCS
        ----------------------------------------*/
        from(vector) {
            let x = this.dx * (vector.v ? vector.x : vector[0]) + this.co.x;
            let y = this.dy * (vector.v ? vector.y : vector[1]) * this._RY + this.co.y;
            return vector.v ? Vector$1.v(x, y) : [x, y];
        }

    }


    //极坐标系
    class PolarCS extends CoordinateSystem {

        /*----------------------------------------
        @class: 极坐标系
        @desc: 将屏幕像素坐标系映射到极坐标系
        @property: 
            * co(vector): 坐标原点
        @exp: 
            let coor = new PolarCS(new Vector(canvas.cx, canvas.cy));
        ----------------------------------------*/
        constructor(co) {
            super();
            //坐标原点
            this.co = co;
        }

        /*----------------------------------------
        @func: PCS -> PolarCS
        @params: 
            * vector(Vector | Arr): [dist, rad]
        ----------------------------------------*/
        to(vector) {
            let v = (vector.v ? vector : new Vector$1(...vector)).sub(this.co);
            let dist = v.dist(), rad = v.rad();
            return vector.v ? Vector$1.v(dist, rad) : [dist, rad];
        }

        /*----------------------------------------
        @func: PolarCS -> PCS
        ----------------------------------------*/
        from(vector) {
            let dist = (vector.v ? vector.x : vector[0]);
            let rad = (vector.v ? vector.y : vector[1]);
            let x = dist * Math.sin(rad) + this.co.x;
            let y = dist * Math.cos(rad) + this.co.y;
            return vector.v ? Vector$1.v(x, y) : [x, y];
        }

    }

    var coor = /*#__PURE__*/Object.freeze({
        __proto__: null,
        CoordinateSystem: CoordinateSystem,
        Grid: Grid,
        PolarCS: PolarCS,
        RCS: RCS
    });

    /****************************************
     * Name: Field | 矢量场
     * Date: 2022-07-13
     * Author: Ais
     * Project: Vision
     * Desc: 在给定区域内影响粒子行为
     * Version: 0.1
    ****************************************/


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
            this.gp = gp || new Vector$1(0, 0);
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
                let g = Vector$1.sub(this.gp, fp.p).norm(this.G * (this.mass * fp.mass) / r*r);
                fp.force(g);
            }
        }

        //计算两个粒子间的引力
        static gravity(fp1, fp2) {
            let r = Vector$1.dist(fp1.p, fp2.p);
            let g = Gravity.G * (fp1.mass * fp2.mass) / r*r;
            fp1.force(Vector$1.sub(fp2.p, fp1.p).norm(g));
            fp2.force(Vector$1.sub(fp1.p, fp2.p).norm(g));
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
                fp.force(Vector$1.sub(fp.v.clone().rotate(this.W), fp.v));
            }
        }
    }

    var field = /*#__PURE__*/Object.freeze({
        __proto__: null,
        AccelerateField: AccelerateField,
        DecelerateField: DecelerateField,
        DeflectField: DeflectField,
        Field: Field,
        Gravity: Gravity
    });

    /****************************************
     * Name: 粒子系统/运动系统
     * Date: 2022-07-10
     * Author: Ais
     * Project: Vision
     * Desc: 基于向量模拟抽象粒子的运动
     * Version: 0.1
     * Update:
        * (2023-03-06, Ais): ParticleSystem(粒子系统)结构优化 
    ****************************************/


    //粒子系统(基类)
    class ParticleSystem {

        /*----------------------------------------
        @class: ParticleSystem | 粒子系统
        @desc: 粒子集群容器，描述粒子的集群行为
        @property: 
            * ps(list:Particle): 粒子容器
            * particle_builder(callable): 粒子生成器
            * action_middlewares(obj:list:callable): action中间件(Hooks)
            * max_pn(int, (0, N+)): 最大粒子数
            * gen_pn(int, (0, N+)): 迭代过程粒子生成数
            * GENR(bool): 粒子生成开关, 用于在迭代过程中生成新的粒子
            * DSTR(bool): 粒子销毁开关, 当容器中的粒子进入停机状态时，从容器中移除该粒子
        @method:
            * build: 对粒子系统进行初始化
            * particle_action: 粒子运动与生命周期管理
            * action(): 粒子集群运动
        @exp: 
            let pcs = new ParticleSystem().init();
        ----------------------------------------*/
        constructor(particle_builder, {max_pn=500, gen_pn=1, GENR=false, DSTR=true}={}) {
            //粒子容器
            this.ps = [];
            //粒子生成器
            this.particle_builder = particle_builder;
            //action中间件(Hook)
            this.action_middlewares = {
                "before": [],
                "after": [],
            };
            //最大粒子数
            this.max_pn = max_pn;
            //迭代过程粒子生成数
            this.gen_pn = gen_pn;
            //粒子生成开关
            this.GENR = GENR;
            //粒子销毁开关
            this.DSTR = DSTR;
        }

        /*----------------------------------------
        @func: 初始化
        @desc: 对粒子系统进行初始化
        @return(this) 
        ----------------------------------------*/
        build(pn=0) {
            this.ps = [];
            for(let i=(pn < this.max_pn ? pn : this.max_pn); i--; ) {
                this.ps.push(this.particle_builder());
            }
            return this;
        }

        /*----------------------------------------
        @func: 粒子运动与生命周期管理
        @desc: 更新粒子容器中的粒子运动状态，并进行生命周期的管理
        ----------------------------------------*/
        particle_action() {
            //粒子运动
            let _ps = [];
            for(let i=0, n=this.ps.length; i<n; i++) {
                //判断粒子的停机状态
                if(!this.ps[i].isEnd()) {
                    //调用粒子的行为模式方法
                    this.ps[i].action(); _ps.push(this.ps[i]);
                } else {
                    //根据"粒子销毁开关"判断是否销毁停机粒子
                    (!this.DSTR) && _ps.push(this.ps[i]);
                }
            }
            //生成新的粒子
            if(this.GENR) {
                let diff_pn = this.max_pn - _ps.length;
                for(let i=(diff_pn>=this.gen_pn ? this.gen_pn : diff_pn); i>0; i--) {
                    _ps.push(this.particle_builder());
                }
            }
            //更新粒子容器
            this.ps = _ps;
        }

        /*----------------------------------------
        @func: 粒子集群运动(迭代过程)
        @desc: 描述粒子集群的行为模式
        ----------------------------------------*/
        action() {
            //action中间件挂载点(before)
            for(let i=0, n=this.action_middlewares.before.length; i<n; i++) {
                this.action_middlewares.before[i](this.ps);
            }
            //粒子运动与生命周期管理
            this.particle_action();
            //action中间件挂载点(after)
            for(let i=0, n=this.action_middlewares.after.length; i<n; i++) {
                this.action_middlewares.after[i](this.ps);
            }
        }

    }

    /****************************************
     * Name: 轨迹追踪器
     * Date: 2022-07-15
     * Author: Ais
     * Project: Vision
     * Desc: 追踪记录目标粒子的移动轨迹
     * Version: 0.1
    ****************************************/

    class TrailTracker {

        /*----------------------------------------
        @func: 轨迹追踪器
        @desc: 隐式地追踪记录目标粒子的移动轨迹
        @property: 
            * tp(Particle): 目标粒子
            * tn(number): 轨迹长度
            * trail(list:Vector): 轨迹向量容器
        @method:
            * _bind(): 绑定追踪的粒子对象
        ----------------------------------------*/
        constructor(tp, tn=10) {
            //目标粒子
            this.tp = tp;
            //轨迹长度
            this.tn = tn;
            //轨迹
            this.trail = [];
            //绑定目标对象
            this._bind();
        }

        /*----------------------------------------
        @func: 绑定追踪的粒子对象
        @desc: 通过hook目标对象的action()方法来实现隐式的轨迹追踪效果
        ----------------------------------------*/
        _bind() {
            this.trail = [this.tp.p.clone()];
            //hook目标对象的action方法
            let _this = this;
            this.tp._tracker_hook_action = this.tp.action;
            this.tp.action = function() {
                let p = this._tracker_hook_action(...arguments);
                (_this.trail.length >= _this.tn) && _this.trail.shift();
                _this.trail.push(p.clone());
                return p;
            };
        }
    }

    var __index__$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        CircularMotorParticle: CircularMotorParticle,
        ForceParticle: ForceParticle,
        LinearMotorParticle: LinearMotorParticle,
        Particle: Particle,
        ParticleSystem: ParticleSystem,
        RandomWalkerParticle: RandomWalkerParticle,
        TrailTracker: TrailTracker,
        area: area,
        border: border,
        coor: coor,
        field: field
    });

    /****************************************
     * Name: 迭代器
     * Date: 2022-07-26
     * Author: Ais
     * Project: Vision
     * Desc: 实现迭代器对象
     * Version: 0.1
    ****************************************/


    //迭代器(基类)
    class Iterator {

        /*----------------------------------------
        @class: 迭代器(基类)
        @desc: 通过val接口实现值的迭代
        @property: 
            * _val(any): 迭代器的值
        @method: 
            * val(): 迭代逻辑实现, 每次调用返回迭代后的值 -> _val
            * end(): 停机状态, 判断迭代器是否停机(迭代结束)
            * tolist(): 迭代并输出值的变化过程 -> [_val(0), _val(1), _val(2) ... _val(n)]
        @exp:
        ----------------------------------------*/
        constructor(val) {
            //值
            this._val = val;
        }

        /*----------------------------------------
        @func: 值迭代逻辑接口
        @desc: 实现迭代逻辑,并返回迭代的值
        @return(any): this._val
        ----------------------------------------*/
        val() {
            return this._val;
        }

        /*----------------------------------------
        @func: 停机状态
        @desc: 判断迭代器是否迭代结束
        @return(bool) 
        ----------------------------------------*/
        end() {
            return false;
        }

        /*----------------------------------------
        @func: 数组转换器
        @desc: 进行迭代，并输出值的变换过程
        @params:
            * n(number): 迭代次数，用于处理不会停机的迭代器
        @return(list:any): [_val(0), _val(1), _val(2) ... _val(n)]
        ----------------------------------------*/
        tolist(n=500) {
            let vals = [];
            for(let i=0; i<n; i++) { 
                vals.push(this.val());
                if(this.end()) { break; }
            }
            return vals
        }
    }


    //范围迭代器
    class Range extends Iterator {

        /*----------------------------------------
        @class: 范围迭代器
        @desc: 一种值线性变化的迭代器
        @property: 
            * _start(number): 起始值
            * _end(number): 终止值
            * _step(number): 步长(速率)
        @exp: 
            * new Range(1, 3) -> [1, 2, 3]
            * Range.S(0, 4, 2) -> [0, 2, 4]
            * Range.N(0, 5, 4) -> [0, 1.25, 2.5, 3.75, 5]
        ----------------------------------------*/
        constructor(start, end, step=1) {
            super(start);
            //起始值
            this._start = start;
            //终止值
            this._end = end;
            //步长
            this._step = start<end ? Math.abs(step) : -Math.abs(step);
        }

        /*----------------------------------------
        @func: 构建器
        @desc: 根据"步长"构建迭代器
        @params: 
            * step(number): 步长大小(速率)
        @return(Range) 
        ----------------------------------------*/
        static S(start, end, step=1) {
            return new Range(start, end, step);
        }

        /*----------------------------------------
        @func: 构建器
        @desc: 根据"迭代次数"构建迭代器
        @params: 
            * n(number): 迭代次数
        @return(Range) 
        ----------------------------------------*/
        static N(start, end, n) {
            return new Range(start, end, (end-start)/n);
        }

        //值迭代逻辑
        val() {
            let val = this._val;
            if(!this.end()) {
                this._val += this._step;
            } else {
                this._val = this._end;
            }
            return val;
        }

        //停机状态
        end() {
            return (this._step>0) ? (this._val>this._end) : (this._val<this._end);
        }

        //复制
        clone() {
            return new Range(this._start, this._end, this._step);
        }

    }


    //函数迭代器
    class FuncIterator extends Iterator {

        /*----------------------------------------
        @class: 函数迭代器
        @desc: 指定定义域范围(dod)和函数(fx)迭代生成对应的值域
        @property: 
            * fx(function): 目标函数
            * dod(Range|list): 定义域
        @exp: 
            * new FuncIterator((x)=>{return x*x;}, Range.S(0, 3)) -> [0, 1, 4, 9]
            * new FuncIterator((x)=>{return x*x;}, [0, 3])
        ----------------------------------------*/
        constructor(fx, dod) {
            super();
            //函数表达式
            this.fx = fx;
            //定义域(Range)
            this.dod = dod.val ? dod : Range.S(...dod);
        }
        
        val(toPoint=false) {
            let x = this.dod.val();
            return toPoint ? [x, this.fx(x)] : this.fx(x);
        }

        end() {
            return this.dod.end();
        }
    }

    var iterator = /*#__PURE__*/Object.freeze({
        __proto__: null,
        FuncIterator: FuncIterator,
        Iterator: Iterator,
        Range: Range
    });

    /****************************************
     * Name: random
     * Date: 2022-08-01
     * Author: Ais
     * Project: Vision
     * Desc: 
     * Version: 0.1
    ****************************************/


    //随机选择器
    class RandomSelector {

        /*----------------------------------------
        @class: RandomSelector(随机选择器)
        @desc: 给定选项集，根据权重生成概率，随机选择一个选项。
        @property: 
            * _ops(list:obj): 选项集
        @method: 
            * _probability: 根据选项集中选项的权重计算概率
            * select: 随机从选项集中选择一个选项
        @exp:
            * let rs = new RandomSelector([["a", 1], ["b", 1], ["c", 3], ["d", 1]])
        ----------------------------------------*/
        constructor(options) {
            //选项集
            this._ops = this._probability(options);
        }

        /*----------------------------------------
        @func: 计算概率
        @desc: 基于权重计算概率 -> p[i] = wt[i] / sum(wt)
        @params: 
            * options(list:list): [[op(选项, any), wt(权重, number:>0)]...]
        @return(opt(list:obj)): [{"op": 选项, "p": 概率, "ps/pe": 概率范围}] 
        ----------------------------------------*/
        _probability(options) {
            //计算总权重
            let swt = 0;
            for(let i=0, n=options.length; i<n; i++) {
                swt += options[i][1] || 0;
            }
            //计算每个选项的概率
            let _ops = [], _ps = 0;
            for(let i=0, n=options.length; i<n; i++) {
                let p = (options[i][1] || 0) / swt;
                _ops.push({
                    //选项
                    "op": options[i][0],
                    //概率
                    "p": p,
                    //概率范围
                    "ps": _ps, "pe": _ps + p
                });
                _ps += p;
            }
            return _ops;
        }

        /*----------------------------------------
        @func: 随机选择
        @desc: 从选项集中随机选择一个选项
        @return(any) 
        ----------------------------------------*/
        select() {
            let r = Math.random();
            for(let i=0, n=this._ops.length; i<n; i++) {
                if(r > this._ops[i].ps && r <= this._ops[i].pe) {
                    return this._ops[i].op;
                }
            }
        }

    }

    /****************************************
     * Name: tool | 工具
     * Date: 
     * Author: Ais
     * Project: Vision
     * Desc: 常用工具代码
     * Version: 0.1
    ****************************************/


    class Tools {

        /*----------------------------------------
        @func: regular polygon | 正多边形生成器
        @desc: 并非严格意义上的正多边形，而是一种"近似"正多边形。
        @params: 
            * n(number(N+, n>=3)): 边数
            * r(number(r>0)): 半径
            * po(list): 中心坐标
            * rad(number): 起始弧度
        @return(list)
        @exp:
            * Tools.regular_polygon(5, 100, [canvas.cx, canvas.cy]);
        ----------------------------------------*/
        static regular_polygon(n, r, po, rad=0) {
            po = po || [0, 0];
            let d_rad = (2*Math.PI)/n;
            let ps = [];
            for(let i=0; i<n; i++) {
                ps.push([r*Math.cos(rad)+po[0], r*Math.sin(rad)+po[1]]);
                rad += d_rad;
            }
            return ps;
        }
        static RP(n, r, po, rad=0) {
            return Tools.regular_polygon(n, r, po, rad);
        }

        /*----------------------------------------
        @func: 角度<>弧度 转换器
        @desc: 在角度与弧度之间转换
        @return(number)
        @exp:
            * Tools.ATR(45) -> Math.PI/4
            * Tools.ATR(Math.PI) -> 45
        ----------------------------------------*/
        static ATR(angle) {
            return (Math.PI/180)*angle;
        }
        static RTA(rad) {
            return (180/Math.PI)*rad;
        }

        /*----------------------------------------
        @func: 生成随机数
        @params: 
            * start/end: 生成范围
        @return(number)
        @exp: 
            Tools.random(-5, 5)
        ----------------------------------------*/
        static random(start, end) {
            return (end-start)*Math.random()+start;
        }

        /*----------------------------------------
        @func: (list)随机选择器
        @desc: 从数组中随机选择一个元素
        @params: 
            * ops(list): 选项集
        @return(any)
        @exp: 
            Tools.rslist(["a", "b", "c"])
        ----------------------------------------*/
        static rslist(ops) {
            return ops[parseInt((ops.length)*Math.random())];
        }

        /*----------------------------------------
        @func: RGB(list) -> RGB(str)
        @desc: 将RGB数组装换成RGB字符串
        @params: 
            * color(list): 颜色数组
        @exp: 
            Tools.RGB([255, 255, 255]) -> "rgb(255, 255, 255, 1)";
        ----------------------------------------*/
        static RGB(color) {
            return `rgb(${color[0]||0}, ${color[1]||0}, ${color[2]||0}, ${color[3]||1})`;
        }


    }

    var __index__$1 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        RandomSelector: RandomSelector,
        Tools: Tools,
        iter: iterator
    });

    /****************************************
     * Name: capturer | 截图器
     * Date: 2022-09-06
     * Author: Ais
     * Project: Vision
     * Desc: 截取Canvas图像后导出
     * Version: 0.1
    ****************************************/


    //截图器
    class Capturer {

        /*----------------------------------------
        @class: 截图器
        @desc: 捕获canvas图像
        @property: 
            * canvasObj(Canvas): canvas对象
            * fileTitle(str): 导出文件标题
            * fn(number:>0): 导出文件计数器
            * _capture_keyCode(ascii-number): 截图按键值
        @method: 
            * capture: 截图，获取canvas画布图像
            * capturing: 绑定截图到指定按键
        @exp: 
            let captuer = new vision.capturer.Capturer(canvas).capturing();
        ----------------------------------------*/
        constructor(canvasObj, fileTitle) {
            //canvas对象
            this.canvasObj = canvasObj;
            //导出文件标题
            this.fileTitle = fileTitle || document.getElementsByTagName("title")[0].innerText.replace(/\s+/g, "");
            //导出文件计数器
            this.fn = 0;
            //截图按键值
            this._capture_keyCode = 'Q'.charCodeAt();
        }

        /*----------------------------------------
        @func: 获取/设置 截图按键
        ----------------------------------------*/
        get captureKey() { return String.fromCharCode(this._capture_keyCode); }
        set captureKey(key) { this._capture_keyCode = key.charCodeAt(); return this; }

        /*----------------------------------------
        @func: 截图
        @desc: 导出当前canvas二进制数据
        @params: 
            * fileName(str): 导出文件名(可选)
        ----------------------------------------*/
        capture(fileName) {
            //构建文件名
            fileName = fileName || `${this.fileTitle}_${this.fn++}`;
            //导出canvas二进制数据
            this.canvasObj.canvas.toBlob((blob) => {
                let temp_node = document.createElement('a');
                temp_node.style.display = 'none';
                temp_node.id = fileName;
                temp_node.href = window.URL.createObjectURL(blob);
                temp_node.download = `${fileName}.png`; 
                temp_node.click();
            });
        }

        /*----------------------------------------
        @func: 监听截图事件
        @desc: 将截图函数绑定到按键事件上
        ----------------------------------------*/
        capturing() {
            let _this = this;
            //绑定按键监听截图事件
            window.addEventListener("keydown", function(event) {
                if(event.keyCode == _this._capture_keyCode) {
                    _this.capture();
                }
            }); 
            return this;
        }
    }

    /****************************************
     * Name: color | 颜色
     * Date: 2022-07-18
     * Author: Ais
     * Project: Vision
     * Desc: 颜色容器
     * Version: 0.1
    ****************************************/


    //颜色向量
    class ColorVector extends Vector$1 {

        /*----------------------------------------
        @class: 颜色向量(Vector)
        @desc: 
            用向量来描述颜色，一个颜色表达式可以看作RGB空间中的一个向量，之所以采用
            向量的形式来描述颜色在于，可以通过这种方式替换粒子中的位置向量，
            来描述颜色向量在颜色空间中的移动，从而构建颜色渐变器。
        @property: 
            * r/g/b(get/set): 颜色的RGB值分量
            * a(get/set): alpht通道分量
        @method: 
            * color(): 返回颜色表达式 -> 'rgb(r, g, b)'
            * clone(): 复制颜色向量
        @exp:
            * new ColorVector(100, 200, 300).color() -> 'rgb(100, 200, 300)';
        ----------------------------------------*/
        constructor(r=0, g=0, b=0, a=1) {
            super();
            //颜色分量
            this.v = a==1 ? [r, g, b] : [r, g, b, a];
        }

        get r(){ return this.v[0]; }
        get g(){ return this.v[1]; }
        get b(){ return this.v[2]; }
        get a(){ return this.v[3]; }
        set r(val){ this.v[0] = val; }
        set g(val){ this.v[1] = val; }
        set b(val){ this.v[2] = val; }
        set a(val){ this.v[3] = val; }

        color(tolist=false) {
            if(this.v.length<=3) {
                return tolist ? [this.v[0], this.v[1], this.v[2]] : `rgb(${this.v[0]}, ${this.v[1]}, ${this.v[2]})`;
            } else {
                return tolist ? [this.v[0], this.v[1], this.v[2], this.v[3]] : `rgb(${this.v[0]}, ${this.v[1]}, ${this.v[2]})`;
            }
        }
        val(tolist=false) { return this.color(tolist); }

        clone() {
            return new ColorVector(...this.v);
        }
    }


    //颜色渐变器
    class ColorGradient {

        /*----------------------------------------
        @class: 线性颜色渐变器
        @desc: 一种迭代器，用于产生渐变色。
        @property: 
            * scv(ColorVector): 起始颜色向量
            * ecv(ColorVector): 终止颜色向量
            * cv(ColorVector): 当前颜色向量
            * n(number): 渐变次数，用于计算每次迭代时的颜色增量
            * _count(number): 内部计数器，用于记录当前迭代次数
            * _dcv(ColorVector): 每次迭代的颜色增量
        @method: 
            * color(): 返回颜色表达式 -> 'rgb(r, g, b)'
        @exp: 
            new ColorGradient([100, 200, 200], [50, 50, 50], 100);
        ----------------------------------------*/
        constructor(start_color, end_color, n) {
            //起始颜色向量
            this.scv = new ColorVector(...start_color);
            //终止颜色向量
            this.ecv = new ColorVector(...end_color);
            //当前颜色
            this.cv = this.scv.clone();
            //渐变次数
            this.n = n; 
            //计数器
            this._count = n;
            //计算颜色增量
            this._dcv = Vector$1.sub(this.ecv, this.scv).norm(Vector$1.dist(this.ecv, this.scv)/n);
        }

        color(tolist=false) {
            let color_val = this.cv.color(tolist);
            if(this._count > 0) { this.cv.add(this._dcv); }
            this._count--;
            return color_val;
        } 
        val(tolist=false) { return this.color(tolist); }

        isEnd() {
            return !(this._count > 0);
        }

    }

    /****************************************
     * Name: randerer | 渲染器
     * Date: 2022-09-06
     * Author: Ais
     * Project: Vision
     * Desc: 渲染器模块
     * Version: 0.1
    ****************************************/


    //渲染器基类
    class Randerer {

        /*----------------------------------------
        @class: 渲染器基类
        @desc: 渲染器，实现行为逻辑和图像绘制的调度。
        @property: 
            * _ft(number:>0): 帧时间轴，时钟
            * fps(number:>0): 帧数(Frames Per Second)
        @method: 
            * rander: 渲染接口
        ----------------------------------------*/
        constructor(fps=60) {
            //帧时间轴
            this._ft = 0;
            //帧数(Frames Per Second)
            this.fps = fps;
        }

        /*----------------------------------------
        @func: 帧时间轴访问器
        @desc: this._ft用于在类内部实现帧的计数, 对外只读
        ----------------------------------------*/
        get ft() { return this._ft; }

        /*----------------------------------------
        @func: 渲染接口
        ----------------------------------------*/
        rander() { 
            this._ft++; 
        }
    }


    //间隔渲染器
    class IntervalRanderer extends Randerer {

        /*----------------------------------------
        @class: 间隔渲染器
        @desc: 标准渲染器，通过 setInterval 函数实现渲染功能
        @property: 
            * _stop_ft(number:>0): 渲染器停机时间点
            * _timer(obj): setInterval函数返回对象，用于在停机时停止渲染器
            * rander_func(func): 渲染函数
        @method: 
            * rander: 渲染接口
            * stop: 设置停机时间点
        @exp: 
            const randerer = new vision.randerer.IntervalRanderer().rander(() => {
                canvas.refresh();
            });
        ----------------------------------------*/
        constructor(fps=60) {
            super(fps);
            //停止时间点
            this._stop_ftp = Infinity;
            //间隔执行器
            this._timer = null;
            //渲染函数
            this.rander_func = null;
        }

        /*----------------------------------------
        @func: 渲染接口
        @desc: 通过 setInterval 间隔执行 rander_func 实现渲染功能
        @params: 
            * rander_func(func): 渲染函数，
            函数形参 => function() || function(ft), ft为帧时间轴，可选参数
        ----------------------------------------*/
        rander(rander_func) {
            this.rander_func = rander_func;
            //构建间隔执行器
            this._timer = setInterval(()=>{
                if(this._ft < this._stop_ftp) {
                    //渲染
                    this.rander_func(this._ft++);
                 } else {
                    //停机
                    clearInterval(this._timer);
                 } 
             }, Math.ceil(1000/this.fps));
             return this;
        }

        /*----------------------------------------
        @func: 设置停机时间点
        ----------------------------------------*/
        stop(t) {
            this._stop_ftp = t; return this;
        }
    }


    //单帧渲染器
    class SingleFrameRanderer extends Randerer {

        /*----------------------------------------
        @class: 单帧渲染器/手动渲染器
        @desc: 通过绑定按键来控制渲染行为
        @property: 
            * act_ft_n(number:>0): 每次触发渲染时，行为函数的调用次数
            * _rander_keyCode(int): 渲染按键值，控制由什么按键进行渲染
            * act_func(func): 行为函数
            * draw_func(func): 绘制函数
        @method: 
            * method: func
        @exp: 
            const randerer = new vision.randerer.SingleFrameRanderer().rander(
                (ft) => {
                    pcs.action();
                },
                (ft) => {
                    canvas.refresh();
                }
            );
        ----------------------------------------*/
        constructor(act_ft_n=1) {
            super(1);
            //行为函数调用次数
            this.act_ft_n = act_ft_n;
            //渲染按键值
            this._rander_keyCode = ' '.charCodeAt();
            //行为函数
            this.act_func = null;
            //绘制函数
            this.draw_func = null;
        }

        /*----------------------------------------
        @func: 获取/设置 渲染按键
        ----------------------------------------*/
        get randerKey() { return String.fromCharCode(this._rander_keyCode); }
        set randerKey(key) { this._rander_keyCode = key.charCodeAt(); }
           
        /*----------------------------------------
        @func: 渲染接口
        @desc: 通过在 window 对象上绑定 keydown 事件来触发渲染
        @params: 
            * act_func(func): 行为函数
            * draw_func(func): 绘制函数
        ----------------------------------------*/
        rander(act_func, draw_func) {
            this.act_func = act_func, this.draw_func = draw_func;
            let _this = this;
            //绑定键盘事件
            window.addEventListener("keydown", function(event) {
                if(event.keyCode == _this._rander_keyCode) {
                    //行为函数调用
                    for(let i=0; i<_this.act_ft_n; i++) {
                        _this.act_func(_this._ft++);
                    }
                    //绘制函数调用
                    _this.draw_func && _this.draw_func(_this._ft);
                }
            }); 
            return this;
        }

    }

    var randerer = /*#__PURE__*/Object.freeze({
        __proto__: null,
        IntervalRanderer: IntervalRanderer,
        SingleFrameRanderer: SingleFrameRanderer
    });

    /****************************************
     * Name: view | 视图绘制
     * Date: 2022-08-01
     * Author: Ais
     * Project: Vision
     * Desc: 常用绘制方法封装
     * Version: 0.1
    ****************************************/


    class Views {

        //绘图上下文
        context = null;

        /*----------------------------------------
        @func: 节点连接器
        @desc: 绘制点距范围在给定区间内的粒子之间的连线
        @params:
            * ps(list:Particle): 节点粒子
            * dr(list:number): 可绘制的点距范围
            * line_color(list|ColorGradient): 连线的颜色
        ----------------------------------------*/
        static nodelink(ps, dr=[0, 100], line_color=[255, 255, 255]) {
            //粒子点距范围
            let pdr = (typeof dr === "number") ? [0, dr] : dr;
            let d = pdr[1] - pdr[0];
            //颜色向量|颜色渐变器
            let cv = line_color.color ? line_color : new ColorVector(...line_color);
            //绘制
            for(let i=0, n=ps.length; i<n; i++) {
                let c = cv.color(true);
                for(let k=i; k<n; k++) {
                    //计算点距
                    let pd = ps[i].p.dist(ps[k].p);
                    if(pd >= pdr[0] && pd <= pdr[1]) {
                        Views.context.ctx.strokeStyle = `rgb(${c[0]}, ${c[1]}, ${c[2]}, ${1-pd/d})`;
                        Views.context.line(ps[i].p, ps[k].p);
                    }
                }
            }
        }

        /*----------------------------------------
        @func: 绘制网格
        @params: 
            * co(Vector): 网格中心坐标
            * dx(number,>0): 网格单元长度
            * dy(number,>0): 网格单元高度
            * xR(list:int): x轴坐标范围
            * yR(list:int): y轴坐标范围
            * color(list:int): 线段颜色
            * center(bool): 网格坐标是否居中 -> true(中心坐标位于线段交界点) | false(中心坐标位于网格单元中心)
        @exp: 
            Views.grid({co: grid.co, dx: grid.dx, dy: grid.dy});
        ----------------------------------------*/
        static grid({co, dx, dy, xR, yR, color=[255, 255, 255], center=true}) {
            //中心坐标
            co = co || new Vector$1(Views.context.cx, Views.context.cy);
            //网格单元尺寸
            dy = dy || dx;
            //x轴范围
            xR = xR || [-parseInt(Views.context.cx/dx)-1, parseInt(Views.context.cx/dx)+1];
            let xs = xR[0]*dx+co.x, xe = xR[1]*dx+co.x;
            //y轴范围
            yR = yR || [-parseInt(Views.context.cy/dy)-1, parseInt(Views.context.cy/dy)+1];
            let ys = yR[0]*dy+co.y, ye = yR[1]*dy+co.y;
            //居中偏移量
            let cdx = (center ? 0 : dx/2), cdy = (center ? 0 : dy/2); 
            //设置颜色
            Views.context.ctx.strokeStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]}, ${color[3]||0.25})`;
            //绘制x轴平行线
            for(let x=xR[0], n=xR[1]; x<=n; x++) {
                let _x = x*dx+co.x+cdx;
                Views.context.line(_x, ys, _x, ye);
            }
            //绘制y轴平行线
            for(let y=yR[0], n=yR[1]; y<=n; y++) {
                let _y = y*dy+co.y+cdy;
                Views.context.line(xs, _y, xe, _y);
            }
        }

        /*----------------------------------------
        @func: 光线
        @params:
            * ps(list:Vector): 线的点集
            * Lfx(function): 亮度衰减函数(Lfx应满足在[1, n]区间单调递减)
            * n(int:>0): 光线的层数
            * d(number:>0): 每次光线的宽度
            * cs(list): 起始颜色
            * ce(list): 终止颜色
        ----------------------------------------*/
        static lightLine(ps, {Lfx, n=10, d=3, cs=[255, 255, 255], ce=[0, 0, 0]} = {}) {
            //亮度衰减函数
            Lfx = Lfx || ((x) => {return 1/(x+0.0001);});
            //Lfx函数在[1, n]区间的最值, 用于进行后续归一化处理
            let max = Lfx(1), min = Lfx(n);
            //绘制光线
            Views.context.ctx.lineCap = "round";
            for(let i=n; i>0; i--) {
                //计算亮度
                let lr = (Lfx(i) - min) / (max - min);
                let lc = [(cs[0]-ce[0])*lr+ce[0], (cs[1]-ce[1])*lr+ce[1], (cs[2]-ce[2])*lr+ce[2]];
                //绘制光线层
                Views.context.ctx.lineWidth = i * d;
                Views.context.lines(ps, new ColorGradient(lc, ce, ps.length));
            }  
        }

        /*----------------------------------------
        @func: 光环
        @params: 
            * x, y, r(number): 圆心坐标与半径
            * Lfx(function): 亮度衰减函数(Lfx应满足在[1, n]区间单调递减)
            * n(int:>0): 光线的层数
            * cs(list): 起始颜色
            * ce(list): 终止颜色
            * point(bool): true->绘制成光点样式
        ----------------------------------------*/
        static lightRing(x, y, r, {Lfx, n=50, cs=[255, 255, 255], ce=[0, 0, 0], point=false}={}) {
            //亮度衰减函数
            Lfx = Lfx || ((x) => {return 1/(x+0.0001);});
            //Lfx函数在[1, n]区间的最值, 用于进行后续归一化处理
            let max = Lfx(1), min = Lfx(n);
            //计算环宽
            let dR = r / n;
            //绘制
            for(let i=n; i>0; i--) {
                //计算亮度
                let lr = (Lfx(point ? i : n-i) - min) / (max - min);
                let lc = [(cs[0]-ce[0])*lr+ce[0], (cs[1]-ce[1])*lr+ce[1], (cs[2]-ce[2])*lr+ce[2]];
                //绘制光环
                Views.context.colorStyle = `rgb(${lc[0]}, ${lc[1]}, ${lc[2]})`;
                Views.context.circle(x, y, dR*i);
                Views.context.ctx.fill();
            }  
        }

        /*----------------------------------------
        @func: 绘制轨迹
        @desc: 
            解决“循环边界”下的轨迹绘制异常，通过将完整轨迹按照阈值进行分段绘制。
        @params: 
            * trail(list:Vector): 轨迹向量列表
            * split_x(number): x轴分量分段阈值
            * split_y(number): y轴分量分段阈值
            * color: 轨迹颜色(支持渐变对象)
        @exp: 
            trail(pcs.ps[i].tracker.trail, {"color": new vision.views.ColorGradient([50, 50, 50], [255, 255, 255], pcs.ps[i].tracker.trail.length)});
        ----------------------------------------*/
        static trail(trail, {split_x=100, split_y=100, color='rgb(255, 255, 255)'}={}) {
            let split_trail = [[]];
            //按照分量分段阈值对轨迹进行分段
            for(let i=0, n=trail.length-1; i<n; i++) {
                split_trail[split_trail.length-1].push(trail[i]);
                if(Math.abs(trail[i].x-trail[i+1].x)>split_x | Math.abs(trail[i].y-trail[i+1].y)>split_y) {
                    split_trail.push([]);
                }
            }
            for(let i=0, n=split_trail.length; i<n; i++) {
                if(split_trail[i].length <= 1) { continue; }
                Views.context.lines(split_trail[i], color);
            }
        }
    }

    var __index__ = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Capturer: Capturer,
        ColorGradient: ColorGradient,
        ColorVector: ColorVector,
        Views: Views,
        randerer: randerer
    });

    exports.Canvas = Canvas;
    exports.Capturer = Capturer;
    exports.Particle = Particle;
    exports.ParticleSystem = ParticleSystem;
    exports.Tools = Tools;
    exports.Vector = Vector$1;
    exports.Views = Views;
    exports.algo = __index__$4;
    exports.context = __index__$3;
    exports.particle = __index__$2;
    exports.randerer = randerer;
    exports.utils = __index__$1;
    exports.vector = vector;
    exports.views = __index__;

}));
