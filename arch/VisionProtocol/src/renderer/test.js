/**
 * @desc     运行环境兼容性架构测试
 * @project  Vision
 * @author   Ais
 * @date     2023-06-11
 * @version  0.1.0
*/


export function renderer(context, {interval_time=10, stop_ft=200}={}) {
    context.refresh();
    context.line(0, 0, context.width, context.height, {color: [0, 255, 0], lineWidth: 3});
    context.circle(context.cx, context.cy, 100, {color: [0, 175, 175], fill: true});
    context.rect(context.cx, context.cy, 500, 200, {color: [255, 0, 0]});
    context.polyline([[100, 100], [300, 100], [500, 300], [400, 700]], {color:[0, 100, 255]})
    context.polygon([[300, 500], [700, 500], [800, 700], [200, 700]], {color: [0, 200, 200]})
    context.exit();
}