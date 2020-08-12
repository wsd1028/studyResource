<template>
  <div class="Password">
    <myTitle class="mainBox2" titleName="版本更新记录"></myTitle>
    <div class="item mt50">
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
