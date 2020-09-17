<template>
  <div class="government-streamingMedia mainBox">
    <div class="mainTop">
      <myTitle titleName="流媒体视频"></myTitle>
      <van-search @search="select(1)" input-align="center" placeholder="请输入搜索关键词" shape="round" show-action v-model="searchData.likeName">
        <template #action>
          <div @click="select(1)">搜索</div>
        </template>
      </van-search>
    </div>
    <section class="mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
          <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
            <div :key="index" class="item" v-for="(item, index) in list">
              <div class="top">
                <p>
                  <van-image :src="require('@/assets/image/video.png')" height="18" style="margin-right:10px; flex-shrink: 0;" width="18" />
                  {{ item.name }}
                </p>
                <span @click="handelItem(item)" :class="['state-span', item.status ? 'finishState' : 'cancelState']">播放</span>
              </div>
              <div class="bottom">
                <p>
                  <span>设备状态:</span>
                  <span style="color:#2BE356" v-if="item.status">在线</span>
                  <span style="color:#F44242" v-else>离线</span>
                </p>
                <p>
                  <span>摄像头类型:</span>
                  <span>{{ item.cameraTypeName }}</span>
                </p>
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
  components: {},
  data() {
    return {
      list: [], //车辆识别列表
      loading: false, //加载
      refreshloading: false,
      finished: false, //完成
      searchData: {
        //车辆识别查询条件
        likeName: '',
        limit: 10,
        page: 1
      }
    }
  },
  mounted() {},
  methods: {
    //点击每一项,跳转详情界面
    handelItem(params) {
      if (!params.status) return
      this.$router.push({
        name: 'government-streamingMediaShow',
        params
      })
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
        this.list = []
      }
      let url = '/carp/business/a/q/business/mserverchannel/list'
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '流媒体', this.searchData)
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
.government-streamingMedia {
  text-align: left;
  min-height: 100%;
  background-color: #f9f9f9;
  .item {
    padding: 10px;
    background-color: #fff;
    .top {
      display: flex;
      align-items: center;
      color: #333;
      justify-content: space-between;
      .state-span {
        flex-shrink: 0;
      }
      p {
        display: flex;
        align-items: center;
      }
    }
    .bottom {
      display: flex;
      justify-content: space-between;
      color: #999999;
      margin-top: 20px;
      padding-right: 40px;
    }
  }
}
</style>
