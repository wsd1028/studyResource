<template>
  <div class="flex-right-container" :class="{ hide }">
    <div class="flex-right-content">
      <h3 class="title">
        <span v-text="title"></span>
      </h3>

      <!-- AQI PM10统计 -->
      <div class="aqi-pm10-wrap">
        <div class="aqi-wrap">
          <div class="icon">
            <svg class="icon" width="70" height="70" style="stroke-dasharray:201">
              <circle cx="35" cy="35" r="26" fill="#fbd029" />
              <circle cx="35" cy="35" r="32" stroke="#eee" stroke-width="3" fill="none" />
              <circle
                cx="35"
                cy="35"
                r="32"
                stroke="#fbd029"
                stroke-width="3"
                fill="none"
                :style="{ strokeDashoffset: ((150 - aqi.data) / 150) * 201, transitionDuration: '2000ms' }"
              />
              <circle cx="35" cy="35" r="32" stroke="#fff" stroke-width="4" fill="none" style="stroke-dasharray:3,6" />
            </svg>
            <div class="text"><span v-text="aqi.data"></span></div>
          </div>
          <div class="label">
            <span>AQI</span>
          </div>
        </div>
        <div class="pm10-wrap">
          <div class="icon">
            <svg class="icon" width="70" height="70" style="stroke-dasharray:201">
              <circle cx="35" cy="35" r="26" fill="#1a91fa" />
              <circle cx="35" cy="35" r="32" stroke="#d4d4d4" stroke-width="3" fill="none" />
              <circle
                cx="35"
                cy="35"
                r="32"
                stroke="#1a91fa"
                stroke-width="3"
                fill="none"
                :style="{ strokeDashoffset: ((100 - pm10.data) / 100) * 201, transitionDuration: '2000ms' }"
              />
              <circle cx="35" cy="35" r="32" stroke="#fff" stroke-width="4" fill="none" style="stroke-dasharray:3,6" />
            </svg>
            <div class="text"><span v-text="pm10.data"></span></div>
          </div>
          <div class="label">
            <span>PM10</span>
          </div>
        </div>
        <div class="more">
          <el-tooltip class="item" effect="dark" content="更多数据" placement="top">
            <span class="more-bt el-icon-cloudy-and-sunny" @click="$emit('open-weather-box')"></span>
          </el-tooltip>
        </div>
      </div>

      <!-- 固定源/履职率 -->
      <div class="model-item percentage">
        <!-- 头部 -->
        <div class="header">
          <div class="title">
            <span class="label">固定源</span><span class="num">/{{ projects }}</span>
          </div>
          <div class="more">
            <el-link
              @click="
                $router.push({ name: 'project' })
                $store.commit('selectMenu', 'project')
              "
              style="text-decoration:none"
              >查看全部</el-link
            >
          </div>
        </div>

        <!-- 今日履职率 -->
        <div class="body">
          <div v-for="(item, key) in percentage" :key="key" class="item">
            <div class="label">
              <span v-text="item.label"></span>
              <span class="num" v-text="item.num"></span>
            </div>
            <div class="progress">
              <div class="progress-bar" :style="{ width: item.num }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 移动源 -->
      <div class="model-item dynamic">
        <!-- 头部 -->
        <div class="header">
          <div class="title">
            <span class="label">移动源</span>
          </div>
        </div>

        <!-- 今日履职率 -->
        <div class="body">
          <div class="item gps">
            <div class="title"><span>GPS</span></div>
            <div class="value-wrap online">
              <div class="value">
                <div class="code green"><span v-text="gpsPercentage.onlinePercentage"></span></div>
                <div class="label"><span>在线率</span></div>
              </div>
            </div>
            <div class="value-wrap">
              <div class="value local" :style="{ flex: gpsPercentage.localCarNum }">
                <div class="code blue"><span v-text="gpsPercentage.localCarNum"></span></div>
                <div class="label"><span>本地车</span></div>
              </div>
              <div class="value remote" :style="{ flex: gpsPercentage.foreignCarNum }">
                <div class="code warning"><span v-text="gpsPercentage.foreignCarNum"></span></div>
                <div class="label"><span>外地车</span></div>
              </div>
            </div>
          </div>
          <div class="item road">
            <div class="title"><span>卡口</span></div>
            <div class="value-wrap">
              <div class="value local" :style="{ flex: road.localCarNum }">
                <div class="code blue"><span v-text="road.localCarNum"></span></div>
                <div class="label"><span>本地车</span></div>
              </div>
              <div class="value remote" :style="{ flex: road.foreignCarNum }">
                <div class="code warning"><span v-text="road.foreignCarNum"></span></div>
                <div class="label"><span>外地车</span></div>
              </div>
              <div class="value local" :style="{ flex: road.unknownCarNum }">
                <div class="code blue-light"><span v-text="road.unknownCarNum"></span></div>
                <div class="label"><span>非名录</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 综合处置 -->
      <div class="model-item unified">
        <!-- 头部 -->
        <div class="header">
          <div class="title">
            <span class="label">综合处置</span>
          </div>
        </div>

        <!-- 电子联单/运输方量 -->
        <div class="body">
          <div v-for="(item, key) in unified" :key="key" class="item">
            <div :style="{ backgroundColor: item.backgroundColor }">
              <div class="label">
                <span v-cloak>-{{ item.label }}-</span>
              </div>
              <div class="num" :style="{ color: item.color }" v-cloak>{{ item.num + item.unit }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 其余数据统计 -->
      <div class="model-item other">
        <div v-for="(item, key) in other" :key="key" class="item" @click="item.click && item.click()">
          <div class="num">
            <span v-text="item.num"></span>
          </div>
          <div class="label">
            <span v-text="item.label"></span>
          </div>
        </div>
      </div>

      <!-- 隐藏按钮 -->
      <div class="bt-hide" @click="hide = true">
        <i class="el-icon-minus"></i>
      </div>
    </div>

    <!-- 展示按钮 -->
    <div
      class="bt-show"
      @click="
        $emit('close-details-window')
        hide = false
      "
    >
      <span v-text="title"></span>
      <i class="el-icon-arrow-left"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    const user = this.$store.state.user.userInfo
    return {
      // 标题
      title: (() => {
        let area = {}
        this.$getAreaTree(user.accountTypeDto.code, res => (area = res))
        return `今日${area.name || '数据'}`
      })(),

      // 弹出按钮控制器
      hide: false,

      // 当前登录用户
      user,

      // aqi数据
      aqi: {
        data: 0 /* parseInt(Math.random() * 5 + 48) */
      },
      // pm10数据
      pm10: {
        data: 0 /* parseInt(Math.random() * 5 + 50) */,
        // 获取空气质量数据
        getAirData: (() => {
          this.$getWeather().then(({ aqi }) => {
            this.aqi.data = aqi.city.aqi
            this.pm10.data = aqi.city.pm10
          })
        })()
      },

      // 移动源gps统计
      gpsPercentage: {
        onlinePercentage: '0.0%',
        localCarNum: 0,
        foreignCarNum: 0
      },
      // 移动源卡口统计
      road: {
        unknownCarNum: 0,
        foreignCarNum: 0,
        localCarNum: 0
      },

      // 履职率
      projects: 0,
      percentage: {
        todayPercentage: {
          label: '今日履职率',
          num: '0%'
        },
        weekPercentage: {
          label: '本周履职率',
          num: '0%'
        },
        monthPercentage: {
          label: '本月履职率',
          num: '0%'
        }
      },

      // 综合处置
      unified: {
        electronic: {
          label: '电子联单',
          num: '0',
          unit: '件',
          color: '#ffa91e',
          backgroundColor: '#ffefd4',
          url: '/carp/business/a/q/big/screen/today/electronic'
        },
        electronicViolation: {
          label: '违规联单',
          num: '0',
          unit: '件',
          color: '#2ecb37',
          backgroundColor: '#c6f4c8',
          url: '/carp/business/a/q/big/screen/today/violation'
        },
        transport: {
          label: '运输方量',
          num: '0',
          unit: '方',
          color: '#1a9efa',
          backgroundColor: '#d9edff',
          url: '/carp/business/a/q/big/screen/today/transport'
        },
        report: {
          label: '申述联单',
          num: '0',
          unit: '单',
          color: '#ff5863',
          backgroundColor: '#ffdbdd'
        }
      },

      // 其余数据
      other: {
        AllAccountNum: {
          label: '人员',
          num: 0,
          click: () => {
            this.$emit('user-list-show')
          }
        },
        garbage: {
          label: '消纳',
          num: 0,
          url: '/carp/business/a/q/big/screen/today/garbage',
          click: () => {
            this.$router.push({ name: 'savespace' })
            this.$store.commit('selectMenu', 'savespace')
          }
        },
        project: {
          label: '项目',
          num: 0,
          url: '/carp/business/a/q/big/screen/today/project',
          click: () => {
            this.$router.push({ name: 'project' })
            this.$store.commit('selectMenu', 'project')
          }
        },
        dustManu: {
          label: '扬尘监测',
          num: 0
        },
        platenum: {
          label: '车牌识别',
          num: 0,
          url: '/carp/business/a/q/big/screen/today/license'
        },
        intersection: {
          label: '道路卡口',
          num: 0,
          url: '/carp/business/a/q/big/screen/today/road'
        },
        TodayAccountNum: {
          label: 'APP注册',
          num: 0
        },
        dailyAmount: {
          label: 'APP日活',
          num: 0,
          url: '/carp/business/a/q/manage/center/dailyAmount'
        },
        UserOnline: {
          label: 'APP在线',
          num: 0
        }
      }
    }
  },

  methods: {
    getData() {
      // 获取固定源
      this.$http
        .get('/carp/business/a/q/big/screen/project/number/742', {
          params: {
            areaCode: this.user.accountTypeDto.code
          }
        })
        .then(({ code, data, message }) => {
          if (code === 0) {
            this.projects = data
          } else {
            this.$message.error(`获取固定源统计失败 code:${code} message:${message}`)
          }
        })

      // 获取移动源GPS数据
      this.$http
        .get('/carp/business/a/q/car/gps/getGpsPercentage', {
          params: {
            areaCode: this.user.accountTypeDto.code
          }
        })
        .then(({ code, data }) => {
          if (code === 0) {
            Object.keys(data).forEach(key => {
              this.gpsPercentage[key] = data[key]
            })
          }
        })

      // 获取移动源道路卡口数据
      this.$http
        .get('/carp/business/a/q/license/record/getCarNum', {
          params: {
            areaCode: this.user.accountTypeDto.code
          }
        })
        .then(({ code, data }) => {
          if (code === 0) {
            Object.keys(data).forEach(key => {
              this.road[key] = data[key]
            })
          }
        })

      // 获取履职率
      this.$http
        .get('/carp/business/a/q/big/screen/work/percentage', {
          params: {
            areaCode: this.user.accountTypeDto.code
          }
        })
        .then(({ code, data, message }) => {
          if (code === 0) {
            Object.keys(this.percentage).forEach(key => {
              this.percentage[key].num = (data[key] * 100).toFixed(2) + '%'
            })
          } else {
            this.$message.error(`获取履职率失败 code:${code} message:${message}`)
          }
        })

      // 获取综合处置
      Object.keys(this.unified).forEach(key => {
        if (!this.unified[key].url) return
        this.$http
          .get(this.unified[key].url, {
            params: {
              areaCode: this.user.accountTypeDto.code
            }
          })
          .then(({ code, data }) => {
            if (code === 0) {
              this.unified[key].num = data
            } else {
              this.$message.error(`${this.unified[key].label}统计数据请求失败`)
            }
          })
      })

      // 获取其余数据统计
      this.$http
        .get('/carp/auth/a/q/account/account/num', {
          params: {
            areaCode: this.user.accountTypeDto.code
          }
        })
        .then(({ code, data }) => {
          if (code === 0) {
            Object.keys(data).forEach(key => {
              this.other[key].num = data[key]
            })
          }
        })
      ;['garbage', 'project', 'platenum', 'intersection', 'dailyAmount'].forEach(key => {
        if (!this.other[key].url) return
        this.$http
          .get(this.other[key].url, {
            params: {
              areaCode: this.user.accountTypeDto.code
            }
          })
          .then(({ code, data }) => {
            if (code === 0) {
              if (this.other[key].data) {
                this.other[key].num = this.other[key].data(data)
              } else {
                this.other[key].num = data
              }
            } else {
              this.$message.error(`${this.other[key].label}统计数据请求失败`)
            }
          })
      })
    }
  },

  created() {
    // 获取本周履职率
    this.getData()
  }
}
</script>

<style lang="less" scoped>
@import '../../style/color.less';
@import '../../style/size.less';
.flex-right-container {
  position: absolute;
  padding: 0.14rem 0;
  top: 50%;
  right: 0.46rem;
  height: 766px;
  max-height: 100%;
  width: 2.8rem;
  background-color: @white;
  box-shadow: @black-opcity 0 0 0.04rem;
  border-radius: @radius-size;
  transform: translate(0, -50%);

  .flex-right-content {
    height: 100%;
    overflow: hidden auto;
  }

  h3.title {
    font-size: 0.16rem;
    padding: 0 0.18rem;
    margin: 0;
  }

  .bt-hide,
  .bt-show {
    position: absolute;
    cursor: pointer;
  }

  .bt-show {
    padding: 0.04rem 0.06rem;
    display: none;
    width: 0.2rem;
    top: 50%;
    right: -0.8rem;
    transform: translate(-100%, -50%);
    background-color: #fff;
    border-radius: @radius-size 0 0 @radius-size;
    font-size: 0.16rem;
  }
  .bt-hide {
    right: 0.2rem;
    top: 0.2rem;
  }

  &.hide {
    width: 0;
    h3.title,
    .model-item,
    .aqi-pm10-wrap,
    .bt-hide {
      display: none;
    }
    .bt-show {
      display: block;
    }
  }
}

// aqi pm10统计
.aqi-pm10-wrap {
  margin-top: 0.1rem;
  padding-bottom: 0.1rem;
  border-bottom: @gray-light 1px solid;
  display: flex;
  flex-flow: row wrap;
  & > div {
    flex: auto;
    width: 50%;
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
  .more {
    margin-top: -0.3rem;
    width: 100%;
    font-size: 0.24rem;
    color: @gray;
    .more-bt {
      display: inline-block;
      &:hover {
        color: @primary;
        cursor: pointer;
      }
    }
  }
}

.model-item {
  padding: 0.1rem 0.18rem 0.12rem;
  border-bottom: @gray-light 1px solid;

  .header {
    display: flex;
    justify-content: space-between;

    .title {
      font-size: 0.15rem;
      &::before {
        content: '';
        margin-right: 0.04rem;
        display: inline-block;
        padding: 0.03rem;
        border: 0.03rem solid;
        border-radius: 50%;
      }
      .label {
        font-weight: 900;
      }
    }
    .more {
      color: @gray;
    }
  }
}

// 履职率
.percentage {
  .header {
    .title {
      &::before {
        border-color: @primary;
      }
    }
  }

  .body {
    .item {
      margin-top: 0.1rem;
      .label {
        font-size: 0.14rem;
        color: gray;
        display: flex;
        justify-content: space-between;

        .num {
          color: @black;
          font-size: 0.15rem;
          font-weight: 600;
        }
      }
      .progress {
        position: relative;
        margin-top: 0.06rem;
        &::before {
          content: '';
          display: block;
          height: 0.06rem;
          background-color: @danger;
          opacity: 0.6;
        }
        .progress-bar {
          content: '';
          position: absolute;
          top: 0;
          display: block;
          height: 100%;
          background-color: @danger;
        }
      }
    }
  }
}

// 移动源
.dynamic {
  .header {
    .title {
      &::before {
        border-color: @danger;
      }
    }
  }

  .body {
    font-size: 0.14rem;
    & > .item {
      display: flex;
      align-items: flex-start;
      margin: 0.1rem 0;
      .value-wrap {
        margin-left: 0.04rem;
        display: flex;
        flex: 1;
        width: 0;
        align-items: center;
        &.online {
          flex: none;
          width: auto;
        }
        .value {
          .label,
          .code {
            white-space: nowrap;
            text-align: center;
          }
          .label {
            color: @gray;
          }
          .code {
            background: @warning;
            color: #ffffff;
            &.green {
              background: @success;
            }
            &.blue {
              background: @primary;
            }
            &.warning {
              background-color: @warning;
            }
            &.blue-light {
              background-color: @blue-light;
            }
          }
        }
        .value:first-of-type {
          .code {
            border-top-left-radius: 0.06rem;
            border-bottom-left-radius: 0.06rem;
          }
        }
        .value:last-of-type {
          .code {
            border-top-right-radius: 0.06rem;
            border-bottom-right-radius: 0.06rem;
          }
        }
      }
    }
  }
}

// 综合处置
.unified {
  .header {
    .title {
      &::before {
        border-color: @warning;
      }
    }
  }

  .body {
    display: flex;
    flex-flow: row wrap;
    padding: 0.06rem 0;
    .item {
      box-sizing: border-box;
      padding: 0.04rem;
      width: 50%;
      text-align: center;
      & > div {
        padding: 0.04rem 0;
        border-radius: @radius-size;
        .label {
          font-size: 0.14rem;
          color: @gray;
        }
        .num {
          font-size: 0.16rem;
        }
      }
    }
  }
}

// 其余数据
.other {
  display: flex;
  flex-flow: row wrap;
  border: none;
  .item {
    margin-top: 0.06rem;
    box-sizing: border-box;
    width: 33.33333333%;
    text-align: center;
    .label {
      font-size: 0.14rem;
      color: @gray;
    }
    .num {
      font-size: 0.16rem;
      font-weight: 600;
    }

    &:hover {
      cursor: pointer;
      &,
      & .label {
        color: @primary;
      }
    }
  }
}
</style>
