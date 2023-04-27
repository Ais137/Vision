/****************************************
 * Name: vector.coor unittest
 * Date: 2022-12-05
 * Author: Ais
 * Project: 
 * Desc: 坐标系模块测试
 * Version: 0.1
****************************************/

//导入目标模块
import * as coors from "../../src/particle/coor.js";
import { Vector } from "../../src/vector/vector.js";

//RCS坐标系
test("vector.coor.RCS", () => {
    //构建实例
    let rcs = new coors.RCS(Vector.v(500, 500), 0.5);
    //坐标变换的互逆性
    let v1 = new Vector(100, 100);
    expect(rcs.from(rcs.to(v1)).v).toEqual(v1.v); 
    expect(rcs.to(rcs.from(v1)).v).toEqual(v1.v);
    //参数一致性
    expect(rcs.to(new Vector(100, -50)).v).toEqual(rcs.to([100, -50]));
    expect(rcs.from(new Vector(-2, 1)).v).toEqual(rcs.from([-2, 1]));
    //缩放
    expect(rcs.scale / 10).toEqual(rcs.zoom(10).scale);
    expect(rcs.to(new Vector(502, 500)).sub(rcs.to(new Vector(501, 500))).x).toEqual(0.05)
    expect(rcs.scale * 10).toEqual(rcs.zoom(-10).scale);
    expect(rcs.scale).toEqual(0.5);
    //平移
    expect(rcs.from([0, 0])).toEqual([500, 500]);
    expect(rcs.move([100, 0]).from([0, 0])).toEqual([600, 500]);
    //异常检测
    expect(() => { rcs.scale = 0; }).toThrow();
    expect(() => { rcs.scale = 2; }).not.toThrow();

});


//网格坐标系
test("vector.coor.Grid", () => {
    //构建实例
    let grid = new coors.Grid(new Vector(500, 500), 10, 10, true);
    //网格化: 单元格内的坐标会映射到同一点
    expect(grid.from(new Vector(1, 1)).v).toEqual([grid.co.x+grid.dx, grid.co.y+((grid.RY ? -1 : 1)*grid.dy)]);
    expect(grid.to(new Vector(510+7, 490+2)).v).not.toEqual(grid.to(new Vector(510-2, 490-1)).v);
    expect(grid.to(new Vector(510+3, 490+2)).v).toEqual(grid.to(new Vector(510-2, 490-1)).v);
    //参数一致性
    expect(grid.to([510+3, 490+2])).toEqual(grid.to([510-2, 490-1]));
    //y轴反转
    expect(grid.from(new Vector(0, 1)).y).toBeLessThan(grid.co.y);
    grid.RY = false;
    expect(grid.from(new Vector(0, 1)).y).toBeGreaterThan(grid.co.y);
    //异常检测
    expect(() => { grid.dx = 0.1; }).toThrow();
    expect(() => { grid.dx = 2; }).not.toThrow();
    expect(() => { grid.dy = 0.1; }).toThrow();
});


//极坐标系
test("vector.coor.PolarCS", () => {
    let pcs = new coors.PolarCS(new Vector(500, 500));
    expect(pcs.to(new Vector(550, 550)).y).toEqual(pcs.to(new Vector(600, 600)).y);
    expect(pcs.to([550, 550])[1]).toEqual(pcs.to([600, 600])[1]);
    expect(pcs.to([600, 600])[1]).toEqual(Math.PI/4);
    expect(pcs.to([600, 600])[0]).toEqual(Math.sqrt(2)*100);
    expect(pcs.from([Math.sqrt(2)*100, Math.PI/4])).toEqual([600, 600]);
});