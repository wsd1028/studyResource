<template>
  <div class="work-carIdentify mainBox">
    <div class="mainTop">
      <div class="head">
        <myTitle titleName="车辆识别"></myTitle>
        <van-icon @click="goCreatForm" class="plusIcon" name="plus" v-if="!isAbsorption" />
      </div>
      <div class="msgBox">
        <div style="width:33%;text-align:center">
          <p class="label">全部车辆</p>
          <p class="titleOne" v-text="allCount.allNumber"></p>
        </div>
        <div style="width:33%;text-align:center">
          <p class="label">名录车</p>
          <p class="titleOne blue" v-text="allCount.carNumber"></p>
        </div>
        <div style="width:33%;text-align:center">
          <p class="label">非名录车</p>
          <p class="titleOne red" v-text="allCount.noNumber"></p>
        </div>
      </div>
      <van-search @search="select(1)" input-align="center" placeholder="请输入搜索车牌号" shape="round" show-action v-model="searchData.license">
        <template #action>
          <div @click="select(1)">搜索</div>
        </template>
      </van-search>
      <van-tabs @change="select(1)" color="#4683f1" v-model="searchData.occupancy">
        <van-tab :key="index" :name="item.name" :title="item.title" v-for="(item, index) in tabList"></van-tab>
      </van-tabs>
    </div>
    <section class="lincenseBox mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
          <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
            <van-row :key="index" class="item" v-for="(item, index) in list">
              <van-col span="6" style="height:85px;position:relative">
                <div class="jin" v-if="item.direction == $dictionaries.direction.jin">进</div>
                <div class="chu" v-if="item.direction == $dictionaries.direction.chu">出</div>
                <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item.carPhoto" fit="cover" height="100%" style="width:100%;height:100%" width="100%" />
              </van-col>
              <van-col span="1"></van-col>
              <van-col span="17">
                <div class="top">
                  <p>
                    <span v-text="item.license"></span>
                    <span class="carTag0" v-if="item.carState">名录车</span>
                    <span class="carTag1" v-if="!item.carState">非名录车</span>
                  </p>
                  <p class="carCreat">
                    <span @click="create(item)" class="carCreat0" v-if="!item.occupancy && item.direction == $dictionaries.direction.chu">新建</span>
                    <span class="carCreat1" v-if="item.occupancy && item.direction == $dictionaries.direction.chu">已建</span>
                  </p>
                </div>
                <div class="bottom">
                  <p>
                    运输企业:
                    <span v-text="item.transportCompanyName"></span>
                  </p>
                  <p>
                    排放企业:
                    <span v-text="item.projectCompanyName"></span>
                  </p>
                  <p>
                    创建时间:
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
import { getList } from '@/assets/js/commonAxios'

export default {
  components: {},
  data() {
    return {
      allCount: {},
      list: [], //车辆识别列表
      tabList: [
        {
          name: '',
          title: '全部'
        },
        {
          name: '1',
          title: '已建'
        },
        {
          name: '0',
          title: '新建'
        }
      ],
      loading: false, //加载
      isAbsorption: false,
      refreshloading: false,
      finished: false, //完成
      searchData: {
        //车辆识别查询条件
        license: '',
        limit: 10,
        page: 1,
        workplaceId: '',
        workplaceType: this.$dictionaries.machineType.company,
        occupancy: ''
      }
    }
  },
  mounted() {
    this.searchData.workplaceId = this.$store.state.user.user.accountTypeDto.ancillaryId
    if (this.$store.state.user.user.accountTypeDto.type == this.$dictionaries.userType.garbage) {
      this.searchData.type = this.$dictionaries.machineType.garbage
      this.isAbsorption = true
    }
    this.getCount()
  },
  methods: {
    //滑动
    onSwipe(type) {
      let length = this.tabList.length
      let index = 0
      for (let i = 0; i < length; i++) {
        if (this.tabList[i].name == this.searchData.occupancy) {
          index = i
        }
      }
      if (type == 'left') {
        if (index != length - 1) {
          this.searchData.occupancy = this.tabList[index + 1].name
        }
      }
      if (type == 'right') {
        if (index != 0) {
          this.searchData.occupancy = this.tabList[index - 1].name
        }
      }
    },
    //得到统计数据
    async getCount() {
      let resp = await this.$http.get(
        `/carp/business/a/q/license/record/statistics?workplaceId=${this.searchData.workplaceId}&year=${this.$moment().format('YYYY')}`
      )
      if (resp.code == 0) {
        this.allCount = resp.data
      } else {
        this.$dialog.alert({
          message: '获取统计数据失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = '/carp/business/a/q/license/record/current/page'
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '车辆识别', this.searchData)
      this.list = result.list
      this.searchData.page = result.page
      this.refreshloading = result.refreshloading
      this.loading = result.loading
      this.finished = result.finished
      //let resp = await this.$http.get('/carp/business/a/q/license/record/current/page', {
      //  params: this.searchData
      //})
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
      //  }
      //} else {
      //  this.$dialog.alert({
      //    message: '获取车辆识别失败:' + resp.message,
      //    confirmButtonColor: 'red'
      //  })
      //}
    },
    //跳转联单点检界面
    create(item) {
      this.$router.push({
        name: 'formDetail',
        params: {
          createDate: item.createDate,
          id: item.id,
          projectId: this.searchData.workplaceId
        }
      })
    },
    //跳转创建联单界面
    goCreatForm() {
      this.$router.push({
        name: 'createForm',
        params: {
          license: ''
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.work-carIdentify {
  background-color: #f9f9f9;
  min-height: 100%;
  .msgBox {
    padding: 10px 10px 0;
    background-color: #fff;
    display: flex;
    .label {
      color: #c5c5c5;
      font-size: 16px;
    }
    .red {
      color: #fa302b;
    }
    .blue {
      color: #3882ea;
    }
    .green {
      color: #0cc15d;
    }
  }
  .head {
    position: relative;
    .plusIcon {
      position: absolute;
      right: 20px;
      z-index: 999;
      top: 6px;
      font-size: 29px;
      color: #666;
    }
  }
  .lincenseBox {
    padding: 0;
    .item {
      background-color: #fff;
      margin-bottom: 10px;
      padding: 15px;
      padding-left: 20px;
      text-align: left;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
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
        }
      }
    }
  }
}
</style>
