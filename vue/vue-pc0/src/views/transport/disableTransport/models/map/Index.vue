<template>
  <div class="baidu-map-container">
    <!-- 百度地图 -->
    <baidu-map
      ref="map"
      :center="options.center"
      :zoom="12"
      :map-click="false"
      :scroll-wheel-zoom="true"
      :double-click-zoom="false"
      @ready="ready"
      @click="$log($event.point)"
      @dblclick="initPath"
      class="baidu-map"
    >
      <bm-polygon
        :path="polygonPath"
        :editing="enableEdit"
        :strokeWeight="2"
        :strokeOpacity="1"
        fillColor="#F56C6C"
        strokeColor="#F56C6C"
        :fillOpacity="0.08"
        @lineupdate="lineupdate($event.target.getPath())"
      />
    </baidu-map>
  </div>
</template>

<script>
import BMapLib from '@/libs/BMapLib'
export default {
  name: 'dustMap',

  data() {
    return {
      options: {
        center: {
          lat: 28.756994,
          lng: 104.641929
        }
      },
      BMap: null,
      map: null,

      // 是否允许修改路径
      enableEdit: true,

      // 多边形预订路径
      polygonPath: [],

      // 多边形变动事件(防抖)
      lineupdate: this.$debounce(path => {
        this.$emit('path', path)
      }, 500)
    }
  },

  props: {
    markerPoints: Object
  },

  methods: {
    // 百度地图初始化完成
    ready(res) {
      this.BMap = res.BMap
      this.map = res.map
      this.BMapLib = BMapLib(res.BMap)
    },

    // 设置路径
    setPath(path, enableEdit) {
      this.polygonPath = path || []
      this.enableEdit = enableEdit
    },

    // 根据鼠标双击的点判断
    initPath({ point }) {
      // 仅在路径不存在时初始化
      if (!this.polygonPath.length) {
        this.polygonPath.push({ lng: point.lng, lat: point.lat - 0.1 })
        this.polygonPath.push({ lng: point.lng - 0.1, lat: point.lat + 0.1 })
        this.polygonPath.push({ lng: point.lng + 0.1, lat: point.lat + 0.1 })
        this.$emit('path', this.polygonPath)
      } else {
        this.$message.error('重新初始化地区请先点击下方重置按钮')
      }
    },

    // 清除路径
    clearPath() {
      this.polygonPath = []
      this.$emit('path', [])
      this.$message.warning('双击地图生成初始化区域')
    },

    /* *
     * 判断是否在区域内
     * @param point: 要判断的点
     * @param polygonPath: 区域路径
     * * */
    comparison(point, polygonPath) {
      return this.BMapLib.GeoUtils.isPointInPolygon(
        new this.BMap.Point(point.lng, point.lat),
        new this.BMap.Polygon(polygonPath.map(({ lng, lat }) => new this.BMap.Point(lng, lat)))
      )
    }
  },

  created() {
    this.$message.warning('双击地图生成初始化区域')
  }
}
</script>

<style lang="less" scoped>
.baidu-map-container,
.baidu-map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.bt-group {
  position: absolute;
  left: 50%;
  bottom: 30px;
  transform: translateX(-50%);
}
</style>
