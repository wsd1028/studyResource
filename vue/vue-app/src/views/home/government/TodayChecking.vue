<template>
  <div class="government-todayChecking">
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="每日巡检">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <div class="boxItem">
      <p class="title">
        <span class="box"></span>
        <span>巡检基本信息</span>
      </p>
      <div class="itemContent">
        <van-field :value="mainData.name" disabled label="巡检项目" type="text" />
        <van-field :value="mainData.address" disabled label="巡检地址" type="text" />
        <van-field :value="mainData.checkPeopleName" disabled label="巡检人" type="text" />
        <van-field :value="mainData.createDate" disabled label="巡检时间" type="text" />
        <van-field :value="userMsg.organizationDto.name" label="审核部门" type="text" />
        <van-field :value="userMsg.accountBaseDto.name" label="审核人" type="text" />
      </div>
    </div>
    <div class="boxItem">
      <p class="title">
        <span class="box"></span>
        <span>巡检内容</span>
      </p>
      <div :key="index" class="itemContent" style="padding:10px 0" v-for="(item, index) in updateData.todaysCheckContentDtoList">
        <p class="text">
          <span>
            {{ index + 1 }}:{{ item.dictName }}
            <sup style="color:red">*</sup>
          </span>
          <van-radio-group class="radio" direction="horizontal" v-model="item.checkState">
            <van-radio :name="true">合格</van-radio>
            <van-radio :name="false" checked-color="#f34341">整改</van-radio>
          </van-radio-group>
        </p>
        <van-grid :border="false" :gutter="10">
          <van-grid-item :key="index" v-for="(item, index) in item.todaysImgEntityList">
            <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item.imageUrl" height="80" width="80" />
          </van-grid-item>
        </van-grid>
        <div class="remark">
          <p>
            备注:
            <span v-text="item.checkRemark"></span>
          </p>
        </div>
      </div>
    </div>
    <div style="padding:0 20px;marginTop:30px">
      <van-button :loading="btnLoading" @click="updateYes" block loading-text="加载中..." type="info">巡检完成</van-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paramsData: {},
      mainData: {},
      btnLoading: false,
      userMsg: {
        accountBaseDto: {},
        organizationDto: {}
      },
      updateData: {
        areaCode: 0,
        checkPeopleId: null, //巡检人ID1
        initiatorPeopleId: null, //发起者ID
        checkPeopleName: '', //巡检人名字1
        createDate: '', //创建巡检时间1
        id: null, //不传
        departmentState: this.$dictionaries.machineType.government, //部门状态1
        projectId: null, //项目ID1
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
  mounted() {
    this.paramsData = this.$route.params
    this.userMsg = this.$store.state.user.user
    this.getMainData()
  },
  components: {},
  methods: {
    //巡检完成
    async updateYes() {
      this.btnLoading = true
      for (let i = 0; i < this.updateData.todaysCheckContentDtoList.length; i++) {
        if (!this.updateData.todaysCheckContentDtoList[i].checkState) {
          this.updateData.state = this.$dictionaries.todayCheck.update
          break
        }
        if (i == this.updateData.todaysCheckContentDtoList.length - 1) {
          this.updateData.state = this.$dictionaries.todayCheck.finish
        }
      }
      let resp = await this.$http.put('/carp/business/a/q/todays/check/', this.updateData)
      if (resp.code == 0) {
        this.$dialog.alert({
          message: '提交审核成功',
          confirmButtonColor: 'green'
        })
        this.$router.go(-1)
      } else {
        this.$dialog.alert({
          message: '提交审核失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
      this.btnLoading = false
    },
    //获取信息
    async getMainData() {
      let resp = await this.$http.get('/carp/business/a/q/todays/check/' + this.paramsData.id)
      if (resp.code == 0) {
        this.mainData = resp.data
        let todaysCheckContentDtoList = []
        for (let i = 0; i < resp.data.contentList.length; i++) {
          let todaysImgEntityList = []
          for (let j = 0; j < resp.data.imgList.length; j++) {
            if (resp.data.contentList[i].dictId == resp.data.imgList[j].typeCode) {
              todaysImgEntityList.push({
                id: resp.data.imgList[j].id, //不传
                todayCheckId: resp.data.imgList[j].todayCheckId, //每日巡检id（主表id）不传
                imageUrl: resp.data.imgList[j].imageUrl, //图片地址
                todayContentId: resp.data.imgList[j].todayContentId, //巡检内容表id不传
                typeCode: resp.data.imgList[j].typeCode //图片类型(字典表ID）对dictId
              })
              resp.data.contentList[i].dictName = resp.data.imgList[j].name
            }
          }
          todaysCheckContentDtoList.push({
            checkRemark: resp.data.contentList[i].checkRemark, //巡检状态评价
            checkState: resp.data.contentList[i].checkState, //巡检内容状态（true：合格，false：不合格）
            dictId: resp.data.contentList[i].dictId, //字典表id（类型）
            id: resp.data.contentList[i].id, //不传
            todayCheckId: resp.data.contentList[i].todayCheckId, //每日巡检主表id不传
            visible: resp.data.contentList[i].visible,
            dictName: resp.data.contentList[i].dictName,
            todaysImgEntityList
          })
        }
        this.updateData = {
          areaCode: this.mainData.areaCode,
          checkPeopleId: this.mainData.checkPeopleId, //巡检人ID1
          initiatorPeopleId: this.mainData.initiatorPeopleId, //发起者ID
          checkPeopleName: this.mainData.checkPeopleName, //巡检人名字1
          createDate: this.mainData.createDate, //创建巡检时间1
          id: this.mainData.id, //不传
          departmentState: this.mainData.departmentState, //部门状态1
          projectId: this.mainData.projectId, //项目ID1
          state: this.mainData.state, //巡检状态1
          todaysCheckContentDtoList: todaysCheckContentDtoList,
          visible: this.mainData.visible
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

<style lang="less">
.government-todayChecking {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  padding-bottom: 40px;
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
  .boxItem {
    margin-top: 30px;
    .box {
      height: 20px;
      width: 5px;
      background-color: #4186f6;
    }
    .radio {
      font-weight: normal;
    }
    .title {
      span {
        color: #979797;
        font-weight: 700;
        margin-bottom: 10px;
        margin-left: 16px;
        vertical-align: top;
      }
    }
    .itemContent {
      .text {
        margin-left: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        span {
          color: #666;
        }
      }
      background-color: #fff;
      .van-icon__image {
        width: 100%;
        height: 100%;
      }
      .van-grid-item__content {
        padding: 0;
      }
      .remark {
        padding: 10px;
        p {
          color: #676767;
          margin-left: 6px;
        }
        span {
          color: #adadad;
        }
        .van-cell {
          padding: 0;
          padding-top: 10px;
        }
        .van-field__control {
          border: 1px dashed #c3c3c3;
        }
      }
    }
  }
}
</style>
