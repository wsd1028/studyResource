<template>
  <el-card shadow="never" v-loading="loading" class="el-card project-home-charts-wrap">
    <div slot="header" class="header">
      <span>空气质量统计</span>
      <div class="nav-wrap" @click="$log($event)">
        <span>本月</span>
        <span>季度</span>
        <span class="active">今年</span>
      </div>
    </div>
    <div ref="content" class="content"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
export default {
  name: 'airQuality',
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
        graphic: {
          elements: [
            {
              type: 'image',
              style: {
                width: 30,
                height: 30
              },
              left: 'center',
              top: 'center'
            }
          ]
        },
        series: [
          {
            type: 'pie',
            radius: [30, '80%'],
            center: ['50%', '50%'],
            roseType: 'radius',
            color: ['#651B00', '#752AE9', '#D4322F', '#F57D2C', '#F6B041', '#1FE141'],
            data: [
              {
                value: 5.26,
                name: '严重污染'
              },
              {
                value: 26.32,
                name: '重度污染'
              },
              {
                value: 21.05,
                name: '中度污染'
              },
              {
                value: 13.12,
                name: '轻度污染'
              },
              {
                value: 18.42,
                name: '良'
              },
              {
                value: 15.79,
                name: '优'
              }
            ],
            label: {
              normal: {
                textStyle: {
                  fontSize: 14
                },
                formatter: function(param) {
                  return param.name + ' ' + Math.round(param.percent) + '%'
                }
              }
            },
            labelLine: {
              normal: {
                smooth: true,
                lineStyle: {
                  width: 2
                }
              }
            },

            animationType: 'scale',
            animationEasing: 'elasticOut',
            animationDelay: function() {
              return Math.random() * 200
            }
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
  flex: 2;
  height: 0;
  min-height: 298px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .nav-wrap {
      font-size: 14px;
      font-weight: lighter;
      & > span {
        margin-left: 12px;
        cursor: pointer;
        &.active {
          color: #4285f4;
          font-weight: bold;
        }
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
