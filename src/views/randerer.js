/****************************************
 * Name: randerer | 渲染器
 * Date: 2022-09-06
 * Author: Ais
 * Project: Vision
 * Desc: 渲染器模块
 * Version: 0.1
****************************************/

//渲染器基类
class Randerer {

    /*----------------------------------------
    @class: 渲染器基类
    @desc: 渲染器，实现行为逻辑和图像绘制的调度。
    @property: 
        * _ft(number:>0): 帧时间轴，时钟
        * fps(number:>0): 帧数(Frames Per Second)
    @method: 
        * rander: 渲染接口
    ----------------------------------------*/
    constructor(fps=60) {
        //帧时间轴
        this._ft = 0;
        //帧数(Frames Per Second)
        this.fps = fps;
    }

    /*----------------------------------------
    @func: 帧时间轴访问器
    @desc: this._ft用于在类内部实现帧的计数, 对外只读
    ----------------------------------------*/
    get ft() { return this._ft; }

    /*----------------------------------------
    @func: 渲染接口
    ----------------------------------------*/
    rander() { 
        this._ft++; 
    }
}


//间隔渲染器
class IntervalRanderer extends Randerer {

    /*----------------------------------------
    @class: 间隔渲染器
    @desc: 标准渲染器，通过 setInterval 函数实现渲染功能
    @property: 
        * _stop_ft(number:>0): 渲染器停机时间点
        * _timer(obj): setInterval函数返回对象，用于在停机时停止渲染器
        * rander_func(func): 渲染函数
    @method: 
        * rander: 渲染接口
        * stop: 设置停机时间点
    @exp: 
        const randerer = new vision.randerer.IntervalRanderer().rander(() => {
            canvas.reflush();
        });
    ----------------------------------------*/
    constructor(fps=60) {
        super(fps);
        //停止时间点
        this._stop_ftp = Infinity;
        //间隔执行器
        this._timer = null;
        //渲染函数
        this.rander_func = null;
    }

    /*----------------------------------------
    @func: 渲染接口
    @desc: 通过 setInterval 间隔执行 rander_func 实现渲染功能
    @params: 
        * rander_func(func): 渲染函数，
        函数形参 => function() || function(ft), ft为帧时间轴，可选参数
    ----------------------------------------*/
    rander(rander_func) {
        this.rander_func = rander_func;
        //构建间隔执行器
        this._timer = setInterval(()=>{
            if(this._ft < this._stop_ftp) {
                //渲染
                this.rander_func(this._ft++);
             } else {
                //停机
                clearInterval(this._timer);
             } 
         }, Math.ceil(1000/this.fps));
         return this;
    }

    /*----------------------------------------
    @func: 设置停机时间点
    ----------------------------------------*/
    stop(t) {
        this._stop_ftp = t; return this;
    }
}


//单帧渲染器
class SingleFrameRanderer extends Randerer {

    /*----------------------------------------
    @class: 单帧渲染器/手动渲染器
    @desc: 通过绑定按键来控制渲染行为
    @property: 
        * act_ft_n(number:>0): 每次触发渲染时，行为函数的调用次数
        * _rander_keyCode(int): 渲染按键值，控制由什么按键进行渲染
        * act_func(func): 行为函数
        * draw_func(func): 绘制函数
    @method: 
        * method: func
    @exp: 
        const randerer = new vision.randerer.SingleFrameRanderer().rander(
            (ft) => {
                pcs.action();
            },
            (ft) => {
                canvas.reflush();
            }
        );
    ----------------------------------------*/
    constructor(act_ft_n=1) {
        super(1);
        //行为函数调用次数
        this.act_ft_n = act_ft_n;
        //渲染按键值
        this._rander_keyCode = ' '.charCodeAt();
        //行为函数
        this.act_func = null;
        //绘制函数
        this.draw_func = null;
    }

    /*----------------------------------------
    @func: 获取/设置 渲染按键
    ----------------------------------------*/
    get randerKey() { return String.fromCharCode(this._rander_keyCode); }
    set randerKey(key) { this._rander_keyCode = key.charCodeAt(); }
       
    /*----------------------------------------
    @func: 渲染接口
    @desc: 通过在 window 对象上绑定 keydown 事件来触发渲染
    @params: 
        * act_func(func): 行为函数
        * draw_func(func): 绘制函数
    ----------------------------------------*/
    rander(act_func, draw_func) {
        this.act_func = act_func, this.draw_func = draw_func;
        let _this = this;
        //绑定键盘事件
        window.addEventListener("keydown", function(event) {
            if(event.keyCode == _this._rander_keyCode) {
                //行为函数调用
                for(let i=0; i<_this.act_ft_n; i++) {
                    _this.act_func(_this._ft++);
                }
                //绘制函数调用
                _this.draw_func && _this.draw_func(_this._ft);
            }
        }); 
        return this;
    }

}


//场景流渲染器
class SceneFlowRanderer extends Randerer {

    /*----------------------------------------
    @class: 场景流渲染器
    @desc: 指定 场景函数(scene_func) 和 帧时间点(ftp), 帧时间到达后按照 场景流(scene_flow) 进行场景函数的切换
    @property: 
        * key(type): value
    @method: 
        * method: func
    @exp: 
    ----------------------------------------*/
    constructor(fps=60) {
        super(60);
    }
}


// module.exports.Randerer = Randerer;
module.exports.IntervalRanderer = IntervalRanderer;
module.exports.SingleFrameRanderer = SingleFrameRanderer;