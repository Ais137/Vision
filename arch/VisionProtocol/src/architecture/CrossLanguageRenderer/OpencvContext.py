# Name: OpencvContext
# Date: 2023-06-07
# Author: Decoder
# Desc: 基于 opencv 的渲染上下文容器


import os
import cv2
import numpy as np
from VisionProtocol import VisionProtocol


# Opencv渲染上下文容器
class OpencvContext(VisionProtocol):

    def __init__(self, width=1920, height=1080, BGC=[50, 50, 50], export_img_dir="./img", AUTO_EXPORT=True):
        # 画布尺寸
        self._width = width
        self._height = height
        # 背景颜色
        self.BGC = BGC
        # 绘图上下文对象
        self._context = None
        # 帧计数器
        self.ft = 0
        # 图像导出路径
        self.export_img_dir = export_img_dir
        not os.path.exists(self.export_img_dir) and os.makedirs(self.export_img_dir)
        # 自动导出开关
        self.AUTO_EXPORT = AUTO_EXPORT

    @property
    def width(self):
        return self._width
    @property
    def height(self):
        return self._height
    @property
    def cx(self):
        return int(self._width/2)
    @property
    def cy(self):
        return int(self._height/2)

    # 导出图像
    def export(self, filepath=""):
        if self._context is not None:
            filepath = filepath or os.path.join(self.export_img_dir, f'{self.ft}.jpg')
            cv2.imwrite(filepath, self._context)

    # 显示图像
    def show(self):
        cv2.imshow("context", self._context)
        cv2.waitKey(0)
    
    # 刷新画布
    def refresh(self, color=None, width=None, height=None):
        self.AUTO_EXPORT and self.export()
        self._context = np.zeros((height or self._height, width or self._width, 3), np.uint8)
        self._context[:,:] = color or self.BGC
        self.ft += 1

    # 绘制直线
    def line(self, xs, ys, xe, ye, color=[255, 255, 255], lineWidth=1):
        cv2.line(
            img = self._context, 
            pt1 = (int(xs), int(ys)), 
            pt2 = (int(xe), int(ye)), 
            color = [color[-1], color[1], color[0]], 
            thickness = lineWidth, 
            lineType = cv2.LINE_AA
        )

    # 绘制圆
    def circle(self, x, y, r, color=[255, 255, 255], lineWidth=1, fill=False):
        cv2.circle(
            img = self._context, 
            center = (int(x), int(y)), 
            radius = int(r), 
            color = [color[-1], color[1], color[0]], 
            thickness = -1 if fill else lineWidth, 
            lineType = cv2.LINE_AA
        )
    
    # 绘制矩形
    def rect(self, x, y, rx, ry, color=[255, 255, 255], lineWidth=1, fill=False):
        cv2.rectangle(
            img = self._context,
            pt1 = (int(x-rx), int(y-ry)),
            pt2 = (int(x+rx), int(y+ry)),
            color = [color[-1], color[1], color[0]],
            thickness = -1 if fill else lineWidth,
            lineType = cv2.LINE_AA
        )

    # 绘制折线
    def polyline(self, points, color=[255, 255, 255], lineWidth=1, close=False):
        cv2.polylines(
            img = self._context,
            pts = [np.array(points, np.int32)],
            color = [color[-1], color[1], color[0]],
            thickness = lineWidth,
            isClosed = close,
            lineType = cv2.LINE_AA
        )

    # 绘制多边形
    def polygon(self, points, color=[255, 255, 255]):
        cv2.fillPoly(
            img = self._context,
            pts = [np.array(points, np.int32)],
            color = [color[-1], color[1], color[0]]   
        )



if __name__ ==  "__main__":
    

    context = OpencvContext()

    context.refresh()
    context.line(0, 0, context.width, context.height, color=[0, 255, 0], lineWidth=3)
    context.circle(context.cx, context.cy, 100, color=[0, 175, 175], fill=True)
    context.rect(context.cx, context.cy, 500, 200, color=[255, 0, 0])
    context.polyline([[100, 100], [300, 100], [500, 300], [400, 700]], color=[0, 100, 255])
    context.polygon([[300, 500], [700, 500], [800, 700], [200, 700]], color=[0, 200, 200])
    context.show()

    # renderer.export(os.path.join(export_dir, f'{renderer.ft}.jpg'))
