<template>
  <div class="Password">
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="修改密码">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <div class="update" style="marginTop:20px">
      <van-field label="原密码" placeholder="请输入原密码" type="password" v-model="oldPassword" />
      <van-field label="新密码" placeholder="请输入新密码" type="password" v-model="newPassword" />
      <van-field label="确认密码" placeholder="请再次输入新密码" type="password" v-model="newPassword2" />
    </div>
    <van-button :disabled="!oldPassword || !newPassword || !newPassword2" @click="update" block style="marginTop:30px" type="info">保存</van-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      newPassword2: ''
    }
  },
  mounted() {},
  components: {},
  methods: {
    //退出登录状态
    async loginOut() {
      let resp = await this.$http.get('/carp/auth/k/q/logout')
      if (resp.code == 0) {
        this.$store.commit('clearSession')
        if (window.jsCall) window.jsCall.reLogin()
        this.$router.replace({
          name: 'login',
          params: {}
        })
      } else {
        this.$dialog.alert({
          message: '退出登录失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    async update() {
      let url = '/carp/auth/k/q/account/pwd'
      if (this.newPassword == this.newPassword2) {
        let user = this.$store.state.user.user
        let updateData = {
          accountId: user.id,
          password: this.newPassword,
          oldPassword: this.oldPassword
        }
        let resp = await this.$http.post(url, this.$qs.stringify(updateData))
        if (resp.code == 0) {
          this.loginOut()
        } else {
          this.$dialog.alert({
            message: '修改密码失败:' + resp.message,
            confirmButtonColor: 'red'
          })
        }
      } else {
        this.$toast('两次密码不统一')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.Password {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  header {
    background-color: #fff;
    .nav {
      text-align: left;
      line-height: 42px;
      i {
        color: #666;
      }
      .van-nav-bar__title {
        font-weight: 800;
        font-size: 18px !important;
      }
    }
  }
  .update {
    p {
      color: #999;
      margin-bottom: 10px;
      margin-left: 16px;
    }
  }
}
</style>
