<template>
  <div class="flex-left-container" :class="{ hide }">
    <div class="header">
      <h3>今日待办</h3>
    </div>
    <div class="body">
      <!-- <div v-for="(item, key) in navbars" :key="key" class="item" @click="$emit('clearProjectMarkers')"> -->
      <div v-for="(item, key) in navbars" :key="key" class="item">
        <div class="label">
          <span v-text="item.label"></span>
        </div>
        <div class="nums">
          <span class="num" v-text="item.num"></span>
          <span v-cloak>/{{ item.total }}</span>
        </div>
      </div>
    </div>

    <!-- 展示按钮 -->
    <div class="bt-show" @click="hide = false">
      <span>今日待办</span>
      <i class="el-icon-arrow-right"></i>
    </div>
    <!-- 隐藏按钮 -->
    <div class="bt-hide" @click="hide = true">
      <i class="el-icon-minus"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const user = this.$store.state.user.userInfo
    return {
      hide: false,
      user,
      navbars: {
        // 违规渣车
        carIllegal: {
          label: '违规渣车',
          num: 0,
          total: 0,
          url: '/carp/business/a/q/big/screen/car/illegal'
        },
        // 每日巡检
        todayCheck: {
          label: '每日巡检',
          num: 0,
          total: 0,
          url: '/carp/business/a/q/big/screen/today/check'
        },
        // 问题上报
        question: {
          label: '问题上报',
          num: 0,
          total: 0,
          url: '/carp/business/a/q/big/screen/question/report'
        }
      }
    }
  },

  methods: {
    getData() {
      Object.keys(this.navbars).forEach(key => {
        this.$http
          .get(this.navbars[key].url, {
            params: {
              areaCode: this.user.accountTypeDto.code
            }
          })
          .then(({ code, data }) => {
            if (code === 0) {
              this.navbars[key].num = data.overSum || 0
              this.navbars[key].total = data.allSum || 0
            } else {
              this.$message.error(`${this.navbars[key].label}统计数据获取失败`)
            }
          })
      })
    }
  },

  created() {
    this.getData()
  }
}
</script>

<style lang="less" scoped>
@import '../../style/color.less';
@import '../../style/size.less';
.flex-left-container {
  position: absolute;
  padding: 0.2rem 0;
  top: 50%;
  left: 0;
  width: 1.36rem;
  background-color: @white;
  box-shadow: @black-opcity 0 0 0.04rem;
  border-radius: 0 @radius-size @radius-size 0;
  transform: translate(0, -50%);

  .header {
    padding: 0 0.1rem 0.1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: @gray-light solid 1px;
    h3,
    p {
      margin: 0;
    }
    p {
      color: @primary;
    }
  }

  .body {
    margin-top: 0.08rem;
    .item {
      padding: 0.04rem 0.1rem;
      font-size: 0.14rem;
      &:hover {
        background: @gray-light;
        cursor: pointer;
      }
      .label {
        &::before {
          content: '';
          margin-right: 0.04rem;
          display: inline-block;
          padding: 0.03rem;
          border: @primary 0.03rem solid;
          border-radius: 50%;
        }
      }
      .nums {
        text-align: center;
        .num {
          font-size: 0.18rem;
          font-weight: 600;
          color: @primary;
        }
      }
    }
  }

  .bt-hide,
  .bt-show {
    position: absolute;
    cursor: pointer;
  }

  .bt-hide {
    right: 0.08rem;
    top: 0.06rem;
  }

  .bt-show {
    padding: 0.04rem 0.06rem;
    width: 0.2rem;
    top: 50%;
    right: 0;
    transform: translate(100%, -50%);
    background-color: #fff;
    border-radius: 0 @radius-size @radius-size 0;
    font-size: 0.16rem;
    display: none;
  }

  &.hide {
    width: 0;
    .header,
    .body,
    .bt-hide {
      display: none;
    }
    .bt-show {
      display: block;
    }
  }
}
</style>
