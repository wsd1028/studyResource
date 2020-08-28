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
    :allowExport="false"
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
        formWidth: '500px',
        labelPosition: 'top',
        tableType: 'tree',
        tableTreeConfig: {
          appendChild: {
            regExp: /^[^2]/,
            key: 'type'
          }
        },
        // 表格标题
        label: {
          // 创建人ID
          createAccountId: {
            show: false,
            colShow: false,
            default: this.$store.state.user.userInfo.id
          },
          // 菜单列表显示名称
          label: {
            label: '列表名称',
            colType: 'edit',
            width: 200,
            span: 24,
            rule: {
              regExp: /^.{1,20}$/g,
              message: '列表名称不能为空'
            }
          },
          // 路由名称
          name: {
            label: '路由名称',
            colShow: false,
            span: 24,
            default: null
          },
          // 路径
          path: {
            label: '路径',
            width: 300,
            span: 24,
            default: null
          },
          // 图标
          icon: {
            label: '图标',
            colType: 'icon',
            span: 24,
            rule: {
              regExp: /^.{1,100}$/g,
              message: '图标名称不能为空'
            }
          },
          // 上级目录ID
          parentId: {
            label: '父级菜单',
            type: 'menu',
            span: 24,
            colShow: false,
            default: null
          },
          // 菜单类型
          type: {
            label: '菜单类型',
            type: 'select',
            span: 24,
            item: [
              { label: '一级菜单', code: 1 },
              { label: '二级菜单', code: 2 }
            ]
          },
          // 模块路径
          url: {
            label: '组件路径',
            colShow: false,
            width: 300,
            span: 24,
            default: null
          },
          // 权限值
          uri: {
            label: '权限值',
            width: 300,
            span: 24,
            rule: {
              regExp: /^.{1,40}$/g,
              message: '权限值不能为空'
            }
          }
        }
      },
      // 增删改api
      addUrl: '/carp/auth/a/q/menu',
      editUrl: '/carp/auth/a/q/menu',
      delUrl: '/carp/auth/a/q/menu',
      searchUrl: '/carp/auth/a/q/menu'
    }
  },
  components: {
    commonTableControl
  }
}
</script>
