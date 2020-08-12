<template>
  <div class="company-todayWarn mainBox">
    <div class="mainTop">
      <myTitle titleName="今日告警"></myTitle>
      <van-tabs @change="changeTab" color="#4683f1" swipeable v-model="active">
        <van-tab name="dust" title="扬尘告警"></van-tab>
        <van-tab name="directories" title="非名录告警"></van-tab>
      </van-tabs>
    </div>
    <section class="mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <div class="all" v-if="active == 'dust'">
          <van-pull-refresh @refresh="getDustList(1)" v-model="refreshloading">
            <van-list :finished="dustFinish" @load="getDustList" finished-text="没有更多了" v-model="dustLoading">
              <div :key="index" class="dustItem" v-for="(item, index) in DustList">
                <div class="top">
                  <van-image :src="require('@/assets/image/index_icon8.png')" height="18" width="20" />
                  <span>PM10浓度：</span>
                  <span style="color:#ff0c15">68</span>
                  <span>ug/m³</span>
                </div>
                <p>设备号:{{ item.sn }}</p>
                <p style="margin:10px 0">PM10国控值:65ug/m³</p>
                <p>告警时间:2020-07-27</p>
              </div>
            </van-list>
          </van-pull-refresh>
        </div>
        <div class="all" v-else>
          <van-pull-refresh @refresh="getDirectoriesList(1)" v-model="refreshloading">
            <van-list :finished="finished" @load="getDirectoriesList" finished-text="没有更多了" v-model="loading">
              <van-row :key="index" class="item" v-for="(item, index) in list">
                <van-col span="6" style="height:85px;position:relative">
                  <div class="jin" v-if="item.direction == $dictionaries.direction.jin">进</div>
                  <div class="chu" v-if="item.direction == $dictionaries.direction.chu">出</div>
                  <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item.photo" height="100%" style="width:100%;height:100%" width="100%" />
                </van-col>
                <van-col span="1"></van-col>
                <van-col span="17">
                  <div class="top">
                    <p>
                      <van-image :src="require('@/assets/image/index_icon7.png')" height="16" style="margin-right:5px" width="25" />
                      <span v-text="item.license"></span>
                      <span class="carTag1">非名录车</span>
                    </p>
                  </div>
                  <div class="bottom">
                    <p>
                      当前项目:
                      <span v-text="item.workplaceName"></span>
                    </p>
                    <p>
                      创建时间:
                      <span v-text="item.violationDate"></span>
                    </p>
                  </div>
                </van-col>
              </van-row>
            </van-list>
          </van-pull-refresh>
        </div>
      </v-touch>
    </section>
  </div>
</template>

<script>
import { getList } from '@/assets/js/commonAxios'

export default {
  data() {
    return {
      active: 'dust',
      list: [],
      DustList: [],
      loading: false,
      refreshloading: false,
      finished: false,
      dustLoading: false,
      dustFinish: false,
      project: {},
      searchData: {
        limit: 10,
        page: 1,
        workplaceId: '',
        type: this.$dictionaries.machineType.company
      }
    }
  },
  mounted() {
    this.active = this.$route.params.active
    this.searchData.workplaceId = this.$store.state.user.user.accountTypeDto.ancillaryId
    if (this.$store.state.user.user.accountTypeDto.type == 60) {
      this.searchData.type = this.$dictionaries.machineType.garbage
    }
    this.project = this.$store.state.user.project
  },
  components: {},
  methods: {
    //滑动
    onSwipe(type) {
      if (type == 'left') {
        this.active = 'directories'
      }
      if (type == 'right') {
        this.active = 'dust'
      }
    },
    goSkip(name, params) {
      this.$router.push({
        name,
        params
      })
    },
    changeTab() {
      if (this.active == 'dust') {
        this.getDustList(1)
      } else {
        this.getDirectoriesList(1)
      }
    },
    //查询设备数据
    async getDustList(page) {
      this.DustList = [{}]
      this.dustLoading = false
      this.refreshloading = false
    },
    //查询非名录车数据
    async getDirectoriesList(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = `/carp/business/a/q/warning/list/page?disposeState=${this.$dictionaries.carWarn.waitCheck}&code=${this.$dictionaries.warnType.car}&limit=${this.searchData.limit}&page=${this.searchData.page}&workplaceId=${this.searchData.workplaceId}`
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '非目录车告警')
      this.list = result.list
      this.searchData.page = result.page
      this.refreshloading = result.refreshloading
      this.loading = result.loading
      this.finished = result.finished
      //let resp = await this.$http.get(
      //  `/carp/business/a/q/warning/list/page?disposeState=${this.$dictionaries.carWarn.waitCheck}&code=${this.$dictionaries.warnType.car}&limit=${this.searchData.limit}&page=${this.searchData.page}&workplaceId=${this.searchData.workplaceId}`
      //)
      //if (resp.code == 0) {
      //  if (page) {
      //    this.list = []
      //  }
      //  this.list = this.list.concat(resp.data.records)
      //  // 加载状态结束
      //  this.loading = false
      //  this.refreshloading = false
      //  this.searchData.page = this.searchData.page + 1
      //  if (this.list.length == resp.data.total) {
      //    // 数据全部加载完成
      //    this.finished = true
      //  } else {
      //    this.finished = false
      //  }
      //} else {
      //  this.$dialog.alert({
      //    message: '获取非目录车告警失败:' + resp.message,
      //    confirmButtonColor: 'red'
      //  })
      //}
    }
  }
}
</script>

<style lang="less" scoped>
.company-todayWarn {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  .all {
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
          font-weight: 600;
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
        .carTag0 {
          border-radius: 4px;
          line-height: 24px;
          padding: 0 10px;
          border: 1px solid #00ce5e;
          color: #00ce5e;
          margin-left: 5px;
        }
        .carTag1 {
          border-radius: 4px;
          line-height: 24px;
          padding: 0 10px;
          margin-left: 5px;
          border: 1px solid #ff2c37;
          color: #ff2c37;
        }
        .carCreat {
          span {
            padding: 0 10px;
            border-radius: 14px;
            color: #fff;
            line-height: 28px;
            text-align: center;
          }
          .carCreat0 {
            background-color: #4186f4;
          }
          .carCreat1 {
            background-color: #ccc;
          }
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
