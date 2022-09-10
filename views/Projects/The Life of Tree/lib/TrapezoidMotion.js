/**********************************
Name: TrapezoidMotion  梯形运动发生器
Date: 2017-11-20
Auther: Ais
Version: 0.1 
***********************************/

/**********************************
Class Name: TrapezoidMotion 梯形运动发生器
Property:
    * Max, Min => 最值
    * value => 当前值
    * v => 速度
    * __LoopMotionMode => 循环运动内部状态

Method:
    * up => 上升
    * down => 下降
    * loop => 循环运动
    * moveto => 移动到特定值

***********************************/
class TrapezoidMotion {

    //构造器
    constructor(min, max, v, value) {
        this.Min = min;
        this.Max = max;

        this.v = v;
        if(value == undefined || value > this.Max || value < this.Min)
            this.value = min;
        else 
            this.value = value;
            
        this.__LoopMotionMode = 0;
    }

    //上升 
    up() {
        if(Math.abs(this.Max - this.value) < Math.abs(this.v))
            return false;
        
        this.value += this.v;
        return true;
    }

    //下降 
    down() {
        if(Math.abs(this.Min - this.value) < Math.abs(this.v))
            return false;
        
        this.value -= this.v;
        return true;
    }

    //循环运动
    loop() {
        if(this.__LoopMotionMode == 0 && this.up() == false) 
        {
            this.__LoopMotionMode = 1
        }

        if(this.__LoopMotionMode == 1 && this.down() == false) 
        {
            this.__LoopMotionMode = 0
        }
    }

    //移动到 value 值处
    moveto(value) {
        if(Math.abs(this.value - value) < Math.abs(this.v))
            return false;

        if(this.value < value) 
            this.up();
        else 
            this.down();
        
        return true;
    }
}