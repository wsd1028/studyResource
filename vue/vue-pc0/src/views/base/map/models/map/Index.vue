<template>
  <baidu-map
    ref="map"
    :center="options.center"
    :zoom="12"
    :map-click="false"
    :double-click-zoom="false"
    :scroll-wheel-zoom="true"
    @ready="ready"
    class="baidu-map"
  >
    <bm-boundary name="宜宾" :strokeWeight="2" :strokeOpacity="0.5" fillColor="#F56C6C" strokeColor="#F56C6C" :fillOpacity="0.08"></bm-boundary>
    <!-- <bm-info-window :position="(project && { lng: project.longitude, lat: project.latitude }) || { lat: 0, lng: 0 }" :show="true">
      <p v-text="project && project.name"></p>
    </bm-info-window> -->
  </baidu-map>
</template>

<script>
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

      // 项目对象
      project: null
    }
  },

  props: {
    markerPoints: Object
  },

  methods: {
    // 百度地图初始化完成
    ready(res) {
      window.BMap = this.BMap = res.BMap
      this.map = res.map

      // 引入mapv
      const { DataSet, baiduMapLayer, utilCityCenter } = require('mapv')
      this.DataSet = DataSet
      this.baiduMapLayer = baiduMapLayer
      this.utilCityCenter = utilCityCenter
    },

    // 渲染覆盖物方法
    renderMarkers() {
      // 获取图标
      let markerIcons = [
        // 工地图标
        { url: '/project-safe.png', icon: null },
        // 扬尘图标
        { url: '/dust-safe.png', icon: null },
        // 消纳站
        { url: '/garbage.png', icon: null },
        // 公共区域
        { url: '/public-area.png', icon: null }
      ]
      Promise.all(
        markerIcons.map(item => {
          let icon = document.createElement('img')
          icon.src = item.url
          item.icon = icon
          return new Promise(resolve => {
            icon.onload = () => {
              resolve()
            }
          })
        })
      )
        // 等待图标加载完成
        .then(() => {
          let iconData = []
          Object.keys(this.markerPoints).forEach(key => {
            // 选中状态时才渲染覆盖物
            if (this.markerPoints[key].check) {
              // 填充数据
              this.markerPoints[key].data.forEach(marker => {
                // 图标数据填充
                iconData.push({
                  // 项目图标
                  /* icon: this.$mixIconText(markerIcons[0].icon, {
                    text: marker.state,
                    x: 'center',
                    y: 14
                  }), */
                  icon:
                    (['dustPrograme', 'administer'].includes(key) && markerIcons[1].icon) ||
                    (['garbageStation'].includes(key) && markerIcons[2].icon) ||
                    (['publicArea'].includes(key) && markerIcons[3].icon) ||
                    markerIcons[0].icon,
                  geometry: {
                    type: 'Point',
                    coordinates: [marker.longitude || marker.lng, marker.latitude || marker.lat]
                  },
                  // 数据对象
                  target: marker
                })
              })
            }
          })
          // 数据解析装载
          if (!this.iconDataSet) {
            this.iconDataSet = new this.DataSet(iconData)
          } else {
            this.iconDataSet.set(iconData)
          }
          // 图标配置项
          this.iconOptions = {
            // 绘制类型
            draw: 'icon',
            // 点击事件
            methods: {
              click: e => {
                if (!e) this.$emit('handleGetMarker', null)
                else {
                  // 获取项目对象
                  this.project = e && e.target
                  // 上报点击事件到父组件
                  if (e && e.target) {
                    this.$emit('handleGetMarker', e.target)
                  }
                }
              }
              /* mousemove: e => {
                // 获取项目对象
                this.project = e && e.target
                // 上报点击事件到父组件
                if (e && e.target) {
                  this.$emit('handleGetMarker', e.target)
                }
              } */
            },
            size: 16
          }
          //显示海量图标
          if (!this.iconMapLayer) {
            this.iconMapLayer = new this.baiduMapLayer(this.map, this.iconDataSet, this.iconOptions)
          }
        })
    },

    // 清除覆盖物
    clear() {
      // 清除覆盖物
      if (this.iconDataSet) {
        this.iconDataSet.set([])
      }
      // 添加区域规划
      /* new this.BMap.Boundary().get('宜宾', res => {
        var ply = new this.BMap.Polygon(res.boundaries[0], {
          strokeWeight: 2,
          strokeOpacity: 0.5,
          fillColor: '#F56C6C',
          strokeColor: '#F56C6C',
          fillOpacity: 0.08
        })

        this.map.addOverlay(ply)
      }) */
    }
  }
}
</script>

<style lang="less" scoped>
.baidu-map {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
