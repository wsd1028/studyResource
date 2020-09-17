<template>
  <table-control
    :form-config="form"
    add-url="/carp/device/a/q/device/alarmStrategy"
    search-url="/carp/device/a/q/device/alarmStrategy/list"
    :allow-add="tablePermission.add"
    :allow-delete="false"
    :allow-edit="false"
    :show-control="false"
  ></table-control>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
export default {
  name: 'alarmStrategy',
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

      form: {
        labelPosition: 'top',
        formWidth: '600px',
        formHeight: 'auto',
        label: {
          name: { label: '策略名称', span: 24, required: true },
          code: { label: '策略代码', span: 24, placeholder: '重要,不能填错s', required: true },
          description: { label: '策略描述', span: 24, type: 'textarea' }
        }
      }
    }
  },
  components: {
    tableControl
  }
}
</script>

<style></style>
