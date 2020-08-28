<template>
  <common-table-control
    :formConfig="form"
    :addUrl="addUrl"
    :delUrl="delUrl"
    :editUrl="editUrl"
    :searchUrl="searchUrl"
    :allow-add="tablePermission.add"
    :allow-delete="tablePermission.del"
    :show-control="false"
    :allow-edit="tablePermission.edit"
  ></common-table-control>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
export default {
  name: 'transport',
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
          // 录入人id
          adminId: {
            show: false,
            colShow: false,
            default: this.$store.state.user.userInfo.id
          },
          // 图片
          photo: {
            label: '图片',
            type: 'uploadImg',
            colType: 'img',
            width: 160,
            span: 24,
            url: '/carp/file/a/q/file/upload/files/exposure_image',
            before: file => {
              const isJPG = file.type.includes('image')
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
              }
              if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
              }
              return isJPG && isLt2M
            },
            success: ({ code, data }) => {
              if (code !== 4002) {
                this.form.data.accessoryId = null
                this.$message.err('图片上传失败')
              } else {
                this.form.data.photo = data
                this.$message('图片上传成功')
              }
            }
          },
          // 标题
          title: {
            label: '标题',
            colType: 'edit',
            width: 260,
            span: 24,
            rule: {
              regExp: /^./g,
              $message: '标题不能为空'
            }
          },
          // 是否在大屏展示
          isShow: {
            label: '是否在大屏展示',
            type: 'radio',
            colType: 'switch',
            url: '/carp/business/a/q/exposure/table/update',
            item: [
              { label: '展示', code: true },
              { label: '不展示', code: false }
            ],
            default: true
          },
          // 描述
          describes: {
            label: '描述',
            type: 'editor',
            colShow: false,
            width: 600,
            rows: 5,
            span: 24
          },
          // 创建日期
          createDate: {
            label: '创建日期',
            width: 200,
            show: false,
            real: false
          }
        }
      },
      addUrl: '/carp/business/a/q/exposure/table/insert',
      delUrl: '/carp/business/a/q/exposure/table',
      editUrl: '/carp/business/a/q/exposure/table/update',
      searchUrl: '/carp/business/a/q/exposure/table/page'
    }
  },
  components: {
    commonTableControl
  }
}
</script>
