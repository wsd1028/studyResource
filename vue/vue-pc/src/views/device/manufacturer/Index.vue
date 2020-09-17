<template>
  <div class="container">
    <common-table-control
      ref="tableControl"
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
    <el-dialog v-if="manufacturerValidateShow" title="信息核验" :visible="true" width="960px" @close="manufacturerValidateShow = false">
      <manufacturer-validate
        :company="company"
        :close="
          () => {
            manufacturerValidateShow = false
            form.data.validate = true
          }
        "
        @validate-complete="isValidate = true"
      ></manufacturer-validate>
    </el-dialog>
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import manufacturerValidate from './ManufacturerValidate'
export default {
  name: 'manufacturer',
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

    const user = this.$store.state.user.userInfo
    return {
      user,

      // 厂商信息验证弹窗
      company: {},
      manufacturerValidateShow: false,
      isValidate: false,

      // 表操作权限
      tablePermission,

      // 表单配置
      form: {
        formWidth: '600px',
        formHeight: 'auto',
        onBeforeAddShow: () => {
          if (this.form.data) {
            this.isValidate = false
            this.$refs.tableControl.formInit()
          }
        },
        // 表格标题
        label: {
          // 厂商名称
          name: {
            label: '厂商名称',
            type: 'company',
            width: 200,
            span: 24,
            rule: {
              regExp: /^./g,
              message: '厂商名称不能为空'
            },
            required: true,
            button: false,
            change: (id, company) => {
              console.log(this.form.data.validate)
              if (!this.$refs.tableControl.formShow || this.isValidate) {
                return
              }
              this.company = company
              this.manufacturerValidateShow = true
            },
            onSuccess() {},
            onError(err) {
              if (!this.$refs.tableControl.formShow || this.isValidate) {
                return
              }
              this.$message.error(err)
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
            colType: [0, 50].includes(this.$userType) ? 'switch' : 'tag',
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
          value: null,
          show: [0, 50].includes(this.$userType),
          showBt: false
        },
        keyId: {
          label: 'keyId搜索',
          type: 'search',
          value: null,
          show: [0, 50].includes(this.$userType),
          showBt: false
        },
        keySecret: {
          label: 'keySecret搜索',
          type: 'search',
          show: [0, 50].includes(this.$userType),
          value: null
        },
        manufacturerId: {
          show: false,
          value: [0, 50].includes(this.$userType) ? null : user.accountTypeDto.ancillaryId
        }
      }
    }
  },
  components: {
    commonTableControl,
    manufacturerValidate
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
