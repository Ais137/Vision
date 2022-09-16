//构建渲染器
const randerer = new vision.randerer.IntervalRanderer().rander(() => {
    canvas.refresh();
});