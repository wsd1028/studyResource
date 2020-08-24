<template>
  <div class="form-wrap">
    <common-form ref="form" :form-config="form" class="common-form"></common-form>
    <el-button
      v-show="enableEdit"
      size="mini"
      :type="form.data && form.data.id ? 'warning' : 'primary'"
      @click="submit"
      class="bt-submit"
      v-text="form.data && form.data.id ? '修改禁运区' : '新增禁运区'"
    ></el-button>
    <el-button
      size="mini"
      type="info"
      @click="
        $refs.form.formInit()
        $emit('clearPath')
      "
      >重置</el-button
    >
  </div>
</template>

<script>
import commonForm from '@/components/CommonForm'
export default {
  name: 'disableTransportForm',
  data() {
    return {
      form: {
        label: {
          // 创建人
          people: {
            show: false,
            default: this.$store.state.user.userInfo.id
          },

          id: {
            show: false,
            default: null
          },

          // 名称
          name: {
            label: '禁运区名称',
            span: 14,
            required: true
          },
          // 是否使用
          embargo: {
            label: '是否使用',
            type: 'radio',
            span: 10,
            item: [
              { label: '使用', code: true },
              { label: '禁用', code: false }
            ],
            default: true,
            required: true
          },
          // 路径
          gpsJson: {
            show: false
          }
        }
      },

      // 是否可编辑
      enableEdit: true
    }
  },
  props: {
    path: Array
  },
  methods: {
    // 表单填充
    fill(data, enableEdit) {
      this.$refs.form.formFill(data)
      this.enableEdit = enableEdit
    },

    // 提交表单
    submit() {
      this.$refs.form.formValidate(validate => {
        // 表单验证
        if (!validate) return

        // 是否绘制区域验证
        if (!this.path.length) {
          this.$message.error('未绘制禁运区')
          return
        }

        this.$http({
          method: this.form.data.id ? 'put' : 'post',
          url: this.form.data.id ? '/carp/business/a/q/embargo' : '/carp/business/a/q/embargo/increase',
          data: Object.assign(this.form.data, {
            gpsJson: JSON.stringify(this.path)
          })
        }).then(({ code, message }) => {
          if (code === 0) {
            this.$message.success('当前禁运区已存储')
            this.$refs.form.formInit()
            this.$emit('flushList')
          } else {
            this.$message.error('请求失败: ' + message)
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

<style lang="less" scoped>
.form-wrap {
  box-sizing: border-box;
  padding: 20px 60px;
  position: absolute;
  bottom: 0;
  width: 100%;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  .common-form {
    display: inline-block;
    margin-bottom: -16px;
    width: 600px;
  }
  .bt-submit {
    margin-left: 20px;
  }
}
</style>
