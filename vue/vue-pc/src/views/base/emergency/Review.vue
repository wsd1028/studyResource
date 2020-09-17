<template>
  <div v-loading="loading">
    <common-form ref="form" :form-config="form"></common-form>
    <div style="text-align:center">
      <el-button type="primary" size="mini" @click="submit">
        提交
      </el-button>
    </div>
  </div>
</template>

<script>
import commonForm from '@/components/CommonForm'
export default {
  name: 'emergencyReview',
  data() {
    const user = this.$store.state.user.userInfo
    return {
      loading: false,

      form: {
        label: {
          // 审核人
          examineId: {
            show: false,
            default: user.id
          },
          examineName: {
            show: false,
            default: (user.organizationDto && user.organizationDto.areaName) || '' + '-' + user.accountBaseDto.name
          },
          // 审核状态
          state: {
            label: '是否合格',
            type: 'radio',
            item: [
              { label: '合格', code: 1 },
              { label: '不合格', code: 2 }
            ],
            default: 1,
            required: true,
            span: 24
          }
        }
      }
    }
  },
  props: {
    // 审批人
    emergency: Object,
    close: Function
  },
  methods: {
    submit() {
      this.$refs.form.formValidate(validate => {
        if (validate) {
          // 获取应急预案详情
          this.$http.get(`/carp/business/a/q/emergency/plan/${this.emergency.id}`).then(({ code, data, message }) => {
            if (code === 0) {
              // 获取当前时间
              data.examineTime = this.$moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
              // 修改应急预案审核字段
              this.$http.put('/carp/business/a/q/emergency/plan', Object.assign(data, this.form.data)).then(({ code, message }) => {
                if (code === 0) {
                  this.$message.success(`${this.emergency.title} 审核通过`)
                  this.close()
                } else {
                  this.$message.error('审核操作失败: ' + message)
                }
              })
            } else {
              this.$message.error('审核操作失败: ' + message)
            }
          })
        }
      })
    }
  },
  components: {
    commonForm
  }
}
</script>

<style></style>
