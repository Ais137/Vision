/****************************************
 * Name: Coordinate System | 坐标系
 * Date: 2022-08-01
 * Author: Ais
 * Project: Vision
 * Desc: 构建坐标系, 对向量进行坐标变换
 * Version: 0.2
****************************************/


import { Vector } from "../vector/vector.js";


/****************************************  
(PCS)屏幕像素坐标系(Canvas画布坐标)

  o(0, 0) ----------> (+x)
  |
  | 
  |
  V
 (+y)

 * o(0, 0): 坐标原点位于屏幕左上角
 * +x: x轴正方向水平向右
 * +y: y轴正方向垂直向下
 * scale: 标度为正整数(1), 代表一个像素
****************************************/


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


//实数坐标系
class RCS extends CoordinateSystem {

    /*----------------------------------------
    @class: 实数坐标系
    @desc: 将屏幕像素坐标系映射到实数域中进行计算
    @property: 
        * _co(Vector): 屏幕像素坐标系原点坐标
        * _scale(number & R+ & >0): 标度比例，一个像素对应的值 
    @method: 
        * to: PCS(屏幕像素坐标系) -> CS(当前坐标系)
        * from: CS(当前坐标系) -> PCS(屏幕像素坐标系)
        * zoom: 对坐标系标度进行缩放
        * move: 对屏幕像素坐标系原点坐标(co)进行平移
    @exp: 
        let rcs = new RCS(Vector.v(canvas.cx, canvas.cy), 0.5);
    ----------------------------------------*/
    constructor(co, scale=1) {
        super();
        //屏幕像素坐标系原点坐标
        this._co = co;
        //标度
        this._scale = scale;
    }
    
    get scale() { return this._scale; }
    set scale(val) {
        if(val <= 0) { throw Error(`scale(${val}) must be in (0, Inf)`); }
        this._scale = val;
    }
    get co() { return this._co.clone(); }

    /*----------------------------------------
    @func: PCS(屏幕像素坐标系) -> CS(当前坐标系)
    ----------------------------------------*/
    to(vector) {
        let x = ((vector.v ? vector.x : vector[0]) - this._co.x) * this._scale;
        let y = (-1)*((vector.v ? vector.y : vector[1]) - this._co.y) * this._scale;
        return vector.v ? Vector.v(x, y) : [x, y];
    }

    /*----------------------------------------
    @func: CS(当前坐标系) -> PCS(屏幕像素坐标系)
    ----------------------------------------*/
    from(vector) {
        let x = ((vector.v ? vector.x : vector[0]) / this._scale) + this._co.x;
        let y = ((-1)*(vector.v ? vector.y : vector[1]) / this._scale) + this._co.y;
        return vector.v ? Vector.v(x, y) : [x, y];
    }

    /*----------------------------------------
    @func: 缩放
    @desc: 
        对坐标系标度进行缩放
        当 "zr>0" 时，进行 "放大"，标度变小
        当 "zr<0" 时，进行 "缩小"， 标度变大。
    @params: 
        * zr(number): 缩放值
    @return(this) 
    @exp: 
        * 放大2倍: coor.zoom(2)
        * 缩写2倍: coor.zoom(-2)
    ----------------------------------------*/
    zoom(zr) {
        zr > 0 ? this.scale /= Math.abs(zr) : this.scale *=  Math.abs(zr)
        return this;
    }

    /*----------------------------------------
    @func: 平移
    @desc: 对屏幕像素坐标系原点坐标(pco)进行平移
    @params: 
        * vector(Vector): 平移坐标
    @return(this) 
    @exp: 
        向右平移100个像素: coor.move(Vector.v(-100, 0));
    ----------------------------------------*/
    move(vector) {
        this._co.add(vector.v ? vector : Vector.v(...vector));
        return this;
    }
}


//网格坐标系
class Grid extends CoordinateSystem {

    /*----------------------------------------
    @class: Grid(网格坐标系)
    @desc: 将屏幕像素坐标系映射到网格坐标系
    @property: 
        * co(vector): 坐标原点
        * dx/dy(int>=1): 网格单元尺寸
        * RY(bool): y轴反转标记 -> true(向上) | false(向下)
    @exp: 
        let grid = new Grid(new Vector(canvas.cx, canvas.cy), 10, 10, true);
    ----------------------------------------*/
    constructor(co, dx=1, dy=1, RY=false) {
        super();
        //坐标原点
        this.co = co;
        //网格单元尺寸
        this._dx = dx;
        this._dy = dy;
        //反转Y轴
        this._RY = RY ? -1 : 1;
    }

    get dx() { return this._dx; }
    set dx(val) {
        if(val < 1) { throw Error(`dx(${val}) must be in [1, Inf)`); }
        this._dx = Math.round(val);
    }
    
    get dy() { return this._dy; }
    set dy(val) {
        if(val < 1) { throw Error(`dy(${val}) must be in [1, Inf)`); }
        this._dy = Math.round(val);
    }

    get RY() { return (this._RY == -1); }
    set RY(val) {
        this._RY = val ? -1 : 1;
    }
    
    /*----------------------------------------
    @func: PCS -> Grid
    @desc: 单元格内的坐标会映射到同一点
    ----------------------------------------*/
    to(vector) {
        let x = Math.round(((vector.v ? vector.v[0] : vector[0]) - this.co.x) / this.dx);
        let y = Math.round(((vector.v ? vector.y : vector[1]) - this.co.y) / this.dy) * this._RY;
        return vector.v ? Vector.v(x, y) : [x, y];
    }

    /*----------------------------------------
    @func: Grid -> PCS
    ----------------------------------------*/
    from(vector) {
        let x = this.dx * (vector.v ? vector.x : vector[0]) + this.co.x;
        let y = this.dy * (vector.v ? vector.y : vector[1]) * this._RY + this.co.y;
        return vector.v ? Vector.v(x, y) : [x, y];
    }

}


//极坐标系
class PolarCS extends CoordinateSystem {

    /*----------------------------------------
    @class: 极坐标系
    @desc: 将屏幕像素坐标系映射到极坐标系
    @property: 
        * co(vector): 坐标原点
    @exp: 
        let coor = new PolarCS(new Vector(canvas.cx, canvas.cy));
    ----------------------------------------*/
    constructor(co) {
        super();
        //坐标原点
        this.co = co;
    }

    /*----------------------------------------
    @func: PCS -> PolarCS
    @params: 
        * vector(Vector | Arr): [dist, rad]
    ----------------------------------------*/
    to(vector) {
        let v = (vector.v ? vector : new Vector(...vector)).sub(this.co);
        let dist = v.dist(), rad = v.rad();
        return vector.v ? Vector.v(dist, rad) : [dist, rad];
    }

    /*----------------------------------------
    @func: PolarCS -> PCS
    ----------------------------------------*/
    from(vector) {
        let dist = (vector.v ? vector.x : vector[0]);
        let rad = (vector.v ? vector.y : vector[1]);
        let x = dist * Math.sin(rad) + this.co.x;
        let y = dist * Math.cos(rad) + this.co.y;
        return vector.v ? Vector.v(x, y) : [x, y];
    }

}


export { CoordinateSystem, RCS, Grid, PolarCS };