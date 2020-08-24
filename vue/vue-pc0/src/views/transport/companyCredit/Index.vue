<template>
  <common-table-control
    :addUrl="addUrl"
    :allow-add="tablePermission.add"
    :allow-delete="tablePermission.del"
    :allow-edit="tablePermission.edit"
    :delUrl="delUrl"
    :editUrl="editUrl"
    :filters="filters"
    :formConfig="form"
    :searchUrl="searchUrl"
    :show-control="false"
  ></common-table-control>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
export default {
  name: 'companyCredit',
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
        formHeight: 'auto',
        // 表格标题
        label: {
          name: {
            label: '企业名称',
            type: 'string',
            span: 24,
            colType: 'edit',
            width: '100px',
            show: false,
            edit: false
          },
          companyId: {
            label: '企业',
            colShow: false,
            width: '100px',
            type: 'search',
            url: '/carp/business/a/q/company/page',
            item: [],
            props: {
              label: 'name',
              code: 'id'
            },
            span: 24,
            required: true,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          score: {
            label: '信用分',
            type: 'number',
            span: 24,
            required: true,
            rule: {
              regExp: /^(\d{1,2}(\.\d{1,1})?|100)$/,
              message: '请输入0-100数字,最多一位小数'
            }
          },
          // 创建日期
          time: {
            label: '创建日期',
            width: 200,
            show: false
          }
        }
      },
      editUrl: '/carp/business/a/q/company/credit',
      delUrl: '/carp/business/a/q/company/credit',
      addUrl: '/carp/business/a/q/company/credit',
      searchUrl: '/carp/business/a/q/company/credit/page',
      filters: {
        // 用户地区码
        name: {
          label: '根据企业名称搜索',
          type: 'search',
          value: ''
        }
      }
    }
  },
  components: {
    commonTableControl
  },
  methods: {}
}
</script>
