import axios from 'axios'
import store from './store'
import router from './router'
// 创建一个axios实例
const service = axios.create({
  // 请求超时时间
  //timeout: 5000
})

// 添加请求拦截器
service.interceptors.request.use(
  config => {
    if (store.state.user.token && config.url.includes('/carp')) {
      config.headers.token = store.state.user.token
    }
    return config
  },
  err => {
    // console.log(err)
  }
)

service.interceptors.response.use(
  response => {
    if (response.status == 200) {
      const data = response.data
      if (data.code == -1) {
        //登录过期 需要重新登录 清空vuex的token和localstorage的token
        store.commit('clearSession')
        //跳转到login页面
        if (store.state.user.appType == '0') {
          router.replace({ path: '/login' })
        } else {
          if (window.jsCall) window.jsCall.reLogin()
        }
      }

      return data
    }
    return response
  },
  err => {
    //console.log(err)
  }
)

export default service
