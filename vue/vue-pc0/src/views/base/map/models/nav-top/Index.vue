<template>
  <nav class="nav-wrap" :class="{ hide }">
    <!-- 工期状态 -->
    <el-popover class="popover" placement="bottom" width="200" trigger="hover">
      <div
        slot="reference"
        class="check-item"
        @click="
          points.projectState.check = !points.projectState.check
          $emit('renderMarkers')
        "
      >
        <el-badge :value="points.projectState.data.length" :class="{ check: points.projectState.check, blue: true }">
          <div>
            <i :class="points.projectState.icon"></i>
          </div>
        </el-badge>
        <span v-text="points.projectState.label"></span>
      </div>

      <div class="nav-wrap project-state-wrap" style="width:auto">
        <div
          v-for="(item, key) in points.projectState.state"
          :key="key"
          class="check-item"
          @click="
            $emit('loading', true)
            $http.get(`/carp/business/a/q/big/screen/project/state?state=${item.code}`).then(({ code, data }) => {
              if (code === 0) {
                points.projectState.check = true
                points.projectState.label = item.label
                points.projectState.data = data
                $emit('renderMarkers')
              } else {
                $message.error('请求失败')
              }
              $emit('loading', false)
            })
          "
        >
          <el-tag :type="item.type">
            <div>
              <i :class="points.projectState.icon"></i>
            </div>
          </el-tag>
          <span v-text="item.label"></span>
        </div>
      </div>
    </el-popover>

    <!-- 其他分类 -->
    <div
      v-for="(item, key) in points"
      :key="key"
      v-show="key !== 'projectState'"
      class="check-item"
      @click="
        item.check = !item.check
        $emit('renderMarkers')
      "
    >
      <el-badge :value="item.data.length" :class="`${item.theme} ${item.check ? ' check' : ''}`">
        <div :class="item.theme">
          <i :class="item.icon"></i>
        </div>
      </el-badge>
      <span v-text="item.label"></span>
    </div>

    <!-- 展示按钮 -->
    <div class="bt-show" @click="hide = false">
      <span>筛选条件</span>
      <i class="el-icon-arrow-down"></i>
    </div>
    <!-- 隐藏按钮 -->
    <div class="bt-hide" @click="hide = true">
      <i class="el-icon-arrow-up"></i>
    </div>
  </nav>
</template>

<script>
import { projectStateDict } from '@/libs/dict'
export default {
  name: 'navbar',
  data() {
    const user = this.$store.state.user.userInfo
    return {
      // 是否隐藏当前模块
      hide: false,
      // 当前登录用户
      user,
      // 覆盖点配置项
      points: {
        // 工期状态
        projectState: {
          label: '在建',
          icon: 'iconfont iconfont-yibinyangchenzhili-gongzuotaiicon-02-02',
          check: true,
          data: [],
          state: projectStateDict,
          theme: 'blue',
          url: '/carp/business/a/q/big/screen/project/state?state=742'
        },

        // 有联单
        electronic: {
          label: '有联单',
          icon: 'iconfont iconfont-yibinyangchenzhili-gongzuotaiicon-04',
          check: true,
          data: [],
          theme: 'green',
          url: '/carp/business/a/q/big/screen/electronic/project'
        },

        // 有车辆进入
        car: {
          label: '有车辆进入',
          icon: 'iconfont iconfont-yibinyangchenzhili-gongzuotaiicon-05',
          check: true,
          data: [],
          theme: 'green',
          url: '/carp/business/a/q/big/screen/recognition/project'
        },

        // 未点检
        notCheck: {
          label: '未点检',
          icon: 'iconfont iconfont-yibinyangchenzhili-gongzuotaiicon-09',
          check: true,
          data: [],
          theme: 'red',
          url: '/carp/business/a/q/big/screen/electronic/state?checkReviewed=0'
        },

        // 已点检
        check: {
          label: '已点检',
          icon: 'iconfont iconfont-yibinyangchenzhili-gongzuotaiicon-09',
          check: true,
          data: [],
          theme: 'blue',
          url: '/carp/business/a/q/big/screen/electronic/state?checkReviewed=1'
        },

        // 有方案
        dustPrograme: {
          label: '有扬尘方案',
          icon: 'iconfont iconfont-yibinyangchenzhili-gongzuotaiicon-03',
          check: true,
          data: [],
          theme: 'blue',
          url: '/carp/business/a/q/big/screen/dust/programme'
        },

        // 扬尘项目
        administer: {
          label: '扬尘项目',
          icon: 'iconfont iconfont-yibinyangchenzhili-gongzuotaiicon-03',
          check: true,
          data: [],
          theme: 'blue',
          url: '/carp/business/a/q/big/screen/dust/administer'
        },

        // 消纳场
        garbageStation: {
          label: '消纳场',
          icon: 'iconfont iconfont-lajitong',
          check: true,
          data: [],
          theme: 'blue',
          url: '/carp/business/a/q/garbage/station/gps/all'
        },

        // 公共区域
        publicArea: {
          label: '公共区域',
          icon: 'iconfont iconfont-gonggongquyu',
          check: true,
          data: [],
          theme: 'green',
          url: '/carp/business/a/q/public/area/page'
        }
      }
    }
  },

  methods: {
    // 获取数据
    getData() {
      this.$emit('loading', true)
      Promise.all(
        Object.keys(this.points).map(key => {
          return this.$http
            .get(this.points[key].url, {
              params: {
                areaCode: this.user.accountTypeDto.code
              }
            })
            .then(({ code, data }) => {
              if (code === 0) {
                this.points[key].data = data.records || data
              }
            })
        })
      )
        .then(() => {
          this.$emit('loading', false)
          this.$emit('renderMarkers')
        })
        .catch(() => {
          this.$emit('loading', false)
        })
    },

    // 清除覆盖物
    clear() {
      Object.keys(this.points).forEach(key => {
        this.points[key].check = false
      })
    }
  },

  created() {
    // 获取数据
    this.getData()

    // 上报覆盖物数据
    this.$emit('markerPoints', this.points)
  }
}
</script>

<style lang="less" scoped>
@import '../../style/color.less';
@import '../../style/size.less';
.nav-wrap {
  position: absolute;
  top: 0;
  left: 50%;
  display: inline-flex;
  justify-content: space-around;
  align-items: center;
  transform: translate(-50%, 0);
  height: auto;
  width: 8rem;
  background-color: @white;
  box-shadow: @black-opcity 0 0.04rem 0.08rem;
  border-radius: 0 0 @radius-size @radius-size;
  transition-duration: 600ms;

  .check-item {
    margin: 0.12rem 0;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    width: 1rem;
    white-space: nowrap;
    user-select: none;
    color: @black;
    cursor: pointer;

    & > div {
      margin-bottom: 0.06rem;
      padding: 0.02rem;
      border: #ccc solid 1px;
      border-radius: @radius-size;
      background-color: rgba(204, 204, 204, 0.2);
      color: #ccc;
      &.check {
        border: solid 1px;
        &.blue {
          background-color: rgba(66, 133, 244, 0.2);
          border-color: rgba(66, 133, 244, 1);
          color: rgba(66, 133, 244, 1);
        }
        &.green {
          background-color: rgba(50, 234, 203, 0.2);
          border-color: #32eacb;
          color: #32eacb;
        }
        &.red {
          background-color: rgba(233, 62, 62, 0.2);
          border-color: #e93e3e;
          color: #e93e3e;
        }
      }
    }
  }

  .bt-hide,
  .bt-show {
    position: absolute;
    bottom: 0;
    padding: 0.04rem 0.2rem;
    background-color: @white;
    transform: translateY(100%);
    border-radius: 0 0 @radius-size @radius-size;
    cursor: pointer;
    display: none;
  }

  &:hover {
    .bt-hide {
      display: block;
    }
  }

  &.hide {
    height: 0;
    .popover,
    .check-item,
    .bt-hide {
      display: none;
    }
    .bt-show {
      display: block;
    }
  }
}

.project-state-wrap {
  .check-item {
    margin: 0.12rem 0.04rem;
  }
}

.iconfont {
  font-size: 0.24rem;
}
</style>
