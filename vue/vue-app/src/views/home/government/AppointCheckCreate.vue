<template>
  <div class="government-appointCheckCreate">
    <myTitle class="mainBox2" titleName="新建指派点检"></myTitle>
    <section class="mt50">
      <van-tabs @change="changeTab" color="#4683f1" swipeable v-model="updateData.type">
        <van-tab :name="$dictionaries.machineType.company" title="排放源"></van-tab>
        <van-tab :name="$dictionaries.machineType.garbage" title="消纳源"></van-tab>
      </van-tabs>
      <div class="itemBox">
        <div class="itemMsg">
          <span class="label">地区</span>
          <el-select @change="changeArea" filterable placeholder="请选择" size="mini" v-model="areaText">
            <el-option :key="index" :label="item.text" :value="item.value" v-for="(item, index) in areaList"></el-option>
          </el-select>
        </div>
        <div class="itemMsg" v-if="updateData.type == $dictionaries.machineType.company">
          <span class="label">项目</span>
          <el-select @change="changeProject" filterable placeholder="请选择" size="mini" v-model="projectText">
            <el-option :key="index" :label="item.projectName" :value="item.projectId" v-for="(item, index) in projectList"></el-option>
          </el-select>
        </div>
        <div class="itemMsg" v-if="updateData.type == $dictionaries.machineType.garbage">
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
    </section>
    <div class="checking">
      <span class="titleTwo">请选择检查项</span>
      <van-checkbox-group ref="checkboxGroup" v-model="updateData.checkIdList">
        <van-checkbox :key="index" :name="item.id" style="margin-top:10px" v-for="(item, index) in checkList">{{ item.name }}</van-checkbox>
      </van-checkbox-group>
    </div>
    <van-button :loading="btnLoading" @click="updateYes" block loading-text="加载中..." style="marginTop:30px" type="info">指派点检</van-button>
  </div>
</template>

<script>
import { getArea } from '@/assets/js/commonAxios'

export default {
  data() {
    return {
      btnLoading: false,
      userMsg: {}, //账号信息
      checkList: [], //检查项
      areaList: [], //区域列表
      areaText: '',
      projectList: [], //项目列表
      projectText: '',
      peopleList: [], //人员列表
      peopleText: '',
      garbageList: [], //消纳站列表
      garbageText: '',
      userPhone: '',
      updateData: {
        areaCode: null,
        checkIdList: [],
        receiverId: '',
        sponsorId: '',
        type: this.$dictionaries.machineType.company,
        workStationAddress: '',
        workStationId: '',
        workStationName: ''
      }
    }
  },
  async mounted() {
    this.userMsg = this.$store.state.user.user
    this.getArea()
    this.getCheck()
  },
  components: {},
  methods: {
    goBack() {
      this.$router.go(-1)
    },
    //确认上传
    async updateYes() {
      this.btnLoading = true
      this.updateData.sponsorId = this.userMsg.id
      this.updateData.receiverId = this.peopleText
      let work = [{}]
      try {
        if (this.updateData.type == this.$dictionaries.machineType.company) {
          work = this.projectList.filter(item => {
            return this.projectText == item.projectId
          })
          this.updateData.workStationAddress = work[0].addrss
          this.updateData.workStationId = work[0].projectId
          this.updateData.workStationName = work[0].projectName
        } else {
          work = this.garbageList.filter(item => {
            return this.garbageText == item.id
          })
          this.updateData.workStationAddress = work[0].address
          this.updateData.workStationId = work[0].id
          this.updateData.workStationName = work[0].name
        }
      } catch {}

      //验证必填项
      let bool = this.$until.checkUpdateData(this.updateData)
      //必填项是否验证成功
      if (bool) {
        let url = '/carp/business/a/q/command/check'
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
          resp.data[i].chooseCheck = true
        }
        this.checkList = resp.data
        this.$nextTick(() => {
          this.$refs.checkboxGroup.toggleAll(true)
        })
      } else {
        this.$dialog.alert({
          message: '获取检查项失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //改变tab
    changeTab() {
      this.changeArea()
    },
    //得到地区列表
    async getArea() {
      this.areaList = await getArea()
    },
    //改变地区
    async changeArea(value) {
      this.peopleList = []
      this.peopleText = ''
      this.projectList = []
      this.projectText = ''
      this.garbageList = []
      this.garbageText = ''
      this.userPhone = ''
      if (this.updateData.type == this.$dictionaries.machineType.company) {
        let resp = await this.$http.get('/carp/business/a/q/project/area/name?limit=999&page=1&areaCode=' + this.areaText)
        if (resp.code == 0) {
          this.projectList = resp.data.records
        } else {
          this.$dialog.alert({
            message: '获取项目失败:' + resp.message,
            confirmButtonColor: 'red'
          })
        }
      }
      if (this.updateData.type == this.$dictionaries.machineType.garbage) {
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
            phone: peopleList[i].accountBaseDto.phone,
            code: peopleList[i].accountTypeDto.code
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
            phone: peopleList[i].accountBaseDto.phone,
            code: peopleList[i].accountTypeDto.code
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
          this.updateData.areaCode = this.peopleList[i].code
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.government-appointCheckCreate {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
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
  .checking {
    margin-top: 20px;
    background-color: #fff;
    padding: 10px;
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
