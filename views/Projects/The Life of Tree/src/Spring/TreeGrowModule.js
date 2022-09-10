/**********************************
Name: TreeGrowerModule  生长模块  
Date: 2017-11-18
Auther: Ais
Version: 1.0
***********************************/


/********************************** 
Class Name: BranchGrower  树枝生长器
Property: 
    * branch => 树枝对象
    * Sx, Sy => 树枝起始坐标
    * x, y => 当前坐标
    
    * Elen => 终止长度
    * len => 当前生长长度
    * act => 生长方向
    * v => 生长速度

Method:
    * Grow() => 生长
***********************************/
class BranchGrower {

    //构造器
    constructor(branch, v) {
        this.branch = branch;

        this.Sx = branch.Fnode.x;
        this.Sy = branch.Fnode.y;

        this.x = this.Sx;
        this.y = this.Sy;

        this.Elen = branch.len;
        this.len = 0;
        this.act = branch.act;
        this.v = v;
    }

    //生长
    Grow() {
        if (Math.abs(this.Elen - this.len) <= this.v)
            return false;

        this.len += this.v;
        this.x = this.Sx + this.len * Math.cos(this.act);
        this.y = this.Sy + this.len * Math.sin(this.act);

        return true;
    }
}


/********************************** 
Class Name: LeafGrower  树叶生长器
Property: 
    * leaf => 树叶对象
    * x, y => 树叶坐标
 
    * Esize => 终止大小
    * size => 当前大小
    * v => 生长速度
 
Method:
    * Grow() => 生长
***********************************/
class LeafGrower {

    //构造器
    constructor(leaf, v) {
        this.leaf = leaf;
        this.x = leaf.branch.x;
        this.y = leaf.branch.y;

        this.Esize = leaf.size;
        this.size = 0;
        this.v = v;
    }

    //生长
    Grow() {
        if (Math.abs(this.Esize - this.size) <= this.v) {
            this.size = this.Esize;
            return false;
        }

        this.size += this.v;

        return true;
    }
}


/**********************************
Class Name: TreeGrowModule 树生长模块
Property:
    * tree => 生长的树对象
    * LeavesNum => 树叶数量

    * BranchGrowerGroup => 树枝生长器群
    * LeafGrowerGroup   => 树叶生长器群 
 
    * Branch_vRate => 树枝生长速度比例:  v = Elen * vRate
    * Leaf_vRate   => 树叶生长速度比例:  v = Esize * vRate
Method:
    
***********************************/
class TreeGrowerModule {

    //构造器
    constructor(tree, branch_vRate, leaf_vRate) {

        this.tree = tree;
        //树叶数量
        this.LeavesNum = tree.Leaves.length;

        //树枝，树叶 生长速度比例
        this.Branch_vRate = branch_vRate;
        this.Leaf_vRate = leaf_vRate;

        //树枝，树叶 生长器群
        this.BranchGrowerGroup = new Array(new BranchGrower(tree.RootBranch, tree.RootBranch.len * branch_vRate));
        this.LeafGrowerGroup = new Array();
    }

    //生长树枝
    __BranchGrow() {
        for (let i = 0; i < this.BranchGrowerGroup.length; i++) {
            if (this.BranchGrowerGroup[i] != null && this.BranchGrowerGroup[i].Grow() == false) {
                if (this.BranchGrowerGroup[i].branch.layer < this.tree.Branchs.length - 1) {

                    this.BranchGrowerGroup.push(new BranchGrower(this.BranchGrowerGroup[i].branch.Rnode,
                                                                 this.BranchGrowerGroup[i].branch.Rnode.len * this.Branch_vRate));

                    this.BranchGrowerGroup.push(new BranchGrower(this.BranchGrowerGroup[i].branch.Lnode,
                                                                 this.BranchGrowerGroup[i].branch.Lnode.len * this.Branch_vRate));

                    this.BranchGrowerGroup[i] = null;
                }
                else {
                    if (this.LeafGrowerGroup.length < this.tree.Leaves.length) {

                        this.LeafGrowerGroup.push(new LeafGrower(this.BranchGrowerGroup[i].branch.leaf,
                                                                 this.BranchGrowerGroup[i].branch.leaf.size * this.Leaf_vRate));
                        this.BranchGrowerGroup[i] = null;
                    }
                }
            }
        }
    }

    //生长树叶
    __LeafGrow() {
        //计数器 => 统计有多少树叶生长结束
        var count = 0;
        for (let i = 0; i < this.LeafGrowerGroup.length; i++) {
            if (this.LeafGrowerGroup[i].Grow() == false)
                count++;
        }

        //判断树是否生长结束
        if (count < this.LeavesNum)
            return false;
        else
            return true;
    }

    //生长
    Grow() {
        this.__BranchGrow();
        return this.__LeafGrow();
    }

    //绘制树
    Draw(canvas){
        //绘制树枝
        for(let i=0; i<this.BranchGrowerGroup.length; i++){
            if(this.BranchGrowerGroup[i] != null)
            {
                canvas.ctx.strokeStyle = this.BranchGrowerGroup[i].branch.color();
                canvas.ctx.fillStyle = this.BranchGrowerGroup[i].branch.color();
                var r = this.BranchGrowerGroup[i].branch.width / 2;
                canvas.circle(this.BranchGrowerGroup[i].x, this.BranchGrowerGroup[i].y, r, r);
                canvas.ctx.fill()  
            }
        }

        //绘制树叶
        canvas.ctx.lineWidth = 1;
        for(let i=0; i<this.LeafGrowerGroup.length; i++){
            var r = this.LeafGrowerGroup[i].size;
            canvas.ctx.fillStyle = this.LeafGrowerGroup[i].leaf.color();
            canvas.circle(this.LeafGrowerGroup[i].leaf.branch.x, this.LeafGrowerGroup[i].leaf.branch.y, r, r);
            canvas.ctx.fill();
        }

    }

}