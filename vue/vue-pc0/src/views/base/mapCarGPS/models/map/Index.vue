<template>
  <div class="mapCarGps_map">
    <baidu-map
      :center="{
        lat: 28.756994,
        lng: 104.641929
      }"
      :map-click="false"
      :scroll-wheel-zoom="true"
      :zoom="13"
      @ready="ready"
      class="baidu-map"
      ref="map"
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
        <div style="padding-bottom:10px">
          是否关注：
          <el-switch :width="50" @change="changeCollect($event, carDetail)" v-model="carDetail.checked"></el-switch>
        </div>
      </bm-info-window>
      <bm-info-window :closeOnClick="true" :position="garbageDetail.position" :show="garbageDetail.show" @close="infoWindowClose" @open="infoWindowOpen" title>
        <p>消纳站名称：{{ garbageDetail.name }}</p>
        <p>消纳站地址：{{ garbageDetail.address }}</p>
      </bm-info-window>
      <bm-boundary :fillOpacity="0.08" :strokeWeight="2" fillColor="#F56C6C" name="宜宾市" strokeColor="#F56C6C"></bm-boundary>
    </baidu-map>
  </div>
</template>

<script>
export default {
  name: 'dustMap',
  data() {
    // 地图配置项
    const options = {
      center: '宜宾'
    }
    return {
      options,
      //当前地图对象
      map: null,
      redCarImg: null,
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
      //消纳站数据
      garbageList: [],
      //消纳站对象
      garbageDateSet: null,
      //消纳站覆盖物
      garbageMapLayer: null,
      // WebSocket实例
      WS: null,
      carPhoneList: false,
      lineStyle: {
        color: 'red'
      },
      //点击的车辆信息
      carDetail: {},
      //点击的消纳站信息
      garbageDetail: {}
    }
  },
  async mounted() {
    //加载4辆车
    this.redCarImg = await this.getImg('redCar')
    this.whiteCarImg = await this.getImg('whiteCar')
    this.greenCarImg = await this.getImg('greenCar')
    this.garbage_blueImg = await this.getImg('garbage_blue')
    //非名录车
    this.yellowCarImg = await this.getImg('yellowCar')
  },
  methods: {
    infoWindowClose() {
      this.garbageDetail.show = false
    },
    infoWindowOpen() {
      this.garbageDetail.show = true
      this.carDetail.phone = ''
    },
    carWindowClose() {
      this.carDetail.show = false
    },
    carClickClose() {
      this.carDetail.phone = ''
    },
    carWindowOpen() {
      this.carDetail.show = true
      this.$forceUpdate()
    },
    //改变关注状态
    async changeCollect(val, item) {
      let resp = {}
      if (val) {
        resp = await this.$http.post('/carp/business/a/q/car/user/insert', [
          {
            plateLicense: item.licensePlate,
            userId: this.$store.state.user.userInfo.id
          }
        ])
      } else {
        resp = await this.$http.delete('/carp/business/a/q/car/user/remove', {
          params: {
            id: item.collectionId,
            deletePerson: this.$store.state.user.userInfo.id
          }
        })
      }
      if (resp.code == 0) {
        this.$message.success('操作成功')
        if (val) {
          this.carDetail.checked = true
        } else {
          this.carDetail.checked = false
        }
        this.$emit('changeCollect')
      } else {
        this.$message.error('操作失败: ' + resp.message)
      }
      this.$forceUpdate()
    },
    //得到消纳站数据
    async getGarbage() {
      let resp = await this.$http.get('/carp/business/a/q/garbage/station/gps/all?areaCode=5115')
      if (resp.code == 0) {
        this.garbageList = resp.data
        this.drawGarbage(this.garbageList)
      } else {
        this.$message.error('获取消纳站信息失败' + resp.message)
      }
    },
    //组装消纳站数据
    fixGarbageData(garbageList = []) {
      let carData = []
      for (let i = 0; i < garbageList.length; i++) {
        carData.push({
          geometry: {
            type: 'Point',
            coordinates: [garbageList[i].longitude, garbageList[i].latitude]
          },
          icon: this.garbage_blueImg,
          target: garbageList[i]
        })
      }
      return carData
    },
    //绘制消纳站
    async drawGarbage(garbageList) {
      this.garbageDateSet = new this.DataSet(this.fixGarbageData(garbageList))
      let garbageOptions = {
        draw: 'icon',
        zIndex: 100,
        methods: {
          // 一些事件回调函数
          mousemove: async e => {
            // 点击事件，返回对应点击元素的对象值
            if (e) {
              if (this.garbageDetail.id != e.target.id) {
                this.garbageDetail = e.target
                this.garbageDetail.position = {
                  lng: e.target.longitude,
                  lat: e.target.latitude
                }
                this.garbageDetail.show = true
              }
            }
          }
        }
      }
      this.garbageMapLayer = new this.baiduMapLayer(this.map, this.garbageDateSet, garbageOptions)
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
            coordinates: [carList[i].longitude, carList[i].latitude]
          },
          deg: carList[i].direction,
          icon: img,
          phone: carList[i].phone,
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
            if (e) {
              if (!e.target || e.target.phone == this.carDetail.phone) {
                return
              }
              this.carDetail.phone = e.target.phone
              for (let i = 0; i < this.carPhoneList.length; i++) {
                if (e.target.phone == this.carPhoneList[i].phone) {
                  try {
                    let resp = await this.$http.get('/carp/business/a/q/car/palte?plateNumber=' + this.carPhoneList[i].licensePlate)
                    if (resp.code == 0) {
                      this.carDetail = resp.data || {}
                    } else {
                      this.$message.error('该车辆为非名录车')
                    }
                  } catch {
                    this.carDetail = {}
                  }
                  this.carDetail.show = true
                  this.carDetail.collectionId = this.carPhoneList[i].collectionId
                  this.carDetail.plateNumber = this.carPhoneList[i].licensePlate
                  this.carDetail.checked = this.carPhoneList[i].checked ? true : false
                  this.carDetail.speed = e.target.speed / 10
                  this.carDetail.phone = e.target.phone
                  this.carDetail.position = {
                    lng: e.target.longitude,
                    lat: e.target.latitude
                  }
                  this.$forceUpdate()
                }
              }
            }
          }
        }
      }
      this.iconMapLayer = new this.baiduMapLayer(this.map, this.carDateSet, carOptions)
    },
    //组装车辆轨迹数据
    fixLineData(lineObj) {
      let lineData = []
      for (const key in lineObj) {
        let coordinates = []
        for (let i = 0; i < lineObj[key].length; i++) {
          coordinates.push([lineObj[key][i].longitude, lineObj[key][i].latitude])
        }
        lineData.push({
          geometry: {
            type: 'LineString',
            coordinates: coordinates,
            count: 30
          }
        })
      }
      return lineData
    },
    //绘制车辆轨迹
    drawLine(lineObj) {
      this.carLineDataSet = new this.DataSet(this.fixLineData(lineObj))
      let lineOptions = {
        strokeStyle: '#409EFF',
        lineWidth: 5
      }
      this.lineMapLayer = new this.baiduMapLayer(this.map, this.carLineDataSet, lineOptions)
    },
    // 百度地图初始化完成
    ready(res) {
      this.map = res.map
      // 引入mapv
      const { DataSet, baiduMapLayer, utilCityCenter } = require('mapv')
      this.DataSet = DataSet
      this.baiduMapLayer = baiduMapLayer
      this.utilCityCenter = utilCityCenter
      // 车辆gps数据监听
      this.getCarGpsPoint()
      //绘制消纳站
      this.getGarbage()
    },
    //由列表组件触发
    setCenter(data) {
      this.carDetail = {}
      this.carPhoneList = data
      //if (this.carPhoneList != false) {
      this.sendMessage(this.carPhoneList)
      //}
      for (let i = 0; i < this.carPhoneList.length; i++) {
        if (this.carDetail.phone == this.carPhoneList[i].phone) {
          this.carDetail.collectionId = this.carPhoneList[i].collectionId
        }
      }
    },
    // 车辆gps数据监听
    getCarGpsPoint() {
      //本地location.host
      //线上218.6.151.186:99
      this.WS = this.$ws(`ws://218.6.151.186:99/carp/gps/k/q/socket`)
        .catch(err => {
          console.log('链接错误', err)
        })
        .then(resp => {
          //0:链接成功
          //1.初始点位,实时点位上一个
          //2.实时点位
          if (resp.code == 0) {
            if (this.carPhoneList == false) this.carPhoneList = []
            this.sendMessage(this.carPhoneList)
          }
          if (resp.code == 1) {
            this.carList = resp.data
            //第一次组装线条数据
            let carLineObj = {}
            for (let i = 0; i < resp.data.length; i++) {
              carLineObj[resp.data[i].phone] = [
                {
                  latitude: resp.data[i].latitude,
                  longitude: resp.data[i].longitude
                }
              ]
            }
            this.carLineObj = carLineObj
            if (this.carDateSet) {
              this.carDateSet.set(this.fixCarData(this.carList))
            } else {
              //第一次绘制车辆
              this.drawCar(resp.data)
            }
            if (this.carLineDataSet) {
              this.carLineDataSet.set(this.fixLineData(this.carLineObj))
            } else {
              //第一次绘制车辆轨迹
              this.drawLine(this.carLineObj)
            }
          }
          if (resp.code == 2) {
            //修改车辆位置信息
            for (let i = 0; i < this.carList.length; i++) {
              if (this.carList[i].phone == resp.data.phone) {
                this.carList[i].latitude = resp.data.latitude
                this.carList[i].longitude = resp.data.longitude
              }
            }
            if (this.carDateSet) this.carDateSet.set(this.fixCarData(this.carList))
            //修改车辆轨迹信息
            if (this.carLineObj[resp.data.phone])
              this.carLineObj[resp.data.phone].push({
                latitude: resp.data.latitude,
                longitude: resp.data.longitude
              })
            ////绘制线条
            if (this.carLineDataSet) {
              this.carLineDataSet.set(this.fixLineData(this.carLineObj))
            }
          }
        })
    },
    //设置监听车辆
    sendMessage(arr) {
      let str = []
      for (let i = 0; i < arr.length; i++) {
        str.push(arr[i].phone)
      }
      if (this.WS)
        this.WS.send(
          JSON.stringify({
            code: 0,
            data: str.join(),
            message: ''
          })
        )
    }
  },
  beforeDestroy() {
    // 关闭WebSocket
    this.WS.close()
  }
}
</script>

<style lang="less">
.mapCarGps_map {
  .anchorBL {
    display: none;
  }
  .baidu-map {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .test {
    position: fixed;
    top: 200px;
    left: 800px;
    z-index: 200;
  }
  .el-dialog__title {
    font-size: 32px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: rgba(66, 133, 244, 1);
  }
}
</style>
