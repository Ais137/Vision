/**
 * @module   
 * @desc     区域类: 描述一个封闭区域，并给定一个点是否在区域内的判定算法(in)
 * @project  Vision
 * @author   Ais
 * @date     2022-07-13
 * @version  0.1.0
 * @since    (2022-07-14, Ais): 增加区域反转功能, 将method(in)的判定反转
*/


import { Vector } from "../../vector/vector.js";


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
        p = p.v ? p : new Vector(...p);
        //计算内角和
        let rads = 0, n = this.vps.length;
        for(let i=0; i<n; i++) {
            let _rad = Math.abs(Vector.rad(Vector.sub(this.vps[i%n], p), Vector.sub(this.vps[(i+1)%n], p)))
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
        p = p.v ? p : new Vector(...p);
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
        p = p.v ? p : new Vector(...p);
        return this.reverse ^ (p.dist(this.po) < this.r);
    }
}


export { BaseArea, Area, RectArea, CircleArea };