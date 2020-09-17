<template>
  <div class="dispatch mainBox">
    <div class="mainTop">
      <myTitle titleName="督办派单"></myTitle>
      <van-tabs @change="select(1)" color="#4683f1" swipeable v-model="searchData.state">
        <van-tab :key="index" :name="item.name" :title="item.title" v-for="(item, index) in tabList"></van-tab>
      </van-tabs>
    </div>
    <section class="mainBottom">
      <div class="box lincenseBox">
        <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
          <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
            <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
              <van-swipe-cell :key="index" v-for="(item, index) in list">
                <van-row @click="handelItem(item)" class="item">
                  <van-col span="24">
                    <div class="top">
                      <div class="top-left">
                        <p class="textFlowP">
                          <span class="textFlow">督办案件:{{ item.id }}</span>
                        </p>
                        <span class="nofinish" v-if="item.finishType == $dictionaries.dispatch.finishNo">未完成</span>
                        <span class="finish" v-if="item.finishType == $dictionaries.dispatch.finishYes">完成</span>
                      </div>
                      <p class="carCreat">
                        <span class="state-span waitState" v-if="item.accountState == $dictionaries.dispatch.wait">待处理</span>
                        <span class="state-span waitState" v-if="item.accountState == $dictionaries.dispatch.handleing">处理中</span>
                        <span
                          class="state-span finishState"
                          v-if="item.accountState == $dictionaries.dispatch.finish && item.state != $dictionaries.dispatch.finish"
                        >
                          <!--eslint-->
                          已处理
                        </span>
                      </p>
                    </div>
                    <div class="bottom">
                      <p>
                        案件地址:
                        <span v-text="item.address"></span>
                      </p>
                      <div class="dfsb">
                        <p>
                          处理人:
                          <span v-text="item.manager"></span>
                        </p>
                        <p>
                          创建时间:
                          <span v-text="item.createDate"></span>
                        </p>
                      </div>
                      <p class="stateP">
                        案件状态:
                        <span class="wait-span" v-if="item.state == $dictionaries.dispatch.wait">待处理</span>
                        <span class="handleing-span" v-if="item.state == $dictionaries.dispatch.handleing">处理中</span>
                        <span class="waitcheck-span" v-if="item.state == $dictionaries.dispatch.waitCheck">待审核</span>
                        <span class="update-span" v-if="item.state == $dictionaries.dispatch.reject">已驳回</span>
                        <span class="finish-span" v-if="item.state == $dictionaries.dispatch.finish">已结案</span>
                        <span class="update-span" v-if="item.state == $dictionaries.dispatch.cancel">已作废</span>
                      </p>
                    </div>
                  </van-col>
                </van-row>
              </van-swipe-cell>
            </van-list>
          </van-pull-refresh>
        </v-touch>
      </div>
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
          name: this.$dictionaries.dispatch.wait,
          title: '待处理'
        },
        {
          name: this.$dictionaries.dispatch.handleing,
          title: '处理中'
        },
        {
          name: this.$dictionaries.dispatch.finish,
          title: '已处理'
        }
      ],
      loading: false,
      refreshloading: false,
      finished: false,
      searchData: {
        limit: 10,
        page: 1,
        accountId: '',
        state: this.$dictionaries.dispatch.wait
      }
    }
  },
  mounted() {
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
    goBack() {
      this.$router.go(-1)
    },
    //新建督办派单
    handelCreat() {
      this.$router.push({
        name: 'dispatchCreate'
      })
    },
    //跳转到督办派单详情
    handelItem(params) {
      this.$router.push({
        name: 'dispatchDetail',
        params
      })
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = '/carp/business/a/q/task/accountId'
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '督办派单', this.searchData)
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
.dispatch {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  .handleing-span {
    color: #3983f3;
  }
  .waitcheck-span {
    color: #f49b45;
  }
  .finish-span {
    color: #3df39a;
  }
  .wait-span {
    color: #3983f3;
  }
  .update-span {
    color: #fa3e3a;
  }
  .finish {
    border-radius: 4px;
    background-color: #3a87f2;
    color: #fff;
    padding: 0 5px;
    font-size: 14px;
    flex-shrink: 0;
  }
  .nofinish {
    border-radius: 4px;
    background-color: #f49b45;
    color: #fff;
    padding: 0 5px;
    font-size: 14px;
    flex-shrink: 0;
  }
  section {
    .item {
      background-color: #fff;
      padding: 10px;
      margin: 10px 10px 0;
    }
  }
  .lincenseBox {
    background-color: #f9f9f9;
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
        .top-left {
          flex-grow: 1;
          overflow: hidden;
          display: flex;
          align-items: center;
          font-weight: 600;
          justify-content: space-between;
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
      .stateP {
        font-weight: 600;
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
