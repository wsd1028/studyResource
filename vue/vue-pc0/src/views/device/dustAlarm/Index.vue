<template>
  <div class="container">
    <common-table-control
      :formConfig="form"
      :searchUrl="searchUrl"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :allowExport="false"
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
        label: {
          // 设备号
          sn: {
            label: '设备号'
          },
          // 告警策略
          type: {
            label: '告警策略',
            type: 'select',
            item: [
              { label: '分钟', code: 1 },
              { label: '小时', code: 2 },
              { label: '天', code: 5 }
            ]
          },
          // 温度
          temperature: {
            label: '温度'
          },
          // 气压
          atmospheric: {
            label: '大气压'
          },
          // 湿度
          humidity: {
            label: '湿度'
          },
          // 风力
          windSpeed: {
            label: '风力'
          },
          // 风向
          windDirection: {
            label: '风向'
          },
          // 噪声平均值
          avgNoise: {
            label: '噪声平均值'
          },
          // PM10平均值
          avgPm10: {
            label: 'PM10平均值'
          },
          // PM2.5平均值
          avgPm2p5: {
            label: 'PM2.5平均值'
          },
          // 开始时间
          beginTime: {
            label: '开始时间',
            width: 200
          }
        }
      },
      searchUrl: '/carp/device/a/q/dust/alarm',
      // 筛选器
      filters: {
        beginTimeStart: {
          label: '开始时间',
          type: 'date'
        },
        beginTimeEnd: {
          label: '结束时间',
          type: 'date'
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
