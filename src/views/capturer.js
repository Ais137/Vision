/**
 * @module
 * @desc     截图器: 截取Canvas图像后导出
 * @project  Vision
 * @author   Ais
 * @date     2022-09-06
 * @version  0.1.0
*/


class Capturer {

    /**
     * @classdesc 截图器: 截取Canvas图像后导出
     * 
     * @property { Canvas } canvasObj - canvas对象
     * @property { string } fileTitle - 导出文件标题，默认值为 *title* 标签内容
     * @property { number } fn - 导出文件计数器(int & fn>0)
     * @property { get/set } [captureKey='Q'] - 截图按键值
     * 
     * @param { Canvas } canvasObj - canvas对象
     * @param { string } fileTitle - 导出文件标题
     * 
     * @example
     * let captuer = new Capturer(canvas).capturing();
     */
    constructor(canvasObj, fileTitle) {
        this.canvasObj = canvasObj;
        this.fileTitle = fileTitle || document.getElementsByTagName("title")[0].innerText.replace(/\s+/g, "");
        /** @readonly */
        this.fn = 0;
        this._capture_keyCode = 'Q'.charCodeAt();
    }

    /** 获取截图按键值 */
    get captureKey() { return String.fromCharCode(this._capture_keyCode); }
    /** 设置截图按键值 */
    set captureKey(key) { this._capture_keyCode = key.charCodeAt(); return this; }

    /**
     * 监听截图事件: 将截图函数绑定到按键事件上
     */
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

    /**
     * 截图并导出当前canvas二进制数据
     * 
     * @param { string } fileName 导出文件名，默认值为 `${this.fileTitle}_${this.fn}`
     */
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
}


export { Capturer };