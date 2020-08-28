<template>
  <div class="map-car-gps-container">
    <!-- 百度地图 -->
    <map-controller @changeCollect="$refs.carSearchList.search()" ref="mapControl"></map-controller>
    <history-map ref="historyMap"></history-map>
    <!-- 运渣车分页搜索模块 -->
    <car-search-list
      @setCenter="$refs.mapControl.setCenter && $refs.mapControl.setCenter($event)"
      @watchHistoy="$refs.historyMap.watchHistoy($event)"
      ref="carSearchList"
    ></car-search-list>
  </div>
</template>

<script>
import mapController from './models/map/Index'
import historyMap from './models/map/HistoryMap'
import carSearchList from './models/carSearchList/Index'
export default {
  name: 'mapCarGPS',
  components: {
    mapController,
    carSearchList,
    historyMap
  }
}
</script>

<style lang="less" scoped>
.map-car-gps-container {
  position: relative;
}
</style>
