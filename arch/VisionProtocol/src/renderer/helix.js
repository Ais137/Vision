/**
 * @desc     运行环境兼容性架构测试
 * @project  Vision
 * @author   Ais
 * @date     2023-06-11
 * @version  0.1.0
*/

class Helix {

    constructor({co = {x: 0, y: 0}, w=1, SHM_A=90, SHM_W=100}={}) {
        //当前弧度
        this.rad = 0;
        //角速度(1)
        this.w = (Math.PI/180)*w;
        //当前半径
        this.r = 0;
        //最大半径
        this.R = 500;
        //半径增量(0.5)
        this.dr = 0.5;
        //SHM幅度(90)
        this.SHM_A = (Math.PI/180)*SHM_A;
        //SHM角速度(100)
        this.SHM_W = (Math.PI/180)*SHM_W;
        //中心坐标
        this.o = co;
        //前一刻位置
        this.p0 = this.o;
        //当前位置
        this.p = this.o;
    }

    action(t) {
        this.p0 = {x: this.p.x, y: this.p.y};
        this.rad += this.w;
        if (this.r < this.R) { this.r += this.dr; }
        let _rad = this.SHM_A * Math.sin(this.SHM_W * t) + this.rad;
        this.p = {x: this.r * Math.cos(_rad) + this.o.x, y: this.r * Math.sin(_rad) + this.o.y}
        return this.p;
    }
}

/** 绘制模块 */
const renderer = function(context, {interval_time=10, stop_ft=200}={}){
    let ft = 0;
    let helix = new Helix({co: {x: context.cx, y: context.cy}});
    stop_ft = helix.R / helix.dr * 2;
    context.refresh();
    let timer = setInterval(()=>{
        if(ft < stop_ft) {
            helix.action(ft);
            let c = parseInt((helix.R - helix.r) * (255 / helix.R));
            context.line(helix.p.x, helix.p.y, helix.p0.x, helix.p0.y, {color: [c, c, c]});
            ft++;
        } else {
            clearInterval(timer);
            context.exit();
        }
    }, interval_time)
}


export { renderer };