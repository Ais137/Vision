//配置参数
const confs = {
    //粒子数
    "N": 50,
    //粒子速度范围
    "vR": [-5, 5],
    //是否生成新粒子
    "GENR": false,
    //粒子生成速度
    "gn": 5,
    //粒子轨迹长度
    "tn": 50,
}

//矢量场
class Field extends vision.particle.field.Field {

    constructor(area) {
        super(area);
    }

    force(fp) {
        if(this.area.in(fp.p)) {
            // fp.force();
        }
    }
}
let field = new Field();

//构建粒子群
let pcs = new vision.particle.ParticleSystem(() => {
    let p = new vision.particle.ForceParticle(
        Vector.random([[0, context.width], [0, context.height]]),
        Vector.random([confs.vR, confs.vR])
    );
    p.tracker = new vision.particle.TrailTracker(p, confs.tn);
    return p;
}, {max_pn: confs.N, gen_pn: confs.gn, GENR: confs.GENR}).build(confs.N);

//力场作用
pcs.action_middlewares.before.push((function() {
    //构建矢量场
    let field = new Field();
    //力场作用中间件
    return function field_middleware(ps) {
        for(let i=ps.length; i--; ) { field.force(ps[i]); }
    }
}()));

//边界处理
pcs.action_middlewares.after.push((function() {
    //构建边界限制器
    let border = new vision.particle.border.RectReflectBorder([[0, context.width], [0, context.height]]);
    //边界处理中间件
    return function border_middleware(ps) {
        for(let i=ps.length; i--; ) { border.limit(ps[i]); }
    }
}()));


//渲染器
const renderer = new vision.renderer.IntervalRenderer().render(() => {
    pcs.action();
    //绘制
    context.refresh();
    for (let i = 0, n = pcs.ps.length; i < n; i++) {
        //绘制粒子轨迹
        //绘制粒子轨迹
        context.polyline(pcs.ps[i].tracker.trail, {color: new vision.views.ColorGradient([50, 50, 50], [255, 255, 255], confs.tn)});
        //绘制粒子坐标
        // context.circle(pcs.ps[i].p.x, pcs.ps[i].p.y, 3);
    }
});
