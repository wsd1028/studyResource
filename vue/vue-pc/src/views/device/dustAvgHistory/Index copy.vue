<template>
  <div class="container">
    <common-table-control
      :formConfig="form"
      :addUrl="addUrl"
      addDescription="设备登记"
      :delUrl="delUrl"
      :editUrl="editUrl"
      :searchUrl="searchUrl"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :filters="filters"
    ></common-table-control>
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
export default {
  data() {
    // 表操作权限
    const uri = this.$store.state.tab.currentMenu ? this.$store.state.tab.currentMenu.uri : ''
    const tablePermission = {
      add: false,
      del: false,
      edit: false
    }
    Object.keys(tablePermission).forEach(key => {
      // 添加按钮权限验证
      this.$permission(`${uri}_${key}`).then(({ data }) => {
        tablePermission[key] = data
      })
    })
    return {
      // 表操作权限
      tablePermission,
      // 表单配置
      form: {
        // 表单数据
        data: {},
        // 表格标题
        label: {
          sn: {
            label: '设备号',
            width: 200
          },
          temperature: {
            label: '温度',
            width: 60,
            sortable: true,
            sortBy: 'temperature'
          },
          humidity: {
            label: '湿度',
            width: 60,
            sortable: true,
            sortBy: 'humidity'
          },
          windSpeed: {
            label: '风速',
            width: 60,
            sortable: true,
            sortBy: 'windSpeed'
          },
          windDirection: {
            label: '风向',
            width: 60,
            sortable: true,
            sortBy: 'windDirection'
          },
          avgNoise: {
            label: '噪声平均值',
            sortable: true,
            sortBy: 'avgNoise'
          },
          avgPm10: {
            label: 'PM10平均值',
            sortable: true,
            sortBy: 'avgPm10'
          },
          avgPm2p5: {
            label: 'PM2.5平均值',
            sortable: true,
            sortBy: 'avgPm2p5'
          },
          beginTime: {
            label: '数据发生时间',
            width: 220
          }
        }
      },
      addUrl: '/carp/device/a/q/dust/avg/history',
      delUrl: '/carp/device/a/q/dust/avg/history',
      editUrl: '/carp/device/a/q/dust/avg/history',
      searchUrl: '/carp/device/a/q/dust/avg/history',
      // 筛选器
      filters: {
        beginTime: {
          label: '时间',
          type: 'date',
          value: '2020-05-04 00:00:00'
        },
        // 设备类型
        type: {
          label: '维度',
          type: 'select',
          item: [
            { label: '分钟', code: 1 },
            { label: '小时', code: 2 },
            { label: '天', code: 5 }
          ]
        },
        // 厂商名称
        sn: {
          label: '设备号搜索',
          type: 'search',
          value: ''
        }
      }
    }
  },
  components: {
    commonTableControl
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
