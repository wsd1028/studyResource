<template>
  <div class="company-TodayCheckUpdate">
    <myTitle class="mainBox2" titleName="每日巡检"></myTitle>
    <div class="boxItem mt50">
      <p class="title">
        <span class="box"></span>
        <span>巡检基本信息</span>
      </p>
      <div class="itemContent">
        <van-field :value="mainData.name" disabled label="巡检项目" type="text" />
        <van-field :value="mainData.address" disabled label="巡检地址" type="text" />
        <van-field :value="mainData.checkPeopleName" disabled label="巡检人" type="text" />
        <van-field :value="mainData.createDate" disabled label="巡检时间" type="text" />
      </div>
    </div>
    <div class="boxItem">
      <p class="title">
        <span class="box"></span>
        <span>巡检内容</span>
      </p>
      <div :key="index" class="itemContent" style="padding:10px 0" v-for="(item, index) in updateData.todaysCheckContentDtoList">
        <div class="text">
          <p class="textFlowP">
            <span class="textFlow">
              {{ index + 1 }}:{{ item.dictName }}
              <sup style="color:red">*</sup>
            </span>
          </p>
          <span class="yes" v-if="item.checkState">合格</span>
          <span class="no" v-else>整改</span>
        </div>
        <van-grid :border="false" :gutter="10">
          <van-grid-item :key="index" v-for="(item, index) in item.todaysImgEntityList">
            <MyImage :imgUrl="$dictionaries.imgBaseUrl2 + item.imageUrl" height="80" width="80" />
          </van-grid-item>
        </van-grid>
        <div class="itemContent" style="padding:10px" v-if="!item.checkState">
          <p style="margin:10px 0">重新上传图片</p>
          <MyUpload :limit="4" :module="$dictionaries.imgType.today" @uploadYes="uploadYes($event, index)"></MyUpload>
        </div>
        <div class="remark">
          <p>
            备注:
            <span v-if="item.checkState" v-text="item.checkRemark"></span>
            <van-field autosize rows="2" type="textarea" v-else v-model="item.checkRemark" />
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
import MyUpload from '@/components/MyUpload.vue'

export default {
  data() {
    return {
      paramsData: {},
      mainData: {},
      btnLoading: false,
      updateData: {
        areaCode: 0, //区域code
        checkPeopleId: null, //巡检人ID1
        initiatorPeopleId: null, //发起者ID
        checkPeopleName: '', //巡检人名字1
        createDate: '', //创建巡检时间1
        id: null, //不传
        departmentState: this.$dictionaries.machineType.government, //部门状态1
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
                visible: true,
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
      },
      updateData2: {
        areaCode: 0, //区域code
        checkPeopleId: null, //巡检人ID
        initiatorPeopleId: null, //发起者ID
        examinePeopleId: '', //审核人
        checkPeopleName: '', //巡检人名字
        createDate: '', //创建巡检时间
        id: null, //不传
        departmentState: this.$dictionaries.machineType.government, //部门状态
        workStationId: null, //项目/消纳站ID
        checkType: 1,
        state: this.$dictionaries.todayCheck.finish, //巡检状态
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
                visible: true,
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
    this.getMainData()
  },
  components: {
    MyUpload
  },
  methods: {
    //上传文件
    uploadYes(fileList, index) {
      this.updateData2.todaysCheckContentDtoList[index].todaysImgEntityList = fileList
    },
    //巡检完成
    async updateYes() {
      this.btnLoading = true
      let bool = true
      this.updateData.state = this.$dictionaries.todayCheck.waitCheck
      for (let i = 0; i < this.updateData.todaysCheckContentDtoList.length; i++) {
        if (!this.updateData.todaysCheckContentDtoList[i].checkState) {
          bool = false
          let todaysImgEntityList = []
          for (let j = 0; j < this.updateData2.todaysCheckContentDtoList[i].todaysImgEntityList.length; j++) {
            bool = true
            todaysImgEntityList.push({
              id: null, //不传
              visible: true,
              todayCheckId: this.updateData.todaysCheckContentDtoList[i].todayCheckId, //每日巡检id（主表id）不传
              imageUrl: this.updateData2.todaysCheckContentDtoList[i].todaysImgEntityList[j], //图片地址
              todayContentId: this.updateData.todaysCheckContentDtoList[i].id, //巡检内容表id不传
              typeCode: this.updateData.todaysCheckContentDtoList[i].dictId //图片类型(字典表ID）对dictId
            })
          }
          if (bool) {
            this.updateData.todaysCheckContentDtoList[i].checkState = true
            this.updateData.todaysCheckContentDtoList[i].todaysImgEntityList = todaysImgEntityList
          }
        }
      }
      if (bool) {
        let resp = await this.$http.put('/carp/business/a/q/todays/check', this.updateData)
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
      } else {
        this.$dialog.alert({
          message: '信息不完整',
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
                visible: true,
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
          areaCode: this.mainData.areaCode, //区域code
          checkPeopleId: this.mainData.checkPeopleId, //巡检人ID1
          initiatorPeopleId: this.mainData.initiatorPeopleId, //发起者ID
          examinePeopleId: this.mainData.examinePeopleId, //审核人
          checkPeopleName: this.mainData.checkPeopleName, //巡检人名字1
          createDate: this.mainData.createDate, //创建巡检时间1
          id: this.mainData.id, //不传
          departmentState: this.mainData.departmentState, //部门状态1
          workStationId: this.mainData.workStationId, //项目ID1
          state: this.mainData.state, //巡检状态1
          todaysCheckContentDtoList: todaysCheckContentDtoList,
          visible: this.mainData.visible
        }
        this.updateData2 = JSON.parse(JSON.stringify(this.updateData))
        for (let i = 0; i < this.updateData2.todaysCheckContentDtoList.length; i++) {
          this.updateData2.todaysCheckContentDtoList[i].todaysImgEntityList = []
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
.company-TodayCheckUpdate {
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
        .yes {
          background-color: #1b7bfe;
          line-height: 24px;
          text-align: center;
          padding: 2px 15px;
          color: #fff;
          border-radius: 24px;
          margin-left: 10px;
          margin-right: 20px;
        }
        .no {
          background-color: #f34341;
          line-height: 24px;
          text-align: center;
          padding: 2px 15px;
          color: #fff;
          border-radius: 24px;
          margin-left: 10px;
          margin-right: 20px;
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
