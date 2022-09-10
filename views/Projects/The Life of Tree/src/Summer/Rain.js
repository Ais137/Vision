/************************ 
Name: 雨 Rain
Date: 2017-11-19
Auther: Ais
Version: 1.0
*************************/


/*************************
Class Name: RainDrop 雨点 
Property:
    * x => 当前雨点的 x 坐标 
    * y => 当前雨点的 y 坐标
    * len => 雨滴的长度 
Method:
    * Drop => 下落
**************************/
class RainDrop {

    //构造器
    constructor(x0, y0, len0) {
        this.x = x0;
        this.y = y0;
        this.len = len0;
    }

    /* 
    dx => x 位移增量
    dy => y 位移增量
    */
    Drop(dx, dy) {
        this.x += dx;
        this.y += dy;
    }
}


/*************************
Class Name: Rain 雨
Property:
    * width, height => 降雨范围

    * MaxRainSize => 最大雨量
    * __CurrentRainSize => 当前雨量

    * RainDrops => 雨点对象数组

    * x0Range, y0Range  => 雨点生成范围
    * lenRange          => 雨点长度生成范围
    * dxRange, dyRange  =>  雨点下落时的随机偏移量

    * DropAct => 雨点倾角
  
Method:
    * Raining => 降雨
    * Draw => 绘制雨

**************************/
class Rain {

    //构造器
    constructor(width, height, MaxRainSize) {
        //降雨范围
        this.width = width;
        this.height = height;

        //最大雨量
        this.MaxRainSize = MaxRainSize;
        //当前雨量
        this.__CurrentRainSize = 0;

        //储存雨点数据
        this.RainDrops = new Array(MaxRainSize);
        for(let i=0; i<this.MaxRainSize; i++)
            this.RainDrops[i] = null;

        //雨点生成范围
        this.x0Range = Rain.RangeBuilder(-200, this.width);
        this.y0Range = Rain.RangeBuilder(0, 300);

        //雨点的长度生成范围
        this.lenRange = Rain.RangeBuilder(50, 100);

        //雨点下落时的随机偏移量
        this.dxRange = Rain.RangeBuilder(-2, 2);
        this.dyRange = Rain.RangeBuilder(-5, 5);

        //雨点倾角
        this.DropAct = 0;
    }


    //雨点构造器
    __BuildRainDrop() {
        return new RainDrop(Rain.Random(this.x0Range), Rain.Random(this.y0Range), Rain.Random(this.lenRange));
    }


    //降雨
    Raining(RainSize, dx, dy) {
        this.DropAct = Math.atan(dy / dx);

        for(let i=0; i<this.MaxRainSize; i++) {

            if(this.RainDrops[i] != null)     
            {
                if(this.RainDrops[i].y > this.height)    //当雨点落到地面时 
                {
                    if(this.__CurrentRainSize > RainSize)  //当前雨量大于目标雨量 => 删除雨点 减少雨点数
                    {
                        this.RainDrops[i] = null;
                        this.__CurrentRainSize--;
                    }
                    else     //当前雨量小于或等于目标雨量 => 更新雨点
                    {
                        this.RainDrops[i] = this.__BuildRainDrop();
                    }   
                }
                else      //当雨点未落到地面时 => 继续下落
                {
                    this.RainDrops[i].Drop(dx + Rain.Random(this.dxRange), dy + Rain.Random(this.dyRange));
                }
            }
            else  
            {
                if(this.__CurrentRainSize < RainSize)   //当前雨量小于目标雨量 => 创建雨点 增加雨点数
                {
                    this.RainDrops[i] = this.__BuildRainDrop();
                    this.__CurrentRainSize++;
                }
            }
        }
    }


    //绘制雨
    Draw(canvas) {
        canvas.ctx.lineWidth = 1;

        var MaxRainSize = this.MaxRainSize;

        for(let i=0; i<MaxRainSize; i++) {
            if(this.RainDrops[i] != null) {
                var x0 = this.RainDrops[i].x + this.RainDrops[i].len * Math.cos(this.DropAct);
                var y0 = this.RainDrops[i].y + this.RainDrops[i].len * Math.sin(this.DropAct);

                var color = parseInt(((this.height - this.RainDrops[i].y) / this.height) * 205) + 50;
                
                canvas.ctx.strokeStyle = `rgb(${color},${color},${color})`;
                canvas.line(x0, y0, this.RainDrops[i].x, this.RainDrops[i].y);
            }
        }
    }


}


//范围生成器
Rain.RangeBuilder = function(s, e) {
    return { "s": s, "e": e };
}

//随机数生成器
Rain.Random = function(Range) {
    return Math.random() * (Range.e - Range.s) + Range.s;
}
