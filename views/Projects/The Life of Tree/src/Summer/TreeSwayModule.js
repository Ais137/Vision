/**********************************
Name: TreeSwingModule  摆动模块  
Date: 2017-11-18
Auther: Ais
Version: 1.0
***********************************/


/**********************************
Class Name:  Simple Harmonic Motion (SHM) 简谐运动
Property:
    * A => 幅角
    * w => 角速度
    * da => 幅值偏移量
    * dact => 角偏移
Method:
    * value() => 获取值
***********************************/
class SHM {

    //构造器
    constructor(A, w, da, dact) {
        this.A = A;
        this.w = w;
        this.da = da || 0;
        this.dact = dact || 0;
    }

    value(t) {
        return this.A * Math.sin(this.w * t + this.dact) + this.da;
    }
}


/**********************************
Class Name:  BranchLayerSHM  树枝层简谐运动器
Property:
    * A_Rate => 幅角缩放比
    * w => 角速度
    * da => 幅值偏移量
    * dact => 角偏移
Method:
    * value() => 获取值
***********************************/
class BranchLayerSHM {

    //构造器
    constructor(A, vRate, layer, dact) {
        this.layer = layer - 1;
        this.A = A;
        this.vRate = vRate;
        this.dact = dact || 0;

        this.t = this.dact;
    }

    value(wind){
        this.t += BranchLayerSHM.ATR(wind * this.vRate);
        return (this.A * Math.sin(this.t));
        if(this.t > Math.PI * 2)
            this.t = this.t - Math.PI * 2;
    }
}

//角度转弧度
BranchLayerSHM.ATR =  function(Angle){
    return Angle * ((Math.PI * 2) / 360);
}


/**********************************
Class Name: TreeSwayModule  摆动模块
Property:
    * tree => 要作用的树对象
    * SHMGroup =>  简谐运动发生器群
Method:
    * __SwingBranchLayer => 摆动树枝层
    * Swing => 摆动
    
***********************************/
class TreeSwayModule {

    //构造器
    constructor(tree) {
        this.tree = tree;
        this.BranchLayerSHMGroup = new Array();
    }

    //添加简谐运动发生器
    AddSHM(shm) {
        if (shm.layer >= this.tree.Branchs.length)
            return;
        this.BranchLayerSHMGroup.push(shm);
    }

    //摆动树枝层
    __SwingBranchLayer(act, layer) {
        for (let n = layer; n < this.tree.Branchs.length; n++) {
            for (let i = 0; i < this.tree.Branchs[n].length; i++) {
                this.tree.Branchs[n][i].dact = act;
                this.tree.Branchs[n][i].update();
            }
        }
    }

    //摆动
    Swing(wind) {
        for (let i = 0; i < this.BranchLayerSHMGroup.length; i++) {
            this.__SwingBranchLayer(this.BranchLayerSHMGroup[i].value(wind), this.BranchLayerSHMGroup[i].layer);
        }
    }
}

