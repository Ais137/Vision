/****************************************
 * Name: Views Templates Builder
 * Date: 2022-08-27
 * Author: Ais
 * Project: Vision
 * Desc: Views模板生成器
 * Version: 0.2
 * Update:
    * [0.1 -> 0.2]: 添加渲染器(renderer)代码块 
****************************************/

const fs = require("fs");
const path = require("path");

//导入模板配置文件
const TPS_CONFS = require("./tpBuilder.confs").TPS_CONFS;

//Views模板生成器
class TemplatesBuilder {

    constructor(tps_confs) {
        //模板配置数据
        this.TPS_CONFS = tps_confs;
    }

    //运行
    run(args) {
        //解析参数
        let cmd = args[2];
        if(cmd[0] != "-") {
            this.build(cmd, args[3], (args[4] == "-f") ? true : false);
        } else {
            switch(cmd) {
                case "-list": {
                    this.list(); break;
                }
                default: {
                    console.error(`[ERR]: unkown cmd(${cmd})`);
                }
            }
        }
    }

    /*----------------------------------------
    @func: 构建模板
    @desc: 根据参数生成指定模板
    @params: 
        * tp_title(str): 模板文件名(模板内标题)
        * tp_id(str): 模板id
        * cover(bool): 覆盖标记，是否强制覆盖同名文件
    @exp: 
        * npm run vtp -- test(文件名) grid(模板id) -f
    ----------------------------------------*/
    build(tp_title, tp_id="base", cover=false) {
        //校验模板是否存在
        if(!(tp_id in this.TPS_CONFS.templates)) {
            throw new Error(`template(${tp_id}) is not exists`);
        }
        //模板配置
        let tp_confs = {
            //模板文件生成路径
            "buildpath": path.join(process.env.INIT_CWD, `${tp_title}.html`),
            //vision模块相对路径
            "vmpath": path.relative(process.env.INIT_CWD, path.join(__dirname, this.TPS_CONFS.vmpath)).replace(/\\/g, "/"),
            //基础模板路径
            "basepath": path.join(__dirname, this.TPS_CONFS.base.path),
            //模板代码
            "code": this.TPS_CONFS.templates[tp_id].code || [],
            //渲染器代码
            "renderer": "renderer" in this.TPS_CONFS.templates[tp_id] ? this.TPS_CONFS.templates[tp_id].renderer : this.TPS_CONFS.base.renderer,
            //模板样式表
            "css": [this.TPS_CONFS.base.css, ...(this.TPS_CONFS.templates[tp_id].css || [])],
        }
        //检查模板文件是否存在
        if(!cover) {
            try {
                fs.accessSync(tp_confs.buildpath);
                console.error(`[ERR]: template_file(${tp_confs.buildpath}) is exists`);
                return false;
            } catch (error) {}
        }
        //加载基础模板文件
        let template = fs.readFileSync(tp_confs.basepath).toString();
        //加载模板代码
        let tp_code = "";
        for(let i=0; i<tp_confs.code.length; i++) {
            tp_code += fs.readFileSync(path.join(__dirname, tp_confs.code[i])).toString();
        }
        //加载渲染器代码
        let tp_renderer = "";
        if(tp_confs.renderer) {
            tp_renderer = fs.readFileSync(path.join(__dirname, tp_confs.renderer)).toString();
        }
        //加载模板样式表
        let tp_css = "";
        for(let i=0; i<tp_confs.css.length; i++) {
            tp_css += fs.readFileSync(path.join(__dirname, tp_confs.css[i])).toString();
        }
        tp_css = "<style>" + tp_css + "\n</style>";
        //填充模板
        template = template.replace(/#vmp#/g, tp_confs.vmpath)
        template = template.replace(/#title#/g, tp_title);
        template = template.replace(/#css#/, tp_css);
        template = template.replace("//#code#", tp_code);
        template = template.replace("//#renderer#", tp_renderer);
        //导出模板
        fs.writeFileSync(tp_confs.buildpath, template);
        return true;
    }

    /*----------------------------------------
    @func: 展示模板
    @desc: 显示现有模板列表
    @exp: 
        * npm run vtp -- -list
    ----------------------------------------*/
    list() {
        console.log("--------------------------------------------------");
        console.log("[views templates list]: ");
        for(let tp in this.TPS_CONFS.templates) {
            console.log(`  * ${tp}: ${this.TPS_CONFS.templates[tp].desc}`);
        }
        console.log("--------------------------------------------------");
    }

}


//运行
new TemplatesBuilder(TPS_CONFS).run(process.argv);
