<template>
  <table-control
    ref="table"
    :formConfig="form"
    :addUrl="addUrl"
    :delUrl="delUrl"
    :editUrl="editUrl"
    :searchUrl="searchUrl"
    :allow-add="tablePermission.add"
    :allow-delete="tablePermission.del"
    :allow-edit="tablePermission.edit"
    :filters="filters"
    :show-control="false"
    @formClosed="formLabelInit(true)"
  ></table-control>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
export default {
  name: 'transportContract',
  data() {
    // 表操作权限
    const uri = this.$store.state.tab.currentMenu ? this.$store.state.tab.currentMenu.uri : ''
    const tablePermission = {
      add: false,
      del: false,
      edit: false
    }
    Object.keys(tablePermission).forEach(key => {
      // 添加按钮权限验证
      this.$permission(`${uri}_${key}`).then(({ data }) => {
        tablePermission[key] = data
      })
    })

    const user = this.$store.state.user.userInfo
    return {
      // 当前登录用户
      user,
      // 表操作权限
      tablePermission,
      // 表单配置
      form: {
        // 表格标题
        label: {
          // 附件地址,存储上传的纸质图片
          accessory: {
            label: '合同附件',
            type: 'uploadImg',
            colShow: false,
            width: 160,
            span: 24,
            url: '/carp/file/a/q/file/upload/files/base_image',
            before: file => {
              const isJPG = file.type.includes('image')
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isJPG) {
                this.$message.error('上传图片只能是 JPG 格式!')
              }
              if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
              }
              return isJPG && isLt2M
            }
          },
          // 所属项目
          projectId: {
            label: '所属项目',
            type: 'project',
            colShow: false,
            required: true
          },
          // 开始时间
          startDate: {
            label: '开始时间',
            type: 'date',
            colShow: false,
            required: true
          },
          // 结束时间
          endDate: {
            label: '结束时间',
            type: 'date',
            colShow: false,
            required: true
          },
          // 甲方公司名称(项目负责企业)
          partyCompanyName: {
            label: '甲方公司名称',
            type: 'company',
            colType: 'edit',
            companyType: '146',
            target: 'partyCompanyId',
            width: 200,
            required: true
          },
          partyCompanyId: {
            show: false,
            colShow: false
          },
          // 运输物料种类id(字典表：type)
          transportMaterial: {
            label: '运输物料种类',
            type: 'select',
            width: 120,
            item: [],
            required: true,
            default: '1500'
          },
          // 甲方负责人姓名
          partyName: {
            label: '甲方负责人姓名',
            labelWidth: '114px',
            required: true,
            rule: {
              regExp: /^[\u4e00-\u9fa5]{2,10}$|^$|^null$/gi,
              message: '请输入正确的姓名'
            }
          },
          // 甲方负责人电话
          partyPhone: {
            label: '甲方负责人电话',
            labelWidth: '112px',
            required: true,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            }
          },
          // 目的地
          destination: {
            label: '目的地',
            width: 200
          },
          // 方量
          capacity: {
            label: '方量',
            type: 'number',
            colShow: false,
            unit: '立方米'
          },
          // 个人or公司类型
          type: {
            label: '类型',
            type: 'radio',
            span: 24,
            item: [
              { label: '个人', code: true },
              { label: '公司', code: false }
            ],
            required: true,
            default: true
          },

          // 承运方(运输企业)
          shipperName: {
            label: '承运方',
            show: false,
            colShow: false,
            type: 'company',
            companyType: '145',
            placeholder: '搜索运输企业',
            width: 200,
            target: 'shipperId',
            required: true,
            real: false
          },
          shipperId: {
            show: false,
            colShow: false
          },
          // 承运方负责人姓名
          shippingName: {
            label: '承运方负责人姓名',
            show: false,
            labelWidth: '128px',
            required: true,
            rule: {
              regExp: /^[\u4e00-\u9fa5]{2,10}$|^$|^null$/gi,
              message: '请输入正确的姓名'
            }
          },
          // 承运方负责人电话
          shippingPhone: {
            label: '承运方负责人电话',
            show: false,
            labelWidth: '128px',
            required: true,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            }
          },

          // 运输员姓名
          shippingAgentName: {
            label: '司机姓名',
            required: true,
            rule: {
              regExp: /^[\u4e00-\u9fa5]{2,10}$|^$|^null$/gi,
              message: '请输入正确的姓名'
            }
          },
          // 运输员电话
          shippingAgentPhone: {
            label: '司机电话',
            width: 120,
            required: true,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            }
          }
        },

        // 新增运输合同方法
        customCreate: (data, finish) => {
          this.submit(data, 'post').then(({ code, message }) => {
            if (code === 0) {
              this.$message.success('添加成功')
              finish()
            } else {
              this.$message.error('添加失败 ' + message)
            }
          })
        },
        // 修改运输合同
        customEdit: (data, finish) => {
          this.submit(data, 'put').then(({ code, message }) => {
            if (code === 0) {
              this.$message.success('修改成功')
              finish()
            } else {
              this.$message.error('修改失败 ' + message)
            }
          })
        }
      },
      // 增删改api
      addUrl: '/carp/business/a/q/transport/contract',
      delUrl: '/carp/business/a/q/transport/contract',
      editUrl: '/carp/business/a/q/transport/contract',
      searchUrl: '/carp/business/a/q/transport/contract/project',
      // 筛选器
      filters: {
        // 项目id
        projectId: {
          label: '搜索项目',
          type: 'subSearch',
          show: [0, 50].includes(this.$userType),
          url: '/carp/business/a/q/project/list',
          value: [0, 50].includes(this.$userType) ? '' : user.accountTypeDto.ancillaryId
        }
      }
    }
  },
  watch: {
    'form.data.type': {
      handler(type) {
        this.formLabelInit(type)
      }
    }
  },
  created() {
    // 获取运输物料种类
    this.getTransportMaterial()
  },
  methods: {
    // 运输物料种类
    getTransportMaterial() {
      this.$http.get('/carp/business/a/q/dict/category/type').then(({ code, data }) => {
        if (code === 0) {
          this.form.label.transportMaterial.item = data.map(item => ({
            label: item.name,
            code: item.id
          }))
        } else {
          this.$message.error('运输物料字典表请求失败')
        }
      })
    },

    // 表单初始化
    // @param flag true:个人 false:运输企业
    formLabelInit(flag) {
      let show = keys => {
        keys.forEach(key => {
          this.$set(this.form.label[key], 'show', true)
        })
      }
      let hide = keys => {
        keys.forEach(key => {
          this.$set(this.form.label[key], 'show', false)
        })
      }
      if (flag) {
        hide(['shipperName', 'shippingName', 'shippingPhone'])
        show(['shippingAgentName', 'shippingAgentPhone'])
      } else {
        show(['shipperName', 'shippingName', 'shippingPhone'])
        hide(['shippingAgentName', 'shippingAgentPhone'])
      }
    },

    // 提交表单
    submit(data, method) {
      if (!data.type) {
        ;['shippingAgentName', 'shippingAgentPhone'].forEach(key => {
          data[key] = null
        })
      } else {
        ;['shipperId', 'shippingName', 'shippingPhone'].forEach(key => {
          data[key] = null
        })
      }
      return this.$http({ method, url: '/carp/business/a/q/transport/contract', data })
    }
  },
  components: {
    tableControl
  }
}
</script>

<style lang="less" scoped></style>
