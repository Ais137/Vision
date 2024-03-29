/**
 * @module
 * @desc     邻近搜索算法: 在向量集中搜索给定目标向量的邻近集 
 * @project  Vision
 * @author   Ais
 * @date     2023-01-30
 * @version  0.1.0
*/


import { Vector } from "../vector/vector.js";


/** 邻近搜索算法(基类) */
class NearestNeighborSearch {

    /**
     * @classdesc 邻近搜索算法模块，用于在向量集中搜索给定目标向量的邻近元素集
     * 
     * @property { Object[] } ps - 对象集，算法基于该属性进行数据结构的构建与邻近集的计算
     * @property { callable } vect - 向量提取器(可调用对象), 用于从对象中提取向量作为算法处理单元
     * @property { bool } IS_LOOP_BORDER - 循环边界标记, 用于标记算法是否在循环边界下进行计算
     * 
     * @param { Object[] } ps - 对象集 
     * @param { callable } vect - 向量提取器
     * 
     * @example
     * let NNS = new NearestNeighborSearch(ps, function(particle){return particle.p;});
     * 
     * @question 怎样让算法模块支持其他距离计算方式
     * NNS(NearestNeighborSearch)算法模块通过 "vect" 属性从对象中提取出一个向量对象(Vector)
     * 作为算法的计算处理单元，默认情况下通过 "Vector.dist" 计算的是欧式距离，为了使算法模块支持
     * 其他的距离计算类型(比如曼哈顿距离)，可以从 "Vector" 类派生一个子类，并重写 "dist" 方法来实现。
     */
    constructor(ps, vect) {
        /**
         * 向量提取器
         * 给定一个对象，从中提取出向量对象(Vector)作为算法的处理单元
         * 设计该属性的目的是为了提高模块可处理对象的适应性，并让算法的处理单元统一成向量对象。
         * @param { Object } obj - 处理对象
         * @returns { Vector } 对象的某个向量属性
         * @example this.vect = function(particle_obj) { return particle_obj.p }
         */
        this.vect = vect || function(obj) { return obj; };
        this.ps = ps;
        this.IS_LOOP_BORDER = false;
    }

    /**
     * 构建算法的数据结构  
     * 更新 this.ps 属性并基于对象集(ps)构建算法数据结构，主要用于使用数据结构(状态)进行邻近集计算的算法实现，当ps的状态发生变化时，通过该方法重新构建内部数据结构。
     * 
     * @param { Object[] } [ps=null] ps -  对象集
     * @returns { NearestNeighborSearch } this
     * @example 
     * let NNS = new NearestNeighborSearch(ps).build();
     * let NNS = new NearestNeighborSearch().build(ps);
     */
    build(ps=null) {
        this.ps = ps || this.ps;
        return this;
    }

    /**
     * 生成距离(dist)邻近集: 根据距离(dist)计算目标对象(tp)在对象集(ps)中的邻近集
     * 
     * @param { Object } tp - 目标对象(与对象集(ps)中的元素类型一致，或者具有必要属性(从鸭子类型的观点来看))
     * @param { number } dist - 算法的判定距离(dist>=0)
     * @returns { Object[] } 邻近集([ps[i], ps[k], ps[j], ...])
     * @example let ns = new NearestNeighborSearch(ps).near(tp, 100);
     */
    near(tp, dist) {
        return [];
    }

    /**
     * 生成"k"邻近集: 给定目标对象(tp), 计算在对象集(ps)中, 离"tp"最近的"k"个元素
     * 
     * @param { Object } tp - 目标对象
     * @param { number } k - k个最近的元素(k >= nps.length)
     * @returns { Object[] } 邻近集([ps[i], ps[k], ps[j], ...])
     * @example let ns = new NearestNeighborSearch(ps).k_near(tp, 5);
     */
    k_near(tp, k) {
        return [];
    }

    /**
     * 计算对象集的邻近集: 计算给定对象集中每个元素的邻近集
     * 
     * @param { number } d - dist or k, 根据模式确定
     * @param { enum } mode - "dist" || "k" 
     * @returns { Object[] } 邻近集([{"tp": ps[i], "nps": [...]}, ...])
     * @example
     * let ns = new NearestNeighborSearch(ps).nps(100);
     * let ns = new NearestNeighborSearch(ps).nps(5, "k");
     * 
     * @todo 计算结构优化
     */
    nps(d, mode="dist") {
        //@ERR: 该方式将导致"this"的隐式绑定丢失, 从而导致目标方法(near || k_near)被调用时，无法引用 this.vect 属性。
        // let _near = (mode=="dist" ? this.near : this.k_near);
        let _near = (mode=="dist" ? this.near : this.k_near).bind(this);
        let np_set = [];
        for(let i=0, n=this.ps.length; i<n; i++) {
            let _nps = _near(this.ps[i], d);
            (_nps.length > 0) && np_set.push({"tp": this.ps[i], "nps": _nps});
        }
        return np_set;
    }

    /**
     * 将邻近集转换成图结构
     * 
     * @param { Object[] } nps - 邻近集 
     */
    static toGraph(nps) {
        return ;
    }
}


//线性邻近搜索
class LinearNNS extends NearestNeighborSearch {

    /**
     * @classdesc 线性邻近搜索，通过遍历对象集(ps)来计算目标对象(tp)的邻近集
     * 
     * @description 
     * 由于该算法结构简单，并且不要维护内部数据结构支撑算法计算(无状态)，因此适用于 ps 对象动态变化的场景，
     * 比如可以在 boids 算法中用来计算邻近视野中的对象。但是缺点也很明显，算法的计算量依赖于 ps 的规模，
     * 当 ps 规模过大时，算法效率会很低。
     * 
     * @param { Object[] } ps - 对象集 
     * @param { callable } vect - 向量提取器
     * @example let LNNS = new LinearNNS(ps, function(particle){return particle.p;});
     */
    constructor(ps, vect) {
        super(ps, vect);
    }

    /**
     * dist邻近集
     * 
     * @override
     * @param { Object } tp - 目标对象 
     * @param { number } dist - 判定距离(dist>=0)
     * @param { Object[] } [ps=null] ps - 对象集，该参数将覆盖 this.ps 进行计算 
     * @returns { Object[] } 邻近集([ps[i], ps[k], ps[j], ...])
     */
    near(tp, dist, ps=null) {
        ps = ps || this.ps;
        let tp_v = this.vect(tp), nps = [];
        for(let i=0, n=ps.length; i<n; i++) {
            (!(tp === ps[i]) && tp_v.dist(this.vect(ps[i])) <= dist) && nps.push(ps[i]);
        }
        return nps;
    }

    /**
     * k邻近集
     * 
     * @override
     * @param { Object } tp - 目标对象 
     * @param { number } k - k个最近的元素(k >= nps.length)
     * @param { Object[] } [ps=null] ps - 对象集，该参数将覆盖 this.ps 进行计算 
     * @returns { Object[] } 邻近集([ps[i], ps[k], ps[j], ...])
     */
    k_near(tp, k, ps=null) {
        ps = ps || this.ps;
        let tp_v = this.vect(tp), dist_ps = [];
        for(let i=0, n=ps.length; i<n; i++) { 
            if(tp === ps[i]) { continue; }
            //计算当前元素与目标元素的距离
            let dist = tp_v.dist(this.vect(ps[i]));
            if(dist_ps.length == 0) {
                dist_ps.push({"dist": dist, "p": ps[i]})
                continue;
            }
            //当前元素距离小于邻近集中的最大距离(插入排序)
            if(dist < dist_ps[dist_ps.length-1].dist || dist_ps.length < k) {
                for(let j=dist_ps.length-1; j>=0; j--) {
                    if(dist>=dist_ps[j].dist) {
                        dist_ps.splice(j+1, 0, {"dist": dist, "p": ps[i]});
                        break;
                    }
                    //邻近集中的最小距离
                    if(j==0) {
                        dist_ps.splice(0, 0, {"dist": dist, "p": ps[i]})
                    }
                }
                (dist_ps.length > k) && dist_ps.pop(); 
            }
        }
        //格式化
        let nps = []
        for(let i=0; i<dist_ps.length; i++) {
            nps.push(dist_ps[i].p);
        }
        return nps;
    }

}


//网格邻近搜索
class GridNNS extends LinearNNS {

    /**
     * @classdesc 网格邻近搜索，基于 LinearNNS 算法进行优化
     * 
     * @description
     * 算法的基本思路是将目标数据(ps)的向量空间划分成网格，网格中的单元格尺寸为 *dn*, 单元格维度取决于
     * 目标数据维度。通过将目标数据(ps)映射到网格空间中的位置矢量，来存储目标数据对象。在这种映射下，
     * 位置间距小于单元格对角线长度(最大距离)的对象会存储在相同的单元格(或邻近的单元格)，在进行邻近搜索时，
     * 将目标对象(tp)映射到网格空间坐标，并直接读取该单元格(或半径R内邻近单元格)中存储的对象。得到一个近似邻近集，
     * 再对这个近似解进行精确搜索。以减少 LinearNNS 算法中的无效计算。
     * GridNNS 算法有以下特征:
     * 1. "dn" 参数对算法的影响:  
     *     "dn"参数越小，算法所需的存储空间越大，"dn"参数越大，算法的计算量越接近 LinearNNS 算法。
     *     当 dn 大于等于目标数据边界大小的情况下，退化成 LinearNNS 算法。
     * 2. 动态数据:   
     *     相对于 LinearNNS 算法，该算法是一个具有内部状态的算法，因此在 "ps" 变动的场景下，需要通过 "build" 方法更新内部状态。
     * 3. 有限空间:   
     *     该算法适用于数据集聚集在一个有限空间下，当数据集中离散点过多，会导致更多的存储空间开销。
     * 4. 数据集分量范围限制:  
     *     对于数据集的 dsr(数据集分量范围) 不能为负数，因为在将数据的向量坐标映射到存储容器索引时，存储容器的索引范围是 [0, N+)，因此数据集中的
     *     向量分量不能为负数。但是可以通过对数据集进行整体平移来解决该限制。这是由于在采用欧式距离计算的情况下，该邻近搜索算法具有"平移不变性"，
     *     即对数据集整体平移一个向量(v)，给定目标向量(同时进行平移操作)的邻近集不变。
     * 5. 边界条件:   
     *     当目标数据在 dsr(数据集分量范围) 外时，算法需要对该情况进行特殊处理。
     * 
     * 
     * @property { number } dn - 网格单元大小(int & dn>0)
     * @property { number[] } dsr - 数据集分量范围([min, max])，其长度等于数据集向量维度。每个单元代表数据集对应的分量范围
     * @property { Vector } dst - 数据集非负平移量，用于解决"数据集分量范围限制"，基于 dsr 构建。在存储数据到 grid 容器时，需要对目标数据进行平移操作
     * @property { number[] } size - 网格容器尺寸(像素坐标)，要划分成网格的原始空间尺寸
     * @property { GridNNS.GridContainer } grid - 网格数据存储容器，为算法提供数据结构支撑
     * 
     * @param { Object[] } ps - 对象集 
     * @param { callable } vect - 向量提取器
     * @param { number } [dn=100] - 网格单元大小
     * @param { number[] } [dsr=null] - 数据集分量范围
     * 
     * @example
     * let GNNS = new GridNNS(ps, function(particle){return particle.p;}, 150).build();
     * let GNNS = new GridNNS(ps, function(particle){return particle.p;}, 150, [0, canvas.width, 0, canvas.height]).build();
     */
    constructor(ps, vect, dn=100, dsr=null) {
        super(ps, vect);
        this.dn = dn;
        this.dsr = dsr;
        this.dst = null;
        this.size = null;
        this.grid = null;
    }

    /**
     * 网格数据存储容器构造器
     * @param { number } dn - 网格单元大小(int & dn>0) 
     * @param { number[] } size - 网格容器尺寸
     * @returns { GridNNS.GridContainer } 网格数据存储容器
     */
    static GridContainer(dn, size) {

        /** 网格数据存储容器构造器 */
        class GridContainer {

            /**
             * @classdesc 网格数据存储容器，为 "GridNNS" 算法提供数据结构支撑
             * 
             * @description
             * * 数据结构设计:  
             * 该数据容器通过一维数组(实际存储结构)来模拟高维数组(逻辑存储结构)。
             * 内部采用一个映射算法(index), 将高维数组坐标映射到实际存储结构的一维数组索引。
             * 之所以采用"坐标映射索引"而不是"数组下标索引"的原因在于，"数组下标索引"无法适配
             * 高维数据的场景，对于二维数组来说，需要通过 "arr[y][x]" 这种硬编码的方式进行数据
             * 的访问，但是当维数变化时，该方式就不适用了，比如三维数组(arr[z][y][x])。
             * * 坐标映射算法设计:  
             * 设   
             *     ds = [x, y, z, ...] 为高维数组(逻辑存储结构)的尺寸，  
             *     p  = [x, y, z, ...] 为高维数组上数据的坐标向量    
             * 则 index(dim) 坐标映射索引函数的递归结构如下:  
             *     index(1) -> p[x]  
             *     index(2) -> (ds[x] * p[y]) + index(1)   
             *              -> (ds[x] * p[y]) + p[x]  
             *     index(3) -> (ds[x] * ds[y] * p[z]) + index(2)   
             *              -> (ds[x] * ds[y] * p[z]) + (ds[x] * p[y]) + p[x]  
             *     ...  
             * 由上述归纳可得:  
             *     index(n) -> (1 * ds[x] * ... * ds[n-1]) * p[n-1] + index(n-1)  
             * FIN  
             * 
             * @property { number } dn - 网格单元大小(int & dn>0) 
             * @property { number[] } size - 原始空间尺寸(像素坐标)，要划分成网格的原始空间尺寸。
             * @property { number[] } dsize - 网格空间尺寸(网格坐标)
             * @property { number } length - 存储容器长度(int & length>0)
             * @property { Array } _data - 存储容器(一维数组)
             * @property { Array } _cache_ds - 计算缓存: 维度-尺寸系数，用于根据向量位置坐标计算存储容器索引的计算缓存
             * @property { Array } _cache_gns - 计算缓存: 网格邻域坐标集(r=1)，用于缓存网格邻域坐标集
             * 
             * @param { number } dn - 网格单元大小(int & dn>0) 
             * @param { number[] } size - 网格容器尺寸
             * 
             * @example let grid = GridNNS.GridContainer(10, [1920, 1080]);
             */
            constructor(dn, size) {
                this.dn = dn;
                this.size = size;
                this.dsize = [];
                //存储容器长度
                this.length = 1;
                //计算存储容器尺寸
                for(let i=this.size.length; i--; ) {
                    let di = Math.ceil(this.size[i]/this.dn) + 1;
                    this.length *= di; this.dsize[i] = di;
                }
                //构建存储容器(一维数组容器，映射到虚拟高维数组)
                this._data = new Array(this.length);
                /** @private */
                this._cache_ds = null;
                /** @private */
                this._cache_gns = this.gns(this.dsize.length, 1);
            }

            /**
             * 将数据集向量映射到网格空间坐标
             * 
             * @param { Vector } vector - 数据集向量
             * @returns { Vector } 对应的网格空间坐标
             */
            toGrid(vector) {
                let v = [];
                for(let i=0, n=vector.dim(); i<n; i++) {
                    v[i] = Math.ceil(vector.v[i]/this.dn);
                }
                return new Vector(...v);
            }

            /**
             * 坐标映射算法: 计算网格空间坐标(逻辑存储结构)对应存储容器的索引(实际存储结构)
             * 
             * @param { Vector } vector - 网格空间坐标向量
             * @returns { number } 存储容器索引(int & >=0)
             */
            index(vector) {
                /* 
                //递归实现 
                //n(维数) | ds(dsize) | p(坐标向量)
                let _index = function(n, ds, p) {
                    if(n==1) {
                        return p[0];
                    } else {
                        let k = 1;
                        for(let i=0; i<n-1; i++) { k*=ds[i]; }
                        return (k * p[n-1]) + _index(n-1, ds, p);
                    }
                } 
                */
                //计算缓存优化: 维度-尺寸系数
                if(!this._cache_ds) {
                    this._cache_ds = [1];
                    for(let i=0, n=this.dsize.length-1, k=1; i<n; i++) {
                        k *= this.dsize[i]
                        this._cache_ds.push(k);
                    }
                }
                //计算索引
                let i = 0;
                for(let k=vector.dim(); k--; ) {
                    i += (this._cache_ds[k] * vector.v[k])
                }
                return i;
            }

            /**
             * 计算网格邻域坐标集: 根据"维数"和"邻域半径"计算网格空间的邻域坐标集   
             * 网格邻域坐标集生成算法如下:  
             * * dim(1):   
             *     [  
             *         [-1], [0], [1]  
             *     ]  
             * * dim(2):  
             *     [  
             *         [-1, -1], [-1, 0], [-1, 1],  
             *         [ 0, -1], [ 0, 0], [ 0, 1],  
             *         [ 1, -1], [ 1, 0], [ 1, 1],   
             *     ]  
             * 由上述归纳可知:   
             *     dim(n) = (dim(1) x dim(1)) ^ (n-1)  
             * 其中 x 为笛卡尔积运算，  
             * 即  
             *     以 dim(1) 为基，与其自身进行 n 次笛卡尔积运算。  
             * 设 r 为邻域半径，则基的定义如下  
             *     base = [-r, -r+1, -r+2, ..., 0, 1, 2, r]  
             * 则有   
             *     dim(n) = (base x base) ^ (n-1)  
             * FIN  
             * 
             * @param { number } dim - 网格坐标维数(int & dim>0)
             * @param { number } r - 邻域半径(int & r>=1)
             * @returns { Vector[] } 网格邻域坐标集
             */
            gns(dim, r=1) {
                //笛卡尔积
                let cartesian_product = function(a, b) {
                    let ps = [];
                    for(let i=0, endi=a.length; i<endi; i++) {
                        for(let k=0, endk=b.length; k<endk; k++) {
                            ps.push([...a[i], ...b[k]]);
                        }
                    }
                    return ps;
                }
                //生成基坐标
                let base = [];
                for(let i=-r; i<=r; i++) { base.push([i]); }
                //生成网格邻域集
                let _gns = base;
                for(let i=0; i<dim-1; i++) { _gns = cartesian_product(_gns, base) }
                return _gns;
            }

            /**
             * 存储数据: 在原始坐标向量(p)映射的网格坐标位置存储值(val)
             * 
             * @param { Vector } p - 原始坐标向量
             * @param { Object } val - 数据值 
             * @returns { boolean } 操作状态
             */
            set(p, val) {
                let i = this.index(this.toGrid(p));
                if(i<0 || i>this.length) { return false; }
                if(this._data[i]) {
                    this._data[i].push(val);
                } else {
                    this._data[i] = [val];
                }
                return true;
            }

            /**
             * 获取数据: 获取原始坐标向量(p)映射的网格坐标位置的邻域半径(r)内的数据对象
             * 
             * @param { Vector } p - 原始坐标向量 
             * @param { number } [r=0] 邻域半径(int & r>=0)
             * @returns { Object[] } 数据对象列表
             */
            get(p, r=0) {
                //网格中心坐标
                let po = this.toGrid(p);
                //返回网格中心坐标位置的数据
                if(r <= 0) { 
                    return this._data[this.index(po)] || []; 
                }
                //生成网格邻域坐标集
                let _gns = r==1 ? this._cache_gns : this.gns(p.dim(), r);
                //遍历网格邻域坐标集获取数据对象
                let data = [];
                for(let k=0, n=_gns.length; k<n; k++) {
                    let i = this.index(new Vector(..._gns[k]).add(po));
                    data = [...data, ...(this._data[i] || [])]
                }
                return data;
            }
        }
        return new GridContainer(dn, size);
    }

    /**
     * 构建算法的数据结构: 将数据集存储到网格容器中
     * 
     * @override
     * 
     * @param { Object[] } [ps=null] ps -  对象集 
     * @returns { Object } this
     */
    build(ps=null) {
        //数据集
        this.ps = ps || this.ps;
        //计算数据集分量范围
        if(this.dsr==null) {
            //计算边界向量(由数据集向量分量范围构建)
            let max = this.vect(this.ps[0]).clone(), min = max.clone();
            for(let i=1, n=this.ps.length; i<n; i++) {
                let p = this.vect(this.ps[i]);
                for(let k=0, end=p.v.length; k<end; k++) {
                    if(max.v[k] < p.v[k]) { max.v[k] = p.v[k]; }
                    if(min.v[k] > p.v[k]) { min.v[k] = p.v[k]; }
                }
            }
            this.dsr = [];
            for(let i=0; i<min.v.length; i++) {
                this.dsr[i] = [min.v[i], max.v[i]];
            }
        }
        //计算数据集网格容器尺寸(this.size)与数据集非负平移量(this.dst)
        this.size = [], this.dst = [];
        for(let i=0, n=this.dsr.length; i<n; i++) {
            this.size[i] = this.dsr[i][1] - this.dsr[i][0];
            this.dst[i] = this.dsr[i][0] < 0 ? -this.dsr[i][0] : 0;
        }
        this.dst = new Vector(...this.dst);
        //构建网格数据存储容器
        this.grid = GridNNS.GridContainer(this.dn, this.size);
        //将数据集存储到网格容器中
        for(let i=0, n=this.ps.length; i<n; i++) {
            this.grid.set(this.vect(this.ps[i]).clone().add(this.dst), this.ps[i]);
        }
        return this;
    }

    /**
     * dist邻近集
     * 
     * @override
     * @param { Object } tp - 目标对象 
     * @param { number } dist - 判定距离(dist>=0)
     * @returns { Object[] } 邻近集([ps[i], ps[k], ps[j], ...])
     */
    near(tp, dist) {
        //计算网格邻域半径
        let R = Math.ceil(dist/this.dn);
        //计算网格近似邻近集
        let gnps = this.grid.get(this.vect(tp).clone().add(this.dst), R);
        //计算临近集
        return super.near(tp, dist, gnps);
    }

    /**
     * k邻近集: 当数据集离散程度较大时，在极端情况下，该算法的计算效率要低于 "LinearNNS.k_near"。
     * 
     * @override
     * @param { Object } tp - 目标对象 
     * @param { number } k - k个最近的元素(k >= nps.length)
     * @returns { Object[] } 邻近集([ps[i], ps[k], ps[j], ...])
     * 
     * @todo 计算优化，网格坐标系环形单元格坐标计算算法
     */
    k_near(tp, k) {
        //计算最大网格半径
        let max_R = Math.max(...this.grid.dsize), R = 1;
        //计算网格近似邻近集
        let gnps = [];
        while(gnps.length<k && R<=max_R) {
            gnps = this.grid.get(this.vect(tp).clone().add(this.dst), R++)
        }
        gnps = this.grid.get(this.vect(tp).clone().add(this.dst), Math.min(R+1, max_R));
        //计算临近集
        return super.k_near(tp, k, gnps);
    }
}


//KD树-邻近搜索
class KDTreeNNS extends NearestNeighborSearch {

}


export { NearestNeighborSearch, LinearNNS, GridNNS, KDTreeNNS };