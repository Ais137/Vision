# Name: VisionProtocol
# Date: 2023-06-07
# Author: Ais
# Desc: None


from abc import ABCMeta, abstractmethod


# 渲染协议
class VisionProtocol(metaclass=ABCMeta):
    """渲染协议"""

    @abstractmethod
    def refresh(color=[50, 50, 50], width=1920, height=1080):
        """刷新画布"""
        pass

    @abstractmethod
    def line(xs, ys, xe, ye, color=[255, 255, 255], lineWidth=1):
        """绘制直线"""
        pass

    @abstractmethod
    def circle(x, y, r, color=[255, 255, 255], lineWidth=1, fill=False):
        """绘制圆"""
        pass
    
    @abstractmethod
    def rect(x, y, rx, ry, color=[255, 255, 255], lineWidth=1, fill=False):
        """绘制矩形"""
        pass

    @abstractmethod
    def polyline(points, color=[255, 255, 255], lineWidth=1, close=False):
        """绘制折线"""
        pass

    @abstractmethod
    def polygon(points, color=[255, 255, 255]):
        """绘制多边形"""
        pass

