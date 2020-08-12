<template>
  <div class="government-dustDevice mainBox">
    <myTitle class="mainTop" titleName="扬尘告警"></myTitle>
    <div class="all mainBottom">
      <van-pull-refresh @refresh="getDustList(1)" v-model="refreshloading">
        <van-list :finished="dustFinish" @load="getDustList" finished-text="没有更多了" v-model="loading">
          <div :key="index" class="deviceItem" v-for="(item, index) in DustList">
            <P class="deviceSN">IMEI:{{ item.sn }}</P>
            <P class="deviceDate">{{ item.createDate }}</P>
            <div class="allBox">
              <div @click="goSkip('company-dustNowData', item)" class="box">
                <div :class="['boxImg', item.online ? 'blue' : 'grey']">
                  <van-image :src="require('@/assets/image/实时数据.png')" height="20" width="20" />
                </div>
                <span class="boxTitle">实时数据</span>
              </div>
              <div @click="goSkip('company-dustAgoData', item)" class="box">
                <div :class="['boxImg', item.online ? 'skyblue' : 'grey']">
                  <van-image :src="require('@/assets/image/历史数据.png')" height="20" width="20" />
                </div>
                <span class="boxTitle">历史数据</span>
              </div>
            </div>
            <van-image :src="require('@/assets/image/online.png')" class="stateImg" height="60" v-if="item.online" width="60" />
            <van-image :src="require('@/assets/image/outline.png')" class="stateImg" height="60" v-else width="60" />
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      DustList: [],
      refreshloading: false,
      finished: false,
      loading: false,
      dustFinish: false,
      paramsData: {},
      searchData: {
        limit: 10,
        page: 1,
        projectId: ''
      }
    }
  },
  mounted() {
    if (JSON.stringify(this.$route.params) == '{}') {
      this.paramsData = this.$store.state.user.paramsData
    } else {
      this.paramsData = this.$route.params
      this.$store.commit('setParamsData', this.paramsData)
    }
    this.searchData.projectId = this.paramsData.projectId
  },
  components: {},
  methods: {
    goSkip(name, params) {
      this.$router.push({
        name,
        params
      })
    },
    //查询数据
    async getDustList(page) {
      if (page) {
        this.searchData.page = 1
      }
      let resp = await this.$http('/carp/device/a/q/dust/info/devices/' + this.searchData.projectId)
      if (resp.code == 0) {
        if (page) {
          this.DustList = []
        }
        this.DustList = resp.data
        // 加载状态结束
        this.loading = false
        this.refreshloading = false
        this.dustFinish = true
      } else {
        this.$dialog.alert({
          message: '获取项目设备失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less">
.government-dustDevice {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  .all {
    .deviceItem {
      background-color: #fff;
      padding: 10px;
      margin-bottom: 10px;
      position: relative;
      .stateImg {
        position: absolute;
        top: 0;
        right: 0;
      }
      .green {
        background-color: #38c171;
      }
      .red {
        background-color: #f11b00;
      }
      .blue {
        background-color: #1c7afe;
      }
      .skyblue {
        background-color: #09beeb;
      }
      .grey {
        background-color: #999999;
      }
      .deviceSN {
        font-size: 18px;
        font-family: Source Han Sans CN;
        font-weight: 600;
        color: rgba(51, 51, 51, 1);
      }
      .deviceDate {
        font-size: 14px;
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(102, 102, 102, 1);
      }
      .allBox {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        .boxTitle {
          font-size: 32px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          color: rgba(51, 51, 51, 1);
          font-size: 10px;
          margin-top: 4px;
        }
        .box {
          margin-right: 15px;
          text-align: center;
          width: 50px;
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          .boxImg {
            border-radius: 4px;
            width: 40px;
            height: 40px;
            line-height: 46px;
            flex-shrink: 0;
          }
        }
      }

      .rightIcon {
        text-align: center;
        height: 100%;
        width: 50px;
      }
    }
  }
}
</style>
