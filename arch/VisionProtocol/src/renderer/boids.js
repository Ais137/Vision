/**
 * @desc     运行环境兼容性架构测试
 * @project  Vision
 * @author   Ais
 * @date     2023-06-11
 * @version  0.1.0
*/


import * as vision from "./vision.js";


//配置参数
const confs = {
    //粒子数
    "N": 300,
    //粒子速度范围
    "vR": [-5, 5],
    //是否生成新粒子
    "GENR": false,
    //粒子生成速度
    "gn": 5,
    //最大速度限制
    "max_v": 3,
    //感知视野范围
    "view_rad": 100,
    //种群特征值
    "K": [0.5, 0.5, 0.05],
    //轨迹长度
    "tn":30,
} 

//绘制轨迹
const trailine = function(context, trail, {split_x=100, split_y=100, color='rgb(255, 255, 255)'}={}) {
    let split_trail = [[]];
    //按照分量分段阈值对轨迹进行分段
    for(let i=0, n=trail.length-1; i<n; i++) {
        split_trail[split_trail.length-1].push(trail[i])
        if(Math.abs(trail[i].x-trail[i+1].x)>split_x | Math.abs(trail[i].y-trail[i+1].y)>split_y) {
            split_trail.push([]);
        }
    }
    for(let i=0, n=split_trail.length; i<n; i++) {
        if(split_trail[i].length <= 1) { continue; }
        context.polyline(split_trail[i], {color: color});
    }
}


/** 绘制模块 */
const renderer = function(context, {interval_time=17, stop_ft=200}={}){

    //构建粒子群
    let pcs = new vision.particle.ParticleSystem(() => {
        let p = new vision.algo.boids.Boid(
            vision.Vector.random([[0, context.width], [0, context.height]]),
            vision.Vector.random([confs.vR, confs.vR]),
            confs.view_rad,
            confs.K,
        );
        p.tracker = new vision.particle.TrailTracker(p, confs.tn);
        return p;
    }, {max_pn: confs.N, gen_pn: confs.gn, GENR: confs.GENR}).build(confs.N);

    //鸟群模型规则集作用
    pcs.action_middlewares.before.push(
        vision.algo.boids.boids_middlewares(
            new vision.algo.NNS.GridNNS([], function(obj){ return obj.p }, confs.view_rad)
        )
    );

    //速度限制
    pcs.action_middlewares.after.push((function() {
        return function v_limit_middleware(ps) {
            for(let i=ps.length; i--; ) { ps[i].v.limit(confs.max_v) }
        }
    }()));

    //边界处理
    pcs.action_middlewares.after.push((function () {
        //构建边界限制器
        let border = new vision.particle.border.RectLoopBorder([[0, context.width], [0, context.height]]);
        //边界处理中间件
        return function border_middleware(ps) {
            for (let i = ps.length; i--;) { border.limit(ps[i]); }
        }
    }()));

    let ft = 0;
    context.refresh();
    let timer = setInterval(()=>{
        if(ft < stop_ft) {
            pcs.action();
            //绘制
            context.refresh();
            for (let i = 0, n = pcs.ps.length; i < n; i++) {
                trailine(
                    context, 
                    pcs.ps[i].tracker.trail, 
                    {
                        "color": new vision.views.ColorGradient([0, 0, 0], [255, 255, 255], pcs.ps[i].tracker.trail.length)
                    }
                );
            }
            ft++;
        } else {
            clearInterval(timer);
            context.exit();
        }
    }, interval_time)
}


export { renderer };