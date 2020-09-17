<template>
  <div class="VideoCheck mainBox">
    <div class="mainTop">
      <myTitle titleName="音视频巡检"></myTitle>
      <van-tabs @change="select(1)" color="#4683f1" swipeable v-model="searchData.state">
        <van-tab :key="index" :name="item.name" :title="item.title" v-for="(item, index) in tabList"></van-tab>
      </van-tabs>
    </div>
    <section class="mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
          <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
            <van-row :key="index" class="item" v-for="(item, index) in list" @click="handelItem(item)">
              <van-col span="6" style="height:85px;position:relative">
                <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item.videoImage" fit="cover" height="100%" style="width:100%;height:100%" width="100%" />
              </van-col>
              <van-col span="1"></van-col>
              <van-col span="17">
                <div class="top">
                  <p>
                    <van-image width="12px" :src="require('@/assets/image/file.png')" />
                    <span class="number" v-text="item.id"></span>
                  </p>
                  <span class="state-span delState" v-if="item.state == $dictionaries.videoCheck.update">整改</span>
                  <span class="state-span finishState" v-if="item.state == $dictionaries.videoCheck.finish">完成</span>
                  <span class="state-span waitcheckState" v-if="item.state == $dictionaries.videoCheck.waitCheck">待审核</span>
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
          name: this.$dictionaries.videoCheck.update,
          title: '整改'
        },
        {
          name: this.$dictionaries.videoCheck.waitCheck,
          title: '待审核'
        },
        {
          name: this.$dictionaries.videoCheck.finish,
          title: '已结案'
        }
      ],
      loading: false,
      refreshloading: false,
      finished: false,
      searchData: {
        limit: 10,
        page: 1,
        state: this.$dictionaries.videoCheck.update,
        projectId: ''
      }
    }
  },
  mounted() {
    this.searchData.projectId = this.$store.state.user.project.id
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
      this.$router.push({
        name: 'work-videoCheckDetail',
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
.VideoCheck {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
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
