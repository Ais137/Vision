/**
 * @module   
 * @desc     渲染协议
 * @project  Vision
 * @author   Ais
 * @date     2023-05-25
 * @version  0.1.0
*/


/** @classdesc 渲染协议 */
class VisionProtocol {

    /**
     * 刷新
     * 
     * @abstract
     * @param { number[] } color - 背景颜色
     * @param { number } width - 画布宽度
     * @param { number } height - 画布高度
     */
    refresh(color=[50, 50, 50], width=1920, height=1080) {
        
    }
    
    /**
     * 直线
     * 
     * @abstract
     * @param { number } xs - 起始点坐标 x 分量
     * @param { number } ys - 起始点坐标 y 分量
     * @param { number } xe - 终止点坐标 x 分量
     * @param { number } ye - 终止点坐标 y 分量
     * @param { Object } style - 绘制参数
     * @param { number[] } [style.color=[255, 255, 255]] - 线段颜色
     * @param { number } [style.lineWidth=1] - 线段宽度 
     */
    line(xs, ys, xe, ye, {color=[255, 255, 255], lineWidth=1}={}) {

    }

    /**
     * 圆
     * 
     * @abstract
     * @param { number } x - 圆心坐标 x 分量
     * @param { number } y - 圆心坐标 y 分量
     * @param { number } r - 圆半径
     * @param { Object } style - 绘制参数
     * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
     * @param { number } [style.lineWidth=1] - 线段宽度 
     * @param { boolean } [style.fill=false] - 填充状态
     */
    circle(x, y, r, {color=[255, 255, 255], lineWidth=1, fill=false}={}) {

    }

    /**
     * 矩形
     * 
     * @abstract
     * @param { number } x - 矩形中心坐标 x 分量
     * @param { number } y - 矩形中心坐标 y 分量
     * @param { number } rx - 矩形 x 轴半径
     * @param { number } ry - 矩形 y 轴半径
     * @param { Object } style - 绘制参数
     * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
     * @param { number } [style.lineWidth=1] - 线段宽度 
     * @param { boolean } [style.fill=false] - 填充状态
     */
    rect(x, y, rx, ry, {color=[255, 255, 255], lineWidth=1, fill=false}={}) {
       
    }

    /**
     * 折线
     * 
     * @abstract
     * @param { Point[] } points - 点集: [[x1, y1], [x2, y2], ...]
     * @param { Object } style - 绘制参数
     * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
     * @param { number } [style.lineWidth=1] - 线段宽度 
     * @param { boolean } [style.close=false] - 线段闭合状态
     */
    polyline(points, {color=[255, 255, 255], lineWidth=1, close=false}={}) {
        
    }

    /**
     * 多边形
     * 
     * @abstract
     * @param { Point[] } points - 点集: [[x1, y1], [x2, y2], ...]
     * @param { Object } style - 绘制参数
     * @param { number[] } [style.color=[255, 255, 255]] - 颜色 
     */
    polygon(points, {color=[255, 255, 255]}={}) {
        
    }
    
}


export { VisionProtocol };