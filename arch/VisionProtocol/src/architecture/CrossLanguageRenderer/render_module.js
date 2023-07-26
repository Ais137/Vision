/**
 * @desc     跨语言渲染测试
 * @project  Vision
 * @author   Ais
 * @date     2023-06-11
 * @version  0.1.0
*/


//导入渲染模块
// import { renderer } from "../../renderer/test.js";
import { renderer } from "../../renderer/helix.js";
// import { renderer } from "../../renderer/boids.js";

//中间代码渲染上下文容器 测试
// import { IRContext } from "../../context/IRContext.js";
// const context = new IRContext(1920, 1080, [0, 0, 0]).init("vision.code");

//RPC渲染上下文容器 测试
import { RPCContext } from "../../context/RPCContext.js";
const context = new RPCContext(1920, 1080, [0, 0, 0]).init("../../protocol/vision.proto", {DEBUG: false});

renderer(context, {stop_ft: 100, interval_time: 0});
