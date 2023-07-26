/**
 * @desc     运行环境兼容性架构 nodejs 环境测试
 * @project  Vision
 * @author   Ais
 * @date     2023-06-07
 * @version  0.1.0
*/

//导入虚拟化上下文容器
import { VirtualContext } from "../../context/VirtualContext.js";
//导入渲染模块
// import { renderer } from "../../renderer/test.js";
import { renderer } from "../../renderer/helix.js";
// import { renderer } from "../../renderer/boids.js";

const context = new VirtualContext(1920, 1080, [0, 0, 0]).init();
renderer(context);