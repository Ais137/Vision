/****************************************
 * Name: L-System | L系统
 * Date: 2022-09-11
 * Author: Ais
 * Project: 
 * Desc: 一种并行重写系统和一种形式语法
 * Version: 0.1
****************************************/

//L系统
class LSystem {

    /*----------------------------------------
    @class: L系统
    @desc: 
        G = (S, V, P)
    @property: 
        * S(str): 系统起始状态(公理)
        * V(list:str): 符号表(终结符号&非终结符)
        * P(obj|map): 生成式
        * ops(obj|map): 符号->行为映射表
    @method: 
        * method: func
    @exp: 
        ls = new LSystem({
            "S": "A",
            "V": ["A", "B", "[", "]"],
            "P": {
                "A": "B[A]A",
                "B": "BB"
            },
            "ops": {
                "A": (st) => {
                    canvas.line(st.p.clone(), st.p.add(st.v));
                },
                "B": (st) => {
                    canvas.line(st.p.clone(), st.p.add(st.v));
                },
                "[": (st) => {
                    st.stack.unshift([st.p.clone(), st.v.clone()]);
                    st.v.rotate(st.rad);
                },
                "]": (st) => {
                    let status = st.stack.shift();
                    st.p = status[0], st.v = status[1];
                    st.v.rotate(-st.rad);
                }
            }
        });
    ----------------------------------------*/
    constructor({S="", V=[], P={}, ops={}} = {}) {
        //系统起始状态(公理)
        this.S = S;
        //符号表(终结符号&非终结符)
        this.V = V;
        //生成式
        this.P = P;
        //符号->行为映射表
        this.ops = ops;
    }

    /*----------------------------------------
    @func: 迭代
    @desc: 根据生成式生成下一代语句
    @params: 
        * s(str): 语句
    @return(str) 
    ----------------------------------------*/
    next(s=this.S) {
        let _s = "";
        for(let i=0, n=s.length; i<n; i++) {
            _s += (s[i] in this.P ? this.P[s[i]] : s[i]);
        }
        return _s;
    } 

    /*----------------------------------------
    @func: 推导(重复迭代)
    @desc: 根据生成式从公理出发推导到第n代语句
    @params: 
        * n(int:>=0): 迭代代数
    @return(str): 语句
    ----------------------------------------*/
    gen(n=0) {
        let s = this.S;
        for(let i=0; i<n; i++) {
            s = this.next(s);
        }
        return s;
    }

    /*----------------------------------------
    @func: 推导(迭代器)
    @desc: 以迭代器的形式进行推导，用于输出中间代语句
    @params: 
        * n(int:>=0): 迭代代数
    @return(iterator): 迭代器
    @exp: 
        it = ls.iter(5);
        it.next().value;
    ----------------------------------------*/
    *iter(n=0) {
        let s = this.S;
        for(let i=0; i<n; i++) {
            s = this.next(s);
            yield s;
        }
    }

    /*----------------------------------------
    @func: 绘制/行动
    @desc: 根据语句和ops进行绘制
    @params: 
        * s(str): 语句
        * status(obj): 状态表
    @return(status): 状态表
    @exp: 
        ls.act(ls.gen(5), {
            "p": new Vector(canvas.cx, canvas.height),
            "v": new Vector(0, -10),
            "rad": Tools.ATR(45),
            "stack": []
        })
    ----------------------------------------*/
    act(s, status) {
        for(let i=0, n=s.length; i<n; i++) {
            (s[i] in this.ops) && this.ops[s[i]](status);
        }
        return status;
    }

    /*----------------------------------------
    @func: 绘制/行动(迭代器模式)
    @exp: 
        act_it = ls.act(ls.gen(3), {
            "p": new Vector(canvas.cx, canvas.height),
            "v": new Vector(0, -1),
            "rad": Tools.ATR(25),
            "stack": []
        });
        act_it.next();
    ----------------------------------------*/
    *actIter(s, status) {
        for(let i=0, n=s.length; i<n; i++) {
            yield (s[i] in this.ops) && this.ops[s[i]](status);
        }
    }

}


module.exports.LSystem = LSystem;