<template>
  <div class="DustNowData">
    <myTitle titleName="扬尘实时数据"></myTitle>
    <!--<baidu-map :center="mapConfig.center" :map-click="false" :scroll-wheel-zoom="true" :zoom="mapConfig.zoom" @ready="onBaiduMapReady" class="map"></baidu-map>-->
    <section>
      <div class="top">
        <span class="title red" style="margin-right:10px">实时数据</span>
        <span class="title3 gray" v-text="mainData.monitoringTime"></span>
      </div>
      <div class="top2 bt bb">
        <div class="box">
          <p>
            <span class="title2 grey">PM2.5</span>
            <span class="title3 grey">/国控</span>
          </p>
          <p>
            <span class="title green" v-text="mainData.pm25"></span>
            <span class="title2 grey">/</span>
            <span class="title3 red" v-text="monitorData.pm25"></span>
            <span class="title3 grey0">ug/m³</span>
          </p>
        </div>
        <div class="box br bl">
          <span class="title2 grey">PM10 /国控</span>
          <p>
            <span class="title green" v-text="mainData.pm10"></span>
            <span class="title2 grey">/</span>
            <span class="title3 red" v-text="monitorData.pm10"></span>
            <span class="title3 grey0">ug/m³</span>
          </p>
        </div>
        <div class="box">
          <span class="title2 grey">噪音/国控</span>
          <p>
            <span class="title green" v-text="mainData.voice"></span>
            <span class="title2 grey">/</span>
            <span class="title3 red">{{ voice }}</span>
            <span class="title3 grey0">db</span>
          </p>
        </div>
      </div>
      <div class="top3 bb">
        <div class="box br">
          <span class="title2 grey">温度</span>
          <span class="title blue" style="margin-left:10px" v-text="mainData.temperature"></span>
          <span class="title3 grey0">℃</span>
        </div>
        <div class="box">
          <span class="title2 grey">湿度</span>
          <span class="title blue" style="margin-left:10px" v-text="mainData.humidity"></span>
          <span class="title3 grey0">%RH</span>
        </div>
      </div>
      <div class="top3 bb">
        <div class="box br">
          <span class="title2 grey">风速</span>
          <span class="title yellow" style="margin-left:10px" v-text="mainData.windSpeed"></span>
          <span class="title3 grey0">m/s</span>
        </div>
        <div class="box">
          <span class="title2 grey">风向</span>
          <span class="title yellow" style="margin-left:10px" v-text="mainData.windDirection"></span>
        </div>
      </div>
      <van-tabs @change="changeTab" color="#4683f1" v-model="active">
        <van-tab title="扬尘">
          <div class="chart" id="dustChart"></div>
        </van-tab>
        <van-tab title="噪声">
          <div class="chart" id="voiceChart"></div>
        </van-tab>
      </van-tabs>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 0,
      paramsData: {},
      mainData: {},
      voice: 0,
      monitorData: {},
      mapConfig: {
        center: {},
        zoom: 15
      }
    }
  },
  mounted() {
    let time = this.$moment().format('H')
    if (time >= 22 || time <= 6) {
      this.voice = 55
    } else {
      this.voice = 70
    }
    this.paramsData = this.$route.params
    this.getMainData()
    this.getMonitorData()
    this.changeTab()
  },
  components: {},
  methods: {
    onBaiduMapReady(e) {
      const that = this
      this.BMap = e.BMap
      if (this.BMap) {
        var myCity = new BMap.LocalCity()
        myCity.get(async res => {
          this.mapConfig.center = res.center
        })
      }
    },
    //获取扬尘实时数据失败
    async getMainData() {
      let resp = await this.$http.get('/carp/device/a/q/dust/avg/real/time/' + this.paramsData.sn)
      if (resp.code == 0) {
        this.mainData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取扬尘实时数据失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //获取国控值数据
    async getMonitorData() {
      let resp = await this.$http.get('/carp/device/a/q/dust/info/monitorData/' + this.paramsData.deviceId)
      if (resp.code == 0) {
        this.monitorData = resp.data
      } else {
        this.$dialog.alert({
          message: '获取国控数据失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
    },
    //绘制扬尘
    async drawDust() {
      let resp = await this.$http.get('/carp/device/a/q/dust/avg/real/pm', {
        params: {
          sn: this.paramsData.sn,
          size: 20
        }
      })
      let time = [],
        pm25 = [],
        pm10 = []
      if (resp.code == 0) {
        for (let i = 0; i < resp.data.date.length; i++) {
          if (this.dustTime == 12) {
            resp.data.date[i] = this.$moment(resp.data.date[i]).format('HH:mm')
          } else {
            resp.data.date[i] = this.$moment(resp.data.date[i]).format('MM-DD')
          }
        }
        time = resp.data.date
        pm25 = resp.data.pm25
        pm10 = resp.data.pm10
      } else {
        this.$dialog.alert({
          message: '获取扬尘信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
      var myChart = this.$echarts.init(document.getElementById('dustChart'))
      let option = {
        title: {
          text: '扬尘实时数据动态折线图',
          textStyle: {
            fontSize: 16,
            color: '#999'
          },
          y: 'top',
          left: 10,
          subtextStyle: {
            color: '#ddd',
            fontSize: '12'
          }
        },
        color: ['#5D9CEC', '#FC863F'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
        legend: {
          bottom: 0,
          right: 20,
          data: ['PM2.5', 'PM10'],
          itemWidth: 23,
          itemHeight: 13,
          itemGap: 10,
          textStyle: {
            color: '#999'
          }
        },
        grid: {
          left: 10,
          right: 20,
          bottom: 20,
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
                color: '#999'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#999'
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
              color: '#999',
              padding: [0, 0, 0, 20]
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: '#ddd'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#999'
              }
            }
          }
        ],
        series: [
          {
            name: 'PM2.5',
            type: 'line',
            data: pm25,
            lineStyle: {
              normal: {
                color: '#5D9CEC',
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
                color: '#FC863F',
                width: 2,
                opacity: '1'
              }
            }
          }
        ]
      }
      myChart.setOption(option, true)
    },
    //绘制噪声
    async drawVoice() {
      let resp = await this.$http.get('/carp/device/a/q/dust/avg/real/noise', {
        params: {
          sn: this.paramsData.sn,
          size: 20
        }
      })
      let time = [],
        voice = []
      if (resp.code == 0) {
        for (let i = 0; i < resp.data.date.length; i++) {
          if (this.dustTime == 12) {
            resp.data.date[i] = this.$moment(resp.data.date[i]).format('HH:mm')
          } else {
            resp.data.date[i] = this.$moment(resp.data.date[i]).format('MM-DD')
          }
        }
        time = resp.data.date
        voice = resp.data.voice
      } else {
        this.$dialog.alert({
          message: '获取噪声信息失败:' + resp.message,
          confirmButtonColor: 'red'
        })
      }
      var myChart = this.$echarts.init(document.getElementById('voiceChart'))
      let option = {
        title: {
          text: '噪音实时数据动态折线图',
          textStyle: {
            fontSize: 16,
            color: '#999'
          },
          left: 10,
          subtextStyle: {
            color: '#ddd',
            fontSize: '12'
          }
        },
        color: ['#5D9CEC', '#FC863F'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'none'
          }
        },
        legend: {
          bottom: 0,
          data: ['噪音单位(DB)'],
          itemWidth: 23,
          itemHeight: 13,
          itemGap: 10,
          textStyle: {
            color: '#999'
          }
        },
        grid: {
          left: 10,
          right: 20,
          bottom: 20,
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
                color: '#999'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              textStyle: {
                color: '#999'
              }
            }
          }
        ],
        yAxis: [
          {
            name: '',
            splitLine: {
              show: false
            }, //去除网格线
            type: 'value',
            nameTextStyle: {
              color: '#999'
            },
            axisTick: {
              show: false
            },
            axisLine: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: '#ddd'
              }
            },
            axisLabel: {
              textStyle: {
                color: '#999'
              }
            }
          }
        ],
        series: [
          {
            name: '噪音单位(DB)',
            type: 'line',
            data: voice,
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
      myChart.setOption(option, true)
    },
    changeTab() {
      if (this.active == 0) {
        setTimeout(() => {
          this.drawDust()
        }, 10)
      }
      if (this.active == 1) {
        setTimeout(() => {
          this.drawVoice()
        }, 10)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.DustNowData {
  text-align: left;
  min-height: 100%;
  padding-bottom: 40px;
  * {
    font-family: Microsoft YaHei;
  }
  .bt {
    border-top: 1px solid #dddddd;
  }
  .bb {
    border-bottom: 1px solid #dddddd;
  }
  .bl {
    border-left: 1px solid #dddddd;
  }
  .br {
    border-right: 1px solid #dddddd;
  }
  .map {
    padding: 10px;
    height: 200px;
    width: 100%;
  }
  section {
    margin-top: 20px;
    .top2,
    .top3 {
      display: flex;
      .box {
        padding: 10px;
        flex-grow: 1;
        flex-basis: 0;
      }
    }
    .top {
      display: flex;
      align-items: flex-end;
      padding: 0 10px 10px;
    }
    .title {
      font-size: 22px;
      font-weight: bold;
    }
    .title2 {
      font-size: 18px;
    }
    .title3 {
      font-size: 16px;
    }
    .red {
      color: #fa424a;
    }
    .grey {
      color: #666;
    }
    .grey0 {
      color: #cccccc;
    }
    .green {
      color: #46c35f;
    }
    .blue {
      color: #00a8ff;
    }
    .yellow {
      color: #fdad2a;
    }
  }
  .chart {
    width: 100%;
    height: 200px;
    margin-top: 10px;
  }
}
</style>
