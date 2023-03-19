/****************************************
 * Name: 鸟群算法(boids: bird-oid object)
 * Date: 2023-03-19
 * Author: Ais
 * Project: Vision
 * Desc: 集群行为模拟
 * Version: 0.1
 * Update: 
****************************************/


const Vector = require("../vector/vector").Vector;
const particle = require("../vector/particle");


//鸟群个体(基准模型)
class Boid extends particle.Particle {

    //基础规则集
    static RuleSet = {
        /*----------------------------------------
        @func: 对齐行为
        @desc: 个体的速度倾向于与感知野中其他个体的速度保持一致
        ----------------------------------------*/
        alignment: (tp, ns) => {
            let v_ali = new Vector(0, 0);
            for(let i=0, n=ns.length; i<n; i++) { 
                v_ali.add(ns[i].v); 
            }
            return v_ali.mult(1/ns.length);
        },
        /*----------------------------------------
        @func: 分离行为
        @desc: 个体有远离周围个体的趋势，防止相互碰撞
        ----------------------------------------*/
        separation: (tp, ns) => {
            let v_sep = new Vector(0, 0);
            for(let i=0, n=ns.length; i<n; i++) { 
                let r = tp.p.dist(ns[i].p);
                v_sep.add(Vector.sub(tp.p, ns[i].p).norm(1/r*r)); 
            }
            return v_sep;
        },
        /*----------------------------------------
        @func: 靠近行为
        @desc: 个体有向感知野中其他个体中心位置的移动趋势
        ----------------------------------------*/
        cohesion: (tp, ns) => {
            //计算视野范围内对象的中心位置
            let center = new Vector(0, 0);
            for(let i=0, n=ns.length; i<n; i++) { 
                center.add(ns[i].p); 
            }
            center.mult(1/ns.length);
            return Vector.sub(center, tp.p);
        }
    }

    /*----------------------------------------
    @class: Boid
    @desc: 鸟群个体(基准模型)，集群行为模拟
    @property: 
        * R(number): 感知(视野)范围
        * K(list:number): 种群特征值(权重数组)，用于与规则集产生的向量进行线性组合。
        * visual_field(callable): 视野场，用于定义个体的感知野，默认采用半径R的环形视野。
        * rules(list:callable): 集群行为规则集 
    @method: 
        * rules_action: 对个体进行规则集的作用，在 action 之前调用。
        * action: 行为迭代
    @exp: 
    ----------------------------------------*/
    constructor(p, v, R, K) {
        super(p, v)
        //感知(视野)范围
        this.R = R;
        //种群特征值
        this.K = K;
        //视野场(hook point)
        this.visual_field = (tp, ns) => { return ns };
        //集群行为规则集
        this.rules = [
            Boid.RuleSet.alignment,
            Boid.RuleSet.separation,
            Boid.RuleSet.cohesion
        ];
        //速度增量
        this._acc = new Vector();
    }

    /*----------------------------------------
    @func: 规则集作用
    @desc: 对个体进行规则集的作用，在 action 之前调用。
    @params: 
        * ns(list:Boid): 个体感知野范围内的邻近集
    ----------------------------------------*/
    rules_action(ns) {
        if(ns.length == 0) { return }
        ns = this.visual_field(this, ns);
        let rule_vectors = [];
        for(let i=0, n=this.rules.length; i<n; i++) {
            rule_vectors[i] = this.rules[i](this, ns);
        }
        this._acc = Vector.LC(rule_vectors, this.K);
    }

    //行为迭代
    action() {
        return this.p.add(this.v.add(this._acc));
    }
}


/*----------------------------------------
@func: 鸟群模型规则集作用中间件
@desc: 作为粒子系统(ParticleSystem)的action中间件，用于 Boid.rules_action 的调用。
@params: 
    * nns(NNS.NearestNeighborSearch): 邻近搜索算法模块
@return(type): boids_rules_middleware(callable), ParticleSystem action 中间件
@exp: 
    pcs.action_middlewares.before.push(
        boids_middlewares(
            new vision.NNS.GridNNS([], function(obj){ return obj.p }, 100)
        )
    );
----------------------------------------*/
const boids_middlewares = function(nns) {
    //鸟群集群运动
    return function boids_rules_middleware(ps) {
        nns.build(ps);
        for (let i = ps.length; i--;) {
            ps[i].rules_action(nns.near(ps[i], ps[i].R));
        }
    }
}



module.exports.Boid = Boid;
module.exports.boids_middlewares = boids_middlewares;