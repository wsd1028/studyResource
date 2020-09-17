<template>
  <div>
    <common-form :form-config="form" class="device-container"></common-form>
    <div style="text-align:center">
      <el-button type="primary" @click="submit">提交</el-button>
    </div>
  </div>
</template>

<script>
import commonForm from '@/components/CommonForm'
export default {
  name: 'saleService',
  data() {
    const user = this.$store.state.user.userInfo
    return {
      user,
      form: {
        formWidth: '500px',
        label: {
          // 代理商id
          id: {
            show: false,
            default: this.manufacturer.id
          },
          // 用户id
          userId: {
            show: false,
            default: user.id
          },
          // 厂商id集合
          manufactureId: {
            label: '选择厂商',
            type: 'checked',
            item: [],
            span: 24,
            default: []
          }
        }
      }
    }
  },
  props: {
    manufacturer: Object,
    close: Function
  },
  methods: {
    // 提交
    submit() {
      this.$http.post('/carp/device/a/q/device/agent/bind?' + this.$qs.stringify(this.form.data, { arrayFormat: 'repeat' })).then(({ code, message }) => {
        if (code !== 0) {
          this.$message.error(message)
        } else {
          this.$message.success('请求成功')
          this.close()
        }
      })
    }
  },
  created() {
    // 请求所有设备商
    this.$http.get('/carp/device/a/q/manufacturer/all').then(({ code, data, message }) => {
      if (code === 0) {
        this.form.label.manufactureId.item = data.map(item => ({ label: item.name, code: item.id }))
      } else {
        this.$message.error('厂商列表请求失败: ' + message)
      }
    })
    // 请求当前接入厂商所有授权设备厂商
    this.$http
      .get('/carp/device/a/q/device/agentmanufacture/manufactureIds', {
        params: {
          agentId: this.manufacturer.id
        }
      })
      .then(({ code, data, message }) => {
        if (code === 0) {
          this.form.data.manufactureId = data
        } else {
          this.$message.error('厂商列表请求失败: ' + message)
        }
      })
  },
  components: {
    commonForm
  }
}
</script>

<style lang="less" scoped></style>
