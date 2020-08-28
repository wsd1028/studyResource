<template>
  <div class="container">
    <common-table-control
      :formConfig="form"
      :addUrl="addUrl"
      :delUrl="delUrl"
      :editUrl="editUrl"
      :searchUrl="searchUrl"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control="false"
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
        // 显示
        show: false,
        // 操作格式
        type: 'add',
        // 表单数据
        data: {},
        // 表格标题
        label: {
          // 厂商名称
          name: {
            label: '厂商名称',
            colType: 'edit',
            width: 200,
            span: 24,
            rule: {
              regExp: /^./g,
              message: '厂商名称不能为空'
            }
          },
          keyId: {
            label: 'keyId',
            width: 200,
            show: false,
            real: false
          },
          keySecret: {
            label: 'keySecret',
            width: 200,
            show: false,
            real: false
          },
          // 备注
          note: {
            label: '备注',
            width: 400,
            type: 'textarea',
            rows: 3,
            maxlength: 120,
            span: 24,
            data: data => data.substr(0, 30) + '...'
          },
          // 是否启用
          enable: {
            label: '当前状态',
            type: 'radio',
            colType: 'switch',
            url: '/carp/device/a/q/manufacturer',
            show: false,
            span: 24,
            width: 120,
            default: false,
            item: [
              { label: '启用', code: true, type: 'success' },
              { label: '禁用', code: false, type: 'danger' }
            ],
            real: false
          }
        }
      },
      addUrl: '/carp/device/a/q/manufacturer',
      delUrl: '/carp/device/a/q/manufacturer',
      editUrl: '/carp/device/a/q/manufacturer',
      searchUrl: '/carp/device/a/q/manufacturer',
      // 筛选器
      filters: {
        // 厂商名称
        name: {
          label: '厂商名称搜索',
          type: 'search',
          value: '',
          showBt: false
        },
        keyId: {
          label: 'keyId搜索',
          type: 'search',
          value: '',
          showBt: false
        },
        keySecret: {
          label: 'keySecret搜索',
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
