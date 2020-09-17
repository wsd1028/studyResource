<template>
  <div class="government-ChooseWorkplace">
    <van-popup class="myDia" position="top" v-model="searchDia">
      <div class="top">
        <van-search @cancel="onCancel" @search="onSearch(1)" placeholder="请输入搜索关键词" show-action v-model="searchData.searchValue" />
        <van-tabs @change="onSearch(1)" color="#4683f1" v-model="searchData.searchCode">
          <van-tab :key="index" :name="item.value" :title="item.text" v-for="(item, index) in areaList"></van-tab>
        </van-tabs>
      </div>
      <div class="searchList">
        <v-touch @swipeleft="onSwipe('left')" @swiperight="onSwipe('right')" class="v-touch">
          <van-pull-refresh @refresh="onSearch(1)" v-model="refreshloading">
            <van-list :finished="finished" @load="onSearch" finished-text="没有更多了" v-model="loading">
              <div v-if="chooseType == $dictionaries.machineType.company">
                <div :key="index" @click="handelItem(item)" class="searchItem" v-for="(item, index) in list">
                  <h3 class="projectName" v-text="item.projectName"></h3>
                  <p class="projectAddress">
                    所属区域:
                    <span v-text="item.areaName"></span>
                  </p>
                </div>
              </div>
              <div v-if="chooseType == $dictionaries.machineType.garbage">
                <div :key="index" @click="handelItem(item)" class="searchItem" v-for="(item, index) in list">
                  <h3 class="projectName" v-text="item.name"></h3>
                  <p class="projectAddress">
                    地址:
                    <span v-text="item.address"></span>
                  </p>
                </div>
              </div>
            </van-list>
          </van-pull-refresh>
        </v-touch>
      </div>
    </van-popup>
    <van-tabs color="#4683f1" swipeable v-model="chooseType">
      <van-tab :name="$dictionaries.machineType.company" title="项目">
        <div class="itemBox">
          <div class="itemMsg">
            <span class="label">项目名称</span>
            <van-field :value="projectDetail.projectName" center disabled placeholder="请选择项目">
              <template #button>
                <van-button @click="handelChoose" size="small" type="primary">选择项目</van-button>
              </template>
            </van-field>
          </div>
          <div class="itemMsg">
            <span class="label">区县</span>
            <van-field :value="projectDetail.areaName" disabled></van-field>
          </div>

          <div class="itemMsg">
            <span class="label">项目经理</span>
            <van-field :value="projectDetail.manager" disabled></van-field>
          </div>
          <div class="itemMsg">
            <span class="label">电话</span>
            <van-field :value="projectDetail.managerPhone" disabled></van-field>
          </div>
        </div>
      </van-tab>
      <van-tab :name="$dictionaries.machineType.garbage" title="消纳站">
        <div class="itemBox">
          <div class="itemMsg">
            <span class="label">消纳站名称</span>
            <van-field :value="projectDetail.name" center disabled placeholder="请选择消纳站">
              <template #button>
                <van-button @click="handelChoose" size="small" type="primary">选择消纳站</van-button>
              </template>
            </van-field>
          </div>
          <div class="itemMsg">
            <span class="label">地址</span>
            <van-field :value="projectDetail.address" disabled></van-field>
          </div>

          <div class="itemMsg">
            <span class="label">法人</span>
            <van-field :value="projectDetail.creator" disabled></van-field>
          </div>
          <div class="itemMsg">
            <span class="label">法人电话</span>
            <van-field :value="projectDetail.creatorPhone" disabled></van-field>
          </div>
        </div>
      </van-tab>
    </van-tabs>
    <div style="padding:30px 10px">
      <van-button @click="goAndriod" block style="marginTop:30px" type="info">巡检</van-button>
    </div>
  </div>
</template>

<script>
import { getArea, getList } from '@/assets/js/commonAxios'
export default {
  data() {
    return {
      userMsg: {},
      chooseType: this.$dictionaries.machineType.company,
      areaList: [], //区域列表
      list: [], //项目列表
      projectDetail: {},
      searchDia: false,
      loading: false,
      btnLoading: false,
      refreshloading: false,
      finished: false,
      searchData: {
        searchValue: '',
        searchCode: '',
        limit: 10,
        page: 1
      }
    }
  },
  async mounted() {
    this.userMsg = this.$store.state.user.user
    this.searchData.searchCode = this.userMsg.accountTypeDto.code
    await this.getArea()
  },
  components: {},
  methods: {
    //传给安卓数据
    goAndriod() {
      let workStationId = ''
      if (this.$store.state.user.user.accountTypeDto.type == this.$dictionaries.userType.garbage) {
        workStationId = this.projectDetail.id
      } else {
        workStationId = this.projectDetail.projectId
      }
      if (!workStationId) {
        this.$dialog.alert({
          message: '请选择项目/消纳站',
          confirmButtonColor: 'red'
        })
        return
      }
      let data = { inspectionId: workStationId, areacode: this.searchData.searchCode }
      if (window.jsCall) window.jsCall.setGovernmentInspectionId(JSON.stringify(data))
    },
    //滑动
    onSwipe(type) {
      let length = this.areaList.length
      let index = 0
      for (let i = 0; i < length; i++) {
        if (this.areaList[i].value == this.searchData.searchCode) {
          index = i
        }
      }
      if (type == 'left') {
        if (index != length - 1) {
          this.searchData.searchCode = this.areaList[index + 1].value
        }
      }
      if (type == 'right') {
        if (index != 0) {
          this.searchData.searchCode = this.areaList[index - 1].value
        }
      }
    },
    //点击项目
    handelItem(item) {
      this.projectDetail = item
      this.searchDia = false
    },
    //选择项目
    async handelChoose() {
      await this.onSearch(1)
      this.searchDia = true
    },
    //搜索项目
    async onSearch(page) {
      if (page) {
        this.searchData.page = page
      }
      let url = ''
      if (this.chooseType == this.$dictionaries.machineType.company) {
        url = `/carp/business/a/q/project/area/name?areaCode=${this.searchData.searchCode}&name=${this.searchData.searchValue}&limit=${this.searchData.limit}&page=${this.searchData.page}`
      } else {
        url = `/carp/business/a/q/garbage/station/page?limit=${this.searchData.limit}&page=${this.searchData.page}&areaCode=${this.searchData.searchCode}&name=${this.searchData.searchValue}`
      }
      let data = {
        list: this.list,
        page: this.searchData.page
      }
      let result = await getList(url, data, '信息')
      this.list = result.list
      this.searchData.page = result.page
      this.refreshloading = result.refreshloading
      this.loading = result.loading
      this.finished = result.finished
    },
    onCancel() {
      this.searchDia = false
    },
    //得到地区列表
    async getArea() {
      this.areaList = await getArea()
    }
  }
}
</script>

<style lang="less">
.government-ChooseWorkplace {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  padding-bottom: 30px;
  .van-search__content {
    background-color: #e5e5e5;
  }
  .van-search {
    padding: 0;
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
  .itemBox {
    background-color: #fff;
    margin-top: 20px;
    .itemMsg {
      display: flex;
      align-items: center;
      .label {
        width: 125px;
        text-align: left;
        text-indent: 10px;
        font-size: 16px;
        color: #9a9a9a;
      }
      .mapIcon {
        color: #4f83e4;
        display: flex;
      }
    }
  }
  .boxItem {
    margin-top: 30px;
    .text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      span {
        color: #666;
      }
    }
    p {
      color: #979797;
      font-weight: 700;
      margin-left: 16px;
    }
    .itemContent {
      background-color: #fff;
      .van-icon__image {
        width: 100%;
        height: 100%;
      }
      .van-grid-item__content {
        padding: 0;
      }
    }
    .remark {
      padding: 10px;
      p {
        color: #676767;
        margin-left: 6px;
      }
      .van-cell {
        padding: 0;
      }
      .van-field__control {
        border: 1px dashed #c3c3c3;
      }
    }
  }
}
</style>
