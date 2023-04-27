/****************************************
 * Name: 粒子系统/运动系统
 * Date: 2022-07-10
 * Author: Ais
 * Project: Vision
 * Desc: 基于向量模拟抽象粒子的运动
 * Version: 0.1
 * Update:
    * (2023-03-06, Ais): ParticleSystem(粒子系统)结构优化 
****************************************/


//粒子系统(基类)
class ParticleSystem {

    /*----------------------------------------
    @class: ParticleSystem | 粒子系统
    @desc: 粒子集群容器，描述粒子的集群行为
    @property: 
        * ps(list:Particle): 粒子容器
        * particle_builder(callable): 粒子生成器
        * action_middlewares(obj:list:callable): action中间件(Hooks)
        * max_pn(int, (0, N+)): 最大粒子数
        * gen_pn(int, (0, N+)): 迭代过程粒子生成数
        * GENR(bool): 粒子生成开关, 用于在迭代过程中生成新的粒子
        * DSTR(bool): 粒子销毁开关, 当容器中的粒子进入停机状态时，从容器中移除该粒子
    @method:
        * build: 对粒子系统进行初始化
        * particle_action: 粒子运动与生命周期管理
        * action(): 粒子集群运动
    @exp: 
        let pcs = new ParticleSystem().init();
    ----------------------------------------*/
    constructor(particle_builder, {max_pn=500, gen_pn=1, GENR=false, DSTR=true}={}) {
        //粒子容器
        this.ps = [];
        //粒子生成器
        this.particle_builder = particle_builder;
        //action中间件(Hook)
        this.action_middlewares = {
            "before": [],
            "after": [],
        }
        //最大粒子数
        this.max_pn = max_pn;
        //迭代过程粒子生成数
        this.gen_pn = gen_pn;
        //粒子生成开关
        this.GENR = GENR;
        //粒子销毁开关
        this.DSTR = DSTR;
    }

    /*----------------------------------------
    @func: 初始化
    @desc: 对粒子系统进行初始化
    @return(this) 
    ----------------------------------------*/
    build(pn=0) {
        this.ps = [];
        for(let i=(pn < this.max_pn ? pn : this.max_pn); i--; ) {
            this.ps.push(this.particle_builder());
        }
        return this;
    }

    /*----------------------------------------
    @func: 粒子运动与生命周期管理
    @desc: 更新粒子容器中的粒子运动状态，并进行生命周期的管理
    ----------------------------------------*/
    particle_action() {
        //粒子运动
        let _ps = [];
        for(let i=0, n=this.ps.length; i<n; i++) {
            //判断粒子的停机状态
            if(!this.ps[i].isEnd()) {
                //调用粒子的行为模式方法
                this.ps[i].action(); _ps.push(this.ps[i]);
            } else {
                //根据"粒子销毁开关"判断是否销毁停机粒子
                (!this.DSTR) && _ps.push(this.ps[i]);
            }
        }
        //生成新的粒子
        if(this.GENR) {
            let diff_pn = this.max_pn - _ps.length;
            for(let i=(diff_pn>=this.gen_pn ? this.gen_pn : diff_pn); i>0; i--) {
                _ps.push(this.particle_builder())
            }
        }
        //更新粒子容器
        this.ps = _ps;
    }

    /*----------------------------------------
    @func: 粒子集群运动(迭代过程)
    @desc: 描述粒子集群的行为模式
    ----------------------------------------*/
    action() {
        //action中间件挂载点(before)
        for(let i=0, n=this.action_middlewares.before.length; i<n; i++) {
            this.action_middlewares.before[i](this.ps);
        }
        //粒子运动与生命周期管理
        this.particle_action();
        //action中间件挂载点(after)
        for(let i=0, n=this.action_middlewares.after.length; i<n; i++) {
            this.action_middlewares.after[i](this.ps);
        }
    }

}


export { ParticleSystem };