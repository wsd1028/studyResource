import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  // base: '/web',
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/Login'),
      props: ({ query }) => {
        return {
          cdls: query.cdls
        }
      }
    }
  ]
})
