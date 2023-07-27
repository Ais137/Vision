(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.vision = {}));
})(this, (function (exports) { 'use strict';

    /**
     * @module
     * @desc     向量系统(Vision框架核心组件)
     * @project  Vision
     * @author   Ais
     * @date     2022-06-20
     * @version  0.1.0
     * @since    (2023-01-30, Ais): 暴露 this._v 属性，提高计算性能。
    */


    let Vector$1 = class Vector {

        /**
         * @classdesc 向量类: 提供向量计算支持
         * 
         * @property { number[] } v - 向量分量容器(内部存储结构)
         * @property { get/set } x - 向量x轴分量(this.v[0])
         * @property { get/set } y - 向量y轴分量(this.v[1])
         * @property { get/set } z - 向量z轴分量(this.v[2])
         * 
         * @param {...number} v - 向量分量
         * 
         * @example 
         * let v = new Vector(1, 2, 3);  //vector(1, 2, 3)
         */
        constructor(...v) {
            this.v = v.length > 0 ? [...v] : [0, 0];
        }

        //分量接口
        get x(){ return this.v[0]; }
        get y(){ return this.v[1]; }
        get z(){ return this.v[2]; }
        set x(val){ this.v[0] = val; }
        set y(val){ this.v[1] = val; }
        set z(val){ this.v[2] = val; }

        /**
         * Vector静态构建器
         * 
         * @param {...number} v - 向量分量 
         * @returns { Vector } 向量
         * @example 
         * let v = new Vector.v(1, 2);  //vector(1, 2)
         * let v = new Vector.V(1, 2);  //vector(1, 2)
         */
        static v(...v) {
            return new Vector(...v);
        }
        static V(...v) {
            return new Vector(...v);
        }

        /**
         * 构建分量全为 *1* 的向量
         * 
         * @param { number } [dim=2] 向量维度 
         * @returns { Vector } 向量
         * @example let v = new Vector.ones(3);  //vector(1, 1, 1);
         */
        static ones(dim=2) {
            return new Vector(...Array(dim).fill(1))
        }

        /**
         * 构建分量全为 *0* 的向量
         * 
         * @param { number } [dim=2] 向量维度 
         * @returns { Vector } 向量
         * @example let v = new Vector.zeros(3);  //vector(0, 0, 0);
         */
        static zeros(dim=2) {
            return new Vector(...Array(dim).fill(0))
        }

        /**
         * 生成指定范围内的随机向量
         * 
         * @param { Array[] } range - 向量分量范围，v.dim == range.length
         * @param { boolean } isint - 分量值类型 true(int) | false(float)
         * @returns { Vector } 向量
         * @example 
         * Vector.random([[1, 3], [1, 3]]);          //vector(1.13, 2.54)
         * Vector.random([[1, 3], [1, 3]], true);    //vector(1, 2)
         * Vector.random([[1, 3], [1, 3], [4, 7]]);  //vector(2.13, 0.54, 5.56)
         */
        static random(range=[], isint=false) {
            let v = [], r = 0;
            for(let i=0, end=range.length; i<end; i++){
                r = Math.random() * (range[i][1] - range[i][0]) + range[i][0];
                isint ? v.push(parseInt(r)) : v.push(r);
            }
            return new Vector(...v);
        }

        /**
         * 生成一个圆范围内的随机二维向量: 模长范围在[sR, eR]，方向随机
         * 
         * @param { number } sR - 向量模长起始值(sR>0) 
         * @param { number } eR - 向量模长终止值(eR>0)
         * @returns { Vector } 向量
         * @example
         * Vector.rcv(300);       //向量模长为300, 方向随机
         * Vector.rcv(100, 300);  //向量模长范围为(100, 300), 方向随机
         */
        static rcv(sR, eR=null) {
            let rad = Math.random() * (Math.PI * 2);
            let r = (eR == null ? Math.random()*sR : Math.random()*(eR-sR)+sR);
            return new Vector(Math.cos(rad)*r, Math.sin(rad)*r);
        }

        /**
         * 向量加法: 向量的对应分量相加  
         * 当操作数维数小于当前向量维数: 空缺分量默认值作为 *0* 处理  
         * 当操作数维数大于当前向量维数: 操作数分量将截取到当前向量维数进行计算
         * 
         * @param { Vector } vector - 操作数 
         * @returns { Vector } this
         * @example
         * //维数相同的情况
         * let v1 = new Vector(1, 2, 3);
         * let v2 = new Vector(4, 5, 6);
         * v1.add(v2);  // v1 -> vector(5, 7, 9)  
         * 
         * //维数不同的情况
         * let v1 = new Vector(1, 2, 3);
         * v1.add(new Vector(1, 2, 3, 4, 5));  // v1 -> vector(2, 4, 6)
         * v1.add(new Vector(1, 2));           // v1 -> vector(2, 4, 3)
         */
        add(vector){
            for(let i=0, end=this.v.length; i<end; i++) {
                this.v[i] += (vector.v[i] || 0);
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

        /**
         * 标量乘法: 数k乘以向量的每个分量
         * 
         * @param { number } k - 操作数 
         * @returns { Vector } this
         * @example
         * let v1 = new Vector(1, 2, 3); 
         * v1.mult(2);  //vector(2, 4, 6)
         */
        mult(k) {
            for(let i=0, end=this.v.length; i<end; i++) {
                this.v[i] *= k;
            }
            return this;
        }
        static mult(vector, k) {
            return vector.clone().mult(k);
        }

        /**
         * 向量减法: 可以视作向量加法的特殊情况 v1.add(v2.mult(-1))
         * 
         * @param { Vector } vector - 操作数
         * @returns { Vector } this
         * @example
         * let v1 = new Vector(1, 2, 3);
         * let v2 = new Vector(4, 5, 6);
         * v1.sub(v2);  //vector(-3, -3, -3)
         */
        sub(vector){
            //向量方法实现
            // return this.add(vector.clone().mult(-1));
            //计算优化实现
            for(let i=0, end=this.v.length; i<end; i++) {
                this.v[i] -= (vector.v[i] || 0);
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

        /**
         * 标量积(点积):   
         * v1·v2 -> sum(v1[i]*v2[i]) -> |v1|*|v2|*cos(rad)
         * 
         * @param { Vector } vector - 操作数 
         * @returns { number } 标量积
         * @example new Vector(1, 1).dot(new Vector(1, 1));  //2
         */
        dot(vector) {
            let t = 0;
            for(let i=0, end=this.v.length; i<end; i++) {
                t += this.v[i] * (vector.v[i] || 0);
            }
            return t;
        }
        /** 标量积(点积) */
        inner(vector) {
            return this.dot(vector);
        }

        /**
         * 线性组合(Linear Combination):  
         * lc = v1*w[1] + v2*w[2] + ... + vn*w[n]  
         * condition: vectors[i].dim() == w.length
         * 
         * @param { Vector[] } vectors - 向量组 
         * @param { number[] } w - 权
         * @returns { Vector } 向量
         * @example
         * LC([
         *     new Vector(1, 1),
         *     new Vector(2, 2),
         *     new Vector(3, 3),
         * ], [6, 3, 2]);  //vector(18, 18)
         */
        static LC(vectors, w) {
            let v = Vector.zeros(vectors[0].dim());
            for(let i=0, n=vectors.length; i<n; i++) {
                v.add(vectors[i].clone().mult(w[i]));
            }
            return v;
        }

        /**
         * 线性映射(Linear Mapping):   
         * 对向量进行线性变换，有以下两种实现方式:  
         *   * 行向量: 设 vi 为 m[i] 构成的行向量，则 LM(m) -> o.add(v.dot(vi)), 即 v 与 vi 的点积之和
         *   * 列向量: 设 vk 为 m[i][k=(1, 2, 3...)] 的列向量，则 LM(m) -> LC(vk, v), 即以 v 的分量为权，对m的列向量的线性组合
         * 
         * @param { Array[] } m - 映射矩阵(数组形式)
         * @returns { Vector } 映射后的向量
         */
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

        /**
         * 线性插值:  
         * v(t) = (1-t)*v1 + t*v2 -> v1 + t*(v2-v1)
         * 
         * @param { Vector } vector - 目标向量 
         * @param { number } t - [0, 1] 
         * @returns { Vector } 向量
         */
        lerp(vector, t) {
            return (t>0 && t<1) ? vector.clone().sub(this).mult(t).add(this) : (t<=0 ? this.clone() : vector.clone());
        }
        static lerp(v_from, v_to, t) {
            return v_from.lerp(v_to, t);
        }

        /**
         * 二维向量的旋转变换: 对向量(dim=2)进行旋转(线性变换)
         * 
         * @param { number } rad - 旋转角度 
         * @param { boolean } angle - rad参数格式 -> true(弧度)|false(角度)
         * @returns { Vector } this
         * @example
         * v.rotate(Math.PI/4); 
         * v.rotate(45, true);
         */
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

        /**
         * 维度(分量数)(get/set)
         * 
         * @param { number } [n=null] 设置的向量维度(int & n>0)
         * @returns { number | Vector } 当前的向量维度，v.dim() -> int | v.dim(3) -> this
         * @example
         * let v = new Vector([1, 3, 5, 7]);
         * v.dim();   //4
         * v.dim(3);  //vector(1, 3, 5)
         * v.dim(5);  //vector(1, 3, 5, 7, 0);
         */
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

        /**
         * 模长(get/set)
         * 
         * @param { number } n - 设置的模长
         * @returns { number | Vector } 当前的向量模长，v.norm() -> float | v.norm(3) -> this
         * @example 
         * let v = new Vector(3, 4);
         * v.norm();   //5
         * v.norm(1);  //设置向量的模长为1
         */
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

        /**
         * 单位化: v.norm(1)
         * 
         * @returns { Vector } this
         */
        normalization() {
            let _norm = this.norm();
            (_norm != 0) && this.mult(1/_norm);
            return this;
        }

        /**
         * 模长限制器: 当向量模长超过范围边界值时，设置模长为邻近的边界值
         * 
         * @param { number } max - 最大值边界
         * @param { number } min - 最小值边界
         * @returns { Vector } this
         * @example 
         * v.limit(5);     //(0 < v.norm() <5)
         * v.limit(2, 5);  //(2 < v.norm() <=5)
         */
        limit(max, min=null) {
            let _max, _min, _norm = this.norm();
            if(min == null){_min=0, _max=Math.abs(max);} else {_min=Math.abs(max), _max=Math.abs(min);}
            (_norm>=_min && _norm<=_max) ? null : this.norm(_norm>_max ? _max : _min);
            return this;
        }

        /**
         * 复制向量
         * 
         * @returns { Vector } 复制的向量
         */
        clone() {
            return new Vector(...this.v);
        }
        /**
         * 复制向量
         * 
         * @returns { Vector } 复制的向量
         */
        copy() {
            return this.clone();
        }

        /**
         * 计算两个向量之间的欧式距离(坐标视角)
         * 
         * @param { Vector } vector - 目标向量 
         * @returns { number } 与目标向量的欧式距离
         * @example
         * v1.dist(v2);  //v1与v2的欧式距离
         * v1.dist();    //v1到原点的距离(v.norm())
         */
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

        /**
         * 计算两个向量之间的弧度差(极坐标视角)
         * 
         * @param { Vector } vector - 目标向量 
         * @returns { number } 弧度差
         * @example
         * v1.rad(v2);  //v1与v2的弧度差
         * v1.rad();    //v1与x轴正方向的弧度差
         */
        rad(vector=null) {
            let x = this.v[0], y = this.v[1];
            let rad = Math.atan(y/x);
            rad = (x>=0) ? (y >= 0 ? rad : Math.PI*2 + rad) : (Math.PI + rad);
            return  vector ? rad - vector.rad() : rad;
        }
        static rad(v1, v2) {
            return v1.rad(v2);
        }

        /**
         * 整数化: 将分量转换成整数
         * 
         * @returns { Vector } this
         * @example
         * let v = new Vector(1.23, 2.45, 5.44);
         * v.toint();  //vector(1, 2, 5)
         */
        toint() {
            for(let i=0, end=this.v.length; i<end; i++) { this.v[i] = parseInt(this.v[i]);}
        }

        /**
         * 判断向量的分量是否在指定范围
         * 
         * @param { Array[] } range - 分量范围
         * @returns { boolean } 判定结果
         * @example
         * new Vector(1, 2).in([[1, 5], [1, 5]]);  //true
         * new Vector(1, 2).in([[1, 5], [0, 1]]);  // false
         */
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

        /**
         * 从坐标数组中构建向量:  
         * [[x1, y1], [x2, y2], ..., [xn, yn]] -> [v1, v2, ..., vn]
         * 
         * @param { Array[] } ps - 坐标点的数组形式
         * @returns { Vector[] } 坐标点的向量形式
         * @example
         * Vector.vpoints([[100, 100], [200, 200]]);  //-> [Vector(100, 100), Vector(200, 200)]
         */
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

    /**
     * @module   
     * @desc     粒子类: 基于向量模拟抽象粒子的运动
     * @project  Vision
     * @author   Ais
     * @date     2022-07-10
     * @version  0.1.0
    */


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
            this.p = position || new Vector$1(0, 0);
            this.v = velocity || new Vector$1(0, 0);
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

    /**
     * @module
     * @desc     鸟群算法(boids: bird-oid object): 集群行为模拟
     * @project  Vision
     * @author   Ais
     * @date     2023-03-19
     * @version  0.1.0
    */


    /** 鸟群个体(基准模型:M0) */
    class Boid extends Particle {

        /** 
         * 基础规则集 
         * @memberof Boid
         * @property { function } alignment  - 对齐行为: 个体的速度倾向于与感知野中其他个体的速度保持一致
         * @property { function } separation - 分离行为: 个体有远离周围个体的趋势，防止相互碰撞
         * @property { function } cohesion   - 靠近行为: 个体有向感知野中其他个体中心位置的移动趋势
         * 
         * @param { Boid } tp - 目标对象 
         * @param { Boid[] } ns - tp的邻近集
         * @returns { Vector } 行为规则产生的行为向量
         * 
        */
        static RuleSet = {
            alignment: (tp, ns) => {
                let v_ali = new Vector$1(0, 0);
                for(let i=0, n=ns.length; i<n; i++) { 
                    v_ali.add(ns[i].v); 
                }
                return v_ali.mult(1/ns.length);
            },
            separation: (tp, ns) => {
                let v_sep = new Vector$1(0, 0);
                for(let i=0, n=ns.length; i<n; i++) { 
                    let r = tp.p.dist(ns[i].p);
                    v_sep.add(Vector$1.sub(tp.p, ns[i].p).norm(1/r*r)); 
                }
                return v_sep;
            },
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

        /**
         * @classdesc 鸟群个体(基准模型)，集群行为模拟
         * 
         * @property { number } R - 感知(视野)范围: 用于计算邻近集。
         * @property { Array } K - 种群特征值(权重数组): 用于与规则集产生的向量进行线性组合。
         * @property { callable } visual_field - 视野场: 用于定义个体的感知野，默认采用半径R的环形视野。
         * @property { callable[] } rules - 集群行为规则集
         * @property { Vector } acc - 速度增量  
         * 
         * @param { Vector } p - 初始位置向量
         * @param { Vector } v - 初始速度向量 
         * @param { number } R - 感知(视野)范围
         * @param { Array } K - 种群特征值
         * 
         * @example
         * new vision.Boids.Boid(
         *     Vector.random([[0, canvas.width], [0, canvas.height]]),
         *     Vector.random([confs.vR, confs.vR]),
         *     confs.view_rad,
         *     confs.K,
         * );
         */
        constructor(p, v, R, K) {
            super(p, v);
            this.R = R;
            this.K = K;
            this.visual_field = (tp, ns) => { return ns };
            this.rules = [
                Boid.RuleSet.alignment,
                Boid.RuleSet.separation,
                Boid.RuleSet.cohesion
            ];
            this.acc = new Vector$1(0, 0);
        }

        /**
         * 规则集作用: 对个体进行规则集的作用，在 action 之前调用。
         * @param { Boid[] } ns - 个体感知野范围内的邻近集 
         */
        rules_action(ns) {
            if(ns.length == 0) { return }
            ns = this.visual_field(this, ns);
            let rule_vectors = [];
            for(let i=0, n=this.rules.length; i<n; i++) {
                rule_vectors[i] = this.rules[i](this, ns);
            }
            this.acc.add(Vector$1.LC(rule_vectors, this.K));
        }

        /** 行为迭代 */
        action() {
            this.p.add(this.v.add(this.acc));
            this.acc = new Vector$1(0, 0);
            return this.p;
        }
    }


    /**
     * 鸟群模型规则集作用中间件
     * 作为粒子系统(ParticleSystem)的action中间件，用于 Boid.rules_action 的调用。
     * 
     * @param { NNS.NearestNeighborSearch } nns - 邻近搜索算法模块
     * 
     * @returns { function } ParticleSystem action 中间件
     * 
     * @example
     * pcs.action_middlewares.before.push(
     *     boids_middlewares(
     *         new vision.NNS.GridNNS([], function(obj){ return obj.p }, 100)
     *     )
     * );
     * 
     */
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

    /**
     * @module
     * @desc     L-System(L系统): 一种并行重写系统和一种形式语法
     * @project  Vision
     * @author   Ais
     * @date     2022-09-11
     * @version  0.1.0
    */


    /** L系统 */
    class LSystem {

        /**
         * @classdesc L系统: 一种并行重写系统和一种形式语法
         * 
         * @property { string } S - 系统起始状态(公理)
         * @property { string } V - 符号表(终结符号&非终结符)
         * @property { object } P - 生成式
         * @property { object } ops - 符号->行为映射表
         * 
         * @param { string } S - 系统起始状态(公理)
         * @param { string } V - 符号表(终结符号&非终结符)
         * @param { object } P - 生成式
         * @param { object } ops - 符号->行为映射表
         * 
         * @example
         * ls = new LSystem({
         *      "S": "A",
         *      "V": ["A", "B", "[", "]"],
         *      "P": {
         *          "A": "B[A]A",
         *          "B": "BB"
         *      },
         *      "ops": {
         *          "A": (st) => {
         *              canvas.line(st.p.clone(), st.p.add(st.v));
         *          },
         *          "B": (st) => {
         *              canvas.line(st.p.clone(), st.p.add(st.v));
         *          },
         *          "[": (st) => {
         *              st.stack.unshift([st.p.clone(), st.v.clone()]);
         *              st.v.rotate(st.rad);
         *          },
         *          "]": (st) => {
         *              let status = st.stack.shift();
         *              st.p = status[0], st.v = status[1];
         *              st.v.rotate(-st.rad);
         *          }
         *      }
         *  });
         * 
         */
        constructor({S="", V=[], P={}, ops={}} = {}) {
            this.S = S;
            this.V = V;
            this.P = P;
            this.ops = ops;
        }

        /**
         * 迭代: 根据生成式生成下一代语句
         * @param { string } s - 语句 
         * @returns { string } 下一代语句
         */
        next(s=this.S) {
            let _s = "";
            for(let i=0, n=s.length; i<n; i++) {
                _s += (s[i] in this.P ? this.P[s[i]] : s[i]);
            }
            return _s;
        } 

        /**
         * 推导(重复迭代): 根据生成式从公理出发推导到第n代语句
         * @param { number } n - 迭代代数(int & n>=0)
         * @returns { string } 推导出的语句
         */
        gen(n=0) {
            let s = this.S;
            for(let i=0; i<n; i++) {
                s = this.next(s);
            }
            return s;
        }

        /**
         * 推导(迭代器): 以迭代器的形式进行推导，用于输出中间代语句
         * @param { number } n - 迭代代数(int & n>=0)
         * @returns { Iterator } 迭代器
         * @example
         * it = ls.iter(5);
         * it.next().value;
         */
        *iter(n=0) {
            let s = this.S;
            for(let i=0; i<n; i++) {
                s = this.next(s);
                yield s;
            }
        }

        /**
         * 绘制/行动: 根据语句和ops进行绘制
         * @param { string } s - 语句 
         * @param { Object } status - 状态表
         * @returns { Object } 状态表
         * @example
         * ls.act(ls.gen(5), {
         *     "p": new Vector(canvas.cx, canvas.height),
         *     "v": new Vector(0, -10),
         *     "rad": Tools.ATR(45),
         *     "stack": []
         *  })
         */
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

        /**
         * 绘制/行动(迭代器模式)
         * @param { string } s - 语句 
         * @param { Object } status - 状态表
         * @returns { Iterator } 迭代器
         * @example
         * act_it = ls.act(ls.gen(3), {
         *     "p": new Vector(canvas.cx, canvas.height),
         *     "v": new Vector(0, -1),
         *     "rad": Tools.ATR(25),
         *     "stack": []
         * });
         * act_it.next();
         */
        *actIter(s, status) {
            for(let i=0, n=s.length; i<n; i++) {
                yield (s[i] in this.ops) && this.ops[s[i]](status);
            }
        }

    }

    /**
     * @module
     * @desc     曼德勃罗特集
     * @project  Vision
     * @author   Ais
     * @date     2022-12-06
     * @version  0.1.0
    */


    /** 复数 */
    class Complex {

        /**
         * @classdesc 复数: 实现复数计算
         * 
         * @property { number } r - 实部
         * @property { number } i - 虚部
         * 
         * @param { number } r - 实部
         * @param { number } i - 虚部
         * 
         * @example
         * let c = new Complex(1, 1);
         */
        constructor(r, i) {
            //实部
            this.r = r;
            //虚部
            this.i = i;
        }

        /**
         * 复数加法
         * @param { Complex } 操作数 
         * @returns { Complex } this
         */
        add(complex) {
            this.r += complex.r;
            this.i += complex.i;
            return this;
        }

        /**
         * 复数乘法: (a+bi)(c+di)=(ac-bd)+(bc+ad)i
         * @param { Complex } 操作数 
         * @returns { Complex } this
         */
        mult(complex) {
            let a = this.r, b = this.i, c = complex.r, d = complex.i;
            this.r = a * c - b * d;
            this.i = b * c + a * d;
            return this;
        }

        /**
         * 计算模长
         * @returns { number } 模长
         */
        norm() {
            return Math.sqrt(this.r * this.r + this.i * this.i);
        }

    }


    /**
     * 曼德勃罗特集: Z(n+1) = Z(n) ^ 2 + C
     * 
     * 判断给定参数(C)经过有限次迭代是否收敛
     * 
     * @param { Complex } C - 复数参数 
     * @param { number } n - 迭代次数(int&n>0)
     * 
     * @returns { Array } [是否属于该集合, 迭代次数]
     * 
     * @example
     * Mandelbrot_Set(new Complex(0, 0)) -> [true, n]
     */
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


    /**
     * 朱利亚集: Z(n+1) = Z(n) ^ 2 + C
     * 
     * 固定参数C, 判断Z0是否在有限次迭代后收敛
     * 
     * @param { Complex } Z0 - 初始迭代参数 
     * @param { Complex } C - 固定复数参数
     * @param { number } n - 迭代次数(int&n>0)
     * 
     * @returns { Array } [是否属于该集合, 迭代次数]
     * 
     * @example 
     * Julia_Set(new Complex(0, 0), new Complex(-0.8, 0.156)) -> [true, n]
     */
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

    /**
     * @module
     * @desc     邻近搜索算法: 在向量集中搜索给定目标向量的邻近集 
     * @project  Vision
     * @author   Ais
     * @date     2023-01-30
     * @version  0.1.0
    */


    /** 邻近搜索算法(基类) */
    class NearestNeighborSearch {

        /**
         * @classdesc 邻近搜索算法模块，用于在向量集中搜索给定目标向量的邻近元素集
         * 
         * @property { Object[] } ps - 对象集，算法基于该属性进行数据结构的构建与邻近集的计算
         * @property { callable } vect - 向量提取器(可调用对象), 用于从对象中提取向量作为算法处理单元
         * @property { bool } IS_LOOP_BORDER - 循环边界标记, 用于标记算法是否在循环边界下进行计算
         * 
         * @param { Object[] } ps - 对象集 
         * @param { callable } vect - 向量提取器
         * 
         * @example
         * let NNS = new NearestNeighborSearch(ps, function(particle){return particle.p;});
         * 
         * @question 怎样让算法模块支持其他距离计算方式
         * NNS(NearestNeighborSearch)算法模块通过 "vect" 属性从对象中提取出一个向量对象(Vector)
         * 作为算法的计算处理单元，默认情况下通过 "Vector.dist" 计算的是欧式距离，为了使算法模块支持
         * 其他的距离计算类型(比如曼哈顿距离)，可以从 "Vector" 类派生一个子类，并重写 "dist" 方法来实现。
         */
        constructor(ps, vect) {
            /**
             * 向量提取器
             * 给定一个对象，从中提取出向量对象(Vector)作为算法的处理单元
             * 设计该属性的目的是为了提高模块可处理对象的适应性，并让算法的处理单元统一成向量对象。
             * @param { Object } obj - 处理对象
             * @returns { Vector } 对象的某个向量属性
             * @example this.vect = function(particle_obj) { return particle_obj.p }
             */
            this.vect = vect || function(obj) { return obj; };
            this.ps = ps;
            this.IS_LOOP_BORDER = false;
        }

        /**
         * 构建算法的数据结构  
         * 更新 this.ps 属性并基于对象集(ps)构建算法数据结构，主要用于使用数据结构(状态)进行邻近集计算的算法实现，当ps的状态发生变化时，通过该方法重新构建内部数据结构。
         * 
         * @param { Object[] } [ps=null] ps -  对象集
         * @returns { NearestNeighborSearch } this
         * @example 
         * let NNS = new NearestNeighborSearch(ps).build();
         * let NNS = new NearestNeighborSearch().build(ps);
         */
        build(ps=null) {
            this.ps = ps || this.ps;
            return this;
        }

        /**
         * 生成距离(dist)邻近集: 根据距离(dist)计算目标对象(tp)在对象集(ps)中的邻近集
         * 
         * @param { Object } tp - 目标对象(与对象集(ps)中的元素类型一致，或者具有必要属性(从鸭子类型的观点来看))
         * @param { number } dist - 算法的判定距离(dist>=0)
         * @returns { Object[] } 邻近集([ps[i], ps[k], ps[j], ...])
         * @example let ns = new NearestNeighborSearch(ps).near(tp, 100);
         */
        near(tp, dist) {
            return [];
        }

        /**
         * 生成"k"邻近集: 给定目标对象(tp), 计算在对象集(ps)中, 离"tp"最近的"k"个元素
         * 
         * @param { Object } tp - 目标对象
         * @param { number } k - k个最近的元素(k >= nps.length)
         * @returns { Object[] } 邻近集([ps[i], ps[k], ps[j], ...])
         * @example let ns = new NearestNeighborSearch(ps).k_near(tp, 5);
         */
        k_near(tp, k) {
            return [];
        }

        /**
         * 计算对象集的邻近集: 计算给定对象集中每个元素的邻近集
         * 
         * @param { number } d - dist or k, 根据模式确定
         * @param { enum } mode - "dist" || "k" 
         * @returns { Object[] } 邻近集([{"tp": ps[i], "nps": [...]}, ...])
         * @example
         * let ns = new NearestNeighborSearch(ps).nps(100);
         * let ns = new NearestNeighborSearch(ps).nps(5, "k");
         * 
         * @todo 计算结构优化
         */
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

        /**
         * 将邻近集转换成图结构
         * 
         * @param { Object[] } nps - 邻近集 
         */
        static toGraph(nps) {
            return ;
        }
    }


    //线性邻近搜索
    class LinearNNS extends NearestNeighborSearch {

        /**
         * @classdesc 线性邻近搜索，通过遍历对象集(ps)来计算目标对象(tp)的邻近集
         * 
         * @description 
         * 由于该算法结构简单，并且不要维护内部数据结构支撑算法计算(无状态)，因此适用于 ps 对象动态变化的场景，
         * 比如可以在 boids 算法中用来计算邻近视野中的对象。但是缺点也很明显，算法的计算量依赖于 ps 的规模，
         * 当 ps 规模过大时，算法效率会很低。
         * 
         * @param { Object[] } ps - 对象集 
         * @param { callable } vect - 向量提取器
         * @example let LNNS = new LinearNNS(ps, function(particle){return particle.p;});
         */
        constructor(ps, vect) {
            super(ps, vect);
        }

        /**
         * dist邻近集
         * 
         * @override
         * @param { Object } tp - 目标对象 
         * @param { number } dist - 判定距离(dist>=0)
         * @param { Object[] } [ps=null] ps - 对象集，该参数将覆盖 this.ps 进行计算 
         * @returns { Object[] } 邻近集([ps[i], ps[k], ps[j], ...])
         */
        near(tp, dist, ps=null) {
            ps = ps || this.ps;
            let tp_v = this.vect(tp), nps = [];
            for(let i=0, n=ps.length; i<n; i++) {
                (!(tp === ps[i]) && tp_v.dist(this.vect(ps[i])) <= dist) && nps.push(ps[i]);
            }
            return nps;
        }

        /**
         * k邻近集
         * 
         * @override
         * @param { Object } tp - 目标对象 
         * @param { number } k - k个最近的元素(k >= nps.length)
         * @param { Object[] } [ps=null] ps - 对象集，该参数将覆盖 this.ps 进行计算 
         * @returns { Object[] } 邻近集([ps[i], ps[k], ps[j], ...])
         */
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

        /**
         * @classdesc 网格邻近搜索，基于 LinearNNS 算法进行优化
         * 
         * @description
         * 算法的基本思路是将目标数据(ps)的向量空间划分成网格，网格中的单元格尺寸为 *dn*, 单元格维度取决于
         * 目标数据维度。通过将目标数据(ps)映射到网格空间中的位置矢量，来存储目标数据对象。在这种映射下，
         * 位置间距小于单元格对角线长度(最大距离)的对象会存储在相同的单元格(或邻近的单元格)，在进行邻近搜索时，
         * 将目标对象(tp)映射到网格空间坐标，并直接读取该单元格(或半径R内邻近单元格)中存储的对象。得到一个近似邻近集，
         * 再对这个近似解进行精确搜索。以减少 LinearNNS 算法中的无效计算。
         * GridNNS 算法有以下特征:
         * 1. "dn" 参数对算法的影响:  
         *     "dn"参数越小，算法所需的存储空间越大，"dn"参数越大，算法的计算量越接近 LinearNNS 算法。
         *     当 dn 大于等于目标数据边界大小的情况下，退化成 LinearNNS 算法。
         * 2. 动态数据:   
         *     相对于 LinearNNS 算法，该算法是一个具有内部状态的算法，因此在 "ps" 变动的场景下，需要通过 "build" 方法更新内部状态。
         * 3. 有限空间:   
         *     该算法适用于数据集聚集在一个有限空间下，当数据集中离散点过多，会导致更多的存储空间开销。
         * 4. 数据集分量范围限制:  
         *     对于数据集的 dsr(数据集分量范围) 不能为负数，因为在将数据的向量坐标映射到存储容器索引时，存储容器的索引范围是 [0, N+)，因此数据集中的
         *     向量分量不能为负数。但是可以通过对数据集进行整体平移来解决该限制。这是由于在采用欧式距离计算的情况下，该邻近搜索算法具有"平移不变性"，
         *     即对数据集整体平移一个向量(v)，给定目标向量(同时进行平移操作)的邻近集不变。
         * 5. 边界条件:   
         *     当目标数据在 dsr(数据集分量范围) 外时，算法需要对该情况进行特殊处理。
         * 
         * 
         * @property { number } dn - 网格单元大小(int & dn>0)
         * @property { number[] } dsr - 数据集分量范围([min, max])，其长度等于数据集向量维度。每个单元代表数据集对应的分量范围
         * @property { Vector } dst - 数据集非负平移量，用于解决"数据集分量范围限制"，基于 dsr 构建。在存储数据到 grid 容器时，需要对目标数据进行平移操作
         * @property { number[] } size - 网格容器尺寸(像素坐标)，要划分成网格的原始空间尺寸
         * @property { GridNNS.GridContainer } grid - 网格数据存储容器，为算法提供数据结构支撑
         * 
         * @param { Object[] } ps - 对象集 
         * @param { callable } vect - 向量提取器
         * @param { number } [dn=100] - 网格单元大小
         * @param { number[] } [dsr=null] - 数据集分量范围
         * 
         * @example
         * let GNNS = new GridNNS(ps, function(particle){return particle.p;}, 150).build();
         * let GNNS = new GridNNS(ps, function(particle){return particle.p;}, 150, [0, canvas.width, 0, canvas.height]).build();
         */
        constructor(ps, vect, dn=100, dsr=null) {
            super(ps, vect);
            this.dn = dn;
            this.dsr = dsr;
            this.dst = null;
            this.size = null;
            this.grid = null;
        }

        /**
         * 网格数据存储容器构造器
         * @param { number } dn - 网格单元大小(int & dn>0) 
         * @param { number[] } size - 网格容器尺寸
         * @returns { GridNNS.GridContainer } 网格数据存储容器
         */
        static GridContainer(dn, size) {

            /** 网格数据存储容器构造器 */
            class GridContainer {

                /**
                 * @classdesc 网格数据存储容器，为 "GridNNS" 算法提供数据结构支撑
                 * 
                 * @description
                 * * 数据结构设计:  
                 * 该数据容器通过一维数组(实际存储结构)来模拟高维数组(逻辑存储结构)。
                 * 内部采用一个映射算法(index), 将高维数组坐标映射到实际存储结构的一维数组索引。
                 * 之所以采用"坐标映射索引"而不是"数组下标索引"的原因在于，"数组下标索引"无法适配
                 * 高维数据的场景，对于二维数组来说，需要通过 "arr[y][x]" 这种硬编码的方式进行数据
                 * 的访问，但是当维数变化时，该方式就不适用了，比如三维数组(arr[z][y][x])。
                 * * 坐标映射算法设计:  
                 * 设   
                 *     ds = [x, y, z, ...] 为高维数组(逻辑存储结构)的尺寸，  
                 *     p  = [x, y, z, ...] 为高维数组上数据的坐标向量    
                 * 则 index(dim) 坐标映射索引函数的递归结构如下:  
                 *     index(1) -> p[x]  
                 *     index(2) -> (ds[x] * p[y]) + index(1)   
                 *              -> (ds[x] * p[y]) + p[x]  
                 *     index(3) -> (ds[x] * ds[y] * p[z]) + index(2)   
                 *              -> (ds[x] * ds[y] * p[z]) + (ds[x] * p[y]) + p[x]  
                 *     ...  
                 * 由上述归纳可得:  
                 *     index(n) -> (1 * ds[x] * ... * ds[n-1]) * p[n-1] + index(n-1)  
                 * FIN  
                 * 
                 * @property { number } dn - 网格单元大小(int & dn>0) 
                 * @property { number[] } size - 原始空间尺寸(像素坐标)，要划分成网格的原始空间尺寸。
                 * @property { number[] } dsize - 网格空间尺寸(网格坐标)
                 * @property { number } length - 存储容器长度(int & length>0)
                 * @property { Array } _data - 存储容器(一维数组)
                 * @property { Array } _cache_ds - 计算缓存: 维度-尺寸系数，用于根据向量位置坐标计算存储容器索引的计算缓存
                 * @property { Array } _cache_gns - 计算缓存: 网格邻域坐标集(r=1)，用于缓存网格邻域坐标集
                 * 
                 * @param { number } dn - 网格单元大小(int & dn>0) 
                 * @param { number[] } size - 网格容器尺寸
                 * 
                 * @example let grid = GridNNS.GridContainer(10, [1920, 1080]);
                 */
                constructor(dn, size) {
                    this.dn = dn;
                    this.size = size;
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
                    /** @private */
                    this._cache_ds = null;
                    /** @private */
                    this._cache_gns = this.gns(this.dsize.length, 1);
                }

                /**
                 * 将数据集向量映射到网格空间坐标
                 * 
                 * @param { Vector } vector - 数据集向量
                 * @returns { Vector } 对应的网格空间坐标
                 */
                toGrid(vector) {
                    let v = [];
                    for(let i=0, n=vector.dim(); i<n; i++) {
                        v[i] = Math.ceil(vector.v[i]/this.dn);
                    }
                    return new Vector$1(...v);
                }

                /**
                 * 坐标映射算法: 计算网格空间坐标(逻辑存储结构)对应存储容器的索引(实际存储结构)
                 * 
                 * @param { Vector } vector - 网格空间坐标向量
                 * @returns { number } 存储容器索引(int & >=0)
                 */
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

                /**
                 * 计算网格邻域坐标集: 根据"维数"和"邻域半径"计算网格空间的邻域坐标集   
                 * 网格邻域坐标集生成算法如下:  
                 * * dim(1):   
                 *     [  
                 *         [-1], [0], [1]  
                 *     ]  
                 * * dim(2):  
                 *     [  
                 *         [-1, -1], [-1, 0], [-1, 1],  
                 *         [ 0, -1], [ 0, 0], [ 0, 1],  
                 *         [ 1, -1], [ 1, 0], [ 1, 1],   
                 *     ]  
                 * 由上述归纳可知:   
                 *     dim(n) = (dim(1) x dim(1)) ^ (n-1)  
                 * 其中 x 为笛卡尔积运算，  
                 * 即  
                 *     以 dim(1) 为基，与其自身进行 n 次笛卡尔积运算。  
                 * 设 r 为邻域半径，则基的定义如下  
                 *     base = [-r, -r+1, -r+2, ..., 0, 1, 2, r]  
                 * 则有   
                 *     dim(n) = (base x base) ^ (n-1)  
                 * FIN  
                 * 
                 * @param { number } dim - 网格坐标维数(int & dim>0)
                 * @param { number } r - 邻域半径(int & r>=1)
                 * @returns { Vector[] } 网格邻域坐标集
                 */
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

                /**
                 * 存储数据: 在原始坐标向量(p)映射的网格坐标位置存储值(val)
                 * 
                 * @param { Vector } p - 原始坐标向量
                 * @param { Object } val - 数据值 
                 * @returns { boolean } 操作状态
                 */
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

                /**
                 * 获取数据: 获取原始坐标向量(p)映射的网格坐标位置的邻域半径(r)内的数据对象
                 * 
                 * @param { Vector } p - 原始坐标向量 
                 * @param { number } [r=0] 邻域半径(int & r>=0)
                 * @returns { Object[] } 数据对象列表
                 */
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

        /**
         * 构建算法的数据结构: 将数据集存储到网格容器中
         * 
         * @override
         * 
         * @param { Object[] } [ps=null] ps -  对象集 
         * @returns { Object } this
         */
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

        /**
         * dist邻近集
         * 
         * @override
         * @param { Object } tp - 目标对象 
         * @param { number } dist - 判定距离(dist>=0)
         * @returns { Object[] } 邻近集([ps[i], ps[k], ps[j], ...])
         */
        near(tp, dist) {
            //计算网格邻域半径
            let R = Math.ceil(dist/this.dn);
            //计算网格近似邻近集
            let gnps = this.grid.get(this.vect(tp).clone().add(this.dst), R);
            //计算临近集
            return super.near(tp, dist, gnps);
        }

        /**
         * k邻近集: 当数据集离散程度较大时，在极端情况下，该算法的计算效率要低于 "LinearNNS.k_near"。
         * 
         * @override
         * @param { Object } tp - 目标对象 
         * @param { number } k - k个最近的元素(k >= nps.length)
         * @returns { Object[] } 邻近集([ps[i], ps[k], ps[j], ...])
         * 
         * @todo 计算优化，网格坐标系环形单元格坐标计算算法
         */
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

    /**
     * @module
     * @desc     optimum solution solver(最优解通用求解器): 一种简化的PSO算法，给定一个目标函数，计算该函数的数值最优解
     * @project  Vision
     * @author   Ais
     * @date     2022-07-11
     * @version  0.1.0
    */


    /** 局部最优解求解器 */
    class Solver extends Particle {

        /**
         * @classdesc 局部最优值求解器: 通过迭代来求解指定域下目标函数的局部最优解
         * 
         * @property { Function } tfunc - 目标函数
         * @property { Array[] } dod - 求解域(定义域的子域)
         * @property { string } val_type - 最优值类型("min"|"max")
         * @property { Vector } p - 局部最优解坐标
         * @property { number } val - 最优值
         * @property { Vector[] } vs - 速度集(临近坐标集)
         *  
         * @param { Function } tfunc - 目标函数 
         * @param { Vector } ps - 初始坐标 
         * @param { string } val_type - 最优值类型
         * 
         */
        constructor(tfunc, ps, val_type="min") {
            super();
            this.tfunc = tfunc;
            this.dod = [];
            this.val_type = val_type;
            this.p = ps;
            this.val = (this.val_type == "min" ? Infinity : -Infinity);
            this.vs = [];
            //停机状态
            this._END = false;
        }

        /** 迭代求值 */
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

        /** 停机 */
        isEnd() { return this._END; }
    }


    /** 求解器集群 */
    class OptimumSolutionSolvers {

        /**
         * @classdesc 求解器集群: 通过在求解域上均匀分布的求解器来求解全局最优值  
         * 
         * @description   
         * 算法思路:
         * 给定一个目标函数f(x), 其中x是定义域为R*n的向量。现在构造一个求解器s(solver), solver有一个临近坐标集，
         * 这个集合是其每次迭代后的可能位置。solver在每次迭代时从中选取f(x)的最优解进行移动，直到停机(当临近集中
         * 的所有值都不是最优时停机)。   
         * 通过上述算法构建的solver求解的可能是局部最优解。为了应对这种情况，可能通过构建一个求解器集群来避免。
         * 通过随机生成solver的初始位置，让N个solver均匀分布在定义域上。但这N个solver停机时，从中选择一个
         * 最优解作为全局最优解。
         * 
         * @property { number } n - 求解器数量
         * @property { Solver[] } - 求解器集群
         * @property { number } count - 迭代计数器, 用于控制迭代次数
         * @property { Function } tfunc - 目标函数
         * @property { Array[] } dod - 求解域(定义域的子域)
         * @property { Vector[] } vs - 速度集(临近坐标集)
         * @property { number } [vsd=1] - 求解器速度集步长
         * @property { string } val_type - 最优值类型("min"|"max")
         * @property { Vector } os_p - 全局最优值坐标
         * @property { number } os_val - 全局最优值
         * 
         */
        constructor() {
            this.n = 30;
            this.solvers = [];
            this.count = Infinity;
            this.tfunc = null;
            this.dod = [];
            this.vs = null;
            this.vsd = 1;
            this.val_type = "min";
            this.os_p = null;
            this.os_val = null;
            //停机状态
            this._END = false;
        }

        /** 初始化求解器 */
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
        
        /** 迭代求值 */
        next() {
            if(this._END || this.count<0) {
                this._END = true;
                return this.os_p;
            }
            let _END = true;
            for(let i=0, end=this.solvers.length; i<end; i++) {
                this.solvers[i].action();
                _END = _END & this.solvers[i].isEnd();
                if((this.val_type=="min" && this.solvers[i].val <= this.os_val) || (this.val_type=="max" && this.solvers[i].val >= this.os_val)) {
                    this.os_val = this.solvers[i].val; this.os_p = this.solvers[i].p;
                }
            }
            this._END = _END;
            this.count--;
            return this.os_p;
        }

        /** 停机状态 */
        isEnd() { return this._END; }
    }

    var __index__$3 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Complex: Complex,
        Julia_Set: Julia_Set,
        LSystem: LSystem,
        Mandelbrot_Set: Mandelbrot_Set,
        NNS: NNS,
        OptimumSolutionSolvers: OptimumSolutionSolvers,
        boids: Boids
    });

    /**
     * @module   
     * @desc     渲染协议
     * @project  Vision
     * @author   Ais
     * @date     2023-05-25
     * @version  0.1.0
    */


    /** @classdesc 渲染协议 */
    class VisionProtocol {

        /**
         * 刷新
         * 
         * @abstract
         * @param { number[] } color - 背景颜色
         * @param { number } width - 画布宽度
         * @param { number } height - 画布高度
         */
        refresh(color=[50, 50, 50], width=1920, height=1080) {
            
        }
        
        /**
         * 直线
         * 
         * @abstract
         * @param { number } xs - 起始点坐标 x 分量
         * @param { number } ys - 起始点坐标 y 分量
         * @param { number } xe - 终止点坐标 x 分量
         * @param { number } ye - 终止点坐标 y 分量
         * @param { Object } style - 绘制参数
         * @param { number[] } [style.color=[255, 255, 255]] - 线段颜色
         * @param { number } [style.lineWidth=1] - 线段宽度 
         */
        line(xs, ys, xe, ye, {color=[255, 255, 255], lineWidth=1}={}) {

        }

        /**
         * 圆
         * 
         * @abstract
         * @param { number } x - 圆心坐标 x 分量
         * @param { number } y - 圆心坐标 y 分量
         * @param { number } r - 圆半径
         * @param { Object } style - 绘制参数
         * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
         * @param { number } [style.lineWidth=1] - 线段宽度 
         * @param { boolean } [style.fill=false] - 填充状态
         */
        circle(x, y, r, {color=[255, 255, 255], lineWidth=1, fill=false}={}) {

        }

        /**
         * 矩形
         * 
         * @abstract
         * @param { number } x - 矩形中心坐标 x 分量
         * @param { number } y - 矩形中心坐标 y 分量
         * @param { number } rx - 矩形 x 轴半径
         * @param { number } ry - 矩形 y 轴半径
         * @param { Object } style - 绘制参数
         * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
         * @param { number } [style.lineWidth=1] - 线段宽度 
         * @param { boolean } [style.fill=false] - 填充状态
         */
        rect(x, y, rx, ry, {color=[255, 255, 255], lineWidth=1, fill=false}={}) {
           
        }

        /**
         * 折线
         * 
         * @abstract
         * @param { Point[] } points - 点集: [[x1, y1], [x2, y2], ...]
         * @param { Object } style - 绘制参数
         * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
         * @param { number } [style.lineWidth=1] - 线段宽度 
         * @param { boolean } [style.close=false] - 线段闭合状态
         */
        polyline(points, {color=[255, 255, 255], lineWidth=1, close=false}={}) {
            
        }

        /**
         * 多边形
         * 
         * @abstract
         * @param { Point[] } points - 点集: [[x1, y1], [x2, y2], ...]
         * @param { Object } style - 绘制参数
         * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
         */
        polygon(points, {color=[255, 255, 255]}={}) {
            
        }
        
    }

    /**
     * @module   
     * @desc     渲染上下文容器(基类)
     * @project  Vision
     * @author   Ais
     * @date     2023-06-07
     * @version  0.1.0
    */


    class VisionContext extends VisionProtocol {

        /**
         * @classdesc 渲染上下文容器(基类)
         * 
         * @property { Object } _context_ - 渲染上下文对象
         * @property { number } width  - 画布宽度(readonly) 
         * @property { number } height - 画布高度(readonly) 
         * @property { number } cx - 画布中心坐标 x 分量(readonly) 
         * @property { number } cy - 画布中心坐标 y 分量(readonly) 
         * @property { number[] } BGC  - 背景颜色
         * 
         * @param { number } width  - 画布宽度 
         * @param { number } height - 画布高度 
         * @param { number[] } BGC  - 背景颜色
         */
        constructor(width, height, BGC=[50, 50, 50]) {
            super();
            this._context_ = null;
            this._width = width;
            this._height = height;
            this.BGC = BGC;
        }

        get width() { return this._width; }
        get height() { return this._height; }
        get cx() { return parseInt(this._width / 2); }
        get cy() { return parseInt(this._height / 2); }

        /**
         * 初始化
         * 
         * @returns { Object } this 
         */
        init() {
            return this;
        }

        /**
         * 退出
         * 
         * @returns { Any }   
         */
        exit() {
            
        }

    }

    /**
     * @module   
     * @desc     Canvas渲染上下文容器 
     * @project  Vision
     * @author   Ais
     * @date     2023-06-07
     * @version  0.1.0
    */


    class CanvasContext extends VisionContext {
        
        /**
         * @classdesc Canvas渲染上下文容器
         * 
         * @property { Object } _canvas_  - canvas元素对象
         * @property { Object } _context_ - canvas 2d 上下文对象
         * 
         * @param { number } width  - 画布宽度 
         * @param { number } height - 画布高度 
         * @param { number[] } BGC  - 背景颜色
         * 
         * @example 
         * const context = new CanvasContext(1920, 1080, [0, 0, 0]).init("vision_canvas");
         */
        constructor(width, height, BGC=[0, 0, 0]) {
            super(
                width || window.screen.width || 1920, 
                height || window.screen.height || 2080, 
                BGC
            );
            this._canvas_ = null;
            this._context_ = null;        
        }

        /**
         * 初始化: 创建 Canvas2D 上下文对象对象
         * 
         * @param { string } canvas_element_id - canvas元素id 
         * @returns { Object } this
         */
        init(canvas_element_id) {
            this._canvas_ = document.getElementById(canvas_element_id);
            this._canvas_.width = this._width, this._canvas_.height = this._height;
            this._context_ = this._canvas_.getContext("2d");
            this.refresh();
            return this;
        }

        /**
         * 刷新画布
         * 
         * @param { number[] } color - 背景颜色
         * @param { number } width - 画布宽度
         * @param { number } height - 画布高度
         * 
         * @example
         * context.refresh();
         */
        refresh(color=null, width=null, height=null){
            this._context_.fillStyle = CanvasContext.RGB(...(color || this.BGC));
            this._context_.fillRect(0, 0, width || this.width, height || this.height);
        }

        /**
         * 绘制直线
         * 
         * @param { number } xs - 起始点坐标 x 分量
         * @param { number } ys - 起始点坐标 y 分量
         * @param { number } xe - 终止点坐标 x 分量
         * @param { number } ye - 终止点坐标 y 分量
         * @param { Object } style - 绘制参数
         * @param { number[] } [style.color=[255, 255, 255]] - 线段颜色
         * @param { number } [style.lineWidth=1] - 线段宽度 
         * 
         * @example
         * context.line(0, 0, context.width, context.height, {color: [0, 255, 0], lineWidth: 3});
         */
        line(xs, ys, xe, ye, {color=[255, 255, 255], lineWidth=1}={}) {
            let _strokeStyle = CanvasContext.RGB(...color);
            if(this._context_.strokeStyle != _strokeStyle) { this._context_.strokeStyle = _strokeStyle; }
            if(this._context_.lineWidth != lineWidth) { this._context_.lineWidth = lineWidth; }
            this._context_.beginPath();
            this._context_.moveTo(xs, ys);
            this._context_.lineTo(xe, ye);   
            this._context_.stroke(); 
        }

        /**
         * 绘制圆
         * 
         * @param { number } x - 圆心坐标 x 分量
         * @param { number } y - 圆心坐标 y 分量
         * @param { number } r - 圆半径
         * @param { Object } style - 绘制参数
         * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
         * @param { number } [style.lineWidth=1] - 线段宽度 
         * @param { boolean } [style.fill=false] - 填充状态
         * 
         * @example
         * context.circle(context.cx, context.cy, 100, {color: [0, 175, 175]});
         */
        circle(x, y, r=2, {color=[255, 255, 255], lineWidth=1, fill=true}={}) {
            let _color = CanvasContext.RGB(...color);
            if(this._context_.strokeStyle != _color) { this._context_.strokeStyle = _color; }
            if(fill && this._context_.fillStyle != _color) { this._context_.fillStyle = _color; }
            if(this._context_.lineWidth != lineWidth) { this._context_.lineWidth = lineWidth; }
            this._context_.beginPath();
            this._context_.arc(x, y, r, 0, 2*Math.PI);
            this._context_.stroke(); 
            fill && this._context_.fill();
        }

        /**
         * 绘制矩形
         * 
         * @param { number } x - 矩形中心坐标 x 分量
         * @param { number } y - 矩形中心坐标 y 分量
         * @param { number } rx - 矩形 x 轴半径
         * @param { number } ry - 矩形 y 轴半径
         * @param { Object } style - 绘制参数
         * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
         * @param { number } [style.lineWidth=1] - 线段宽度 
         * @param { boolean } [style.fill=false] - 填充状态
         * 
         * @example
         * context.rect(context.cx, context.cy, 500, 200, {color: [255, 0, 0]});
         */
        rect(x, y, rx, ry, {color=[255, 255, 255], lineWidth=1, fill=false}={}) {
            let _color = CanvasContext.RGB(...color);
            if(this._context_.strokeStyle != _color) { this._context_.strokeStyle = _color; }
            if(fill && this._context_.fillStyle != _color) { this._context_.fillStyle = _color; }
            if(this._context_.lineWidth != lineWidth) { this._context_.lineWidth = lineWidth; }
            this._context_.beginPath();
            this._context_.rect(x-rx, y-ry, rx*2, ry*2);
            this._context_.stroke();
            fill && this._context_.fill();
        }

        /**
         * 绘制折线
         * 
         * @param { Point[] } points - 点集: [[x1, y1], [x2, y2], ...]
         * @param { Object } style - 绘制参数
         * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
         * @param { number } [style.lineWidth=1] - 线段宽度 
         * @param { boolean } [style.close=false] - 线段闭合状态
         * 
         * @example
         * context.polyline([[100, 100], [300, 100], [500, 300], [400, 700]], {color:[0, 100, 255]});
         */
        polyline(points, {color=[255, 255, 255], lineWidth=1, close=false}={}) {
            //判断点集元素类型
            let isVector = (points[0].v != undefined);
            //判断是否是颜色对象
            let isColor = (color.color != undefined);
            //绘制线段
            for(let i=0, n=points.length, end=(close ? n : n-1); i<end; i++) {
                let p1 = isVector ? points[i].v : points[i];
                let p2 = isVector ? points[(i+1)%n].v : points[(i+1)%n];
                let line_color = isColor ? color.color() : color;
                this.line(p1[0], p1[1], p2[0], p2[1], {color: line_color, lineWidth: lineWidth});
            }
        }

        /**
         * 绘制多边形
         * 
         * @abstract
         * @param { Point[] } points - 点集: [[x1, y1], [x2, y2], ...]
         * @param { Object } style - 绘制参数
         * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
         * 
         * @example
         * context.polygon([[300, 500], [700, 500], [800, 700], [200, 700]], {color: [0, 200, 200]});
         */
        polygon(points, {color=[255, 255, 255]}={}) {
            //填充颜色
            let _color = CanvasContext.RGB(...color);
            if(this._context_.fillStyle != _color) { this._context_.fillStyle = _color; }
            //判断点集元素类型
            let isVector = (points[0].v != undefined);
            //绘制多边形
            this._context_.beginPath();
            let p = isVector ? points[0].v : points[0];
            this._context_.moveTo(p[0], p[1]);
            for(let i=1, n=points.length; i<n; i++) {
                p = isVector ? points[i].v : points[i];
                this._context_.lineTo(p[0], p[1]);
            }
            this._context_.fill();
        }

        /**
         * 颜色转换: 将RGBA颜色数组转换成颜色字符串(rgb格式)
         * 
         * @param { int } r - R分量 
         * @param { int } g - G分量 
         * @param { int } b - B分量
         * @param { int } a - a分量
         * @returns { string } 颜色字符串
         * 
         * @example
         * CanvasContext.RGB(50, 50, 50);   //rgb(50, 50, 50)
         * CanvasContext.RGB(50, 50, 50, 0.5);   //rgb(50, 50, 50, 0.5)
         */
        static RGB(r, g, b, a=1) {
            return (a==1) ? `rgb(${r}, ${g}, ${b})` : `rgb(${r}, ${g}, ${b}, ${a})`;
        }

        /**
         * 颜色转换: 将RGB颜色数组转换成颜色字符串(Hex格式)
         * 
         * @param { int } r - R分量 
         * @param { int } g - G分量 
         * @param { int } b - B分量
         * @returns { string } 颜色字符串
         * 
         * @example
         * CanvasContext.RGBtoHex(50, 50, 50);   //#323232
         * CanvasContext.RGBtoHex(0, 175, 175);  //#00afaf
         */
        static RGBtoHex(r, g, b) {
            r = parseInt(r > 255 ? 255 : (r < 0 ? 0 : r));
            r = r < 16 ? `0${r.toString(16)}` : r.toString(16); 
            g = parseInt(g > 255 ? 255 : (g < 0 ? 0 : g));
            g = g < 16 ? `0${g.toString(16)}` : g.toString(16); 
            b = parseInt(b > 255 ? 255 : (b < 0 ? 0 : b));
            b = b < 16 ? `0${b.toString(16)}` : b.toString(16); 
            return `#${r}${g}${b}`;
        }
    }

    /**
     * @module   
     * @desc     粒子系统: 粒子集群容器，模拟粒子的集群行为
     * @project  Vision
     * @author   Ais
     * @date     2022-07-10
     * @version  0.1.0
     * @since    (2023-03-06, Ais): ParticleSystem(粒子系统)结构优化 
    */


    //粒子系统(基类)
    class ParticleSystem {

        /**
         * @classdesc 粒子系统: 粒子集群容器，模拟粒子的集群行为
         * 
         * @property { Particle[] } ps - 粒子容器
         * @property { callable } particle_builder - 粒子生成器
         * @property { Object } action_middlewares - action中间件(钩子系统)
         * @property { callable[] } action_middlewares.before - action中间件挂载点(before)
         * @property { callable[] } action_middlewares.after - action中间件挂载点(after)
         * @property { number } max_pn - 最大粒子数(int & max_pn>0)
         * @property { number } gen_pn - 迭代过程粒子生成数(int & gen_pn>0)
         * @property { boolean } GENR - 粒子生成开关, 用于在迭代过程中生成新的粒子
         * @property { boolean } DSTR - 粒子销毁开关, 当容器中的粒子进入停机状态时，从容器中移除该粒子
         * 
         * @param { callable } particle_builder - 粒子生成器
         * @param { Object } options - 粒子生命周期控制参数
         * @param { number } [options.max_pn=500] - 最大粒子数(int & max_pn>0)
         * @param { number } [options.gen_pn=1] - 迭代过程粒子生成数(int & gen_pn>0)
         * @param { boolean } [options.GENR=false] - 粒子生成开关
         * @param { boolean } [options.DSTR=false] - 粒子销毁开关
         * 
         * @example
         * let pcs = new vision.particle.ParticleSystem(() => {
         *     return new vision.particle.ForceParticle(
         *         Vector.random([[0, canvas.width], [0, canvas.height]]),
         *         Vector.random([confs.vR, confs.vR])
         *     );
         * }, {max_pn: confs.N, gen_pn: confs.gn, GENR: confs.GENR}).build(confs.N);
         */
        constructor(particle_builder, {max_pn=500, gen_pn=1, GENR=false, DSTR=true}={}) {
            this.ps = [];
            this.particle_builder = particle_builder;
            this.action_middlewares = {
                "before": [],
                "after": [],
            };
            this.max_pn = max_pn;
            this.gen_pn = gen_pn;
            this.GENR = GENR;
            this.DSTR = DSTR;
        }

        /**
         * 构建粒子系统并进行初始化
         * 
         * @param { number } pn - 初始化生成的粒子数 
         * @returns { Object } this
         * 
         * @example particle_system.build(100);
         */
        build(pn=0) {
            this.ps = [];
            for(let i=(pn < this.max_pn ? pn : this.max_pn); i--; ) {
                this.ps.push(this.particle_builder());
            }
            return this;
        }

        /**
         * 粒子运动与生命周期管理
         * 
         * 更新粒子容器中的粒子运动状态，并进行生命周期的管理， 
         * 该方法在 action() 内部进行调用，可通过重写该方法来控制粒子运动和生命周期逻辑
         */
        particle_action() {
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

        /**
         * 粒子集群运动(迭代过程): 描述粒子集群的行为模式
         * 
         * @example particle_system.action();
         */
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

    /**
     * @module   
     * @desc     轨迹追踪器: 追踪记录目标粒子的移动轨迹
     * @project  Vision
     * @author   Ais
     * @date     2022-07-15
     * @version  0.1.0
    */


    class TrailTracker {

        /**
         * @classdesc 轨迹追踪器: 基于Hook式的方法隐式地追踪记录目标粒子的移动轨迹  
         * 通过hook目标对象的action()方法来实现隐式的轨迹追踪效果
         * 
         * @property { Particle } tp - 追踪的目标粒子
         * @property { number } tn - 轨迹长度(int & tn>0)
         * @property { Vector[] } trail - 轨迹向量容器，记录的轨迹坐标
         * 
         * @param { Particle } tp - 追踪的目标粒子 
         * @param { number } [tn=10] - 轨迹长度(int & tn>0)
         * 
         * @example
         * let p = new Particle();
         * let tracker = new TrailTracker(p, 50);
         */
        constructor(tp, tn=10) {
            this.tp = tp;
            this.tn = tn;
            this.trail = [];
            //绑定目标对象
            this._bind();
        }

        /**
         * 绑定追踪的粒子对象: 通过hook目标对象的action()方法来实现隐式的轨迹追踪效果
         * @private
         */
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

    /**
     * @module   
     * @desc     粒子(运动)组合器
     * @project  Vision
     * @author   Ais
     * @date     2023-07-27
     * @version  0.1.0
    */


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

    /**
     * @module   
     * @desc     区域类: 描述一个封闭区域，并给定一个点是否在区域内的判定算法(in)
     * @project  Vision
     * @author   Ais
     * @date     2022-07-13
     * @version  0.1.0
     * @since    (2022-07-14, Ais): 增加区域反转功能, 将method(in)的判定反转
    */


    /** @classdesc 区域类(基类) */
    class BaseArea {

        /**
         * 判断一个给定坐标是否在区域内
         * 
         * @param { Vector | number[] } p - 待判定的坐标向量 
         * @returns { boolean } 是否在区域内
         */
        in(p) {
            return true;
        }
    }


    //顶点集区域
    class Area extends BaseArea {

        /**
         * 顶点集区域: 通过一系列顶点坐标描述一个封闭区域
         * 
         * @property { Vector[] } vps - 构成区域的顶点集
         * @property { number } [offset=(Math.PI/180)*5] - 判定算法(in)的计算误差
         * @property { boolean } reverse - 区域反转标记, 将method(in)的判定反转
         * 
         * @param { Vector } vpoints - 顶点集 
         * @param { boolean } [reverse=false] - 区域反转标记
         * 
         * @example
         * let area = new Area([new Vector(0, 0), new Vector(100, 100), new Vector(50, 200)]);
         * area.in(new Vector(30, 30));
         */
        constructor(vpoints, reverse=false) {
            super();
            this.vps = vpoints;
            this.offset = (Math.PI/180)*5;
            this.reverse = reverse;
        }

        /**
         * 点是否在区域内的判定算法  
         * 求解目标点(p)与区域的顶点集(vps)构成的凸多边形的内角和(rads)，当 rads == Math.PI*2 时，p在区域内部，反之不在。  
         * PS: 该判定算法仅支持凸多边形
         * 
         * @override
         * @param { Vector } p - 待判定的坐标向量 
         * @returns { boolean } 是否在区域内
         */
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

        /**
         * 矩形区域: 通过分量范围来描述一个矩形区域(任意维)
         * 
         * @property { Array[] } borders - 矩形边界(分量)范围
         * @property { boolean } reverse - 区域反转标记
         * 
         * @param { Array[] } borders - 矩形边界(分量)范围
         * @param { boolean } reverse - 区域反转标记
         * 
         * @example 
         * let area = new ReactArea([[100, 300], [100, 300]]);
         */
        constructor(borders, reverse=false) {
            super();
            this.borders = borders;
            this.reverse = reverse;
        }

        /** @override */
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

        /**
         * 圆形区域: 描述一个圆形区域(任意维)
         * 
         * @property { Vector } po - 中心坐标
         * @property { number } r - 范围半径(r>0)
         * @property { boolean } reverse - 区域反转标记
         * 
         * @param { Vector } po - 中心坐标
         * @param { number } r - 范围半径(r>0)
         * @param { boolean } reverse - 区域反转标记
         * 
         * @example 
         * let area = new CircleArea(new Vector(100, 100), 50);
         */
        constructor(po, r, reverse=false) {
            super();
            //中心坐标
            this.po = po;
            //半径
            this.r = r;
            //区域反转标记
            this.reverse = reverse;
        }

        /** @override */
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

    /**
     * @module   
     * @desc     边界类: 对到达边界的粒子进行处理
     * @project  Vision
     * @author   Ais
     * @date     2022-07-11
     * @version  0.1.0
     * @since    (2022-07-27, Ais): 对limit()添加"r"(质心到边界的距离)参数，以支持在考虑粒子具有形状属性的情况下的限制作用
    */


    /** @classdesc 边界限制器(基类) */
    class Border {

        /**
         * 越界处理函数: 当目标发生越界时，通过该函数进行处理。
         * 
         * @param { Object } p_obj - 目标对象 
         * @param { number } [r=0] - 形状半径
         * @returns { Object } 处理后的目标对象
         */
        limit(p_obj, r=0) {
            return p_obj;
        } 
    }


    //矩形反射边界
    class RectReflectBorder extends Border {

        /**
         * @classdesc 矩形反射边界: 当目标越界时，其垂直与反射面的速度分量将被反转，产生反射效果。
         * 
         * @property { number[] } borders - 边界范围
         * @property { boolean } [on_line=true] - 边界线模式，当该参数为true时，越界时会重置目标位置到边界线上
         * 
         * @param { number[] } borders - 边界范围
         * @param { boolean } [on_line=true] - 边界线模式
         * 
         * @example 
         * let border = new RectReflectBorder([[0, canvas.width], [0, canvas.height]]);
         */
        constructor(borders, on_line=true) {
            super();
            this.borders = borders || [];
            this.on_line = on_line;
        }

        /** @override */
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

        /**
         * @classdesc 矩形循环边界: 当目标发生越界时，目标移动到当前边界的相对边界处。
         * 
         * @property { number[] } borders - 边界范围
         * 
         * @param { number[] } borders - 边界范围
         * 
         * @example
         * let border = new RectLoopBorder([[0, canvas.width], [0, canvas.height]]);
         */
        constructor(borders) {
            super();
            this.borders = borders || [];
        }

        /** @override */
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

        /**
         * @classdesc 环形反射边界: 目标越界时进行速度反射。
         * 
         * @property { Vector } po - 边界圆心坐标
         * @property { number } r - 边界半径(r>0)
         * 
         * @param { Vector } po - 边界圆心坐标
         * @param { number } r - 边界半径(r>0)
         * 
         * @example
         * let border = new RingReflectBorder(new Vector(canvas.cx, canvas.cy), 200);
         */
        constructor(po, r) {
            super();
            this.po = po;
            this.r = r;
        }

        /** @override */
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

        /**
         * @classdesc 环形循环边界: 目标越界时将其移动到目标与圆心坐标的对角位置。
         * 
         * @property { Vector } po - 边界圆心坐标
         * @property { number } r - 边界半径(r>0)
         * 
         * @param { Vector } po - 边界圆心坐标
         * @param { number } r - 边界半径(r>0)
         * 
         * @example
         * let border = new RingLoopBorder(new Vector(canvas.cx, canvas.cy), 200);
         */
        constructor(po, r) {
            super();
            //边界圆心坐标
            this.po = po;
            //边界半径
            this.r = r;
        }

        /** @override */
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

    /**
     * @module   
     * @desc     坐标系: 构建坐标系, 对向量进行坐标变换
     * @project  Vision
     * @author   Ais
     * @date     2022-08-01
     * @version  0.1.0
    */


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


    /** 坐标系(基类) */
    class CoordinateSystem {

        /**
         * PCS(主坐标系/屏幕像素坐标系) -> CS(当前坐标系): 从主坐标系转换到当前坐标系
         * 
         * @param { Vector } vector - 主坐标系目标向量
         * @returns { Vector } 转换后的当前坐标系目标向量
         */
        to(vector) {
            return vector;
        }

        /**
         * CS -> PCS: 从当前坐标系转换到主坐标系
         * @param { Vector } vector - 当前坐标系目标向量
         * @returns { Vector } 转换后的主坐标系目标向量
         */
        from(vector) {
            return vector;
        }
    }


    //实数坐标系
    class RCS extends CoordinateSystem {

        /**
         * @classdesc 实数坐标系: 将屏幕像素坐标系映射到实数域中进行计算
         * 
         * @property { Vector } co - 屏幕像素坐标系原点坐标
         * @property { number } scale - 标度比例，一个像素对应的值(scale>0)
         * 
         * @param { Vector } co - 屏幕像素坐标系原点坐标
         * @param { number } [scale=1] - 标度比例
         * 
         * @example
         * let rcs = new RCS(Vector.v(canvas.cx, canvas.cy), 0.5);
         */
        constructor(co, scale=1) {
            super();
            this._co = co;
            this._scale = scale;
        }
        
        get scale() { return this._scale; }
        set scale(val) {
            if(val <= 0) { throw Error(`scale(${val}) must be in (0, Inf)`); }
            this._scale = val;
        }
        get co() { return this._co.clone(); }

        /** @override */
        to(vector) {
            let x = ((vector.v ? vector.x : vector[0]) - this._co.x) * this._scale;
            let y = (-1)*((vector.v ? vector.y : vector[1]) - this._co.y) * this._scale;
            return vector.v ? Vector$1.v(x, y) : [x, y];
        }

        /** @override */
        from(vector) {
            let x = ((vector.v ? vector.x : vector[0]) / this._scale) + this._co.x;
            let y = ((-1)*(vector.v ? vector.y : vector[1]) / this._scale) + this._co.y;
            return vector.v ? Vector$1.v(x, y) : [x, y];
        }

        /**
         * 缩放: 对坐标系标度进行缩放  
         * 当 "zr>0" 时，进行 "放大"，标度变小  
         * 当 "zr<0" 时，进行 "缩小"， 标度变大  
         * 
         * @param { number } zr - 缩放值 
         * @returns { Object } this
         * @example
         * coor.zoom(2)   //放大2倍
         * coor.zoom(-2)  //缩小2倍 
         */
        zoom(zr) {
            zr > 0 ? this.scale /= Math.abs(zr) : this.scale *=  Math.abs(zr);
            return this;
        }

        /**
         * 平移: 对屏幕像素坐标系原点坐标(co)进行平移
         * 
         * @param { Vector } vector - 平移坐标 
         * @returns { Object } this
         * @example
         * //向右平移100个像素
         * coor.move(Vector.v(-100, 0));  
         */
        move(vector) {
            this._co.add(vector.v ? vector : Vector$1.v(...vector));
            return this;
        }
    }


    //网格坐标系
    class Grid extends CoordinateSystem {

        /**
         * @classdesc Grid(网格坐标系): 将屏幕像素坐标系映射到网格坐标系
         * 
         * @property { Vector } co - 屏幕像素坐标系原点坐标
         * @property { number } dx - 网格单元x轴尺寸(dx>0)
         * @property { number } dy - 网格单元y轴尺寸(dx>0)
         * @property { boolean } RY - y轴反转标记 -> true(向上) | false(向下)
         * 
         * @param { Vector } co - 屏幕像素坐标系原点坐标
         * @param { number } [dx=1] - 网格单元x轴尺寸(dx>0)
         * @param { number } [dy=1] - 网格单元y轴尺寸(dx>0) 
         * @param { boolean } [RY=false] - y轴反转标记
         * 
         * @example
         * let grid = new Grid(new Vector(canvas.cx, canvas.cy), 10, 10, true);
         */
        constructor(co, dx=1, dy=1, RY=false) {
            super();
            this.co = co;
            this._dx = dx;
            this._dy = dy;
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
        
        /**
         * PCS -> Grid: 单元格内的坐标会映射到同一点
         * 
         * @override
         * @param { Vector } vector - 主坐标系目标向量 
         * @returns { Vector } 网格坐标系的目标向量
         */
        to(vector) {
            let x = Math.round(((vector.v ? vector.v[0] : vector[0]) - this.co.x) / this.dx);
            let y = Math.round(((vector.v ? vector.y : vector[1]) - this.co.y) / this.dy) * this._RY;
            return vector.v ? Vector$1.v(x, y) : [x, y];
        }

        /** @override */
        from(vector) {
            let x = this.dx * (vector.v ? vector.x : vector[0]) + this.co.x;
            let y = this.dy * (vector.v ? vector.y : vector[1]) * this._RY + this.co.y;
            return vector.v ? Vector$1.v(x, y) : [x, y];
        }

    }


    //极坐标系
    class PolarCS extends CoordinateSystem {

        /**
         * @classdesc 极坐标系: 将屏幕像素坐标系映射到极坐标系
         * 
         * @property { Vector } co - 屏幕像素坐标系原点坐标
         * 
         * @param { Vector } co - 屏幕像素坐标系原点坐标
         * 
         * @example
         * let coor = new PolarCS(new Vector(canvas.cx, canvas.cy));
         */
        constructor(co) {
            super();
            this.co = co;
        }

        /**
         * PCS -> PolarCS
         * 
         * @param { Vector | Array } vector - 主坐标系目标向量 
         * @returns { Vector | Array } 极坐标系目标向量 | [dist, rad]
         */
        to(vector) {
            let v = (vector.v ? vector : new Vector$1(...vector)).sub(this.co);
            let dist = v.dist(), rad = v.rad();
            return vector.v ? Vector$1.v(dist, rad) : [dist, rad];
        }

        /**
         * PolarCS -> PCS
         * @param { Vector | Array } vector - 极坐标系目标向量 | [dist, rad]
         * @returns { Vector | Array } 主坐标系的目标向量 
         */
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

    /**
     * @module   
     * @desc     矢量场: 在给定区域内影响粒子行为
     * @project  Vision
     * @author   Ais
     * @date     2022-07-13
     * @version  0.1.0
    */


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
            this.gp = gp || new Vector$1(0, 0);
            this.mass = mass;
            this.G = Gravity.G;
        }

        /** @override */
        force(fp) {
            if(this.area.in(fp.p)) {
                let r = this.gp.dist(fp.p);
                let g = Vector$1.sub(this.gp, fp.p).norm(this.G * (this.mass * fp.mass) / r*r);
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
            let r = Vector$1.dist(fp1.p, fp2.p);
            let g = Gravity.G * (fp1.mass * fp2.mass) / r*r;
            fp1.force(Vector$1.sub(fp2.p, fp1.p).norm(g));
            fp2.force(Vector$1.sub(fp1.p, fp2.p).norm(g));
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

    /**
     * @module   particle/motion
     * @project  Vision
     * @author   Ais
     * @date     2022-07-10
     * @version  0.1.0
    */


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

    /**
     * @module   particle/motion
     * @project  Vision
     * @author   Ais
     * @date     2022-07-10
     * @version  0.1.0
    */


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

    /**
     * @module   particle/motion
     * @project  Vision
     * @author   Ais
     * @date     2022-07-10
     * @version  0.1.0
    */


    //圆周运动
    class CircularMotion extends Particle {

        /**
         * 圆周运动: 描述圆周运动模式的粒子
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
         * let cmp = new CircularMotion(new Vector(1400, 300), 100, Math.PI/180);
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

    /**
     * @module   particle/motion
     * @project  Vision
     * @author   Ais
     * @date     2022-07-10
     * @version  0.1.0
    */


    //随机游走
    class RandomWalker extends Particle {
        
        /**
         * @classdesc 随机游走: 给定一组速度向量集，每次随机选择一个速度进行移动
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
         * let rw = new RandomWalker(new Vector(canvas.cx, canvas.cy), [
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

    /**
     * @module   particle/motion
     * @project  Vision
     * @author   Ais
     * @date     2022-07-25
     * @version  0.1.0
    */


    //简谐运动
    class SimpleHarmonicMotion extends Particle {

        /**
         * @classdesc 简谐运动
         * 
         * @property { Vector } p0 - 中心位置(平衡位置)
         * @property { Vector } v0 - 单位速度(振动方向): 由 this.v 的单位化生成
         * @property { number } A  - 振幅: 由 this.v 的模长生成
         * @property { number } w  - 角速度
         * @property { number } rad0 - 初始弧度
         * @property { number } _rad - 当前弧度
         * 
         * @param { Vector } p - 中心位置(平衡位置)
         * @param { Vector } v - 速度矢量: 其模长确定振幅(A), 单位向量确定振动方向
         * @param { number } w - 角速度
         * @param { number } rad - 初始弧度
         * 
         * @example
         * let p = new SimpleHarmonicMotion(new Vector(), new Vector(3, 5).norm(200), 0.05);
         */
        constructor(p, v, w, rad=0) {
            super(p, v);
            //中心位置(平衡位置)
            this.p0 = this.p.clone();
            //单位速度(振动方向)
            this.v0 = this.v.clone().norm(1);
            //振幅
            this.A = this.v.norm();
            //角速度
            this.w = w;
            //初始弧度
            this.rad0 = rad;
            //当前弧度
            this._rad = rad;
            //2*PI
            this._2PI = 2*Math.PI;
        }

        /**
         * 简谐运动的行为逻辑
         * 
         * @returns { Vector } 粒子的位置向量(this.p)
         */
        action() {
            //计算当前弧度
            this._rad += this.w;
            if(this._rad > this._2PI) { this._rad -= this._2PI; }        //计算位置
            this.p = this.v0.clone().mult(this.A*Math.sin(this._rad));
            return this.p;
        }

        /**
         * 获取振动周期
         */
        get T() {
            return (2*Math.PI)/this.w;
        }

        /**
         * 获取简谐运动的表达式
         */
        expression() {
            let A = this.A.toFixed(2);
            let w = this.w.toFixed(2);
            let rad0 = this.rad0.toFixed(2);
            return `(${A})*sin((${w})*t+(${rad0}))`;
        }
    }

    var __index__$2 = /*#__PURE__*/Object.freeze({
        __proto__: null,
        CircularMotion: CircularMotion,
        ForceParticle: ForceParticle,
        LinearMotion: LinearMotion,
        Particle: Particle,
        ParticleAssembler: ParticleAssembler,
        ParticleSystem: ParticleSystem,
        RandomWalker: RandomWalker,
        SimpleHarmonicMotion: SimpleHarmonicMotion,
        TrailTracker: TrailTracker,
        area: area,
        border: border,
        coor: coor,
        field: field
    });

    /**
     * @module
     * @desc     迭代器: 实现迭代器对象
     * @project  Vision
     * @author   Ais
     * @date     2022-07-26
     * @version  0.1.0
    */


    /** 迭代器(基类) */
    class Iterator {

        /**
         * @classdesc 迭代器(基类): 通过val接口实现值的迭代
         * 
         * @param { any } val 
         */
        constructor(val) {
            //值
            this._val = val;
        }

        /**
         * 值迭代逻辑接口: 实现迭代逻辑,并返回迭代的值
         * 
         * @returns { Any } this._val
         */
        val() {
            return this._val;
        }

        /**
         * 停机状态: 判断迭代器是否停机(迭代结束)
         * 
         * @returns { boolean } 停机状态 
         */
        end() {
            return false;
        }

        /**
         * 数组转换器: 迭代并输出值的变化过程
         * 
         * @param { number } n - 迭代次数 
         * @returns { Array } [val(0), val(1), val(2) ... val(n)]
         */
        tolist(n=500) {
            let vals = [];
            for(let i=0; i<n; i++) { 
                vals.push(this.val());
                if(this.end()) { break; }
            }
            return vals
        }
    }


    /** 范围迭代器 */
    class Range extends Iterator {

        /**
         * @classdesc 范围迭代器: 一种值线性变化的迭代器
         * 
         * @param { number } start - 起始值 
         * @param { number } end   - 终止值
         * @param { number } step  - 步长(速率)
         * 
         * @example
         * new Range(1, 3);   //-> [1, 2, 3]
         * Range.S(0, 4, 2);  //-> [0, 2, 4]
         * Range.N(0, 5, 4);  //-> [0, 1.25, 2.5, 3.75, 5]
         */
        constructor(start, end, step=1) {
            super(start);
            //起始值
            this._start = start;
            //终止值
            this._end = end;
            //步长
            this._step = start<end ? Math.abs(step) : -Math.abs(step);
        }

        /**
         * 根据"步长"构建范围迭代器
         * 
         * @param { number } start    - 起始值 
         * @param { number } end      - 终止值
         * @param { number } [step=1] - 步长(速率)
         * @returns { Range } 范围迭代器
         */
        static S(start, end, step=1) {
            return new Range(start, end, step);
        }

        /**
         * 根据"迭代次数"构建范围迭代器
         * 
         * @param { number } start - 起始值 
         * @param { number } end   - 终止值
         * @param { number } n     - 迭代次数
         * @returns { Range } 范围迭代器
         */
        static N(start, end, n) {
            return new Range(start, end, (end-start)/n);
        }

        /** @override */
        val() {
            let val = this._val;
            if(!this.end()) {
                this._val += this._step;
            } else {
                this._val = this._end;
            }
            return val;
        }

        /** @override */
        end() {
            return (this._step>0) ? (this._val>this._end) : (this._val<this._end);
        }

        /** 复制迭代器 */
        clone() {
            return new Range(this._start, this._end, this._step);
        }

    }


    //函数迭代器
    class FuncIterator extends Iterator {

        /**
         * @classdesc 函数迭代器: 指定定义域范围(dod)和函数(fx)迭代生成对应的值域
         * 
         * @property { Function } fx - 目标函数
         * @property { Range } dod - 定义域
         * 
         * @param { Function } fx - 目标函数
         * @param { Range } dod - 定义域
         * 
         * @example 
         * new FuncIterator((x)=>{return x*x;}, Range.S(0, 3));  //-> [0, 1, 4, 9]
         * new FuncIterator((x)=>{return x*x;}, [0, 3]);         //-> [0, 1, 4, 9]
         */
        constructor(fx, dod) {
            super();
            this.fx = fx;
            this.dod = dod.val ? dod : Range.S(...dod);
        }
        
        /** @override */
        val(toPoint=false) {
            let x = this.dod.val();
            return toPoint ? [x, this.fx(x)] : this.fx(x);
        }

        /** @override */
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

    /**
     * @module
     * @desc     随机选择器
     * @project  Vision
     * @author   Ais
     * @date     2022-08-01
     * @version  0.1.0
    */


    //随机选择器
    class RandomSelector {

        /**
         * @classdesc 随机选择器: 给定选项集，根据权重生成概率，随机选择一个选项。
         * 
         * @property { Object[] } _ops - 选项集
         * @property { Object } _ops.op - 选项对象
         * @property { number } _ops.p - 选中概率
         * @property { number } _ops.ps - 起始概率值
         * @property { number } _ops.pe - 终止概率值
         * 
         * @param { Array[] } options - 选项集: [[op(选项, any), wt(权重, number:>0)]...]
         * 
         * @example
         * let rs = new RandomSelector([["a", 1], ["b", 1], ["c", 3], ["d", 1]])
         */
        constructor(options) {
            //选项集
            this._ops = this._probability(options);
        }

        /**
         * 计算概率: 基于选项的权重计算概率 -> p[i] = wt[i] / sum(wt)
         *  
         * @param { Array[] } options - 选项集: [[op(选项, any), wt(权重, number:>0)], ...]
         * @returns { Object[] } 选项集: [{"op": "选项", "p": "概率", "ps/pe": "概率范围"}, ...]
         */
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

        /**
         * 从选项集中随机选择一个选项
         * 
         * @returns { any } 选中的选项集中的对象 this._ops[i].op
         * @example rs.select();
         */
        select() {
            let r = Math.random();
            for(let i=0, n=this._ops.length; i<n; i++) {
                if(r > this._ops[i].ps && r <= this._ops[i].pe) {
                    return this._ops[i].op;
                }
            }
        }

    }

    /**
     * @module
     * @desc     常用工具代码
     * @project  Vision
     * @author   Ais
     * @date     2022-08-10
     * @version  0.1.0
    */


    /** @classdesc 常用工具代码 */
    class Tools {

        /**
         * 正多边形生成器  
         * 并非严格意义上的正多边形，而是一种"近似"正多边形。
         * 
         * @param { number } n - 多边形边数(int & n>=3) 
         * @param { number } r - 多边形中心到顶点的半径(r>0)
         * @param { Array } po - 多边形中心坐标([x, y])
         * @param { number } rad - 初始弧度
         * 
         * @returns { Array[] } 顶点坐标集
         * 
         * @example Tools.regular_polygon(5, 100, [canvas.cx, canvas.cy]);
         */
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
        /** @alias Tools#regular_polygon */
        static RP(n, r, po, rad=0) {
            return Tools.regular_polygon(n, r, po, rad);
        }

        /**
         * 角度转弧度
         * 
         * @param { number } angle - 角度 
         * @returns { number } 对应弧度
         * @example Tools.ATR(45)  //-> Math.PI/4
         */
        static ATR(angle) {
            return (Math.PI/180)*angle;
        }
        /**
         * 弧度转角度
         * @param { number } rad - 弧度 
         * @returns { number } 对应角度
         * @example Tools.RTA(Math.PI/4)  //-> 45
         */
        static RTA(rad) {
            return (180/Math.PI)*rad;
        }

        /**
         * 生成随机数
         * 
         * @param { number } start - 起始值 
         * @param { number } end - 终止值
         * @returns { number } [start, end]范围内的随机数
         * @example Tools.random(-5, 5)
         */
        static random(start, end) {
            return (end-start)*Math.random()+start;
        }

        /**
         * 随机选择器: 从数组中随机选择一个元素
         * 
         * @param { Array } ops - 选项集 
         * @returns { any } 随机选中的元素
         * @example Tools.rslist(["a", "b", "c"])
         */
        static rselect(ops) {
            return ops[parseInt((ops.length)*Math.random())];
        }

        /**
         * RGB(list) -> RGB(str): 将RGB数组装换成RGB字符串  
         * 
         * @param { Array } color - 颜色数组 
         * @returns { string } 颜色值 -> "rgb(r, g, b)"
         * @example Tools.RGB([255, 255, 255]);  //-> "rgb(255, 255, 255, 1)";
         */
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

    /**
     * @module
     * @desc     截图器: 截取Canvas图像后导出
     * @project  Vision
     * @author   Ais
     * @date     2022-09-06
     * @version  0.1.0
    */


    class Capturer {

        /**
         * @classdesc 截图器: 截取Canvas图像后导出
         * 
         * @property { CanvasContext } context - Canvas渲染上下文容器
         * @property { string } fileTitle - 导出文件标题，默认值为 *title* 标签内容
         * @property { number } fn - 导出文件计数器(int & fn>0)
         * @property { get/set } [captureKey='Q'] - 截图按键值
         * 
         * @param { CanvasContext } context - Canvas渲染上下文容器
         * @param { string } fileTitle - 导出文件标题
         * 
         * @example
         * let captuer = new Capturer(canvas).capturing();
         */
        constructor(context, fileTitle) {
            this.context = context;
            this.fileTitle = fileTitle || document.getElementsByTagName("title")[0].innerText.replace(/\s+/g, "");
            /** @readonly */
            this.fn = 0;
            this._capture_keyCode = 'Q'.charCodeAt();
        }

        /** 获取截图按键值 */
        get captureKey() { return String.fromCharCode(this._capture_keyCode); }
        /** 设置截图按键值 */
        set captureKey(key) { this._capture_keyCode = key.charCodeAt(); return this; }

        /**
         * 监听截图事件: 将截图函数绑定到按键事件上
         */
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

        /**
         * 截图并导出当前canvas二进制数据
         * 
         * @param { string } fileName 导出文件名，默认值为 `${this.fileTitle}_${this.fn}`
         */
        capture(fileName) {
            //构建文件名
            fileName = fileName || `${this.fileTitle}_${this.fn++}`;
            //导出canvas二进制数据
            this.context._canvas_.toBlob((blob) => {
                let temp_node = document.createElement('a');
                temp_node.style.display = 'none';
                temp_node.id = fileName;
                temp_node.href = window.URL.createObjectURL(blob);
                temp_node.download = `${fileName}.png`; 
                temp_node.click();
            });
        }
    }

    /**
     * @module
     * @desc     颜色容器
     * @project  Vision
     * @author   Ais
     * @date     2022-07-18
     * @version  0.1.0
    */


    //颜色向量
    class ColorVector extends Vector$1 {

        /**
         * 颜色向量(Vector):  
         * 用向量来描述颜色，一个颜色表达式可以看作RGB空间中的一个向量，之所以采用
         * 向量的形式来描述颜色在于，可以通过这种方式替换粒子中的位置向量，
         * 来描述颜色向量在颜色空间中的移动，从而构建颜色渐变器。
         * 
         * @property { number[] } v - 颜色向量容器(内部存储结构)
         * @property { get/set } r - R分量(this.v[0])
         * @property { get/set } g - G分量(this.v[1])
         * @property { get/set } b - B分量(this.v[2])
         * @property { get/set } a - alpht通道分量(this.v[3])
         * 
         * @param { number } [r=0] - R分量(int & [0, 255]) 
         * @param { number } [g=0] - G分量(int & [0, 255])  
         * @param { number } [b=0] - B分量(int & [0, 255])  
         * @param { number } [a=1] - alpht通道分量([0, 1])
         * 
         * @example
         * let color = new ColorVector(100, 200, 300);
         * color.color();  //'rgb(100, 200, 300)'
         */
        constructor(r=0, g=0, b=0, a=1) {
            (a==1) ? super(r, g, b) : super(r, g, b, a);
        }

        get r(){ return this.v[0]; }
        get g(){ return this.v[1]; }
        get b(){ return this.v[2]; }
        get a(){ return this.v[3] || 1; }
        set r(val){ this.v[0] = val; }
        set g(val){ this.v[1] = val; }
        set b(val){ this.v[2] = val; }
        set a(val){ this.v[3] = val; }

        /**
         * 返回颜色值
         * 
         * @returns { Array } 颜色值
         */
        color() {
            return [...this.v];
        }

        /** 复制颜色 */
        clone() {
            return new ColorVector(...this.v);
        }
    }


    //颜色渐变器
    class ColorGradient {

        /**
         * @classdesc 线性颜色渐变器: 用于产生渐变色
         * 
         * @property { ColorVector } scv  - 起始颜色向量
         * @property { ColorVector } ecv  - 终止颜色向量
         * @property { ColorVector } cv   - 当前颜色向量
         * @property { number } n - 渐变次数，用于计算每次迭代时的颜色增量
         *  
         * @param { ColorVector } start_color - 起始颜色向量
         * @param { ColorVector } end_color - 终止颜色向量 
         * @param { number } n - 渐变次数
         * 
         * @example
         * let cg = new ColorGradient([100, 200, 200], [50, 50, 50], 100);
         */
        constructor(start_color, end_color, n) {
            this.scv = new ColorVector(...start_color);
            this.ecv = new ColorVector(...end_color);
            this.cv = this.scv.clone();
            this.n = n; 
            //内部计数器，用于记录当前迭代次数
            this._count = n;
            //计算颜色增量: 每次迭代的颜色增量
            this._dcv = Vector$1.sub(this.ecv, this.scv).norm(Vector$1.dist(this.ecv, this.scv)/n);
        }

        /**
         * 迭代并返回颜色值
         * 
         * @returns { Array } 颜色值
         */
        color() {
            let color_val = this.cv.color();
            if(this._count > 0) { this.cv.add(this._dcv); }
            this._count--;
            return color_val;
        } 

        /** 迭代终止条件 */
        isEnd() {
            return !(this._count > 0);
        }

    }

    var color = /*#__PURE__*/Object.freeze({
        __proto__: null,
        ColorGradient: ColorGradient,
        ColorVector: ColorVector
    });

    /**
     * @module
     * @desc     渲染器模块
     * @project  Vision
     * @author   Ais
     * @date     2022-09-06
     * @version  0.1.0
    */


    //渲染器基类
    class Renderer {

        /**
         * @classdesc 渲染器基类: 实现行为逻辑和图像绘制的调度。
         * 
         * @property { get } ft - 帧时间轴，时钟
         * @property { number } fps - 帧数(Frames Per Second)(int & fps>0)
         * 
         * @param { number } [fps=60] - 渲染帧数 
         */
        constructor(fps=60) {
            this._ft = 0;
            this.fps = fps;
        }

        /** 帧时间轴访问器 */
        get ft() { return this._ft; }

        /** 渲染接口  */
        render() { 
            this._ft++; 
        }
    }


    //间隔渲染器
    class IntervalRenderer extends Renderer {

        /**
         * @classdesc 间隔渲染器: 通过 setInterval 函数实现渲染功能
         * 
         * @property { get } ft - 帧时间轴，时钟
         * @property { number } fps - 帧数(Frames Per Second)(int & fps>0)
         * @property { Function } renderer_func - 渲染函数: 函数形参 => function() || function(ft), ft为帧时间轴，可选参数
         * 
         * @param { number } [fps=60] - 渲染帧数
         * 
         * @example 
         * const renderer = new vision.renderer.IntervalRenderer().render(() => {
         *     canvas.refresh();
         * });
         */
        constructor(fps=60) {
            super(fps);
            //停止时间点
            this._stop_ftp = Infinity;
            //间隔执行器
            this._timer = null;
            //渲染函数
            this.renderer_func = null;
        }

        /**
         * 渲染接口: 通过 setInterval 间隔执行 renderer_func 实现渲染功能
         * 
         * @param { Function } renderer_func - 渲染函数: 函数形参 => function() || function(ft), ft为帧时间轴，可选参数
         * @returns { Object } this
         */
        render(renderer_func) {
            this.renderer_func = renderer_func;
            //构建间隔执行器
            this._timer = setInterval(()=>{
                if(this._ft < this._stop_ftp) {
                    //渲染
                    this.renderer_func(this._ft++);
                 } else {
                    //停机
                    clearInterval(this._timer);
                 } 
             }, Math.ceil(1000/this.fps));
             return this;
        }

        /**
         * 设置停机时间点
         * 
         * @param { number } t - 停机时间点 
         * @returns { Object } this
         */
        stop(t) {
            this._stop_ftp = t; return this;
        }
    }


    //单帧渲染器
    class SingleFrameRenderer extends Renderer {

        /**
         * @classdesc 单帧渲染器/手动渲染器: 通过绑定按键来控制渲染行为
         * 
         * @property { number } act_ft_n - 每次触发渲染时，行为函数的调用次数(int & act_ft_n>0)
         * @property { Function } act_func - 行为函数
         * @property { Function } draw_func - 绘制函数
         * @property { get/set } renderKey - 渲染按键值，控制由什么按键触发渲染
         * 
         * @param { number } [act_ft_n=1] - 每次触发渲染时，行为函数的调用次数(int & act_ft_n>0)
         * 
         * @example
         * const renderer = new vision.renderer.SingleFrameRenderer().render(
         *     (ft) => {
         *         pcs.action();
         *     },
         *     (ft) => {
         *         canvas.refresh();
         *     }
         * );
         */
        constructor(act_ft_n=1) {
            super(1);
            this.act_ft_n = act_ft_n;
            this.act_func = null;
            this.draw_func = null;
            //渲染按键值
            this._render_keyCode = ' '.charCodeAt();
        }

        /** 获取渲染按键值 */
        get renderKey() { return String.fromCharCode(this._render_keyCode); }
        /** 设置渲染按键值 */
        set renderKey(key) { this._render_keyCode = key.charCodeAt(); }
           
        /**
         * 渲染接口: 通过在 window 对象上绑定 keydown 事件来触发渲染
         * 
         * @param { Function } act_func - 行为函数
         * @param { Function } draw_func - 绘制函数 
         * @returns 
         */
        render(act_func, draw_func) {
            this.act_func = act_func, this.draw_func = draw_func;
            let _this = this;
            //绑定键盘事件
            window.addEventListener("keydown", function(event) {
                if(event.keyCode == _this._render_keyCode) {
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

    var renderer = /*#__PURE__*/Object.freeze({
        __proto__: null,
        IntervalRenderer: IntervalRenderer,
        SingleFrameRenderer: SingleFrameRenderer
    });

    /**
     * @module
     * @desc     高级绘制模块: 常用绘制方法封装
     * @project  Vision
     * @author   Ais
     * @date    2022-08-01
     * @version  0.1.0
    */


    /**
     * @classdesc 高级绘制模块: 常用绘制方法封装
     * 
     * @property { VisionContext } context - 绘图上下文容器
     * 
     * @example
     * const Views = vision.Views; Views.context = context;
     */
    class Views {

        //绘图上下文容器
        context = null;

        /**
         * 节点连接器: 绘制点距范围在给定区间内的粒子之间的连线
         * 
         * @param { Particle[] } ps - 节点粒子
         * @param { number[] } dr - 可绘制的点距范围，只绘制距离在该范围内的粒子连线
         * @param { Array | ColorGradient } line_color - 连线的颜色，支持渐变色
         * 
         * @example  
         * Views.nodelink(pcs.ps, [50, 100], [0, 175, 175]);
         * Views.nodelink(pcs.ps, 100, new ColorGradient([0, 0, 0], [255, 255, 255], 100));
         */
        static nodelink(ps, dr=[0, 100], line_color=[255, 255, 255]) {
            //粒子点距范围
            let pdr = (typeof dr === "number") ? [0, dr] : dr;
            let d = pdr[1] - pdr[0];
            //颜色向量|颜色渐变器
            let cv = line_color.color ? line_color : new ColorVector(...line_color);
            //绘制
            for(let i=0, n=ps.length; i<n; i++) {
                let c = cv.color();
                for(let k=i; k<n; k++) {
                    //计算点距
                    let pd = ps[i].p.dist(ps[k].p);
                    if(pd >= pdr[0] && pd <= pdr[1]) {
                        Views.context.line(ps[i].p.x, ps[i].p.y, ps[k].p.x, ps[k].p.y, {color: [...c, 1-pd/d]});
                    }
                }
            }
        }
        
        /**
         * 绘制网格
         * 
         * @param { Object } params - 绘制参数
         * @param { Vector } params.co - 网格中心坐标
         * @param { number } params.dx - 网格单元长度(dx>0)
         * @param { number } params.dy - 网格单元高度(dy>0)
         * @param { number[] } params.xR - x轴坐标范围
         * @param { number[] } params.yR - y轴坐标范围
         * @param { number[] } [params.color=[255, 255, 255]] - 线段颜色
         * @param { boolean } [params.center=true] - 网格坐标是否居中 -> true(中心坐标位于线段交界点) | false(中心坐标位于网格单元中心)
         * 
         * @example
         * Views.grid({co: new Vector(canvas.cx, canvas.cy), dx: 10, dy: 10});
         */
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
            //绘制x轴平行线
            for(let x=xR[0], n=xR[1]; x<=n; x++) {
                let _x = x*dx+co.x+cdx;
                Views.context.line(_x, ys, _x, ye, {color: [color[0], color[1], color[2], color[3]||0.25]});
            }
            //绘制y轴平行线
            for(let y=yR[0], n=yR[1]; y<=n; y++) {
                let _y = y*dy+co.y+cdy;
                Views.context.line(xs, _y, xe, _y, {color: [color[0], color[1], color[2], color[3]||0.25]});
            }
        }

        /**
         * 光线
         * 
         * @param { Vector[] } ps - 线的顶点集
         * @param { Object } params - 绘制参数
         * @param { Function } [params.Lfx=(x) => {return 1/(x+0.0001);}] - 亮度衰减函数(Lfx应满足在[1, n]区间单调递减)
         * @param { number } [params.n=10] - 光线的层数(int & n>0)
         * @param { number } [params.d=3] - 每层光线的宽度
         * @param { number[] } [params.cs=[255, 255, 255]] - 起始颜色
         * @param { number[] } [params.ce=[0, 0, 0]] - 终止颜色
         * 
         * @example
         * 
         */
        static lightLine(ps, {Lfx, n=10, d=3, cs=[255, 255, 255], ce=[0, 0, 0]} = {}) {
            //亮度衰减函数
            Lfx = Lfx || ((x) => {return 1/(x+0.0001);});
            //Lfx函数在[1, n]区间的最值, 用于进行后续归一化处理
            let max = Lfx(1), min = Lfx(n);
            //绘制光线
            // Views.context.ctx.lineCap = "round";
            for(let i=n; i>0; i--) {
                //计算亮度
                let lr = (Lfx(i) - min) / (max - min);
                let lc = [(cs[0]-ce[0])*lr+ce[0], (cs[1]-ce[1])*lr+ce[1], (cs[2]-ce[2])*lr+ce[2]];
                //绘制光线层
                Views.context.polyline(ps, {color: new ColorGradient(lc, ce, ps.length), lineWidth: i * d});
            }  
        }

        /**
         * 光环
         * 
         * @param { number } x - 圆心x轴坐标
         * @param { number } y - 圆心y轴坐标
         * @param { number } r - 半径
         * @param { Object } params - 绘制参数
         * @param { Function } [params.Lfx=(x) => {return 1/(x+0.0001);}] - 亮度衰减函数(Lfx应满足在[1, n]区间单调递减)
         * @param { number } [params.n=50] - 光线的层数(int & n>0)
         * @param { number[] } [params.cs=[255, 255, 255]] - 起始颜色
         * @param { number[] } [params.ce=[0, 0, 0]] - 终止颜色
         * @param { boolean } [params.point=false] - (true)绘制成光点样式
         * 
         */
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
                Views.context.circle(x, y, dR*i, {color: lc});
            }  
        }

        /**
         * 绘制粒子轨迹: 解决“循环边界”下的轨迹绘制异常，通过将完整轨迹按照阈值进行分段绘制。
         * 
         * @param { Vector[] } trail - 轨迹点向量
         * @param { Object } params - 绘制参数
         * @param { number } [params.split_x=100] - x轴分量分段阈值: 点间隔超过阈值的将被拆分
         * @param { number } [params.split_y=100] - y轴分量分段阈值
         * @param { string } [params.color=[255, 255, 255]] - 轨迹颜色(支持渐变对象)
         * 
         * @example
         * trail(pcs.ps[i].tracker.trail, {"color": new ColorGradient([50, 50, 50], [255, 255, 255], pcs.ps[i].tracker.trail.length)});
         */
        static trail(trail, {split_x=100, split_y=100, color=[255, 255, 255]}={}) {
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
                Views.context.polyline(split_trail[i], {color: color});
            }
        }
    }

    var __index__ = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Capturer: Capturer,
        ColorGradient: ColorGradient,
        ColorVector: ColorVector,
        Views: Views,
        renderer: renderer
    });

    exports.CanvasContext = CanvasContext;
    exports.Capturer = Capturer;
    exports.Particle = Particle;
    exports.ParticleSystem = ParticleSystem;
    exports.Tools = Tools;
    exports.Vector = Vector$1;
    exports.Views = Views;
    exports.algo = __index__$3;
    exports.color = color;
    exports.particle = __index__$2;
    exports.renderer = renderer;
    exports.utils = __index__$1;
    exports.vector = vector;
    exports.views = __index__;

}));
