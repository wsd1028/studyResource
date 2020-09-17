<template>
  <div class="Mine">
    <van-dialog :showConfirmButton="false" class="QRcode" closeOnClickOverlay v-model="showQRcode">
      <div class="top">
        <p>扫码下载惠工云App</p>
        <img alt src="../../assets/image/yibin_logo.png" />
      </div>
      <van-divider />
      <div class="bottom">
        <div class="iconBox">
          <van-icon class-prefix="iconfont" class="myIcon" name="weixin" />
          <p class="iconText">分享到微信</p>
        </div>
        <div class="iconBox">
          <van-icon class-prefix="iconfont" class="myIcon" name="pengyouquan" />
          <p class="iconText">分享到朋友圈</p>
        </div>
      </div>
    </van-dialog>

    <header>
      <h2 class="title">我的</h2>
      <!-- <van-icon @click="showQRcode = !showQRcode" class-prefix="iconfont" color="#373737" name="ico" size="26" style="fontWeight:600" /> -->
    </header>
    <van-cell is-link style="padding:40px 20px">
      <template #title>
        <div>
          <p style="fontSize:14px;marginBottom:20px">
            <span class="title" v-text="user.name"></span>
            <span style="marginLeft:10px;fontWeight:800" v-text="user.work"></span>
          </p>
          <span v-if="isCompany" v-text="user.project"></span>
          <span v-else v-text="user.organizationDto"></span>
        </div>
      </template>
    </van-cell>
    <div class="bottom">
      <van-cell class="item" is-link to="/mine/password">
        <template #title>
          <div>
            <van-icon class-prefix="iconfont" class="orange myIcon" name="mima" />
            <span class="text">修改密码</span>
          </div>
        </template>
      </van-cell>
      <van-divider />
      <van-cell @click="aboutUs" class="item" is-link v-if="$store.state.user.appType != '3'">
        <template #title>
          <div>
            <van-icon class-prefix="iconfont" class="green myIcon" name="wode-guanyuwomen" />
            <span class="text">关于我们</span>
          </div>
        </template>
      </van-cell>
      <van-cell class="item" to="/mine/feedback" is-link>
        <template #title>
          <div>
            <van-icon class-prefix="iconfont" class="yellow myIcon" name="xinxi" />
            <span class="text">用户反馈</span>
          </div>
        </template>
      </van-cell>
      <van-divider />
    </div>
    <div class="bottom" v-if="$store.state.user.appType != '3'">
      <van-cell @click="loginOut" class="item" is-link>
        <template #title>
          <div>
            <van-icon class="red myIcon" name="delete" />
            <van-button class="loginOut">退出当前账号</van-button>
          </div>
        </template>
      </van-cell>
      <!--<van-cell class="item" is-link to="/demo">
        <template #title>
          <div>
            <van-icon class-prefix="iconfont" class="blue myIcon" name="shezhi" />
            <span class="text">demo</span>
          </div>
        </template>
      </van-cell>-->
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //二维码弹窗
      showQRcode: false,
      user: {
        name: '',
        work: '',
        project: '',
        organizationDto: ''
      },
      isCompany: false
    }
  },
  async mounted() {
    if (this.$store.state.user.user.accountTypeDto.type == 30 || this.$store.state.user.user.accountTypeDto.type == 60) {
      this.isCompany = true
    }
    this.user.name = this.$store.state.user.user.username
    this.user.project = this.$store.state.user.project.name
    try {
      this.user.organizationDto = this.$store.state.user.user.organizationDto.name
    } catch {}
    try {
      this.user.work = this.$store.state.user.user.jobTitleDtoList[0].name
    } catch {}
  },
  components: {},
  methods: {
    aboutUs() {
      if (window.jsCall) window.jsCall.about()
    },
    //退出登录状态
    async loginOut() {
      if (this.$store.state.user.appType == '0') {
        let resp = await this.$http.get('/carp/auth/k/q/logout')
        if (resp.code == 0) {
          this.$store.commit('clearSession')
          if (window.jsCall) window.jsCall.setCache('')
          this.$router.push({
            name: 'login',
            params: {}
          })
        } else {
          this.$dialog.alert({
            message: '退出登录失败:' + resp.message,
            confirmButtonColor: 'red'
          })
        }
      } else {
        this.$store.commit('clearSession')
        if (window.jsCall) window.jsCall.reLogin()
      }
    }
  }
}
</script>

<style lang="less" scoped>
.Mine {
  text-align: left;
  background-color: #f9f9f9;
  height: auto;
  .van-dialog {
    width: auto;
  }
  .QRcode {
    .top {
      padding: 60px;
      padding-bottom: 0px;
      text-align: center;
      p {
        margin-bottom: 20px;
        color: #323232;
      }
      img {
        display: inline-block;
        width: 150px;
        height: 150px;
      }
    }
    .bottom {
      padding: 20px;
      padding-top: 0px;
      display: flex;
      justify-content: space-between;
      margin-top: 0;
      .iconBox {
        text-align: center;
        .myIcon {
          border: 1px solid #c6c6c6;
          color: #c6c6c6;
          display: inline-block;
          width: 50px;
          height: 50px;
          line-height: 50px;
          border-radius: 100%;
          font-size: 25px;
        }
        .iconText {
          color: #373737;
          margin-top: 10px;
        }
      }
    }
  }
  .service {
    .top {
      position: relative;
      img {
        width: 100%;
        height: 150px;
      }
      .tel {
        position: absolute;
        top: 50px;
        left: 30px;
        color: #fff;
        font-size: 20px;
        .text {
          font-weight: 800;
          margin-bottom: 20px;
        }
      }
    }
    .bottom {
      padding: 20px 30px;
      margin-top: 0;
    }
  }
  .blue {
    background-color: #349cfa;
  }
  .orange {
    background-color: #ff7201;
  }
  .green {
    background-color: #19c363;
  }
  .yellow {
    background-color: #fc9900;
  }
  .red {
    background-color: #fe0100;
  }
  .title {
    font-weight: 800;
    color: #333;
    font-size: 20px;
    padding: 0;
    margin: 0;
  }
  header {
    padding: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    margin-bottom: 20px;
  }
  .bottom {
    margin-top: 20px;
    padding: 0 20px;
    background-color: #fff;
    .van-divider {
      margin: 0;
      border-color: #f4f4f4;
    }
    .van-cell {
      padding: 20px 0;
    }
    .item {
      .myIcon {
        color: #fff;
        font-size: 16px;
        width: 30px;
        height: 30px;
        border-radius: 100%;
        line-height: 30px;
        text-align: center;
        display: inline-block;
      }
      .text {
        display: inline-block;
        margin-left: 20px;
        font-size: 18px;
        color: #3d3d3d;
      }
    }
  }
  .loginOut {
    border: 0;
    padding: 0;
    margin-left: 20px;
    font-size: 18px;
    color: #3d3d3d;
    line-height: 0;
    height: auto;
  }
}
</style>
