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

class Vector {

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
            v.dim()<vector[i].dim() && v.dim(vector[i].dim())
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

}


module.exports.Vector = Vector;

