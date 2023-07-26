/**
 * @module
 * @desc     RPC渲染上下文容器 
 * @project  Vision
 * @author   Ais
 * @date     2023-06-08
 * @version  0.1.0
*/


import * as grpc from "@grpc/grpc-js";
import * as protoLoader from '@grpc/proto-loader';
import { VisionContext } from "./VisionContext.js";


class RPCContext extends VisionContext {

    constructor(width=1920, height=1080, BGC=[50, 50, 50]) {
        super(width, height, BGC);
        //protobuf协议路径
        this.PROTO_PATH = null;
        //protobuf协议
        this.proto = null;
        //grpc连接地址
        this.address = null;
        //grpc连接对象
        this.conn = null;
        //调试开关
        this.DEBUG = false;
        //回调函数
        this.callback = (err, res) => { 
            // err && console.log(err);
            // console.log(res); 
        }
        //帧计数器
        this.ft = 0;
    }

    //初始化
    init(proto_path, {address='localhost:50051', DEBUG=false}={}) {
        this.DEBUG = DEBUG;
        //创建rpc连接
        this.PROTO_PATH = proto_path;
        this.proto = grpc.loadPackageDefinition(protoLoader.loadSync(
            this.PROTO_PATH,
            {
                keepCase: true,
                longs: String,
                enums: String,
                defaults: true,
                oneofs: true
            }
        ));
        this.address = address;
        this.conn = new this.proto.vision.VisionRendererAPI('localhost:50051', grpc.credentials.createInsecure());
        return this;
    }

    /** 刷新画布 */
    refresh(color=null, width=null, height=null) {
        console.log(`[RPCContext]: ft(${this.ft++})`);
        this.conn.refresh({
            color: color || this.BGC,
            width: width || this.width,
            height: height || this.height
        }, this.callback);
    }

    /** 绘制直线 */
    line(xs, ys, xe, ye, {color=[255, 255, 255], lineWidth=1}={}) {
        this.DEBUG && console.log("[RPCContext]: line");
        this.conn.line({
            xs: xs, ys: ys, xe: xe, ye: ye,
            color: color,
            lineWidth: lineWidth
        }, this.callback);
    }

    /** 绘制圆 */
    circle(x, y, r, {color=[255, 255, 255], lineWidth=1, fill=false}={}) {
        this.DEBUG && console.log("[RPCContext]: circle");
        this.conn.circle({
            x: x, y: y, r: r,
            color: color,
            lineWidth: lineWidth,
            fill: fill
        }, this.callback);
    }

    /** 绘制矩形 */
    rect(x, y, rx, ry, {color=[255, 255, 255], lineWidth=1, fill=false}={}) {
        this.DEBUG && console.log("[RPCContext]: rect");
        this.conn.rect({
            x: x, y: y, rx: rx, ry: ry,
            color: color,
            lineWidth: lineWidth,
            fill: fill
        }, this.callback);
    }

    /** 绘制折线 */
    polyline(points, {color=[255, 255, 255], lineWidth=1, close=false}={}) {
        this.DEBUG && console.log("[RPCContext]: polyline");
        let call = this.conn.polyline(this.callback);
        call.on("data", (res)=>{});
        call.on("end", ()=>{});
        //判断点集元素类型
        let isVector = (points[0].v != undefined);
        //判断是否是颜色对象
        let isColor = (color.color != undefined);
        //绘制线段
        let p1 = null, p2 = null, line_color = null;
        for(let i=0, n=points.length, end=(close ? n : n-1); i<end; i++) {
            p1 = isVector ? points[i].v : points[i];
            p2 = isVector ? points[(i+1)%n].v : points[(i+1)%n];
            line_color = isColor ? color.color(true) : color;
            call.write({
                xs: p1[0], ys: p1[1], xe: p2[0], ye: p2[1],
                color: line_color,
                lineWidth: lineWidth
            }, (err, res) => {});
        }
        call.end()
    }

    /** 绘制多边形 */
    polygon(points, {color=[255, 255, 255]}={}) {
        this.DEBUG && console.log("[RPCContext]: polygon");
        this.conn.polygon({points: points, color: color}, this.callback);
    }

    /** 退出 */
    exit() {
        this.conn.refresh({
            color: this.BGC,
            width: this.width,
            height: this.height
        }, ()=>{
            this.conn.close();
        });
    }
}


export { RPCContext }