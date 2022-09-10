
//直线动力系统
class StraightSystem{
    
    //构造函数
    constructor(x, y, v, End_Distance){
        //初始坐标 
        this.x = x;
        this.y = y;
    
        //速度
        this.v = v;
        //加速度
        this.a = 0;
    
        //终止距离
        this.End_Distance = End_Distance || v; 
    
        //路径
        this.Path = [];
        //路径节点序号
        this.PathNode = 0;
    }
    
    //添加路径
    AddPath(Path){
        if(Path.length == 0)
            return false;

        //添加路径节点
        for(let i=0; i<Path.length; i++)
        {
            if(typeof Path[i].x === "number" && typeof Path[i].y === "number")
                this.Path.push(Path[i]);
        }
        
        //更新初始坐标
        this.x = this.Path[0].x;
        this.y = this.Path[0].y;

        return true;
    }
    
    //按路径移动
    PathMove(){
        var i = this.PathNode;
        var NoSTOP = this.MoveTo(this.Path[i].x,this.Path[i].y);
    
        if(NoSTOP == false)
            this.PathNode = (this.PathNode + 1) % this.Path.length;
    }
    
    
    //移动到 (x,y)
    MoveTo(x, y){
        var distance = this.GetDistance(this.x, this.y, x, y);
        if(distance <= this.End_Distance)
            return false;
    
        var azimuth = this.GetAzimuth(x, y, this.x, this.y);
    
        this.x = (distance - this.v) * Math.cos(azimuth) + x;
        this.y = (distance - this.v) * Math.sin(azimuth) + y;
    
        return true;
    }
    
    
    //获取当前坐标
    Getxy(){
        return {"x":this.x, "y":this.y};
    }
    
    
    //计算距离
    GetDistance(x1, y1, x2, y2){
        var dx = (x1 - x2);
        var dy = (y1 - y2);
        return Math.sqrt((dx * dx) + (dy * dy));
    } 
    
    
    //计算方位角
    GetAzimuth(Sx, Sy, Ex, Ey){
        //计算弧度
        var radian = Math.atan((Ey - Sy) / (Ex - Sx));
        
        if(radian == 0)
        {
            if(Ex > Sx)                    // X正半轴
                return 0;
            else
                return Math.PI;            // X负半轴
        }
        else if(radian > 0)
        {
            if(Ex < Sx)
                return radian + Math.PI;   // [3]象限
            else
                return radian;             // [1]象限
        }
        else
        {
            if(Ex < Sx)
                return radian + Math.PI;   // [2]象限
            else
                return radian + Math.PI * 2; //[3] 象限
        }
    }
}
    
    
    
//旋转动力系统
class RotationSystem{
    
    //构造函数
    constructor(x0, y0, R, AngleSpeed){
        //旋转中心  定点
        this.x0 = x0 || 0;
        this.y0 = y0 || 0;
    
        //旋转点    动点
        this.x = 0;
        this.y = 0;
        //旋转角
        this.Angle = 0;
            
        //旋转半径
        this.R = R || 0;
        //角速度
        this.AngleSpeed = AngleSpeed || 0;
        //角加速度
        this.Angle_Accelerated_Speed = 0;
    }
    
    //旋转
    Rotate(){
        //计算旋转角
        this.Angle += this.AngleSpeed;
        //计算选择速度
        this.AngleSpeed += this.Angle_Accelerated_Speed;
    
        //计算旋转后的坐标
        this.x = this.R * Math.cos(this.Angle) + this.x0;
        this.y = this.R * Math.sin(this.Angle) + this.y0;
    
        return {"x":this.x,"y":this.y};
    }
}
    
    
    
    
    
    
    
//角度转弧度
var Angle_Transform_Radian = function(Angle){
    return Angle * ((Math.PI * 2) / 360);
}
var ATR = Angle_Transform_Radian;

    
//弧度转角度
var Radian_Transform_Angle = function(Radion){
    return Radion * (360 / (Math.PI * 2));
}
var RTA = Radian_Transform_Angle;
    

//计算中点坐标
var MiddlePoint = function(x1, y1, x2, y2){
    return {"x": (x1 + x2) / 2, "y": (y1 + y2) / 2};             
}
    
//计算距离
var Distance = function(Sx, Sy, Ex, Ey){
    var dx = (Sx - Ex);
    var dy = (Sy - Ey);
    return Math.sqrt((dx * dx) + (dy * dy));
} 
    
    
    
//计算 点E 相对与 点S 的角度
var Azimuth = function(Sx, Sy, Ex, Ey){
    //计算弧度
    var radian = Math.atan((Ey - Sy) / (Ex - Sx));
    
    if(radian == 0)
    {
        if(Ex > Sx)            // X正半轴
            return 0;
        else
            return Math.PI;    // X负半轴
    }
    else if(radian > 0)
    {
        if(Ex < Sx)
            return radian + Math.PI;   // [3]象限
        else
            return radian;             // [1]象限
    }
    else
    {
        if(Ex < Sx)
            return radian + Math.PI;   // [2]象限
        else
            return radian + Math.PI * 2; //[3] 象限
    }
} 
    
    
//生成随机数
var GetRandom = function(Start, End, isfloat = false){
    if(arguments == 0 || End <= Start)
        return 0;

    if(arguments.length == 1){
        End = Start;
        Start = 0;
    }

    if(isfloat == true)
        return Math.random() * (End - Start) + Start;
    else
        return parseInt(Math.random() * (End - Start) + Start);
}


//点构造器
var Point = function (x, y) {
    return { "x": x, "y": y };
}


//随机数生成器
var Random = function(S, E) {
    return Math.random() * (E - S) + S;
}