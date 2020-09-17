<template>
  <div class="container">
    <common-table-control
      :formConfig="form"
      :searchUrl="searchUrl"
      :allow-add="false"
      :allow-delete="false"
      :allow-edit="false"
      :filters="filters"
      :bind-buttons="[{ label: '历史数据', key: 'history' }]"
      @bindButtonClick="
        dustData = $event.row
        dustHistoryDataShow = true
      "
    >
    </common-table-control>

    <el-dialog v-if="dustHistoryDataShow" :visible="true" top="10vh" width="90%" @close="dustHistoryDataShow = false">
      <div slot="title">
        <span>扬尘历史数据</span>
        <el-tag size="mini" type="success" v-text="dustData.fixedSourceName"></el-tag>
      </div>
      <dust-history-data
        :dust-data="dustData"
        :search-url="historySearchUrl"
        :close="
          () => {
            dustHistoryDataShow = false
          }
        "
      ></dust-history-data>
    </el-dialog>
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import dustHistoryData from './DustHistoryData'
export default {
  data() {
    const user = this.$store.state.user.userInfo
    return {
      // 当前登录用户
      user,

      // 历史数据弹窗显示控制器
      dustHistoryDataShow: false,

      // 当前点击的扬尘数据
      dustData: {},

      // 分页请求地址
      searchUrl: null,

      // 表单配置
      form: {
        // 表单数据
        data: {},
        // 表格标题
        label: {
          sn: {
            label: '设备号',
            width: 100
          },
          fixedSourceName: {
            label: '固定源名称',
            width: 120
          },
          fixedSourceType: {
            label: '固定源类型',
            type: 'select',
            props: { label: 'name', code: 'id' },
            item: [],
            width: 90
          },
          pm25: {
            label: 'PM2.5',
            width: 78,
            sortable: true,
            sortBy: 'pm25',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },
          pm25Monitor: {
            label: '国控pm25值',
            width: 110,
            sortable: true,
            sortBy: 'pm25Monitor',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },
          pm10: {
            label: 'PM10',
            width: 74,
            sortable: true,
            sortBy: 'pm10',
            data: (data, row) => {
              // 值为无效值返回空字符串
              if (!data) return ''

              // 均值接口为小时均值以上/国控值为非有效值则不比对
              if (
                !['/carp/device/a/q/dust/data/avg/real', '/carp/device/a/q/dust/data/avg/twentyMinute', '/carp/device/a/q/dust/data/avg/oneHour'].includes(
                  this.searchUrl
                ) ||
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
            label: '国控pm10值',
            width: 110,
            sortable: true,
            sortBy: 'pm10Monitor',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },
          voice: {
            label: '噪声值',
            width: 78,
            sortable: true,
            sortBy: 'voice',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },
          voiceMonitor: {
            label: '国控噪声值',
            width: 100,
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
            },
            sortable: true,
            sortBy: 'voiceMonitor'
          },
          temperature: {
            label: '温度',
            width: 66,
            sortable: true,
            sortBy: 'temperature',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },
          humidity: {
            label: '湿度',
            width: 66,
            sortable: true,
            sortBy: 'humidity',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },
          windSpeed: {
            label: '风速',
            width: 66,
            sortable: true,
            sortBy: 'windSpeed',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },
          windDirection: {
            label: '风向',
            width: 66,
            sortable: true,
            sortBy: 'windDirection',
            data: data => `<span style="color:#67C23A">${data || ''}</span>`
          },
          online: {
            label: '在线状态',
            colType: 'tag',
            item: [
              { label: '在线', code: true, type: 'success' },
              { label: '离线', code: false, type: 'danger' }
            ]
          },
          createDate: {
            label: '创建时间',
            width: 160
          }
        }
      },

      // 筛选器
      filters: {
        // 接入厂商id
        agentId: {
          show: false,
          value: [90].includes(this.$userType) ? user.accountTypeDto.ancillaryId : null
        },
        // 设备厂商id
        manufacturerId: {
          show: false,
          value: [80].includes(this.$userType) ? user.accountTypeDto.ancillaryId : null
        },
        // 地区
        areaCode: {
          label: '选择地区',
          type: 'area',
          props: { code: 'code' },
          area: (() => {
            let areaTree = []
            this.$getAreaTree(user.accountTypeDto.code, tree => {
              areaTree = [tree]
            })
            return areaTree
          })(),
          value: [0, 50].includes(this.$userType) ? user.accountTypeDto.code : null
        },
        // 均值
        avgType: {
          label: '均值类型',
          type: 'select',
          real: false,
          item: [
            {
              label: '实时值',
              code: '/carp/device/a/q/dust/data/avg/real',
              history: '/carp/device/a/q/dust/data/avg/history/minute'
            },
            {
              label: '二十分钟均值',
              code: '/carp/device/a/q/dust/data/avg/twentyMinute',
              history: '/carp/device/a/q/dust/data/avg/history/twentyMinute'
            },
            {
              label: '小时均值',
              code: '/carp/device/a/q/dust/data/avg/oneHour',
              history: '/carp/device/a/q/dust/data/avg/history/hour'
            },
            {
              label: '天均值',
              code: '/carp/device/a/q/dust/data/avg/day',
              history: '/carp/device/a/q/dust/data/avg/history/day'
            },
            {
              label: '月均值',
              code: '/carp/device/a/q/dust/avg/month/page',
              history: '/carp/device/a/q/dust/avg/month/page'
            },
            {
              label: '年均值',
              code: '/carp/device/a/q/dust/avg/year/page',
              history: '/carp/device/a/q/dust/avg/year/page'
            },
            {
              label: '昼均值',
              code: '/carp/device/a/q/dust/data/avg/daytime',
              history: '/carp/device/a/q/dust/data/avg/history/daytime'
            },
            {
              label: '夜均值',
              code: '/carp/device/a/q/dust/data/avg/night',
              history: '/carp/device/a/q/dust/data/avg/history/night'
            }
          ],
          change: url => {
            this.searchUrl = url
          },
          value: '/carp/device/a/q/dust/data/avg/real'
        },
        // 固定源类型
        fixedSourceType: {
          label: '固定源类型',
          type: 'select',
          props: { label: 'name', code: 'id' },
          item: (() => {
            this.$http.get('/carp/business/a/q/dict/category/fixed_source_type').then(({ code, data }) => {
              if (code === 0) {
                this.form.label.fixedSourceType.item = data
                this.filters.fixedSourceType.item = [{ name: '全部', id: null }].concat(data)
                this.searchUrl = '/carp/device/a/q/dust/data/avg/real'
              }
            })
            return []
          })(),
          value: null
        },
        // 固定源名称
        fixedSourceName: {
          label: '根据固定源名称搜索',
          type: 'search',
          showBt: false,
          value: null
        },
        // 设备号
        sn: {
          label: '设备号搜索',
          type: 'search',
          value: null
        }
      }
    }
  },
  computed: {
    // 历史均值分页请求地址
    historySearchUrl() {
      let code = this.filters.avgType.value
      let historySearchUrl = null
      this.filters.avgType.item.forEach(item => {
        if (item.code === code) {
          historySearchUrl = item.history
        }
      })
      return historySearchUrl
    }
  },
  components: {
    commonTableControl,
    dustHistoryData
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/common';
.container {
  flex: auto;
  height: 0;
  @flex-column();
}
</style>
