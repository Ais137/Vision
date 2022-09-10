/**********************************
Name:  TreeBranchVariatorModuleModule  树枝变化器模块
Date: 2017-11-19
Auther: Ais
Version: 1.0
***********************************/


/**********************************
Class Name: BranchVariator  树枝层变化器
Property:
    * BranchLayer => 原始树枝层对象
    * colorvariator => 颜色变化器
    * isEND => 终止标识符
    * layer => 所在层数

Methed:
    * Change => 变化
***********************************/
class BranchLayerVariator {

    //构造器
    constructor(branchlayer, colorvariator) {
        //原始树枝层对象
        this.BranchLayer = branchlayer;
        //颜色变化器
        this.colorvariator = colorvariator;
        //终止符
        this.isEND = false;
        //层数
        this.layer = branchlayer[0].layer;
    }

    //变化
    Change() {
        if(this.isEND == true)
            return; 
        
        this.colorvariator.change();
        this.isEND = this.colorvariator.isEND;

        for(let i=0; i<this.BranchLayer.length; i++)
            this.BranchLayer[i].RGB = this.colorvariator.RGB();
    }
}


/**********************************
Class Name: BranchVariatorModule  树枝变化模块
Property:
    * Branchs => 原始树枝对象数组
    * VariatorGroup => 树枝层变化器对象数组
Methed:
    * Init => 初始化
    * Change => 变化

***********************************/
class BranchVariatorModule {

    //构造器
    constructor(branchs) {

        //原始树枝对象数组
        this.Branchs = branchs;
        //树枝层变化器对象
        this.VariatorGroup = new Array();

        //终止符
        this.isEND = false;
        //总层数
        this.__LayerNum = this.Branchs.length;

        //颜色 控制参数
        this.dRGB = 15;
        this.sRGB = 100;

        //颜色变化次数 控制参数
        this.dNum = 30;
        this.sNum = 100;
        
    }

    //初始化
    Init() {
        this.__LayerNum = this.Branchs.length;

        for(let i=0; i<this.__LayerNum; i++) {
            var color = i * this.dRGB + this.sRGB;
            var changeNum = (this.__LayerNum - i) * this.dNum + this.sNum;
            var colorvariator = new ColorVariator(this.Branchs[i][0].RGB, {"R":color, "G":color, "B":color}, changeNum);
            
            this.VariatorGroup.push(new BranchLayerVariator(this.Branchs[i], colorvariator));  
        }
    }

    //变化
    Change() {
        if(this.isEND == true)
            return;

        var count = 0;
        for(let i=0; i<this.VariatorGroup.length; i++) {
            if(this.VariatorGroup[i].isEND == false) 
                this.VariatorGroup[i].Change();
            else
                count++;
        }

        if(count == this.VariatorGroup.length)
            this.isEND = true;
    }
}

