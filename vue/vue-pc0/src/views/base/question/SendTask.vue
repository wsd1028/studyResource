<template>
  <el-row>
    <el-col>
      <common-form ref="commonForm" :form-config="form"></common-form>
    </el-col>
    <el-col>
      <div class="bt-group" style="text-align:center">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">提交</el-button>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import commonForm from '@/components/CommonForm'
export default {
  data() {
    const user = this.$store.state.user.userInfo
    let areaTree = []
    this.$getAreaTree(user.accountTypeDto.code, area => {
      areaTree = [area]
    })
    return {
      user,
      form: {
        labelPosition: 'top',
        label: {
          // 督办派单图片集合
          taskImageList: {
            show: false,
            default: this.question.photo
          },
          // 问题上报id
          questionReportId: {
            show: false,
            default: this.question.id
          },

          // 发起人所在市区县
          sponsorCity: {
            show: false,
            colShow: false,
            default: user.organizationDto && user.organizationDto.areaName
          },
          // 发起人所在部门
          sponsorDept: {
            show: false,
            colShow: false,
            default: user.organizationDto && user.organizationDto.name
          },
          // 发起人id
          sponsorId: {
            show: false,
            colShow: false,
            default: user.id
          },
          // 发起人姓名
          sponsorName: {
            show: false,
            colShow: false,
            default: user.accountBaseDto.name
          },
          // 发起人电话
          sponsorPhone: {
            show: false,
            colShow: false,
            default: user.accountBaseDto.phone
          },

          // 接收人单位区域
          areaCode: {
            label: '接收人单位区域',
            labelWidth: '112px',
            type: 'area',
            areaTree,
            span: 24,
            props: {
              code: 'code'
            },
            real: false,
            change: areaCode => {
              this.$http.get(`/carp/auth/a/q/organization/area/${areaCode}`).then(({ code, data, message }) => {
                if (code === 0) {
                  this.form.label.receiverDept.item = data
                } else {
                  this.$message.error('获取部门列表失败' + message)
                }
              })
            }
          },
          // 接收人所在部门
          receiverDept: {
            label: '接收人所在部门',
            labelWidth: '112px',
            type: 'select',
            item: [],
            span: 24,
            props: {
              label: 'name',
              code: 'name'
            },
            change: (name, { id }) => {
              this.$http.get(`/carp/auth/a/q/account/organization/${id}`).then(({ code, data, message }) => {
                if (code === 0) {
                  this.form.label.receiverId.item = data.map(item => Object.assign(item, { label: item.accountBaseDto.name, code: item.id }))
                } else {
                  this.$message.error('获取用户列表失败: ' + message)
                }
              })
            }
          },
          // 收单人id
          receiverId: {
            label: '收单人',
            labelWidth: '56px',
            type: 'select',
            placeholder: '请先选择收单人所在的组织机构',
            item: [],
            span: 24,
            colShow: false,
            change: (receiverId, receiver) => {
              this.form.data.receiverName = receiver.label
              this.form.data.receiverCity = receiver.organizationDto.areaName
              this.form.data.receiverPhone = receiver.accountBaseDto.phone
            }
          },
          // 接收人所在市区县
          receiverCity: {
            show: false,
            colShow: false
          },
          // 接收人姓名
          receiverName: {
            show: false,
            colShow: false
          },
          // 接收人电话
          receiverPhone: {
            show: false,
            colShow: false
          },

          // 任务描述
          description: {
            show: false,
            default: this.question.reportMessage
          },
          // 任务位置
          address: {
            show: false,
            default: this.question.reportAddress
          },
          // 纬度
          longitude: {
            show: false,
            default: this.question.longitude
          },
          latitude: {
            show: false,
            default: this.question.latitude
          }
        }
      }
    }
  },
  props: {
    question: Object,
    // 关闭当前弹窗方法
    close: Function
  },
  methods: {
    /* *
     * 发起督办派单
     * * */
    submit() {
      this.$refs.commonForm.formValidate(valid => {
        if (valid) {
          this.$http.post('/carp/business/a/q/task/newTask', this.form.data).then(({ code, message }) => {
            if (code === 0) {
              this.$message.success(`已发起督办派单`)
              this.close()
            } else {
              this.$message.error(message)
            }
          })
        } else {
          this.$message.error('表单内容格式不正确')
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
