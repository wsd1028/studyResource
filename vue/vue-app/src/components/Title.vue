<template>
  <van-nav-bar :title="titleName" @click-left="onClickLeft" class="title" left-arrow left-text="返回" />
</template>
<script>
export default {
  name: 'title',
  props: {
    titleName: {
      type: String,
      default: ''
    }
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="less" scoped>
.title {
  background: #4285f4;
}
.van-nav-bar__title {
  color: #fff;
}
.van-nav-bar__text {
  color: #ffffff;
}

.van-nav-bar .van-icon {
  color: #ffffff;
}
</style>
