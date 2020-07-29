<template>
  <div class="government-problemReportDetail" v-cloak>
    <van-popup class="mapDia" position="top" v-model="mapDia">
      <MyMap :address="mainData.reportAddress" :position="{ lng: mainData.longitude, lat: mainData.latitude }"></MyMap>
    </van-popup>
    <van-dialog :showConfirmButton="false" class="tips" title v-model="deleteDia">
      <div style="padding:30px">
        <p style="textAlign:center">
          <van-icon color="#19c363" name="checked" size="20" />
          <span class="tipsMsg">确认作废案件?</span>
        </p>
        <div class="tipsbtns">
          <van-button @click="deleteDia = false" block class="myBtn2" color="#ddd" round size="small">取消</van-button>
          <van-button @click="handelDelete" block class="myBtn" round size="small" type="info">确认</van-button>
        </div>
      </div>
    </van-dialog>
    <van-dialog :showConfirmButton="false" class="tips" title v-model="finishDia">
      <div style="padding:30px">
        <p style="textAlign:center">
          <van-icon color="#19c363" name="checked" size="20" />
          <span class="tipsMsg">确认案件已处理完成?</span>
        </p>
        <div class="tipsbtns">
          <van-button @click="finishDia = false" block class="myBtn2" color="#ddd" round size="small">取消</van-button>
          <van-button @click="handelFinish" block class="myBtn" round size="small" type="info">确认</van-button>
        </div>
      </div>
    </van-dialog>
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
        <van-field disabled label="问题地址" type="text" v-model="mainData.reportAddress">
          <template #button>
            <van-button @click="mapDia = true" size="small" type="primary">查看地址</van-button>
          </template>
        </van-field>
        <van-field disabled label="所属区域" type="text" v-model="mainData.state" />
        <van-field disabled label="上报人" type="text" v-model="mainData.peopleName" />
        <van-field disabled label="电话" type="text" v-model="mainData.phone" />
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
    <div class="boxItem">
      <p class="text">处理结果</p>
      <div class="itemContent" style="padding:10px 0">
        <van-field
          clearable
          placeholder="请输入问题处理结果"
          type="textarea"
          v-if="mainData.reportState == $dictionaries.problem.report"
          v-model="mainData.summaryMessage"
        />
        <van-field clearable disabled type="textarea" v-else v-model="mainData.summaryMessage" />
      </div>
    </div>
    <div style="marginTop:30px;display:flex" v-cloak v-if="mainData.reportState == $dictionaries.problem.report">
      <van-button @click="deleteDia = true" block style="flex-grow:1" type="danger">作废</van-button>
      <van-button @click="goDispath" block style="flex-grow:1" type="primary">督办派单</van-button>
      <van-button @click="finishDia = true" block style="flex-grow:1" type="info">处理完成</van-button>
    </div>
  </div>
</template>

<script>
import MyMap from '@/components/MyMap.vue'

export default {
  data() {
    return {
      //地图弹窗
      mapDia: false,
      //完成弹窗
      finishDia: false,
      //作废
      deleteDia: false,
      problemType: {
        350: '固定源污染',
        351: '项目未注册',
        352: '企业问题上报',
        353: '其他'
      },
      mainData: {
        reportState: 0
      },
      paramsData: {}
    }
  },
  mounted() {
    //获取路由参数
    if (JSON.stringify(this.$route.params) == '{}') {
      this.paramsData = this.$store.state.user.paramsData
    } else {
      this.paramsData = this.$route.params
      this.$store.commit('setParamsData', this.paramsData)
    }
    this.getMainData()
  },
  components: {
    MyMap
  },
  methods: {
    //点击作废
    async handelDelete() {
      let resp = await this.$http.put('/carp/business/a/q/question/report/update', {
        id: this.paramsData.id,
        reportState: this.$dictionaries.problem.cancel
      })
      if (resp.code == 0) {
        this.$router.go(-1)
      } else {
        this.$dialog.alert({
          message: '删除问题上报失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //处理完成
    async handelFinish() {
      let resp = await this.$http.put('/carp/business/a/q/question/report/update', {
        id: this.paramsData.id,
        reportState: this.$dictionaries.problem.finish,
        summaryMessage: this.mainData.summaryMessage
      })
      if (resp.code == 0) {
        this.$router.go(-1)
      } else {
        this.$dialog.alert({
          message: '处理问题上报失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //跳转督办派单
    goDispath() {
      this.$router.push({
        name: 'dispatchCreate',
        params: this.mainData
      })
    },
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
.government-problemReportDetail {
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
    margin-top: 30px;
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
