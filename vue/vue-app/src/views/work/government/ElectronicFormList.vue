<template>
  <div class="workGov-electronicFormList mainBox">
    <div class="mainTop">
      <header>
        <van-nav-bar @click-left="$router.go(-1)" class="nav" title="电子联单">
          <template #left>
            <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
          </template>
        </van-nav-bar>
      </header>
      <van-search @search="select(1)" input-align="center" placeholder="请输入车牌号" shape="round" v-model="searchData.plateNo" />
    </div>
    <div class="lincenseBox mainBottom">
      <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
        <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
          <van-swipe-cell :key="index" v-for="(item, index) in list">
            <van-row @click="handelDetail(item)" class="item">
              <van-col span="6" style="height:85px;position:relative">
                <div class="jin" v-if="item.direction == $dictionaries.direction.jin">进</div>
                <div class="chu" v-if="item.direction == $dictionaries.direction.chu">出</div>
                <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item.carPhoto" fit="cover" height="100%" style="width:100%;height:100%" width="100%" />
              </van-col>
              <van-col span="1"></van-col>
              <van-col span="17">
                <div class="top">
                  <p>
                    <span v-text="item.licenseNumber"></span>
                    <span class="carTag0" v-if="item.carState">名录车</span>
                    <span class="carTag1" v-if="!item.carState">非名录车</span>
                  </p>
                </div>
                <div class="bottom">
                  <p>
                    项目名称:
                    <span v-text="item.projectName"></span>
                  </p>
                  <div class="dfsb">
                    <p>
                      所属区县:
                      <span v-text="item.projectAreaName"></span>
                    </p>
                  </div>
                  <p>
                    创建时间:
                    <span v-text="item.createDate"></span>
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
  data() {
    return {
      loading: false,
      refreshloading: false,
      finished: false,
      list: [],
      paramsData: {},
      searchData: {
        page: 1,
        limit: 10,
        plateNo: '', //车牌号
        state: '', //状态
        projectId: ''
      }
    }
  },
  mounted() {
    this.paramsData = this.$route.params
    this.searchData.projectId = this.$route.params.projectId
  },
  components: {},
  methods: {
    //跳转联单详情
    handelDetail(params) {
      this.$router.push({
        name: 'workGov-electronicFormDetail',
        params
      })
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      let url = '/carp/business/a/q/electronic/workflow/project'
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '电子联单', this.searchData)
      this.list = result.list
      this.searchData.page = result.page
      this.refreshloading = result.refreshloading
      this.loading = result.loading
      this.finished = result.finished
      //let resp = await this.$http.get('/carp/business/a/q/electronic/workflow/project', {
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
      //    message: '获取电子联单失败:' + resp.message,
      //    confirmButtonColor: 'red'
      //  })
      //}
    }
  }
}
</script>
<style lang="less" scoped>
.workGov-electronicFormList {
  background: #f9f9f9;
  height: 100%;
  header {
    background-color: #fff;
    .nav {
      text-align: left;
      line-height: 42px;
      i {
        color: #666;
      }
      .van-nav-bar__title {
        font-weight: 800;
        font-size: 18px !important;
      }
    }
  }
  .lincenseBox {
    padding: 0;
    margin-top: 30px;
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
