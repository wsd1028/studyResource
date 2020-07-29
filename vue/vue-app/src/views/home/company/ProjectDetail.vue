<template>
  <div class="company-projectDetail">
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="项目详情">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <van-popup class="mapDia" position="top" v-model="mapDia">
      <MyMap :address="mainData.address" :position="{ lng: mainData.longitude, lat: mainData.latitude }"></MyMap>
    </van-popup>
    <van-dialog :showConfirmButton="false" class="tips" title v-model="dialog.state">
      <div style="padding:30px">
        <p style="textAlign:center">
          <van-icon :color="dialog.color" :name="dialog.myIcon" class-prefix="iconfont" size="20" v-if="dialog.myIcon" />
          <van-icon :color="dialog.color" :name="dialog.icon" size="20" v-else />
          <span class="tipsMsg" v-text="dialog.title"></span>
        </p>
        <div class="dfsb" style="justify-content: center">
          获取当前点位:
          <van-loading color="#1989fa" v-if="!location" />
          <van-icon color="#1989fa" name="checked" size="24" v-else />
        </div>
        <div class="tipsbtns">
          <van-button @click="dialog.state = false" block class="myBtn2" color="#ddd" round size="small">取消</van-button>
          <van-button :disabled="!location" @click="updateLoaction" block class="myBtn" round size="small" type="info">确认</van-button>
        </div>
      </div>
    </van-dialog>
    <section>
      <div class="top">
        <van-image :src="$dictionaries.imgBaseUrl + mainData.image" height="200px" width="100%" />
        <div class="msgItem">
          <span>
            <van-image :src="require('@/assets/image/index_icon3.png')" height="18" width="18" />
          </span>
          <span class="text" style="fontWeight:800;color:#333" v-text="mainData.name"></span>
        </div>
        <div class="msgItem dfsb">
          <div class="dfsb" style="overflow:hidden">
            <van-image :src="require('@/assets/image/index_icon4.png')" @click="mapDia = true" height="18" width="16" />
            <p class="textFlowP">
              <span @click="mapDia = true" class="text textFlow" v-text="mainData.address"></span>
            </p>
          </div>
          <van-button @click="getLocation" size="small" style="flexShrink:0" type="info">更改位置</van-button>
        </div>
      </div>
      <div class="boxItem0">
        <div>
          <p class="label">当前工期</p>
          <p class="value" v-text="mainData.phase"></p>
        </div>
        <div>
          <p class="label">工程面积</p>
          <p class="value">{{ mainData.projectArea }}m³</p>
        </div>
        <div>
          <p class="label">工程造价</p>
          <p class="value">{{ mainData.totalCost }}万元</p>
        </div>
      </div>
      <div class="boxItem">
        <p class="text">项目概况</p>
        <div class="itemContent">
          <van-field label="施工时间" type="text" v-model="mainData.startDate" />
          <van-field label="竣工时间" type="text" v-model="mainData.completeDate" />
          <van-field label="建设单位" type="text" v-model="mainData.constructUnit" />
          <van-field label="勘察单位" type="text" v-model="mainData.surveyUnit" />
          <van-field label="设计单位" type="text" v-model="mainData.designUnit" />
          <van-field label="监理单位" type="text" v-model="mainData.supervisionUnit" />
          <van-field label="施工单位" type="text" v-model="mainData.buildUnit" />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import MyMap from '@/components/MyMap.vue'

export default {
  data() {
    return {
      mainData: {},
      mapDia: false,
      location: null,
      dialog: {
        state: false,
        text: '',
        myIcon: '',
        icon: 'checked',
        color: '#67c23a',
        title: '确认重新定位该项目!'
      }
    }
  },
  mounted() {
    this.getMainData()
    window.setLocation = this.setLocation2
    if (!window.jsCall) {
      let geolocation = new BMap.LocalCity()
      geolocation.get(res => {
        this.location = res.center
      })
    }
  },
  components: { MyMap },
  methods: {
    //文件选中之后调用
    async getMainData() {
      //获取项目信息,type==30,60
      let resp = await this.$http.get('/carp/business/k/s/project/' + this.$store.state.user.project.projectId)
      if (resp.code == 0) {
        this.mainData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取项目信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //安卓回传经纬度
    async setLocation2(data) {
      if (data) {
        this.location = data
      }
    },
    //调用安卓接口获取经纬度
    getLocation() {
      this.dialog.state = true
      if (window.jsCall) {
        window.jsCall.getLocation()
      }
    },
    //更改定位
    async updateLoaction() {
      this.dialog.state = false
      let resp = await this.$http.post('/carp/business/a/q/data/migration/longitude/latitude', {
        projectId: this.$store.state.user.project.projectId,
        longitude: this.location.lng,
        latitude: this.location.lat
      })
      if (resp.code == 0) {
        this.getMainData()
        this.$dialog.alert({
          message: '更改定位成功',
          confirmButtonColor: 'green'
        })
      } else {
        this.$dialog.alert({
          message: '更改定位失败:' + resp,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.company-projectDetail {
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
    .top {
      padding: 20px;
      .msgItem {
        font-size: 18px;
        color: #656565;
        display: flex;
        margin-top: 16px;
        align-items: center;
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
      .itemContent {
        background-color: #fff;
      }
    }
  }
}
</style>
