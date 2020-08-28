<template>
  <div class="header-bg">
    <div class="icon-wrap">
      <!-- <i class="el-icon-s-fold"></i> -->
      <img src="../assets/images/icon.png" @click="collapseMenu" />
      <h3>智慧工地扬尘监测系统</h3>
    </div>
    <div class="r-content">
      <i
        v-if="[0, 50].includes($userType)"
        class="iconfont iconfont-map"
        @click="
          $router.push('dustMap')
          handleFullScreen()
        "
      ></i>
      <i class="iconfont iconfont-fullscreen" @click="handleFullScreen"></i>
      <el-dropdown trigger="click" size="mini">
        <span class="el-dropdown-link">
          <img :src="avatar" @error="avatar = require('@/assets/images/user.png')" class="user" />
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="handleLinkUserSpace">个人中心</el-dropdown-item>
          <el-dropdown-item @click.native="logOut">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      current: state => state.tab.currentMenu,
      user: state => state.user.userInfo
    })
  },
  data() {
    return {
      avatar: this.$store.state.config.convertImgUrl(this.$store.state.user.userInfo.accountBaseDto.photo) || require('@/assets/images/user.png'),
      open: true
    }
  },
  methods: {
    collapseMenu() {
      this.$store.commit('collapseMenu')
    },
    // 跳转到用户空间
    handleLinkUserSpace() {
      this.$router.push({ name: 'userSpace' })
      this.$store.commit('selectMenu', {
        label: '用户空间',
        path: '/userSpace',
        name: 'userSpace',
        component: () => import('@/views/userSpace/Index')
      })
    },
    // 注销操作
    logOut() {
      this.$http.get('/carp/auth/k/q/logout').then(({ code }) => {
        if (code === 0) {
          this.$message.success('已注销登录')
        }
        this.$store.commit('clearToken')
        this.$store.commit('clearUserInfo')
        location.reload()
      })
    },
    // 全屏操作
    handleFullScreen() {
      let doc = document.body || document.documentElement
      this.FULLSCREEN(doc)
    }
  }
}
</script>

<style lang="less">
.header-bg {
  display: flex;
  box-sizing: border-box;
  height: 95px;
  align-items: center;
  justify-content: space-between;
  color: #ffffff;
  font-weight: bolder;
  font-size: 20px;
  .icon-wrap {
    display: flex;
    align-items: center;
    i {
      padding: 19px;
      cursor: pointer;
      font-size: 26px;
    }
    & > img {
      display: block;
      cursor: pointer;
      height: 36px;
      margin-right: 12px;
    }
    h3 {
      margin: 0;
      font-size: 36px;
      font-weight: 900;
    }
  }
}

.r-content {
  display: flex;
  align-items: center;
  height: 40px;
  margin: 10px 10px 0px 0px;
  .iconfont {
    font-size: 26px;
    margin-right: 12px;
    cursor: pointer;
  }
  .user {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    cursor: pointer;
  }
}
</style>
