<template>
  <el-dialog width="360px" :visible="true" @close="close" :show-close="false">
    <div class="weather-container">
      <div class="air-wrap">
        <!-- AQI -->
        <circle-progress
          v-for="(render, key) in renders"
          :key="key"
          :value="aqi[render.field]"
          :total="render.total"
          :label="render.label"
          :dynamic-color="render.dynamicColor"
          :unit="render.unit"
          class="circle-progress"
        ></circle-progress>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import circleProgress from './circle-progress'
export default {
  name: 'weatherBox',
  data() {
    return {
      // 天气
      weather: {},
      // 空气质量
      aqi: {},
      // 渲染数据
      renders: [
        {
          field: 'aqi',
          total: 401,
          label: 'AQI',
          dynamicColor: { 0: '#67C23A', 51: '#409EFF', 101: '#E6A23C', 151: '#F56C6C', 201: '#FF0000', 401: '#FF0000' }
        },
        {
          field: 'pm25',
          total: 401,
          label: 'PM2.5',
          unit: 'μg/m³',
          dynamicColor: { 0: '#67C23A', 36: '#409EFF', 76: '#E6A23C', 116: '#F56C6C', 151: '#FF0000', 401: '#FF0000' }
        },
        {
          field: 'pm10',
          total: 401,
          label: 'PM10',
          unit: 'μg/m³',
          dynamicColor: { 0: '#67C23A', 50: '#409EFF', 150: '#E6A23C', 401: '#F56C6C' }
        },
        {
          field: 'o3',
          total: 300,
          label: '臭氧',
          unit: 'μg/m³',
          dynamicColor: { 0: '#67C23A', 51: '#409EFF', 101: '#E6A23C', 151: '#F56C6C', 300: '#FF0000' }
        },
        {
          field: 'no2',
          total: 150,
          label: '二氧化氮',
          unit: 'μg/m³',
          dynamicColor: { 0: '#67C23A', 20: '#409EFF', 38: '#E6A23C', 100: '#F56C6C' }
        },
        {
          field: 'so2',
          total: 150,
          label: '二氧化硫',
          unit: 'μg/m³',
          dynamicColor: { 0: '#67C23A', 31: '#409EFF', 61: '#E6A23C', 116: '#F56C6C' }
        },
        {
          field: 'co',
          total: 1,
          label: '一氧化碳',
          unit: 'mg/m³',
          dynamicColor: { 0: '#67C23A', 0.36: '#409EFF', 0.66: '#E6A23C', 1: '#F56C6C' }
        }
      ]
    }
  },
  props: {
    close: Function
  },
  methods: {
    // 获取天气数据
    getWeather() {
      // 获取天气数据
      this.$getWeather().then(res => {
        Object.keys(res.aqi.city).forEach(field => {
          this.$set(this.aqi, field, parseFloat(res.aqi.city[field]))
        })
        this.weather = res.now
      })
    }
  },
  created() {
    this.getWeather()
  },
  components: {
    circleProgress
  }
}
</script>

<style lang="less" scoped>
@import '../../style/color.less';
@import '../../style/size.less';
.weather-container {
  margin: -60px -20px -30px;
  // aqi pm10统计
  .air-wrap {
    margin-top: 0.1rem;
    padding-bottom: 0.1rem;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    .circle-progress {
      margin: 0.1rem 0;
      width: 50%;
      flex: none;
    }
    .more {
      margin-top: -0.3rem;
      width: 100%;
      font-size: 0.24rem;
      color: @gray;
      &:hover {
        color: @primary;
        cursor: pointer;
      }
    }
  }
}
</style>
