/**********************************
Name:  ColorVariator  颜色变化器
Date: 2017-11-18
Auther: Ais
Version: 1.0
***********************************/

/**********************************
Class Name: ColorVariator  颜色变化器
Property:
    * count => 计数器
    * ChangeNum => 变化次数

    * RGBs => 起始颜色
    * RGBe => 终止颜色
    * __RGB => 当前颜色 

    * dR, dG, dB => 颜色增量

Method:
    * update => 更新参数
    * change => 颜色变化
    * RGB   => 获取当前 RGB 值 
    * color => RGB值字符串化
***********************************/
class ColorVariator {

    //构造器
    constructor(RGBs, RGBe, changeNum) {
        this.ChangeNum = changeNum;
        this.count = 0;

        this.RGBs = RGBs;
        this.RGBe = RGBe;
        this.__RGB = { "R": RGBs.R, "G": RGBs.G, "B": RGBs.B };

        this.isEND = false;

        this.init();
    }

    //初始化参数
    init() {
        this.count = 0;
        this.isEND = false;

        this.__RGB.R = this.RGBs.R;
        this.__RGB.G = this.RGBs.G;
        this.__RGB.B = this.RGBs.B;

        this.dR = (this.RGBe.R - this.RGBs.R) / this.ChangeNum;
        this.dG = (this.RGBe.G - this.RGBs.G) / this.ChangeNum;
        this.dB = (this.RGBe.B - this.RGBs.B) / this.ChangeNum;
    }

    //改变颜色
    change() {
        if(this.isEND == true)
            return;

        if (this.count < this.ChangeNum) 
        {
            this.__RGB.R += this.dR;
            this.__RGB.G += this.dG;
            this.__RGB.B += this.dB;
            this.count++;
        }
        else
        {
            this.isEND = true;
        }
    }

    //获取当前 RGB 值
    RGB(){
        return {"R":parseInt(this.__RGB.R), "G":parseInt(this.__RGB.G), "B":parseInt(this.__RGB.B)};
    }

    //RGB值字符串化
    color() {
        return `rgb(${parseInt(this.__RGB.R)},${parseInt(this.__RGB.G)},${parseInt(this.__RGB.B)})`;
    }
}


