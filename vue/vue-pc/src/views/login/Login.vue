<template>
  <div class="container-main" v-if="!cdls" v-loading="loading">
    <!-- 平台logo -->
    <div class="logo">
      <img src="../../assets/images/login/logo.png" />
    </div>
    <!-- 登录框 -->
    <div class="border-bg">
      <!-- 登录框 -->
      <div class="container-login">
        <div class="title">
          <span>欢迎登录</span>
        </div>
        <div class="wrap-username" :err="errName">
          <i class="icon el-icon-user"></i>
          <input type="text" v-model="form.username" placeholder="请输入用户名" @keyup="nameVerify" @keyup.enter="login" />
        </div>
        <div class="wrap-password" :err="errPw">
          <i class="icon el-icon-lock"></i>
          <input type="password" v-model="form.password" placeholder="请输入密码" @keyup="pwVerify" @keyup.enter="login" autocomplete="new-password" />
        </div>
        <div class="verify-bt" @click="verifyShow = !validate" :class="{ success: validate }">
          <span></span>
        </div>
        <div class="verify-wrap" v-show="verifyShow">
          <slide-verify
            :l="42"
            :r="10"
            :w="310"
            :h="155"
            slider-text="向右滑动"
            @success="
              validate = true
              verifyShow = false
            "
            @fail="validate = false"
            @refresh="() => {}"
            :imgs="[
              'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=186602880,1005592543&fm=26&gp=0.jpg',
              'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=1540109528,3311100791&fm=26&gp=0.jpg',
              'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2654041071,937083517&fm=26&gp=0.jpg',
              'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=2845937221,3024056832&fm=26&gp=0.jpg'
            ]"
          ></slide-verify>
        </div>
        <div class="wrap-bt">
          <a class="login-bt" @click="login">
            <span>登录</span>
          </a>
        </div>
      </div>
    </div>
    <!-- 版权附属 -->
    <div class="copyright">
      <span>主办单位:宜宾市住房和城乡建设局</span>
      <span>建设维护单位:成都市磊数科技有限公司</span>
    </div>
  </div>
</template>
<script>
const key = 'FB32D61111CBE2D846E7A12209322CF5FB32D671D6CB874012E7A12209322CF5'
import AESEncryption from 'aes-crypto'
const encode = new AESEncryption()
window.loginHex = obj => {
  return encode.encryption(JSON.stringify(obj), key)
}
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },

      verifyShow: false,
      validate: false,

      // 错误信息
      errName: '',
      errPw: '',

      // 加载动画
      loading: false
    }
  },
  props: {
    cdls: String
  },
  methods: {
    login() {
      // 验证码
      if (!this.validate && !this.cdls) {
        this.$message.error('请填写验证码')
        return
      }

      // 用户名验证
      if (!/^\w{2,11}$/.test(this.form.username) && !this.cdls) {
        this.errName = '用户名填写不正确'
        return
      }
      if (!/^[\w\-.*]{6,16}$/.test(this.form.password) && !this.cdls) {
        this.errPw = '密码填写不正确'
        return
      }

      this.loading = true

      // 发送登录请求
      let params = this.form
      this.$http
        .get('/carp/auth/k/q/login', {
          params
        })
        .catch(err => {
          if (err) {
            // 关闭加载动画
            this.loading = false
            return { code: 500, data: null }
          }
        })
        .then(({ code, data, message }) => {
          // 登录请求失败
          if (code !== 0) {
            this.loading = false
            this.errName = message
            this.$message.error(message)
            return
          }

          // 存储token和用户信息
          this.$store.commit('setToken', data.token)
          this.$store.commit('setUserInfo', JSON.stringify(data.user))

          // 跳转到首页
          this.$message.success('登录成功')

          // 刷新页面并跳转到首页
          location.href = '/'

          // 关闭加载动画
          this.loading = false
        })
    },

    /**
     * 表单格式矫正
     **/
    nameVerify() {
      this.form.username = this.form.username.replace(/[^\w]/gi, '')
      if (!/^\w{2,11}$/.test(this.form.username)) {
        this.errName = '用户名只能是3-11位的英文或数字'
      } else {
        this.errName = ''
      }
    },
    pwVerify() {
      this.form.password = this.form.password.replace(/[^\w\-.*]/gi, '')
      if (!/^[\w\-.*]{6,16}$/.test(this.form.password)) {
        this.errPw = '密码必须是6-16位的英文数字或-.*符号'
      } else {
        this.errPw = ''
      }
    }
  },
  created() {
    // 携带登录信息则直接执行登录操作
    if (this.cdls) {
      let user = JSON.parse(encode.decryption(this.cdls, key))
      this.form.username = user.a
      this.form.password = user.b
      this.login()
    }
  }
}
</script>
<style lang="less" scoped>
@import './style/index.less';
</style>
<style lang="less">
.pic-verify {
  height: 0.46rem;
  #canvas {
    display: block;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>
