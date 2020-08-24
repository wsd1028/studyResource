<template>
  <div class="main-container">
    <iframe class="map" border="0" src="http://yb.hgyun.net/DustNoise/ybMapGis/" allowfullscreen></iframe>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
.main-container {
  flex: auto;
  overflow: hidden;
  .map {
    width: 100%;
    height: 100%;
  }
}
</style>
