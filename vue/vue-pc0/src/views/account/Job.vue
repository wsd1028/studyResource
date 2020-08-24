<template>
  <common-table-control
    :formConfig="form"
    :addUrl="addUrl"
    :delUrl="delUrl"
    :editUrl="eidtUrl"
    :searchUrl="searchUrl"
    :allow-add="tablePermission.add"
    :allow-delete="tablePermission.del"
    :allow-edit="tablePermission.edit"
    :filters="filters"
  ></common-table-control>
</template>
<script>
import commonTableControl from '../../components/CommonTableControl'
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
        labelPosition: 'top',
        formWidth: '500px',
        formHeight: '16vh',
        // 表格标题
        label: {
          // 职务名称
          name: {
            label: '职务名称',
            type: 'string',
            width: 600,
            span: 24,
            rule: {
              regExp: /./g,
              message: '职务名称不能为空'
            }
          }
        }
      },
      // 增删改api
      addUrl: '/carp/auth/a/q/job_title',
      eidtUrl: '/carp/auth/a/q/job_title',
      delUrl: '/carp/auth/a/q/job_title',
      searchUrl: '/carp/auth/a/q/job_title',
      // 筛选器
      filters: {
        // 职务名
        name: {
          label: '根据职务名称搜索',
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
