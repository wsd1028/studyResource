<template>
  <div class="hotCar">
    <header>
      <el-date-picker
        :clearable="false"
        :picker-options="pickerOptions"
        @change="getCarData"
        end-placeholder="结束日期"
        start-placeholder="开始日期"
        style="margin-right:20px;width:450px"
        type="datetimerange"
        v-model="chooseTime"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>
    </header>
    <div class="map">
      <baidu-map :center="mapConfig.center" :scroll-wheel-zoom="true" :zoom="mapConfig.zoom" @ready="ready" class="baidu-map" style="height:100%">
        <bml-heatmap :data="hotData.list" :max="hotData.max" :radius="20"></bml-heatmap>
      </baidu-map>
    </div>
  </div>
</template>

<script>
import { BmlHeatmap } from 'vue-baidu-map'
export default {
  name: 'hotCar',
  components: {
    BmlHeatmap
  },
  data() {
    return {
      chooseTime: ['', ''],
      timer: null,
      hotData: {
        max: 0,
        list: []
      },
      pickerOptions: {
        disabledDate: time => {
          let nowData = new Date()
          nowData = new Date(nowData.setDate(nowData.getDate()))
          return time > nowData
        }
      },
      //车辆图片
      carDetail: {},
      //车辆数据
      carList: [],
      //车辆图标对象
      carDateSet: null,
      //车辆图标覆盖物
      carMapLayer: null,
      searchData: {
        endTime: '',
        startTime: ''
      },
      mapConfig: {
        zoom: 13,
        dragging: true,
        center: {
          lat: 28.756994,
          lng: 104.641929
        } //地图中心
      }
    }
  },
  async mounted() {
    this.chooseTime = [
      this.$moment()
        .subtract(30, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss'),
      this.$moment().format('YYYY-MM-DD HH:mm:ss')
    ]
  },
  methods: {
    ready(res) {
      this.map = res.map
      // 引入mapv
      const { DataSet, baiduMapLayer, utilCityCenter } = require('mapv')
      this.DataSet = DataSet
      this.baiduMapLayer = baiduMapLayer
      this.utilCityCenter = utilCityCenter
      if (this.map) {
        this.mapConfig.center = { lat: 28.77, lng: 104.62 }
        this.getCarData()
      }
    },
    async getCarData() {
      if (!this.chooseTime) {
        this.$message.error('请选择时间')
        return
      }
      let t1 = this.$moment(this.chooseTime[0]).valueOf()
      let t2 = this.$moment(this.chooseTime[1]).valueOf()
      let hours = (t2 - t1) / 1000 / 60
      //只允许查24小时数据
      if (hours > 30) {
        this.$message.error('一次最多查看30分钟的记录')
        this.chooseTime = [
          this.$moment()
            .subtract(30, 'minutes')
            .format('YYYY-MM-DD HH:mm:ss'),
          this.$moment().format('YYYY-MM-DD HH:mm:ss')
        ]
      }
      this.searchData.startTime = this.chooseTime[0]
      this.searchData.endTime = this.chooseTime[1]
      let resp = await this.$http.get('/carp/business/a/q/hbase/util/hot/gps/page', {
        params: this.searchData
      })
      if (resp.code == 0) {
        this.hotData.list = resp.data.list
        this.hotData.max = resp.data.max
        //this.carList = []
        //for (let i = 0; i < resp.data.length; i++) {
        //  this.carList = [...this.carList, ...resp.data[i]]
        //}
        //if (this.carDateSet) {
        //  this.carDateSet.set(this.fixCarData(this.carList))
        //} else {
        //  //第一次绘制车辆
        //  this.drawCar(this.carList)
        //}
      } else {
        this.$message.error('获取车辆热力分布失败' + resp.message)
      }
    },
    //组装车辆数据
    fixCarData(carList = []) {
      let carData = []
      for (let i = 0; i < carList.length; i++) {
        carData.push({
          geometry: {
            type: 'Point',
            //coordinates: [carList[i].lng, carList[i].latitude]
            coordinates: [carList[i].longitudeBD09, carList[i].latitudeBD09]
          },
          size: 5 //
        })
      }
      return carData
    },
    //绘制车辆点
    async drawCar(carList) {
      this.carDateSet = new this.DataSet(this.fixCarData(carList))
      let carOptions = {
        fillStyle: '#F56C6C',
        shadowBlur: 10,
        shadowColor: 'red',
        draw: 'simple'
      }
      this.carMapLayer = new this.baiduMapLayer(this.map, this.carDateSet, carOptions)
    }
  }
}
</script>

<style lang="less">
.hotCar {
  display: flex;
  flex-direction: column;
  padding: 10px;
  header {
    padding: 10px;
    flex-shrink: 0;
    padding-left: 0;
  }

  .map {
    flex-grow: 1;
  }
  .anchorBL {
    display: none;
  }
}
</style>
