/**********************************
Name: TreeIOModule  树-导入导出模块  
Date: 2017-11-22
Auther: Ais
Version: 1.0
Description:
    在使用 JSON.stringify() 方法将树导出时，会产生一个问题，
由于在树枝和树叶中含有引用类型的数据，所以无法导出，因此设计
这个模块来解决这个问题。
***********************************/

/**********************************
Class Name: TreeIOModule  树-导入导出模块

Method:
    * ExportTree  =>  导出树
    * ImportTree  =>  导入树 
***********************************/
class TreeIOModule { constructor(){} };


/*********************** 
        导出树枝
************************/
TreeIOModule.ExportTree = function(tree) {


    /******* 复制重建树所需要的参数 ******/
    var treeData = new Object();

    /***** 复制根节点数据 *****/
    var RootBranch = new Object();
    RootBranch.Fnode = {"x":tree.RootBranch.Fnode.x, "y":tree.RootBranch.Fnode.y};
    RootBranch.len = tree.RootBranch.len;
    RootBranch.act = tree.RootBranch.act;
    RootBranch.width = tree.RootBranch.width
    RootBranch.RGB = {"R":tree.RootBranch.RGB.R, "G":tree.RootBranch.RGB.G, "B":tree.RootBranch.RGB.B}
    treeData.RootBranch = RootBranch;

    /***** 复制树构造参数 ******/
    //树枝迭代器参数
    treeData.BranchActRange = Tree.RangeBuilder(tree.BranchActRange.s, tree.BranchActRange.e);
    treeData.BranchLenRange = Tree.RangeBuilder(tree.BranchLenRange.s, tree.BranchLenRange.e);
    //树枝颜色增量
    treeData.Branch_dRGB = {"dR":tree.Branch_dRGB.dR, "dG":tree.Branch_dRGB.dG, "dB":tree.Branch_dRGB.dB};
    //树枝宽度增量
    treeData.Branch_dWidth = tree.Branch_dWidth;
    //树叶尺寸参数
    treeData.LeafSizeRange = Tree.RangeBuilder(tree.LeafSizeRange.s, tree.LeafSizeRange.e); 
    //树叶颜色范围
    treeData.LeafColorRange = Tree.RangeBuilder(tree.LeafColorRange.s, tree.LeafColorRange.e); 
    //树的层数
    treeData.Layer = tree.Layer;


    /***** 储存树枝数据 ******/
    var BranchsData = new Array();

    //构造导出的树枝数据 与 树枝位置编码 
    for(let layer=0; layer<tree.Branchs.length; layer++) {
        for(let num=0; num<tree.Branchs[layer].length; num++) {

            var len = tree.Branchs[layer][num].len;
            var act = tree.Branchs[layer][num].act;
            var location = {"Layer":layer, "Num":num};

            BranchsData.push({"len":len, "act":act, "location":location});
        }
    }

    treeData.BranchsData = BranchsData;

    return treeData;

}




/*********************** 
        导入树枝
************************/
TreeIOModule.ImportTree = function(treeData) {
    
    /****** 创建根节点 *******/
    var RootBranch = new Branch(treeData.RootBranch.Fnode, 
                                treeData.RootBranch.len,
                                treeData.RootBranch.act,
                                treeData.RootBranch.width,
                                treeData.RootBranch.RGB );

    /***** 创建一个树对象 *****/
    var tree = new Tree(RootBranch);

    /***** 设置树的参数 ******/
    //树枝迭代器参数
    tree.BranchActRange = Tree.RangeBuilder(treeData.BranchActRange.s, treeData.BranchActRange.e);
    tree.BranchLenRange = Tree.RangeBuilder(treeData.BranchLenRange.s, treeData.BranchLenRange.e);
    //树枝颜色增量
    tree.Branch_dRGB = {"dR":treeData.Branch_dRGB.dR, "dG":treeData.Branch_dRGB.dG, "dB":treeData.Branch_dRGB.dB};
    //树枝宽度增量
    tree.Branch_dWidth = treeData.Branch_dWidth;
    //树叶尺寸参数
    tree.LeafSizeRange = Tree.RangeBuilder(treeData.LeafSizeRange.s, treeData.LeafSizeRange.e); 
    //树叶颜色范围
    tree.LeafColorRange = Tree.RangeBuilder(treeData.LeafColorRange.s, treeData.LeafColorRange.e); 
    

    /***** 构造树 *****/
    tree.Building(treeData.Layer);


    console.log(tree);
    /****** 更新树枝数据 *******/
    for(let i=0; i<treeData.BranchsData.length; i++) {
        
        //获取树枝位置
        var layer = treeData.BranchsData[i].location.Layer;
        var num = treeData.BranchsData[i].location.Num;

        //更新参数
        tree.Branchs[layer][num].len = treeData.BranchsData[i].len;
        tree.Branchs[layer][num].act = treeData.BranchsData[i].act;
        
        tree.Branchs[layer][num].update();
    }

    
    return tree;
}

