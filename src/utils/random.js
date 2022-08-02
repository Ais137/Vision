/****************************************
 * Name: random
 * Date: 2022-08-01
 * Author: Ais
 * Project: Vision
 * Desc: 
 * Version: 0.1
****************************************/


//随机选择器
class RandomSelector {

    /*----------------------------------------
    @class: RandomSelector(随机选择器)
    @desc: 给定选项集，根据权重生成概率，随机选择一个选项。
    @property: 
        * _ops(list:obj): 选项集
    @method: 
        * _probability: 根据选项集中选项的权重计算概率
        * select: 随机从选项集中选择一个选项
    @exp:
        * let rs = new RandomSelector([["a", 1], ["b", 1], ["c", 3], ["d", 1]])
    ----------------------------------------*/
    constructor(options) {
        //选项集
        this._ops = this._probability(options);
    }

    /*----------------------------------------
    @func: 计算概率
    @desc: 基于权重计算概率 -> p[i] = wt[i] / sum(wt)
    @params: 
        * options(list:list): [[op(选项, any), wt(权重, number:>0)]...]
    @return(opt(list:obj)): [{"op": 选项, "p": 概率, "ps/pe": 概率范围}] 
    ----------------------------------------*/
    _probability(options) {
        //计算总权重
        let swt = 0;
        for(let i=0, n=options.length; i<n; i++) {
            swt += options[i][1] || 0;
        }
        //计算每个选项的概率
        let _ops = [], _ps = 0;
        for(let i=0, n=options.length; i<n; i++) {
            let p = (options[i][1] || 0) / swt;
            _ops.push({
                //选项
                "op": options[i][0],
                //概率
                "p": p,
                //概率范围
                "ps": _ps, "pe": _ps + p
            });
            _ps += p;
        }
        return _ops;
    }

    /*----------------------------------------
    @func: 随机选择
    @desc: 从选项集中随机选择一个选项
    @return(any) 
    ----------------------------------------*/
    select() {
        let r = Math.random();
        for(let i=0, n=this._ops.length; i<n; i++) {
            if(r > this._ops[i].ps && r <= this._ops[i].pe) {
                return this._ops[i].op;
            }
        }
    }

}



module.exports.RandomSelector = RandomSelector;
