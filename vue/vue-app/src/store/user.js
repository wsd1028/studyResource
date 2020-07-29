import Cookie from 'js-cookie'
export default {
  state: {
    token: '',
    homeUrl: '',
    appType: '', //0独立app,1集成汇工云,2惠工云-消纳站2
    user: {},
    type: '', //0:系统管理员 10:公司内部 20:安装运维 30:项目人员(排放员) 40:银行 50:安监站(政府) 60:消纳站(消纳员) 70:运输公司
    project: {},
    activeTab: 0,
    paramsData: {}
  },
  mutations: {
    setAppType(state, val) {
      state.appType = val
      Cookie.set('appType', val)
    },
    getAppType(state) {
      state.appType = Cookie.get('appType')
    },
    setActiveTab(state, val) {
      state.activeTab = val
    },
    setParamsData(state, val) {
      state.paramsData = val
    },
    setCookProject(state) {
      if (Cookie.get('project')) {
        state.project = JSON.parse(Cookie.get('project'))
      }
    },
    setProject(state, val) {
      state.project = val
      Cookie.set('project', val)
    },
    clearProject(state, val) {
      state.project = {}
      Cookie.remove('project')
    },
    setUser(state, val) {
      state.user = val
      state.type = val.accountTypeDto.type
      Cookie.set('user', val)
    },
    getUser(state) {
      if (Cookie.get('user')) {
        state.user = JSON.parse(Cookie.get('user'))
        if (state.user) state.type = state.user.accountTypeDto.type
      }
    },
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
    setHomeUrl(state, val) {
      state.homeUrl = val
      Cookie.set('homeUrl', val)
    },
    fulshHomeUrl(state) {
      state.homeUrl = Cookie.get('homeUrl')
    },
    clearSession(state) {
      state.homeUrl = ''
      Cookie.remove('homeUrl')
      state.token = ''
      Cookie.remove('token')
      state.project = {}
      Cookie.remove('project')
      state.user = {}
      Cookie.remove('user')
    }
  },
  actions: {}
}
