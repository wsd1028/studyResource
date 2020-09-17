<template>
  <common-table-control
    :form-config="form"
    :allow-add="false"
    :allow-delete="false"
    :allow-edit="false"
    :search-url="searchPath"
    :show-control="false"
    :filters="filters"
    class="table-control"
  ></common-table-control>
</template>

<script>
import commonTableControl from '@/components/CommonTableControl'
export default {
  name: 'dustHistoryData',
  data() {
    return {
      form: {
        label: {
          sn: {
            label: '设备序列号'
          },

          pm10: {
            label: 'pm10',
            data: (data, row) => {
              // 值为无效值返回空字符串
              if (!data) return ''

              // 均值接口为小时均值以上/国控值为非有效值则不比对
              if (
                ![
                  '/carp/device/a/q/dust/data/avg/history/minute',
                  '/carp/device/a/q/dust/data/avg/history/twentyMinute',
                  '/carp/device/a/q/dust/data/avg/history/hour'
                ].includes(this.searchUrl) ||
                !row.pm10Monitor
              ) {
                return `<span style="color:#67C23A">${data}</span>`
              }

              let color = '#67C23A'
              // 国控值大于一百,当前值超过国控值的1.2倍标红
              if (300 > row.pm10Monitor > 100 && data > row.pm10Monitor * 1.2) {
                color = '#F56C6C'
              }
              // 国控值小于等于一百,当前值超过国控值20标红
              if (row.pm10Monitor <= 100 && data > row.pm10Monitor + 20) {
                color = '#F56C6C'
              }
              return `<span style="color:${color}">${data}</span>`
            }
          },

          pm10Monitor: {
            label: '国控pm10',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },

          pm25: {
            label: 'pm25',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },

          pm25Monitor: {
            label: '国控pm25',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },

          voice: {
            label: '噪声值',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },

          voiceMonitor: {
            label: '国控噪音值',
            data: (data, row) => {
              if (data) return data
              let result = 0
              let currentTime = new Date(row.createDate).getHours
              if (currentTime > 22 || currentTime < 6) {
                result = 55
              } else {
                result = 70
              }
              return `<span style="color:#67C23A">${result}</span>`
            }
          },

          temperature: {
            label: '温度',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },

          humidity: {
            label: '湿度',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },

          windDirection: {
            label: '风向',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },

          windSpeed: {
            label: '风速',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },

          createDate: {
            label: '创建时间'
          }
        }
      },

      filters: {
        // 均值
        avgType: {
          label: '均值类型',
          type: 'select',
          real: false,
          item: [
            {
              label: '实时值',
              code: '/carp/device/a/q/dust/data/avg/history/minute'
            },
            {
              label: '二十分钟均值',
              code: '/carp/device/a/q/dust/data/avg/history/twentyMinute'
            },
            {
              label: '小时均值',
              code: '/carp/device/a/q/dust/data/avg/history/hour'
            },
            {
              label: '天均值',
              code: '/carp/device/a/q/dust/data/avg/history/day'
            },
            {
              label: '月均值',
              code: '/carp/device/a/q/dust/avg/month/page'
            },
            {
              label: '年均值',
              code: '/carp/device/a/q/dust/avg/year/page'
            },
            {
              label: '昼均值',
              code: '/carp/device/a/q/dust/data/avg/history/daytime'
            },
            {
              label: '夜均值',
              code: '/carp/device/a/q/dust/data/avg/history/night'
            }
          ],
          change: url => {
            this.url = url
          },
          value: this.searchUrl
        },

        // 开始时间
        startTime: {
          label: '开始时间',
          type: 'date',
          clearable: false,
          show: true,
          real: true,
          value: this.$moment(new Date(Date.now() - 24 * 60 * 60 * 1000)).format('YYYY-MM-DD HH:mm:ss'),
          manualFlush: true,
          change: (startTime, flush) => {
            let h24 = 24 * 60 * 60 * 1000
            startTime = new Date(startTime).getTime()
            let endTime = new Date(this.filters.endTime.value).getTime()
            if (endTime - startTime > h24) {
              this.filters.endTime.value = this.$moment(startTime + h24).format('YYYY-MM-DD HH:mm:ss')
            }
            if (startTime > endTime) {
              this.filters.startTime.value = this.$moment(endTime).format('YYYY-MM-DD HH:mm:ss')
            }
            flush()
          }
        },

        // 结束时间
        endTime: {
          label: '结束时间',
          name: '-',
          type: 'date',
          clearable: false,
          show: true,
          real: true,
          value: this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          manualFlush: true,
          change: (endTime, flush) => {
            let h24 = 24 * 60 * 60 * 1000
            let startTime = new Date(this.filters.startTime.value).getTime()
            endTime = new Date(endTime).getTime()
            // 结束时间大于当前时间时设置结束时间为当前时间
            if (endTime > Date.now()) {
              this.filters.endTime.value = this.$moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
              endTime = Date.now()
            }
            if (endTime < startTime) {
              this.filters.endTime.value = this.$moment(startTime).format('YYYY-MM-DD HH:mm:ss')
            }
            if (endTime - startTime > h24) {
              this.filters.startTime.value = this.$moment(endTime - h24).format('YYYY-MM-DD HH:mm:ss')
            }
            flush()
          }
        }
      },

      url: this.searchUrl
    }
  },
  computed: {
    searchPath() {
      return `${this.url}?sn=${this.dustData.sn}`
    }
  },
  props: {
    searchUrl: String,
    dustData: Object,
    close: Function
  },
  watch: {
    url(url) {
      let dateFilterShow = url === '/carp/device/a/q/dust/data/avg/history/minute'
      this.filters.startTime.show = this.filters.startTime.real = this.filters.endTime.show = this.filters.endTime.real = dateFilterShow
    }
  },
  components: {
    commonTableControl
  }
}
</script>

<style lang="less" scoped>
.table-control {
  overflow: hidden !important;
  display: block;
  margin: -30px -20px;
  height: 68vh;
}
</style>
