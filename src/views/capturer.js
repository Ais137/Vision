/****************************************
 * Name: capturer | 截图器
 * Date: 2022-09-06
 * Author: Ais
 * Project: Vision
 * Desc: 截取Canvas图像后导出
 * Version: 0.1
****************************************/


//截图器
class Capturer {

    /*----------------------------------------
    @class: 截图器
    @desc: 捕获canvas图像
    @property: 
        * canvasObj(Canvas): canvas对象
        * fileTitle(str): 导出文件标题
        * fn(number:>0): 导出文件计数器
        * _capture_keyCode(ascii-number): 截图按键值
    @method: 
        * capture: 截图，获取canvas画布图像
        * capturing: 绑定截图到指定按键
    @exp: 
        let captuer = new vision.capturer.Capturer(canvas).capturing();
    ----------------------------------------*/
    constructor(canvasObj, fileTitle) {
        //canvas对象
        this.canvasObj = canvasObj;
        //导出文件标题
        this.fileTitle = fileTitle || document.getElementsByTagName("title")[0].innerText.replace(/\s+/g, "");
        //导出文件计数器
        this.fn = 0;
        //截图按键值
        this._capture_keyCode = 'Q'.charCodeAt();
    }

    /*----------------------------------------
    @func: 获取/设置 截图按键
    ----------------------------------------*/
    get captureKey() { return String.fromCharCode(this._capture_keyCode); }
    set captureKey(key) { this._capture_keyCode = key.charCodeAt(); return this; }

    /*----------------------------------------
    @func: 截图
    @desc: 导出当前canvas二进制数据
    @params: 
        * fileName(str): 导出文件名(可选)
    ----------------------------------------*/
    capture(fileName) {
        //构建文件名
        fileName = fileName || `${this.fileTitle}_${this.fn++}`;
        //导出canvas二进制数据
        this.canvasObj.canvas.toBlob((blob) => {
            let temp_node = document.createElement('a');
            temp_node.style.display = 'none';
            temp_node.id = fileName;
            temp_node.href = window.URL.createObjectURL(blob);
            temp_node.download = `${fileName}.png`; 
            temp_node.click();
        })
    }

    /*----------------------------------------
    @func: 监听截图事件
    @desc: 将截图函数绑定到按键事件上
    ----------------------------------------*/
    capturing() {
        let _this = this;
        //绑定按键监听截图事件
        window.addEventListener("keydown", function(event) {
            if(event.keyCode == _this._capture_keyCode) {
                _this.capture();
            }
        }); 
        return this;
    }
}


module.exports.Capturer = Capturer;