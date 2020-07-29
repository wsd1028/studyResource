<template>
  <div class="work-electronicForm mainBox">
    <div class="mainTop">
      <div class="head">
        <myTitle titleName="电子联单"></myTitle>
        <van-icon @click="$router.push({ path: '/main/createForm' })" class="plusIcon" name="plus" v-if="!isAbsorption" />
      </div>
      <van-search @search="select(1)" input-align="center" placeholder="请输入车牌号" shape="round" show-action v-model="searchData.plateNo">
        <template #action>
          <div @click="select(1)">搜索</div>
        </template>
      </van-search>
      <van-tabs @change="select(1)" color="#4683f1" v-model="searchData.state">
        <van-tab :key="index" :name="item.name" :title="item.title" v-for="(item, index) in tabList"></van-tab>
      </van-tabs>
    </div>
    <section class="bot mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
          <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
            <van-card :key="index" :thumb="$dictionaries.imgBaseUrl2 + item.carPhoto || 'photo'" @click="handelDetail(item)" v-for="(item, index) in list">
              <div slot="title" style="font-size:15px;font-weight:800">
                <van-row>
                  <van-col span="12" v-text="item.licenseNumber"></van-col>
                  <van-col class="dfsb" span="12">
                    <van-tag plain round type="success" v-if="item.carState">名录车</van-tag>
                    <van-tag plain round type="danger" v-else>非名录车</van-tag>
                    <van-tag plain round type="primary" v-if="item.state == $dictionaries.electronic.xiaona">完成</van-tag>
                    <van-tag plain round type="primary" v-if="item.state == $dictionaries.electronic.yunshu && !isAbsorption">运输中</van-tag>
                    <van-tag type="primary" v-if="isAbsorption && item.state == $dictionaries.electronic.yunshu">运输中</van-tag>
                  </van-col>
                </van-row>
              </div>
              <div slot="tags">
                <van-row style="display:flex">
                  <van-col span="8">运输企业:</van-col>
                  <van-col span="16">
                    <span class="textFlow" v-text="item.companyName"></span>
                  </van-col>
                </van-row>
                <van-row style="display:flex">
                  <van-col span="8">项目名称:</van-col>
                  <van-col span="16">
                    <span class="textFlow" v-text="item.projectName"></span>
                  </van-col>
                </van-row>
                <van-row style="display:flex">
                  <van-col span="8">创建时间:</van-col>
                  <van-col span="16">
                    <span class="textFlow" v-text="item.createDate"></span>
                  </van-col>
                </van-row>
              </div>
            </van-card>
          </van-list>
        </van-pull-refresh>
      </v-touch>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: false,
      refreshloading: false,
      finished: false,
      list: [],
      tabList: [
        {
          name: '',
          title: '全部'
        },
        {
          name: this.$dictionaries.electronic.yunshu,
          title: '运输中'
        },
        {
          name: this.$dictionaries.electronic.xiaona,
          title: '已消纳'
        }
      ],
      isAbsorption: false, //是否为消纳员
      searchData: {
        page: 1,
        limit: 10,
        plateNo: '',
        state: '',
        projectId: '',
        garbageStationId: '' //消纳场id
      }
    }
  },
  mounted() {
    if (this.$store.state.user.user.accountTypeDto.type === this.$dictionaries.userType.garbage) {
      this.isAbsorption = true
      this.searchData.garbageStationId = this.$store.state.user.user.accountTypeDto.ancillaryId
    } else {
      this.searchData.projectId = this.$store.state.user.project.projectId
    }
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
    //点击详情
    handelDetail(item) {
      if (this.isAbsorption && item.state == this.$dictionaries.electronic.yunshu) {
        this.handelForm(item)
      } else {
        this.$router.push({
          name: 'projectFormDetail',
          params: item
        })
      }
    },
    //点击运输中
    handelForm(item) {
      //判断账号权限是否为消纳员
      if (this.isAbsorption) {
        //消纳员
        this.$router.push({
          name: 'formDetailGiven',
          params: {
            ...item
          }
        })
      }
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation()
    },
    //查询列表数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = '/carp/business/a/q/electronic/workflow/project'
      if (this.isAbsorption) {
        url = '/carp/business/a/q/electronic/workflow/station'
      }
      let resp = await this.$http.get(url, {
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
        if (this.list.length >= resp.data.total) {
          // 数据全部加载完成
          this.finished = true
        }
      } else {
        this.$dialog.alert({
          message: '获取信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.work-electronicForm {
  background: #f9f9f9;
  min-height: 100%;
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
  .van-notice-bar {
    background-color: #fff;
  }
  .van-card {
    background-color: #fff;
    font-size: 14px;
  }
  .van-card__title {
    background: #74a8d8;
  }
}
</style>
