/************************ 
Name: Snow 降雪器
Date: 2017-11-19
Auther: Ais
Version: 1.0
*************************/


/*************************
Class Name: Snow 降雪器

Property:
    
Method:
    
**************************/
class Snow extends Rain {

    //构造器
    constructor(width, height, MaxSnowSize) {
        super(width, height, MaxSnowSize);

        //雪花生成范围 x轴
        this.x0Range = Rain.RangeBuilder(50, this.width + 250);

        //雪花半径范围
        this.SnowRRange = Rain.RangeBuilder(2, 5);

        //雪花下落时的随机偏移量
        this.dxRange = Rain.RangeBuilder(-1, 1);
        this.dyRange = Rain.RangeBuilder(-2, 2);
    }

    //雪花构造器
    __BuildRainDrop() {
        var raindrop = new RainDrop(Rain.Random(this.x0Range), Rain.Random(this.y0Range), Rain.Random(this.lenRange));
        raindrop.size = Rain.Random(this.SnowRRange);
        return raindrop;
    }

    //降雪
    Snowing(SnowSize, dx, dy) {
        this.Raining(SnowSize, dx, dy);
    }

    //绘制雪
    Draw(canvas) {
        canvas.ctx.lineWidth = 0.5;
        for(let i=0; i<this.MaxRainSize; i++) {
            if(this.RainDrops[i] != null) {
                canvas.ctx.fillStyle = `rgb(${255},${255},${255})`;
                canvas.circle(this.RainDrops[i].x, this.RainDrops[i].y, this.RainDrops[i].size, this.RainDrops[i].size);
                canvas.ctx.fill();
            }
        }
    }
}
