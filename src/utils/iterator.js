/**
 * @module
 * @desc     迭代器: 实现迭代器对象
 * @project  Vision
 * @author   Ais
 * @date     2022-07-26
 * @version  0.1.0
*/


/** 迭代器(基类) */
class Iterator {

    /**
     * @classdesc 迭代器(基类): 通过val接口实现值的迭代
     * 
     * @param { any } val 
     */
    constructor(val) {
        //值
        this._val = val;
    }

    /**
     * 值迭代逻辑接口: 实现迭代逻辑,并返回迭代的值
     * 
     * @returns { Any } this._val
     */
    val() {
        return this._val;
    }

    /**
     * 停机状态: 判断迭代器是否停机(迭代结束)
     * 
     * @returns { boolean } 停机状态 
     */
    end() {
        return false;
    }

    /**
     * 数组转换器: 迭代并输出值的变化过程
     * 
     * @param { number } n - 迭代次数 
     * @returns { Array } [val(0), val(1), val(2) ... val(n)]
     */
    tolist(n=500) {
        let vals = [];
        for(let i=0; i<n; i++) { 
            vals.push(this.val());
            if(this.end()) { break; }
        }
        return vals
    }
}


/** 范围迭代器 */
class Range extends Iterator {

    /**
     * @classdesc 范围迭代器: 一种值线性变化的迭代器
     * 
     * @param { number } start - 起始值 
     * @param { number } end   - 终止值
     * @param { number } step  - 步长(速率)
     * 
     * @example
     * new Range(1, 3);   //-> [1, 2, 3]
     * Range.S(0, 4, 2);  //-> [0, 2, 4]
     * Range.N(0, 5, 4);  //-> [0, 1.25, 2.5, 3.75, 5]
     */
    constructor(start, end, step=1) {
        super(start);
        //起始值
        this._start = start;
        //终止值
        this._end = end;
        //步长
        this._step = start<end ? Math.abs(step) : -Math.abs(step);
    }

    /**
     * 根据"步长"构建范围迭代器
     * 
     * @param { number } start    - 起始值 
     * @param { number } end      - 终止值
     * @param { number } [step=1] - 步长(速率)
     * @returns { Range } 范围迭代器
     */
    static S(start, end, step=1) {
        return new Range(start, end, step);
    }

    /**
     * 根据"迭代次数"构建范围迭代器
     * 
     * @param { number } start - 起始值 
     * @param { number } end   - 终止值
     * @param { number } n     - 迭代次数
     * @returns { Range } 范围迭代器
     */
    static N(start, end, n) {
        return new Range(start, end, (end-start)/n);
    }

    /** @override */
    val() {
        let val = this._val;
        if(!this.end()) {
            this._val += this._step;
        } else {
            this._val = this._end;
        }
        return val;
    }

    /** @override */
    end() {
        return (this._step>0) ? (this._val>this._end) : (this._val<this._end);
    }

    /** 复制迭代器 */
    clone() {
        return new Range(this._start, this._end, this._step);
    }

}


//函数迭代器
class FuncIterator extends Iterator {

    /**
     * @classdesc 函数迭代器: 指定定义域范围(dod)和函数(fx)迭代生成对应的值域
     * 
     * @property { Function } fx - 目标函数
     * @property { Range } dod - 定义域
     * 
     * @param { Function } fx - 目标函数
     * @param { Range } dod - 定义域
     * 
     * @example 
     * new FuncIterator((x)=>{return x*x;}, Range.S(0, 3));  //-> [0, 1, 4, 9]
     * new FuncIterator((x)=>{return x*x;}, [0, 3]);         //-> [0, 1, 4, 9]
     */
    constructor(fx, dod) {
        super();
        this.fx = fx;
        this.dod = dod.val ? dod : Range.S(...dod);
    }
    
    /** @override */
    val(toPoint=false) {
        let x = this.dod.val();
        return toPoint ? [x, this.fx(x)] : this.fx(x);
    }

    /** @override */
    end() {
        return this.dod.end();
    }
}


export { Iterator, Range, FuncIterator };