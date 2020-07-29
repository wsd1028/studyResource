<template>
  <div>
    <router-view class="Router"></router-view>
    <van-tabbar style="z-index:200" v-if="$store.state.user.appType != '1'" v-model="$store.state.user.activeTab">
      <van-tabbar-item :name="0" :to="$store.state.user.homeUrl" icon="wap-home" v-if="!isVisitor">首页</van-tabbar-item>
      <van-tabbar-item :name="1" :to="work" icon="cluster ">工作台</van-tabbar-item>
      <van-tabbar-item :name="2" icon="map-marked" to="/main/mine">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: 0,
      home: '',
      work: '',
      isVisitor: false
    }
  },
  mounted() {
    if (this.$store.state.user.user.accountTypeDto.type == this.$dictionaries.userType.government) {
      this.work = '/main/government/work'
    } else {
      this.work = '/main/company/work'
    }
    if (
      this.$store.state.user.user.accountTypeDto.type != this.$dictionaries.userType.government &&
      this.$store.state.user.user.accountTypeDto.type != this.$dictionaries.userType.project &&
      this.$store.state.user.user.accountTypeDto.type != this.$dictionaries.userType.garbage
    ) {
      this.work = '/main/visitor/work'
      this.isVisitor = true
    }
  }
}
</script>
<style lang="less" scoped>
.Router {
  position: absolute;
  width: 100%;
  transition: all 0.8s ease;
  padding-bottom: 50px;
}

#app {
  text-align: -webkit-auto;
}
</style>
