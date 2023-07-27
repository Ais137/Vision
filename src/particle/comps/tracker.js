/**
 * @module   
 * @desc     轨迹追踪器: 追踪记录目标粒子的移动轨迹
 * @project  Vision
 * @author   Ais
 * @date     2022-07-15
 * @version  0.1.0
*/


class TrailTracker {

    /**
     * @classdesc 轨迹追踪器: 基于Hook式的方法隐式地追踪记录目标粒子的移动轨迹  
     * 通过hook目标对象的action()方法来实现隐式的轨迹追踪效果
     * 
     * @property { Particle } tp - 追踪的目标粒子
     * @property { number } tn - 轨迹长度(int & tn>0)
     * @property { Vector[] } trail - 轨迹向量容器，记录的轨迹坐标
     * 
     * @param { Particle } tp - 追踪的目标粒子 
     * @param { number } [tn=10] - 轨迹长度(int & tn>0)
     * 
     * @example
     * let p = new Particle();
     * let tracker = new TrailTracker(p, 50);
     */
    constructor(tp, tn=10) {
        this.tp = tp;
        this.tn = tn;
        this.trail = [];
        //绑定目标对象
        this._bind();
    }

    /**
     * 绑定追踪的粒子对象: 通过hook目标对象的action()方法来实现隐式的轨迹追踪效果
     * @private
     */
    _bind() {
        this.trail = [this.tp.p.clone()];
        //hook目标对象的action方法
        let _this = this;
        this.tp._tracker_hook_action = this.tp.action;
        this.tp.action = function() {
            let p = this._tracker_hook_action(...arguments);
            (_this.trail.length >= _this.tn) && _this.trail.shift();
            _this.trail.push(p.clone());
            return p;
        }
    }
}


export { TrailTracker };