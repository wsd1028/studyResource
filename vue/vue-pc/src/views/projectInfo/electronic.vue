<template>
  <el-card shadow="never" v-loading="loading" class="el-card project-home-charts-wrap">
    <div slot="header" class="header">
      <span>电子联单统计</span>
    </div>
    <div ref="content" class="content"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'electronic',
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
    // 重绘
    echartsResize() {
      this.echarts.resize && this.echarts.resize()
    },

    // 获取配置文件
    getOption() {
      return {
        grid: {
          left: '0',
          right: '0',
          bottom: '0',
          top: '10',
          containLabel: true
        },
        legend: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          formatter: '{c0}单',
          axisPointer: {
            show: true,
            status: 'shadow',
            z: -1,
            shadowStyle: {
              color: '#E6F7FF'
            },
            type: 'shadow'
          }
        },
        xAxis: [
          {
            position: 'bottom',
            type: 'category',
            axisLine: {
              show: true,
              lineStyle: {
                color: '#ECF1F6'
              }
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              rotate: 0,
              fontSize: 12,
              color: '#3A3A3C'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#ECF1F6', '#ECF1F6'],
                width: 0,
                type: 'dashed'
              }
            },
            gridIndex: 0,
            data: ['07-30', '07-31', '08-01', '08-02', '08-03', '08-04', '08-05', '08-06', '08-07', '08-08']
          },
          {
            type: 'category',
            gridIndex: 1,
            show: false
          }
        ],
        yAxis: [
          {
            type: 'value',
            position: 'left',
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: true,
              rotate: 0,
              fontSize: 12,
              color: '#6E7D9C'
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#ECF1F6', '#ECF1F6'],
                width: 1,
                type: 'solid'
              }
            },
            max: 100
          },
          {
            gridIndex: 1,
            min: 0,
            max: 1,
            show: false
          }
        ],
        series: [
          {
            name: '电子联单',
            xAxisIndex: 0,
            yAxisIndex: 0,
            itemStyle: {
              color: '#43A7FF'
            },
            type: 'bar',
            data: [22, 85, 65, 25, 75, 67, 32, 75, 89, 66],
            barMaxWidth: '20%',
            z: 3
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
  flex: 1;
  height: 0;
  min-height: 149px;
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
