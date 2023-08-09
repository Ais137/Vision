/**
 * @module
 * @desc     贝塞尔曲线
 * @project  Vision
 * @author   Ais
 * @date     2023-08-09
 * @version  0.1.0
*/


import { Vector } from "../vector/vector.js";


class BezierCurve {

    /**
     * @classdesc 贝塞尔曲线
     * 
     * @param { Vector[] } nodes - 控制点 
     * @param { string }   mode  - 构建模式(vector:向量插值实现 | equation:参数方程实现)
     * 
     * @example
     * let bc = new vision.math.BezierCurve([
     *     new Vector(483, 690),
     *     new Vector(683, 192),
     *     new Vector(1236, 238),
     *     new Vector(1226, 634),
     * ]);
     */
    constructor(nodes, mode="vector") {
        this.nodes = nodes;
        this._BezierCurve = mode=="vector" ? new _BezierCurve_Vector(this.nodes) : new _BezierCurve_Equation(this.nodes);
    }

    /**
     * 计算曲线节点
     * 
     * @param { number } t - 参数 [0, 1] 
     * @returns { Vector } 节点坐标
     * @example let p = bc.B(0.3);
     */
    B(t) {
        if(t < 0) { t = 0};
        if(t > 1) { t = 1};
        return this._BezierCurve.B(t);
    }
}


class _BezierCurve_Vector {

    /**
     * @classdesc 贝塞尔曲线(向量插值实现)
     * @description
     * 通过对 控制点(nodes) 进行递归的 线性插值(Vector.lerp) 实现。
     */
    constructor(nodes) {
        //控制点
        this.nodes = nodes;
    }

    /** 计算曲线节点 */
    B(t) {
        let bc_nodes = this.nodes;
        while(bc_nodes.length>1) {
            bc_nodes = this._bc_node_generator(bc_nodes, t);
        }
        return bc_nodes[0];
    }

    /** 生成中间节点 */
    _bc_node_generator(nodes, t) {
        let _nodes = [];
        for(let i=0, n=nodes.length-1; i<n; i++) {
            _nodes.push(Vector.lerp(nodes[i], nodes[i+1], t));
        }
        return _nodes;
    }
}


class _BezierCurve_Equation {

    /* 
    贝塞尔曲线方程推导

    $B_1(t) = t*(p_1-p_0) + p_0$  
    $\qquad = t*p_1 - t*p_0 + p_0$  
    $\qquad = (1-t)*p_0 + t*p_1$  

    $B_2(t) = (1-t)*B_1(t) + t*B_1(t)$  
    $\qquad = (1-t)*{(1-t)*p_0 + t*p_1} + t*{(1-t)*p_1 + t*p_2}$  
    $\qquad = (1-t)^2*p_0 + t*(1-t)*p_1 + t*(1-t)*p_1 + t^2*p_2$  
    $\qquad = (1-t)^2*p_0 + 2*t*(1-t)*p_1 + t^2*p_2$

    $B_3(t) = (1-t)^3*p_0 + 3t*(1-t)^2*p_1 + 3t^2*(1-t)*p_2 + t^3*p_3$ 

    设 $(1-t) = a, t = b,$ 则上述方程等价为:

    $B_1(t) = a*p_0 + b*p_1$   
    $B_2(t) = a^2*p_0 + 2ab*p_1 + b^2*p_2$  
    $B_3(t) = a^3*p_0 + 3a^2b*p_1 + 3ab^2*p_2 + b^3*p_3$

    对于上述 $B_n(t)$ 的系数，等价于二项式系数

    $B_1 => a, b$  
    $B_2 => a^2, 2ab, b^2$  
    $B_3 => a^3, 3a^2b, 3ab^2, b^3$
    */
    /**
     * @classdesc 贝塞尔曲线(参数方程实现)
     */
    constructor(nodes) {
        //控制点
        this.nodes = nodes;
        //系数
        this._coefficient = this._binomial_coefficient(nodes.length-1);
    }

    /** 计算曲线节点 */
    B(t) {
        let p = new Vector(0, 0);
        for(let i=0, n=this.nodes.length, k=0; i<n; i++) {
            k = this._coefficient[i] * Math.pow((1-t), (n-1)-i) * Math.pow(t, i);
            p.add(this.nodes[i].clone().mult(k));
        }
        return p;
    }

    /** 计算二项式系数 */
    _binomial_coefficient(n) {
        let coefficient = [1];
        if(n==0) {
            return coefficient;
        } else {
            for(let i=0; i<n; i++) {
                let _coefficient = [1];
                for(let k=0; k<coefficient.length-1; k++) {
                    _coefficient.push(coefficient[k]+coefficient[k+1]);
                }
                _coefficient.push(1);
                coefficient = _coefficient;
            }
        }
        return coefficient;
    }
}



export { BezierCurve };