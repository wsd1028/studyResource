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
        // 表格类型-树
        tableType: 'tree',
        tableTreeConfig: {
          props: {
            children: 'list',
            type: 'level'
          },
          appendChild: {
            regExp: /^(?!120)/,
            key: 'level'
          }
        },
        labelWidth: '112px',
        label: {
          // 数据字典名称
          name: {
            width: 160,
            colType: 'edit',
            label: '数据字典名称',
            span: 24,
            rule: { regExp: /^./g, message: '不能为空' }
          },
          // 父级字典
          parentId: {
            label: '父级字典',
            type: 'dict',
            default: null,
            span: 24,
            colShow: false
          },
          // 层级
          level: {
            label: '层级',
            type: 'select',
            span: 24,
            item: [
              { label: '模块', code: 100 },
              { label: '目录', code: 110 },
              { label: '显示值', code: 120 }
            ],
            default: 100,
            colShow: false
          },
          // 数据类型
          category: {
            label: '数据类型',
            width: 200,
            span: 24,
            rule: { regExp: /^./g, message: '不能为空' }
          },
          // 数据字典id
          id: {
            label: '数据字典id',
            width: 140,
            show: false
          },
          // 数据字典值
          code: {
            label: '数据字典值',
            span: 24
          },
          // 排序
          sort: { label: '排序', type: 'number', span: 24, colShow: false },
          // 备注
          remark: { label: '备注', width: 200, type: 'textarea', rows: 3, span: 24 }
        }
      },
      // 增删改api
      addUrl: '/carp/business/a/q/dict',
      eidtUrl: '/carp/business/a/q/dict',
      delUrl: '/carp/business/a/q/dict',
      searchUrl: '/carp/business/a/q/dict/tree'
    }
  },
  components: {
    commonTableControl
  }
}
</script>
