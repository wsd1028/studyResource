<template>
  <div class="workGov-absorptionDetail">
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="消纳监管">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <section>
      <div class="top">
        <MyImage :imgUrl="$dictionaries.imgBaseUrl + mainData.backgroundPhoto" height="200px" width="100%" />
        <div class="msgItem">
          <span>
            <van-icon class-prefix="iconfont" class="myIcon" color="#4284f3" name="shujia" size="20" />
          </span>
          <span class="text" style="fontWeight:800;color:#333" v-text="mainData.name"></span>
        </div>
        <div class="msgItem">
          <van-icon class="myIcon" color="#6c6c6c" name="location" size="18" />
          <span class="text" v-text="mainData.address"></span>
        </div>
      </div>
      <div class="boxItem">
        <p class="text">消纳场概况</p>
        <div class="itemContent">
          <van-field :value="mainData.recordTime" label="备案时间" type="text" />
          <van-field :value="mainData.dueTime" label="到期时间" type="text" />
          <van-field :value="mainData.businessScope" label="经营性质" type="text" />
          <van-field :value="mainData.areaName" label="区县" type="text" />
          <van-field :value="mainData.capacity" class="blue" label="总方量" type="text" />
          <van-field :value="mainData.garbageSurplusWeight" class="green" label="剩余方量" type="text" />
          <van-field :value="mainData.capacity - mainData.garbageSurplusWeight" class="red" label="已消纳" type="text" />
          <van-field :value="mainData.creator" label="法人" type="text" />
          <van-field :value="mainData.creatorIdCard" label="身份证号" type="text" />
          <van-field :value="mainData.creatorPhone" label="电话" type="text" />
          <van-field :value="mainData.linkman" label="负责人" type="text" />
          <van-field :value="mainData.linkmanIdCard" label="身份证号" type="text" />
          <van-field :value="mainData.linkmanPhone" label="电话" type="text" />
        </div>
      </div>
    </section>
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
    this.paramsData = this.$route.params
    this.getMainData()
  },
  components: {},
  methods: {
    //文件选中之后调用
    async getMainData() {
      let resp = await this.$http.get('/carp/business/a/q/garbage/station/' + this.paramsData.id)
      if (resp.code == 0) {
        this.mainData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less">
.workGov-absorptionDetail {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
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
  section {
    .blue {
      .van-field__control {
        color: #4985f0;
      }
    }
    .green {
      .van-field__control {
        color: #00c75b;
      }
    }
    .red {
      .van-field__control {
        color: #f02c35;
      }
    }
    .top {
      padding: 20px;
      background-color: #fff;
      .msgItem {
        font-size: 18px;
        color: #656565;
        display: flex;
        margin-top: 16px;
        align-items: flex-start;
        text-align: left;
        .text {
          margin-left: 10px;
        }
      }
    }
    .boxItem0 {
      background-color: #fff;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      .label {
        color: #999;
      }
      .value {
        color: #4087f6;
        font-weight: 800;
        font-size: 18px;
      }
    }
    .boxItem {
      margin-top: 30px;
      .itemContent {
        background-color: #fff;
      }
      p {
        color: #999;
        margin-bottom: 10px;
        margin-left: 16px;
      }
    }
  }
}
</style>
