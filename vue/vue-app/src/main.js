import Vue from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'
import Vant from 'vant'
import 'vant/lib/index.css'
import axios from '@/axios'
import qs from 'qs'
import moment from 'moment'
import echarts from 'echarts'
import { Dialog } from 'vant'
import VueTouch from 'vue-touch'
import { until } from './assets/js/until'
import modelLogin from './assets/js/modelLogin'
import { dictionaries } from './assets/js/dictionaries'
import BaiduMap from 'vue-baidu-map'
import './assets/iconfont/iconfont.css'
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import MyImage from '@/components/MyImage.vue'
import MyTitle from '@/components/MyTitle.vue'
import vueEsign from 'vue-esign'
Vue.use(vueEsign)
Vue.component('MyImage', MyImage)
Vue.component('MyTitle', MyTitle)
Vue.use(VideoPlayer)
Vue.use(BaiduMap, {
  ak: dictionaries.ak
})
Vue.use(Vant)
Vue.use(ElementUI)
Vue.use(VueTouch, { name: 'v-touch' })

Dialog.setDefaultOptions({
  closeOnPopstate: true
})
Vue.prototype.$dialog = Dialog
Vue.prototype.$http = axios
Vue.prototype.$moment = moment
Vue.prototype.$addJsonP = until.addJsonP
Vue.prototype.$echarts = echarts
Vue.prototype.$until = until

Vue.prototype.$dictionaries = dictionaries
Vue.prototype.$debounce = until.debounce
Vue.prototype.$qs = qs
Vue.config.productionTip = false
// require('./mock/mock.js')
router.beforeEach(async (to, from, next) => {
  window.scrollTo(0, 0)
  //根据路由处理底部tab的激活状态
  let activeTab = store.state.user.activeTab
  switch (to.name) {
    case 'company-home':
      activeTab = 0
      break
    case 'government-home':
      activeTab = 0
      break
    case 'company-work':
      activeTab = 1
      break
    case 'government-work':
      activeTab = 1
      break
    case 'visitor-work':
      activeTab = 1
      break
    case 'mine':
      activeTab = 2
      break
  }
  store.commit('setActiveTab', activeTab)
  store.commit('fulshHomeUrl')
  //  防止刷新后vuex里丢失user
  if (JSON.stringify(store.state.user.user) == '{}') {
    store.commit('getUser')
  }
  //  防止刷新后vuex里丢失AppType
  if (!store.state.user.AppType) {
    store.commit('getAppType')
  }
  //  防止刷新后vuex里丢失project
  if (JSON.stringify(store.state.user.project) == '{}') {
    store.commit('setCookProject')
  }
  //  防止刷新后vuex里丢失project
  if (!store.state.user.homeUrl) {
    store.commit('fulshHomeUrl')
  }
  //  防止刷新后vuex里丢失token
  let token = store.state.user.token
  if (!token) {
    store.commit('getToken')
    token = store.state.user.token
  }
  //  惠工云-工作台
  if (to.query.channel == 1 && to.name != 'loginModel') {
    //  惠工云进入
    await modelLogin()
    store.commit('setAppType', '1')
    if (to.query.workId) {
      //项目/政府进入流媒体视频(惠工云首页)
      store.commit('setWorkId', to.query.workId)
    }
    next(to.path)
  } else if (to.query.channel == 2) {
    //  惠工云-消纳站进入
    store.commit('setAppType', '2')
    next()
  } else if (to.name == 'error' || to.name == 'WechatLogin' || to.name == 'WechatProblemReportCreat') {
    store.commit('setAppType', '3')
    //微信公众号进入
    next()
  } else {
    //正常扬尘界面进入
    //  过滤登录页，防止死循环
    if (to.name == 'loginModel') {
      store.commit('setAppType', '1')
      next()
    } else if (!token && to.name !== 'login' && store.state.user.appType == 0) {
      store.commit('setAppType', '0')
      next({ name: 'login' })
    } else {
      next()
    }
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
