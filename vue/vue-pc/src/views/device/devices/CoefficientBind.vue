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
          pm2p5: {
            label: 'PM2.5参数(100表示100%)',
            type: 'title',
            real: false,
            span: 24
          },
          pm2p5One: {
            label: '0-50',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm2p5Two: {
            label: '50-100',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm2p5Three: {
            label: '100-150',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm2p5Four: {
            label: '150-200',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm2p5Five: {
            label: '200-250',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm2p5Six: {
            label: '250-300',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm2p5Seven: {
            label: '300-350',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm2p5Eight: {
            label: '350-400',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm2p5Nine: {
            label: '400+',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm10: {
            label: 'PM10参数(100表示100%)',
            type: 'title',
            real: false,
            span: 24
          },
          pm10One: {
            label: '0-50',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm10Two: {
            label: '50-100',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm10Three: {
            label: '100-150',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm10Four: {
            label: '150-200',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm10Five: {
            label: '200-250',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm10Six: {
            label: '250-300',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm10Seven: {
            label: '300-350',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm10Eight: {
            label: '350-400',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          pm10Nine: {
            label: '400+',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
            }
          },
          noiseTitle: {
            label: '噪声参数(100表示100%)',
            span: 24,
            type: 'title',
            real: false
          },
          noise: {
            label: '噪声系数',
            type: 'number',
            span: 6,
            rule: {
              regExp: /^\d*\.?\d*$/g,
              $message: '只能是数字'
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
    this.formFill()
  },
  methods: {
    // 填充表单
    formFill() {
      this.$http.get(`/carp/device/a/q/dust/info/coefficient/${this.info.sn}`).then(({ data }) => {
        if (data) {
          this.$refs.commonForm.formFill(data)
        }
      })
    },
    // 注册提交
    submit() {
      // 验证输入内容是否全都正确
      this.$refs.commonForm.$refs.ruleForm.validate(valid => {
        if (!valid) return
        let params = {}
        Object.keys(this.form.data).forEach(key => {
          params[key] = parseInt(this.form.data[key])
        })
        this.$http
          .put(
            '/carp/device/a/q/dust/info/k_coefficient',
            Object.assign(params, {
              sn: this.info.sn
            })
          )
          .then(({ code, message }) => {
            if (code === 0) {
              this.$message.success('校验成功')
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
