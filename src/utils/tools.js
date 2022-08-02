/****************************************
 * Name: tool | 工具
 * Date: 
 * Author: Ais
 * Project: Vision
 * Desc: 常用工具代码
 * Version: 0.1
****************************************/


class Tools {

    /*----------------------------------------
    @func: regular polygon | 正多边形生成器
    @desc: 并非严格意义上的正多边形，而是一种"近似"正多边形。
    @params: 
        * n(number(N+, n>=3)): 边数
        * r(number(r>0)): 半径
        * po(list): 中心坐标
        * rad(number): 起始弧度
    @return(list)
    @exp:
        * Tools.regular_polygon(5, 100, [canvas.cx, canvas.cy]);
    ----------------------------------------*/
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
    static RP(n, r, po, rad=0) {
        return Tools.regular_polygon(n, r, po, rad);
    }

    /*----------------------------------------
    @func: 角度<>弧度 转换器
    @desc: 在角度与弧度之间转换
    @return(number)
    @exp:
        * Tools.ATR(45) -> Math.PI/4
        * Tools.ATR(Math.PI) -> 45
    ----------------------------------------*/
    static ATR(angle) {
        return (Math.PI/180)*angle;
    }
    static RTA(rad) {
        return (180/Math.PI)*rad;
    }

    /*----------------------------------------
    @func: 生成随机数
    @params: 
        * start/end: 生成范围
    @return(number)
    @exp: 
        Tools.random(-5, 5)
    ----------------------------------------*/
    static random(start, end) {
        return (end-start)*Math.random()+start;
    }

    /*----------------------------------------
    @func: (list)随机选择器
    @desc: 从数组中随机选择一个元素
    @params: 
        * ops(list): 选项集
    @return(any)
    @exp: 
        Tools.rslist(["a", "b", "c"])
    ----------------------------------------*/
    static rslist(ops) {
        return ops[parseInt((ops.length)*Math.random())];
    }


}



module.exports.Tools = Tools;
