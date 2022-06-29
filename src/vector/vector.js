/****************************************
 * Name: Vector | 向量系统
 * Date: 2022-06-20
 * Author: Ais
 * Project: Vision
 * Desc: Vision框架核心组件
 * Version: 0.1
****************************************/

class Vector {

    /*----------------------------------------
    @func: Vector构建器
    @desc: 通过函数参数作为向量分量构建向量，默认构建(0, 0)的二维向量
    @return(Vector): obj(Vector)
    @exp: 
        v = new Vector(1, 2, 3) -> v(1, 2, 3)
    ----------------------------------------*/
    constructor(...v) {
        //向量分量
        this._v = v.length > 0 ? [...v] : [0, 0];
    }

    //static builder
    static V(...v) {
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

    //分量接口
    get v() { return this._v; }
    get x(){ return this._v[0]; }
    get y(){ return this._v[1]; }
    get z(){ return this._v[2]; }
    set x(val){ this._v[0] = val; }
    set y(val){ this._v[1] = val; }
    set z(val){ this._v[2] = val; }

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
        for(let i=0, end=this._v.length; i<end; i++) {
            this._v[i] += (v[i] || 0);
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
        for(let i=0, end=this._v.length; i<end; i++) {
            this._v[i] *= k;
        }
        return this;
    }

    //减法(加法的一种特殊情况)
    sub(vector){
        //向量方法实现
        // return this.add(vector.clone().mult(-1));
        //计算优化实现
        let v = vector.v;
        for(let i=0, end=this._v.length; i<end; i++) {
            this._v[i] -= (v[i] || 0);
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
    @func: 标量积(点积)
    @desc: v1·v2 -> sum(v1[i]*v2[i]) -> |v1|*|v2|*cos(rad)
    @params: 
        * vector(Vector): 操作数
    @return(float): 
    ----------------------------------------*/
    dot(vector) {
        let t = 0, v = vector.v;
        for(let i=0, end=this._v.length; i<end; i++) {
            t += this._v[i] * (v[i] || 0);
        }
        return t;
    }
    inner(vector) {
        return this.dot(vector);
    }

    /*----------------------------------------
    @func: 线性插值
    @desc: v(t) = (1-t)*v1 + t*v2 -> v1 + t*(v2-v1)
    @params: 
        * vector(Vector): 目标向量
        * t(float): 0<=t<=1 
    @return(Vector): new Vector
    ----------------------------------------*/
    lerp(vector, t) {
        return (t>0 && t<1) ? vector.clone().sub(this).mult(t).add(this) : (t<=0 ? this.clone() : vector.clone());
    }
    static lerp(v_from, v_to, t) {
        return v_from.lerp(v_to, t);
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
            this._v = v;
            return this;
        } else {
            return this._v.length;
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
        for(let i=0, end=this._v.length; i<end; i++) {
            t += this._v[i] * this._v[i];
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

    //复制
    clone() {
        return new Vector(...this._v);
    }
    copy() {
        return new Vector(...this._v);
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
            for(let i=0, end=this._v.length; i<end; i++) {
                t += (this._v[i] - v[i]) * (this._v[i] - v[i]);
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
        let x = this._v[0], y = this._v[1];
        let rad = Math.atan(y/x);
        rad = (x>=0) ? (y >= 0 ? rad : Math.PI*2 + rad) : (Math.PI + rad);
        return  vector ? rad - vector.rad() : rad;
    }
    static rad(v1, v2) {
        return v1.rad(v2);
    }

    //整数化: 将分量转换成整数
    toint() {
        for(let i=0, end=this._v.length; i<end; i++) { this._v[i] = parseInt(this._v[i]);}
    }

}


module.exports.Vector = Vector;

