/****************************************
 * Name: utils.random unittest
 * Date: 2022-08-01
 * Author: Ais
 * Project: Vision
 * Desc: 
 * Version: 0.1
****************************************/

//导入目标测试模块
const random = require("../src/utils/random");

//随机选择器
test("utils.random.RandomSelector", () => {
    //选项集
    let ops = [["a", 1], ["b", 1], ["c", 3], ["d", 1]]
    //构建随机选择器
    let rs = new random.RandomSelector(ops);
    //计算ops概率
    let swt = ops.reduce((op1, op2)=>{return (op1[1]||op1)+op2[1]});
    let p_ops = ops.map((op)=>{return op[1]/swt});
    //构建样本集
    let sample = {};
    for(let i=0, n=ops.length; i<n; i++) { sample[ops[i][0]] = 0; }
    //随机选择
    let N = 100000;
    for(let i=0; i<N; i++) { sample[rs.select()]++; }
    //计算样本概率
    let p_sample = ops.map((op)=>{return sample[op[0]]/N});
    //可接受的误差范围
    let d = 0.01;
    //计算误差
    let pd = [];
    for(let i=0, n=p_ops.length; i<n; i++) {
        pd[i] = Math.abs(p_ops[i]-p_sample[i]);
    }
    expect(pd.reduce((x, y)=>{return x+y})).toBeLessThanOrEqual(d*pd.length)
});