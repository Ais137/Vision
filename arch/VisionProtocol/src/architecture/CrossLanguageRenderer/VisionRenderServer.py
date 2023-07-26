# Name: VisionRenderServer 渲染服务器
# Date: 2023-06-07
# Author: Ais
# Desc: None


import grpc
import vision_pb2
import vision_pb2_grpc
from concurrent import futures
from OpencvContext import OpencvContext


# 渲染服务器
class VisionRenderServer(vision_pb2_grpc.VisionRendererAPIServicer):

    def __init__(self):
        # 渲染上下文容器
        self.context = OpencvContext()
        # 调试开关
        self.DEBUG = False

    def refresh(self, request, context):
        print(f'[VisionRenderServer]: ft({self.context.ft})')
        self.context.refresh(request.color, request.width, request.height)
        return vision_pb2.Response(state=True)

    def line(self, request, context):
        self.DEBUG and print(f'[VisionRenderServer]: line')
        # self.DEBUG and print(f'[VisionRenderServer]: line -> ({request.xs}, {request.ys}, {request.xe}, {request.ye})')
        self.context.line(
            xs = request.xs, 
            ys = request.ys, 
            xe = request.xe, 
            ye = request.ye, 
            color = request.color,
            lineWidth = request.lineWidth
        )
        return vision_pb2.Response(state=True)

    def circle(self, request, context):
        self.DEBUG and print(f'[VisionRenderServer]: circle')
        self.context.circle(
            x = request.x,
            y = request.y,
            r = request.r,
            color = request.color,
            lineWidth = request.lineWidth,
            fill = request.fill
        )
        return vision_pb2.Response(state=True)

    def rect(self, request, context):
        self.DEBUG and print(f'[VisionRenderServer]: rect')
        self.context.rect(
            x = request.x,
            y = request.y,
            rx = request.rx,
            ry = request.ry,
            color = request.color,
            lineWidth = request.lineWidth,
            fill = request.fill
        )
        return vision_pb2.Response(state=True)

    def polyline(self, request_iterator, context):
        self.DEBUG and print(f'[VisionRenderServer]: polyline')
        for request in request_iterator:
            self.context.line(
                xs = request.xs, 
                ys = request.ys, 
                xe = request.xe, 
                ye = request.ye, 
                color = request.color,
                lineWidth = request.lineWidth
            )
        return vision_pb2.Response(state=True)
    
    def polygon(self, request, context):
        self.DEBUG and print(f'[VisionRenderServer]: polygon')
        print(request.points, type(request.points))
        return vision_pb2.Response(state=True)


def server(port="50051", max_workers=20):
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=max_workers), options={
        ('grpc.max_send_message_length', 1024 * 1024 * 1024),
        ('grpc.max_receive_message_length', 1024 * 1024 * 1024)
    })
    vision_pb2_grpc.add_VisionRendererAPIServicer_to_server(VisionRenderServer(), server)
    server.add_insecure_port('[::]:' + port)
    server.start()
    print("Server started, listening on " + port)
    server.wait_for_termination()


if __name__ ==  "__main__":
    server(max_workers=1)
