<template>
  <div v-loading="loading">
    <common-form ref="form" :form-config="form"></common-form>
    <div style="text-align:center">
      <el-button type="primary" @click="submit()">提交</el-button>
    </div>
  </div>
</template>

<script>
import commonForm from '@/components/CommonForm'
export default {
  name: 'bindProject',
  data() {
    return {
      loading: false,

      form: {
        label: {
          // 设备id
          deviceId: {
            show: false,
            default: this.device.id
          },
          // 项目
          projectId: {
            label: '绑定项目',
            type: 'project',
            span: 24,
            change: ({ node }) => {
              this.form.data.projectName = node.projectName
              this.$getAreaTree(node.areaId, ({ code }) => {
                this.form.data.areaCode = code
              })
            },
            required: true
          },
          projectName: {
            show: false
          },
          areaCode: {
            show: false
          },
          // 监测点
          monitorId: {
            label: '监测点',
            type: 'select',
            span: 24,
            item: [],
            props: {
              label: 'siteName',
              code: 'id'
            },
            required: true
          },
          // 状态
          status: {
            label: '状态',
            type: 'radio',
            span: 24,
            item: [
              { label: '启用', code: 1 },
              { label: '禁用', code: 0 }
            ],
            default: 1
          }
        }
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.formValidate(validate => {
        if (validate) {
          this.loading = true
          this.$http
            .put(
              '/carp/device/a/q/dust/info/device/bind',
              {},
              {
                params: Object.assign(this.form.data, {
                  projectName: this.form.data.projectName.replace(/\(最近\)$/, '')
                })
              }
            )
            .then(({ code, message }) => {
              if (code === 0) {
                this.$message.success('设备已绑定到工程：' + this.form.data.projectName)
                this.flush()
                this.close()
              } else {
                this.$message.error('设备绑定失败: ' + message)
              }

              this.loading = false
            })
        }
      })
    }
  },
  created() {
    this.$http
      .get(`/carp/device/a/q/monitorSite/deviceId`, {
        params: {
          deviceId: this.device.id
        }
      })
      .then(({ code, data, message }) => {
        if (code === 0) {
          this.form.label.monitorId.item = data.map((item, index) =>
            Object.assign(item, {
              siteName: index === 0 ? `${item.station || ''}(最近)` : item.station
            })
          )
        } else {
          this.$message.error('未查到监测点信息: ' + message)
        }
      })
  },
  props: {
    device: Object,
    close: Function,
    flush: Function
  },
  components: {
    commonForm
  }
}
</script>

<style></style>
