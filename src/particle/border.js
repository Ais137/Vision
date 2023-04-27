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
            p_obj.v = Vector.sub(p_obj.v, rv.clone().mult(rv.dot(p_obj.v)*2))
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


export { Border, RectReflectBorder, RectLoopBorder, RingReflectBorder, RingLoopBorder };