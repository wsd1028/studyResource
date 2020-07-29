<template>
  <div class="government-todayCheckCreat">
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
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="新建每日巡检">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
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

    <div :key="index" class="boxItem" v-for="(item, index) in checkList">
      <div class="text">
        <p class="textFlowP">
          <span class="textFlow">巡检{{ index + 1 }}:{{ item.name }}</span>
        </p>
        <div style="flex-shrink:0">
          <van-radio-group direction="horizontal" v-model="checkings[index].checkState">
            <van-radio :name="true">合格</van-radio>
            <van-radio :name="false" checked-color="#f34341">整改</van-radio>
          </van-radio-group>
        </div>
      </div>
      <div class="itemContent" style="padding:10px">
        <MyUpload :module="$dictionaries.imgType.today" @uploadYes="uploadYes($event, index, 'checkPhoto')"></MyUpload>
      </div>
      <div class="remark">
        <p>备注:</p>
        <van-field autosize rows="2" type="textarea" v-model="checkings[index].checkRemark" />
      </div>
    </div>
    <div style="padding:30px 10px">
      <van-button :loading="btnLoading" @click="updateYes" block loading-text="加载中..." style="marginTop:30px" type="info">巡检完成</van-button>
    </div>
  </div>
</template>

<script>
import MyUpload from '@/components/MyUpload.vue'
import { getArea } from '@/assets/js/commonAxios'
export default {
  data() {
    return {
      userMsg: {},
      chooseType: this.$dictionaries.machineType.company,
      areaList: [], //区域列表
      list: [], //项目列表
      projectText: '',
      projectDetail: {},
      garbageText: '',
      garbageDetail: {},
      searchDia: false,
      loading: false,
      btnLoading: false,
      refreshloading: false,
      finished: false,
      searchData: {
        searchValue: '',
        searchCode: '',
        searchId: '',
        limit: 10,
        page: 1
      },
      checkList: [],
      checkings: [],
      updateData: {
        areaCode: 0, //区域code
        checkPeopleId: null, //巡检人ID1
        initiatorPeopleId: null, //发起者ID
        checkPeopleName: '', //巡检人名字1
        createDate: '', //创建巡检时间1
        id: null, //不传
        departmentState: this.$dictionaries.machineType.company, //部门状态1
        workStationId: null, //项目/消纳站ID1
        checkType: 1,
        state: this.$dictionaries.todayCheck.finish, //巡检状态1
        todaysCheckContentDtoList: [
          {
            checkRemark: '', //巡检状态评价
            checkState: true, //巡检内容状态（true：合格，false：不合格）
            dictId: null, //字典表id（类型）
            id: null, //不传
            todayCheckId: null, //每日巡检主表id不传
            todaysImgEntityList: [
              {
                id: null, //不传
                todayCheckId: null, //每日巡检id（主表id）不传
                imageUrl: '', //图片地址
                todayContentId: null, //巡检内容表id不传
                typeCode: null //图片类型(字典表ID）对dictId
              }
            ],
            visible: true
          }
        ],
        visible: true
      }
    }
  },
  async mounted() {
    this.userMsg = this.$store.state.user.user
    this.searchData.searchCode = this.userMsg.accountTypeDto.code
    this.searchData.searchId = this.userMsg.accountTypeDto.code
    for (let i = this.userMsg.accountTypeDto.code.length; i < 12; i++) {
      this.searchData.searchId += '0'
    }
    this.getCheck()
    this.updateData.areaCode = this.$store.state.user.user.accountTypeDto.code
    this.updateData.checkPeopleId = this.$store.state.user.user.id
    this.updateData.initiatorPeopleId = this.$store.state.user.user.id
    this.updateData.checkPeopleName = this.$store.state.user.user.accountBaseDto.name
    this.updateData.createDate = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    await this.getArea()
  },
  components: { MyUpload },
  methods: {
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
    //上传文件
    uploadYes(fileList, index, name) {
      this.checkings[index][name] = fileList
    },
    //确认上传
    async updateYes() {
      let bool = true
      if (this.$store.state.user.user.accountTypeDto.type == this.$dictionaries.userType.garbage) {
        this.updateData.workStationId = this.projectDetail.id
      } else {
        this.updateData.workStationId = this.projectDetail.projectId
      }
      if (!this.updateData.workStationId) bool = false
      for (let i = 0; i < this.checkings.length; i++) {
        if (!this.checkings[i].checkState) {
          this.updateData.state = this.$dictionaries.todayCheck.update
          break
        }
        if (i == this.checkings.length - 1) {
          this.updateData.state = this.$dictionaries.todayCheck.finish
        }
      }
      let todaysCheckContentDtoList = []
      for (let i = 0; i < this.checkings.length; i++) {
        let todaysImgEntityList = []
        if (this.checkings[i].checkPhoto.length == 0) bool = false
        for (let j = 0; j < this.checkings[i].checkPhoto.length; j++) {
          todaysImgEntityList.push({
            id: null, //不传
            todayCheckId: null, //每日巡检id（主表id）不传
            imageUrl: this.checkings[i].checkPhoto[j], //图片地址
            todayContentId: null, //巡检内容表id不传
            typeCode: this.checkings[i].id //图片类型(字典表ID）对dictId
          })
        }
        todaysCheckContentDtoList.push({
          checkRemark: this.checkings[i].checkRemark, //巡检状态评价
          checkState: this.checkings[i].checkState, //巡检内容状态（true：合格，false：不合格）
          description: '', //整体描述
          dictId: this.checkings[i].id, //字典表id
          todayCheckId: null, //每日巡检主表id不传
          todaysImgEntityList: todaysImgEntityList,
          visible: true
        })
      }
      this.updateData.todaysCheckContentDtoList = todaysCheckContentDtoList
      this.updateData.departmentState = this.chooseType
      //必填项是否验证成功
      if (bool) {
        let url = '/carp/business/a/q/todays/check/increase'
        this.btnLoading = true
        let resp = await this.$http.post(url, this.updateData)
        this.btnLoading = false
        if (resp.code == 0) {
          this.$dialog.alert({
            message: '创建成功',
            confirmButtonColor: 'green'
          })
          this.$router.go(-1)
        } else {
          this.$dialog.alert({
            message: '创建失败:' + resp.message,
            confirmButtonColor: 'red'
          })
        }
      } else {
        this.$dialog.alert({
          message: '信息不完整',
          confirmButtonColor: 'red'
        })
      }
    },
    //获取检查项
    async getCheck() {
      let resp = await this.$http.get('/carp/business/a/q/dict/category/check_style')
      if (resp.code == 0) {
        for (let i = 0; i < resp.data.length; i++) {
          resp.data[i].checkState = true
          resp.data[i].checkRemark = ''
          resp.data[i].checkPhoto = []
        }
        this.checkList = resp.data
        this.checkings = JSON.parse(JSON.stringify(resp.data))
      } else {
        this.$dialog.alert({
          message: '获取检查项失败:' + resp.message,
          confirmButtonColor: 'red'
        })
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
        this.list = []
      }
      let resp = {}
      if (this.chooseType == this.$dictionaries.machineType.company) {
        resp = await this.$http.get(
          `/carp/business/a/q/project/area/name?areaCode=${this.searchData.searchCode}&name=${this.searchData.searchValue}&limit=${this.searchData.limit}&page=${this.searchData.page}`
        )
      } else {
        resp = await this.$http.get(
          `/carp/business/a/q/garbage/station/page?limit=${this.searchData.limit}&page=${this.searchData.page}&areaCode=${this.searchData.searchCode}&name=${this.searchData.searchValue}`
        )
      }
      if (resp.code == 0) {
        this.list = this.list.concat(resp.data.records)
        // 加载状态结束
        this.loading = false
        this.refreshloading = false
        this.searchData.page = this.searchData.page + 1
        if (this.list.length == resp.data.total) {
          // 数据全部加载完成
          this.finished = true
        } else {
          this.finished = false
        }
      } else {
        this.$dialog.alert({
          message: '获取项目失败',
          confirmButtonColor: 'red'
        })
      }
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
.government-todayCheckCreat {
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
