import promise from 'es6-promise'
promise.polyfill()
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import qs from 'qs'
import Cookie from 'js-cookie'
// 全局配置
import ElementUI from 'element-ui'
import moment from 'moment'
import 'element-ui/lib/theme-chalk/index.css'
import http from '@/config'
import BaiduMap from 'vue-baidu-map'
import init from './init'
import directives from './directives'
import libs from './libs'

// 滑块验证码
import SlideVerify from 'vue-monoplasty-slide-verify'
Vue.use(SlideVerify)

// 百度地图
Vue.use(BaiduMap, {
  /* Visit http://lbsyun.baidu.com/apiconsole/key for details about app key. */
  ak: 'jF9pZ6IjP2m97QPUjDPcxGybCeACivaa'
})

// Element框架
Vue.use(ElementUI)

// Axios
Vue.prototype.$http = http

// qs
Vue.prototype.$qs = qs

// moment
Vue.prototype.$moment = moment

// Vue自定义库
Vue.use(libs)

// 自定义指令
Vue.use(directives)

// uuid
import { v4 as uuidv4 } from 'uuid'
Vue.prototype.uuid = uuidv4

Vue.config.productionTip = false

// 获取token
let token = Cookie.get('token')

// 验证是否为已登录状态,如未登录则跳转到登录页面
router.beforeEach((to, from, next) => {
  // 查看token是否存在并且过滤登录页防止死循环
  if (!token && !['login'].includes(to.name)) {
    next({ name: 'login' })
  } else {
    next()
  }
})

// 当前项目初始化操作
if (token) {
  // 获取用户信息
  store.commit('getUserInfo')
  // 获取token
  store.commit('getToken')
  Vue.use(init, {
    store,
    complete() {
      createVue()
    }
  })
} else {
  createVue()
}

// 创建vue实例
function createVue() {
  new Vue({
    router,
    store,
    render: h => h(App),
    created() {
      if (token) {
        // 添加路由菜单
        store.commit('addMenu', router)
        // 初始化声网
        store.commit('agoraInit')
      }
    },
    beforeDestroy() {
      // 销毁声网客户端
      store.commit('agoraDestroy')
    }
  }).$mount('#app')
}
