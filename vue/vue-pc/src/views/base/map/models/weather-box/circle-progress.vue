<template>
  <div class="circle-progress-wrap">
    <div class="icon">
      <svg class="icon" width="70" height="70" style="stroke-dasharray:201">
        <circle cx="35" cy="35" r="26" :fill="color || lastColor" :style="{ transitionDuration: '2000ms' }" />
        <circle cx="35" cy="35" r="32" stroke="#eee" stroke-width="3" fill="none" />
        <circle
          cx="35"
          cy="35"
          r="32"
          :stroke="color || lastColor"
          stroke-width="3"
          fill="none"
          :style="{ strokeDashoffset: ((total - value) / total) * 201, transitionDuration: '2000ms' }"
        />
        <circle cx="35" cy="35" r="32" :stroke="backgroundColor || '#fff'" stroke-width="4" fill="none" style="stroke-dasharray:3,6" />
      </svg>
      <div class="text"><span v-text="value"></span></div>
    </div>
    <div class="label">
      <span v-text="`${label}${unit ? `(${unit})` : ''}`"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'circle-progress',
  props: {
    // 当前值
    value: {
      type: (() => Number | String)(),
      default: 0
    },
    // 总长度
    total: {
      type: (() => Number | String)(),
      default: 100
    },
    // 单位
    unit: {
      type: String,
      default: ''
    },
    // 描述
    label: String,
    color: String,
    // 背景色
    backgroundColor: String,
    // 动态颜色
    dynamicColor: Object
  },
  data() {
    return {
      // 最终色
      lastColor: '#409EFF'
    }
  },
  watch: {
    value(value) {
      // 若传入动态颜色,则匹配颜色
      if (this.dynamicColor) {
        let fields = Object.keys(this.dynamicColor).sort((a, b) => a - b)
        fields.forEach((filed, index) => {
          if (value >= filed && value < fields[index + 1]) {
            this.lastColor = this.dynamicColor[filed]
          }
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '../../style/color.less';
@import '../../style/size.less';
.circle-progress-wrap {
  flex: auto;
  text-align: center;
  .icon {
    position: relative;
    svg {
      transform: scale(-1, -1) rotatez(-48deg);
    }
    .text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #ffffff;
    }
  }
  .label {
    font-size: 0.14rem;
    color: @black;
  }
}
</style>
