<template>
  <el-row>
    <el-col>
      <common-form ref="commonForm" :formConfig="form"></common-form>
    </el-col>
    <el-col style="display:flex;justify-content:center">
      <el-button
        size="mini"
        type="info"
        @click="
          formInit()
          $emit('close')
        "
        >取消</el-button
      >
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
        label: {
          // 项目名称
          projectName: {
            label: '项目',
            type: 'search',
            span: 24,
            placeholder: '搜索项目',
            url: '/carp/business/a/q/project/list',
            target: 'projectId',
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          // 项目名称
          projectId: {
            show: false
          },
          // 经度
          lng: {
            label: '经度',
            span: 12,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          lat: {
            label: '纬度',
            span: 12,
            rule: {
              regExp: /^./g,
              message: '不能为空'
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
    this.formFill(this.info)
    if (!this.info.projectId) return
    this.$http.get(`/carp/business/a/q/project/${this.info.projectId}`).then(({ code, data }) => {
      if (code === 0) {
        this.form.data.projectName = data.name
      } else {
        this.$message.error('获取项目失败')
      }
    })
  },
  methods: {
    /* *
     * 初始化
     * * */
    formInit() {
      this.$refs.commonForm.formInit()
    },
    // 填充表单
    formFill(device) {
      if (device.projectId) {
        Object.keys(this.form.label).forEach(key => {
          this.$set(this.form.data, key, device[key])
        })
      }
    },
    // 注册提交
    submit() {
      // 验证输入内容是否全都正确
      this.$refs.commonForm.$refs.ruleForm.validate(valid => {
        if (!valid) return
        let formData = new FormData()
        let params = Object.assign(this.form.data, {
          sn: this.info.sn
        })
        Object.keys(params).forEach(key => {
          formData.append(key, params[key])
        })
        this.$http.put('/carp/device/a/q/dust/info/device/bind', formData).then(({ code, message }) => {
          if (code === 0) {
            this.$message.success('注册成功')
            this.$refs.commonForm.formInit()
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
