/****************************************
 * Name: Vector | 向量系统
 * Date: 2022-06-20
 * Author: Ais
 * Project: Vision
 * Desc: Vision框架核心组件
 * Version: 0.1
 * DevPlan 
    * 链式计算优化 v.add(v1).mult(k1).add(v2).sub(v3) ...   
****************************************/


class Vector {

    /*----------------------------------------
    @func: Vector构建器
    @desc: 通过函数参数作为向量分量构建向量，默认构建(0, 0)的二维向量
    @return(Vector): obj(Vector)
    @exp: 
        v = new Vector(1, 2, 3) -> v(1, 2, 3)
    ----------------------------------------*/
    constructor() {
        //向量分量
        this._v = arguments.length > 0 ? [...arguments] : [0, 0];
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
        for(let i=0; i<this._v.length; i++) {
            this._v[i] += (v[i] || 0);
        }
        return this;
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
        for(let i=0; i<this._v.length; i++) {
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
        for(let i=0; i<this._v.length; i++) {
            this._v[i] -= (v[i] || 0);
        }
        return this;
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
        for(let i=0; i<this._v.length; i++) {
            t += this._v[i] * this._v[i];
        }
        let v_norm = Math.sqrt(t);
        //设置模长
        (n!=null) && (v_norm != 0) && this.mult(n/v_norm);
        return (n==null) ? v_norm : this;
    }

    //单位化
    normalize() {
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
            for(let i=0; i<this._v.length; i++) {
                t += (this._v[i] - v[i]) * (this._v[i] - v[i]);
            }
            return Math.sqrt(t);
        }
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
        let rad, act = Math.atan(y/x);
        rad = (x>=0) ? (y >= 0 ? act : Math.PI*2 + act) : (Math.PI + act);
        return  vector ? rad - vector.rad() : rad;
    }

}


module.exports.Vector = Vector;

