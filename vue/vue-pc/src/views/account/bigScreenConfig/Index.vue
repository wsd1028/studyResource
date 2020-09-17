<template>
  <div v-loading="loading">
    <div class="form-center-wrap">
      <h1 class="title">大屏配置</h1>
      <common-form ref="form" :form-config="form"></common-form>
      <el-button type="info" @click="reset">重置</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import CommonForm from '@/components/CommonForm'
export default {
  name: 'bigScreenConfig',
  data() {
    return {
      loading: false,

      // 源数据
      originData: {},

      form: {
        label: {
          yearTarget: {
            label: '年度目标',
            type: 'number',
            unit: '天',
            unitWidth: '30px',
            span: 24,
            required: true
          },
          pm25Target: {
            label: 'pm2.5目标',
            type: 'number',
            unit: 'μg/m³',
            unitWidth: '30px',
            span: 24,
            required: true
          },
          pm10Target: {
            label: 'pm10目标',
            type: 'number',
            unit: 'μg/m³',
            unitWidth: '30px',
            span: 24,
            required: true
          }
        }
      }
    }
  },
  methods: {
    submit() {
      this.loading = true
      this.$refs.form.formValidate(validate => {
        if (!validate) {
          this.loading = false
          return
        }
        // 提交修改
        this.$http
          .put('/carp/device/a/q/bigscream/config', Object.assign(JSON.parse(JSON.stringify(this.originData)), this.form.data))
          .then(({ code, message }) => {
            if (code === 0) {
              this.originData = JSON.parse(JSON.stringify(this.form.data))
              this.$message.success('修改成功')
            } else {
              this.$message.error('修改失败: ' + message)
            }
            this.loading = false
          })
      })
    },
    reset() {
      console.log(this.originData)
      this.$refs.form.formFill(this.originData)
    }
  },
  mounted() {
    // 获取源数据
    this.$http.get('/carp/device/a/q/bigscream/config').then(({ code, data }) => {
      if (code === 0) {
        this.originData = data
        this.$refs.form.formFill(data)
      } else {
        this.$message.error('未获取到上一次的配置')
      }
    })
  },
  components: {
    CommonForm
  }
}
</script>

<style lang="less" scoped>
.form-center-wrap {
  margin: 60px auto;
  width: 600px;
  text-align: center;
  .title {
    color: #4285f4;
    font-size: 46px;
  }
}
</style>
