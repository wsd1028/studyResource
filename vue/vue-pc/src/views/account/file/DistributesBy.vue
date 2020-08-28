<template>
  <div v-loading="loading">
    <common-form ref="form" :form-config="form"> </common-form>
    <div style="text-align:center">
      <el-button type="primary" size="mini" @click="submit">
        确定
      </el-button>
    </div>
  </div>
</template>

<script>
import commonForm from '@/components/CommonForm'
export default {
  name: 'distributesBy',
  data() {
    return {
      loading: false,

      form: {
        label: {
          id: {
            label: '',
            placeholder: '通过sn号搜索',
            type: 'search',
            item: [],
            props: {
              label: 'sn',
              code: 'id'
            },
            search: query => {
              this.$http
                .get('/carp/device/a/q/dust/info/listBySn', {
                  params: {
                    sn: query
                  }
                })
                .then(({ code, data }) => {
                  if (code === 0) {
                    this.form.label.id.item = data
                  }
                })
            },
            span: 24,
            required: true
          },
          fileId: {
            show: false,
            default: this.fileInfo.id
          }
        }
      }
    }
  },
  props: {
    // 文件信息
    fileInfo: {
      type: Object,
      default: () => ({})
    },
    // 关闭弹窗方法
    close: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    submit() {
      this.$refs.form.formValidate(validate => {
        if (validate) {
          this.loading = true
          this.$http
            .put(
              '/carp/device/a/q/device/devicefile/sendToFile',
              {},
              {
                params: this.form.data
              }
            )
            .then(({ code, message }) => {
              if (code === 0) {
                this.validSuccess(this.form.data.id)
                this.notify = this.$notify({
                  title: this.fileInfo.name,
                  dangerouslyUseHTMLString: true,
                  message: `<i class="el-icon-loading" style="margin-right:4px"></i><span>等待设备响应</span>`,
                  type: 'warning',
                  duration: 0
                })
                this.close()
              } else {
                this.$message.error('请求失败: ' + message)
              }
              this.loading = false
            })
        }
      })
    },

    /* *
     * 验证是否下发成功
     * @param id:设备id
     * * */
    validSuccess(id) {
      let timerLong = 10000 //请求间隔
      let timer = 12 // 最大请求次数

      if (!this.deviceToTimer) {
        this.deviceToTimer = timerLong
      } else {
        this.deviceToTimer += timerLong
      }

      // 查看是否超过请求次数
      if (this.deviceToTimer > timerLong * timer) {
        this.notify && this.notify.close()
        this.$notify({
          title: this.fileInfo.name,
          message: '设备无响应',
          type: 'error',
          duration: 1000
        })
        return
      }

      this.$http
        .get('/carp/device/a/q/device/devicefile/confirmSend', {
          params: {
            id
          }
        })
        .then(({ code }) => {
          if (code === 0) {
            this.notify && this.notify.close()
            this.$notify({
              title: this.fileInfo.name,
              message: '下发成功',
              type: 'success',
              duration: 1000
            })
          } else {
            this.deviceTo = window.setTimeout(() => {
              this.validSuccess(id)
            }, timerLong)
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
