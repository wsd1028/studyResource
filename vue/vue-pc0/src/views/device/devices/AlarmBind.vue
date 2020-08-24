<template>
  <el-row>
    <el-col>
      <common-form ref="commonForm" :formConfig="form"></common-form>
    </el-col>
    <el-col style="display:flex;justify-content:center">
      <el-button size="mini" type="info" @click="$emit('close')">取消</el-button>
      <el-button size="mini" type="primary" @click="submit">提交</el-button>
    </el-col>
  </el-row>
</template>

<script>
import commonForm from '@/components/CommonForm'
export default {
  data() {
    return {
      form: {
        labelWidth: '68px',
        gutter: 50,
        label: {
          alarmType: {
            label: '告警类型',
            type: 'select',
            span: 8,
            item: [{ label: '小时', code: 'strategyHour' }],
            change: val => {
              this.form.label.alarmType.item.every(item => {
                if (item.code === val) {
                  this.form.label.alarmStrategy.unit = item.label
                  return false
                }
                return true
              })
            },
            default: 1
          },
          alarmStrategy: {
            label: '告警策略',
            type: 'number',
            span: 8,
            unit: '小时',
            rule: {
              regExp: /^\d*$/g,
              message: '只能是数字'
            }
          }
        }
      }
    }
  },
  props: {
    info: Object
  },
  mounted() {
    this.formInit()
  },
  methods: {
    /* *
     * 初始化
     * * */
    formInit() {
      this.$refs.commonForm.formInit()
      this.formFill()
    },
    // 填充表单
    formFill() {
      this.$http.get(`/carp/device/a/q/dust/info/${this.info.sn}`).then(({ data }) => {
        if (data) {
          Object.keys(this.form.label).forEach(key => {
            this.form.data[key] = data[key]
          })
        }
      })
    },
    // 注册提交
    submit() {
      // 验证输入内容是否全都正确
      this.$refs.commonForm.$refs.ruleForm.validate(valid => {
        if (!valid) return
        this.$http
          .put(
            '/carp/device/a/q/dust/info/alarm',
            this.$qs.stringify(
              Object.assign(this.form.data, {
                sn: this.info.sn
              })
            )
          )
          .then(({ code, message }) => {
            if (code === 0) {
              this.$message.success('配置成功')
              this.$emit('close')
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

<style lang="less" scoped></style>
