/**
 * @module
 * @desc     常用工具代码
 * @project  Vision
 * @author   Ais
 * @date     2022-08-10
 * @version  0.1.0
*/


/** @classdesc 常用工具代码 */
class Tools {

    /**
     * 正多边形生成器  
     * 并非严格意义上的正多边形，而是一种"近似"正多边形。
     * 
     * @param { number } n - 多边形边数(int & n>=3) 
     * @param { number } r - 多边形中心到顶点的半径(r>0)
     * @param { Array } po - 多边形中心坐标([x, y])
     * @param { number } rad - 初始弧度
     * 
     * @returns { Array[] } 顶点坐标集
     * 
     * @example Tools.regular_polygon(5, 100, [canvas.cx, canvas.cy]);
     */
    static regular_polygon(n, r, po, rad=0) {
        po = po || [0, 0];
        let d_rad = (2*Math.PI)/n;
        let ps = [];
        for(let i=0; i<n; i++) {
            ps.push([r*Math.cos(rad)+po[0], r*Math.sin(rad)+po[1]]);
            rad += d_rad;
        }
        return ps;
    }
    /** @alias Tools#regular_polygon */
    static RP(n, r, po, rad=0) {
        return Tools.regular_polygon(n, r, po, rad);
    }

    /**
     * 角度转弧度
     * 
     * @param { number } angle - 角度 
     * @returns { number } 对应弧度
     * @example Tools.ATR(45)  //-> Math.PI/4
     */
    static ATR(angle) {
        return (Math.PI/180)*angle;
    }
    /**
     * 弧度转角度
     * @param { number } rad - 弧度 
     * @returns { number } 对应角度
     * @example Tools.RTA(Math.PI/4)  //-> 45
     */
    static RTA(rad) {
        return (180/Math.PI)*rad;
    }

    /**
     * 生成随机数
     * 
     * @param { number } start - 起始值 
     * @param { number } end - 终止值
     * @returns { number } [start, end]范围内的随机数
     * @example Tools.random(-5, 5)
     */
    static random(start, end) {
        return (end-start)*Math.random()+start;
    }

    /**
     * 随机选择器: 从数组中随机选择一个元素
     * 
     * @param { Array } ops - 选项集 
     * @returns { any } 随机选中的元素
     * @example Tools.rslist(["a", "b", "c"])
     */
    static rselect(ops) {
        return ops[parseInt((ops.length)*Math.random())];
    }

    /**
     * RGB(list) -> RGB(str): 将RGB数组装换成RGB字符串  
     * 
     * @param { Array } color - 颜色数组 
     * @returns { string } 颜色值 -> "rgb(r, g, b)"
     * @example Tools.RGB([255, 255, 255]);  //-> "rgb(255, 255, 255, 1)";
     */
    static RGB(color) {
        return `rgb(${color[0]||0}, ${color[1]||0}, ${color[2]||0}, ${color[3]||1})`;
    }

}


export { Tools };