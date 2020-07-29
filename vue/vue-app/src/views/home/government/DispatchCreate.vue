<template>
  <div class="dispatchCreate">
    <van-popup class="myDia" position="top" v-model="mapDia">
      <MyMap @chooseAddress="chooseAddress"></MyMap>
    </van-popup>
    <header>
      <van-nav-bar @click-left="goBack" class="nav" title="新建督办派单">
        <template #left>
          <van-icon class-prefix="iconfont" color="#333" name="fanhui" size="22" />
        </template>
      </van-nav-bar>
    </header>
    <section>
      <van-tabs @change="changeTab" color="#4683f1" swipeable v-model="activeBtn">
        <van-tab name="1" title="监管部门"></van-tab>
        <van-tab name="2" title="排放源"></van-tab>
        <van-tab name="3" title="消纳源"></van-tab>
      </van-tabs>
      <div class="itemBox">
        <div class="itemMsg">
          <span class="label">地区</span>
          <el-select @change="changeArea" filterable placeholder="请选择" size="mini" v-model="areaText">
            <el-option :key="index" :label="item.text" :value="item.value" v-for="(item, index) in areaList"></el-option>
          </el-select>
        </div>
        <div class="itemMsg" v-if="activeBtn == 1">
          <span class="label">部门</span>
          <el-select @change="changeDepartment" filterable placeholder="请选择" size="mini" v-model="departmentText">
            <el-option :key="index" :label="item.text" :value="item.value" v-for="(item, index) in departmentList"></el-option>
          </el-select>
        </div>
        <div class="itemMsg" v-if="activeBtn == 2">
          <span class="label">项目</span>
          <el-select @change="changeProject" filterable placeholder="请选择" size="mini" v-model="projectText">
            <el-option :key="index" :label="item.projectName" :value="item.projectId" v-for="(item, index) in projectList"></el-option>
          </el-select>
        </div>
        <div class="itemMsg" v-if="activeBtn == 3">
          <span class="label">消纳站</span>
          <el-select @change="changeGarbage" filterable placeholder="请选择" size="mini" v-model="garbageText">
            <el-option :key="index" :label="item.name" :value="item.id" v-for="(item, index) in garbageList"></el-option>
          </el-select>
        </div>
        <div class="itemMsg">
          <span class="label">人员</span>
          <el-select @change="changePeople" filterable placeholder="请选择" size="mini" v-model="peopleText">
            <el-option :key="index" :label="item.text" :value="item.value" v-for="(item, index) in peopleList"></el-option>
          </el-select>
        </div>
        <div class="itemMsg">
          <span class="label">电话</span>
          <van-field class="mySelect" disabled v-model="userPhone"></van-field>
        </div>
      </div>
      <div class="itemBox">
        <div class="itemMsg">
          <van-field label="督办地址" placeholder="请输入当前督办地址" type="text" v-model="updateData.address">
            <template #right-icon>
              <div @click="mapDia = true" class="mapIcon">
                <van-icon color="#4f83e4" name="location" />
                <span>获取</span>
              </div>
            </template>
          </van-field>
        </div>
      </div>
      <div class="itemBox">
        <h3 style="padding:10px">
          图片
          <span class="secondMsg">(最多3张)</span>
        </h3>
        <div class="itemMsg" style="padding:10px">
          <MyUpload
            :defaultFileList="getDefaultFileList(updateData.taskImageList)"
            :limit="3"
            :module="$dictionaries.imgType.dispatch"
            @uploadYes="uploadYes"
            class
            style
          ></MyUpload>
        </div>
      </div>
      <div class="itemBox">
        <h3 style="padding:10px">
          问题描述
          <!-- <span style="color:red">*</span> -->
        </h3>
        <div class="itemMsg" style="padding:10px">
          <van-field placeholder="请输入当前问题详细描述" type="textarea" v-model="updateData.description" />
        </div>
      </div>
    </section>
    <van-button @click="updateYes" block style="marginTop:30px" type="info">督办派单</van-button>
  </div>
</template>

<script>
import MyMap from '@/components/MyMap.vue'
import MyUpload from '@/components/MyUpload.vue'
import { getArea } from '@/assets/js/commonAxios'

export default {
  data() {
    return {
      activeBtn: '1',
      mapDia: false, //地图弹窗
      userMsg: {}, //账号信息
      areaList: [], //区域列表
      areaText: '',
      departmentList: [], //部门列表
      departmentText: '',
      projectList: [], //项目列表
      projectText: '',
      peopleList: [], //人员列表
      peopleText: '',
      garbageList: [], //消纳站列表
      garbageText: '',
      userPhone: '',
      userNameL: '',
      updateData: {
        address: '', //1
        description: '', //1
        latitude: null, //1
        longitude: null, //1
        questionReportId: null, //1
        receiverCity: '', //1
        receiverDept: '', //1
        receiverId: null, //1
        receiverName: '', //1
        receiverPhone: '', //1
        sponsorCity: '', //1
        sponsorDept: '', //1
        sponsorId: null, //1
        sponsorName: '', //1
        sponsorPhone: '', //1
        taskImageList: [] //1
      },
      paramsData: {} //由问题上报转入的督办派单参数
    }
  },
  async mounted() {
    this.paramsData = this.$route.params //由问题上报转入的督办派单参数
    if (JSON.stringify(this.paramsData) != '{}') {
      this.isProblemReport = true
      this.updateData.address = this.paramsData.reportAddress
      this.updateData.description = this.paramsData.reportMessage
      this.updateData.taskImageList = this.paramsData.photo
      this.updateData.questionReportId = this.paramsData.id
    }
    this.userMsg = this.$store.state.user.user
    this.getArea()
  },
  components: {
    MyMap,
    MyUpload
  },
  methods: {
    //得到默认图片列表
    getDefaultFileList(photo) {
      let arr = []
      for (let i = 0; i < photo.length; i++) {
        arr.push({
          url: this.$dictionaries.imgBaseUrl + photo[i],
          imgUrl: photo[i],
          isImage: this.$until.checkImage(photo[i])
        })
      }
      return arr
    },
    goBack() {
      this.$router.go(-1)
    },
    //改变tab
    changeTab() {
      this.changeArea()
    },
    //确认上传
    async updateYes() {
      for (let i = 0; i < this.areaList.length; i++) {
        if (this.areaText == this.areaList[i].value) {
          this.updateData.receiverCity = this.areaList[i].text
        }
      }
      if (this.activeBtn == 1) {
        for (let i = 0; i < this.departmentList.length; i++) {
          if (this.departmentText == this.departmentList[i].value) {
            this.updateData.receiverDept = this.departmentList[i].text
          }
        }
      }
      this.updateData.receiverId = this.peopleText
      this.updateData.receiverName = this.userName
      this.updateData.receiverPhone = this.userPhone
      this.updateData.sponsorCity = this.userMsg.organizationDto.areaName
      this.updateData.sponsorDept = this.userMsg.organizationDto.name
      this.updateData.sponsorId = this.userMsg.id
      this.updateData.sponsorName = this.userMsg.accountBaseDto.name
      this.updateData.sponsorPhone = this.userMsg.accountBaseDto.phone
      //验证必填项
      let bool = this.$until.checkUpdateData(this.updateData, ['description', 'questionReportId', 'receiverDept'])
      //必填项是否验证成功
      if (bool) {
        let url = '/carp/business/a/q/task/newTask'
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
    },
    //选择地址
    chooseAddress(address, bool, addressData) {
      this.updateData.address = address
      this.updateData.longitude = addressData.point.lng
      this.updateData.latitude = addressData.point.lat
      this.mapDia = bool
    },
    //上传图片
    uploadYes(fileList) {
      this.updateData.taskImageList = fileList
    },
    //得到地区列表
    async getArea() {
      this.areaList = await getArea()
    },
    //改变地区
    async changeArea(value) {
      this.departmentList = []
      this.departmentText = ''
      this.peopleList = []
      this.peopleText = ''
      this.projectList = []
      this.projectText = ''
      this.garbageList = []
      this.garbageText = ''
      this.userPhone = ''
      if (!this.areaText) return
      if (this.activeBtn == 1) {
        let resp = await this.$http.get('/carp/auth/a/q/organization/area/' + this.areaText)
        if (resp.code == 0) {
          let departmentList = resp.data
          for (let i = 0; i < departmentList.length; i++) {
            this.departmentList.push({ text: departmentList[i].name, value: departmentList[i].id })
          }
        } else {
          this.$dialog.alert({
            message: '获取部门失败:' + resp.message,
            confirmButtonColor: 'red'
          })
        }
      }
      if (this.activeBtn == 2) {
        let resp = await this.$http.get('/carp/business/a/q/project/area/name?limit=9999&page=1&areaCode=' + this.areaText)
        if (resp.code == 0) {
          this.projectList = resp.data.records
        } else {
          this.$dialog.alert({
            message: '获取项目失败:' + resp.message,
            confirmButtonColor: 'red'
          })
        }
      }
      if (this.activeBtn == 3) {
        let areaIdList = this.areaList.filter((item, index) => {
          return this.areaText == item.value
        })
        let areaId = ''
        if (areaIdList.length == 0) {
          areaId = ''
        } else {
          areaId = areaIdList[0].areaId
        }
        let resp = await this.$http.get('/carp/business/a/q/garbage/station/page?limit=9999&page=1&areaId=' + areaId)
        if (resp.code == 0) {
          this.garbageList = resp.data.records
        } else {
          this.$dialog.alert({
            message: '获取消纳站失败:' + resp.message,
            confirmButtonColor: 'red'
          })
        }
      }
    },
    //改变部门
    async changeDepartment() {
      this.peopleList = []
      this.peopleText = ''
      this.userPhone = ''
      let resp = await this.$http.get('/carp/auth/a/q/account/organization/' + this.departmentText)
      if (resp.code == 0) {
        let peopleList = resp.data
        for (let i = 0; i < peopleList.length; i++) {
          let job = ''
          if (peopleList[i].jobTitleDtoList) {
            job = peopleList[i].jobTitleDtoList[0].name
          }
          this.peopleList.push({
            text: peopleList[i].accountBaseDto.name + '(' + job + ')',
            value: peopleList[i].id,
            phone: peopleList[i].accountBaseDto.phone
          })
        }
      } else {
        this.$dialog.alert({
          message: '获取人员失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //改变项目
    async changeProject() {
      this.peopleList = []
      this.peopleText = ''
      this.userPhone = ''
      let resp = await this.$http.get('/carp/auth/a/q/account/project/' + this.projectText)
      if (resp.code == 0) {
        let peopleList = resp.data
        for (let i = 0; i < peopleList.length; i++) {
          this.peopleList.push({
            text: peopleList[i].accountBaseDto.name,
            value: peopleList[i].id,
            phone: peopleList[i].accountBaseDto.phone
          })
        }
      } else {
        this.$dialog.alert({
          message: '获取人员失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //改变消纳站
    async changeGarbage() {
      this.peopleList = []
      this.peopleText = ''
      this.userPhone = ''
      let resp = await this.$http.get('/carp/auth/a/q/account/garbage/' + this.garbageText)
      if (resp.code == 0) {
        let peopleList = resp.data
        for (let i = 0; i < peopleList.length; i++) {
          this.peopleList.push({
            text: peopleList[i].accountBaseDto.name,
            value: peopleList[i].id,
            phone: peopleList[i].accountBaseDto.phone
          })
        }
      } else {
        this.$dialog.alert({
          message: '获取人员失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //改变人员
    changePeople(val) {
      for (let i = 0; i < this.peopleList.length; i++) {
        if (val == this.peopleList[i].value) {
          this.userPhone = this.peopleList[i].phone
          this.userName = this.peopleList[i].text
        }
      }
    }
  }
}
</script>

<style lang="less">
.dispatchCreate {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
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
      padding-top: 10px;
      .label {
        width: 100px;
        text-align: center;
        font-size: 16px;
        color: #9a9a9a;
      }
      .mySelect {
        width: 200px;
      }
      .myDia {
        padding: 10px;
        padding-top: 20px;
      }
      .mapIcon {
        color: #4f83e4;
        display: flex;
      }
    }
  }
}
.el-select-dropdown__item {
  width: 180px !important;
}
.el-scrollbar span {
  width: 160px !important;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
