import axios from 'axios'
import store from './store'

// 创建一个axios实例
const service = axios.create({
  // 请求超时时间
  //timeout: 5000
})

// 添加请求拦截器
service.interceptors.request.use(
  config => {
    if (store.state.user.token && config.url.includes('/carp')) {
      // 添加token
      config.headers.token = store.state.user.token
      // 关闭请求缓存
      config.headers['Cache-Control'] = 'no-cache'
      config.headers['Pragma'] = 'no-cache'
    }
    return config
  },
  err => {
    console.log(err)
  }
)

service.interceptors.response.use(
  response => {
    if (response.status == 200) {
      const data = response.data
      if ([-1, 1011].includes(data.code)) {
        store.commit('clearToken')
        store.commit('clearUserInfo')
        //跳转到login页面
        location.href = '/login'
      }

      return data
    }
    return response
  },
  err => console.log(err)
)

export default service
