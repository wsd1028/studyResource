import Cookie from 'js-cookie'
import $http from '@/config'
const userInfo = JSON.parse(Cookie.get('cdls') || '{}')
export default {
  state: {
    token: '',
    userInfo
  },
  mutations: {
    setToken(state, val) {
      state.token = val
      Cookie.set('token', val)
    },
    clearToken(state) {
      state.token = ''
      Cookie.remove('token')
    },
    getToken(state) {
      state.token = Cookie.get('token')
    },
    setUserInfo(state, val) {
      state.userInfo = val
      Cookie.set('cdls', val)
    },
    getUserInfo(state) {
      let userInfo = JSON.parse(Cookie.get('cdls') || '{}')
      state.userInfo = userInfo
      if (userInfo.id !== undefined) {
        $http.get(`/carp/auth/a/q/account/${userInfo.id}`).then(({ code, data }) => {
          if (code === 0) {
            state.userInfo = data
          }
        })
      }
    },
    clearUserInfo(state) {
      state.userInfo = {}
      Cookie.remove('cdls')
    }
  },
  actions: {}
}
