<template>
  <div class="demo">
    <div @touchmove="touchmove" @touchstart="touchstart" class="model" ref="model" style="height:300px"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //第一次触摸元素y轴位置
      elStartY: 0,
      //第一次触摸时元素的高度
      eleHeight: 0,
      //页面高度
      maxHeight: 0
    }
  },
  components: {},
  mounted() {
    this.maxHeight = document.documentElement.clientHeight
  },
  methods: {
    touchstart(e) {
      var touch = event.targetTouches[0]
      this.elStartY = touch.pageY
      this.eleHeight = parseInt(this.$refs.model.style.height)
    },
    touchmove(e) {
      var touch = e.targetTouches[0]
      let endY = parseInt(touch.pageY)
      if (this.eleHeight + this.elStartY - endY >= 300) {
        this.$refs.model.style.height = this.elStartY - endY + this.eleHeight + 'px'
        if (this.elStartY - endY + this.eleHeight > this.maxHeight) {
          this.$refs.model.style.height = this.maxHeight + 'px'
        }
      } else {
        this.$refs.model.style.height = '300px'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.demo {
  position: relative;
  height: 100%;
  .model {
    position: absolute;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    bottom: 0;
    left: 0;
    width: 100%;
    max-height: 100% !important;
    background-color: red;
  }
}
</style>
