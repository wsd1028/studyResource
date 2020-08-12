<template>
  <div class="workGov-durationDetail">
    <van-popup class="mapDia" position="top" v-model="mapDia">
      <MyMap :address="mainData.address" :position="{ lng: mainData.longitude, lat: mainData.latitude }"></MyMap>
    </van-popup>
    <van-dialog :showConfirmButton="false" class="tips" title v-model="dialog.state">
      <div style="padding:30px">
        <p style="textAlign:center">
          <van-icon :color="dialog.color" :name="dialog.myIcon" class-prefix="iconfont" size="20" v-if="dialog.myIcon" />
          <van-icon :color="dialog.color" :name="dialog.icon" size="20" v-else />
          <span class="tipsMsg" v-text="dialog.title"></span>
        </p>
        <div class="dfsb" style="justify-content: center">
          获取当前点位:
          <van-loading color="#1989fa" v-if="!location" />
          <van-icon color="#1989fa" name="checked" size="24" v-else />
        </div>
        <div class="tipsbtns">
          <van-button @click="dialog.state = false" block class="myBtn2" color="#ddd" round size="small">取消</van-button>
          <van-button :disabled="!location" @click="updateLoaction" block class="myBtn" round size="small" type="info">确认</van-button>
        </div>
      </div>
    </van-dialog>
    <van-dialog :showConfirmButton="false" class="tips" title v-model="updateDia">
      <div style="padding:30px">
        <p style="textAlign:center">
          <van-icon color="#19c363" name="checked" size="20" />
          <span class="tipsMsg">确认修改工期?</span>
        </p>
        <div class="tipsbtns">
          <van-button @click="updateDia = false" block class="myBtn2" color="#ddd" round size="small">取消</van-button>
          <van-button @click="update" block class="myBtn" round size="small" type="info">确认</van-button>
        </div>
      </div>
    </van-dialog>
    <myTitle class="mainBox2" titleName="工期管理"></myTitle>
    <section class="mt50">
      <div class="top">
        <MyImage :imgUrl="$dictionaries.imgBaseUrl + mainData.image" height="200px" width="100%" />
        <div class="msgItem">
          <span>
            <van-icon class-prefix="iconfont" class="myIcon" color="#4284f3" name="shujia" size="20" />
          </span>
          <span class="text" style="fontWeight:800;color:#333" v-text="mainData.name"></span>
        </div>
        <div class="msgItem dfsb">
          <div class="dfsb" style="overflow:hidden">
            <van-icon @click="mapDia = true" class="myIcon" color="#6c6c6c" name="location" size="18" />
            <p class="textFlowP">
              <span @click="mapDia = true" class="text textFlow" v-text="mainData.address"></span>
            </p>
          </div>
          <van-button @click="getLocation" size="small" style="flexShrink:0" type="info">更改位置</van-button>
        </div>
      </div>
      <div class="boxItem0">
        <div>
          <p class="label">当前工期</p>
          <p class="value" v-text="mainData.phase"></p>
        </div>
        <div>
          <p class="label">工程面积</p>
          <p class="value">{{ mainData.projectArea }}m³</p>
        </div>
        <div>
          <p class="label">工程造价</p>
          <p class="value">{{ mainData.totalCost }}万元</p>
        </div>
      </div>
      <div class="boxItem" v-if="durationDetail.id">
        <van-cell-group>
          <van-field disabled label="需求物" v-model="needListText" />
          <van-field disabled label="产出物" v-model="outListText" />
          <van-field disabled label="方量" v-model="durationDetail.square" />
        </van-cell-group>
      </div>
      <div class="boxItem" v-else>
        <div class="item">
          <span class="text">需求物</span>
          <el-select clearable collapse-tags multiple placeholder="请选择需求物" size="mini" v-model="updateData.inputs">
            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in needList"></el-option>
          </el-select>
        </div>
        <div class="item">
          <span class="text">产出物</span>
          <el-select clearable collapse-tags multiple placeholder="请选择产出物" size="mini" v-model="updateData.outputs">
            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in outList"></el-option>
          </el-select>
        </div>
        <div class="item">
          <span class="text">开始时间</span>
          <el-date-picker placeholder="选择日期时间" size="mini" type="date" v-model="updateData.startDate" value-format="yyyy-MM-dd"></el-date-picker>
        </div>
        <div class="item">
          <span class="text">结束时间</span>
          <el-date-picker placeholder="选择日期时间" size="mini" type="date" v-model="updateData.endDate" value-format="yyyy-MM-dd"></el-date-picker>
        </div>
        <div class="item" style="padding-bottom:10px">
          <span class="text">方量</span>
          <el-input placeholder="请输入方量" size="mini" type="number" v-model="updateData.square"></el-input>
        </div>
      </div>
      <div class="boxItem">
        <p class="text">施工阶段变更</p>
        <div class="itemContent">
          <div>
            <span
              :key="index"
              :style="{ background: item.choose ? '#e3eafc' : '#f4f4f4', color: item.choose ? '#1d9ef3' : '#999' }"
              @click="handelStage(item, index)"
              class="myTag"
              v-for="(item, index) in stageList"
              v-text="item.name"
            ></span>
          </div>
        </div>
      </div>
      <div style="padding:0 20px;marginTop:30px">
        <van-button @click="updateDia = true" block type="info">提交修改</van-button>
      </div>
    </section>
  </div>
</template>

<script>
import MyMap from '@/components/MyMap.vue'

export default {
  data() {
    return {
      paramsData: {},
      updateDia: false,
      mapDia: false,
      location: null,
      dialog: {
        state: false,
        text: '',
        myIcon: '',
        icon: 'checked',
        color: '#67c23a',
        title: '确认重新定位该项目!'
      },
      mainData: {},
      stageList: [],
      durationDetail: {
        id: '0'
      },
      outListText: '',
      needListText: '',
      outList: [],
      needList: [],
      updateData: {
        endDate: '',
        inputs: [],
        outputs: [],
        phase: '',
        projectId: '',
        square: '',
        startDate: ''
      }
    }
  },
  async mounted() {
    this.paramsData = this.$route.params
    window.setLocation = this.setLocation2
    if (!window.jsCall) {
      let geolocation = new BMap.LocalCity()
      geolocation.get(res => {
        this.location = res.center
      })
    }
    await this.getCategory('type')
    await this.getCategory('requirement_type')
    this.getMainData()
    this.getStageList()
  },
  components: { MyMap },
  methods: {
    //安卓回传经纬度
    async setLocation2(data) {
      if (data) {
        this.location = data
      }
    },
    //调用安卓接口获取经纬度
    getLocation() {
      this.dialog.state = true
      if (window.jsCall) window.jsCall.getLocation()
    },
    async updateLoaction() {
      this.dialog.state = false
      let resp = await this.$http.post('/carp/business/a/q/data/migration/longitude/latitude', {
        projectId: this.paramsData.projectId,
        longitude: this.location.lng,
        latitude: this.location.lat
      })
      if (resp.code == 0) {
        this.getMainData()
        this.$dialog.alert({
          message: '更改定位成功',
          confirmButtonColor: 'green'
        })
      } else {
        this.$dialog.alert({
          message: '更改定位失败:' + resp,
          confirmButtonColor: 'red'
        })
      }
    },
    async getCategory(type) {
      let resp = await this.$http.get('/carp/business/a/q/dict/category/' + type)
      if (resp.code == 0) {
        if (type == 'type') {
          this.outList = resp.data
        } else {
          this.needList = resp.data
        }
      } else {
        this.$dialog.alert({
          message: '获取信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //修改工期
    async update() {
      this.updateDia = false
      let that = this
      let phase = ''
      for (let i = 0; i < this.stageList.length; i++) {
        if (this.stageList[i].choose) {
          phase = this.stageList[i].id
        }
      }
      let updateData = {}
      let url = ''
      if (that.durationDetail.id) {
        updateData = {
          id: that.durationDetail.id,
          phase: phase
        }
        url = '/carp/business/a/q/duration/form/duration'
      } else {
        updateData = this.updateData
        url = '/carp/business/a/q/duration/form/increase'
        updateData.startDate = this.$moment(updateData.startDate).format('YYYY-MM-DD HH:mm:ss')
        updateData.endDate = this.$moment(updateData.endDate).format('YYYY-MM-DD HH:mm:ss')
      }
      this.updateData.phase = phase
      this.updateData.projectId = this.paramsData.projectId
      let bool = true
      //必填项是否验证成功
      if (bool) {
        let resp = {}
        if (that.durationDetail.id) {
          resp = await this.$http.put(url, updateData)
        } else {
          resp = await this.$http.post(url, updateData)
        }
        if (resp.code == 0) {
          this.$dialog.alert({
            message: '修改成功',
            confirmButtonColor: 'green'
          })
          this.getMainData()
          this.getStageList()
        } else {
          this.$dialog.alert({
            message: '修改失败:' + resp.message,
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
    //点击施工阶段
    handelStage(item, index) {
      //将选中状态取反
      this.stageList[index].choose = !this.stageList[index].choose
      //将其他施工阶段选中状态设为否
      for (let i = 0; i < this.stageList.length; i++) {
        if (this.stageList[i].id != item.id) this.stageList[i].choose = false
      }
      this.$forceUpdate()
    },
    //获取详细数据
    async getMainData() {
      let resp = await this.$http.get('/carp/business/k/s/project/' + this.paramsData.projectId)
      if (resp.code == 0) {
        this.mainData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取项目信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    async getStageList() {
      let url = '/carp/business/a/q/duration/form/projectid/' + this.paramsData.projectId
      var resp = await this.$http.get(url)
      if (resp.code == 0) {
        if (!resp.data.inputs) resp.data.inputs = []
        if (!resp.data.outputs) resp.data.outputs = []
        this.durationDetail = resp.data
        for (let i = 0; i < resp.data.inputs.length; i++) {
          if (i) this.needListText += ','
          for (let j = 0; j < this.needList.length; j++) {
            if (resp.data.inputs[i] == this.needList[j].id) {
              this.needListText += this.needList[j].name
            }
          }
        }
        for (let i = 0; i < resp.data.outputs.length; i++) {
          if (i) this.outListText += ','
          for (let j = 0; j < this.outList.length; j++) {
            if (resp.data.outputs[i] == this.outList[j].id) {
              this.outListText += this.outList[j].name
            }
          }
        }
        if (!resp.data.dictList) {
          this.$dialog.alert({
            message: '请完善该项目的项目类型',
            confirmButtonColor: 'red'
          })
          return
        }
        for (let i = 0; i < resp.data.dictList.length; i++) {
          if (this.durationDetail.phaseName == resp.data.dictList[i].name) {
            resp.data.dictList[i].choose = true
          } else {
            resp.data.dictList[i].choose = false
          }
        }
        this.stageList = resp.data.dictList
      } else {
        this.$dialog.alert({
          message: '获取施工阶段失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
.workGov-durationDetail {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  padding-bottom: 40px;
  .myTag {
    text-align: center;
    line-height: 40px;
    font-size: 18px;
    margin: 4px 5px;
    border-radius: 4px;
    display: inline-block;
    color: #fff;
    padding: 0 10px;
  }
  section {
    .top {
      padding: 20px;
      .msgItem {
        font-size: 18px;
        color: #656565;
        display: flex;
        margin-top: 16px;
        align-items: flex-start;
        text-align: left;
        .text {
          margin-left: 10px;
        }
      }
    }
    .boxItem0 {
      background-color: #fff;
      padding: 20px;
      display: flex;
      justify-content: space-between;
      .label {
        color: #999;
      }
      .value {
        color: #4087f6;
        font-weight: 800;
        font-size: 18px;
      }
    }
    .boxItem {
      margin-top: 30px;
      background-color: #fff;
      .text2 {
        width: 106px;
        color: #323233;
        padding-left: 16px;
      }
      p {
        color: #999;
        margin-bottom: 10px;
        margin-left: 16px;
      }
      .itemContent {
        background-color: #fff;
      }
    }
  }
}
</style>
