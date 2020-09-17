<template>
  <div class="government-dustwarn mainBox">
    <div class="mainTop">
      <myTitle titleName="扬尘噪声"></myTitle>
      <van-tabs @change="select(1)" color="#4683f1" swipeable v-model="searchData.areaCode">
        <van-tab :key="index" :name="item.value" :title="item.text" v-for="(item, index) in areaList"></van-tab>
      </van-tabs>
      <div class="header">
        <van-dropdown-menu>
          <van-dropdown-item :options="option" @change="select(1)" v-model="searchData.type" />
        </van-dropdown-menu>
        <van-search @search="select(1)" label placeholder="请输入项目名称" show-action style="flex-grow:1" v-model="searchData.name">
          <template #action>
            <div @click="select(1)">搜索</div>
          </template>
        </van-search>
      </div>
    </div>
    <section class="all mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
          <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
            <div :key="index" @click="handelItem(item)" class="item" v-for="(item, index) in list">
              <div class="left">
                <div>
                  <span class="projectName" v-text="item.projectName"></span>
                </div>
                <p>
                  项目地址:
                  <span v-text="item.address"></span>
                </p>
              </div>
              <div class="rightIcon">
                <van-icon color="#d2d2d2" name="arrow" size="30" />
              </div>
            </div>
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
      option: [
        { text: '所有', value: 0 },
        { text: '扬尘', value: 1 }
      ],
      list: [],
      areaList: [],
      loading: false,
      refreshloading: false,
      finished: false,
      searchData: {
        limit: 10,
        page: 1,
        name: '',
        areaCode: '',
        type: 1 //1扬尘,0全部
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
    //点击查看详情
    handelItem(data) {
      this.$router.push({
        name: 'government-dustDevice',
        params: data
      })
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = '/carp/business/a/q/project/area/name'
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '项目', this.searchData)
      this.list = result.list
      this.searchData.page = result.page
      this.refreshloading = result.refreshloading
      this.loading = result.loading
      this.finished = result.finished
    }
  }
}
</script>

<style lang="less">
.government-dustwarn {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  .header {
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 10px;
    width: 100%;
  }
  .van-info {
    top: 12px;
    right: -11px;
  }
  .all {
    .item {
      background-color: #fff;
      margin-bottom: 10px;
      padding: 10px;
      justify-content: space-between;
      align-items: center;
      display: flex;
      .rightIcon {
        text-align: center;
        height: 100%;
        width: 50px;
      }
      .projectName {
        color: #333;
        font-weight: bold;
        font-size: 18px;
      }
    }
  }
}
</style>
