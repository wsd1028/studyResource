<template>
  <el-row>
    <el-col>
      <common-form ref="commonForm" :form-config="form"></common-form>
    </el-col>
    <el-col style="text-align:center">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </el-col>
  </el-row>
</template>

<script>
import commonForm from '@/components/CommonForm'
export default {
  data() {
    const user = this.$store.state.user.userInfo
    return {
      user,
      form: {
        label: {
          // 派单人id
          accountId: {
            show: false,
            default: user.id
          },
          // 派单id
          taskId: {
            show: false,
            default: this.taskDetails.id
          },
          // 图片
          imageList: {
            label: '图片',
            type: 'uploadImgs',
            labelWidth: '60px',
            span: 24,
            url: '/carp/file/a/q/file/upload/files/task_image',
            required: true,
            before: file => {
              const isJPG = file.type.includes('image')
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isJPG) {
                this.$message.error('只能上传图片格式!')
              }
              if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
              }
              return isJPG && isLt2M
            },
            rule: {
              regExp: /^./g,
              message: '请上传图片'
            }
          },
          // 备注
          remark: {
            label: '备注',
            type: 'textarea',
            labelWidth: '60px',
            rows: 3,
            span: 24,
            required: true,
            rule: {
              regExp: /^./g,
              message: '请填写备注'
            }
          }
        }
      }
    }
  },
  props: {
    taskDetails: Object,
    close: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    submit() {
      this.$refs.commonForm.formValidate(valid => {
        if (!valid) return
        this.$http.post('/carp/business/a/q/task/finishTask', this.form.data).then(({ code, message }) => {
          if (code === 0) {
            this.$message.success(this.taskDetails.address + ' 处理完成')
            this.close()
          } else {
            this.$message.error(message)
          }
        })
      })
    }
  },
  components: {
    commonForm
  }
}
</script>

<style></style>
