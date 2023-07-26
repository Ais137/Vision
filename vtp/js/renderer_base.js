//构建渲染器
const renderer = new vision.renderer.IntervalRenderer().render(() => {
    context.refresh();
});