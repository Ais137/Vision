/**
 * @module   
 * @desc     渲染上下文容器(基类)
 * @project  Vision
 * @author   Ais
 * @date     2023-06-07
 * @version  0.1.0
*/


import { VisionProtocol } from "./VisionProtocol.js";


class VisionContext extends VisionProtocol {

    /**
     * @classdesc 渲染上下文容器(基类)
     * 
     * @property { Object } _context_ - 渲染上下文对象
     * @property { number } width  - 画布宽度(readonly) 
     * @property { number } height - 画布高度(readonly) 
     * @property { number } cx - 画布中心坐标 x 分量(readonly) 
     * @property { number } cy - 画布中心坐标 y 分量(readonly) 
     * @property { number[] } BGC  - 背景颜色
     * 
     * @param { number } width  - 画布宽度 
     * @param { number } height - 画布高度 
     * @param { number[] } BGC  - 背景颜色
     */
    constructor(width, height, BGC=[50, 50, 50]) {
        super();
        this._context_ = null;
        this._width = width;
        this._height = height;
        this.BGC = BGC;
    }

    get width() { return this._width; }
    get height() { return this._height; }
    get cx() { return parseInt(this._width / 2); }
    get cy() { return parseInt(this._height / 2); }

    /**
     * 初始化
     * 
     * @returns { Object } this 
     */
    init() {
        return this;
    }

    /**
     * 退出
     * 
     * @returns { Any }   
     */
    exit() {
        
    }

}


export { VisionContext };