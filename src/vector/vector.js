/****************************************
 * Name: Vector | 向量系统
 * Date: 2022-06-20
 * Author: Ais
 * Project: Vision
 * Desc: Vision框架的核心组件
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
    @func: 维度(分量数)(get/set)
    @desc: get/set
    @params: 
        * n(int): 新的维度
    @return(int): 向量的维度(分量数)
    @exp:
        let v = new Vector([1, 1, 2, 7])
        v.dim() -> 4
        v.dim(3) -> v(1, 1, 2) -> v
        v.dim(5) -> v(1, 1, 2, 7, 0) -> v
    ----------------------------------------*/
    dim(n=null) {
        if(n!=null) {
            let v = [], n = parseInt(n);
            for(let i=0; i<n; i++) {
                v[i] = this.v[i] || 0;
            }
            this._v = v;
            return this;
        } else {
            return this._v.length;
        }
    }

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
        //通过基本的向量运算实现
        // return this.add(vector.clone().mult(-1));
        //计算优化实现
        let v = vector.v;
        for(let i=0; i<this._v.length; i++) {
            this._v[i] -= (v[i] || 0);
        }
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
    @func: 模(get/set)
    @desc: 向量的模长
    @params: 
       * n(type): value
    @return(type): 
    @exp: 
    ----------------------------------------*/
    norm(n=null) {

    }

    
    /*============================================================*/
    //模长
    mag(n=null) {
        //计算模长
        let t = 0;
        for(let i=0; i<this._v.length; i++) {
            t += this._v[i] * this._v[i];
        }
        let mag = Math.sqrt(t);
        //设置模长
        (n!=null) && (mag != 0) && this.mult(n/mag);
        return (n==null) ? mag : n; 
    }

    //单位化
    norm(){
        let mag = this.mag();
        (mag != 0) && this.mult(1/mag);
        return this;
    }

    

    //内积(点积)
    inner(vector) {
        let t = 0, v = vector.v;
        for(let i=0; i<this._v.length; i++) {
            t += this._v[i] * (v[i] || 0);
        }
        return t;
    }
    dot(vector) {
        return this.inner(vector);
    }

}


module.exports.Vector = Vector;

