/****************************************
 * Name: 构建器
 * Date: 2022-07-05
 * Author: Ais
 * Project: Vision
 * Desc: 项目构建与打包
 * Version: 0.1
 * Update:
 *     [2022-07-06]: 添加启动参数来选择是否重新构建index.js(索引)文件 
****************************************/

const fs = require("fs");
const path = require("path");
const builder_conf = require("./builder.config");
const webpack = require("webpack");
const webpack_conf = require("./webpack.config");
webpack_conf.entry = builder_conf.module_index_path

//模块索引构建器
const module_index_builder = function(module_dir, module_index=Array()) {
    let module_files = fs.readdirSync(module_dir);
    for(let i=0, end=module_files.length; i<end; i++) {
        let module_path = `${module_dir}/${module_files[i]}`;
        if(fs.statSync(module_path).isFile()) {
            module_index.push([path.parse(module_path).name, module_path])
        } else {
            module_index_builder(module_path, module_index);
        }
    }
    return module_index;
}

//构建模式
let BUILD_MODE = process.argv[2] || "build";
//构建索引文件
if(BUILD_MODE == "build") {
    fs.open(builder_conf.module_index_path, "w", function(err, fd) {
        if(err) {
            console.error(`[builder]: open index.js failed`)
            throw err;
        }
        //解析模块源码路径
        let module_src_path = path.join(__dirname, builder_conf.module_src_path).replace(/\\/g, "/");
        //解析模块索引
        let module_index = module_index_builder(module_src_path);
        //构建模块索引导出代码
        let module_index_code = '';
        for(let i=0, end=module_index.length; i<end; i++) {
            module_index_code += `module.exports["${module_index[i][0]}"] = require("${module_index[i][1]}");\n`
        }
        //生成索引文件
        fs.write(fd, module_index_code, function(err, bytesWritten, buffer) {
            if(err) {
                console.error("[builder]: index.js build failed");
                throw err;
            } 
            console.log("[builder]: index.js build success");
            //webpack构建
            webpack(webpack_conf, function(err, stats){
                if(err) {
                    throw err;
                } 
                console.log("[builder]: webpack build success");
            });
        });
    });
} 
//从现有索引文件进行构建
else if(BUILD_MODE == "update") {
    //webpack构建
    webpack(webpack_conf, function(err, stats){
        if(err) {
            throw err;
        } 
        console.log("[builder]: webpack build success");
    });
} else {
    console.error(`unsupport BUILD_MODE(${BUILD_MODE})`);
}

