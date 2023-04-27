//模板配置文件
export const TPS_CONFS = {
    //vision模块路径
    "vmpath": "../dist/vision.js",
    //基础模板
    "base": {
        "path": "./base.html",
        "renderer": "./js/renderer_base.js",
        "css": "./css/base.css"
    },
    //模板列表
    "templates": {
        //基础模板
        "base": {
            //简介
            "desc": "基础模板",
            //模板代码
            "code": [],
            //渲染器
            "renderer": "./js/renderer_base.js",
            //模板样式表
            "css": []
        },
        //网格模板
        "grid": {
            "desc": "网格坐标系",
            "code": [
                "./js/grid.js"
            ],
            "renderer": null,
        },
        //粒子系统
        "pcs": {
            "desc": "构建粒子系统",
            "code": [
                "./js/pcs.js"
            ],
            "renderer": null,
        },
        //矢量场
        "field": {
            "desc": "构建矢量场",
            "code": [
                "./js/field.js"
            ],
            "renderer": null,
        }
    }
}
