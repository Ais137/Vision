# Development Standard | 开发规范

## 代码注释

## 开发日志记录

## 代码片段

## 核心开发思想
**计算逻辑与绘制(逻辑)分离的核心设计原则**
这样的目的在于，计算逻辑具有很高的抽象性，而相对的，绘制逻辑则需要基于绘制API(H5 Canvas API)进行
构建。将两者分离后，如果后期需要将该框架移植到其他语言平台，则只需要通过重新构建新平台的绘制API，
而不需要对计算逻辑有太大的结构性适配。