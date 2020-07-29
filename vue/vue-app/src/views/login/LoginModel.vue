<template>
  <div :style="{ height: bodyHeight }" class="LoginModel" v-loading="loading"></div>
</template>

<script>
import CryptoJS from 'crypto-js'

export default {
  data() {
    return {
      loading: true,
      bodyHeight: '500px',
      loginUser: {
        username: '',
        password: ''
      },
      userDetail: {}
    }
  },
  created() {
    //this.bodyHeight = document.documentElement.clientHeight + 'px'
  },
  async mounted() {
    this.$store.commit('clearSession')
    try {
      let href = unescape(window.location.href)
      let androidData = this.$until.getQueryVariable(href)
      this.loginUser.username = this.$until.decrypt(androidData.xm, '')
      this.loginUser.password = this.$until.decrypt(androidData.mm, '')
      this.$store.commit('setAppType', '1')
      await this.login()
    } catch (err) {
      this.$dialog.alert({
        message: '登录失败,账号/密码有错误',
        confirmButtonColor: 'red'
      })
      if (window.jsCall) window.jsCall.reLogin()
    }
  },
  methods: {
    //点击登陆
    async login() {
      if (this.loginUser.password && this.loginUser.username) {
        let url = `/carp/auth/k/q/login?password=${this.loginUser.password}&username=${this.loginUser.username}`
        let resp = await this.$http.get(url)
        if (resp.code == 0) {
          this.$store.commit('setToken', resp.data.token) //设置token
          this.$store.commit('setUser', resp.data.user) //保存用户信息到store
          if (window.jsCall) window.jsCall.setToken(resp.data.token)
          let homeUrl = ''
          //根据类型判断进入的首页
          switch (resp.data.user.accountTypeDto.type) {
            case this.$dictionaries.userType.project:
              homeUrl = '/huigong/company/home' //企业
              break
            case this.$dictionaries.userType.government:
              homeUrl = '/huigong/government/home' //政府
              break
            case this.$dictionaries.userType.garbage:
              homeUrl = '/huigong/company/home' //消纳站
              break
            default:
              homeUrl = '/home/company/problemReport' //游客模式
          }
          this.$store.commit('setHomeUrl', homeUrl) // 需要根据账号类型判断homeurl
          this.userDetail = resp.data
          if (this.userDetail.user.accountTypeDto.type == this.$dictionaries.userType.project) {
            await this.getProject()
          } else {
            //给安卓返回工作台菜单
            switch (resp.data.user.accountTypeDto.type) {
              case this.$dictionaries.userType.government:
                if (window.jsCall) window.jsCall.setWorkMenu(JSON.stringify(this.$dictionaries.governmentMenu))
                break
              default:
                if (window.jsCall) window.jsCall.setWorkMenu(JSON.stringify(this.$dictionaries.visitorMenu))
            }
          }
          this.$router.replace({
            path: homeUrl
          })
        } else {
          this.$dialog.alert({
            message: '登录失败:' + resp.message,
            confirmButtonColor: 'red'
          })
          if (window.jsCall) window.jsCall.reLogin()
        }
      } else {
        this.$toast('请输入账号/密码')
      }
    },
    //得到项目详情,type==30,60
    async getProject() {
      let projectId = this.$until.getQueryString('projectId')
      if (projectId) {
        let resp = await this.$http.get('/carp/business/k/s/project/' + projectId)
        if (resp.code == 0) {
          resp.data.projectId = resp.data.id
          if (window.jsCall) window.jsCall.setWorkMenu(JSON.stringify(this.$dictionaries.projectMenu))
          this.$store.commit('setProject', resp.data)
        } else {
          this.$dialog.alert({
            message: '获取项目信息失败:' + resp.message,
            confirmButtonColor: 'red'
          })
        }
      }
    }
  }
}
</script>

<style lang="less" scoped></style>
