/****************************************
 * Name: utils.iterator unittest
 * Date: 2022-07-26
 * Author: Ais
 * Project: 
 * Desc: 
 * Version: 0.1
****************************************/

//导入目标模块
const iterator = require("../src/utils/iterator");

//迭代器基类
test("utils.iterator.Iterator", () => {
    let iter = new iterator.Iterator(1);
    expect(iter.val()).toBe(1);
    expect(iter.val()).toBe(1);
    expect(iter.end()).toBe(false);
    expect(iter.tolist(3)).toEqual([1, 1, 1]);
});

//范围迭代器
test("utils.iterator.Range", () => {
    let iter1 = new iterator.Range(0, 4, 2);
    expect(iter1.val()).toBe(0);
    expect(iter1.end()).toBe(false);
    expect(iter1.val()).toBe(2);
    expect(iter1.val()).toBe(4);
    expect(iter1.end()).toBe(true);

    expect(new iterator.Range(1, 3).tolist()).toEqual([1, 2, 3])
    expect(iterator.Range.S(0, 4, 2).tolist()).toEqual([0, 2, 4]); 
    expect(iterator.Range.N(0, 5, 4).tolist()).toEqual([0, 1.25, 2.5, 3.75, 5]); 

    let iter2 = new iterator.Range(0, 10, 3);
    let vals = [];
    for(;!iter2.end();) { vals.push(iter2.val()); }
    expect(new iterator.Range(0, 10, 3).tolist()).toEqual(vals);
});

//函数迭代器
test("utils.iterator.FuncIterator", () => {
    expect(new iterator.FuncIterator((x)=>{return x*x;}, iterator.Range.S(0, 3)).tolist()).toEqual([0, 1, 4, 9]);
    expect(new iterator.FuncIterator((x)=>{return x*x;}, [0, 3]).tolist()).toEqual([0, 1, 4, 9]);
});
