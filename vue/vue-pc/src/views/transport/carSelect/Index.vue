<template>
  <div class="carSelect">
    <header>
      <el-date-picker
        :clearable="false"
        :picker-options="pickerOptions"
        @change="getCarData"
        end-placeholder="结束日期"
        start-placeholder="开始日期"
        style="margin-right:20px;width:368px"
        type="datetimerange"
        v-model="chooseTime"
        value-format="yyyy-MM-dd HH:mm:ss"
      ></el-date-picker>
      <span style="margin-right: 8px">选择范围:</span>
      <el-select @change="getCarData" placeholder="请选择范围" style="width:120px" v-model="searchData.scope">
        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in searchList"></el-option>
      </el-select>
    </header>
    <div class="map">
      <baidu-map
        :center="mapConfig.center"
        :scroll-wheel-zoom="true"
        :zoom="mapConfig.zoom"
        @click="getPoint"
        @ready="ready"
        class="baidu-map"
        style="height:100%"
      >
        <bm-info-window
          :closeOnClick="true"
          :position="carDetail.position"
          :show="carDetail.show"
          @clickclose="carClickClose"
          @close="carWindowClose"
          @open="carWindowOpen"
          title
        >
          <p>运营业户：{{ carDetail.ownerName }}</p>
          <p>联系方式：{{ carDetail.ownerPhone }}</p>
          <p>车牌号：{{ carDetail.plateNumber }}</p>
          <p>速度：{{ carDetail.speed }}km/h</p>
        </bm-info-window>
        <bm-marker :dragging="true" :position="mapConfig.position"></bm-marker>
      </baidu-map>
    </div>
  </div>
</template>

<script>
export default {
  name: 'carSelect',
  data() {
    return {
      chooseTime: ['', ''],
      carDetail: {},
      searchList: [
        {
          label: '5009.4km',
          value: 1
        },
        {
          label: '1252.3km',
          value: 2
        },
        {
          label: '156.5km',
          value: 3
        },
        {
          label: '39.1km',
          value: 4
        },
        {
          label: '4.9km',
          value: 5
        },
        {
          label: '1.2km',
          value: 6
        },
        {
          label: '152.9m',
          value: 7
        },
        {
          label: '38.2m',
          value: 8
        }
      ],
      timer: null,
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
        lat: '',
        lng: '',
        scope: 4,
        startTime: ''
      },
      mapConfig: {
        zoom: 15,
        dragging: true,
        position: {},
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
    //加载3辆车
    this.redCarImg = await this.getImg('redCar')
    this.whiteCarImg = await this.getImg('whiteCar')
    this.greenCarImg = await this.getImg('greenCar')
  },
  methods: {
    carWindowClose() {
      this.carDetail.show = false
    },
    carClickClose() {
      this.carDetail = {}
    },
    carWindowOpen() {
      this.carDetail.show = true
      this.$forceUpdate()
    },
    // 百度地图初始化完成
    //点击地图
    async getPoint(e) {
      let geocoder = new BMap.Geocoder() //创建地址解析器的实例
      geocoder.getLocation(e.point, rs => {
        //地址描述
        this.mapConfig.position = e.point
        this.searchData.lat = e.point.lat
        this.searchData.lng = e.point.lng
        if (!this.timer) {
          this.timer = setTimeout(() => {
            this.getCarData()
            this.timer = null
          }, 1000)
        }
      })
    },
    ready(res) {
      this.map = res.map
      // 引入mapv
      const { DataSet, baiduMapLayer, utilCityCenter } = require('mapv')
      this.DataSet = DataSet
      this.baiduMapLayer = baiduMapLayer
      this.utilCityCenter = utilCityCenter
      if (this.map) {
        this.mapConfig.position = { lat: 28.77, lng: 104.62 }
        this.mapConfig.center = { lat: 28.77, lng: 104.62 }
        this.searchData.lat = 28.77
        this.searchData.lng = 104.62
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
      let resp = await this.$http.get('/carp/business/a/q/hbase/util/gps/page', {
        params: this.searchData
      })
      if (resp.code == 0) {
        this.carList = resp.data
        if (this.carDateSet) {
          this.carDateSet.set(this.fixCarData(this.carList))
        } else {
          //第一次绘制车辆
          this.drawCar(this.carList)
        }
      } else {
        this.$message.error('获取车辆失败' + resp.message)
      }
    },
    //组装车辆数据
    fixCarData(carList = []) {
      let carData = []
      for (let i = 0; i < carList.length; i++) {
        let img = null
        if (carList[i].speed >= 800) {
          img = this.redCarImg
        } else if (carList[i].speed > 0) {
          img = this.greenCarImg
        } else {
          img = this.whiteCarImg
        }
        carData.push({
          geometry: {
            type: 'Point',
            coordinates: [carList[i].longitudeBD09, carList[i].latitudeBD09]
          },
          deg: carList[i].direction,
          icon: img,
          target: carList[i]
        })
      }
      return carData
    },
    async getImg(name) {
      let img = await new Promise((resolve, reject) => {
        var image = new Image()
        image.src = require('@/assets/images/svg/' + name + '.svg')
        if (image) {
          resolve(image)
        } else {
          reject(false)
        }
      })
      return img
    },
    //绘制车辆
    async drawCar(carList) {
      this.carDateSet = new this.DataSet(this.fixCarData(carList))
      let carOptions = {
        draw: 'icon',
        zIndex: 100,
        methods: {
          // 一些事件回调函数
          mousemove: async e => {
            if (e && e.target) {
              if (this.carDetail.licensePlate != e.target.licensePlate) {
                this.carDetail = e.target
                try {
                  let resp = await this.$http.get('/carp/business/a/q/car/palte?plateNumber=' + e.target.licensePlate)
                  if (resp.code == 0) {
                    this.carDetail = resp.data || {}
                  } else {
                    this.$message.error('该车辆为非名录车')
                  }
                } catch {
                  this.carDetail = {}
                }
                console.log(e.target)
                this.carDetail.show = true
                this.carDetail.plateNumber = e.target.licensePlate
                this.carDetail.licensePlate = e.target.licensePlate
                this.carDetail.speed = e.target.speed
                this.carDetail.position = {
                  lng: e.target.longitudeBD09,
                  lat: e.target.latitudeBD09
                }
                this.$forceUpdate()
              }
            }
          }
        }
      }
      this.carMapLayer = new this.baiduMapLayer(this.map, this.carDateSet, carOptions)
    }
  }
}
</script>

<style lang="less">
.carSelect {
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
  .el-date-editor .el-range__icon{
    line-height: 30px;
  }
  .el-date-editor .el-range-separator{
    line-height: 26px;
  }
  .el-input__icon{
    line-height: 35px;
  }
  .el-input__inner{
    height: 35px;
    line-height: 35px;
  }
}
</style>
