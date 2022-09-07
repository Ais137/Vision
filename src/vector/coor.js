/****************************************
 * Name: Coordinate System | 坐标系
 * Date: 2022-08-01
 * Author: Ais
 * Project: Vision
 * Desc: 构建坐标系, 对向量进行坐标变换
 * Version: 0.1
****************************************/

const Vector = require("./vector.js").Vector;


//坐标系(基类)
class CoordinateSystem {

    /*----------------------------------------
    @func: MCS(主坐标系) -> CS(当前坐标系)
    @desc: 从主坐标系转换到当前坐标系
    @params:
        * vector(Vector): 目标向量
    @return(Vector)
    ----------------------------------------*/
    to(vector) {
        return vector;
    }

    /*----------------------------------------
    @func: CS -> MCS
    @desc: 从当前坐标系转换到主坐标系
    @params:
        * vector(Vector): 目标向量
    @return(Vector)
    ----------------------------------------*/
    from(vector) {
        return vector;
    }
}


//网格坐标系
class Grid extends CoordinateSystem {

    /*----------------------------------------
    @class: Grid(网格坐标系)
    @desc: 构建网格坐标系
    @property: 
        * co(vector): 坐标原点
        * dx/dy(number): 网格单元尺寸
        * RY(bool): y轴反转标记 -> true(向上) | false(向下)
    @exp: 
    ----------------------------------------*/
    constructor(co, dx, dy, RY=false) {
        super();
        //坐标原点
        this.co = co;
        //网格单元尺寸
        this.dx = dx;
        this.dy = dy;
        //反转Y轴
        this.RY = RY;
    }

    to(vector) {
        let v = vector.clone().sub(this.co);
        return new Vector(Math.round(v.x/this.dx), Math.round(v.y/this.dy)*(this.RY?-1:1))
    }

    from(vector) {
        return new Vector(this.dx*vector.x, this.dy*vector.y*(this.RY?-1:1)).add(this.co);
    }
}


//极坐标系


module.exports.CoordinateSystem = CoordinateSystem;
module.exports.Grid = Grid;