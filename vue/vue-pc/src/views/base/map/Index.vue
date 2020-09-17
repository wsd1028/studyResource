<template>
  <div v-if="[0, 50].includes(this.$userType)" class="dust-controller-container">
    <!-- 百度地图 -->
    <map-controller ref="mapControl" :marker-points="markerPoints" @handle-get-marker="$refs.detailsWindow.init($event)" @loading="pageLoading" />

    <!-- 顶部导航 -->
    <nav-top
      ref="navTop"
      @marker-points="markerPoints = $event"
      @loading="pageLoading"
      @render-markers="$refs.mapControl.renderMarkers && $refs.mapControl.renderMarkers()"
    />

    <!-- 左侧今日待办浮动窗口 -->
    <flex-left
      @clear-project-markers="
        $refs.navTop.clear && $refs.navTop.clear()
        $refs.mapControl.clear && $refs.mapControl.clear()
      "
    />

    <!-- 右侧数据统计浮动窗口 -->
    <flex-right
      ref="statisticsWindow"
      @close-details-window="$refs.detailsWindow.info = {}"
      @open-weather-box="weatherBoxShow = true"
      @user-list-show="
        workStationInfo = null
        userListShow = true
      "
    />

    <!-- 详情弹窗 -->
    <details-window
      ref="detailsWindow"
      @colse-statistics-window="$refs.statisticsWindow.hide = true"
      @user-list-show="
        workStationInfo = $event
        userListShow = true
      "
    />

    <!-- 天气详情弹窗 -->
    <weather-box
      v-if="weatherBoxShow"
      :close="
        () => {
          weatherBoxShow = false
        }
      "
    />

    <!-- 用户列表弹窗 -->
    <user-list
      v-if="userListShow"
      :workStationInfo="workStationInfo"
      :close="
        () => {
          userListShow = false
        }
      "
    />
  </div>
</template>

<script>
import mapController from './models/map/Index'
import navTop from './models/nav-top/Index'
import flexLeft from './models/flex-left/Index'
import flexRight from './models/flex-right/Index'
import detailsWindow from './models/details-window/Index'
import weatherBox from './models/weather-box/Index'
import userList from './models/user-list/Index'
export default {
  name: 'dustController',

  data() {
    return {
      loading: null,

      // 地图覆盖物
      markerPoints: {},

      // 天气详情弹窗控制器
      weatherBoxShow: false,

      // 工作站信息弹窗中的人员列表按钮返回的工作站信息
      workStationInfo: {},

      // 用户列表弹窗显示控制器
      userListShow: false
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
    detailsWindow,
    weatherBox,
    userList
  }
}
</script>

<style lang="less" scoped>
.dust-controller-container {
  position: relative;
  overflow: hidden;
}
</style>
