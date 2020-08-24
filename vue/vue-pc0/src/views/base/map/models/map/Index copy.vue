<template>
  <baidu-map :center="options.center" :zoom="12" class="baidu-map" @ready="ready">
    <bm-boundary name="宜宾市" :strokeWeight="2" strokeColor="#F56C6C" fillColor="#F56C6C" :fillOpacity="0.08"></bm-boundary>

    <!-- 覆盖信息物 -->
    <!-- <div v-for="(item, key) in markerPoints" :key="key">
      <bm-marker
        v-for="(marker, index) of item.check ? item.data : []"
        :key="index"
        :position="{ lng: marker.longitude, lat: marker.latitude, id: marker.id, key }"
        @click="$log(key, marker)"
        :icon="{
          url: markerIcons[marker.state],
          size: { width: 40, height: 40 }
        }"
      ></bm-marker>
    </div> -->

    <!-- 覆盖信息物(海量点) -->
    <!-- <bm-point-collection
      v-for="(item, key) in markerPoints"
      :key="key"
      :points="item.check ? item.data.map(marker => ({ lat: marker.latitude, lng: marker.longitude, data: marker })) : []"
      size="BMAP_POINT_SIZE_BIG"
      :color=""
      @click="$log($event)"
    ></bm-point-collection> -->
  </baidu-map>
</template>

<script>
import { projectStateDict } from '@/libs/dict'
export default {
  name: 'dustMap',

  data() {
    // 获取图标路径
    let markerIcons = {}
    projectStateDict.forEach(item => {
      let icon = document.createElement('img')
      icon.src = item.markerIcon
      markerIcons[item.code] = item.markerIcon
    })

    return {
      options: {
        center: {
          lat: 28.756994,
          lng: 104.641929
        }
      },
      BMap: null,
      map: null,

      // 覆盖物图标
      markerIcons
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
      const { DataSet, baiduMapLayer } = require('mapv')
      this.DataSet = DataSet
      this.baiduMapLayer = baiduMapLayer

      this.renderMarker()
    },

    // 渲染覆盖物方法
    renderMarker() {
      let count = 60000
      let img = document.createElement('img')
      img.src = 'project-approval.png' //图标图片
      let data = []
      let points = []
      img.onload = () => {
        while (count--) {
          let fanNum = parseInt(Math.random() * 100)
          let lng = this.options.center.lng - 10 + Math.random() * 20
          let lat = this.options.center.lat - 6 + Math.random() * 12
          data.push({
            geometry: {
              type: 'Point',
              coordinates: [lng, lat]
            },
            deg: 0,
            icon: img,
            text: fanNum.toString(), //图标上方文字
            tag: { fanNum: fanNum } //附加信息对象
          })
          points.push(new this.BMap.Point(lng, lat))
        }
        let dataSet = new this.DataSet(data)
        let options = {
          draw: 'icon',
          methods: {
            click: s => {
              //图标点击事件
              if (s && s.tag) {
                let html = `<div>
                                                <p>经度: ${s.geometry.coordinates[0]}</p>
                                                <p>纬度: ${s.geometry.coordinates[1]}</p>
                                                <p>有缘人数量: ${s.tag.fanNum}</p>
                                            </div>`
                let infoWindow = new this.BMap.InfoWindow(html)
                let bPoint = new this.BMap.Point(s.geometry.coordinates[0], s.geometry.coordinates[1])
                this.map.openInfoWindow(infoWindow, bPoint)
              }
            }
          },
          showText: true,
          avoid: true,
          size: 12,
          font: '16px Arial',
          fillStyle: 'red',
          shadowColor: 'red',
          shadowBlur: 0,
          textOffset: { x: 0, y: -16 } //文字显示的位置
        }
        new this.baiduMapLayer(this.map, dataSet, options) //显示海量图标
        this.map.setViewport(points) //视角切换
      }
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
