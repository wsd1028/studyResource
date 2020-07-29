<template>
  <div class="DeviceDustWarn mainBox">
    <div class="mainTop">
      <header>
        <van-nav-bar @click-left="$router.go(-1)" class="nav" title="扬尘告警">
          <template #left>
            <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
          </template>
        </van-nav-bar>
      </header>
      <div class="projectName">
        <span class="box"></span>
        <span class="name">设备号:</span>
        <span v-text="paramsData.sn"></span>
      </div>
    </div>
    <div class="all mainBottom">
      <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
        <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
          <div :key="index" class="dustItem" v-for="(item, index) in list">
            <div class="top">
              <van-icon class-prefix="iconfont" color="#4683f1" name="yangchen" size="24" />
              <span>PM10浓度：</span>
              <span style="color:#ff0c15" v-text="item.avgPm10"></span>
              <span>ug/m³</span>
            </div>
            <p style="margin:10px 0">PM10国控值:{{ item.alarmPm10 }}ug/m³</p>
            <p>告警时间:{{ item.beginTime }}</p>
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
      list: [],
      loading: false,
      refreshloading: false,
      finished: false,
      paramsData: {},
      searchData: {
        limit: 10,
        page: 1,
        sn: '',
        beginTimeEnd: '',
        beginTimeStart: ''
      }
    }
  },
  mounted() {
    this.paramsData = this.$route.params
    this.searchData.sn = this.paramsData.sn
    this.searchData.beginTimeEnd = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    this.searchData.beginTimeStart = this.$moment()
      .startOf('day')
      .format('YYYY-MM-DD HH:mm:ss')
  },
  components: {},
  methods: {
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
        this.searchData.beginTimeEnd = this.$moment().format('YYYY-MM-DD HH:mm:ss')
        this.searchData.beginTimeStart = this.$moment()
          .startOf('day')
          .format('YYYY-MM-DD HH:mm:ss')
      }
      let resp = await this.$http.get('/carp/device/k/q/dust/alarm', {
        params: this.searchData
      })
      if (resp.code == 0) {
        if (page) {
          this.list = []
        }
        this.list = this.list.concat(resp.data.records)
        // 加载状态结束
        this.loading = false
        this.refreshloading = false
        this.searchData.page = this.searchData.page + 1
        if (this.list.length == resp.data.total) {
          // 数据全部加载完成
          this.finished = true
        } else {
          this.finished = false
        }
      } else {
        this.$dialog.alert({
          message: '获取扬尘告警失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.DeviceDustWarn {
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
  .projectName {
    background-color: #fff;
    padding: 15px;
    line-height: 20px;
    font-weight: 700;
    font-size: 18px;
    .box {
      height: 20px;
      width: 5px;
      background-color: #4186f6;
    }
    span {
      vertical-align: top;
    }
    .name {
      color: #4186f6;
      margin: 0 5px;
    }
  }
  .all {
    padding: 10px;
    background-color: #f9f9f9;
    .dustItem {
      background-color: #fff;
      padding: 5px 10px;
      margin-bottom: 10px;
      .top {
        line-height: 24px;
        i {
          display: inline-block;
          margin-right: 5px;
          vertical-align: middle;
        }
        span {
          color: #333;
          font-weight: bold;
        }
      }
      p {
        color: #9c9c9c;
      }
    }
    .item {
      background-color: #fff;
      margin-bottom: 10px;
      padding: 5px;
      text-align: left;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        i {
          display: inline-block;
          margin-right: 5px;
        }
      }
      .bottom {
        color: #949494;
        p {
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          font-size: 12px;
          line-height: 20px;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>
