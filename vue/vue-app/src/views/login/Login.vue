<template>
  <div :style="{ minHeight: bodyHeight }" class="Login">
    <header>
      <img alt class="logo" src="../../assets/image/yibin_logo.png" />
      <img alt class="text" src="../../assets/image/yibin_text.png" />
    </header>
    <div style="height:200px"></div>
    <div style="padding:0 50px">
      <van-field
        :disabled="loginLoading"
        @click-right-icon="$toast('你的用户名')"
        class="mo"
        clearable
        label
        left-icon="manager-o"
        placeholder="请输入用户名/手机号"
        required
        right-icon="question-o"
        style="color:#d1d6d7"
        v-model="loginUser.username"
      />
      <van-field
        :disabled="loginLoading"
        class="mo"
        clearable
        label
        left-icon="bag-o"
        placeholder="请输入密码"
        required
        style="color:#d1d6d7"
        type="password"
        v-model="loginUser.password"
      />
      <div class="sliding" id="sliding" v-show="!isLoginTow">
        <div class="slider" id="slider">
          <div class="label">向右滑动验证</div>
          <div class="track" id="track">
            <div class="bg-green" id="bg-green"></div>
          </div>
          <div class="button" id="btn">
            <div class="icon" id="icon"></div>
            <div class="spinner" id="spinner">
              <van-icon color="#07c160" name="checked" size="30" />
            </div>
          </div>
        </div>
      </div>
      <van-row>
        <van-col offset="2" span="20">
          <van-button :loading="loginLoading" @click="login" class="sub" loading-text="登录中..." type="info">登录</van-button>
        </van-col>
      </van-row>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginLoading: false,
      bodyHeight: '500px',
      isSliding: false,
      loginUser: {
        username: '',
        password: ''
      },
      userDetail: {},
      isLoginTow: false
    }
  },
  async created() {
    this.$store.commit('clearSession')

    try {
      let href = unescape(window.location.href)
      let androidData = this.$until.getQueryVariable(href)
      this.loginUser.username = this.$until.decrypt(androidData.xm, '')
      this.loginUser.password = this.$until.decrypt(androidData.mm, '')
      this.isSliding = true
      if (this.loginUser.username) this.isLoginTow = true
      await this.login()
    } catch {
      if (window.jsCall) window.jsCall.reLogin()
    }
  },
  mounted() {
    this.$store.commit('setAppType', '0')
    //this.bodyHeight = document.documentElement.clientHeight + 'px'
    this.slidingCheck(true)
  },
  methods: {
    //滑块验证
    slidingCheck(type) {
      var sliding = document.getElementById('sliding')
      var oBtn = document.getElementById('btn')
      var oW, oLeft
      var oSlider = document.getElementById('slider')
      var oTrack = document.getElementById('track')
      var oIcon = document.getElementById('icon')
      var oSpinner = document.getElementById('spinner')
      var bgGreen = document.getElementById('bg-green')
      var flag = 1
      var space = document.documentElement.clientWidth - sliding.offsetWidth
      oBtn.addEventListener(
        'touchstart',
        e => {
          if (flag == 1) {
            var touches = e.touches[0]
            oW = touches.clientX - oBtn.offsetLeft
            oBtn.className = 'button'
            oTrack.className = 'track'
          }
        },
        false
      )
      oBtn.addEventListener(
        'touchmove',
        e => {
          if (flag == 1) {
            var touches = e.touches[0]
            oLeft = touches.clientX - oW
            if (oLeft < 0) {
              oLeft = 0
            } else if (oLeft > document.documentElement.clientWidth - oBtn.offsetWidth - space) {
              oLeft = document.documentElement.clientWidth - oBtn.offsetWidth - space
              this.isSliding = true
            }
            oBtn.style.left = oLeft + 'px'
            oTrack.style.width = oLeft + 'px'
          }
        },
        false
      )

      oBtn.addEventListener(
        'touchend',
        () => {
          if (oLeft >= oSlider.clientWidth - oBtn.clientWidth) {
            oBtn.style.left = document.documentElement.clientWidth - oBtn.offsetWidth - 30
            oTrack.style.width = document.documentElement.clientWidth - oBtn.offsetWidth - 30
            oIcon.style.display = 'none'
            oSpinner.style.display = 'block'
            bgGreen.innerHTML = '验证成功'
            flag = 0
          } else {
            oBtn.style.left = 0
            oTrack.style.width = 0
          }
          oBtn.className = 'button-on'
          oTrack.className = 'track-on'
        },
        false
      )
    },
    //点击登陆
    async login() {
      try {
        //是否滑块验证
        if (this.isSliding || document.getElementById('bg-green').innerHTML == '验证成功') {
          if (this.loginUser.password && this.loginUser.username) {
            this.loginLoading = true
            let url = `/carp/auth/k/q/login?password=${this.loginUser.password}&username=${this.loginUser.username}`
            let resp = await this.$http.get(url)
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
                  homeUrl = '/main/visitor/work' //游客模式
              }
              this.$store.commit('setHomeUrl', homeUrl) // 需要根据账号类型判断homeurl
              this.userDetail = resp.data
              if (
                this.userDetail.user.accountTypeDto.type == this.$dictionaries.userType.project ||
                this.userDetail.user.accountTypeDto.type == this.$dictionaries.userType.garbage
              ) {
                await this.getProject()
              } else {
                this.loginLoading = false
              }

              let loginUser = {
                xm: '',
                mm: ''
              }
              loginUser.xm = this.$until.encrypt(this.loginUser.username, '')
              loginUser.mm = this.$until.encrypt(this.loginUser.password, '')
              if (window.jsCall) window.jsCall.setCache(JSON.stringify(loginUser))
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
          this.loginLoading = false
        } else {
          this.$toast('请进行验证')
        }
      } catch {
        this.loginLoading = false
        this.$dialog.alert({
          message: '登录失败',
          confirmButtonColor: 'red'
        })
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
      this.loginLoading = false
    }
  }
}
</script>

<style lang="less">
.Login {
  height: 100%;
  background: url('../../assets/image/yibin_bg.jpg') no-repeat;
  background-size: cover;
  .van-field__right-icon {
    color: rgb(209, 214, 215);
  }
  input::-webkit-input-placeholder {
    color: #d1d6d7 !important;
  }
  input,
  .van-field__control {
    color: #fff;
    background-color: transparent !important;
  }
  .van-cell:not(:last-child)::after {
    border: none;
  }
  header {
    position: relative;
    .logo {
      width: 100px;
      height: 100px;
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      top: 40px;
    }
    .text {
      width: 100px;
      position: absolute;
      margin: auto;
      left: 0;
      right: 0;
      top: 160px;
    }
  }
  .sub {
    width: 100%;
    border-radius: 20px;
  }
  .van-col--offset-2 {
    margin-left: 0;
  }
  .van-col--20 {
    width: 100%;
  }
  .mo {
    margin-top: 30px;
    margin-bottom: 20px;
    border-radius: 20px;
    background-color: rgba(255, 255, 255, 0.1);
    font-size: 18px;
    box-shadow: 0 0 5px rgb(47, 68, 108);
  }
  .sliding {
    position: relative;
    height: 34px;
    width: 100%;
    margin: 30px 0;
    border-radius: 4px;
    overflow: hidden;
    .slider {
      position: absolute;
      height: 34px;
      box-shadow: 0 0 5px rgb(47, 68, 108);
      background-color: #ddd;
      left: 0px;
      right: 0px;
    }

    .label {
      background: -webkit-gradient(
        linear,
        left top,
        right top,
        color-stop(0, #4d4d4d),
        color-stop(0.4, #4d4d4d),
        color-stop(0.5, white),
        color-stop(0.6, #4d4d4d),
        color-stop(1, #4d4d4d)
      );
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: slidetounlock 3s infinite;
      -webkit-text-size-adjust: none;
      line-height: 34px;
      height: 34px;
      text-align: center;
      font-size: 14px;
      width: 100%;
      color: #aaa;
    }

    @keyframes slidetounlock {
      0% {
        background-position: -200px 0;
      }

      100% {
        background-position: 200px 0;
      }
    }

    @-webkit-keyframes slidetounlock {
      0% {
        background-position: -200px 0;
      }

      100% {
        background-position: 200px 0;
      }
    }

    .button {
      position: absolute;
      left: 0;
      top: 0;
      width: 40px;
      height: 34px;
      background-color: #fff;
      transition: left 0s;
      -webkit-transition: left 0s;
    }

    .button-on {
      position: absolute;
      left: 0;
      top: 0;
      width: 40px;
      height: 34px;
      text-align: center;
      line-height: 34px;
      background-color: #fff;
      transition: left 1s;
      -webkit-transition: left 0.5s;
    }

    .track {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 0;
      overflow: hidden;
      transition: width 0s;
      -webkit-transition: width 0s;
    }

    .track-on {
      position: absolute;
      left: 0;
      top: 0;
      height: 100%;
      width: 0;
      overflow: hidden;
      transition: width 1s;
      -webkit-transition: width 0.5s;
    }

    .icon {
      width: 32px;
      height: 32px;
      position: relative;
      top: 1px;
      left: 5px;
      font-family: sans-serif;
    }

    .icon:before {
      content: '>>';
      color: #ccc;
      line-height: 32px;
    }

    .spinner {
      width: 40px;
      height: 32px;
      text-align: center;
      position: relative;
      display: none;
      i {
        line-height: 32px;
      }
    }

    @-webkit-keyframes bouncedelay {
      0%,
      80%,
      100% {
        -webkit-transform: scale(0);
      }

      40% {
        -webkit-transform: scale(1);
      }
    }

    @keyframes bouncedelay {
      0%,
      80%,
      100% {
        transform: scale(0);
        -webkit-transform: scale(0);
      }

      40% {
        transform: scale(1);
        -webkit-transform: scale(1);
      }
    }

    .bg-green {
      line-height: 34px;
      height: 34px;
      text-align: center;
      font-size: 14px;
      background-color: #1989fa;
      color: #fff;
    }

    .sub {
      width: calc(100% - 80px);
      margin-left: 40px;
      margin-top: 30px;
      height: 45px;
      background: #1989fa;
      color: #fff;
      outline: none;
      border: none;
      font-size: 16px;
    }
  }
}
</style>
