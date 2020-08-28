/* *
 * 页面刷新时执行一些不需要多次进行的操作
 * */
// vuex
let store = null
import request from '@/config'
import qs from 'qs'
import { Message } from 'element-ui'
import WS from '@/libs/WebSocket'

export default function(Vue, options) {
  store = options.store
  // 根据顺序执行方法池中的所有方法
  let methods = getMethods()
  Object.keys(methods).forEach(key => {
    methods[key](Vue, options)
  })
}

function getMethods() {
  /* *
   * 存放方法对象
   * */
  return {
    /* *
     * 地区选择器所需地区树获取并绑定到$customAreaTree
     * 为vue原型链绑定一个根据地区id/code查询当前地区下地区树的方法$getAreaTree
     * * */
    getAreaTree(Vue, options) {
      request.get('/carp/business/a/q/area/leading/tree').then(({ code, data }) => {
        if (code === 0) {
          Vue.prototype.$customAreaTree = data
        } else {
          Vue.prototype.$customAreaTree = []
          Message.error('地区树请求失败')
        }
        options.complete()
      })

      /* *
       * 通过地区id或code获取地区信息对象
       * param paramId: 地区id
       * * */
      let getAreaTree = (code, callback, areas) => {
        let isFound = false
        areas = areas || Vue.prototype.$customAreaTree || []
        for (let i = 0; i < areas.length; i++) {
          if ([areas[i].id, areas[i].code].includes(code)) {
            callback(areas[i])
            isFound = true
            break
          } else {
            if (areas[i].nodes && areas[i].nodes.length) {
              if (getAreaTree(code, callback, areas[i].nodes)) {
                break
              }
            }
          }
        }
        return isFound
      }
      // 将该方法绑定到vue原型链
      Vue.prototype.$getAreaTree = getAreaTree
    },

    /* *
     * 为vue原型链绑定全屏切换事件
     * @param el:dom节点
     * 绑定法法 FULLSCREEN
     * * */
    bindFullScreen(Vue) {
      // 浏览器全屏方法兼容数组
      let fullScreen = ['requestFullscreen', 'mozRequestFullScreen', 'msRequestFullscreen', 'webkitRequestFullscreen']
      // 退出全屏方法兼容数组
      let exitFullScreen = ['exitFullscreen', 'msExitFullscreen', 'mozCancelFullScreen', 'webkitExitFullscreen']
      // 判断当前全屏元素方法兼容数组
      let fullscreenElement = ['fullscreenElement', 'webkitFullscreenElement', 'msFullscreenElement', 'mozFullscreenElement']
      // 绑定全屏方法到Vue原型链
      Vue.prototype.FULLSCREEN = function(el) {
        // 全屏动作,1:打开全屏,0:退出全屏
        let doFlag = 1
        // 查看当前全屏显示的节点是否是传递进来的节点
        fullscreenElement.every(i => {
          if (document[i] !== undefined) {
            if (document[i] === el) doFlag = 0
          } else return true
        })
        // 打开全屏
        if (doFlag) {
          fullScreen.every(i => {
            if (el[i] !== undefined) {
              el[i]()
            } else return true
          })
        }
        // 退出全屏
        else {
          exitFullScreen.every(i => {
            if (document[i] !== undefined) {
              document[i]()
            } else return true
          })
        }
      }
    },

    /* *
     * json转FormData
     * @param: json:json数据
     * 绑定方法:$ToFormData
     * * */
    JSONToFormData(Vue) {
      Vue.prototype.$ToFormData = function(params) {
        let formData = new FormData()
        Object.keys(params).forEach(key => {
          formData.append(key, params[key])
        })
        return formData
      }
    },

    /* *
     * 文件地址转类型
     * @param url:文件地址
     * 绑定方法:$urlConvertType
     * * */
    urlConvertType(Vue) {
      Vue.prototype.$urlConvertType = url => {
        let type = 'file'
        // 图片格式验证
        ;[/bmp/i, /jpg/i, /jpeg/i, /png/i, /gif/i, /jfif/i].every(item => {
          if (item.test(url)) {
            type = 'image'
            return false
          } else {
            return true
          }
        })
        // 视频/音频格式验证
        ;[/avi/i, /mov/i, /mpg/i, /mpeg/i, /mpe/i, /dat/i, /vob/i, /asf/i, /3gp/i, /mp4/i, /wmv/i, /rm/i, /rmvb/i, /flv/i, /mkv/i, /mp3/i].every(item => {
          if (item.test(url)) {
            type = 'video'
            return false
          } else {
            return true
          }
        })
        return type
      }
    },

    /* *
     * 获取当前登录用户类型
     * 绑定类型到Vue原型链:$userType
     * * */
    getUserType(Vue) {
      Vue.prototype.$userType = store.state.user.userInfo.accountTypeDto.type

      Message //仅过eslint未定义验证,无其他作用,可删除

      /* // 获取用户id并判断是否是有效id,无效则直接退出当前方法
      const userId = store.state.user.userInfo.id
      if (!userId) return

      // 默认项目
      Vue.prototype.$userType = -1

      // 根据用户id获取当前用户绑定的角色数组
      request.get(`/carp/auth/a/q/account_role/${userId}`).then(({ code, data, message }) => {
        if (code === 0) {
          const roles = store.state.config.roles
          data.forEach(({ roleId }) => {
            roles.forEach(item => {
              if (item.id == roleId) {
                Vue.prototype.$userType = item.code
              }
            })
          })
        } else {
          Message.error('获取权限信息失败: ' + message)
        }
      }) */
    },

    /* *
     * 自定义权限验证
     * @param uri:权限值
     * 绑定方法:$permission
     * * */
    permission(Vue) {
      Vue.prototype.$permission = uri => {
        return request.post(
          '/carp/auth/k/q/hasPermission',
          qs.stringify(
            {
              permissions: [uri],
              logical: 'or'
            },
            { arrayFormat: 'repeat' }
          )
        )
      }
    },

    /* *
     * 绑定二次封装的WebSocket
     * * */
    webSocket(Vue) {
      Vue.prototype.$ws = WS
    }
  }
}
