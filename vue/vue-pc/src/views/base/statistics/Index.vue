<template>
  <div class="main-container">
    <header>
      <!-- <span class="title">宜宾扬尘数据统计</span> -->
    </header>
    <article>
      <section class="left">
        <div ref="project"></div>
        <div ref="project2"></div>
        <div></div>
      </section>
      <section class="center"></section>
      <section class="right">
        <div></div>
        <div></div>
        <div></div>
      </section>
    </article>
  </div>
</template>

<script>
import echarts from 'echarts'
import getProjectCharts from './echartsOptions/project'
export default {
  data() {
    return {
      // 项目echarts实例,及获取图表参数方法
      projectCharts: null,
      getProjectCharts
    }
  },
  created() {
    // 初始化
    this.init()
  },
  mounted() {
    // 图表初始化操作
    // this.echartsInit()
  },
  methods: {
    // 初始化操作
    init() {},
    // 图表初始化操作
    echartsInit() {
      // 项目实例
      this.projectCharts = echarts.init(this.$refs.project)
      this.flushProjectCharts()
    },
    // 获取项目图表参数
    flushProjectCharts() {
      this.getProjectCharts().then(data => {
        this.projectCharts.setOption(data)
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
.main-container {
  flex: auto;
  background: url('../../../assets/images/statistics/main-bg.png') no-repeat;
  background-size: 100% 100%;
  @flex-column();
  header {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.24rem;
    color: #fff;
    flex: none;
    height: 0.98rem;
    // background: url('../../../assets/images/statistics/header-bg.png') no-repeat;
    background-position: center;
    background-size: 100% 80%;
    .title {
      transform: translateX(0.16rem);
    }
  }
  article {
    display: flex;
    flex: auto;
    height: 0;
    section {
      flex: auto;
      width: 0;
      &.left,
      &.right {
        @flex-column();
        & > * {
          padding: 0.1rem;
          flex: auto;
          height: 0;
        }
      }
      &.center {
        flex: 2;
      }
    }
  }
}
</style>
