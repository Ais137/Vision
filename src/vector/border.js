/****************************************
 * Name: 边界
 * Date: 2022-07-11
 * Author: Ais
 * Project: Vision
 * Desc: 对到达边界的粒子进行处理
 * Version: 0.1
****************************************/

//边界限制器(基类)
class Border {

    /*----------------------------------------
    @func: 越界处理函数
    @desc: 当目标发生越界时，通过该函数进行处理。
    @params:
        * p_obj(Particle): 目标粒子
    ----------------------------------------*/
    limit(p_obj) {
        return p_obj;
    } 
}


//矩形循环边界
class RectLoopBorder extends Border {

    /*----------------------------------------
    @func: 矩形循环边界
    @desc: 当目标发生越界时，目标移动到当前边界的相对边界处。
    @params: 
        * borders(list): 边界范围 
    @exp:
        RectLoopBorder([[0, 500], [0, 500]]);
    ----------------------------------------*/
    constructor(borders) {
        super();
        //分量限制范围
        this.borders = borders || [];
    }

    limit(p_obj) {
        for(let i=0; i<this.borders.length; i++) {
            if(p_obj.p.v[i] <= this.borders[i][0]) {
                p_obj.p._v[i] = this.borders[i][1];
            } else if(p_obj.p.v[i] >= this.borders[i][1]) {
                p_obj.p._v[i] = this.borders[i][0];
            }
        }
        return p_obj;
    }
}


//矩形反射边界
class RectReflectBorder extends Border {

    /*----------------------------------------
    @func: 矩形反射边界
    @desc: 当目标越界时，其垂直与反射面的速度分量将被反转，产生反射效果。
    @params: 
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

    limit(p_obj) {
        for(let i=0; i<this.borders.length; i++) {
            if(p_obj.p.v[i] <= this.borders[i][0]) {
                this.on_line ? p_obj.p.v[i] = this.borders[i][0] : null;
                p_obj.v.v[i] = -p_obj.v.v[i];
            }
            if(p_obj.p.v[i] >= this.borders[i][1]) {
                this.on_line ? p_obj.p.v[i] = this.borders[i][1] : null;
                p_obj.v.v[i] = -p_obj.v.v[i];
            }
        }
        return p_obj;
    }
}



module.exports.Border = Border;
module.exports.RectLoopBorder = RectLoopBorder;
module.exports.RectReflectBorder = RectReflectBorder;