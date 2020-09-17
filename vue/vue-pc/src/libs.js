/* *
 * Vue原型链上添加js自定义方法
 * */
import CryptoJS from 'crypto-js'

export default Vue => {
  const methods = getMethods()
  Object.keys(methods).forEach(methodName => methods[methodName](Vue))
}

function getMethods() {
  return {
    /* *
     * 添加打印方法
     * * */
    addConsoleLog(Vue) {
      Vue.prototype.$log = window.console.log
    },

    /* *
     * axios添加jsonp请求
     * * */
    addJsonP(Vue) {
      Vue.prototype.$jsonp = window.$jsonp = (url, options) => {
        if (!url) {
          console.error('Axios.JSONP 至少需要一个url参数!')
          return
        }

        // 回调函数名称
        let index = parseInt(Math.random() * 99)
        let callbackName = 'cb' + index

        // 装载参数
        url = url + (/\?/.test(url) ? '&' : '?')

        options.params &&
          Object.keys(options.params).forEach(key => {
            url += `${key}=${options.params[key]}&`
          })

        url += `callback=${callbackName}`

        return new Promise(resolve => {
          let JSONP = document.createElement('script')
          JSONP.type = 'text/javascript'
          JSONP.src = url

          window[callbackName] = res => {
            if (res.status === 0) {
              resolve(
                Object.assign(res.result, {
                  code: 0,
                  message: '请求成功'
                })
              )
            } else {
              resolve(
                Object.assign(res, {
                  code: 0,
                  message: '请求成功'
                })
              )
            }
            document.getElementsByTagName('head')[0].removeChild(JSONP)
            delete window[callbackName]
          }
          document.getElementsByTagName('head')[0].appendChild(JSONP)
        })
      }
    },

    /* *
     * 函数防抖
     * * */
    addDebounce(Vue) {
      // 防抖(先执行)
      Vue.prototype.$debounceBefore = window.debounceBefore = (callback, wait) => {
        let timer = null
        return function(...params) {
          let result = null
          if (!timer) {
            result = callback(...params)
          }
          clearTimeout(timer)
          timer = setTimeout(() => {
            timer = null
          }, wait)
          return result
        }
      }

      // 防抖(后执行)
      Vue.prototype.$debounce = window.debounce = (callback, wait) => {
        let timeout = null
        return function(...params) {
          if (timeout !== null) clearTimeout(timeout)
          timeout = setTimeout(() => {
            return callback(...params)
          }, wait)
        }
      }
    },

    /* *
     * 混合图标和文字
     * @param icon: 图片实例
     * @param text: 文字
     * @return 图片示例
     * * */
    addMixIconText(Vue) {
      Vue.prototype.$mixIconText = (icon, ...textObjs) => {
        // 初始化画布
        let canvasEl = document.createElement('canvas')
        canvasEl.height = icon.height //高度
        canvasEl.width = icon.width //宽度
        // 绘制图标
        let canvas = canvasEl.getContext('2d')
        canvas.drawImage(icon, 0, 0)
        // 遍历文字
        textObjs.forEach(textObj => {
          canvas.fillStyle = textObj.color || '#000' //设置填充颜色为紫色
          canvas.font = textObj.font || '10px "微软雅黑"' //设置字体
          canvas.textBaseline = 'center' //设置字体底线对齐绘制基线
          canvas.textAlign = 'center' //设置字体对齐的方式
          // 上间距,左间距
          let offsetX = textObj.x == 'center' ? icon.width / 2 : textObj.x || 10
          let offsetY = textObj.y == 'center' ? icon.height / 2 : textObj.y || 10
          // 绘制文字
          canvas.fillText(textObj.text, offsetX, offsetY)
        })
        // 画布转图片
        let imgEl = document.createElement('img')
        imgEl.src = canvasEl.toDataURL('image/png')
        return imgEl
      }
    },

    /* *
     * 加密解密方法
     * 绑定方法 $aesEncrypt:加密 $aesDecrypt:解密
     * * */
    CryptoJSEnc(Vue) {
      const key = CryptoJS.enc.Utf8.parse('DF2284943CC77E7E1A5FA6A0DA8CA265')
      Vue.prototype.$aesEncrypt = word => {
        let srcs = CryptoJS.enc.Utf8.parse(word)
        let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
        return encrypted.toString()
      }
      Vue.prototype.$aesDecrypt = word => {
        let decrypt = CryptoJS.AES.decrypt(word, key, { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 })
        return CryptoJS.enc.Utf8.stringify(decrypt).toString()
      }
    }
  }
}
