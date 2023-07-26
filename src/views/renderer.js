/**
 * @module
 * @desc     渲染器模块
 * @project  Vision
 * @author   Ais
 * @date     2022-09-06
 * @version  0.1.0
*/


//渲染器基类
class Renderer {

    /**
     * @classdesc 渲染器基类: 实现行为逻辑和图像绘制的调度。
     * 
     * @property { get } ft - 帧时间轴，时钟
     * @property { number } fps - 帧数(Frames Per Second)(int & fps>0)
     * 
     * @param { number } [fps=60] - 渲染帧数 
     */
    constructor(fps=60) {
        this._ft = 0;
        this.fps = fps;
    }

    /** 帧时间轴访问器 */
    get ft() { return this._ft; }

    /** 渲染接口  */
    render() { 
        this._ft++; 
    }
}


//间隔渲染器
class IntervalRenderer extends Renderer {

    /**
     * @classdesc 间隔渲染器: 通过 setInterval 函数实现渲染功能
     * 
     * @property { get } ft - 帧时间轴，时钟
     * @property { number } fps - 帧数(Frames Per Second)(int & fps>0)
     * @property { Function } renderer_func - 渲染函数: 函数形参 => function() || function(ft), ft为帧时间轴，可选参数
     * 
     * @param { number } [fps=60] - 渲染帧数
     * 
     * @example 
     * const renderer = new vision.renderer.IntervalRenderer().render(() => {
     *     canvas.refresh();
     * });
     */
    constructor(fps=60) {
        super(fps);
        //停止时间点
        this._stop_ftp = Infinity;
        //间隔执行器
        this._timer = null;
        //渲染函数
        this.renderer_func = null;
    }

    /**
     * 渲染接口: 通过 setInterval 间隔执行 renderer_func 实现渲染功能
     * 
     * @param { Function } renderer_func - 渲染函数: 函数形参 => function() || function(ft), ft为帧时间轴，可选参数
     * @returns { Object } this
     */
    render(renderer_func) {
        this.renderer_func = renderer_func;
        //构建间隔执行器
        this._timer = setInterval(()=>{
            if(this._ft < this._stop_ftp) {
                //渲染
                this.renderer_func(this._ft++);
             } else {
                //停机
                clearInterval(this._timer);
             } 
         }, Math.ceil(1000/this.fps));
         return this;
    }

    /**
     * 设置停机时间点
     * 
     * @param { number } t - 停机时间点 
     * @returns { Object } this
     */
    stop(t) {
        this._stop_ftp = t; return this;
    }
}


//单帧渲染器
class SingleFrameRenderer extends Renderer {

    /**
     * @classdesc 单帧渲染器/手动渲染器: 通过绑定按键来控制渲染行为
     * 
     * @property { number } act_ft_n - 每次触发渲染时，行为函数的调用次数(int & act_ft_n>0)
     * @property { Function } act_func - 行为函数
     * @property { Function } draw_func - 绘制函数
     * @property { get/set } renderKey - 渲染按键值，控制由什么按键触发渲染
     * 
     * @param { number } [act_ft_n=1] - 每次触发渲染时，行为函数的调用次数(int & act_ft_n>0)
     * 
     * @example
     * const renderer = new vision.renderer.SingleFrameRenderer().render(
     *     (ft) => {
     *         pcs.action();
     *     },
     *     (ft) => {
     *         canvas.refresh();
     *     }
     * );
     */
    constructor(act_ft_n=1) {
        super(1);
        this.act_ft_n = act_ft_n;
        this.act_func = null;
        this.draw_func = null;
        //渲染按键值
        this._render_keyCode = ' '.charCodeAt();
    }

    /** 获取渲染按键值 */
    get renderKey() { return String.fromCharCode(this._render_keyCode); }
    /** 设置渲染按键值 */
    set renderKey(key) { this._render_keyCode = key.charCodeAt(); }
       
    /**
     * 渲染接口: 通过在 window 对象上绑定 keydown 事件来触发渲染
     * 
     * @param { Function } act_func - 行为函数
     * @param { Function } draw_func - 绘制函数 
     * @returns 
     */
    render(act_func, draw_func) {
        this.act_func = act_func, this.draw_func = draw_func;
        let _this = this;
        //绑定键盘事件
        window.addEventListener("keydown", function(event) {
            if(event.keyCode == _this._render_keyCode) {
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
class SceneFlowRenderer extends Renderer {

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


export { IntervalRenderer, SingleFrameRenderer };