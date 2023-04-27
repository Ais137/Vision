/**
 * @module
 * @desc     随机选择器
 * @project  Vision
 * @author   Ais
 * @date     2022-08-01
 * @version  0.1.0
*/


//随机选择器
class RandomSelector {

    /**
     * @classdesc 随机选择器: 给定选项集，根据权重生成概率，随机选择一个选项。
     * 
     * @property { Object[] } _ops - 选项集
     * @property { Object } _ops.op - 选项对象
     * @property { number } _ops.p - 选中概率
     * @property { number } _ops.ps - 起始概率值
     * @property { number } _ops.pe - 终止概率值
     * 
     * @param { Array[] } options - 选项集: [[op(选项, any), wt(权重, number:>0)]...]
     * 
     * @example
     * let rs = new RandomSelector([["a", 1], ["b", 1], ["c", 3], ["d", 1]])
     */
    constructor(options) {
        //选项集
        this._ops = this._probability(options);
    }

    /**
     * 计算概率: 基于选项的权重计算概率 -> p[i] = wt[i] / sum(wt)
     *  
     * @param { Array[] } options - 选项集: [[op(选项, any), wt(权重, number:>0)], ...]
     * @returns { Object[] } 选项集: [{"op": "选项", "p": "概率", "ps/pe": "概率范围"}, ...]
     */
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

    /**
     * 从选项集中随机选择一个选项
     * 
     * @returns { any } 选中的选项集中的对象 this._ops[i].op
     * @example rs.select();
     */
    select() {
        let r = Math.random();
        for(let i=0, n=this._ops.length; i<n; i++) {
            if(r > this._ops[i].ps && r <= this._ops[i].pe) {
                return this._ops[i].op;
            }
        }
    }

}


export { RandomSelector };