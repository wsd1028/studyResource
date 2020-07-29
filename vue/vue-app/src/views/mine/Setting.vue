<template>
  <div class="Setting">
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="设置">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <div class="boxItem">
      <p class="text">推送通知设置</p>
      <div class="itemContent">
        <van-cell title="身份证扫码认证">
          <template #right-icon>
            <van-switch v-model="checked" />
          </template>
        </van-cell>
      </div>
      <div class="itemContent">
        <van-cell title="移动网络下载视频">
          <template #right-icon>
            <van-switch v-model="checked1" />
          </template>
        </van-cell>
      </div>
      <div class="itemContent">
        <van-cell title="接收推送">
          <template #right-icon>
            <van-switch v-model="checked2" />
          </template>
        </van-cell>
      </div>
    </div>
    <div class="boxItem">
      <p class="text">图片上传质量</p>
      <div class="itemContent">
        <van-cell @click="imgUpload = '1'" clickable label="消耗流量最少,上传速度最快,但图片质量较差!" title="较低质量">
          <template #right-icon>
            <van-icon color="#2275fc" name="success" size="20" v-show="imgUpload == '1'" />
          </template>
        </van-cell>
      </div>
      <div class="itemContent">
        <van-cell @click="imgUpload = '2'" clickable label="消耗流量较少,但图片质量一般!" title="正常">
          <template #right-icon>
            <van-icon color="#2275fc" name="success" size="20" v-show="imgUpload == '2'" />
          </template>
        </van-cell>
      </div>
      <div class="itemContent">
        <van-cell @click="imgUpload = '3'" clickable label="消耗流量最大,但图片质量最好!" title="较高质量">
          <template #right-icon>
            <van-icon color="#2275fc" name="success" size="20" v-show="imgUpload == '3'" />
          </template>
        </van-cell>
      </div>
    </div>
    <p @click="loginOut" class="logonOut">退出当前账号</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      checked: true,
      checked1: true,
      checked2: true,
      imgUpload: '2'
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
        if (window.jsCall) window.jsCall.setCache('')
        if (this.$store.state.user.appType == '0') {
          this.$router.push({
            name: 'login',
            params: {}
          })
        } else {
          if (window.jsCall) window.jsCall.reLogin()
        }
      } else {
        this.$dialog.alert({
          message: '退出登录失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.Setting {
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
  .boxItem {
    margin-top: 30px;
    p {
      color: #999;
      margin-bottom: 10px;
      margin-left: 16px;
    }
    .itemContent {
      background-color: #fff;
    }
  }
  .logonOut {
    text-align: center;
    color: #f65246;
    line-height: 60px;
    background-color: #fff;
    position: fixed;
    width: 100%;
    bottom: 0;
  }
}
</style>
