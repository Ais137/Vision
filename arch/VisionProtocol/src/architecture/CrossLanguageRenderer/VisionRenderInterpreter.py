# Name: VisionRenderInterpreter 渲染解释器
# Date: 2023-06-28
# Author: Ais
# Desc: 跨语言渲染 - 中间代码组件


import json
from OpencvContext import OpencvContext


# 渲染解释器
class VisionRenderInterpreter(object):

    def __init__(self):
        # 渲染上下文容器
        self.context = OpencvContext()

    # 渲染调用
    def rendering(self, IRcode_filepath):
        vision_IRcode = []
        # 导入中间代码
        with open(IRcode_filepath, "r", encoding="utf-8") as f:
            vision_IRcode = [json.loads(code) for code in f.readlines() if code]
        # 根据中间代码渲染图像
        [getattr(self.context, IRcode["cmd"])(**IRcode["param"]) for IRcode in vision_IRcode]


if __name__ ==  "__main__":
    
    VisionRenderInterpreter().rendering("./vision.code")