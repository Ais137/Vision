/**
 * @module
 * @desc     L-System(L系统): 一种并行重写系统和一种形式语法
 * @project  Vision
 * @author   Ais
 * @date     2022-09-11
 * @version  0.1.0
*/


/** L系统 */
class LSystem {

    /**
     * @classdesc L系统: 一种并行重写系统和一种形式语法
     * 
     * @property { string } S - 系统起始状态(公理)
     * @property { string } V - 符号表(终结符号&非终结符)
     * @property { object } P - 生成式
     * @property { object } ops - 符号->行为映射表
     * 
     * @param { string } S - 系统起始状态(公理)
     * @param { string } V - 符号表(终结符号&非终结符)
     * @param { object } P - 生成式
     * @param { object } ops - 符号->行为映射表
     * 
     * @example
     * ls = new LSystem({
     *      "S": "A",
     *      "V": ["A", "B", "[", "]"],
     *      "P": {
     *          "A": "B[A]A",
     *          "B": "BB"
     *      },
     *      "ops": {
     *          "A": (st) => {
     *              canvas.line(st.p.clone(), st.p.add(st.v));
     *          },
     *          "B": (st) => {
     *              canvas.line(st.p.clone(), st.p.add(st.v));
     *          },
     *          "[": (st) => {
     *              st.stack.unshift([st.p.clone(), st.v.clone()]);
     *              st.v.rotate(st.rad);
     *          },
     *          "]": (st) => {
     *              let status = st.stack.shift();
     *              st.p = status[0], st.v = status[1];
     *              st.v.rotate(-st.rad);
     *          }
     *      }
     *  });
     * 
     */
    constructor({S="", V=[], P={}, ops={}} = {}) {
        this.S = S;
        this.V = V;
        this.P = P;
        this.ops = ops;
    }

    /**
     * 迭代: 根据生成式生成下一代语句
     * @param { string } s - 语句 
     * @returns { string } 下一代语句
     */
    next(s=this.S) {
        let _s = "";
        for(let i=0, n=s.length; i<n; i++) {
            _s += (s[i] in this.P ? this.P[s[i]] : s[i]);
        }
        return _s;
    } 

    /**
     * 推导(重复迭代): 根据生成式从公理出发推导到第n代语句
     * @param { number } n - 迭代代数(int & n>=0)
     * @returns { string } 推导出的语句
     */
    gen(n=0) {
        let s = this.S;
        for(let i=0; i<n; i++) {
            s = this.next(s);
        }
        return s;
    }

    /**
     * 推导(迭代器): 以迭代器的形式进行推导，用于输出中间代语句
     * @param { number } n - 迭代代数(int & n>=0)
     * @returns { Iterator } 迭代器
     * @example
     * it = ls.iter(5);
     * it.next().value;
     */
    *iter(n=0) {
        let s = this.S;
        for(let i=0; i<n; i++) {
            s = this.next(s);
            yield s;
        }
    }

    /**
     * 绘制/行动: 根据语句和ops进行绘制
     * @param { string } s - 语句 
     * @param { Object } status - 状态表
     * @returns { Object } 状态表
     * @example
     * ls.act(ls.gen(5), {
     *     "p": new Vector(canvas.cx, canvas.height),
     *     "v": new Vector(0, -10),
     *     "rad": Tools.ATR(45),
     *     "stack": []
     *  })
     */
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

    /**
     * 绘制/行动(迭代器模式)
     * @param { string } s - 语句 
     * @param { Object } status - 状态表
     * @returns { Iterator } 迭代器
     * @example
     * act_it = ls.act(ls.gen(3), {
     *     "p": new Vector(canvas.cx, canvas.height),
     *     "v": new Vector(0, -1),
     *     "rad": Tools.ATR(25),
     *     "stack": []
     * });
     * act_it.next();
     */
    *actIter(s, status) {
        for(let i=0, n=s.length; i<n; i++) {
            yield (s[i] in this.ops) && this.ops[s[i]](status);
        }
    }

}


export { LSystem };