<template>
  <div class="manage">
    <Map :name="name" :searchUrl="searchUrl"></Map>
  </div>
</template>
<script>
import Map from '../../../components/Map'
export default {
  data() {
    return {
      name: '项目',
      searchUrl: '/carp/business/a/q/project/gps/all'
    }
  },
  components: {
    Map
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/common';
</style>
