<template>
  <div class="workGov-electronicFormSearch mainBox">
    <header class="mainTop">
      <van-dropdown-menu>
        <van-dropdown-item :options="option" @change="changeSearchType" v-model="searchType" />
      </van-dropdown-menu>
      <van-search :placeholder="placeholder" @search="onSearch" clearable input-align="center" show-action style="flex-grow:1" v-model="searchData.plateNo">
        <template #action>
          <span @click="onCancel">返回</span>
        </template>
      </van-search>
    </header>
    <section class="mainBottom">
      <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
        <div class="projectBox" v-if="searchType == 0">
          <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
            <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
              <van-swipe-cell :key="index" v-for="(item, index) in list">
                <div @click="handelList(item)" class="projectItem">
                  <h3 v-text="item.projectName"></h3>
                  <p>所属区域：{{ item.areaName }}</p>
                  <van-divider />
                </div>
              </van-swipe-cell>
            </van-list>
          </van-pull-refresh>
        </div>
        <div class="lincenseBox" v-else>
          <van-pull-refresh @refresh="select(1)" v-model="refreshloading">
            <van-list :finished="finished" @load="select" finished-text="没有更多了" v-model="loading">
              <van-row :key="index" @click="handelDetail(item)" class="item" v-for="(item, index) in list">
                <van-col span="6" style="height:85px;position:relative">
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
            </van-list>
          </van-pull-refresh>
        </div>
      </v-touch>
    </section>
  </div>
</template>

<script>
import { getArea } from '@/assets/js/commonAxios'

export default {
  components: {},
  data() {
    return {
      areaList: [], //区域列表
      list: [], //车辆识别列表
      option: [
        { text: '项目', value: 0 },
        { text: '车辆', value: 1 }
      ],
      placeholder: '请输入项目名称',
      searchType: 0,
      loading: false, //加载
      refreshloading: false,
      finished: false, //完成
      searchData: {
        plateNo: '',
        limit: 10,
        page: 1,
        areaCode: '',
        name: ''
      }
    }
  },

  mounted() {
    this.searchData.areaCode = this.$store.state.user.user.accountTypeDto.code
  },
  methods: {
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
    //跳转联单列表
    handelList(params) {
      this.$router.push({
        name: 'workGov-electronicFormList',
        params
      })
    },
    //跳转联单详情
    handelDetail(params) {
      this.$router.push({
        name: 'workGov-electronicFormDetail',
        params
      })
    },
    //得到地区列表
    async getArea() {
      this.areaList = await getArea()
    },
    onSearch(val) {
      this.searchData.plateNo = val
      this.searchData.name = val
      this.select(1)
    },
    //取消搜索
    onCancel() {
      this.$router.go(-1)
    },
    //改变搜索类型
    changeSearchType(val) {
      if (val == 0) {
        this.placeholder = '请输入项目名称'
      } else {
        this.placeholder = '请输入车牌号'
      }
      this.select(1)
    },
    //查询数据
    async select(page) {
      if (page) {
        this.searchData.page = 1
      }
      if (!this.searchData.areaCode) this.searchData.areaCode = ''
      let url = ''
      if (this.searchType == 0) {
        //项目
        url = '/carp/business/a/q/project/area/name'
      } else {
        //车辆
        url = '/carp/business/a/q/electronic/workflow/government'
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
        if (this.list.length == resp.data.total) {
          // 数据全部加载完成
          this.finished = true
        }
      } else {
        this.$dialog.alert({
          message: '获取失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.workGov-electronicFormSearch {
  background-color: #f9f9f9;
  text-align: left;
  height: 100%;
  header {
    background-color: #fff;
    display: flex;
    align-items: center;
    padding: 0 10px;
  }
  .projectBox {
    .projectItem {
      background-color: #fff;
      padding: 10px 10px 0;
      line-height: 26px;
      margin-bottom: 10px;
      h3 {
        color: #343434;
        font-size: 16px;
        font-weight: 700;
      }
      p {
        color: #989898;
        font-size: 14px;
      }
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
