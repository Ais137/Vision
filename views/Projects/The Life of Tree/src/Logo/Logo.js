/**********************************
Name: Logo 
Date: 2017-11-21
Auther: Ais
Version: 1.0
***********************************/

/**********************************
Class Name: ThreeCurveLogo  三曲线
Property:
    * x0, y0 => 中心坐标

    * R => 半径: 起点到中心的距离
    
    * __Act => 当前弧度值
    * vAct => 角速度
    * dAct => 起点与辅助点间的弧度差
    * __dThreeAct => 三等分圆后，两点之间的弧度差 (PI*2 / 3)
    
    * __Len => 当前边长
    * vLen => 边长增长速度
    * EndLen => 终止边长
    
    * StartPoints => 起点
    * AuxiliaryPoints => 辅助点
    * EndPoints => 终点
    
    * isEND => 终止标记
Method:
    

***********************************/
class ThreeCurveLogo {

    //构造器
    constructor(x0, y0, R, Endlen) {
        //中心坐标
        this.BasePoint = { "x": x0, "y": y0 };

        //半径
        this.R = R || 100;

        //当前弧度值
        this.__Act = 0;
        //角速度
        this.vAct = -ThreeCurveLogo.ATR(1);
        //起点与辅助点间的弧度差
        this.dAct = ThreeCurveLogo.ATR(30)
        //三等分圆弧度差
        this.__dThreeAct = (Math.PI * 2) / 3;

        //当前边长
        this.__Len = 0;
        //边长增长速度
        this.vLen = 3;
        //终止边长
        this.EndLen = Endlen || 300;

        //起始点
        this.StartPoints = null;
        //辅助点
        this.AuxiliaryPoints = null;
        //终点
        this.EndPoints = null;

        //终止标记
        this.isEND = false;


        //起始颜色
        this.RGBs = {"R":50, "G":50, "B":50 };
        //终止颜色
        this.RGBe = {"R":250, "G":250, "B":250 };
        //颜色变化器
        this.colorvariator = null; 


        this.Init();

    }


    //初始化
    Init() {

        this.colorvariator = new LogoColorVariator(this.RGBs, this.RGBe, this.EndLen / this.vLen);

        this.StartPoints = new Array();
        this.AuxiliaryPoints = new Array();
        this.EndPoints = new Array();

        for (let i = 0; i < 3; i++) {
            this.StartPoints.push({ "x": 0, "y": 0 });
            this.AuxiliaryPoints.push({ "x": 0, "y": 0 });
            this.EndPoints.push({ "x": 0, "y": 0 });


            //初始化起点坐标
            this.__RotatePoint(this.StartPoints[i], this.BasePoint, this.R, this.__Act + i * this.__dThreeAct);
            //初始化终点坐标 
            this.EndPoints[i].x = this.StartPoints[i].x;
            this.EndPoints[i].y = this.StartPoints[i].y;
        }
    }


    //旋转点
    __RotatePoint(point, basepoint, len, act) {
        point.x = basepoint.x + len * Math.cos(act);
        point.y = basepoint.y + len * Math.sin(act);
    }


    //更新终点坐标
    __UpdateEndPoints() {
        for (let i = 0; i < 3; i++) {
            //起点序号
            var SpNum = i % 3;
            //辅助点序号
            var ApNum = (i + 2) % 3;

            //计算辅助点相对于起点的方位
            var act = ThreeCurveLogo.Azimuth(this.StartPoints[SpNum], this.AuxiliaryPoints[ApNum]);

            //计算终点坐标
            this.__RotatePoint(this.EndPoints[i], this.StartPoints[SpNum], this.__Len, act);
        }
    }


    //旋转
    __Rotate() {
        this.__Act += this.vAct;

        for (let i = 0; i < 3; i++) {
            //旋转起点
            this.__RotatePoint(this.StartPoints[i], this.BasePoint, this.R, this.__Act + i * this.__dThreeAct);
            //旋转辅助点
            this.__RotatePoint(this.AuxiliaryPoints[i], this.BasePoint, this.R, this.__Act + i * this.__dThreeAct - this.dAct);
        }

        if (this.isEND == true) {
            this.__UpdateEndPoints();
        }
    }


    //直线移动
    __LineMove() {

        if (this.isEND == true)
            return;

        //判断边长是否达到最大长度
        if (Math.abs(this.EndLen - this.__Len) < this.vLen) {
            this.isEND = true;
            return;
        }

        this.__Len += this.vLen;

        this.__UpdateEndPoints();
    }


    //移动
    Move() {
        this.__Rotate()
        if (this.isEND == false)
            this.__LineMove();
    }


    //绘制
    Draw(canvas) {

        canvas.ctx.lineCap = "round";
        
        this.colorvariator.change();
        
        var lenWidth = 5;
        var r = lenWidth / 2 + 1;
        
        for (let i = 0; i < 3; i++) {
            
            canvas.ctx.lineWidth = lenWidth;
            canvas.ctx.strokeStyle = this.colorvariator.color();
            canvas.line(this.StartPoints[i].x, this.StartPoints[i].y, this.EndPoints[i].x, this.EndPoints[i].y);
        
            canvas.ctx.lineWidth = 1;
            canvas.ctx.fillStyle = `rgb(${0},${200},${100})`;
            canvas.circle(this.StartPoints[i].x, this.StartPoints[i].y, r, r);
            canvas.ctx.fill();
            
            canvas.ctx.fillStyle = `rgb(${0},${100},${200})`;
            canvas.circle(this.EndPoints[i].x, this.EndPoints[i].y, r, r);
            canvas.ctx.fill();
        }

    }
}


//角度转弧度
ThreeCurveLogo.ATR = function (Angle) {
    return Angle * ((Math.PI * 2) / 360);
}


//计算 点E 相对与 点S 的角度
ThreeCurveLogo.Azimuth = function (Ps, Pe) {
    //计算弧度
    var radian = Math.atan((Pe.y - Ps.y) / (Pe.x - Ps.x));

    if (radian == 0) {
        if (Pe.x > Ps.x)
            return 0;
        else
            return Math.PI;
    }
    else if (radian > 0) {
        if (Pe.x < Ps.x)
            return radian + Math.PI;
        else
            return radian;
    }
    else {
        if (Pe.x < Ps.x)
            return radian + Math.PI;
        else
            return radian + Math.PI * 2;
    }
}


/**********************************
Class Name: LogoColorVariator  颜色变化器
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
class  LogoColorVariator {

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
        if (this.isEND == true)
            return;

        if (this.count < this.ChangeNum) {
            this.__RGB.R += this.dR;
            this.__RGB.G += this.dG;
            this.__RGB.B += this.dB;
            this.count++;
        }
        else {
            this.isEND = true;
        }
    }

    //获取当前 RGB 值
    RGB() {
        return { "R": parseInt(this.__RGB.R), "G": parseInt(this.__RGB.G), "B": parseInt(this.__RGB.B) };
    }

    //RGB值字符串化
    color() {
        return `rgb(${parseInt(this.__RGB.R)},${parseInt(this.__RGB.G)},${parseInt(this.__RGB.B)})`;
    }
}
