<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
// 自定义滚动条
.custom-scrollbar.el-scrollbar {
  height: 100%;
  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
  .el-scrollbar__bar.is-vertical {
    .el-scrollbar__thumb {
      background-color: rgba(34, 34, 34, 0.76);
    }
  }
}

// 图片预览
.el-image {
  .el-image-viewer__wrapper {
    // 图片预览关闭按钮样式
    .el-image-viewer__btn.el-image-viewer__close {
      left: 50%;
      top: 50%;
      transform: translate(400px, -300px);
      .el-icon-circle-close {
        color: #fff;
      }
    }

    // 图片预览样式
    .el-image-viewer__canvas {
      img {
        max-height: 600px !important;
        max-width: 800px !important;
      }
    }
  }
}

/* *
* webkit浏览器滚动条
* */
*::-webkit-scrollbar {
  width: 7px;
  height: 10px;
  background-color: transparent;
} /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
*::-webkit-scrollbar-track {
  background-color: #f0f6ff;
} /*定义滚动条轨道 内阴影+圆角*/
*::-webkit-scrollbar-thumb {
  background-color: rgba(144, 147, 153, 0.5);
  border-radius: 6px;
} /*定义滑块 内阴影+圆角*/
.scrollbarHide::-webkit-scrollbar {
  display: none;
}
.scrollbarShow::-webkit-scrollbar {
  display: block;
}
</style>
