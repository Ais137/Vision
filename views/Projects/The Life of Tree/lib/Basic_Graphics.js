//Canvas 对象
class EsCanvas{
    
        // ========== 构造函数 ========== //
        constructor(CanvasID, width, height) {
            //获取 Canvas 标签
            var canvas = document.getElementById(CanvasID);
            if(canvas === null)
                return null;
    
            //设置画布尺寸
            this.width = canvas.width = width;
            this.height = canvas.height = height;
            
            //获取可绘制对象
            this.ctx = canvas.getContext("2d");
        }
        
        // ========== 点 ========== //
        point(x, y){
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1, 0, 2 * Math.PI);
            this.ctx.stroke(); 
        }
    
        // ========== 直线 ========== //
        line(x1, y1, x2, y2) {
            this.ctx.beginPath();
            this.ctx.moveTo(x1,y1);
            this.ctx.lineTo(x2,y2);   
            this.ctx.stroke();        
        }
    
         // ========== 三角形 ========== //
        triangle(x1, y1, x2, y2, x3, y3){
            this.ctx.beginPath();
            this.ctx.moveTo(x1,y1);
            this.ctx.lineTo(x2,y2);
            this.ctx.lineTo(x3,y3);
            this.ctx.lineTo(x1,y1);
            this.ctx.stroke();
        }
        
        // ========== 矩形 ========== //
        rect(x,y,width,heigh){
            this.ctx.beginPath();
            this.ctx.rect(x, y, width, heigh);
            this.ctx.stroke();
        }
    
        // ========== 折线 (内部实现) ========== //
        __brokenline(points){
            if(points.length == 0)
                return false;
            //绘制起点
            this.ctx.moveTo(points[0][0],points[0][1]);
            for(let i=1; i<points.length; i++){
                //绘制中间节点
                if(points[i].length == 2)
                    this.ctx.lineTo(points[i][0],points[i][1]);
            }
            return true;
        }
    
        // ========== 折线 ========== //
        lines(points){
            if(this.__brokenline(points) == true)
                this.ctx.stroke();
        }
    
        // ========== 多边形 ========== //
        polygon(points){
            if(this.__brokenline(points) == true){
                this.ctx.lineTo(points[0][0],points[0][1]);
                this.ctx.stroke();
            }
        }
    
        // ========== 圆 ========== //
        circle(x, y, r){
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, 0, 2 * Math.PI);
            this.ctx.stroke(); 
        }
        
        // ========== 圆弧 =========== //
        arc(x, y, r, sAngle, eAngle, counterclockwise){
            this.ctx.beginPath();
            this.ctx.arc(x, y, r, sAngle, eAngle, counterclockwise);
            this.ctx.stroke(); 
        }
        
        //填充画布背景颜色
        background(R, G, B){
            this.ctx.fillStyle = `rgb(${R},${G},${B})`;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
        
    
    }
    