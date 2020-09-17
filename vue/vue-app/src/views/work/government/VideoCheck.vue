<template>
  <div class="gov-videoCheck mainBox">
    <div class="mainTop">
      <myTitle titleName="音视频巡检"></myTitle>
      <van-tabs @change="select(1)" color="#4683f1" v-model="searchData.areaCode">
        <van-tab :key="index" :name="item.value" :title="item.text" v-for="(item, index) in areaList"></van-tab>
      </van-tabs>
    </div>
    <section class="mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
          <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
            <van-row :key="index" @click="handelItem(item)" class="item" v-for="(item, index) in list">
              <van-col span="6" style="height:85px;position:relative">
                <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item.videoImage" fit="cover" height="100%" style="width:100%;height:100%" width="100%" />
              </van-col>
              <van-col span="1"></van-col>
              <van-col span="17">
                <div class="top">
                  <p class="left textFlowP">
                    <van-image :src="require('@/assets/image/file.png')" width="12px" />
                    <span class="number textFlow" v-text="item.id"></span>
                  </p>
                  <span class="state-span delState" v-if="item.state == $dictionaries.videoCheck.update">整改</span>
                  <span class="state-span finishState" v-if="item.state == $dictionaries.videoCheck.finish">完成</span>
                  <span class="state-span waitState" v-if="item.state == $dictionaries.videoCheck.waitCheck">待审核</span>
                </div>
                <p class="textFlowP">
                  <span class="textFlow" style="color:#343434;font-size:14px">巡检项目：{{ item.name }}</span>
                </p>
                <div class="bottom">
                  <p>
                    巡检人:
                    <span v-text="item.checkPeopleName"></span>
                  </p>
                  <p>
                    巡检时间:
                    <span v-text="item.createDate"></span>
                  </p>
                </div>
              </van-col>
            </van-row>
          </van-list>
        </van-pull-refresh>
      </v-touch>
    </section>
  </div>
</template>

<script>
import { getArea, getList } from '@/assets/js/commonAxios'

export default {
  data() {
    return {
      list: [],
      areaList: [],
      loading: false,
      refreshloading: false,
      finished: false,
      searchData: {
        limit: 10,
        page: 1,
        areaCode: ''
      }
    }
  },
  mounted() {
    this.searchData.areaCode = this.$store.state.user.user.accountTypeDto.code
    this.getArea()
  },
  components: {},
  methods: {
    //得到地区列表
    async getArea() {
      this.areaList = await getArea()
    },
    //滑动
    onSwipe(type) {
      let length = this.areaList.length
      let index = 0
      for (let i = 0; i < length; i++) {
        if (this.areaList[i].value == this.searchData.areaCode) {
          index = i
        }
      }
      if (type == 'left') {
        if (index != length - 1) {
          this.searchData.areaCode = this.areaList[index + 1].value
        }
      }
      if (type == 'right') {
        if (index != 0) {
          this.searchData.areaCode = this.areaList[index - 1].value
        }
      }
    },
    //点击每一项,跳转详情界面
    handelItem(params) {
      this.$router.push({
        name: params.state == this.$dictionaries.videoCheck.waitCheck ? 'government-videoChecking' : 'work-videoCheckDetail',
        params
      })
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = '/carp/business/a/q/video/check/page'
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '音视频巡检', this.searchData)
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
.gov-videoCheck {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  .state-span {
    flex-shrink: 0;
  }
  section {
    .item {
      background-color: #fff;
      margin-top: 10px;
      padding: 10px;
      .number {
        color: #343434;
        font-size: 14px;
        font-weight: 700;
        margin-left: 10px;
      }
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          flex-grow: 1;
          display: flex;
          align-items: center;
        }
        .projectName {
          color: #333;
          font-weight: bold;
          font-size: 18px;
        }
      }
      .bottom {
        display: flex;
        justify-content: space-between;
        p {
          font-size: 12px;
          line-height: 23px;
          margin-top: 5px;
          color: #9a9a9a;
        }
      }
    }
  }
}
</style>
