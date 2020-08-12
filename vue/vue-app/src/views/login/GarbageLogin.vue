<template>
  <div :style="{ height: bodyHeight }" class="LoginModel" v-loading="loading"></div>
</template>

<script>
import CryptoJS from 'crypto-js'

export default {
  data() {
    return {
      userDetail: {},
      loading: true,
      bodyHeight: '500px',
      loginUser: {
        username: '',
        password: ''
      }
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
      this.$store.commit('setAppType', '2')
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
          let homeUrl = '/main/company/home'
          this.$store.commit('setHomeUrl', homeUrl) // 需要根据账号类型判断homeurl
          this.userDetail = resp.data
          if (this.userDetail.user.accountTypeDto.type != this.$dictionaries.userType.garbage) {
            if (window.jsCall) window.jsCall.reLogin()
          }
          await this.getProject()
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
    //获取项目信息,type==30,60
    async getProject() {
      let projectResp = await this.$http.get(
        `/carp/business/a/q/user/login/skip?type=${this.userDetail.user.accountTypeDto.type}&id=${this.userDetail.user.accountTypeDto.ancillaryId}`
      )
      if (projectResp.code == 0) {
        if (this.userDetail.user.accountTypeDto.type == this.$dictionaries.userType.project) {
          if (window.jsCall) window.jsCall.reLogin()
        } else {
          projectResp.data.garbgeId = projectResp.data.id
        }
        this.$store.commit('setProject', projectResp.data)
      } else {
        this.$dialog.alert({
          message: '获取消纳站信息失败:' + projectResp.message,
          confirmButtonColor: 'red'
        })
        //if (window.jsCall) window.jsCall.reLogin()
      }
      this.loginLoading = false
    }
  }
}
</script>

<style lang="less" scoped></style>
