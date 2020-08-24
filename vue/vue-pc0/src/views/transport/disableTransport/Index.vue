<template>
  <div class="dust-controller-container">
    <!-- 百度地图 -->
    <map-controller ref="mapControl" @path="path = $event"></map-controller>

    <!-- 表单 -->
    <form-bind ref="form" :path="path" @clearPath="$refs.mapControl.clearPath()" @flushList="$refs.list.flushList()"></form-bind>

    <!-- 列表 -->
    <disable-transport-list
      ref="list"
      @clickRow="
        $refs.mapControl.setPath(JSON.parse($event.row.gpsJson), $event.enableEdit)
        $refs.form.fill($event.row, $event.enableEdit)
        path = JSON.parse($event.row.gpsJson)
      "
      @handleNew="$refs.form.fill({}, true)"
    ></disable-transport-list>
  </div>
</template>

<script>
import mapController from './models/map/Index'
import formBind from './models/form/Index'
import disableTransportList from './models/list/Index'
export default {
  name: 'dustController',

  data() {
    return {
      path: []
    }
  },

  methods: {},

  components: {
    mapController,
    formBind,
    disableTransportList
  }
}
</script>

<style lang="less" scoped>
.dust-controller-container {
  position: relative;
}
</style>
