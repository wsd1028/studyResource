<template>
  <el-card shadow="never" v-loading="loading" class="el-card project-home-charts-wrap">
    <div slot="header" class="header">
      <span>扬尘噪声统计</span>
      <div class="label-wrap">
        <div>
          <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#73A0FA;"></span>
          <span>噪声实时</span>
        </div>
        <div>
          <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#73DEB3;"></span>
          <span>扬尘实时</span>
        </div>
        <div>
          <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:#FFB761;"></span>
          <span>扬尘国控</span>
        </div>
      </div>
    </div>
    <div class="content" ref="content"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'dustNoise',
  data() {
    return {
      loading: false,
      echarts: null
    }
  },
  props: {
    projectId: String
  },
  methods: {
    echartsResize() {
      this.echarts.resize && this.echarts.resize()
    },

    getOption() {
      return {
        backgroundColor: '#fff',
        color: ['#73A0FA', '#73DEB3', '#FFB761'],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              type: 'solid'
            }
          },
          formatter: params => {
            let result = ''
            params.forEach((item, i) => {
              result += `${item.marker} ${item.seriesName} : ${item.value} ${['dB', 'μg/m3', 'μg/m3'][i]}<br/>`
            })
            return result
          }
        },
        grid: {
          left: '0',
          right: '0',
          bottom: '0',
          top: '10',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['05日08时', '05日09时', '05日10时', '05日11时', '05日12时', '05日13时', '05日14时', '05日15时', '05日16时', '05日17时'],
          splitLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        yAxis: {
          type: 'value',
          max: 100,
          axisLabel: {
            color: '#999',
            textStyle: {
              fontSize: 12
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#F3F4F4'
            }
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#F3F4F4'
            }
          }
        },
        series: [
          {
            name: '噪声实时',
            type: 'line',
            smooth: true,
            data: [45, 30, 20, 16, 28, 56, 76, 34, 63, 34]
          },
          {
            name: '扬尘实时',
            type: 'line',
            smooth: true,
            data: [46, 27, 46, 60, 35, 53, 56, 44, 38, 46]
          },
          {
            name: '扬尘国控',
            type: 'line',
            smooth: true,
            data: [20, 19, 2, 32, 55, 23, 53, 46, 52, 77]
          }
        ]
      }
    }
  },
  mounted() {
    this.echarts = echarts.init(this.$refs.content)
    this.echarts.setOption(this.getOption())
  }
}
</script>

<style lang="less" scoped>
@import './less/Index';
.el-card {
  flex: 2.4;
  min-height: 218px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .label-wrap {
      font-size: 14px;
      font-weight: lighter;
      & > div {
        display: inline-block;
        margin-left: 8px;
      }
    }
  }
  .content {
    height: 100%;
  }
}
</style>

<style lang="less">
.project-home-charts-wrap {
  display: flex;
  flex-direction: column;
  .el-card__body {
    flex: auto;
    height: 0;
  }
}
</style>
