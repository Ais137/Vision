/**
 * @module
 * @desc     鸟群算法(boids: bird-oid object): 集群行为模拟
 * @project  Vision
 * @author   Ais
 * @date     2023-03-19
 * @version  0.1.0
*/


import { Vector  } from "../vector/vector.js";
import { Particle } from "../particle/Particle.js";


/** 鸟群个体(基准模型:M0) */
class Boid extends Particle {

    /** 
     * 基础规则集 
     * @memberof Boid
     * @property { function } alignment  - 对齐行为: 个体的速度倾向于与感知野中其他个体的速度保持一致
     * @property { function } separation - 分离行为: 个体有远离周围个体的趋势，防止相互碰撞
     * @property { function } cohesion   - 靠近行为: 个体有向感知野中其他个体中心位置的移动趋势
     * 
     * @param { Boid } tp - 目标对象 
     * @param { Boid[] } ns - tp的邻近集
     * @returns { Vector } 行为规则产生的行为向量
     * 
    */
    static RuleSet = {
        alignment: (tp, ns) => {
            let v_ali = new Vector(0, 0);
            for(let i=0, n=ns.length; i<n; i++) { 
                v_ali.add(ns[i].v); 
            }
            return v_ali.mult(1/ns.length);
        },
        separation: (tp, ns) => {
            let v_sep = new Vector(0, 0);
            for(let i=0, n=ns.length; i<n; i++) { 
                let r = tp.p.dist(ns[i].p);
                v_sep.add(Vector.sub(tp.p, ns[i].p).norm(1/r*r)); 
            }
            return v_sep;
        },
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

    /**
     * @classdesc 鸟群个体(基准模型)，集群行为模拟
     * 
     * @property { number } R - 感知(视野)范围: 用于计算邻近集。
     * @property { Array } K - 种群特征值(权重数组): 用于与规则集产生的向量进行线性组合。
     * @property { callable } visual_field - 视野场: 用于定义个体的感知野，默认采用半径R的环形视野。
     * @property { callable[] } rules - 集群行为规则集
     * @property { Vector } acc - 速度增量  
     * 
     * @param { Vector } p - 初始位置向量
     * @param { Vector } v - 初始速度向量 
     * @param { number } R - 感知(视野)范围
     * @param { Array } K - 种群特征值
     * 
     * @example
     * new vision.Boids.Boid(
     *     Vector.random([[0, canvas.width], [0, canvas.height]]),
     *     Vector.random([confs.vR, confs.vR]),
     *     confs.view_rad,
     *     confs.K,
     * );
     */
    constructor(p, v, R, K) {
        super(p, v)
        this.R = R;
        this.K = K;
        this.visual_field = (tp, ns) => { return ns };
        this.rules = [
            Boid.RuleSet.alignment,
            Boid.RuleSet.separation,
            Boid.RuleSet.cohesion
        ];
        this.acc = new Vector(0, 0);
    }

    /**
     * 规则集作用: 对个体进行规则集的作用，在 action 之前调用。
     * @param { Boid[] } ns - 个体感知野范围内的邻近集 
     */
    rules_action(ns) {
        if(ns.length == 0) { return }
        ns = this.visual_field(this, ns);
        let rule_vectors = [];
        for(let i=0, n=this.rules.length; i<n; i++) {
            rule_vectors[i] = this.rules[i](this, ns);
        }
        this.acc.add(Vector.LC(rule_vectors, this.K));
    }

    /** 行为迭代 */
    action() {
        this.p.add(this.v.add(this.acc));
        this.acc = new Vector(0, 0);
        return this.p;
    }
}


/**
 * 鸟群模型规则集作用中间件
 * 作为粒子系统(ParticleSystem)的action中间件，用于 Boid.rules_action 的调用。
 * 
 * @param { NNS.NearestNeighborSearch } nns - 邻近搜索算法模块
 * 
 * @returns { function } ParticleSystem action 中间件
 * 
 * @example
 * pcs.action_middlewares.before.push(
 *     boids_middlewares(
 *         new vision.NNS.GridNNS([], function(obj){ return obj.p }, 100)
 *     )
 * );
 * 
 */
const boids_middlewares = function(nns) {
    //鸟群集群运动
    return function boids_rules_middleware(ps) {
        nns.build(ps);
        for (let i = ps.length; i--;) {
            ps[i].rules_action(nns.near(ps[i], ps[i].R));
        }
    }
}


export { Boid, boids_middlewares };