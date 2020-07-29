<template>
  <div class="Feedback">
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="协议与说明">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <span>暂无</span>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  mounted() {},
  components: {},
  methods: {}
}
</script>

<style lang="less" scoped>
.Feedback {
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
}
</style>
