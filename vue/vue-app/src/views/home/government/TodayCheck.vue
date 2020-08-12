<template>
  <div class="government-todayCheck mainBox">
    <div class="mainTop">
      <myTitle titleName="每日巡检"></myTitle>
      <van-tabs @change="select(1)" color="#4683f1" swipeable v-model="searchData.state">
        <van-tab :key="index" :name="item.name" :title="item.title" v-for="(item, index) in tabList"></van-tab>
      </van-tabs>
      <van-radio-group @change="select(1)" direction="horizontal" style="padding:10px" v-model="searchData.departmentState">
        <van-radio :name="$dictionaries.machineType.company">项目</van-radio>
        <van-radio :name="$dictionaries.machineType.garbage">消纳站</van-radio>
      </van-radio-group>
    </div>
    <section class="mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
          <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
            <div :key="index" @click="handelItem(item)" class="item" v-for="(item, index) in list">
              <div class="top">
                <div class="left">
                  <van-icon class-prefix="iconfont" color="#3f8ee5" name="jiancha" size="20" />
                  <p class="textFlowP">
                    <span class="projectName textFlow" v-text="item.name"></span>
                  </p>
                </div>
                <p class="carCreat">
                  <span class="state-span waitState" v-if="item.state == $dictionaries.todayCheck.waitCheck">审核</span>
                  <span class="state-span finishState" v-if="item.state == $dictionaries.todayCheck.finish">已结案</span>
                  <span class="state-span updateState" v-if="item.state == $dictionaries.todayCheck.update">整改</span>
                </p>
              </div>
              <div class="bottom">
                <van-row gutter="10">
                  <van-col class="left" span="24">
                    <p>
                      巡检人:
                      <span v-text="item.checkPeopleName"></span>
                    </p>
                    <p>
                      巡检地址:
                      <span v-text="item.address"></span>
                    </p>
                    <p>
                      创建时间:
                      <span v-text="item.createDate"></span>
                    </p>
                  </van-col>
                </van-row>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </v-touch>
    </section>
    <div @click="handelCreat" class="iconBox">
      <van-icon name="plus" />
    </div>
  </div>
</template>

<script>
import { getList } from '@/assets/js/commonAxios'

export default {
  data() {
    return {
      mainData: {},
      list: [],
      tabList: [
        {
          name: '',
          title: '全部'
        },
        {
          name: this.$dictionaries.todayCheck.update,
          title: '整改'
        },
        {
          name: this.$dictionaries.todayCheck.waitCheck,
          title: '待审核'
        },
        {
          name: this.$dictionaries.todayCheck.finish,
          title: '结案'
        }
      ],
      loading: false,
      refreshloading: false,
      finished: false,
      searchData: {
        limit: 10,
        page: 1,
        areaCode: 0,
        departmentState: this.$dictionaries.machineType.company,
        state: this.$dictionaries.todayCheck.waitCheck
      }
    }
  },
  async mounted() {
    this.searchData.areaCode = this.$store.state.user.user.accountTypeDto.code
  },
  components: {},
  methods: {
    //滑动
    onSwipe(type) {
      let length = this.tabList.length
      let index = 0
      for (let i = 0; i < length; i++) {
        if (this.tabList[i].name == this.searchData.state) {
          index = i
        }
      }
      if (type == 'left') {
        if (index != length - 1) {
          this.searchData.state = this.tabList[index + 1].name
        }
      }
      if (type == 'right') {
        if (index != 0) {
          this.searchData.state = this.tabList[index - 1].name
        }
      }
    },
    //新建每日巡检
    handelCreat() {
      this.$router.push({
        name: 'government-todayCheckCreate'
      })
    },
    getImg(item, index) {
      try {
        return this.$dictionaries.imgBaseUrl2 + item.imageUrl[index]
      } catch {
        return ''
      }
    },
    //点击审核
    handelCheck(params) {
      this.$router.push({
        name: 'government-todayChecking',
        params
      })
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation()
    },
    //跳转到每日巡检详情
    handelItem(params) {
      if (params.state == this.$dictionaries.todayCheck.waitCheck) {
        this.handelCheck(params)
      } else {
        this.$router.push({
          name: 'government-todayCheckDetail',
          params
        })
      }
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = page
      }
      let url = '/carp/business/a/q/todays/check/page'
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '每日巡检', this.searchData)
      this.list = result.list
      this.searchData.page = result.page
      this.refreshloading = result.refreshloading
      this.loading = result.loading
      this.finished = result.finished
      //let resp = await this.$http.get('/carp/business/a/q/todays/check/page', {
      //  params: this.searchData
      //})
      //if (resp.code == 0) {
      //  if (this.searchData.page) {
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
      //    message: '获取每日巡检失败:' + resp.message,
      //    confirmButtonColor: 'red'
      //  })
      //}
    }
  }
}
</script>

<style lang="less" scoped>
.government-todayCheck {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  section {
    .item {
      background-color: #fff;
      margin-top: 10px;
      padding: 10px;
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .left {
          flex-grow: 1;
          display: flex;
          overflow: hidden;
        }
        .projectName {
          color: #333;
          font-weight: bold;
          font-size: 18px;
          margin-left: 5px;
        }
        .carCreat {
          flex-shrink: 0;
        }
      }
      .bottom {
        margin-top: 10px;
        .left {
          color: #949494;
          p {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 14px;
            line-height: 23px;
          }
        }
      }
    }
  }
  .myDia {
    padding: 10px;
    padding-top: 20px;
    height: 80%;
    display: flex;
    flex-direction: column;
    .top {
      flex-shrink: 0;
    }
    .searchList {
      flex-grow: 1;
      overflow: auto;
      .searchItem {
        border-bottom: 1px solid #efefef;
        padding: 10px;
        .projectName {
          font-size: 16px;
          color: #313131;
        }
        .projectAddress {
          margin-top: 10px;
          color: #929292;
          font-size: 14px;
        }
      }
    }
  }
  .iconBox {
    position: fixed;
    right: 40px;
    bottom: 40px;
    i {
      background-color: #4186fc;
      color: #fff;
      font-weight: 800;
      font-size: 24px;
      width: 50px;
      height: 50px;
      border-radius: 100%;
      line-height: 50px;
      text-align: center;
      display: inline-block;
    }
  }
}
</style>
