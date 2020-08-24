<template>
  <el-row>
    <el-col>
      <common-form ref="commonForm" :form-config="form"></common-form>
    </el-col>
    <el-col style="text-align:center">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="submit">提交</el-button>
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
        label: {
          // 接收人单位区域
          areaCode: {
            label: '接收人单位区域',
            type: 'area',
            areaTree,
            props: {
              code: 'code'
            },
            span: 24,
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
            label: '接收人所在单位',
            placeholder: '请先选择单位所在地区',
            type: 'select',
            item: [],
            props: {
              label: 'name',
              code: 'name'
            },
            span: 24,
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
          // 接收人id
          receiverId: {
            label: '接收人',
            placeholder: '请先选择接收人所在单位',
            type: 'select',
            item: [],
            span: 24,
            change: (receiverId, receiver) => {
              this.form.data.receiverName = receiver.label
              this.form.data.receiverCity = receiver.organizationDto.areaName
              this.form.data.receiverPhone = receiver.accountBaseDto.phone
            }
          },
          // 接收人姓名
          receiverName: {
            label: '接收人',
            show: false
          },
          // 接收人所在市区县
          receiverCity: {
            show: false
          },
          // 接收人电话
          receiverPhone: {
            show: false
          },
          // 派单主id
          taskId: {
            show: false,
            default: this.taskDetails.id
          }
        }
      }
    }
  },
  props: {
    taskDetails: Object,
    close: {
      type: Function,
      default: () => {}
    }
  },
  methods: {
    submit() {
      // 表单验证
      this.$refs.commonForm.formValidate(valid => {
        if (!valid) return
        this.$http.post('/carp/business/a/q/task/transmitTask', this.form.data).then(({ code, message }) => {
          if (code === 0) {
            this.$message.success(this.taskDetails.address + ' 转发成功')
            this.close()
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

<style></style>
