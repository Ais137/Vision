/****************************************
 * Name: alog.nns unittest
 * Date: 2023-01-09
 * Author: Ais
 * Project: Vision
 * Desc: 邻近搜索算法模块单元测试
 * Version: 0.1
****************************************/


import { Vector } from "../../src/vector/vector.js";
import { Particle } from "../../src/particle/Particle.js";
import { ParticleSystem } from "../../src/particle/ParticleSystem.js";
//导入目标测试模块
import * as NNS from "../../src/algo/NNS.js";


//LinearNNS: 线性邻近搜索算法验证
test("algo.NNS.LinearNNS", () => {
    //对象集
    let ps = Vector.vpoints([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9], [10]]);
    //构建算法模块
    let LNNS = new NNS.LinearNNS(ps);
    //目标对象 ->  Vector(5)
    let tp = ps[parseInt(ps.length/2)];
    //nps -> list
    let tolist = function(nps) { return nps.map((v) => {return v.x}); }
    //距离邻近集
    expect(tolist(LNNS.near(tp, 1))).toEqual([4, 6]);
    expect(tolist(LNNS.near(tp, 2))).toEqual([3, 4, 6, 7]);
    expect(tolist(LNNS.near(ps[0], 3))).toEqual([1, 2, 3]);
    //k邻近集
    expect(tolist(LNNS.k_near(tp, 2))).toEqual([4, 6]);
    expect(tolist(LNNS.k_near(ps[0], 3))).toEqual([1, 2, 3]);
    //粒子对象测试: 可视化验证 -> (./algo.nns.visualization.test.html)
});

//以 LinearNNS 算法为基准测试其他等价算法
test("algo.NNS", () => {

    //测试数据集参数
    let confs = {
        //数据集定义域范围
        "dod": [-1000, 1000],
        //数据集大小
        "N": 1000,
        //测试参数
        "dist": 100, 
        "k": 7
    }
    //生成测试数据集
    let ps = new ParticleSystem(() => {
        return new Particle(
            Vector.random([confs.dod, confs.dod]),
        );
    }).build(confs.N).ps;
    let vect = function(obj) { return obj.p; };
    //构建目标测试数据
    let tp = new Particle(Vector.random([confs.dod, confs.dod]));
    //计算邻近集差异
    let diff_nps = function(nps1, nps2, max_diff=0) {
        let nps = new Set(nps2.filter(d => { return nps1.includes(d) ? d : null}));
        let diff = (nps1.length-nps.size) + (nps2.length-nps.size);
        return diff<=max_diff;
    }

    //构建 LinearNNS 基准测试算法
    let LNNS = new NNS.LinearNNS(ps, vect);

    //测试 GridNNS 算法
    let GNNS = new NNS.GridNNS(ps, vect, confs.dist, [confs.dod, confs.dod]).build();
    expect(diff_nps(LNNS.near(tp, confs.dist), GNNS.near(tp, confs.dist))).toEqual(true);
    expect(diff_nps(LNNS.k_near(tp, confs.k), GNNS.k_near(tp, confs.k))).toEqual(true);
});









