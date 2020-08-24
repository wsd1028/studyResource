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
  name: 'permitReview',
  data() {
    const user = this.$store.state.user.userInfo
    return {
      loading: false,

      form: {
        label: {
          // 审核人
          examinePeopleId: {
            show: false,
            default: user.id
          },
          // 审核状态
          examineState: {
            label: '是否合格',
            type: 'radio',
            item: [
              { label: '合格', code: 1 },
              { label: '不合格', code: 2 }
            ],
            default: 1,
            required: true,
            span: 24
          },
          // 审核备注
          examineMessage: {
            label: '审核备注',
            type: 'textarea',
            span: 24
          }
        }
      }
    }
  },
  props: {
    permitCard: Object,
    close: Function
  },
  methods: {
    submit() {
      this.$refs.form.formValidate(validate => {
        if (validate) {
          // 获取排放证详情
          this.$http.get(`/carp/business/a/q/discharge/permit/${this.permitCard.id}`).then(({ code, data, message }) => {
            if (code === 0) {
              // 修改排放证审核字段
              this.$http.put('/carp/business/a/q/discharge/permit', Object.assign(data, this.form.data)).then(({ code, message }) => {
                if (code === 0) {
                  this.$message.success(`宜宾市第${this.permitCard.issueNum}号 审核通过`)
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
