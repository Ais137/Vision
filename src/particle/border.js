/****************************************
 * Name: 边界
 * Date: 2022-07-11
 * Author: Ais
 * Project: Vision
 * Desc: 对到达边界的粒子进行处理
 * Version: 0.1
 * Update:
 *     2022-07-27: 对limit()添加"r"(质心到边界的距离)参数，以支持在考虑粒子具有形状属性的情况下的限制作用
****************************************/

//边界限制器(基类)
class Border {

    /*----------------------------------------
    @func: 越界处理函数
    @desc: 当目标发生越界时，通过该函数进行处理。
    @params:
        * p_obj(Particle): 目标粒子
        * r(number): 形状半径
    ----------------------------------------*/
    limit(p_obj, r=0) {
        return p_obj;
    } 
}


//矩形反射边界
class RectReflectBorder extends Border {

    /*----------------------------------------
    @func: 矩形反射边界
    @desc: 当目标越界时，其垂直与反射面的速度分量将被反转，产生反射效果。
    @property: 
        * borders(list): 边界范围 
        * on_line(bool): 当该参数为true时，越界时会重置目标位置到边界线上
    ----------------------------------------*/
    constructor(borders, on_line=true) {
        super();
        //分量限制范围
        this.borders = borders || [];
        //边界线模式
        this.on_line = on_line;
    }

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

    /*----------------------------------------
    @func: 矩形循环边界
    @desc: 当目标发生越界时，目标移动到当前边界的相对边界处。
    @property: 
        * borders(list): 边界范围 
    @exp:
        RectLoopBorder([[0, 500], [0, 500]]);
    ----------------------------------------*/
    constructor(borders) {
        super();
        //分量限制范围
        this.borders = borders || [];
    }

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

    /*----------------------------------------
    @class: 环形反射边界
    @desc: 圆形边界，目标越界时进行速度反射
    @property: 
        * po(Vector): 边界圆心坐标
        * r(number,>0): 边界半径
    ----------------------------------------*/
    constructor(po, r) {
        super();
        //边界圆心坐标
        this.po = po;
        //边界半径
        this.r = r;
    }

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

    /*----------------------------------------
    @class: 环形循环边界
    @desc: 圆形边界，目标越界时将其移动到目标与圆心坐标的对角位置
    @property: 
        * po(Vector): 边界圆心坐标
        * r(number,>0): 边界半径
    ----------------------------------------*/
    constructor(po, r) {
        super();
        //边界圆心坐标
        this.po = po;
        //边界半径
        this.r = r;
    }

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