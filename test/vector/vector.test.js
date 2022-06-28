/****************************************
 * Name: Vector 单元测试
 * Date: 2022-06-20
 * Author: Ais
 * Project: 
 * Desc: 
 * Version: 0.1
****************************************/

//导入目标模块
const Vector = require("../../src/vector/vector").Vector;

//分量接口测试
test("vector weight get/set", () => {
    let v1 = new Vector(1, 2, 3, 4);
    /*------------------------------*/
    expect(v1.v).toEqual([1, 2, 3, 4])
    /*------------------------------*/
    expect(v1.x).toBe(1);
    expect(v1.y).toBe(2);
    expect(v1.z).toBe(3);
    /*------------------------------*/
    v1.x = 111, v1.y = 222, v1.z = 333;
    expect(v1.v).toEqual([111, 222, 333, 4]);
});

//维度
test("vector method(dim)", () => {
    let v1 = new Vector(1, 1, 2, 7);
    expect(v1.dim()).toBe(4);
    expect(v1.dim(3).v).toEqual([1, 1, 2])
    expect(v1.dim(5).v).toEqual([1, 1, 2, 0, 0])
});

//复制
test("vector method(clone/copy)", () => {
    let v1 = new Vector(1, 2, 3);
    let v2 = v1.clone();
    expect(v1.v).toEqual(v2.v);
    v1.x = 111
    expect(v1.v).not.toEqual(v2.v);
});

//基本运算
test("vector op(add, mult, sub)", () => {
    let v1 = new Vector(1, 2, 3);
    //add
    expect(v1.clone().add(new Vector(4, 5, 6)).v).toEqual([5, 7, 9]);
    expect(v1.clone().add(new Vector(1, 2, 3, 4, 5)).v).toEqual([2, 4, 6]);
    expect(v1.clone().add(new Vector(1, 2)).v).toEqual([2, 4, 3]);
    //mult
    expect(v1.clone().mult(2).v).toEqual([2, 4, 6]);
    expect(v1.clone().mult(0).v).toEqual([0, 0, 0]);
    expect(v1.clone().mult(-1).v).toEqual([-1, -2, -3]);
    //sub
    let v2 = new Vector(1, 1, 1);
    expect(v1.clone().sub(v2).v).toEqual([0, 1, 2]);
    expect(v1.clone().add(v2.clone().mult(-1)).v).toEqual([0, 1, 2]);
});

//模长
test("vector method(norm)", () => {
    //get
    expect(new Vector(1, 1).norm()).toBeCloseTo(Math.sqrt(2));
    expect(new Vector(3, 4).norm()).toBeCloseTo(5);
    //set
    expect(new Vector(1, 1).norm(5).x).toBeCloseTo(Math.sqrt(5*5/2));
    //norm(0)
    expect(new Vector(3, 4).norm(0).v).toEqual([0, 0]);
});

//单位化
test("vector method(normalize)", () => {
    expect(new Vector(3, 4).normalize().norm()).toBeCloseTo(1);
});

//限制器
test("vector method(limit)", () => {
    let v1 = new Vector(2, 2);
    expect(v1.clone().add(new Vector(2, 2)).limit(3).norm()).toBeCloseTo(3);
    expect(v1.clone().norm(2).limit(3, 5).norm()).toBeCloseTo(3);
});


