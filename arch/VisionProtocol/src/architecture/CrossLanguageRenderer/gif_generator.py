# Name: gif生成器
# Date: 2023-06-12
# Author: Ais
# Desc: None


import os
import imageio
import argparse


# 解析命令
parser = argparse.ArgumentParser(description="GIF生成器")
parser.add_argument("source_img_dir_path", type=str, help="源图像路径")
parser.add_argument("-o", "--out", type=str, default="./test.gif", help="文件导出路径")
args = parser.parse_args()
# 生成GIF
source_img_dir_path = args.source_img_dir_path
source_img_files = sorted([img_file for img_file in os.listdir(source_img_dir_path)], key=lambda i: int(i.split(".")[0]))
frames = [imageio.imread(os.path.join(source_img_dir_path, img_file)) for img_file in source_img_files]
imageio.mimsave(args.out, frames, "GIF", duration = 0.05)
