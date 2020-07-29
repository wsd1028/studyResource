<template>
  <div class="MyImage">
    <van-image :height="height" :src="imgUrl" :width="width" @click="handelImg" fit="cover">
      <template v-slot:loading>
        <van-loading size="20" type="spinner" />
      </template>
      <template v-slot:error>
        <van-icon class-prefix="iconfont" name="tupian-poshun" size="60" />
      </template>
    </van-image>
    <van-image-preview :images="[imgUrl]" v-if="isPreviewShow" v-model="ImagePreviewShow"></van-image-preview>
  </div>
</template>
<script>
export default {
  name: 'myImage',
  data() {
    return {
      ImagePreviewShow: false
    }
  },
  props: {
    height: {
      type: String,
      default: '80px'
    },
    width: {
      type: String,
      default: '80px'
    },
    imgUrl: {
      type: String,
      default: ''
    },
    isPreviewShow: {
      type: Boolean,
      default: true
    }
  },
  mounted() {},
  methods: {
    handelImg() {
      this.ImagePreviewShow = true
      window.event ? (window.event.cancelBubble = true) : e.stopPropagation()
    }
  }
}
</script>

<style lang="less">
.MyImage {
  .detail_contant {
    .van-swipe {
      width: 100%;
      .van-swipe-item {
        height: 100%;
        color: #fff;
        font-size: 20px;
        height: 6.16rem;
        text-align: center;
        vertical-align: middle;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .van-swipe__indicators {
        bottom: 0.27rem;
        .van-swipe__indicator {
          width: 0.25rem;
          height: 0.25rem;
          background: #e9e3d8;
          opacity: 1;
          &:not(:last-child) {
            margin-right: 0.26rem;
          }
          &.van-swipe__indicator--active {
            background: #f78927;
            opacity: 1;
          }
        }
      }
    }
    .van-image-preview {
      .van-image-preview__index {
        display: none;
      }
    }
  }
}
</style>
