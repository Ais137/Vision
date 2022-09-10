/**********************************
Name: 树  Tree  
Date: 2017-11-18
Auther: Ais
Version: 3.0
***********************************/


/**********************************
Class Name: Branch 分支
Property:
    * x, y => 当前分支的末端坐标
    * len  => 分支长度
    * act  => 分支角度

    * Fnode => 父节点
    * Lnode => 左分支节点
    * Rnode => 右分支节点

    * layer => 层数
    * dact => 角偏移量

    * RGB => 树枝的 RGB 值 

Method:
    * update => 更新当前末节点坐标
***********************************/
class Branch{
    constructor(fathernode, len, act, width, RGB){
        //分支末端坐标
        this.x = 0;
        this.y = 0;
        
        //分支的长度与角度 => 相对与分支起点
        this.len = len;
        this.act = act;
        //树枝宽度
        this.width = width;
        
        //父节点与子节点
        this.Fnode = fathernode;
        this.Lnode = null;
        this.Rnode = null;
        
        //在树中所在的层数
        this.layer = 0;
        //角偏差
        this.dact = 0;
        //树枝颜色
        this.RGB = RGB;

        //更新末端坐标
        this.update();
    }

    //更新末端坐标
    update(){
        this.x = this.Fnode.x + this.len * Math.cos(this.act + this.dact);
        this.y = this.Fnode.y + this.len * Math.sin(this.act + this.dact);
    }

    //获取树枝颜色
    color(){
        return `rgb(${parseInt(this.RGB.R)},${parseInt(this.RGB.G)},${parseInt(this.RGB.B)})`;
    }
}


/**********************************
Class Name: Leaf 树叶
Property:
    * branch => 树叶所在的树枝
    * size => 树叶大小
    * RGB => 树叶的 RGB 值
    
Methed: 
    color => 将RGB对象转换成字符串形式

***********************************/
class Leaf{
    constructor(branch, size, RGB){
        this.branch = branch;
        this.size = size;
        this.RGB = RGB;
    }

    //获取树叶颜色
    color(){
        return `rgb(${parseInt(this.RGB.R)},${parseInt(this.RGB.G)},${parseInt(this.RGB.B)})`;
    }
}


/**********************************
Class Name: Tree 树
Property:
    * RootBranch (Branch对象) => 根分支

    分支迭代器参数:
        * BranchActRange (Range对象) => 角偏差范围
        * BranchLenRange (Range对象) => 长度缩放比范围
        * BranchdRGB => dR,dG,dB => 树枝颜色增量
        * BranchdWidth => //树枝宽度增量

    树叶生成器参数:
        * LeafSizeRange (Range对象) =>  树叶大小范围
        * LeafColor => 树叶颜色

    * Branchs (Array数组) => 存储树枝对象
    * Leaves (Array数组) => 储存树叶对象

    * Layer => 树的层数

Method:
    * __BranchBuilder => 分支生成器
    * __LeavesBuilder => 树叶生成器

    * __BranchLayerIterator => 分支层迭代器

    * Building => 生成树

    * DrawBranch => 绘制树枝
    * DrawLeaves => 绘制树叶
    * Draw => 绘制树
***********************************/
class Tree{

    //构造器
    constructor(RootBranch){
        //根分支
        this.RootBranch = RootBranch;

        //树枝迭代器参数
        this.BranchActRange = Tree.RangeBuilder(Tree.ATR(10), Tree.ATR(30));
        this.BranchLenRange = Tree.RangeBuilder(0.6, 0.9);
        //树枝颜色增量
        this.Branch_dRGB = {"dR":1, "dG":1, "dB":1};
        //树枝宽度增量
        this.Branch_dWidth = -1;

        //树叶尺寸参数
        this.LeafSizeRange = Tree.RangeBuilder(3, 5);
        //树叶颜色范围
        this.LeafColorRange = Tree.RangeBuilder(100, 150);

        //树枝
        this.Branchs = new Array();
        //树叶
        this.Leaves = new Array();

        //树的层数 => 树枝的层数
        this.Layer = 0;

    }


    //分支生成器
    __BranchBuilder(FatherBranch){
        //添加随机因子
        var dact = Tree.Random(this.BranchActRange);
        var dlen = Tree.Random(this.BranchLenRange);
        
        //构造树枝长度
        var len = FatherBranch.len * dlen;
        //构造树枝宽度
        var width = FatherBranch.width + this.Branch_dWidth;
        //构造树枝颜色
        var RGB = { "R":FatherBranch.RGB.R + this.Branch_dRGB.dR, 
                    "G":FatherBranch.RGB.G + this.Branch_dRGB.dG,
                    "B":FatherBranch.RGB.B + this.Branch_dRGB.dB }; 

        //生成下一代分支
        var NextBranch = {};

        //生成 左分支
        NextBranch.LB = new Branch(FatherBranch, len, FatherBranch.act + dact, width, RGB);
        NextBranch.LB.layer = FatherBranch.layer + 1;
        
        //生成 右分支
        NextBranch.RB = new Branch(FatherBranch, len, FatherBranch.act - dact, width, RGB);
        NextBranch.RB.layer = FatherBranch.layer + 1;

        //连接父节点与子节点
        FatherBranch.Lnode = NextBranch.LB;
        FatherBranch.Rnode = NextBranch.RB;

        return NextBranch;
    }


    //树叶生成器
    __LeavesBuilder(BranchLayer){
        //创建一个新的树叶数组
        var Leaves = new Array();
     
        for(let i=0; i<BranchLayer.length; i++)
        {
            var color = parseInt(Tree.Random(this.LeafColorRange));
            var leaf = new Leaf(BranchLayer[i], Tree.Random(this.LeafSizeRange), {"R":0, "G":color, "B":0});
            BranchLayer[i].leaf = leaf;
            Leaves.push(leaf);
        }

        return Leaves;
    }

    
    //分支层迭代器
    __BranchLayerIterator(BranchLayer){
        //存储下一代分支的数组
        var NextLayerBranch = new Array();
        
        //构建下一代分支
        for(let i=0; i<BranchLayer.length; i++)
        {
            var nextBranch = this.__BranchBuilder(BranchLayer[i]);
            NextLayerBranch.push(nextBranch.LB, nextBranch.RB);
        }

        return NextLayerBranch;
    }


    //构造树   layer 树的层数
    Building(layer){
    
        this.Layer = layer;
        this.Branchs = new Array([this.RootBranch]);
        this.Leaves = new Array();

        //生成树分支
        for(let i=1; i<layer; i++)
        {
            this.Branchs.push(this.__BranchLayerIterator(this.Branchs[i-1]));
        }

        //生成树叶
        this.Leaves = this.__LeavesBuilder(this.Branchs[layer-1]);
    }


    //绘制树枝
    DrawBranch(canvas){
        canvas.ctx.lineCap = "round";

        var BranchsLength = this.Branchs.length;
        var BranchsLayerLength = 0;

        for(let i=0; i<BranchsLength; i++)
        {
            BranchsLayerLength = this.Branchs[i].length
            for(let k=0; k<BranchsLayerLength; k++)
            {
                canvas.ctx.lineWidth = this.Branchs[i][k].width;
                canvas.ctx.strokeStyle = this.Branchs[i][k].color();
                //canvas.line(this.Branchs[i][k].x, this.Branchs[i][k].y, this.Branchs[i][k].Fnode.x, this.Branchs[i][k].Fnode.y);

                canvas.ctx.beginPath();
                canvas.ctx.moveTo(this.Branchs[i][k].x, this.Branchs[i][k].y);
                canvas.ctx.lineTo(this.Branchs[i][k].Fnode.x, this.Branchs[i][k].Fnode.y);   
                canvas.ctx.stroke(); 
            }
        }
    }


    //绘制树叶
    DrawLeaves(canvas){
        canvas.ctx.lineWidth = 1;

        var LeavesLength = this.Leaves.length;

        for (let i = 0; i < LeavesLength; i++) {
            canvas.ctx.fillStyle = this.Leaves[i].color();
            canvas.circle(this.Leaves[i].branch.x, this.Leaves[i].branch.y, this.Leaves[i].size, this.Leaves[i].size);
            canvas.ctx.fill();
        }
    }


    //绘制树
    Draw(canvas){
        this.DrawBranch(canvas);
        this.DrawLeaves(canvas);
    }
}


/**********************************
Tree Static Methed:
    * RangeBuilder => 范围对象生成器
    * Random => 随机数生成器
    * ATR => 角度转弧度
***********************************/

//范围对象生成器
Tree.RangeBuilder = function(s, e){
    return {"s":s, "e":e};
}

//随机数生成器 
Tree.Random = function(Range){
    return Math.random() * (Range.e - Range.s) + Range.s;
}

//角度转弧度
Tree.ATR =  function(Angle){
    return Angle * ((Math.PI * 2) / 360);
}





