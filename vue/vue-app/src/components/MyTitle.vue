<template>
  <div class="myTitle">
    <header>
      <van-nav-bar :title="titleName" @click-left="goBack" class="nav">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
  </div>
</template>
<script>
export default {
  name: 'myTitle',
  data() {
    return {}
  },
  props: {
    titleName: {
      type: String,
      default: ''
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1)
      if (window.jsCall) window.jsCall.back()
    }
  }
}
</script>

<style lang="less" scoped>
.myTitle {
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
}
</style>
