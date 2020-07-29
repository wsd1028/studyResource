<template>
  <div class="government-exposureDetail">
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="曝光台">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <article>
      <h2 v-text="mainData.title"></h2>
      <div class="date">
        <p v-text="mainData.createDate"></p>
        <p>
          来源:
          <span v-text="mainData.adminName"></span>
        </p>
      </div>
      <van-image :src="$dictionaries.imgBaseUrl + mainData.photo" fit="cover" height="200px" style="margin:20px 0" width="100%" />
      <div class="msgItem">
        <h3>案情回顾</h3>
        <div class="detailMsg" v-html="mainData.describes"></div>
      </div>
    </article>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mainData: {},
      paramsData: {}
    }
  },
  mounted() {
    //获取路由参数
    this.paramsData = this.$route.params
    this.getMainData()
  },
  components: {},
  methods: {
    //得到详细数据
    async getMainData() {
      let resp = await this.$http.get('/carp/business/a/q/exposure/table/' + this.paramsData.id)
      if (resp.code == 0) {
        this.mainData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取曝光台详情失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less">
.government-exposureDetail {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  box-sizing: border-box;
  padding-bottom: 40px;
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
  article {
    background-color: #fff;
    padding: 10px;
    margin-top: 10px;
    .van-image__img {
      margin: 0;
    }
    .date {
      justify-content: space-between;
      display: flex;
      color: #989898;
      font-size: 14px;
      margin-top: 10px;
    }
    .msgItem {
      h3 {
        text-align: center;
        color: #353535;
      }
    }
  }
  .detailMsg {
    img {
      width: 100% !important;
    }
  }
}
</style>
