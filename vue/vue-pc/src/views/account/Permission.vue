<template>
  <common-table-control
    :formConfig="form"
    :addUrl="addUrl"
    :delUrl="delUrl"
    :editUrl="editUrl"
    :searchUrl="searchUrl"
    :allow-add="tablePermission.add"
    :allow-delete="tablePermission.del"
    :allow-edit="tablePermission.edit"
    :show-control-edit="false"
    :show-control-del="false"
    :paginationShow="false"
  ></common-table-control>
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
        labelPosition: 'top',
        formWidth: '500px',
        tableType: 'tree',
        tableTreeConfig: {
          appendChild: {
            regExp: /^[^3]$/,
            key: 'type'
          }
        },
        // 表格标题
        label: {
          // 子权限
          children: {
            show: false,
            colShow: false,
            span: 24,
            real: false
          },
          // 路由名称
          name: {
            label: '权限名',
            width: 200,
            colType: 'edit',
            span: 24,
            rule: {
              regExp: /^.{1,20}$/g,
              message: '图标名称不能为空'
            }
          },
          // 图标
          icon: {
            label: '图标',
            span: 24,
            colShow: false
          },
          // 上级目录ID
          parentId: {
            label: '父级权限',
            type: 'permission',
            colShow: false,
            span: 24,
            default: null
          },
          // 菜单类型
          type: {
            label: '菜单类型',
            type: 'select',
            default: 1,
            span: 24,
            item: [
              { label: '菜单', code: 1 },
              { label: '目录', code: 2 },
              { label: '按钮', code: 3 }
            ]
          },
          // 是否为工程权限
          isProjectPermission: {
            label: '是否为工程权限',
            type: 'radio',
            width: 200,
            labelWidth: '120px',
            colType: 'tag',
            default: false,
            span: 24,
            item: [
              { label: '是', code: true, type: 'success' },
              { label: '否', code: false, type: 'danger' }
            ]
          },
          // 权限值-默认为随机生成的uuid
          uri: {
            label: '权限值',
            width: 300,
            span: 24,
            rules: {
              regExp: /^.{1,40}$/g,
              message: '权限值不能为空'
            }
          }
        }
      },
      // 增删改api
      addUrl: '/carp/auth/a/q/permission',
      editUrl: '/carp/auth/a/q/permission',
      delUrl: '/carp/auth/a/q/permission',
      searchUrl: '/carp/auth/a/q/permission'
    }
  },
  methods: {},
  components: {
    commonTableControl
  }
}
</script>
