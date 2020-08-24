<template>
  <div class="container">
    <el-row class="el-row">
      <el-col :lg="14" :xl="16" class="el-col">
        <!-- 项目基本信息 -->
        <project-details :projectId="projectId"></project-details>
        <!-- 数据统计 -->
        <statistics-details :projectId="projectId"></statistics-details>
        <!-- 扬尘噪声统计 -->
        <dust-noise ref="dustNoise" :projectId="projectId"></dust-noise>
      </el-col>
      <el-col :lg="10" :xl="8" class="el-col">
        <!-- 空气质量统计 -->
        <air-quality ref="airQuality" :projectId="projectId"></air-quality>
        <!-- 电子联单统计 -->
        <electronic-charts ref="electronicCharts" :projectId="projectId"></electronic-charts>
        <!-- 名录车统计 -->
        <car-charts ref="carCharts" :projectId="projectId"></car-charts>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import projectDetails from './projectDetails'
import statisticsDetails from './statistics'
import dustNoise from './dustNoise'
import airQuality from './airQuality'
import electronicCharts from './electronic'
import carCharts from './car'
export default {
  name: 'projectInfo',
  data() {
    return {
      projectId: this.propProjectId || this.$store.state.user.userInfo.accountTypeDto.ancillaryId
    }
  },
  props: {
    propProjectId: String
  },
  components: {
    projectDetails,
    statisticsDetails,
    dustNoise,
    airQuality,
    electronicCharts,
    carCharts
  },
  methods: {
    echartsResize() {
      Object.keys(this.$refs).forEach(key => {
        this.$refs[key].echartsResize && this.$refs[key].echartsResize()
      })
    }
  },
  mounted() {
    window.addEventListener('resize', this.echartsResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.echartsResize)
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
.container {
  background-color: #eff2f9;
  height: auto !important;
  .el-row,
  .el-col {
    padding: 0 8px 8px 8px;
    height: 100%;
  }
  .el-col {
    @flex-column();
  }
  .el-col > * {
    margin: 16px 0 0 0;
  }
}
</style>
