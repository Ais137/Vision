//构建网格坐标系
const grid = new vision.coor.Grid(new Vector(canvas.cx, canvas.cy), 50, 50, true);

//渲染函数
const renderer = function() {
    //绘制网格
    Views.grid({co: grid.co, dx: grid.dx, dy: grid.dy});
    //绘制中心点
    canvas.circle(grid.co.x, grid.co.y, grid.dx*0.1, "rgb(255, 255, 255)");
}
renderer();

//网格坐标系缩放
document.getElementById("vision_canvas").addEventListener("mousewheel", function(event) { 
    canvas.refresh();
    let dv = 10;
    grid.dx = grid.dy = event.wheelDelta>0 ? grid.dx+dv : (grid.dx>dv ? grid.dx-dv : grid.dx)
    renderer();
});