/**********************************
Name: 闪电  Lightning
Date: 2017-11-19
Auther: Ais
Version: 1.0
***********************************/


/**********************************
Class Name: Lightning 闪电
Property:
    * MainLightning_x_BuildRange  => 主闪电生成范围
    * MainLightning_y_BuildRange 
    * MainLightning               => 主闪电节点数据

    * BranchLightning_act_Range   => 分支闪电角度范围
    * BranchLightning_len_Range   => 分支闪电长度范围
    * BranchLightning             => 分支闪电节点数据
    
    * NodeIterator_len_modifier   => 节点迭代器半径修正量

    * __colorvariator => 颜色变化器
    * RGBs => 起始颜色
    * RGBe => 终止颜色
    * RGBchangeNum => 颜色变化次数

    * MainLightningWidth => 主闪电宽度
    * BranchLightningWidth => 分支闪电宽度

Method:
    * __NodeIterator  =>  闪电节点迭代器
    * __LightningBuilder =>  闪电构造器

    * __MainLightningBuilder  =>  主闪电构造器
    * __BranchLightningBuilder  =>  分支闪电构造器

    * BuildLightning => 生成闪电

***********************************/
class Lightning {

    //构造器
    constructor(xRange, yRange, actRange, lenRange) {
        //主闪电生成范围
        this.MainLightning_x_BuildRange = xRange;
        this.MainLightning_y_BuildRange = yRange;

        //主闪电迭代次数
        this.MainLightning_Iterations = 25;
        //主闪电节点数据
        this.MainLightning = null;
        
        //分支闪电迭代次数
        this.BranchLightnig_Iterations = 25;
        //分支闪电生成概率
        this.BranchLightning_BuildProbability = 0.6;
        //分支闪电构造参数
        this.BranchLightning_act_Range = actRange || { "s": -Lightning.ATR(60), "e": Lightning.ATR(60) };
        this.BranchLightning_len_Range = lenRange || { "s": 50, "e": 300 };
        //分支闪电节点数据
        this.BranchLightning = null;

        //节点迭代器半径修正量
        this.NodeIterator_len_modifier = 0.5;

        //起始颜色
        this.RGBs = {"R":255, "G":255, "B":255};
        //终止颜色
        this.RGBe = {"R":50, "G":50, "B":50};
        //颜色变化次数
        this.RGBchangeNum = 3;

        //颜色变化器
        this.__colorvariator = null;

        //主闪电宽度
        this.MainLightningWidth = 5;
        //分支闪电宽度
        this.BranchLightningWidth = 1;

    }

    Init(){
        this.__colorvariator = new ColorVariator(this.RGBs, this.RGBe, this.RGBchangeNum);
    }


    //闪电节点迭代器
    __NodeIterator(P1, P2) {
        var len = Lightning.Distance(P1, P2) / 2 * this.NodeIterator_len_modifier;
        var act = Lightning.Random({ "s": 0, "e": Math.PI * 2 });

        //计算中点
        var Mp = Lightning.MiddlePoint(P1, P2);

        var x = Mp.x + len * Math.cos(act);
        var y = Mp.y + len * Math.sin(act);
        return { "x": x, "y": y };
    }


    /* 
    Name: 闪电构造器
    Parameters:
        * Ps => 起始节点
        * Pe => 终止节点
        * iterations => 迭代次数
    */
    __LigthningBuilder(Ps, Pe, iterations) {
        //储存生成的节点
        var LNode = new Array(Ps, Pe);
        //迭代 生成新节点
        for (let i = 0; i < iterations; i++) {
            var points = new Array(LNode[0]);
            for (let k = 0; k < LNode.length - 1; k++) {
                points.push(this.__NodeIterator(LNode[k], LNode[k + 1]));
            }
            points.push(LNode[LNode.length - 1]);

            LNode = points;
        }

        return LNode;
    }


    /* 
    Name: 主闪电构造器
    Parameters:
        * iterations => 迭代次数
    */
    __MainLightningBuilder(iterations) {
        var Ps = { "x": Lightning.Random(this.MainLightning_x_BuildRange), "y": 0 };
        var Pe = { "x": Lightning.Random(this.MainLightning_x_BuildRange), "y": Lightning.Random(this.MainLightning_y_BuildRange) }

        this.MainLightning = this.__LigthningBuilder(Ps, Pe, iterations);
    }


    /* 
    Name: 分支闪电构造器
    Parameters:
        * branch_probability => 生成分支的概率
        * iterations => 分支迭代次数
    */
    __BranchLightningBuilder(branch_probability, iterations) {
        this.BranchLightning = [];

        var MainAct = Lightning.Azimuth(this.MainLightning[0], this.MainLightning[this.MainLightning.length - 1]);

        for (let i = 0; i < this.MainLightning.length - 1; i++) {
            if (Math.random() > branch_probability) {
                var len = Lightning.Random(this.BranchLightning_len_Range);
                var dact = Lightning.Random(this.BranchLightning_act_Range);

                var Ps = this.MainLightning[i];
                var x = Ps.x + len * Math.cos(MainAct + dact);
                var y = Ps.y + len * Math.sin(MainAct + dact);

                this.BranchLightning.push(this.__LigthningBuilder(Ps, { "x": x, "y": y }, iterations));
            }
        }
    }

    /* 
    Name: 闪电构造器 接口
    Parameters:
        * MainLightning_Iterations  =>  主闪电迭代次数
        * BranchLightnig_Iterations => 分支闪电迭代次数
        * BranchLightning_BuildProbability => 生成分支的概率
    */
    BuildLightning() {
        this.__MainLightningBuilder(this.MainLightning_Iterations);
        this.__BranchLightningBuilder(this.BranchLightning_BuildProbability, this.BranchLightnig_Iterations);
    }


    //绘制主闪电
    DrawMainLightning(canvas, color) {
        canvas.ctx.lineWidth = this.MainLightningWidth;
        canvas.ctx.strokeStyle = color;
        for(let i=0; i<this.MainLightning.length-1; i++){
            canvas.line(this.MainLightning[i].x, this.MainLightning[i].y, this.MainLightning[i+1].x, this.MainLightning[i+1].y);
        }
    }

    //绘制分支闪电
    DrawBranchLightning(canvas, color) {
        canvas.ctx.lineWidth = this.BranchLightningWidth;
        canvas.ctx.strokeStyle = color;
        for(let i=0; i<this.BranchLightning.length; i++){
            for(let k=0; k<this.BranchLightning[i].length-1; k++){
                canvas.line(this.BranchLightning[i][k].x, 
                            this.BranchLightning[i][k].y, 
                            this.BranchLightning[i][k+1].x,
                            this.BranchLightning[i][k+1].y);
            }
        }
    }


    //绘制闪电
    Draw(canvas){
        if(this.__colorvariator.isEND == true)
        {
            this.__colorvariator.init();
        }
        else
        {
            this.__colorvariator.change();
            var color = this.__colorvariator.color();
            this.DrawMainLightning(canvas, color);
            this.DrawBranchLightning(canvas, color);
        } 
    }
}


/**********************************
Static Method
***********************************/
Lightning.RangeBuilder = function (s, e) {
    return { "s": s, "e": e };
}

Lightning.Random = function (Range) {
    return Math.random() * (Range.e - Range.s) + Range.s;
}

//计算 点E 相对与 点S 的角度
Lightning.Azimuth = function (Ps, Pe) {
    //计算弧度
    var radian = Math.atan((Pe.y - Ps.y) / (Pe.x - Ps.x));

    if (radian == 0) {
        if (Pe.x > Ps.x) return 0;  // X正半轴
        else return Math.PI;    // X负半轴
    }
    else if (radian > 0) {
        if (Pe.x < Ps.x) return radian + Math.PI;   // [3]象限
        else return radian;                    // [1]象限
    }
    else {
        if (Pe.x < Ps.x) return radian + Math.PI;   // [2]象限
        else return radian + Math.PI * 2;      // [4] 象限
    }
}

Lightning.Distance = function (Ps, Pe) {
    var dx = (Ps.x - Pe.x);
    var dy = (Ps.y - Pe.y);
    return Math.sqrt((dx * dx) + (dy * dy));
}

//角度转弧度
Lightning.ATR = function (Angle) {
    return Angle * ((Math.PI * 2) / 360);
}

Lightning.RGB = function (R, G, B) {
    return `rgb(${R},${G},${B})`;
}

Lightning.MiddlePoint = function (P1, P2) {
    return { "x": (P1.x + P2.x) / 2, "y": (P1.y + P2.y) / 2 };
}