<template>
  <table-control
    :form-config="form"
    :allow-add="false"
    :allow-edit="false"
    :del-url="delUrl"
    :allow-delete="tablePermission.del"
    :search-url="searchUrl"
    :show-control="false"
    :filters="filters"
  />
</template>

<script>
import tableControl from '@/components/CommonTableControl'
export default {
  name: 'licenseRecord',
  data() {
    // 表操作权限
    const uri = this.$store.state.tab.currentMenu ? this.$store.state.tab.currentMenu.uri : ''
    const tablePermission = {
      del: false
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
      form: {
        label: {
          // 图片
          carPhoto: {
            label: '图片',
            colType: 'img',
            show: false,
            real: false
          },
          // 车牌号
          license: {
            label: '车牌号'
          },
          // 设备名称
          deviceName: {
            label: '设备名称'
          },
          // 序列号
          serialNumber: {
            label: '序列号'
          }
        }
      },
      delUrl: '/carp/business/a/q/license/integrated/license',
      searchUrl: '/carp/business/a/q/license/integrated/unregistered/page',
      // 分页筛选
      filters: {
        // 日期
        time: {
          label: '年份',
          type: 'select',
          item: [{ label: '2020年', code: '2020' }],
          value: '2020'
        },
        // 设备名称
        deviceName: {
          label: '设备名称',
          type: 'search',
          showBt: false
        },
        // 序列号
        serialNumber: {
          label: '序列号',
          type: 'search'
        }
      }
    }
  },
  components: {
    tableControl
  }
}
</script>
