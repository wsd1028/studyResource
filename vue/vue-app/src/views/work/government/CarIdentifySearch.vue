<template>
  <div class="workGov-carIdentifySearch mainBox">
    <div class="mainTop">
      <header>
        <van-icon @click="$router.go(-1)" color="#333" name="arrow-left" size="22" />
        <van-search input-align="center" placeholder="请输入车牌查询识别记录" shape="round" style="flex-grow:1" v-model="searchData.license" />
        <van-button size="small" type="primary">搜索</van-button>
      </header>
      <van-tabs @change="select(1)" color="#4683f1" v-model="searchData.occupancy">
        <van-tab name title="全部"></van-tab>
        <van-tab name="1" title="已建"></van-tab>
        <van-tab name="0" title="新建"></van-tab>
      </van-tabs>
    </div>
    <div class="lincenseBox mainBottom">
      <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
        <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
          <van-swipe-cell :key="index" v-for="(item, index) in list">
            <van-row class="item">
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
                </div>
                <div class="bottom">
                  <p>
                    运输企业:
                    <span v-text="item.transportCompanyName"></span>
                  </p>
                  <div class="dfsb">
                    <p>
                      安装GPS:
                      <span v-text="item.transportCompanyName"></span>
                    </p>
                    <p>
                      登记区县:
                      <span v-text="item.transportCompanyName"></span>
                    </p>
                  </div>
                  <p>
                    车主电话:
                    <span v-text="item.phone"></span>
                  </p>
                </div>
              </van-col>
            </van-row>
          </van-swipe-cell>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
</template>

<script>
import { getList } from '@/assets/js/commonAxios'

export default {
  components: {},
  data() {
    return {
      list: [
        {
          carPhoto: 'carPhoto'
        }
      ], //车辆识别列表
      loading: false, //加载
      refreshloading: false,
      finished: false, //完成
      searchData: {
        //车辆识别查询条件
        license: '',
        limit: 10,
        page: 1,
        projectId: '',
        occupancy: ''
      }
    }
  },
  methods: {
    //查询数据
    async select(page) {
      if (page) this.searchData.page = 1
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
      //  if (this.searchData.page == 1) {
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
    }
  },
  filters: {},
  mounted() {
    this.searchData.projectId = this.$store.state.user.project.projectId
  }
}
</script>

<style lang="less" scoped>
.workGov-carIdentifySearch {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  header {
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 10px;
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
