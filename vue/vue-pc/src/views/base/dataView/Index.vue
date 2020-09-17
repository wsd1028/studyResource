<template>
  <div class="container dataView" ref="container">
    <header>
      <p class="time">
        <span>{{ time }}</span>
      </p>
      <h2 class="title">宜宾市建筑工地扬尘治理中心</h2>
      <p class="weather">
        <span>{{ weather.wea }}</span>
        <span class="mr">{{ weather.tem2 }}°/{{ weather.tem1 }}°</span>
        <span class="mr">{{ weather.win }}</span>
        <el-tag class="mr" effect="dark" size="mini" type="warning">{{ weather.air_level }}</el-tag>
        <span class="mr">AQI: {{ weather.air }}</span>
        <span class="mr">湿度: {{ weather.humidity }}</span>
      </p>
    </header>
    <section>
      <div class="left-boxs">
        <div class="box fg2">
          <div class="mapTop">
            <p class="title">区县排名</p>
            <el-select @change="drawAreaRanking({ id: 'areaRankingChart' })" placeholder="请选择" size="mini" style="width: 120px" v-model="areaRankType">
              <el-option :value="0" label="pm10"></el-option>
              <el-option :value="1" label="GPS在线率"></el-option>
              <el-option :value="2" label="履职率"></el-option>
            </el-select>
          </div>
          <div class="box-item" id="areaRankingChart"></div>
        </div>
        <div class="box fg3">
          <p class="title">移动源统计</p>
          <div class="box-item" id="mobileSourceChart"></div>
        </div>
        <div class="box fg2">
          <p class="title">大数据资源统计</p>
          <div class="box-item" id="bigDataChart"></div>
        </div>
      </div>
      <div class="middle-boxs">
        <div class="box fg6">
          <div class="mapTop">
            <p class="title">电子地图</p>
            <el-select @change="changeArea" placeholder="请选择" size="mini" style="width: 120px" v-model="mapConfig.areaCode">
              <el-option :key="item.code" :label="item.name" :value="item.code" v-for="item in areaList"></el-option>
            </el-select>
          </div>
          <div class="box-item mapDiv">
            <div class="funcionCard">
              <div class="funcItem">
                <span class="text">在线</span>
                <el-checkbox v-model="functionBtn.online"></el-checkbox>
              </div>
              <div class="funcItem">
                <span class="text" style="color:#A6A5A5">离线</span>
                <el-checkbox v-model="functionBtn.outline"></el-checkbox>
              </div>
              <div style="width:100%;border: 0.5px solid #fff;margin-top:10px"></div>
              <div class="funcItem">
                <span class="text">
                  <i class="icon el-icon-caret-top" style="color:#fff;font-size:20px"></i>
                  公共区域
                </span>
                <el-switch
                  :width="37"
                  @change="changeMapvState('publicArea')"
                  active-color="#1C7AFE"
                  inactive-color="#E4E4E4"
                  v-model="functionBtn.publicArea"
                ></el-switch>
              </div>
              <div class="funcItem">
                <span class="text">
                  <i class="icon iconfont iconfont-yibinyangchenzhili-xiaonachangicon-10" style="color:#fff;font-size:16px"></i>
                  消纳场
                </span>
                <el-switch :width="37" active-color="#1C7AFE" inactive-color="#E4E4E4" v-model="functionBtn.garbage"></el-switch>
              </div>
              <div class="funcItem">
                <span class="text">
                  <i class="icon iconfont iconfont-dizhi" style="color:#fff;font-size:15px"></i>
                  <!--AQI-->
                  国控点
                </span>
                <el-switch :width="37" active-color="#1C7AFE" inactive-color="#E4E4E4" v-model="functionBtn.AQI"></el-switch>
              </div>
              <div class="funcItem">
                <span class="text">
                  <i class="icon iconfont iconfont-yuan" style="color:#fff;font-size:15px"></i>
                  固定源(设备)
                </span>
                <el-switch
                  :width="37"
                  @change="changeMapvState('project')"
                  active-color="#1C7AFE"
                  inactive-color="#E4E4E4"
                  v-model="functionBtn.project"
                ></el-switch>
              </div>
            </div>
            <baidu-map :center="mapConfig.center" :map-click="false" :scroll-wheel-zoom="true" :zoom="13" @ready="onBaiduMapReady" class="bm-view">
              <div v-if="functionBtn.garbage">
                <bm-marker
                  :icon="{
                    url: require('@/assets/images/svg/garbage_min.svg'),
                    size: { width: 50, height: 85 }
                  }"
                  :key="item.id"
                  :position="item.location"
                  :title="item.name"
                  :zIndex="10"
                  @click="garbageOpen($event, item)"
                  v-for="item in garbage.list"
                ></bm-marker>
                <bm-info-window :position="garbage.detail.location" :show="garbage.show" @close="mapMarkClose('garbage')" @open="garbageOpen" title>
                  <!--消纳站详细信息窗体-->
                  <p>消纳站名称：{{ garbage.detail.name }}</p>
                  <p>消纳站地址：{{ garbage.detail.address }}</p>
                </bm-info-window>
              </div>
              <div v-if="functionBtn.AQI">
                <!--国控点-->
                <bm-marker
                  :icon="{
                    url: require('@/assets/images/svg/AQI.svg'),
                    size: { width: 40, height: 40 }
                  }"
                  :key="item.id"
                  :position="item.location"
                  :title="item.station"
                  :zIndex="10"
                  @click="clickAQI($event, item)"
                  v-for="item in AQI.list"
                ></bm-marker>
                <bm-info-window :position="AQI.detail.location" :show="AQI.show" @close="mapMarkClose('AQI')" @open="openAQI" title>
                  <!--国控详细信息窗体-->
                  <p>国控点名称:{{ AQI.detail.station }}</p>
                  <p>时间:{{ AQI.detail.pubTime }}</p>
                  <p>pm10:{{ AQI.detail.pm10 }}ug/m³</p>
                  <p>pm25:{{ AQI.detail.pm25 }}ug/m³</p>
                </bm-info-window>
              </div>
            </baidu-map>
            <div class="exposure">
              <span class="exposureText">曝光台</span>
              <p class="exposureTitle" v-text="exposureList[exposureActive].title"></p>
              <span class="date" v-text="exposureList[exposureActive].createDate"></span>
            </div>
          </div>
        </div>
        <div class="box fg3">
          <div class="mapTop">
            <p class="title">设备信息</p>
            <el-select @change="changeDevice" placeholder="请选择设备" size="mini" style="width:200px" v-model="device.sn">
              <el-option :key="item.sn" :label="item.sn" :value="item.sn" v-for="item in device.list"></el-option>
            </el-select>
          </div>
          <div class="box-item" style="padding:10px;flex-direction: column">
            <div class="projectDevice">
              <div class="deviceMsgItem">
                <span class="label">固定源名称:</span>
                <span class="value">{{ fixedSource.detail.name }}</span>
              </div>
              <div class="deviceMsgItem" v-if="device.sn">
                <span class="label">设备厂商:</span>
                <span class="value">{{ device.detail.manufacturerName }}</span>
              </div>
              <div class="deviceMsgItem">
                <span class="label">固定源地址:</span>
                <span class="value">{{ fixedSource.detail.address }}</span>
              </div>
              <div class="deviceMsgItem" v-if="device.sn">
                <span class="label">设备IMEI:</span>
                <span class="value">{{ device.sn }}</span>
              </div>
              <div class="deviceMsgItem">
                <span class="label">固定源负责人:</span>
                <span class="value">{{ fixedSource.detail.manager || fixedSource.detail.peopleName }}</span>
              </div>
              <div class="deviceMsgItem" style="display:flex" v-if="device.sn">
                <p style="margin-right:30px">
                  <span class="label">PM25:</span>
                  <span class="value" style="color:#00FF78">{{ parseInt(device.detail.pm25) }}ug/m³</span>
                </p>
                <p>
                  <span class="label">PM10:</span>
                  <span class="value" style="color:#00FF78">{{ parseInt(device.detail.pm10) }}ug/m³</span>
                </p>
              </div>
              <div style="width:100%" v-if="device.sn">
                <el-tabs @tab-click="drawDust" size="mini" type="card" v-model="tabActive">
                  <el-tab-pane label="近12小时" name="12"></el-tab-pane>
                  <el-tab-pane label="近7天" name="7"></el-tab-pane>
                  <el-tab-pane label="近30天" name="30"></el-tab-pane>
                </el-tabs>
              </div>
            </div>
            <div id="dustChart" style="flex-grow:1"></div>
          </div>
        </div>
      </div>
      <div class="right-boxs">
        <div class="box fg2">
          <p class="title">目标任务</p>
          <div class="box-item">
            <div id="targetTaskChart1" style="width:33%;height:100%"></div>
            <div id="targetTaskChart2" style="width:33%;height:100%"></div>
            <div id="targetTaskChart3" style="width:33%;height:100%"></div>
          </div>
        </div>
        <div class="box fg3">
          <p class="title">热点追踪</p>
          <div class="box-item">
            <div class="hotspots">
              <div :key="index" class="hotspot" style="padding-right: 12px" v-for="(item, index) in hotspots">
                <div class="left">
                  <el-image :src="require('@/assets/images/dataView/dataView' + item.iconIndex + '.png')" fit="fill" style="width:41px; height:46px"></el-image>
                  <div style="margin:4px 0 0 10px">
                    <p style="font-weight:600">
                      {{ item.name }}
                      <span :class="'color' + item.iconIndex" style="font-size:16px">{{ item.totalCount }}</span>
                    </p>
                    <p style="font-size: 13px">
                      已完成:
                      <span style="margin-right: 18px">{{ item.hasFinishCount }}</span>
                      未完成:
                      <span>{{ item.notFinishCount }}</span>
                    </p>
                  </div>
                </div>
                <div class="right">
                  <span style="margin-right:6px;font-size:12px">完成率</span>
                  <el-progress :color="colorList[index]" :percentage="item.finishRate" :stroke-width="3" :width="40" type="circle"></el-progress>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="box fg2">
          <p class="title">自动巡检</p>
          <div class="box-item" id="automaticCheckChart"></div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import echarts from 'echarts'
import { styleJson } from '@/libs/mapStyle.js'
export default {
  name: 'dataView',
  data() {
    return {
      //固定源对象
      fixedSource: {
        type: {
          project: '347827211369086976',
          garbage: '347827770775994368',
          publicArea: '347828546676097024'
        },
        detail: {}
      },
      tabActive: '12', //0分钟平均1小时平均
      //天气信息
      weather: {},
      areaList: [],
      //mapv数据集
      DataSet: null,
      //mapv图层
      baiduMapLayer: null,
      mapConfig: {
        areaCode: '',
        zoom: 13,
        dragging: true,
        center: {}, //地图中心
        position: {}, //定位
        showMark: false
      },
      time: '',
      //电子地图功能按钮
      functionBtn: {
        online: true, //在线
        outline: true, //离线
        publicArea: true, //公共区域
        garbage: true, //消纳场
        AQI: true,
        project: true //固定源(设备)
      },
      //地图公共区域对象
      publicArea: {
        list: [],
        detail: {}, //选中的公共区域
        mapv: {
          dateSet: null,
          mapLayer: null
        }
      },
      //地图项目对象
      project: {
        list: [],
        detail: {}, //选中的公共区域
        mapv: {
          dateSet: null,
          mapLayer: null
        }
      },
      //地图消纳场对象
      garbage: {
        list: [],
        detail: {},
        show: false
      },
      //地图AQI对象
      AQI: {
        list: [],
        detail: {},
        show: false,
        location: {}
      },
      //设备对象
      device: {
        list: [],
        sn: '',
        detail: {}
      },
      exposureTimer: null,
      exposureList: [
        {
          title: '',
          createDate: ''
        }
      ],
      exposureActive: 0,
      colorList: ['#57fff9', '#c657ff', ' #f6f855', '#ff8d57'],
      hotspots: [], //热点追踪
      areaRankType: 2, //区县排名下拉框
      areaRankingChart: null, //区县排名
      mobileSourceChart: null, //移动源
      bigDataChart: null, //大数据统计
      targetTaskChart1: null, //目标任务1
      targetTaskChart2: null, //目标任务2
      targetTaskChart3: null, //目标任务3
      automaticCheckChart: null, //自动巡检
      dustChart: null //设备扬尘
    }
  },
  async mounted() {
    //全屏退出
    document.addEventListener('keyup', this.goBack)
    this.projectImg = await this.getImg('project2')
    this.publicAreaImg = await this.getImg('publicArea')
    this.mapConfig.areaCode = this.$store.state.user.userInfo.accountTypeDto.code
    await this.getArea()
    this.getExposure()
    this.$moment.locale('zh-cn')
    this.time = this.$moment().format('YYYY 年 MM 月 DD  dddd  HH:mm:ss')
    this.DateInter = setInterval(() => {
      this.time = this.$moment().format('YYYY 年 MM 月 DD  dddd  HH:mm:ss')
    }, 1000)
    this.allDraw()
    this.getWeather()
    this.getMonitorSite()
    window.addEventListener('resize', this.toResize)
  },
  methods: {
    toResize() {
      if (this.areaRankingChart) this.areaRankingChart.resize()
      if (this.mobileSourceChart) this.mobileSourceChart.resize()
      if (this.bigDataChart) this.bigDataChart.resize()
      if (this.targetTaskChart1) this.targetTaskChart1.resize()
      if (this.targetTaskChart2) this.targetTaskChart2.resize()
      if (this.targetTaskChart3) this.targetTaskChart3.resize()
      if (this.automaticCheckChart) this.automaticCheckChart.resize()
      if (this.dustChart) this.dustChart.resize()
    },
    goBack(e) {
      if (/^Escape$/i.test(e.code)) {
        this.$router.go(-1)
      }
    },
    //绘制所有chart
    async allDraw() {
      this.drawAreaRanking({ id: 'areaRankingChart' })
      this.drawMobileSource({ id: 'mobileSourceChart' })
      this.getHotspots() //热点追踪
      this.getBigData() //大数据统计
      this.getAutomaticCheckData() //自动巡检
      this.getTargetTask() //得到目标任务
      this.getMapData() //得到地图数据
    },
    //得到天气
    async getWeather() {
      let resp = await this.$http.get('https://tianqiapi.com/api?version=v6&appid=66527314&appsecret=79zfaynW')
      this.weather = resp
    },
    //获取公共区域
    async getPublicArea() {
      let resp = await this.$http.get(`/carp/business/a/q/public/area/page?areaCode=${this.mapConfig.areaCode}&limit=9999&page=1`)
      if (resp.code == 0) {
        this.publicArea.list = resp.data.records
        if (this.publicArea.dateSet) {
          this.publicArea.dateSet.set(this.fixMapvData(this.publicArea.list, 'publicAreaImg'))
        } else {
          this.drawPublicArea(this.publicArea.list)
        }
      } else {
        this.$message.error('获取公共区域失败' + resp.message)
      }
    },
    //组装mapv数据
    fixMapvData(list, img) {
      let data = []
      for (let i = 0; i < list.length; i++) {
        data.push({
          geometry: {
            type: 'Point',
            coordinates: [list[i].longitude, list[i].latitude]
          },
          icon: this[img],
          target: list[i]
        })
      }
      return data
    },
    //绘制公共区域
    async drawPublicArea(list) {
      this.publicArea.dateSet = new this.DataSet(this.fixMapvData(list, 'publicAreaImg'))
      let options = {
        draw: 'icon',
        methods: {
          // 一些事件回调函数
          click: async e => {
            // 点击事件，返回对应点击元素的对象值
            if (e && e.target) {
              this.fixedSource.detail = e.target
              this.getDeviceList(e.target.id, 'publicArea')
            }
          }
        }
      }
      this.publicArea.mapLayer = new this.baiduMapLayer(this.map, this.publicArea.dateSet, options)
    },
    //获取国控点
    async getMonitorSite() {
      let resp = await this.$http.get(`/carp/device/a/q/monitorSite/areaCode?areaCode=${this.mapConfig.areaCode}&limit=1000&page=1`)
      if (resp.code == 0) {
        for (let i = 0; i < resp.data.length; i++) {
          resp.data[i].location = { lat: resp.data[i].latitude, lng: resp.data[i].longitude }
        }
        this.AQI.list = resp.data
      } else {
        this.$message.error('获取国控点失败' + resp.message)
      }
    },
    async clickAQI(e, data) {
      this.AQI.detail = {}
      this.AQI.show = false
      let resp = await this.$http.get(`/carp/device/a/q/monitorSite/monitorSiteId?monitorSiteId=${data.id}`)
      if (resp.code == 0) {
        this.AQI.detail = resp.data
        this.AQI.detail.location = data.location
        this.AQI.detail.station = data.station
        this.AQI.show = true
      } else {
        this.$message.error('获取国控数据失败' + resp.message)
      }
    },
    openAQI() {
      this.AQI.show = true
      this.$forceUpdate()
    },
    //得到地图数据
    async getMapData() {
      this.getGarbage()
    },
    //关闭地图mark
    mapMarkClose(name) {
      this[name].show = false
    },
    //打开消纳站
    async garbageOpen(e, data) {
      if (data) {
        this.fixedSource.detail = data.detail || {}
        this.garbage.detail = data.detail || {}
        this.garbage.detail.location = data.location
        await this.getDeviceList(this.garbage.detail.id, 'garbage')
      }
      this.garbage.show = true
    },
    //得到消纳站数据
    async getGarbage() {
      let resp = await this.$http.get(`/carp/business/a/q/garbage/station/page?areaCode=${this.mapConfig.areaCode}&limit=1000&page=1`)
      if (resp.code == 0) {
        let garbageList = []
        for (let i = 0; i < resp.data.records.length; i++) {
          garbageList.push({
            location: {
              lat: resp.data.records[i].latitude,
              lng: resp.data.records[i].longitude
            },
            id: resp.data.records[i].id,
            name: resp.data.records[i].name,
            detail: resp.data.records[i]
          })
        }
        this.garbage.list = garbageList
      } else {
        this.$message.error('获取消纳站失败' + resp.message)
      }
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
    //点击地图功能栏
    changeMapvState(type) {
      if (this.functionBtn[type]) {
        if (this[type].dateSet) {
          this[type].dateSet.set(this.fixMapvData(this[type].list, type + 'Img'))
        } else {
          if (type == 'project') {
            this.drawProject(this[type].list)
          }
          if (type == 'project') {
            this.drawPublicArea(this[type].list)
          }
        }
      } else {
        if (this[type].dateSet) this[type].dateSet.set([])
      }
    },
    //得到固定源(设备)数据
    async getProjectData() {
      let resp = await this.$http.get(
        `/carp/device/a/q/deviceProject/hasDustFixedSource?areaCode=${this.mapConfig.areaCode}&deviceType=202&fixedSourceType=${this.fixedSource.type.project}`
      )
      if (resp.code == 0) {
        this.project.list = resp.data
        if (resp.data && resp.data.length > 0) {
          this.fixedSource.detail = this.project.list[0]
          this.getDeviceList(this.fixedSource.detail.id, 'project')
          if (this.project.dateSet) {
            this.project.dateSet.set(this.fixMapvData(this.project.list, 'projectImg'))
          } else {
            this.drawProject(this.project.list)
          }
        }
      } else {
        this.$message.error('获取项目数据失败' + resp.message)
      }
    },
    //绘制项目
    async drawProject(list) {
      this.project.dateSet = new this.DataSet(this.fixMapvData(list, 'projectImg'))
      let options = {
        draw: 'icon',
        methods: {
          // 一些事件回调函数
          click: async e => {
            // 点击事件，返回对应点击元素的对象值
            if (e && e.target) {
              this.fixedSource.detail = e.target
              this.getDeviceList(e.target.id, 'project')
            }
          }
        }
      }
      this.project.mapLayer = new this.baiduMapLayer(this.map, this.project.dateSet, options)
    },
    //得到设备列表
    async getDeviceList(id, type) {
      this.device.list = []
      this.device.sn = ''
      let resp = await this.$http(`/carp/device/a/q/dust/info/byFixedSource?fixedSourceId=${id}&fixedSourceType=${this.fixedSource.type[type]}`)
      if (resp.code == 0) {
        if (resp.data.length == 0) {
          this.$message.error('该项目暂无设备')
        } else {
          this.device.list = resp.data
          this.device.sn = resp.data[0].sn
        }
      } else {
        this.$message.error('获取设备列表失败' + resp.message)
      }
      this.changeDevice()
    },
    //改变选中的设备
    async changeDevice() {
      this.drawDust()
      let resp = await this.$http.get('/carp/device/a/q/dust/avg/real/time/' + this.device.sn)
      if (resp.code == 0) {
        this.device.detail = resp.data
      } else {
        this.$message.error('获取扬设备信息失败' + resp.message)
      }
    },
    //绘制扬尘设备信息
    async drawDust() {
      let pm10 = [],
        time = [],
        pm10Monitor = [],
        dateStr = 'time',
        resp = {}
      if (this.tabActive == 12) {
        resp = await this.$http.get('/carp/device/a/q/dust/avg/time', {
          params: {
            sn: this.device.sn,
            startTime: this.$moment()
              .subtract(12, 'hours')
              .format('YYYY-MM-DD HH:mm:ss'),
            endTime: this.$moment().format('YYYY-MM-DD HH:mm:ss')
          }
        })
      } else {
        dateStr = 'date'
        resp = await this.$http.get('/carp/device/a/q/dust/data/avg/chart/day', {
          params: {
            sn: this.device.sn,
            startDate: this.$moment()
              .subtract(parseInt(this.tabActive), 'days')
              .format('YYYY-MM-DD HH:mm:ss'),
            endDate: this.$moment().format('YYYY-MM-DD HH:mm:ss')
          }
        })
      }
      if (resp.code == 0) {
        for (let i = 0; i < resp.data[dateStr].length; i++) {
          if (this.tabActive == 12) {
            resp.data[dateStr][i] = this.$moment(resp.data[dateStr][i]).format('HH:mm')
          } else {
            resp.data[dateStr][i] = this.$moment(resp.data[dateStr][i]).format('MM-DD')
          }
          resp.data.pm10Monitor[i] = parseInt(resp.data.pm10Monitor[i])
          resp.data.pm25[i] = parseInt(resp.data.pm25[i])
          resp.data.pm10[i] = parseInt(resp.data.pm10[i])
        }
        time = resp.data[dateStr]
        pm10 = resp.data.pm10
        pm10Monitor = resp.data.pm10Monitor
      } else {
        this.$message.error('获取设备数据失败' + resp.message)
      }
      this.dustChart = echarts.init(document.getElementById('dustChart'))
      let option = {
        title: {
          text: '扬尘实时数据动态折线图',
          textStyle: {
            fontSize: '16',
            fontFamily: 'Source Han Sans CN',
            fontWeight: 'bold',
            color: 'rgba(54, 125, 255, 1)'
          },
          y: 'bottom',
          left: 'center'
        },
        color: ['#FC863F', '#5D9CEC'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
        legend: {
          bottom: 0,
          right: 20,
          data: ['PM10国控', 'PM10'],
          itemWidth: 23,
          itemHeight: 13,
          itemGap: 10,
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: time.length > 0 ? 10 : 25,
          right: 20,
          bottom: 30,
          top: 40,
          containLabel: true
        },
        xAxis: [
          {
            splitLine: {
              show: false
            }, //去除网格线
            type: 'category',
            data: time,
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#fff'
              }
            }
          }
        ],
        yAxis: [
          {
            name: '单位：ug/m³',
            nameLocation: 'start',
            nameGap: 20,
            splitLine: {
              show: false
            }, //去除网格线
            type: 'value',
            nameTextStyle: {
              color: '#fff',
              padding: [0, 0, 0, 20]
            },
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: '#fff'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#fff'
              }
            }
          }
        ],
        series: [
          {
            name: 'PM10国控',
            type: 'line',
            data: pm10Monitor,
            lineStyle: {
              normal: {
                color: '#FC863F',
                width: 2,
                opacity: '1'
              }
            }
          },
          {
            name: 'PM10',
            type: 'line',
            data: pm10,
            lineStyle: {
              normal: {
                color: '#5D9CEC',
                width: 2,
                opacity: '1'
              }
            }
          }
        ]
      }
      this.dustChart.setOption(option, true)
    },
    //得到区域
    changeArea() {
      let areaLocation = [
        {
          name: '宜宾市',
          areaCode: 5115,
          areaId: 511500000000,
          location: { lat: 28.77, lng: 104.62 }
        },
        {
          name: '翠屏区',
          areaCode: 511502,
          areaId: 511502000000,
          location: { lat: 28.760179, lng: 104.630231 }
        },
        {
          name: '南溪区',
          areaCode: 511503,
          areaId: 511503000000,
          location: { lat: 28.839806, lng: 104.981133 }
        },
        {
          name: '叙州区',
          areaCode: 511504,
          areaId: 511504000000,
          location: { lat: 28.695678, lng: 104.541489 }
        },
        {
          name: '江安县',
          areaCode: 511523,
          areaId: 511523000000,
          location: { lat: 28.728102, lng: 105.068697 }
        },
        {
          name: '长宁县',
          areaCode: 511524,
          areaId: 511524000000,
          location: { lat: 28.577271, lng: 104.921116 }
        },
        {
          name: '高县',
          areaCode: 511525,
          areaId: 511525000000,
          location: { lat: 28.435676, lng: 104.519187 }
        },
        {
          name: '珙县',
          areaCode: 511526,
          areaId: 511526000000,
          location: { lat: 28.449041, lng: 104.712268 }
        },
        {
          name: '筠连县',
          areaCode: 511527,
          areaId: 511527000000,
          location: { lat: 28.162017, lng: 104.507848 }
        },
        {
          name: '兴文县',
          areaCode: 511528,
          areaId: 511528000000,
          location: { lat: 28.302988, lng: 105.236549 }
        },
        {
          name: '屏山县',
          areaCode: 511529,
          areaId: 511529000000,
          location: { lat: 28.64237, lng: 104.162617 }
        }
      ]
      for (let i = 0; i < areaLocation.length; i++) {
        if (areaLocation[i].areaCode == this.mapConfig.areaCode) {
          this.mapConfig.center = areaLocation[i].location
          this.mapConfig.position = areaLocation[i].location
        }
      }
      this.getProjectData()
      this.getPublicArea()
      this.getMonitorSite()
    },
    //得到地区列表
    async getArea() {
      let code = this.$store.state.user.userInfo.accountTypeDto.code
      let resp = await this.$http.get('/carp/business/a/q/area/leading/level/page/3?parentId=290871061266829312')
      if (resp.code == 0) {
        resp.data = resp.data.filter(item => {
          return item.code.includes(code)
        })
        let areaList = resp.data
        if (code == 5115) {
          areaList.unshift({
            id: this.$store.state.config.yibinAreaId,
            code: '5115',
            name: '宜宾市'
          })
        }
        for (let i = 0; i < areaList.length; i++) {
          this.areaList.push({ name: areaList[i].name, code: areaList[i].code, id: areaList[i].id })
        }
      } else {
        this.$message.error('获取地区失败' + resp.message)
      }
    },
    //得到曝光台数据
    async getExposure() {
      let resp = await this.$http.get('/carp/business/a/q/manage/center/getExposure', {
        params: {
          limit: 100,
          page: 1,
          showType: 1
        }
      })
      if (resp.code == 0) {
        if (resp.data.records.length == 0) return
        for (let i = 0; i < resp.data.records.length; i++) {
          resp.data.records[i].createDate = this.$moment(resp.data.records[i].createDate).format('YYYY-MM-DD')
        }
        this.exposureList = resp.data.records
        this.exposureTimer = setInterval(() => {
          this.exposureActive++
          if (this.exposureActive > this.exposureList.length - 1) {
            this.exposureActive = 0
          }
        }, 1000 * 5)
      }
    },
    //地图初始化时,定位当前位置
    onBaiduMapReady(e) {
      this.BMap = e.BMap
      this.map = e.map
      if (this.BMap) {
        const { DataSet, baiduMapLayer } = require('mapv')
        this.DataSet = DataSet
        this.baiduMapLayer = baiduMapLayer
        this.getProjectData() //得到项目数据
        this.getPublicArea() //得到公共区域数据
        e.map.setMapStyle({ styleJson: styleJson })
        this.mapConfig.center = { lat: 28.77, lng: 104.62 }
        this.mapConfig.position = { lat: 28.77, lng: 104.62 }
      }
    },
    //得到热点追踪数据
    async getHotspots() {
      let resp = await this.$http.get('/carp/business/a/q/manage/center/hotspot')
      if (resp.code == 0) {
        let hotspots = []
        for (let i = 0; i < resp.data.length; i++) {
          resp.data[i].finishRate = parseInt(resp.data[i].finishRate)
          resp.data[i].iconIndex = (i % 4) + 1
          hotspots.push(resp.data[i])
        }
        this.hotspots = hotspots
      } else {
        this.$message.error('获取热点追踪失败' + resp.message)
      }
    },
    // 绘制区县排名
    async drawAreaRanking(data) {
      let title = 'PM10',
        color = '#F97D2C',
        url = ''
      if (this.areaRankType == 1) {
        title = 'GPS在线率'
        color = '#21DF44'
      }
      if (this.areaRankType == 2) {
        title = '履职率'
        color = '#28A2FE'
        url = '/carp/business/a/q/big/screen/today/rate'
      }
      let { id } = data
      let xData = [],
        yData = [],
        resp = {}

      resp = await this.$http.get(url)
      if (resp.code == 0) {
        xData = resp.data.name
        for (let i = 0; i < resp.data.percent.length; i++) {
          resp.data.percent[i] = resp.data.percent[i] * 100
        }
        yData = resp.data.percent
      } else {
        this.$message.error('获取' + title + '失败' + resp.message)
      }
      this[id] = echarts.init(document.getElementById(id))
      let option = {
        grid: {
          top: 20,
          left: 0,
          right: 10,
          bottom: 10,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
        },
        legend: {
          //图例组件，颜色和名字
          left: 'center',
          top: '2%',
          itemGap: 16,
          itemWidth: 18,
          itemHeight: 6,
          data: [
            {
              name: title
            }
          ],
          textStyle: {
            color: '#fff',
            fontStyle: 'normal',
            fontFamily: '微软雅黑',
            fontSize: 12
          }
        },
        xAxis: [
          {
            type: 'category',
            data: xData,
            axisLabel: {
              rotate: -70,
              textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontFamily: '微软雅黑',
                fontSize: 12
              }
            },
            axisTick: {
              //坐标轴刻度相关设置。
              show: false
            },
            axisLine: {
              //坐标轴轴线相关设置
              lineStyle: {
                color: '#fff',
                opacity: 0.2
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            min: 0,
            max: 100,
            type: 'value',
            splitNumber: 10,
            axisLabel: {
              textStyle: {
                color: '#fff',
                fontStyle: 'normal',
                fontFamily: 'Source Han Sans CN;',
                fontSize: 12
              },
              formatter: '{value}%'
            },
            axisLine: {
              lineStyle: {
                color: '#fff',
                opacity: 0.2
              }
            },
            axisTick: {
              lineStyle: {
                color: '#fff',
                opacity: 0.2
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: title,
            type: 'bar',
            data: yData,
            barWidth: 6,
            itemStyle: {
              normal: {
                show: true,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: color
                  }
                ]),
                barBorderRadius: 50,
                borderWidth: 0
              }
            }
          }
        ]
      }
      this[id].setOption(option, true)
    },
    //绘制移动源统计
    drawMobileSource(data) {
      let { id, xData } = data
      xData = ['03-20', '03-21', '03-22', '03-23']
      this[id] = echarts.init(document.getElementById(id))
      let option = {
        legend: {
          icon: 'circle',
          top: '2%',
          right: '5%',
          itemWidth: 6,
          itemGap: 20,
          textStyle: {
            color: '#fff'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          top: 50,
          left: 10,
          right: 20,
          bottom: 10,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xData,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#fff'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: 'rgba(255,255,255,.3)'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#fff'
              }
            }
          }
        ],
        series: [
          {
            name: '总车辆GPS数量',
            type: 'line',
            data: [10, 10, 20, 12],
            symbolSize: 1,
            symbol: 'circle',
            smooth: true,
            label: {
              show: true,
              position: 'top',
              distance: 4,
              backgroundColor: '#fff',
              borderRadius: 10,
              padding: [1, 8],
              color: '#202B33',
              fontSize: 12
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(255,255,255,1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(255,255,255,0)'
                    }
                  ],
                  false
                )
              }
            },
            itemStyle: {
              normal: {
                color: '#fff',
                borderColor: '#fff'
              }
            }
          },
          {
            name: '在线车辆GPS数量',
            type: 'line',
            data: [5, 12, 11, 14],
            symbolSize: 1,
            symbol: 'circle',
            smooth: true,
            label: {
              show: true,
              position: 'top',
              distance: 4,
              backgroundColor: 'rgba(39, 201, 198, 1)',
              borderRadius: 10,
              padding: [1, 8],
              color: '#fff',
              fontSize: 12
            },
            areaStyle: {
              //区域填充样式
              normal: {
                //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(39, 201, 198, 1)'
                    },
                    {
                      offset: 1,
                      color: 'rgba(39, 201, 198, 0)'
                    }
                  ],
                  false
                )
              }
            },
            itemStyle: {
              normal: {
                color: '#27C9C6',
                borderColor: '#27C9C6'
              }
            }
          }
        ]
      }
      this[id].setOption(option, true)
    },
    //得到大数据统计数据
    async getBigData() {
      let resp = await this.$http.get('/carp/business/a/q/manage/center/bigDataResource')
      let yData = [],
        maxData = [],
        xData = []
      if (resp.code == 0) {
        for (const key in resp.data) {
          yData.push(key)
          xData.push(resp.data[key])
          let value = resp.data[key] + ''
          maxData.push(10 ** value.length)
        }
        let max = Math.max.apply(null, maxData)
        for (let i = 0; i < maxData.length; i++) {
          maxData[i] = max
        }
      }
      this.drawBigData({ id: 'bigDataChart', yData, maxData, xData })
    },
    //绘制大数据统计
    drawBigData(data) {
      let { id, yData, maxData, xData } = data
      this[id] = echarts.init(document.getElementById(id))
      let option = {
        grid: {
          left: '5%',
          right: '5%',
          bottom: 10,
          top: 5,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          },
          formatter: function(item) {
            return item[0].name + ':' + item[0].value
          }
        },
        xAxis: [
          {
            show: false,
            type: 'value'
          }
        ],
        yAxis: [
          {
            type: 'category',
            inverse: true,
            axisLabel: {
              show: true,
              textStyle: {
                color: '#fff'
              }
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            data: yData
          },
          {
            type: 'category',
            inverse: true,
            axisTick: 'none',
            axisLine: 'none',
            show: true,
            axisLabel: {
              textStyle: {
                color: '#ffffff',
                fontSize: '12'
              }
            },
            data: xData
          }
        ],
        series: [
          {
            name: '大数据',
            type: 'bar',
            zlevel: 1,
            itemStyle: {
              normal: {
                barBorderRadius: 10,
                color: '#1BE6EB'
              }
            },
            barWidth: 10,
            data: xData
          },
          {
            name: '',
            type: 'bar',
            barWidth: 10,
            barGap: '-100%',
            data: maxData,
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 1,
                color: 'transparent',
                barBorderRadius: 10
              }
            }
          }
        ]
      }
      this[id].setOption(option, true)
    },
    //得到目标任务
    async getTargetTask() {
      let resp = await this.$http.get(`/carp/device/a/q/air/quality/target/mission?year=${this.$moment().format('YYYY')}`)
      if (resp.code == 0) {
        this.drawTargetTask({ id: 'targetTaskChart1', max: resp.data.yearTarget, color: '#1EC641', title: '优良天数', value: resp.data.goodDayCount })
        this.drawTargetTask({ id: 'targetTaskChart2', max: resp.data.pm25Target, color: '#F6B041', title: 'PM2.5', value: resp.data.pm25 })
        this.drawTargetTask({ id: 'targetTaskChart3', max: resp.data.pm10Target, color: '#F47D2C', title: 'PM10', value: resp.data.pm10 })
      } else {
        this.$message.error('获取目标任务失败' + resp.message)
      }
    },
    //绘制目标任务
    drawTargetTask(data) {
      let { id, color, title, value, max } = data
      this[id] = echarts.init(document.getElementById(id))
      function _pie3() {
        let dataArr = []
        for (var i = 0; i < 6; i++) {
          if (i % 2 === 0) {
            dataArr.push({
              value: 30,
              itemStyle: {
                normal: {
                  borderWidth: 2,
                  borderColor: 'rgba(0,0,0,0)'
                }
              }
            })
          } else {
            dataArr.push({
              value: 2,
              itemStyle: {
                normal: {
                  color: 'rgba(88,142,197,0)',
                  borderWidth: 2,
                  borderColor: 'rgba(0,0,0,0)'
                }
              }
            })
          }
        }
        return dataArr
      }
      function pieData() {
        let dataArr = []
        let rate = value / max
        let length = (2 * value) / rate
        for (var i = 0; i < length; i++) {
          if (i <= 2 * value) {
            dataArr.push({
              value: 10,
              itemStyle: {
                normal: {
                  color: i % 2 === 0 ? 'rgba(0,0,0,0)' : color,
                  borderColor: 'rgba(0,0,0,0)'
                }
              }
            })
          } else {
            dataArr.push({
              name: (i + 1).toString(),
              value: 10,
              itemStyle: {
                normal: {
                  color: 'rgba(0,0,0,0)',
                  borderColor: 'rgba(0,0,0,0)'
                }
              }
            })
          }
        }
        return dataArr
      }
      let option = {
        title: [
          {
            text: value + '\n',
            subtext: '\n' + '\n' + '{a|' + title + '}' + '\n' + '\n' + '\n' + '{b|年度目标:' + max + '}',
            subtextStyle: {
              rich: {
                a: {
                  color: color,
                  fontSize: 16,
                  fontWeight: 'bold'
                },
                b: {
                  color: '#C4D9FF',
                  fontSize: 14
                  // fontWeight: 'bold'
                }
              }
            },
            x: '45%',
            y: '30%',
            textAlign: 'center',
            textStyle: {
              color: '#fff',
              fontSize: 20
            }
          }
        ],
        tooltip: {
          show: false
        },
        series: [
          {
            //最外面
            type: 'pie',
            zlevel: 2,
            silent: true,
            radius: ['80%', '82%'],
            center: ['50%', '35%'],
            startAngle: 90,
            hoverAnimation: false,
            color: '#273065',
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: _pie3()
          },
          {
            //第二层
            type: 'pie',
            silent: true,
            zlevel: 5,
            hoverAnimation: false,
            radius: ['65%', '67%'],
            center: ['50%', '35%'],
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [
              {
                value: 1,
                itemStyle: {
                  normal: {
                    borderWidth: 1,
                    borderColor: color
                  }
                }
              }
            ]
          },
          {
            //第三层
            type: 'pie',
            silent: true,
            zlevel: 4,
            radius: ['45%', '47%'],
            center: ['50%', '35%'],
            color: '#273065',
            labelLine: {
              normal: {
                show: false
              }
            },
            data: [1]
          },
          {
            type: 'pie',
            zlevel: 3,
            silent: true,
            radius: ['40%', '60%'],
            center: ['50%', '35%'],
            label: {
              normal: {
                show: false
              }
            },
            labelLine: {
              normal: {
                show: false
              }
            },
            data: pieData()
          }
        ]
      }
      this[id].setOption(option, true)
    },
    //得到自动巡检数据
    async getAutomaticCheckData() {
      let resp = await this.$http.get('/carp/business/a/q/manage/center/autoCheck')
      let xData = [],
        video = [],
        todeyCheck = []
      if (resp.code == 0) {
        for (let i = 0; i < resp.data.date.length; i++) {
          resp.data.date[i] = this.$moment(resp.data.date[i]).format('MM-DD')
        }
        xData = resp.data.date
        video = resp.data.videos
        todeyCheck = resp.data.todays
      }
      this.drawAutomaticCheck({ id: 'automaticCheckChart', xData, video, todeyCheck })
    },
    //绘制自动巡检
    drawAutomaticCheck(data) {
      let { id, xData, video, todeyCheck } = data
      this[id] = echarts.init(document.getElementById(id))
      let option = {
        title: {
          subtext: '单位:次',
          right: '20',
          top: '0',
          subtextStyle: {
            color: '#fff',
            fontSize: '14'
          }
        },
        legend: {
          icon: 'circle',
          top: '5%',
          left: '10%',
          itemWidth: 6,
          itemGap: 20,
          textStyle: {
            color: '#fff',
            fontSize: '14'
          }
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            textStyle: {
              color: '#fff'
            }
          }
        },
        grid: {
          top: 40,
          left: 10,
          right: 20,
          bottom: 10,
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: xData,
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#4595CE'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: '#4595CE'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#4595CE'
              }
            }
          }
        ],
        series: [
          {
            name: '今日巡检',
            type: 'line',
            data: todeyCheck,
            symbolSize: 1,
            symbol: 'circle',
            label: {
              show: true,
              position: 'top',
              distance: 4,
              color: '#66E583',
              fontSize: 12
            },
            itemStyle: {
              normal: {
                color: '#66E583',
                borderColor: '#66E583'
              }
            }
          },
          {
            name: '视频巡检',
            type: 'line',
            data: video,
            symbolSize: 1,
            symbol: 'circle',
            label: {
              show: true,
              position: 'top',
              distance: 4,
              color: '#F6B041',
              fontSize: 12
            },
            itemStyle: {
              normal: {
                color: '#F6B041',
                borderColor: '#F6B041'
              }
            }
          }
        ]
      }
      this[id].setOption(option, true)
    }
  },
  beforeDestroy() {
    clearInterval(this.exposureTimer)
    clearInterval(this.DateInter)
    window.removeEventListener('resize', this.toResize)
    document.removeEventListener('keyup', this.goBack)
  }
}
</script>

<style lang="less">
@import './style/index.less';
@import '~@/assets/less/common';
.dataView {
  * {
    box-sizing: border-box;
  }
  .el-tabs__item {
    padding: 0 10px;
    height: 30px;
    line-height: 30px;
    color: #fff;
  }
  .el-tabs__item.is-active {
    color: #409eff;
  }
  box-sizing: border-box;
  height: 100%;
  display: flex;
  background: url('../../../assets/images/dataView/bigScreen-bg.jpg') no-repeat;
  background-size: cover;
  flex-direction: column;
  padding: 10px 0 20px;
  .el-progress--circle .el-progress__text,
  .el-progress--dashboard .el-progress__text {
    color: #fff;
  }
  .anchorBL {
    display: none;
  }
  .bm-view {
    height: 100%;
    width: 100%;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;
    overflow: hidden;
  }
  .color1 {
    color: #57fff9;
  }
  .color2 {
    color: #c657ff;
  }
  .color3 {
    color: #f6f855;
  }
  .color4 {
    color: #ff8d57;
  }
  p,
  h2,
  header {
    margin: 0;
    padding: 0;
  }
  .fg2 {
    flex-grow: 3;
  }
  .fg3 {
    flex-grow: 4;
  }
  .fg6 {
    flex-grow: 6;
  }
  .mr {
    margin-right: 10px;
  }
  header {
    height: 100px;
    flex-shrink: 0;
    line-height: 100px;
    display: flex;
    width: 100%;
    .title {
      text-align: center;
      color: #fff;
      width: 53%;
      font-family: FZZhengHeiS-DB-GB;
      font-size: 35px;
      text-shadow: 0 0 10px rgba(255, 255, 255, 0.6);
    }
    .time,
    .weather {
      width: 23.5%;
      text-align: right;
      color: #fff;
      font-size: 16px;
    }
    .weather {
      text-align: left;
    }
  }
  .el-progress-circle__track {
    stroke: #071238;
  }
  .el-input--mini .el-input__inner {
    background-color: transparent;
    border: 1px solid transparent;
    color: #367dff;
  }
  .el-input--mini input.el-input__inner::-webkit-input-placeholder {
    color: #367dff;
  }
  .el-input--mini input.el-input__inner::-moz-input-placeholder {
    color: #367dff;
  }
  .el-input--mini input.el-input__inner::-ms-input-placeholder {
    color: #367dff;
  }
  .el-select .el-input .el-select__caret {
    color: #367dff;
  }
  section {
    display: flex;
    flex-grow: 1;
    .mapTop {
      display: flex;
      align-items: center;
    }
    .left-boxs,
    .right-boxs {
      margin: 0 10px;
      height: 100%;
      display: flex;
      flex-grow: 5;
      flex-basis: 0;
      flex-direction: column;
      flex-wrap: wrap;
    }
    .middle-boxs {
      margin: 0 10px;
      height: 100%;
      display: flex;
      flex-grow: 14;
      flex-basis: 0;
      flex-direction: column;
      flex-wrap: wrap;
      .mapDiv {
        border-radius: 10px;
        overflow: hidden;
        padding: 10px 10px 40px;
        display: block !important;
        position: relative;
      }
      .funcionCard {
        position: absolute;
        left: 30px;
        top: 30px;
        border-radius: 8px;
        padding: 8px;
        padding-top: 0;
        padding-bottom: 20px;
        width: 170px;
        background: rgba(17, 21, 35, 1);
        z-index: 10;
        .funcItem {
          display: flex;
          align-items: center;
          justify-content: space-between;
          vertical-align: bottom;
          margin-top: 10px;
          font-size: 12px;
          font-family: Microsoft YaHei;
          font-weight: 400;
          .el-checkbox__label {
            font-size: 12px;
            font-family: Microsoft YaHei;
            font-weight: 400;
          }
          .text {
            color: #fff;
          }
        }
      }
      .exposure {
        display: flex;
        align-items: center;
        height: 30px;
        padding: 0 10px;
        padding-right: 40px;
        width: 100%;
        background: rgb(17, 21, 35);
        opacity: 0.75;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        line-height: 30px;
        .exposureText {
          font-style: italic;
          color: #3d87f0;
          font-weight: 800;
          padding-right: 10px;
          font-size: 18px;
        }
        .exposureTitle {
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
          flex-grow: 1;
        }
        .date {
          font-size: 12px;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: rgba(255, 255, 255, 1);
        }
      }
    }
    .box {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      flex-direction: column;
      flex-basis: 0;
      .title {
        font-family: Source Han Sans CN;
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        flex-grow: 0;
        font-size: 20px;
        line-height: 40px;
        // flex-basis: 0;
      }
      .box-item {
        display: flex;
        flex-grow: 1;
        flex-basis: 0;
        border: 1px solid rgba(5, 14, 50, 0.86);
        box-shadow: 0px 0px 4px rgba(73, 136, 188, 0.57) inset;
        border-radius: 10px;
        background: rgba(134, 199, 254, 0.2);
        .projectDevice {
          color: #fff;
          width: 100%;
          font-size: 16px;
          font-family: Source Han Sans CN;
          font-weight: 400;
          line-height: 28px;
          letter-spacing: 3px;
          display: flex;
          flex-wrap: wrap;
          .deviceMsgItem {
            width: 50%;
            flex-shrink: 0;
            .value {
              font-size: 14px;
              color: rgba(54, 125, 255, 1);
            }
          }
        }
        .hotspots {
          padding: 20px;
          padding-top: 10px;
          width: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          overflow: auto;
          .hotspot {
            flex-shrink: 0;
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            background: rgba(13, 34, 83, 1);
            border-radius: 4px;
            box-shadow: 0px 2px 17px 0px rgba(21, 34, 54, 0.44);
            .left {
              display: flex;
              color: #fff;
              font-size: 14px;
            }
            .right {
              display: flex;
              align-items: center;
              color: #fff;
            }
          }
        }
      }
    }
  }
}
</style>
