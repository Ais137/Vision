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
class Field extends vision.field.Field {

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
        Vector.random([[0, canvas.width], [0, canvas.height]]),
        Vector.random([confs.vR, confs.vR])
    );
    p.tracker = new vision.tracker.TrailTracker(p, confs.tn);
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
    let border = new vision.border.RectReflectBorder([[0, canvas.width], [0, canvas.height]]);
    //边界处理中间件
    return function border_middleware(ps) {
        for(let i=ps.length; i--; ) { border.limit(ps[i]); }
    }
}()));


//渲染器
const randerer = new vision.randerer.IntervalRanderer().rander(() => {
    pcs.action();
    //绘制
    canvas.refresh();
    canvas.colorStyle = "rgb(255, 255, 255)";
    for (let i = 0, n = pcs.ps.length; i < n; i++) {
        //绘制粒子轨迹
        canvas.lines(
            pcs.ps[i].tracker.trail, 
            new vision.color.ColorGradient([50, 50, 50], [255, 255, 255], confs.tn)
        );
        //绘制粒子坐标
        // canvas.circle(pcs.ps[i].p.x, pcs.ps[i].p.y, 3);
        // canvas.ctx.fill();
    }
});
