import Vue from 'vue'
import Vuex from 'vuex'
import tab from './tab'
import user from './user'
import config from './config'
import agora from './agora'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    tab,
    user,
    config,
    agora
  }
})
