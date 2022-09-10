/**********************************
Name:  TreeLeavesVariatorModuleModule  树叶变化器模块
Date: 2017-11-18
Auther: Ais
Version: 1.0
***********************************/

/**********************************
Class Name: LeafVariator  树叶变化器
Property:
    * leaf => 原始树叶对象
    * x, y => 树叶坐标

    * DropThreshold => 飘落阈值
    * Ax, Ay  => x, y 简谐运动幅值缩放率
    * w => 角速度

    * colorvariator => 颜色变化器
    * Mode => 变化模式

Methed:
    * __ColorChange => 颜色变化
    * __Drop => 飘落
    * Change => 变化控制器

***********************************/
class LeafVariator {

    //构造器
    constructor(leaf, DropThreshold, Ax, Ay, w, colorvariator) {
        //原始树叶对象
        this.leaf = leaf;

        //树叶坐标
        this.x = this.leaf.branch.x;
        this.y = this.leaf.branch.y;

        //飘落阈值
        this.DropThreshold = DropThreshold;
        //树叶飘落的运动参数
        this.Ax = Ax;
        this.Ay = Ay;
        this.w = w;

        //颜色变化器
        this.colorvariator = colorvariator;

        //变化模式  0:颜色变化  1:飘落模式
        this.Mode = 0;
    }

    //颜色变化
    __ColorChange() {
        this.colorvariator.change();
        this.leaf.RGB = this.colorvariator.RGB();
        this.x = this.leaf.branch.x;
        this.y = this.leaf.branch.y;
    }

    //飘落
    __Drop(wind, gravity, t) {
        this.x += wind + (wind * this.Ax * Math.sin(ATR(this.w) * t));
        this.y += gravity + (gravity * this.Ay * Math.sin(ATR(this.w) * t));
    }

    //变化
    Change(wind, gravity, t) {
        if (this.colorvariator.isEND && Math.abs(wind) >= this.DropThreshold)
            this.Mode = 1;

        if (this.Mode == 0) {
            this.__ColorChange();
        }
        else {
            this.__Drop(wind, gravity, t);
        }
    }
}

/**********************************
Class Name: LeavesVariatorModule  树叶变化器群
Property:
    * Leaves => 原始树叶对象数组
    * VariatorGroup => 树叶变化器对象数组
    
    * DropThreshold_Range => 飘落阈值范围

    * AxRange, AyRange => 简谐运动幅值缩放率范围
    * wRange => 角速度范围

    * ChangeNumRange => 颜色变化次数范围

Methed:
    * BuildVariatorGroup => 构造变化器群
    * Change => 变化
    * 

***********************************/
class LeavesVariatorModule {

    //构造器
    constructor(leaves) {
        //原始树叶对象数组
        this.Leaves = leaves;

        //树叶变化器对象数组
        this.VariatorGroup = new Array();

        //飘落阈值范围
        this.DropThreshold_Range = LeavesVariatorModule.RangeBuilder(2, 5);

        // Ax, Ay 简谐运动幅值缩放率 范围
        this.AxRange = LeavesVariatorModule.RangeBuilder(0.5, 3);
        this.AyRange = LeavesVariatorModule.RangeBuilder(0.1, 1.5);
        //角速度范围
        this.wRange = LeavesVariatorModule.RangeBuilder(1, 4);

        //颜色变化次数范围
        this.ChangeNumRange = LeavesVariatorModule.RangeBuilder(100, 200);
    }

    //初始化 构造树叶变化器
    Init() {
        this.VariatorGroup = new Array();

        var RGB_R = LeavesVariatorModule.RangeBuilder(150, 200);
        var RGB_G = LeavesVariatorModule.RangeBuilder(50, 200);

        for (let i = 0; i < this.Leaves.length; i++) {
            var DropThreshold = LeavesVariatorModule.Random(this.DropThreshold_Range);
            var Ax = LeavesVariatorModule.Random(this.AxRange);
            var Ay = LeavesVariatorModule.Random(this.AyRange);
            var w = LeavesVariatorModule.Random(this.wRange);
            var ChangeNum = LeavesVariatorModule.Random(this.ChangeNumRange);
            var colorvariator = new ColorVariator(this.Leaves[i].RGB,
                                                  { "R": parseInt(LeavesVariatorModule.Random(RGB_R)), "G": parseInt(LeavesVariatorModule.Random(RGB_G)), "B": 0 },
                                                  ChangeNum);

            this.VariatorGroup.push(new LeafVariator(this.Leaves[i], DropThreshold, Ax, Ay, w, colorvariator));
        }
    }


    //变化
    Change(wind, gravity, t) {
        for (let i = 0; i < this.VariatorGroup.length; i++) {
            this.VariatorGroup[i].Change(wind, gravity, t);
        }
    }

    //绘制
    Draw(canvas){
        for (let i = 0; i < this.VariatorGroup.length; i++) {
            canvas.ctx.fillStyle = this.VariatorGroup[i].leaf.color();
            canvas.circle(this.VariatorGroup[i].x, this.VariatorGroup[i].y, this.VariatorGroup[i].leaf.size, this.VariatorGroup[i].leaf.size);
            canvas.ctx.fill();
        }
    }


}


//范围对象生成器
LeavesVariatorModule.RangeBuilder = function (s, e) {
    return { "s": s, "e": e };
}

//随机数生成器
LeavesVariatorModule.Random = function (range) {
    return Math.random() * (range.e - range.s) + range.s;
}

LeavesVariatorModule.TRGB = function (color) {
    return `rgb(${color.R},${color.G},${color.B})`;
}