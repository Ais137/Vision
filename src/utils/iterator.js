/****************************************
 * Name: 迭代器
 * Date: 2022-07-26
 * Author: Ais
 * Project: Vision
 * Desc: 实现迭代器对象
 * Version: 0.1
****************************************/

//迭代器(基类)
class Iterator {

    /*----------------------------------------
    @class: 迭代器(基类)
    @desc: 通过val接口实现值的迭代
    @property: 
        * _val(any): 迭代器的值
    @method: 
        * val(): 迭代逻辑实现, 每次调用返回迭代后的值 -> _val
        * end(): 停机状态, 判断迭代器是否停机(迭代结束)
        * tolist(): 迭代并输出值的变化过程 -> [_val(0), _val(1), _val(2) ... _val(n)]
    @exp:
    ----------------------------------------*/
    constructor(val) {
        //值
        this._val = val;
    }

    /*----------------------------------------
    @func: 值迭代逻辑接口
    @desc: 实现迭代逻辑,并返回迭代的值
    @return(any): this._val
    ----------------------------------------*/
    val() {
        return this._val;
    }

    /*----------------------------------------
    @func: 停机状态
    @desc: 判断迭代器是否迭代结束
    @return(bool) 
    ----------------------------------------*/
    end() {
        return false;
    }

    /*----------------------------------------
    @func: 数组转换器
    @desc: 进行迭代，并输出值的变换过程
    @params:
        * n(number): 迭代次数，用于处理不会停机的迭代器
    @return(list:any): [_val(0), _val(1), _val(2) ... _val(n)]
    ----------------------------------------*/
    tolist(n=500) {
        let vals = [];
        for(let i=0; i<n; i++) { 
            vals.push(this.val());
            if(this.end()) { break; }
        }
        return vals
    }
}


//范围迭代器
class Range extends Iterator {

    /*----------------------------------------
    @class: 范围迭代器
    @desc: 一种值线性变化的迭代器
    @property: 
        * _start(number): 起始值
        * _end(number): 终止值
        * _step(number): 步长(速率)
    @exp: 
        * new Range(1, 3) -> [1, 2, 3]
        * Range.S(0, 4, 2) -> [0, 2, 4]
        * Range.N(0, 5, 4) -> [0, 1.25, 2.5, 3.75, 5]
    ----------------------------------------*/
    constructor(start, end, step=1) {
        super(start);
        //起始值
        this._start = start;
        //终止值
        this._end = end;
        //步长
        this._step = start<end ? Math.abs(step) : -Math.abs(step);
    }

    /*----------------------------------------
    @func: 构建器
    @desc: 根据"步长"构建迭代器
    @params: 
        * step(number): 步长大小(速率)
    @return(Range) 
    ----------------------------------------*/
    static S(start, end, step=1) {
        return new Range(start, end, step);
    }

    /*----------------------------------------
    @func: 构建器
    @desc: 根据"迭代次数"构建迭代器
    @params: 
        * n(number): 迭代次数
    @return(Range) 
    ----------------------------------------*/
    static N(start, end, n) {
        return new Range(start, end, (end-start)/n);
    }

    //值迭代逻辑
    val() {
        let val = this._val;
        if(!this.end()) {
            this._val += this._step;
        } else {
            this._val = this._end;
        }
        return val;
    }

    //停机状态
    end() {
        return (this._step>0) ? (this._val>this._end) : (this._val<this._end);
    }

    //复制
    clone() {
        return new Range(this._start, this._end, this._step);
    }

}


//函数迭代器
class FuncIterator extends Iterator {

    /*----------------------------------------
    @class: 函数迭代器
    @desc: 指定定义域范围(dod)和函数(fx)迭代生成对应的值域
    @property: 
        * fx(function): 目标函数
        * dod(Range|list): 定义域
    @exp: 
        * new FuncIterator((x)=>{return x*x;}, Range.S(0, 3)) -> [0, 1, 4, 9]
        * new FuncIterator((x)=>{return x*x;}, [0, 3])
    ----------------------------------------*/
    constructor(fx, dod) {
        super();
        //函数表达式
        this.fx = fx;
        //定义域(Range)
        this.dod = dod.val ? dod : Range.S(...dod);
    }
    
    val(toPoint=false) {
        let x = this.dod.val();
        return toPoint ? [x, this.fx(x)] : this.fx(x);
    }

    end() {
        return this.dod.end();
    }
}


module.exports.Iterator = Iterator;
module.exports.Range = Range;
module.exports.FuncIterator = FuncIterator;