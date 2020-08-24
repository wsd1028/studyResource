<template>
  <div v-if="[0, 50].includes(this.$userType)" class="dust-controller-container">
    <!-- 百度地图 -->
    <map-controller ref="mapControl" :marker-points="markerPoints" @handleGetMarker="$refs.detailsWindow.init($event)" @loading="pageLoading"></map-controller>

    <!-- 顶部导航 -->
    <nav-top
      ref="navTop"
      @markerPoints="markerPoints = $event"
      @loading="pageLoading"
      @renderMarkers="$refs.mapControl.renderMarkers && $refs.mapControl.renderMarkers()"
    ></nav-top>

    <!-- 左侧今日待办浮动窗口 -->
    <flex-left
      @clearProjectMarkers="
        $refs.navTop.clear && $refs.navTop.clear()
        $refs.mapControl.clear && $refs.mapControl.clear()
      "
    ></flex-left>

    <!-- 右侧数据统计浮动窗口 -->
    <flex-right ref="statisticsWindow" @closeDetailsWindow="$refs.detailsWindow.info = {}"></flex-right>

    <!-- 详情弹窗 -->
    <details-window ref="detailsWindow" @colseStatisticsWindow="$refs.statisticsWindow.hide = true"> </details-window>
  </div>
</template>

<script>
import mapController from './models/map/Index'
import navTop from './models/nav-top/Index'
import flexLeft from './models/flex-left/Index'
import flexRight from './models/flex-right/Index'
import detailsWindow from './models/details-window/Index'
export default {
  name: 'dustController',

  data() {
    return {
      loading: null,
      // 地图覆盖物
      markerPoints: {}
    }
  },

  methods: {
    // 是否加载
    pageLoading(flag) {
      if (flag) {
        this.loading = this.$loading({
          text: '正在加载数据'
        })
      } else {
        this.loading && this.loading.close && this.loading.close()
      }
    }
  },

  beforeCreate() {
    // 非管理员或政府跳转到个人页面
    switch (this.$userType) {
      case 0:
        break

      case 50:
        break

      case 30:
        this.$router.replace('projectInfo')
        break

      default:
        this.$router.replace('userSpace')
        break
    }
  },

  components: {
    mapController,
    navTop,
    flexLeft,
    flexRight,
    detailsWindow
  }
}
</script>

<style lang="less" scoped>
.dust-controller-container {
  position: relative;
  overflow: hidden;
}
</style>
