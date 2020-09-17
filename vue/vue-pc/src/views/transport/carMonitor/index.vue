<template>
  <div class="carMonitor">
    <div :class="['leftbox', leftObj.active ? 'left-icon1' : 'left-icon0']">
      <div @click="handelIcon('left')" class="Icon icon-left-radius" style="right:-20px">
        <i class="el-icon-arrow-left" style="color:#fff;font-size:22px;font-weight: bold;padding-top: 13px" v-if="leftObj.active"></i>
        <i class="el-icon-arrow-right" style="color:#fff;font-size:22px;font-weight: bold;padding-top: 13px" v-else></i>
      </div>
      <div class="section">
        <div style="text-align:center">
          <el-date-picker
            :clearable="false"
            @change="changeData"
            placeholder="选择月"
            style="width:300px"
            type="month"
            v-model="leftObj.time"
            value-format="yyyy-MM"
          ></el-date-picker>
        </div>
        <div>
          <p class="fc6" style="margin-top:20px;font-weight: bold">车辆汇总</p>
          <div style="text-align:center">
            <span class="allCar">总车辆 {{ carCount.total }}</span>
          </div>
          <div style="display:flex;margin-top:10px">
            <div style="width:50%;text-align:center">
              <p style="font-weight:600;font-size:20px;color:#409eff">{{ carCount.allow }}</p>
              <p class="fc3" style="font-size:12px;">名录</p>
            </div>
            <div style="width:50%;text-align:center">
              <p style="font-weight:600;font-size:20px;color:#F56C6C">{{ carCount.not_allow }}</p>
              <p class="fc3" style="font-size:12px;">非名录</p>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
        <div class="box">
          <div class="top">
            <p>非名录车TOP5</p>
            <p>更多</p>
          </div>
          <div :key="index" class="item" v-for="(item, index) in leftList1">
            <p class="label" v-text="item.device_name"></p>
            <p class="value" v-text="item.count"></p>
          </div>
        </div>
        <div class="box">
          <div class="top">
            <p>交通和工地卡口非名录车TOP5</p>
            <p>更多</p>
          </div>
          <div :key="index" class="item" v-for="(item, index) in leftList2">
            <p @click="handelLicense(item.license)" class="label" v-text="item.license"></p>
            <p class="value" v-text="item.count"></p>
          </div>
        </div>
        <div class="box">
          <div class="top">
            <p>交通卡口非名录车TOP5</p>
            <p>更多</p>
          </div>
          <div :key="index" class="item" v-for="(item, index) in leftList3">
            <p @click="handelLicense(item.license)" class="label" v-text="item.license"></p>
            <p class="value" v-text="item.count"></p>
          </div>
        </div>
        <div class="box">
          <div class="top">
            <p>工地卡口非名录车TOP5</p>
            <p>更多</p>
          </div>
          <div :key="index" class="item" v-for="(item, index) in leftList4">
            <p @click="handelLicense(item.license)" class="label" v-text="item.license"></p>
            <p class="value" v-text="item.count"></p>
          </div>
        </div>
      </div>
    </div>
    <div class="middle">
      <baidu-map :center="mapConfig.center" :map-click="false" :scroll-wheel-zoom="mapConfig.scroll" :zoom="mapConfig.zoom" @ready="ready" class="map">
        <bm-overlay @draw="drawOverlay" class="BmOverlay" pane="labelPane" ref="BmOverlay">
          <div class="overlay_div">
            <div class="icon"></div>
            <i @click="handelClose" class="el-icon-error close"></i>
            <p>卡口名称:{{ bayonetDetail.name || bayonetDetail.workplaceName }}</p>
            <el-table :data="bayonetList" height="200px" size="mini" style="width:100%">
              <el-table-column align="center" label="车牌号" prop="license" width="100"></el-table-column>
              <el-table-column align="center" label="时间" prop="createDate"></el-table-column>
            </el-table>
          </div>
        </bm-overlay>
      </baidu-map>
      <div class="chartDiv" ref="chartDiv">
        <div class="chart" id="chart"></div>
      </div>
    </div>
    <div :class="['rightbox', rightObj.active ? 'right-icon1' : 'right-icon0']">
      <div @click="handelIcon('right')" class="Icon icon-right-radius" style="left:-20px">
        <i class="el-icon-arrow-left" style="color:#fff;font-size:22px;font-weight: bold;padding-top: 13px" v-if="!rightObj.active"></i>
        <i class="el-icon-arrow-right" style="color:#fff;font-size:22px;font-weight: bold;padding-top: 13px" v-else></i>
      </div>
      <p class="carNumber">{{ license }}</p>
      <el-divider></el-divider>
      <div class="box">
        <div class="top">
          <p>卡口抓拍</p>
          <p>{{ rightList1.length }}</p>
        </div>
        <div class="item">
          <el-carousel :interval="3000" arrow="always">
            <el-carousel-item :key="index" v-for="(item, index) in rightList1">
              <div class="img">
                <el-image :src="$store.state.config.convertImgUrl(item.carPhoto, true)" fit="contain" style="width: 100%; height: 100%">
                  <div class="image-slot" slot="error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
      <div class="box">
        <div class="top">
          <p>固定源抓拍</p>
          <p>{{ rightList2.length }}</p>
        </div>
        <div class="item">
          <el-carousel :interval="3000" arrow="always">
            <el-carousel-item :key="index" v-for="(item, index) in rightList2">
              <div class="img">
                <el-image :src="$store.state.config.convertImgUrl(item.carPhoto, true)" fit="contain" style="width: 100%; height: 100%">
                  <div class="image-slot" slot="error">
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  name: 'carMonitor',
  data() {
    return {
      license: '',
      //chart对象
      myChart: null,
      //车辆汇总
      carCount: {},
      //非名录车(左边框1模块数据)
      leftList1: [],
      //非名录车(左边框2模块数据)
      leftList2: [],
      //非名录车(左边框3模块数据)
      leftList3: [],
      //非名录车(左边框4模块数据)
      leftList4: [],
      //图片(右边框1模块数据)
      rightList1: [],
      //图片(右边框2模块数据)
      rightList2: [],
      mapConfig: {
        zoom: 13,
        dragging: true,
        scroll: true,
        center: {
          lat: 28.756994,
          lng: 104.641929
        } //地图中心
      },
      leftObj: {
        time: '',
        active: true
      },
      rightObj: {
        active: true
      },
      //卡口数据
      bayonetList: [],
      bayonetDetail: {}
    }
  },
  async created() {},
  async mounted() {
    this.leftObj.time = this.$moment().format('YYYY-MM')
    this.getCarCount()
    this.getLeft(1, '', '非名录车TOP5')
    this.getLeft(2, '', '交通和工地卡口非名录车TOP5')
    this.getLeft(3, '6001', '交通卡口非名录车TOP5')
    this.getLeft(4, '6008', '工地卡口非名录车TOP5')
    window.addEventListener('resize', this.toResize)
  },
  methods: {
    changeData() {
      this.getCarCount()
      this.getLeft(1, '', '非名录车TOP5')
      this.getLeft(2, '', '交通和工地卡口非名录车TOP5')
      this.getLeft(3, '6001', '交通卡口非名录车TOP5')
      this.getLeft(4, '6008', '工地卡口非名录车TOP5')
    },
    //点击收缩图标
    handelIcon(type) {
      if (type == 'left') {
        this.leftObj.active = !this.leftObj.active
        if (this.leftObj.active) {
          this.$refs.chartDiv.style.paddingLeft = '350px'
        } else {
          this.$refs.chartDiv.style.paddingLeft = '0'
        }
      } else {
        this.rightObj.active = !this.rightObj.active
      }
      this.toResize()
    },
    //左边框模块数据
    async getLeft(index = 1, workplaceType = '', title = '') {
      let startDate = '',
        endDate = ''
      startDate = this.$moment(this.leftObj.time).format('YYYY-MM-DD')
      endDate = this.$moment(this.leftObj.time)
        .endOf('month')
        .format('YYYY-MM-DD')
      let url = index == 1 ? '/carp/business/a/q/manage/center/notAllowCarTopDeviceName' : '/carp/business/a/q/manage/center/notAllowCarTop'
      let resp = await this.$http.get(url, {
        params: {
          topCount: 5,
          workplaceType: workplaceType,
          startDate,
          endDate
        }
      })
      if (resp.code == 0) {
        this['leftList' + index] = resp.data
        //给左边框,chart初始化数据
        if (index != 1 && resp.data.length > 0) {
          this.getRight(1, resp.data[0].license)
          this.getRight(2, resp.data[0].license)
          this.drawChart(resp.data[0].license)
          this.license = resp.data[0].license
        }
      } else {
        this.$message.error('获取' + title + '失败' + resp.message)
      }
    },
    //点击车牌
    handelLicense(license) {
      this.license = license
      this.getRight(1, license)
      this.getRight(2, license)
      this.drawChart(license)
    },
    //右边框模块数据
    async getRight(index = 1, license) {
      let resp = await this.$http.get('/carp/business/a/q/license/record/history/page', {
        params: {
          limit: 99999,
          page: 1,
          license,
          time: this.$moment().format('YYYY'),
          workplaceType: index == 1 ? 6001 : 6008
        }
      })
      if (resp.code == 0) {
        this['rightList' + index] = resp.data.records
      } else {
        this.$message.error('获取车辆信息失败' + resp.message)
      }
    },
    //得到车辆汇总
    async getCarCount() {
      let startDate = '',
        endDate = ''
      startDate = this.$moment(this.leftObj.time).format('YYYY-MM-DD')
      endDate = this.$moment(this.leftObj.time)
        .endOf('month')
        .format('YYYY-MM-DD')
      let resp = await this.$http.get('/carp/business/a/q/manage/center/getCarSum', {
        params: {
          startDate,
          endDate
        }
      })
      if (resp.code == 0) {
        this.carCount = resp.data
      } else {
        this.$message.error('获取车辆汇总失败' + resp.message)
      }
    },
    //改变
    toResize() {
      if (this.myChart) this.myChart.resize()
    },
    //得到图片
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
    //绘制chart
    async drawChart(license = '') {
      let resp = await this.$http.get('/carp/business/a/q/road/intersection/time', {
        params: {
          plate: license,
          month: this.$moment(this.leftObj.time).format('MM'),
          year: this.$moment(this.leftObj.time).format('YYYY'),
          startTime: this.$moment(this.leftObj.time).format('YYYY-MM-DD'),
          endTime: this.$moment(this.leftObj.time)
            .endOf('month')
            .format('YYYY-MM-DD')
        }
      })
      let xData = [],
        yData = []
      if (resp.code == 0) {
        for (let i = 0; i < resp.data.key.length; i++) {
          resp.data.key[i] = this.$moment(resp.data.key[i]).format('MM-DD')
        }
        xData = resp.data.key
        yData = resp.data.value
      } else {
        this.$message.error('获取车辆信息失败' + resp.message)
      }
      this.myChart = echarts.init(document.getElementById('chart'))
      let option = {
        title: {
          text: license + '数据分布',
          x: 'left',
          textStyle: {
            color: '#333',
            fontSize: '16',
            fontWeight: 'normal'
          }
        },
        grid: {
          top: '20%',
          left: 0,
          right: 0,
          bottom: '0',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#333'
            }
          }
        },
        calculable: true,
        xAxis: [
          {
            type: 'category',
            axisLine: {
              lineStyle: {
                color: '#999'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: true
            },
            splitArea: {
              show: false
            },
            data: xData
          }
        ],
        yAxis: [
          {
            show: false,
            type: 'value',
            splitLine: {
              show: false
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: 'white'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              interval: 0
            },
            splitArea: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '拍摄次数',
            type: 'bar',
            stack: '总量',
            barMaxWidth: 50,
            itemStyle: {
              normal: {
                color: '#F56C6C',
                label: {
                  show: true,
                  position: 'inside',
                  textStyle: {
                    color: '#fff',
                    textBorderColor: '#F56C6C',
                    textBorderWidth: 2
                  }
                }
              }
            },
            data: yData
          }
        ]
      }
      this.myChart.setOption(option, true)
    },
    //初始化地图
    async ready(res) {
      this.map = res.map
      // 引入mapv
      const { DataSet, baiduMapLayer, utilCityCenter } = require('mapv')
      this.DataSet = DataSet
      this.baiduMapLayer = baiduMapLayer
      this.utilCityCenter = utilCityCenter
      if (this.map) {
        this.mapConfig.center = { lat: 28.77, lng: 104.62 }
        this.blueBayonetImg = await this.getImg('blueBayonet')
        this.redBayonetImg = await this.getImg('redBayonet')
        this.getBayonet()
      }
    },
    //得到卡口数据
    async getBayonet() {
      let resp0 = await this.$http.get('/carp/business/a/q/road/intersection/name?name=')
      if (resp0.code == 0) {
        this.bayonetList = resp0.data
      } else {
        this.$message.error('获取道路卡口失败' + resp0.message)
      }
      let resp1 = await this.$http.get('/carp/business/a/q/license/integrated/project/page', {
        params: {
          limit: 9999,
          page: 1
        }
      })
      if (resp1.code == 0) {
        if (resp1.data.records.length > 0) {
          this.bayonetList = [...this.bayonetList, ...resp1.data.records]
        }
      } else {
        this.$message.error('获取工地卡口失败' + resp1.message)
      }
      if (this.bayonetDateSet) {
        this.bayonetDateSet.set(this.fixBayonetData(this.bayonetList))
      } else {
        //第一次绘制车辆
        this.drawBayonet(this.bayonetList)
      }
    },
    //组装卡口数据
    fixBayonetData(bayonetArr) {
      let data = []
      for (let i = 0; i < bayonetArr.length; i++) {
        let img = this.blueBayonetImg
        if (!bayonetArr[i].workplaceId) {
          img = this.redBayonetImg
        }
        data.push({
          geometry: {
            type: 'Point',
            coordinates: [bayonetArr[i].longitude, bayonetArr[i].latitude]
          },
          icon: img,
          target: bayonetArr[i]
        })
      }
      return data
    },
    //绘制卡口
    async drawBayonet(bayonetList) {
      this.bayonetDateSet = new this.DataSet(this.fixBayonetData(bayonetList))
      let bayonetOptions = {
        draw: 'icon',
        cursor: 'pointer',
        zIndex: 100,
        methods: {
          // 一些事件回调函数
          mousemove: async e => {
            if (e && e.target && this.bayonetDetail.id != e.target.id) {
              this.mapConfig.scroll = false
              this.bayonetDetail = e.target
              if (this.$refs.BmOverlay) {
                this.getLicenseList(e.target.workplaceId || e.target.id)
                this.$refs.BmOverlay.reload()
              }
            }
          }
        }
      }
      this.bayonetMapLayer = new this.baiduMapLayer(this.map, this.bayonetDateSet, bayonetOptions)
    },
    handelClose() {
      this.mapConfig.scroll = true
      this.bayonetDetail = {}
      this.$refs.BmOverlay.reload()
    },
    drawOverlay({ el, BMap, map }) {
      const pixel = map.pointToOverlayPixel(new BMap.Point(this.bayonetDetail.longitude, this.bayonetDetail.latitude))
      el.style.left = pixel.x + 30 + 'px'
      el.style.top = pixel.y - 100 + 'px'
    },
    async getLicenseList(workplaceId) {
      let startTime = this.$moment().format('YYYY-MM-DD ') + '00:00:00'
      let endTime = this.$moment().format('YYYY-MM-DD ') + '23:59:59'
      let resp = await this.$http.get('carp/business/a/q/road/intersection/workplaceId', {
        params: {
          startTime,
          endTime,
          workplaceId
        }
      })
      if (resp.code == 0) {
        this.bayonetList = resp.data
      } else {
        this.$message.error('获取车辆失败' + resp.message)
      }
    }
  }
}
</script>

<style lang="less">
.carMonitor {
  position: relative;
  overflow: hidden;
  padding: 10px;
  font-size: 12px;
  *::-webkit-scrollbar {
    width: 0;
  }
    .BmOverlay {
    width: 320px;
    padding: 10px;
    box-sizing: border-box;
    background-color: #fff;
    position: absolute;
    color: #333;
    .overlay_div {
      .icon {
        border: 20px solid;
        border-color: transparent#fff transparent transparent;
        position: absolute;
        left: -40px;
        top: 80px;
      }
      .close {
        position: absolute;
        right: -12px;
        top: -12px;
        font-size: 30px;
        color: #666;
      }
    }
  }
  .left-icon1 {
    left: 0 !important;
  }
  .left-icon0 {
    left: -350px !important;
  }
  .right-icon1 {
    right: 0 !important;
  }
  .right-icon0 {
    right: -350px !important;
  }
  .icon-left-radius {
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .icon-right-radius {
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
  }
  .Icon {
    position: absolute;
    cursor: pointer;
    width: 20px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    top: 0;
    bottom: 0;
    margin: auto;
    overflow: hidden;
    background-color: #66b1ff;
  }
  .fc3 {
    color: #333;
  }
  .fc6 {
    color: #666;
  }
  p {
    margin: 0;
    padding: 0;
  }
  .anchorBL {
    display: none;
  }
  .leftbox {
    position: absolute;
    padding: 0.1rem;
    top: 50%;
    left: 0;
    height: 96%;
    background-color: #fff;
    width: 350px;
    z-index: 2;
    box-sizing: border-box;
    transform: translate(0, -50%);
    transition: all 0.5s;
    -moz-box-shadow: 0px 0px 10px rgba(51,51,51,0.12); /* 老的 Firefox */
    box-shadow: 0px 0px 10px rgba(51,51,51,0.12);
    .section {
      height: 100%;
      overflow: auto;
    }
    .allCar {
      border: 1px solid #409eff;
      display: inline-block;
      padding: 0 15px;
      height: 30px;
      line-height: 30px;
      border-radius: 20px;
      color: #409eff;
      font-size: 14px;
    }
    .box {
      margin-top: 10px;
      border: 1px solid #409eff;
      .top {
        background-color: #409eff;
        display: flex;
        justify-content: space-between;
        color: #fff;
        line-height: 40px;
        padding: 0 10px;
      }
      .item {
        display: flex;
        justify-content: space-between;
        line-height: 30px;
        padding: 0 10px;
        .label {
          color: #20c28e;
          cursor: pointer;
        }
        .value {
          color: #333;
        }
      }
    }
  }
  .middle {
    display: flex;
    flex-direction: column;
    height: 100%;
    .map {
      width: 100%;
      flex-grow: 2;
      flex-basis: 0;
    }
    .chartDiv {
      width: 100%;
      padding: 10px 20px 0 350px;
      flex-grow: 1;
      flex-basis: 0;
      box-sizing: border-box;
      background-color: #fff;
    }
    .chart {
      width: 100%;
      height: 100%;
    }
  }
  .rightbox {
    position: absolute;
    padding: 0.1rem;
    top: 322px;
    right: 0;
    background-color: #fff;
    width: 350px;
    z-index: 2;
    border-radius: 5px;
    box-sizing: border-box;
    transform: translate(0, -50%);
    transition: all 0.5s;
    -moz-box-shadow: 0px 0px 10px rgba(51,51,51,0.12); /* 老的 Firefox */
    box-shadow: 0px 0px 10px rgba(51,51,51,0.12);
    .carNumber {
      text-align: center;
      line-height: 60px;
      font-weight: 600;
      color: #409eff;
      font-size: 28px;
    }
    .box {
      margin-top: 10px;
      border: 1px solid #409eff;
      .top {
        background-color: #409eff;
        display: flex;
        justify-content: space-between;
        color: #fff;
        line-height: 40px;
        padding: 0 10px;
      }
      .el-carousel__container {
        height: 200px;
      }
      .img {
        width: 100%;
        height: 200px;
      }
    }
  }
}
</style>
