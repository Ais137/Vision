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


import { Vector } from "../vector/vector.js";


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
        p = p.v ? p : new Vector(...p);
        return this.reverse ^ (p.dist(this.po) < this.r);
    }
}


export { BaseArea, Area, RectArea, CircleArea };