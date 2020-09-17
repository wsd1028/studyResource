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
          // 固定源类型
          fixedSourceType: {
            label: '固定源类型',
            type: 'select',
            props: {
              label: 'name',
              code: 'id'
            },
            item: (() => {
              this.$http.get('/carp/business/a/q/dict/category/fixed_source_type').then(({ code, data, message }) => {
                if (code === 0) {
                  this.form.label.fixedSourceType.item = data
                  // 根据当前类型获取固定源选择器
                  this.changeType(this.device.fixedSourceType || this.device.predictFixedSourceType || data[0].id)
                  this.form.data.fixedSourceId = this.device.fixedSourceId
                } else {
                  this.$message.error('获取固定源类型字典表失败: ' + message)
                }
              })
              return []
            })(),
            span: 24,
            default: this.device.fixedSourceType || this.device.predictFixedSourceType,
            required: true,
            change: type => this.changeType(type)
          },
          // 固定源
          fixedSourceId: {
            label: '绑定固定源',
            type: 'project',
            span: 24,
            change: ({ node }) => {
              this.form.data.fixedSourceName = node.projectName || node.name
              this.$getAreaTree(node.areaId || node.areaCode, ({ code }) => {
                this.form.data.areaCode = code
              })
            },
            required: true,
            default: null
          },
          fixedSourceName: {
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
            required: true,
            default: this.device.monitorSiteId
          },
          // 报警策略
          alarmStrategyId: {
            label: '报警策略',
            type: 'select',
            span: 24,
            item: [],
            props: {
              label: 'name',
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
            default: 1,
            required: true
          }
        }
      }
    }
  },
  methods: {
    // 提交表单
    submit() {
      this.$refs.form.formValidate(validate => {
        if (validate) {
          this.loading = true
          this.$http
            .put(
              '/carp/device/a/q/dust/info/device/bind',
              {},
              {
                params: this.form.data
              }
            )
            .then(({ code, message }) => {
              if (code === 0) {
                this.$message.success('设备已绑定到工程：' + this.form.data.fixedSourceName)
                this.flush()
                this.close()
              } else {
                this.$message.error('设备绑定失败: ' + message)
              }
              this.loading = false
            })
        }
      })
    },

    // 固定源类型切换
    changeType(type) {
      this.form.data.fixedSourceId = null
      switch (type) {
        // 项目
        case this.form.label.fixedSourceType.item[0].id:
          this.form.label.fixedSourceId.type = 'project'
          break

        // 消纳站
        case this.form.label.fixedSourceType.item[1].id:
          this.form.label.fixedSourceId.type = 'garbageStation'
          break

        // 公共区域
        case this.form.label.fixedSourceType.item[2].id:
          this.form.label.fixedSourceId.type = 'publicArea'
          break
      }
    }
  },
  created() {
    // 获取设备监测点
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

    // 获取报警策略
    this.$http.get(`/carp/device/a/q/device/alarmStrategy/list`).then(({ code, data, message }) => {
      if (code === 0) {
        this.form.label.alarmStrategyId.item = data.records
        this.form.data.alarmStrategyId = this.device.alarmStrategyId || (data.records[0] && data.records[0].id)
      } else {
        this.$message.error('获取告警策略列表失败: ' + message)
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
