/**
 * @module   particle/motion
 * @project  Vision
 * @author   Ais
 * @date     2022-07-10
 * @version  0.1.0
*/


import { Particle } from "../Particle.js";


//随机游走
class RandomWalker extends Particle {
    
    /**
     * @classdesc 随机游走: 给定一组速度向量集，每次随机选择一个速度进行移动
     * 
     * @property { Vector } p - 位置向量
     * @property { Object[] } _rvs - 随机速度向量集
     * @property { Vector } _rvs.v - 速度向量
     * @property { number } _rvs.p - 选择概率
     * @property { number } _rvs.ps - 起始概率值
     * @property { number } _rvs.pe - 终止概率值
     * 
     * @param { Vector } ps -  初始位置向量
     * @param { Array[] } rvs - 随机速度向量集: [[Vector(速度向量), wt(权重)], ...]
     * 
     * @example
     * let vd = 3;
     * let rw = new RandomWalker(new Vector(canvas.cx, canvas.cy), [
     *     [new Vector(-1, -1).mult(vd), 1/8],
     *     [new Vector(0, -1).mult(vd), 1/8],
     *     [new Vector(1, -1).mult(vd), 1/8],
     *     [new Vector(-1, 0).mult(vd), 1/8],
     *     [new Vector(1, 0).mult(vd), 1/8],
     *     [new Vector(-1, 1).mult(vd), 1/8],
     *     [new Vector(0, 1).mult(vd), 1/8],
     *     [new Vector(1, 1).mult(vd), 1/8],
     * ]);
     */
    constructor(ps, rvs) {
        super();
        this.p = ps;
        this._rvs = this._probability(rvs);
    }

    /**
     * 计算概率(基于权重): p[i] = wt[i] / sum(wt)
     * 
     * @param { Array[] } rvs - 随机速度向量集: [[Vector(速度向量), wt(权重)], ...]
     * @returns { Object } 随机速度向量集: [{"v": "速度", "p": "概率", "ps/pe": "概率范围"}, ...]
     */
    _probability(rvs) {
        //计算总权重
        let swt = 0;
        for(let i=0, end=rvs.length; i<end; i++) {
            swt += rvs[i][1];
        }
        //计算每个速度矢量的概率
        let _rvs = [], _ps = 0;
        for(let i=0, end=rvs.length; i<end; i++) {
            let p = (rvs[i][1] || 0) / swt;
            _rvs.push({
                //速度
                "v": rvs[i][0] || new Vector(0, 0),
                //概率
                "p": p,
                //概率范围
                "ps": _ps, "pe": _ps + p
            });
            _ps += p;
        }
        return _rvs;
    }

    /**
     * 从 *随机速度向量集* 中随机选择一个速度向量
     * 
     * @returns { Object } {"v": "速度", "p": "概率", "ps/pe": "概率范围"}
     */
    rv_select() {
        let r = Math.random();
        for(let i=0, end=this._rvs.length; i<end; i++) {
            if(r > this._rvs[i].ps && r <= this._rvs[i].pe) {
                return this._rvs[i].v;
            }
        }
    }

    /** @override */
    action() {
        //选择随机速度
        this.v = this.rv_select();
        return this.p.add(this.v);
    }
}


export { RandomWalker };