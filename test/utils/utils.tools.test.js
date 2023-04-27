/****************************************
 * Name: utils.tools unittest
 * Date: 2022-08-01
 * Author: Ais
 * Project: Vision
 * Desc: 
 * Version: 0.1
****************************************/

//导入目标测试模块
import { Tools } from "../../src/utils/tools.js";

//角度<>弧度转换器
test("utils.tools.Tools.ATR(RTA)", () => {
    expect(Tools.ATR(45)).toBeCloseTo(Math.PI/4);
    expect(Tools.RTA(Math.PI/4)).toBeCloseTo(45);
});

//随机数生成器
test("utils.tools.Tools.random", ()=> {
    for(let i=0; i<100; i++) {
        expect(parseInt(Tools.random(0, 5))).toBeLessThanOrEqual(5);
    }
});