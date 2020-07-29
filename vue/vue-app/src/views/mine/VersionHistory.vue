<template>
  <div class="Password">
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="版本更新记录">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <div class="item">
      <div class="top">
        <p>2.3.3</p>
        <span class="date">2019年11月06日</span>
      </div>
      <p class="detail">
        1.完善百度（纳斯达克：BIDU）是全球最大的中文搜索引擎，中国最大的以信息和知识为核心的互联网综合服务公司，全球领先的人工智能平台型公司。百度愿景是：成为最懂用户
      </p>
      <p class="detail">2.完善</p>
      <p class="detail">3.完善</p>
    </div>
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
  .item {
    background-color: #fff;
    border-bottom: 1px solid #eaeaea;
    padding: 30px 20px;
    .top {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      margin-bottom: 20px;
      align-items: center;
      p {
        font-weight: 800;
        font-size: 18px;
      }
      .date {
        color: #9a9a9a;
      }
    }
    .detail {
      color: #303030;
      font-size: 16px;
    }
  }
}
</style>
