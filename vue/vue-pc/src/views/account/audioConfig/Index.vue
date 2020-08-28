<template>
  <table-control
    :form-config="form"
    edit-url="/carp/business/a/q/dict"
    del-url="/carp/business/a/q/dict"
    search-url="/carp/business/a/q/dict/page?category=check_style"
    :allow-add="tablePermission.add"
    :allow-delete="tablePermission.del"
    :allow-edit="tablePermission.edit"
    :show-control="false"
  ></table-control>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
export default {
  name: 'audioConfig',
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
            label: '语音包',
            type: 'uploadFile',
            url: '/carp/file/a/q/file/upload/files/video_audio',
            fileList: [],
            limit: 1,
            span: 24,
            colShow: false,
            before: file => {
              this.form.data.remark = file.name
            },
            success: data => {
              this.form.data.code = data
            },
            onPreview: file => {
              const link = document.createElement('a')
              link.href = this.$store.state.config.convertFileUrl((file.response && file.response.data[0]) || file.url)
              link.click()
            },
            onRemove: () => {
              this.form.data.remark = this.form.data.code = null
            }
          },
          // 排序
          sort: { label: '排序', type: 'number', span: 24, colShow: false },
          // 备注
          remark: { label: '备注', show: false, width: 200, type: 'textarea', rows: 3, span: 24 }
        },
        // 监听修改弹窗事件
        onBeforeEditShow: data => {
          console.log(data)
          this.form.label.code.fileList = data.remark ? [{ name: data.remark, url: data.code }] : []
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
