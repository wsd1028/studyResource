<template>
  <div class="government-directoriesWarnDetail mainBox">
    <div class="mainTop">
      <myTitle titleName="非名录车告警"></myTitle>
      <div class="projectName">
        <span class="box"></span>
        <span class="name textFlow">项目名称:{{ paramsData.name }}</span>
      </div>
      <van-tabs @change="select(1)" color="#4683f1" swipeable v-model="searchData.disposeState">
        <van-tab :name="$dictionaries.carWarn.hasCheck" title="已审核"></van-tab>
        <van-tab :name="$dictionaries.carWarn.waitCheck" title="未审核"></van-tab>
      </van-tabs>
    </div>
    <div class="all mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
          <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
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
                  <p>当前项目:{{ item.workplaceName }}</p>
                  <p>
                    创建时间:
                    <span v-text="item.violationDate"></span>
                  </p>
                </div>
              </van-col>
            </van-row>
          </van-list>
        </van-pull-refresh>
      </v-touch>
    </div>
  </div>
</template>

<script>
import { getList } from '@/assets/js/commonAxios'
export default {
  data() {
    return {
      active: 'no',
      paramsData: {},
      list: [],
      loading: false,
      refreshloading: false,
      finished: false,
      searchData: {
        limit: 10,
        page: 1,
        workplaceId: '',
        disposeState: this.$dictionaries.carWarn.waitCheck,
        type: this.$dictionaries.machineType.company
      }
    }
  },
  async mounted() {
    this.paramsData = this.$route.params
    this.searchData.workplaceId = this.$route.params.id
  },
  components: {},
  methods: {
    //滑动
    onSwipe(type) {
      if (type == 'right') {
        this.searchData.disposeState = this.$dictionaries.carWarn.hasCheck
      } else {
        this.searchData.disposeState = this.$dictionaries.carWarn.waitCheck
      }
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = `/carp/business/a/q/warning/list/page?disposeState=${this.searchData.disposeState}&code=${this.$dictionaries.warnType.car}&limit=${this.searchData.limit}&page=${this.searchData.page}&workplaceId=${this.searchData.workplaceId}`
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
    }
  }
}
</script>

<style lang="less" scoped>
.government-directoriesWarnDetail {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  .projectName {
    background-color: #fff;
    padding: 20px;
    line-height: 20px;
    font-weight: 700;
    font-size: 18px;
    display: flex;
    align-items: center;
    .box {
      height: 18px;
      width: 5px;
      background-color: #4186f6;
      flex-shrink: 0;
    }
    .name {
      flex-grow: 1;
      color: #4186f6;
      margin: 0 5px;
    }
  }
  .all {
    padding: 10px;
    background-color: #f9f9f9;
    .item {
      background-color: #fff;
      margin-bottom: 10px;
      padding: 10px;
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
