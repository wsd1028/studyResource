<template>
  <el-dialog :before-close="close" :title="title" :visible.sync="dialogVisible" center class="historyMap" width="50%">
    <div class="diaTop">
      <el-date-picker
        :picker-options="pickerOptions"
        @change="changTime"
        align="right"
        end-placeholder="结束日期"
        start-placeholder="开始日期"
        type="datetimerange"
        v-model="chooseTime"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>
      <el-select placeholder="请选择播放速度" style="margin-left:10px" v-model="playSpeed">
        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in playArr"></el-option>
      </el-select>
      <el-button :disabled="carList.length == 0" @click="playCar" style="padding:7px 10px" type="primary">
        <i class="el-icon-video-pause" style="font-size:24px" v-if="isPlay"></i>
        <i class="el-icon-video-play" style="font-size:24px" v-else></i>
      </el-button>
    </div>

    <baidu-map :center="mapConfig.center" :scroll-wheel-zoom="true" :zoom="mapConfig.zoom" @ready="ready" class="baidu-map" style="height:600px">
      <bm-boundary :fillOpacity="0.08" :strokeWeight="2" fillColor="#F56C6C" name="宜宾市" strokeColor="#F56C6C"></bm-boundary>
      <bm-polyline :editing="false" :path="carList" :stroke-weight="5" :strokeOpacity="1" stroke-color="#4285F4"></bm-polyline>
      <div v-if="startCarData.longitudeBD09">
        <!--车辆起始点-->
        <bm-marker
          :icon="{
            url: require('@/assets/images/svg/start.svg'),
            size: { width: 50, height: 85 }
          }"
          :position="{ lng: startCarData.longitudeBD09, lat: startCarData.latitudeBD09 }"
          :zIndex="100"
        ></bm-marker>
      </div>
      <div v-if="endCarData.longitudeBD09">
        <!--车辆终点-->
        <bm-marker
          :icon="{
            url: require('@/assets/images/svg/end.svg'),
            size: { width: 50, height: 85 }
          }"
          :position="{ lng: endCarData.longitudeBD09, lat: endCarData.latitudeBD09 }"
          :zIndex="100"
        ></bm-marker>
      </div>
      <div v-if="nowCarData.longitudeBD09">
        <bm-marker
          :icon="{
            url: require('@/assets/images/svg/historyCar.svg'),
            size: { width: 50, height: 85 }
          }"
          :position="{ lng: nowCarData.longitudeBD09, lat: nowCarData.latitudeBD09 }"
          :zIndex="100"
        >
          <bm-info-window :closeOnClick="false" :offset="{ width: 0, height: -40 }" :show="true" title="当前位置">
            <p class="mapText">时间:{{ nowCarData.timeText }}</p>
            <p class="mapText">速度:{{ nowCarData.speed }}km/h</p>
          </bm-info-window>
        </bm-marker>
      </div>
    </baidu-map>
  </el-dialog>
</template>

<script>
export default {
  name: 'historyMap',

  data() {
    return {
      isPlay: false,
      playSpeed: 1, //播放速度
      playCount: 0, //车辆位置下标
      playArr: [
        {
          value: 1,
          label: '1倍速'
        },
        {
          value: 2,
          label: '2倍速'
        },
        {
          value: 4,
          label: '4倍速'
        },
        {
          value: 8,
          label: '8倍速'
        },
        {
          value: 16,
          label: '16倍速'
        },
        {
          value: 32,
          label: '32倍速'
        }
      ],
      chooseTime: ['', ''], //选择到时间
      pickerOptions: {
        disabledDate: time => {
          let nowData = new Date()
          nowData = new Date(nowData.setDate(nowData.getDate()))
          return time > nowData
        }
      },
      title: '', //标题
      carMessage: null,
      dialogVisible: false,
      mapConfig: {
        zoom: 13,
        dragging: true,
        center: {
          lat: 28.756994,
          lng: 104.641929
        } //地图中心
      },
      //当前地图对象
      map: null,
      BMapConvertor: null,
      carImg: null,
      nowCarData: {}, //当前车辆位置信息
      startCarData: {}, //车辆开始位置信息
      endCarData: {}, //车辆结束位置信息
      //车辆数据
      carList: [],
      //车辆图标对象
      carDateSet: null,
      //车辆图标覆盖物
      iconMapLayer: null,
      //车辆轨迹数据
      carLineObj: null,
      //车辆轨迹对象
      carLineDataSet: null,
      //车辆轨迹覆盖物
      lineMapLayer: null,
      //起始车辆数据集
      startEndDateSet: null,
      //起始车辆覆盖物
      startEndMapLayer: null
    }
  },

  methods: {
    //关闭弹出框
    close(done) {
      //清空时间延时
      clearInterval(this.myTime)
      this.myTime = null
      //清空车辆信息,同时解决弹出dialog时第一次不会制图像问题
      this.nowCarData = {}
      this.startCarData = {}
      this.endCarData = {}
      //清空mapv绘制的车辆起始
      if (this.startEndDateSet) this.startEndDateSet.set([])
      done()
    },
    //绘制起始车辆
    drawStartEndCar(startCar, endCar) {
      let startImg = new Image()
      startImg.src = require('@/assets/images/svg/start.svg')
      startImg.onload = () => {
        let endImg = new Image()
        endImg.src = require('@/assets/images/svg/end.svg')
        endImg.onload = () => {
          let carData = [
            {
              geometry: {
                type: 'Point',
                coordinates: [startCar.longitudeBD09, startCar.latitudeBD09]
              },
              icon: startImg
            },
            {
              geometry: {
                type: 'Point',
                coordinates: [endCar.longitudeBD09, endCar.latitudeBD09]
              },
              icon: endImg
            }
          ]
          this.startEndDateSet = new this.DataSet(carData)
          let carOptions = {
            draw: 'icon',
            width: 50
          }
          this.startEndMapLayer = new this.baiduMapLayer(this.map, this.startEndDateSet, carOptions)
        }
      }
    },
    //组装车辆数据
    fixCarData(carList = []) {
      let carData = []
      for (let i = 0; i < carList.length; i++) {
        carData.push({
          geometry: {
            type: 'Point',
            coordinates: [carList[i].longitudeBD09, carList[i].latitudeBD09]
          },
          icon: this.carImg
        })
      }
      return carData
    },
    //绘制车辆
    drawCar(carList) {
      this.carImg = new Image()
      this.carImg.src = require('@/assets/images/svg/historyCar.svg')
      this.carImg.onload = () => {
        this.carDateSet = new this.DataSet(this.fixCarData(carList))
        let carOptions = {
          draw: 'icon',
          width: 50
        }
        this.iconMapLayer = new this.baiduMapLayer(this.map, this.carDateSet, carOptions)
      }
    },
    //组装车辆轨迹数据
    fixLineData(lineObj) {
      let lineData = []
      let coordinates = []
      for (let i = 0; i < lineObj.length; i++) {
        coordinates.push([lineObj[i].longitudeBD09, lineObj[i].latitudeBD09])
      }
      lineData.push({
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
          count: 30
        }
      })
      return lineData
    },
    //绘制车辆轨迹
    drawLine(lineObj) {
      this.carLineDataSet = new this.DataSet(this.fixLineData(lineObj))
      let lineOptions = {
        strokeStyle: '#409EFF',
        lineWidth: 4
      }
      this.lineMapLayer = new this.baiduMapLayer(this.map, this.carLineDataSet, lineOptions)
    },
    // 百度地图初始化完成
    ready(res) {
      this.map = res.map
      this.BMapConvertor = new res.BMap.Convertor()
      // 引入mapv
      const { DataSet, baiduMapLayer, utilCityCenter } = require('mapv')
      this.DataSet = DataSet
      this.baiduMapLayer = baiduMapLayer
      this.utilCityCenter = utilCityCenter
    },
    async watchHistoy(carMessage) {
      this.isPlay = false
      if (carMessage) {
        this.carMessage = carMessage
      }
      //清空绘制的轨迹
      if (this.carLineDataSet) {
        this.carLineDataSet.set([])
      }
      //清空绘制的车
      if (this.carDateSet) {
        this.carDateSet.set([])
      }
      //清空起始车辆
      if (this.startEndDateSet) {
        this.startEndDateSet.set([])
      }
      if (carMessage) {
        this.chooseTime = [
          this.$moment()
            .subtract(24, 'hours')
            .format('YYYY-MM-DD HH:mm:ss'),
          this.$moment().format('YYYY-MM-DD HH:mm:ss')
        ]
      }
      let t1 = this.$moment(this.chooseTime[0]).valueOf()
      let t2 = this.$moment(this.chooseTime[1]).valueOf()
      let hours = (t2 - t1) / 1000 / 60 / 60
      //只允许查24小时数据
      if (hours > 24) {
        this.$message.error('一次最多查看24小时的记录')
        this.chooseTime = [
          this.$moment()
            .subtract(24, 'hours')
            .format('YYYY-MM-DD HH:mm:ss'),
          this.$moment().format('YYYY-MM-DD HH:mm:ss')
        ]
      }
      this.dialogVisible = true
      this.title = this.carMessage.licensePlate
      let resp = await this.$http.get('/carp/business/a/q/hbase/util/gps/history/page', {
        params: {
          licensePlate: this.carMessage.licensePlate,
          startTime: this.chooseTime[0],
          endTime: this.chooseTime[1]
        }
      })
      if (resp.code == 0) {
        if (resp.data.length == 0) {
          let geolocation = new BMap.LocalCity()
          geolocation.get(res => {
            this.mapConfig.center = res.center
          })
        } else {
          //取车辆初始点作为地图中心
          this.mapConfig.center = {
            lng: resp.data[0].longitudeBD09,
            lat: resp.data[0].latitudeBD09
          }
        }
        for (let i = 0; i < resp.data.length; i++) {
          resp.data[i].lng = resp.data[i].longitudeBD09
          resp.data[i].lat = resp.data[i].latitudeBD09
        }
        this.carList = resp.data
        this.startCarData = resp.data[0] || {}
        this.endCarData = resp.data[resp.data.length - 1] || {}
        //绘制车辆起始
        if (resp.data.length > 0) {
          //使用mapv绘制的起始
          //this.drawStartEndCar(resp.data[0], resp.data[resp.data.length - 1])
        }
      } else {
        this.$message.error('获取车辆轨迹失败' + resp.message)
      }
    },
    changTime() {
      this.watchHistoy()
    },
    playCar() {
      this.isPlay = !this.isPlay
      if (this.isPlay && !this.myTime) {
        this.myTime = setInterval(() => {
          this.nowCarData = this.carList[this.playCount]
          this.playCount += this.playSpeed
          if (this.playCount > this.carList.length - this.playSpeed) {
            if (this.playCount != this.carList.length - 1) this.nowCarData = this.carList[this.carList.length - 1]
            this.playCount = 0
            clearInterval(this.myTime)
            this.isPlay = false //车辆轨迹播放结束
            this.myTime = null
          }
        }, 1000)
      }
      if (!this.isPlay) {
        if (this.myTime) {
          clearInterval(this.myTime)
          this.myTime = null
        }
      }
    }
  },

  mounted() {
    this.chooseTime = [
      this.$moment()
        .subtract(24, 'hours')
        .format('YYYY-MM-DD HH:mm:ss'),
      this.$moment().format('YYYY-MM-DD HH:mm:ss')
    ]
  }
}
</script>

<style lang="less">
.historyMap {
  .el-dialog__body {
    padding-top: 10px;
  }
  img[src="https://api.map.baidu.com/images/iw_close1d3.gif"] {
    display: none;
  }
  p {
    margin: 0;
  }
  .BMap_bubble_title {
    text-align: center;
    background-color: #4285f4;
    font-size: 16px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(255, 255, 255, 1);
    padding: 2px 0;
  }
  .mapText {
    font-size: 12px;
    margin-top: 6px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    padding-left: 6px;
  }
  .el-dialog__title {
    font-size: 32px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(66, 133, 244, 1);
  }
  .diaTop {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
  }
}
</style>
