<template>
  <common-table-control
    :addUrl="addUrl"
    :allow-add="tablePermission.add"
    :allow-delete="tablePermission.del"
    :allow-edit="tablePermission.edit"
    :filters="filters"
    :formConfig="form"
    :searchUrl="searchUrl"
    :show-control="false"
  ></common-table-control>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
export default {
  name: 'violations',
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
          illegalCode: {
            label: '违法代码',
            width: '100px',
            type: 'select',
            item: [],
            props: {
              label: 'info',
              code: 'code'
            },
            span: 24,
            required: true,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          plateNumber: {
            label: '车牌号',
            type: 'string',
            span: 24,
            required: true,
            rule: {
              regExp: /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/,
              message: '请输入合法车牌号'
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
      addUrl: '/carp/business/a/q/car/illegal',
      searchUrl: null,
      filters: {
        // 用户地区码
        plateNumber: {
          label: '根据车牌号搜索',
          type: 'search',
          value: ''
        }
      }
    }
  },
  components: {
    commonTableControl
  },
  async created() {
    await this.getIllegalCode()
  },
  methods: {
    async getIllegalCode() {
      let resp = await this.$http.get('/carp/business/a/q/illegal/code/pages', {
        params: {
          limit: 9999,
          page: 1
        }
      })
      if (resp.code == 0) {
        this.form.label.illegalCode.item = resp.data.records
      } else {
        this.$message.error('获取违法代码失败' + resp.message)
      }
      this.searchUrl = '/carp/business/a/q/car/illegal/page'
    }
  }
}
</script>
