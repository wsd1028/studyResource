<template>
  <div class="company-appointCheck mainBox">
    <div class="mainTop">
      <myTitle titleName="指派点检"></myTitle>
      <van-tabs @change="select(1)" color="#4683f1" swipeable v-model="searchData.state">
        <van-tab :key="index" :name="item.name" :title="item.title" v-for="(item, index) in tabList"></van-tab>
      </van-tabs>
    </div>
    <section class="mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
          <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
            <div :key="index" @click="handelItem(item)" class="item" v-for="(item, index) in list">
              <div class="top">
                <div class="textFlowP">
                  <span class="projectName textFlow" v-text="item.workStationName"></span>
                </div>
                <p class="carCreat">
                  <span class="state-span waitState" v-if="item.state == $dictionaries.appointCheck.waitCheck">待审核</span>
                  <span class="state-span updateState" v-if="item.state == $dictionaries.appointCheck.update">待检</span>
                  <span class="state-span finishState" v-if="item.state == $dictionaries.appointCheck.finish">已结案</span>
                  <span class="state-span cancelState" v-if="item.state == $dictionaries.appointCheck.cancel">已作废</span>
                </p>
              </div>
              <div class="bottom">
                <van-row gutter="10">
                  <van-col class="left" span="24">
                    <p>
                      地址:
                      <span v-text="item.workStationAddress"></span>
                    </p>
                    <p>
                      创建时间:
                      <span style="marginRight:20px" v-text="item.createDate"></span>巡检人:
                      <span v-text="item.manager"></span>
                    </p>
                  </van-col>
                </van-row>
              </div>
            </div>
          </van-list>
        </van-pull-refresh>
      </v-touch>
    </section>
  </div>
</template>

<script>
import { getList } from '@/assets/js/commonAxios'

export default {
  data() {
    return {
      list: [],
      tabList: [
        {
          name: '',
          title: '全部'
        },
        {
          name: this.$dictionaries.appointCheck.update,
          title: '待检'
        },
        {
          name: this.$dictionaries.appointCheck.waitCheck,
          title: '待审核'
        },
        {
          name: this.$dictionaries.appointCheck.finish,
          title: '已结案'
        },
        {
          name: this.$dictionaries.appointCheck.cancel,
          title: '已作废'
        }
      ],
      loading: false,
      refreshloading: false,
      finished: false,
      project: {},
      searchData: {
        limit: 10,
        page: 1,
        state: this.$dictionaries.appointCheck.update,
        accountId: '',
        areaCode: ''
      }
    }
  },
  mounted() {
    this.project = this.$store.state.user.project
    this.searchData.accountId = this.$store.state.user.user.id
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
    //点击每一项,跳转详情界面
    handelItem(params) {
      if (params.state == this.$dictionaries.appointCheck.update) {
        this.handelSetting(params)
      } else {
        this.$router.push({
          name: 'company-appointCheckDetail',
          params
        })
      }
    },
    //点击处理
    handelSetting(params) {
      this.$router.push({
        name: 'company-appointCheckSetting',
        params
      })
      //阻止冒泡
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation()
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = '/carp/business/a/q/command/check/list'
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '指派点检', this.searchData)
      this.list = result.list
      this.searchData.page = result.page
      this.refreshloading = result.refreshloading
      this.loading = result.loading
      this.finished = result.finished
      //let resp = await this.$http.get(`/carp/business/a/q/command/check/list`, {
      //  params: this.searchData
      //})
      //if (resp.code == 0) {
      //  if (page) {
      //    this.list = []
      //  }
      //  this.list = this.list.concat(resp.data.records)
      //  this.loading = false
      //  this.refreshloading = false
      //  this.searchData.page = this.searchData.page + 1
      //  if (this.list.length == resp.data.total) {
      //    this.finished = true
      //  } else {
      //    this.finished = false
      //  }
      //} else {
      //  this.$dialog.alert({
      //    message: '获取指派点检失败:' + resp.message,
      //    confirmButtonColor: 'red'
      //  })
      //}
    }
  }
}
</script>

<style lang="less" scoped>
.company-appointCheck {
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
        .projectName {
          color: #333;
          font-weight: bold;
          font-size: 18px;
        }
      }
      .bottom {
        .left {
          color: #949494;
          p {
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            font-size: 14px;
            line-height: 23px;
            margin-top: 5px;
          }
        }
      }
    }
  }
}
</style>
