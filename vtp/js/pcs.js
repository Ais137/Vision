//配置参数
const confs = {
    //粒子数
    "N": 100,
    //粒子速度范围
    "vR": [-5, 5],
    //是否生成新粒子
    "GENR": false,
    //粒子生成速度
    "gn": 5,
}

//构建粒子群
const pcs = vision.particle.ParticleSystem.Builder(()=>{
    return new vision.particle.ForceParticle(
        Vector.random([[0, canvas.width], [0, canvas.height]]),
        Vector.random([confs.vR, confs.vR])
    );
}).init(confs.N);
pcs.max_pn = confs.N; pcs.gen_pn = confs.gn; pcs.GENR = confs.GENR;

//边界限制器
const border = new vision.border.RectReflectBorder([[0, canvas.width], [0, canvas.height]]);


//渲染器
const randerer = new vision.randerer.IntervalRanderer().rander(() => {
    pcs.action();
    for(let i=0, n=pcs.ps.length; i<n; i++) {
        border.limit(pcs.ps[i]);
    }
    //绘制
    canvas.refresh();
    canvas.colorStyle = "rgb(255, 255, 255)";
    for(let i=0, n=pcs.ps.length; i<n; i++) {
        canvas.circle(pcs.ps[i].p.x, pcs.ps[i].p.y, 3);
        canvas.ctx.fill();
    } 
});
