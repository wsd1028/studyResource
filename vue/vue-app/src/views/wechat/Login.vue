<template>
  <div :style="{ height: bodyHeight }" class="we_chat" v-loading="loading"></div>
</template>

<script>
export default {
  data() {
    return {
      bodyHeight: '500px',
      loading: false
    }
  },
  async mounted() {
    this.bodyHeight = document.documentElement.clientHeight + 'px'
  },
  methods: {
    //通过经纬度查询地址
    getAddress(location) {
      return this.$addJsonP('http://api.map.baidu.com/reverse_geocoding/v3/', {
        params: {
          ak: this.$dictionaries.ak,
          output: 'json',
          location: `${location.lat},${location.lng}`
        }
      })
    },
    //点击登陆
    async login() {
      this.loading = true
      let openId = this.$until.getQueryString('openId')
      let resp = await this.$http.get(`/carp/auth/k/q/weChat/login?openId=${openId}`)
      if (resp.code == 0) {
        this.$store.commit('setToken', resp.data.token) //设置token
        this.$store.commit('setUser', resp.data.user) //保存用户信息到store
        let homeUrl = ''
        //根据类型判断进入的首页
        switch (resp.data.user.accountTypeDto.type) {
          case this.$dictionaries.userType.project:
            homeUrl = '/main/company/home' //企业
            break
          case this.$dictionaries.userType.government:
            homeUrl = '/main/government/home' //政府
            break
          case this.$dictionaries.userType.garbage:
            homeUrl = '/main/company/home' //消纳站
            break
          default:
            homeUrl = '/wechat/problemReportCreat' //游客模式
        }
        this.$store.commit('setHomeUrl', homeUrl) // 需要根据账号类型判断homeurl
        this.userDetail = resp.data
        if (
          this.userDetail.user.accountTypeDto.type == this.$dictionaries.userType.project ||
          this.userDetail.user.accountTypeDto.type == this.$dictionaries.userType.garbage
        ) {
          await this.getProject()
        }
        this.$router.replace({
          path: homeUrl
        })
      } else {
        var myCity = new BMap.LocalCity()
        myCity.get(async res => {
          let addressRes = await this.getAddress(res.center)
          let areacode = addressRes.addressComponent.adcode
        })
        if (areacode.includes('5115')) {
          this.$router.replace({
            path: '/wechat/problemReportCreat'
          })
        } else {
          this.$router.replace({
            path: '/error'
          })
        }
      }
    },
    //获取项目信息,type==30,60
    async getProject() {
      let projectResp = await this.$http.get(
        `/carp/business/a/q/user/login/skip?type=${this.userDetail.user.accountTypeDto.type}&id=${this.userDetail.user.accountTypeDto.ancillaryId}`
      )
      if (projectResp.code == 0) {
        if (this.userDetail.user.accountTypeDto.type == this.$dictionaries.userType.project) {
          projectResp.data.projectId = projectResp.data.id
        } else {
          projectResp.data.garbgeId = projectResp.data.id
        }
        this.$store.commit('setProject', projectResp.data)
      } else {
        this.$dialog.alert({
          message: '获取项目信息失败:' + projectResp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
