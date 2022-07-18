/****************************************
 * Name: 轨迹追踪器
 * Date: 2022-07-15
 * Author: Ais
 * Project: Vision
 * Desc: 追踪记录目标粒子的移动轨迹
 * Version: 0.1
****************************************/

class TrailTracker {

    /*----------------------------------------
    @func: 轨迹追踪器
    @desc: 隐式地追踪记录目标粒子的移动轨迹
    @property: 
        * tp(Particle): 目标粒子
        * tn(number): 轨迹长度
        * trail(list:Vector): 轨迹向量容器
    @method:
        * _bind(): 绑定追踪的粒子对象
    ----------------------------------------*/
    constructor(tp, tn=10) {
        //目标粒子
        this.tp = tp;
        //轨迹长度
        this.tn = tn;
        //轨迹
        this.trail = [];
        //绑定目标对象
        this._bind();
    }

    /*----------------------------------------
    @func: 绑定追踪的粒子对象
    @desc: 通过hook目标对象的action()方法来实现隐式的轨迹追踪效果
    ----------------------------------------*/
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


module.exports.TrailTracker = TrailTracker;