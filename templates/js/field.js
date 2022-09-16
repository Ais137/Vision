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

//构建粒子群
const pcs = vision.particle.ParticleSystem.Builder(() => {
    let p = new vision.particle.ForceParticle(
        Vector.random([[0, canvas.width], [0, canvas.height]]),
        Vector.random([confs.vR, confs.vR])
    );
    p.tracker = new vision.tracker.TrailTracker(p, confs.tn);
    return p;
}).init(confs.N);
pcs.max_pn = confs.N; pcs.gen_pn = confs.gn; pcs.GENR = confs.GENR;

//边界限制器
const border = new vision.border.RectReflectBorder([[0, canvas.width], [0, canvas.height]]);

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
const field = new Field();

//渲染器
const randerer = new vision.randerer.IntervalRanderer().rander(() => {
    pcs.action();
    for (let i = 0, n = pcs.ps.length; i < n; i++) {
        field.force(pcs.ps[i]);
        border.limit(pcs.ps[i]);
    }
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
