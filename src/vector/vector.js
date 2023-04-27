/**
 * @module
 * @desc     向量系统(Vision框架核心组件)
 * @project  Vision
 * @author   Ais
 * @date     2022-06-20
 * @version  0.1.0
 * @since    (2023-01-30, Ais): 暴露 this._v 属性，提高计算性能。
*/


class Vector {

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
            v.dim()<vector[i].dim() && v.dim(vector[i].dim())
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

}


export { Vector };