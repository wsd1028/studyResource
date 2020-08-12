<template>
  <div class="DustAgoData">
    <myTitle titleName="扬尘历史数据"></myTitle>
    <div class="item">
      <el-select @change="changeDust" placeholder="请选择时间段" size="mini" style="margin-left:10px" v-model="dustTime">
        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in options"></el-option>
      </el-select>
      <div class="chart" id="dustChart"></div>
    </div>
    <div class="item">
      <el-select @change="changeVoice" placeholder="请选择时间段" size="mini" style="margin-left:10px" v-model="voiceTime">
        <el-option :key="item.value" :label="item.label" :value="item.value" v-for="item in options"></el-option>
      </el-select>
      <div class="chart" id="voiceChart"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paramsData: {},
      dustTime: '12',
      dustDate: {
        startDate: '',
        endDate: ''
      },
      voiceDate: {
        startDate: '',
        endDate: ''
      },
      voiceTime: '12',
      options: [
        {
          label: '近12小时',
          value: '12'
        },
        {
          label: '近7天',
          value: '7'
        },
        {
          label: '近30天',
          value: '30'
        }
      ]
    }
  },
  mounted() {
    this.paramsData = this.$route.params
    this.changeDust()
    this.changeVoice()
  },
  components: {},
  methods: {
    //改变扬尘时间
    changeDust() {
      this.dustDate.endDate = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      if (this.dustTime == 12) {
        this.dustDate.startDate = this.$moment()
          .subtract(12, 'hours')
          .format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.dustTime == 7) {
        this.dustDate.startDate = this.$moment()
          .subtract(7, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.dustTime == 30) {
        this.dustDate.startDate = this.$moment()
          .subtract(30, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
      }
      this.drawDust()
    },
    //绘制扬尘
    async drawDust() {
      let resp = await this.$http.get('/carp/device/a/q/dust/avg/real/pm', {
        params: {
          sn: this.paramsData.sn,
          size: '',
          ...this.dustDate
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
    //改变噪声时间
    changeVoice() {
      this.voiceDate.endDate = this.$moment().format('YYYY-MM-DD HH:mm:ss')
      if (this.voiceTime == 12) {
        this.voiceDate.startDate = this.$moment()
          .subtract(12, 'hours')
          .format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.voiceTime == 7) {
        this.voiceDate.startDate = this.$moment()
          .subtract(7, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
      }
      if (this.voiceTime == 30) {
        this.voiceDate.startDate = this.$moment()
          .subtract(30, 'days')
          .format('YYYY-MM-DD HH:mm:ss')
      }
      this.drawVoice()
    },
    //绘制噪声
    async drawVoice() {
      let resp = await this.$http.get('/carp/device/a/q/dust/avg/real/noise', {
        params: {
          sn: this.paramsData.sn,
          size: '',
          ...this.voiceDate
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
    }
  }
}
</script>

<style lang="less">
.DustAgoData {
  text-align: left;
  background-color: #f9f9f9;
  min-height: 100%;
  padding-bottom: 40px;
  .item {
    background-color: #fff;
    margin-top: 20px;
    padding-top: 10px;
  }
  .chart {
    width: 100%;
    height: 200px;
    margin-top: 10px;
  }
}
</style>
