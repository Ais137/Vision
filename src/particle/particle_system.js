/**
 * @module
 * @desc     粒子系统: 粒子集群容器，模拟粒子的集群行为
 * @project  Vision
 * @author   Ais
 * @date     2022-07-10
 * @version  0.1.0
 * @since    (2023-03-06, Ais): ParticleSystem(粒子系统)结构优化 
*/


//粒子系统(基类)
class ParticleSystem {

    /**
     * @classdesc 粒子系统: 粒子集群容器，模拟粒子的集群行为
     * 
     * @property { Particle[] } ps - 粒子容器
     * @property { callable } particle_builder - 粒子生成器
     * @property { Object } action_middlewares - action中间件(钩子系统)
     * @property { callable[] } action_middlewares.before - action中间件挂载点(before)
     * @property { callable[] } action_middlewares.after - action中间件挂载点(after)
     * @property { number } max_pn - 最大粒子数(int & max_pn>0)
     * @property { number } gen_pn - 迭代过程粒子生成数(int & gen_pn>0)
     * @property { boolean } GENR - 粒子生成开关, 用于在迭代过程中生成新的粒子
     * @property { boolean } DSTR - 粒子销毁开关, 当容器中的粒子进入停机状态时，从容器中移除该粒子
     * 
     * @param { callable } particle_builder - 粒子生成器
     * @param { Object } options - 粒子生命周期控制参数
     * @param { number } [options.max_pn=500] - 最大粒子数(int & max_pn>0)
     * @param { number } [options.gen_pn=1] - 迭代过程粒子生成数(int & gen_pn>0)
     * @param { boolean } [options.GENR=false] - 粒子生成开关
     * @param { boolean } [options.DSTR=false] - 粒子销毁开关
     * 
     * @example
     * let pcs = new vision.particle.ParticleSystem(() => {
     *     return new vision.particle.ForceParticle(
     *         Vector.random([[0, canvas.width], [0, canvas.height]]),
     *         Vector.random([confs.vR, confs.vR])
     *     );
     * }, {max_pn: confs.N, gen_pn: confs.gn, GENR: confs.GENR}).build(confs.N);
     */
    constructor(particle_builder, {max_pn=500, gen_pn=1, GENR=false, DSTR=true}={}) {
        this.ps = [];
        this.particle_builder = particle_builder;
        this.action_middlewares = {
            "before": [],
            "after": [],
        }
        this.max_pn = max_pn;
        this.gen_pn = gen_pn;
        this.GENR = GENR;
        this.DSTR = DSTR;
    }

    /**
     * 构建粒子系统并进行初始化
     * 
     * @param { number } pn - 初始化生成的粒子数 
     * @returns { Object } this
     * 
     * @example particle_system.build(100);
     */
    build(pn=0) {
        this.ps = [];
        for(let i=(pn < this.max_pn ? pn : this.max_pn); i--; ) {
            this.ps.push(this.particle_builder());
        }
        return this;
    }

    /**
     * 粒子运动与生命周期管理: 更新粒子容器中的粒子运动状态，并进行生命周期的管理  
     * 该方法在 action() 内部进行调用，可通过重写该方法来控制粒子运动和生命周期逻辑
     */
    particle_action() {
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

    /**
     * 粒子集群运动(迭代过程): 描述粒子集群的行为模式
     * 
     * @example particle_system.action();
     */
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