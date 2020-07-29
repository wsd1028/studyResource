<template>
  <div class="company-todayCheckCreat">
    <header>
      <van-nav-bar @click-left="$router.go(-1)" class="nav" title="新建每日巡检">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <div class="boxItem">
      <p class="text">基本信息</p>
      <div class="itemContent">
        <van-field :value="project.name" disabled label="巡检项目" type="text" />
        <van-field :value="project.address" disabled label="巡检地址" type="text" />
        <van-field :value="$store.state.user.user.accountBaseDto.name" disabled label="巡检人" type="text" />
        <van-field :value="updateData.createDate" disabled label="巡检时间" type="text" />
      </div>
    </div>
    <div :key="index" class="boxItem" v-for="(item, index) in checkList">
      <p class="text">巡检{{ index + 1 }}:{{ item.name }}</p>
      <div class="itemContent" style="padding:10px">
        <MyUpload :limit="3" :module="$dictionaries.imgType.today" @uploadYes="uploadYes($event, index, 'checkPhoto')"></MyUpload>
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

export default {
  data() {
    return {
      project: {},
      checkList: [],
      checkings: [],
      btnLoading: false,
      updateData: {
        areaCode: 0, //区域code
        checkPeopleId: null, //巡检人ID1
        initiatorPeopleId: null, //发起者ID
        checkPeopleName: '', //巡检人名字1
        createDate: '', //创建巡检时间1
        id: null, //不传
        departmentState: this.$dictionaries.machineType.company, //部门状态1
        workStationId: null, //项目/消纳站ID1
        checkType: 1, //1扬尘
        state: this.$dictionaries.todayCheck.waitCheck, //巡检状态1
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
    this.getCheck()
    this.project = this.$store.state.user.project
    let userMsg = this.$store.state.user.user
    this.updateData.areaCode = this.project.areaCode
    this.updateData.checkPeopleId = userMsg.id
    this.updateData.initiatorPeopleId = userMsg.id
    if (userMsg.accountTypeDto.type == this.$dictionaries.userType.garbage) {
      this.updateData.departmentState = this.$dictionaries.machineType.garbage
    }
    this.updateData.checkPeopleName = userMsg.accountBaseDto.name
    this.updateData.createDate = this.$moment().format('YYYY-MM-DD HH:mm:ss')
    this.updateData.workStationId = this.project.id
  },
  components: { MyUpload },
  methods: {
    //上传文件
    uploadYes(fileList, index, name) {
      this.checkings[index][name] = fileList
    },
    //确认上传
    async updateYes() {
      let bool = true
      this.btnLoading = true
      for (let i = 0; i < this.checkings.length; i++) {
        if (!this.checkings[i].checkState) {
          this.updateData.state = this.$dictionaries.todayCheck.update
          break
        }
        if (i == this.checkings.length - 1) {
          this.updateData.state = this.$dictionaries.todayCheck.waitCheck
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
          dictId: this.checkings[i].id, //字典表id（类型）
          todayCheckId: null, //每日巡检主表id不传
          todaysImgEntityList: todaysImgEntityList,
          visible: true
        })
      }
      this.updateData.todaysCheckContentDtoList = todaysCheckContentDtoList
      //必填项是否验证成功
      if (bool) {
        let url = '/carp/business/a/q/todays/check/increase'
        let resp = await this.$http.post(url, this.updateData)
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
      this.btnLoading = false
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
    }
  }
}
</script>

<style lang="less">
.company-todayCheckCreat {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  padding-bottom: 30px;
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
    .text {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        color: #666;
      }
    }
    p {
      color: #979797;
      font-weight: 700;
      margin-bottom: 10px;
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
