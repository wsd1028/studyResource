<template>
  <div class="container-main" v-loading="loading">
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
          <input type="password" v-model="form.password" placeholder="请输入密码" @keyup="pwVerify" @keyup.enter="login" />
        </div>
        <div class="wrap-verify">
          <div class="input-verify" :err="errCode">
            <input type="text" v-model="inputCode" placeholder="请输入验证码" @keyup="codeVerify" @keyup.enter="login" />
          </div>
          <div class="pic-verify" @click="makeIdentifyCode({ randomTypeLen: true })">
            <verify-code :identifyCode="identifyCode"></verify-code>
          </div>
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
import VerifyCode from '@/components/VerifyCode'
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      inputCode: '',
      makeCode: '',
      identifyCode: '',

      // 错误信息
      errCode: '',
      errName: '',
      errPw: '',

      // 加载动画
      loading: false
    }
  },
  craeted() {
    this.refreshCode()
  },
  mounted() {
    this.makeIdentifyCode({ randomTypeLen: true })
  },
  methods: {
    /**
     * 登录请求
     **/
    async login() {
      // 验证码
      if (!(this.inputCode === this.identifyCode)) {
        this.errCode = '验证码不正确'
        return
      }

      this.loading = true

      // 发送登录请求
      let params = this.form
      let res = await this.$http
        .get('/carp/auth/k/q/login', {
          params
        })
        .catch(() => ({ code: 500 }))

      // 登录请求失败
      if (res.code !== 0) {
        this.loading = false
        this.errName = res.message
        this.$message.error(res.message)
        return
      }

      // 存储token和用户信息
      this.$store.commit('setToken', res.data.token)
      this.$store.commit('setUserInfo', JSON.stringify(res.data.user))

      // 跳转到首页
      this.$message.success('登录成功')

      // 刷新页面并跳转到首页
      location.href = '/'

      // 关闭加载动画
      this.loading = false
    },

    /**
     * 表单格式矫正
     **/
    nameVerify() {
      this.form.username = this.form.username.replace(/[^\w]/gi, '')
    },
    pwVerify() {
      this.form.username = this.form.username.replace(/[^\w]/gi, '')
    },
    codeVerify() {
      this.inputCode = this.inputCode.substring(0, 4)
    },

    /**
     * 随机生成一个0~9之间的数
     */
    randomNum() {
      return Math.floor(Math.random() * 10)
    },

    /**
     * 随机生成一个字母
     * @param {boolean} isUupper 生成大写字母
     */
    randomAlphabet({ isUupper = false } = {}) {
      // a的Unicode值为97,z的Unicode值为123
      const alphabet = String.fromCharCode(Math.floor(Math.random() * 25) + 97)
      if (!isUupper) {
        return alphabet
      } else {
        return alphabet.toUpperCase()
      }
    },

    /**
     * 生成图片验证码
     * @param {number} length 图片验证码位数
     * @param {boolean} typeMix 数字和字母混合
     * @param {string} pureNumber 纯数字('number')或者字母('alphabet')
     * @param {boolean} randomTypeLen 随机生成类型个数组合
     * @param {boolean} capsLookMix 字母大小写混合
     * @param {number} numLength 混合类型下的数字个数
     * @param {number} uupperLength 大写字母的个数
     */
    makeIdentifyCode({
      length = 4,
      typeMix = true,
      pureNumber = 'alphabet',
      randomTypeLen = false,
      capsLookMix = false,
      numLength = 2,
      uupperLength = 1
    } = {}) {
      this.makeCode = ''
      // 数字和字母混合
      if (typeMix) {
        // 随机生成类型个数组合
        if (randomTypeLen) {
          // 字母大小写混合
          if (capsLookMix) {
            const numLength = Math.floor(Math.random() * length) + 1
            const uupperLength = numLength === length ? 0 : Math.floor(Math.random() * (length - numLength)) + 1
            for (let i = 0; i < numLength; i++) {
              this.makeCode += this.randomNum()
            }
            for (let i = 0; i < uupperLength; i++) {
              this.makeCode += this.randomAlphabet({ isUupper: true })
            }
            if (numLength + uupperLength < length) {
              for (let i = 0; i < length - numLength - uupperLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          } else {
            const numLength = Math.floor(Math.random() * length) + 1
            for (let i = 0; i < numLength; i++) {
              this.makeCode += this.randomNum()
            }
            if (numLength < length) {
              for (let i = 0; i < length - numLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          }
        } else {
          // 字母大小写混合
          if (capsLookMix) {
            const tempNumLength = numLength < 0 ? 2 : numLength > length ? 2 : numLength
            const tempUupperLength = uupperLength < 0 ? 1 : uupperLength > length - tempNumLength ? 1 : uupperLength
            for (let i = 0; i < tempNumLength; i++) {
              this.makeCode += this.randomNum()
            }
            for (let i = 0; i < tempUupperLength; i++) {
              this.makeCode += this.randomAlphabet({ isUupper: true })
            }
            if (tempNumLength + tempUupperLength < length) {
              for (let i = 0; i < length - tempNumLength - tempUupperLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          } else {
            const tempNumLength = numLength < 0 ? 2 : numLength > length ? 2 : numLength
            for (let i = 0; i < tempNumLength; i++) {
              this.makeCode += this.randomNum()
            }
            if (tempNumLength < length) {
              for (let i = 0; i < length - tempNumLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          }
        }
      } else {
        // 纯数字('number')
        if (pureNumber === 'number') {
          for (let i = 0; i < length; i++) {
            this.makeCode += this.randomNum()
          }
        }
        // 纯字母('alphabet')
        if (pureNumber === 'alphabet') {
          // 字母大小写混合
          if (capsLookMix) {
            const tempUupperLength = uupperLength < 0 ? 1 : uupperLength > length ? 1 : uupperLength
            for (let i = 0; i < tempUupperLength; i++) {
              this.makeCode += this.randomAlphabet({ isUupper: true })
            }
            if (tempUupperLength < length) {
              for (let i = 0; i < length - tempUupperLength; i++) {
                this.makeCode += this.randomAlphabet()
              }
            }
          } else {
            for (let i = 0; i < length; i++) {
              this.makeCode += this.randomAlphabet()
            }
          }
        }
      }
      this.shuffle(this.makeCode)
    },

    /**
     * 图片验证码随机排序
     * @param {string} str 图片验证码
     */
    shuffle(str) {
      this.identifyCode = [...str].sort(() => Math.random() - 0.5).join('')
    },

    /**
     * 更换图片验证码
     */
    refreshCode() {
      this.makeIdentifyCode({ randomTypeLen: true })
    }
  },
  components: {
    VerifyCode
  }
}
</script>
<style lang="less" scoped>
.container-main {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  background: url('../../assets/images/login/bg.jpg') no-repeat;
  background-size: cover;

  & > * {
    max-width: 82%;
  }

  .logo {
    padding-bottom: 0.48rem;
    width: 6.4rem;
    img {
      display: block;
      width: 100%;
    }
  }

  .border-bg {
    margin-bottom: 0.76rem;
    padding: 0.32rem 0.7rem;
    background: url('../../assets/images/login/border.png') no-repeat center;
    background-size: 100%;
    .container-login {
      overflow: hidden;
      box-sizing: border-box;
      padding: 0.22rem 0.6rem 0.32rem;
      display: flex;
      flex-flow: column nowrap;
      align-items: stretch;
      width: 5.62rem;
      background-color: rgba(5, 10, 42, 0.5);
      border: #4c74c4 0.02rem solid;
      border-radius: 0.1rem;
      box-shadow: inset 0rem 0rem 0.14rem 0.08rem rgba(66, 133, 244, 0.35);

      .title {
        text-align: center;
        font-size: 0.24rem;
        line-height: 0.24rem;
        color: white;
        margin: 0 0 0.22rem;
      }

      .wrap-username,
      .wrap-password,
      .input-verify,
      .login-bt {
        position: relative;
        overflow: hidden;
        border-radius: 0.06rem;
        margin-top: 0.22rem;
        padding: 0.08rem 0.16rem;
        background-color: #344e88;

        input {
          flex: auto;
          background-color: #344e88;
          border-width: 0;
          outline-width: 0;
          color: white;
          line-height: 0.32rem;
          font-size: 0.16rem;
          box-shadow: 0 0 0px 1000px #344e88 inset;

          &::placeholder {
            color: #ffffffaa;
          }

          &:-internal-autofill-selected {
            color: #ffffffaa !important;
          }
        }
      }

      .wrap-username,
      .wrap-password,
      .input-verify {
        box-sizing: border-box;
        display: flex;
        .icon {
          display: block;
          padding-right: 0.16rem;
          font-size: 0.24rem;
          line-height: 0.32rem;
          color: #b2c3d2;
        }
        &::after {
          content: attr(err);
          position: absolute;
          top: 50%;
          right: 0.2rem;
          transform: translateY(-50%);
          font-size: 0.14rem;
          color: red;
        }
      }

      .wrap-username {
        margin-top: 0;
      }

      .wrap-verify {
        display: flex;

        .input-verify {
          flex: 1;
          width: 0;
        }

        .pic-verify {
          overflow: hidden;
          flex: none;
          margin: 0.22rem 0 0 0.22rem;
          width: 1.35rem;
          border-radius: 0.06rem;
          background-color: #fff;
        }
      }

      .login-bt {
        margin-top: 0.34rem 0 0.32rem;
        display: flex;
        box-sizing: border-box;
        justify-content: center;
        align-items: center;
        border-width: 0;
        background: linear-gradient(180deg, #4186f4 0%, #4283f2 100%);
        box-shadow: #222222dd 0 0.02rem 0.02rem;
        color: white;
        line-height: 0.34rem;
        font-size: 0.18rem;
        cursor: pointer;
        user-select: none;

        &:active {
          box-shadow: inset 0 0 0.02rem 0 #222222dd;
        }
      }
    }
  }

  .copyright {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 0.36rem;
    display: inline-flex;
    justify-content: space-around;
    width: 5.64rem;
    span {
      font-size: 0.16rem;
      color: #fff;
    }
  }
}
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
