<template>
  <div class="company-problemReportDetail">
    <van-popup class="mapDia" position="top" v-model="mapDia">
      <MyMap :address="mainData.reportAddress" :position="{ lng: mainData.longitude, lat: mainData.latitude }"></MyMap>
    </van-popup>
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="问题上报详情">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <div class="boxItem">
      <p class="text">基本信息</p>
      <div class="itemContent">
        <van-field disabled label="创建时间" type="text" v-model="mainData.createDate" />
        <van-field disabled label="问题类型" type="text" v-model="problemType[mainData.reportType]" />
        <van-field disabled label="问题地址" v-model="mainData.reportAddress">
          <template #button>
            <van-button @click="mapDia = true" size="small" type="primary">查看地址</van-button>
          </template>
        </van-field>
        <van-field disabled label="上报人" type="text" v-model="mainData.peopleName" />
        <van-field disabled label="电话" type="text" v-model="mainData.phone" />
        <van-field disabled label="状态" type="text" v-model="mainData.stateQuestionName" />
      </div>
    </div>
    <div class="boxItem">
      <p class="text">问题图片</p>
      <div class="itemContent" style="padding:10px 0">
        <van-grid :border="false" :gutter="10">
          <van-grid-item :key="index" v-for="(item, index) in mainData.photo">
            <MyImage :imgUrl="$dictionaries.imgBaseUrl + item" height="80" width="80" />
          </van-grid-item>
        </van-grid>
      </div>
    </div>
    <div class="boxItem">
      <p class="text">问题描述</p>
      <div class="itemContent" style="padding:10px 0">
        <p class="problemMsg" v-text="mainData.reportMessage"></p>
      </div>
    </div>
  </div>
</template>

<script>
import MyMap from '@/components/MyMap.vue'

export default {
  data() {
    return {
      problemType: {
        350: '固定源污染',
        351: '项目未注册',
        352: '企业问题上报',
        353: '其他'
      },
      mapDia: false,
      isFull: false,
      mainData: {},
      paramsData: {}
    }
  },
  mounted() {
    //获取路由参数
    this.paramsData = this.$route.params
    this.getMainData()
  },
  components: {
    MyMap
  },
  methods: {
    //得到详细数据
    async getMainData() {
      let resp = await this.$http.get('/carp/business/a/q/question/report/' + this.paramsData.id)
      if (resp.code == 0) {
        this.mainData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取问题上报详情失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less">
.company-problemReportDetail {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  padding-bottom: 30px;
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
    margin-top: 20px;
    .text {
      span {
        line-height: 24px;
        text-align: center;
        padding: 2px 15px;
        color: #fff;
        border-radius: 24px;
        margin-left: 10px;
      }
      .yes {
        background-color: #1b7bfe;
      }
    }
    p {
      color: #323232;
      font-weight: 700;
      margin-bottom: 10px;
      margin-left: 16px;
    }
    .itemContent {
      background-color: #fff;
      .van-icon__image {
        width: 100%;
        height: 100%;
      }
      .van-grid-item__content {
        padding: 0;
      }
      .problemMsg {
        text-indent: 20px;
        color: #999;
      }
    }
  }
}
</style>
