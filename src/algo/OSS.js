/****************************************
 * Name: optimum solution solver | 最优解通用求解器
 * Date: 2022-07-11
 * Author: Ais
 * Project: Vision
 * Desc: 给定一个目标函数，计算该函数的数值最优解
 * Version: 0.1
****************************************/

const Vector = require("../vector/vector").Vector;
const Particle = require("../vector/particle").Particle;

/***************************************  
算法思路:
给定一个目标函数f(x), 其中x是定义域为R*n的向量。现在构造一个求解器s(solver), solver有一个临近坐标集，
这个集合是其每次迭代后的可能位置。solver在每次迭代时从中选取f(x)的最优解进行移动，直到停机(当临近集中
的所有值都不是最优时停机)。
通过上述算法构建的solver求解的可能是局部最优解。为了应对这种情况，可能通过构建一个求解器集群来避免。
通过随机生成solver的初始位置，让N个solver均匀分布在定义域上。但这N个solver停机时，从中选择一个
最优解作为全局最优解。
****************************************/

//局部最优解求解器
class Solver extends Particle {

    /*----------------------------------------
    @func: 局部最优值求解器
    @desc: 通过迭代来求解指定域下目标函数的局部最优解
    @params: 
        * tfunc(function): 目标函数
        * ps(Vector): 起始位置
        * val_type(str): 最优解类型(min || max)
    ----------------------------------------*/
    constructor(tfunc, ps, val_type="min") {
        super();
        //目标函数
        this.tfunc = tfunc;
        //求解域(定义域的子域)
        this.dod = [];
        //最优值类型
        this.val_type = val_type;
        //局部最优解坐标
        this.p = ps;
        //最优值
        this.val = (this.val_type == "min" ? Infinity : -Infinity);
        //速度集(临近坐标集)
        this.vs = [];
        //停机状态
        this._END = false;
    }

    action() {
        if(!this._END) {
            let _END = true;
            for(let i=0, end=this.vs.length; i<end; i++) {
                //计算目标函数值
                let _pv = Vector.add(this.p, this.vs[i]);
                let _val = this.tfunc(_pv);
                //移动到最优解坐标
                if((this.val_type=="min" && _val <= this.val) || (this.val_type=="max" && val >= this.val)) {
                    this.val = _val; this.p = _pv;
                    _END = false;
                }
                //停机(超过求解域)
                if(!_pv.in(this.dod)) { _END = true; }
            }
            this._END = _END;
        }
        return this.p;
    }

    end() { return this._END; }
}


//求解器集群
class OptimumSolutionSolvers {

    /*----------------------------------------
    @func: 求解器集群
    @desc: 通过在求解域上均匀分布的求解器来求解全局最优值
    @property: 
        * n(number): 求解器数量
        * count(number): 迭代计数器, 用于控制迭代次数
        * tfunc(function): 目标函数
        * dod(list:number): 求解域 -> [[0, width], [0, height]]
        * vs(list:Vector): 求解器速度集, 默认采用8个临近点
        * vsd(number): 默认速度集的步长
        * val_type(str): 最优解类型(min || max)
        * os_val(number): 最优解值
        * os_p(Vector): 最优解坐标
    @return(type): 
    @exp: 
    ----------------------------------------*/
    constructor() {
        //求解器数量
        this.n = 30;
        //求解器集群
        this.solvers = [];
        //迭代次数
        this.count = Infinity;
        //目标函数
        this.tfunc = null;
        //求解域
        this.dod = [];
        //求解器速度集
        this.vs = null;
        //求解器速度集步长
        this.vsd = 1;
        //最优值类型
        this.val_type = "min";
        //最优值
        this.os_val = null;
        //最优值坐标
        this.os_p = null;
        //停机状态
        this._END = false;
    }

    //初始化求解器
    init() {
        //最优解初始值
        this.os_val = (this.val_type == "min" ? Infinity : -Infinity);
        //构建速度集
        if(this.vs == null) {
            this.vs = [
                new Vector(-1, -1).norm(this.vsd), new Vector(0, -1).norm(this.vsd), new Vector(1, -1).norm(this.vsd),
                new Vector(-1, 0).norm(this.vsd),                                    new Vector(1, 0).norm(this.vsd),
                new Vector(-1, 1).norm(this.vsd),  new Vector(0, 1).norm(this.vsd),  new Vector(1, 1).norm(this.vsd),
            ]
        }
        //构建求解器
        for(let i=0; i<this.n; i++) {
            let _solver = new Solver(this.tfunc, Vector.random(this.dod), this.val_type);
            _solver.dod = this.dod; _solver.vs = this.vs;
            this.solvers.push(_solver);
        }
    }
    
    //迭代
    next() {
        if(this._END || this.count<0) {
            this._END = true;
            return this.os_p;
        }
        let _END = true;
        for(let i=0, end=this.solvers.length; i<end; i++) {
            this.solvers[i].action();
            _END = _END & this.solvers[i].end();
            if((this.val_type=="min" && this.solvers[i].val <= this.os_val) || (this.val_type=="max" && this.solvers[i].val >= this.os_val)) {
                this.os_val = this.solvers[i].val; this.os_p = this.solvers[i].p;
            }
        }
        this._END = _END;
        this.count--;
        return this.os_p;
    }

    //停机状态
    end() { return this._END; }
}


module.exports.OptimumSolutionSolvers = OptimumSolutionSolvers;