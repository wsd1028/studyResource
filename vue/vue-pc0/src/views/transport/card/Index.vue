<template>
  <common-table-control
    ref="table"
    :formConfig="form"
    :addUrl="addUrl"
    :delUrl="delUrl"
    :editUrl="editUrl"
    :searchUrl="searchUrl"
    :show-search="false"
    :allow-add="tablePermission.add"
    :allow-delete="tablePermission.del"
    :allow-edit="tablePermission.edit"
    :show-control-edit="false"
    :show-control-del="false"
    :filters="filters"
    :bind-buttons="[0, 50].includes($userType) ? [{ label: '审核', rule: { regExp: /^false$/, key: 'approvalState' } }] : []"
    @bindButtonClick="review"
  ></common-table-control>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
export default {
  name: 'transportCertificate',
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
      user,
      // 表操作权限
      tablePermission,
      // 表单配置
      form: {
        labelWidth: '72px',
        label: {
          // 图片
          imgList: {
            label: '图片',
            type: 'uploadImgs',
            colShow: false,
            default: [],
            span: 24,
            // 上传请求地址
            url: '/carp/file/a/q/file/upload/files/base_image',
            // 文件上传前执行该钩子
            before: file => {
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
              }
              return isLt2M
            },
            // 文件上传成功后执行该钩子
            success: ({ code }) => {
              if (code !== 4002) {
                this.$message.error('图片上传失败')
              }
            }
          },
          // 车牌
          licensePlate: {
            label: '车牌',
            colType: 'edit',
            rule: {
              regExp: /^[\u4e00-\u9fa5][A-Z][0-9A-Z]{5,6}[\u4e00-\u9fa5]?$/gi,
              message: '填写正确的车牌号'
            },
            required: true
          },
          licensePlateId: {
            show: false,
            colShow: false,
            default: null
          },
          // 项目
          projectId: {
            label: '项目',
            type: 'project',
            area: user.accountTypeDto.code,
            show: [0, 50].includes(this.$userType),
            colShow: false,
            required: true,
            default: [0, 50].includes(this.$userType) ? '' : user.accountTypeDto.ancillaryId,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          // 消纳站id
          garbageId: {
            label: '消纳站',
            type: 'garbageStation',
            colShow: false,
            required: true,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          // 运输公司名称
          companyName: {
            label: '运输公司',
            placeholder: '搜索运输企业',
            width: 120,
            type: 'company',
            companyType: '145',
            target: 'companyId',
            real: false
          },
          // 运输公司ID
          companyId: {
            show: false,
            colShow: false,
            default: null
          },
          // 消纳站名称
          garbageName: {
            label: '消纳站名称',
            width: '160',
            show: false,
            real: false
          },
          // 司机姓名
          driverName: { label: '司机姓名', default: null },
          // 司机电话
          driverPhone: { label: '司机电话', default: null },
          // 审批状态
          approvalState: {
            label: '审批状态',
            type: 'radio',
            colType: 'tag',
            item: [
              { label: '已审批', code: true, type: 'success' },
              { label: '未审批', code: false, type: 'danger' }
            ],
            span: 24,
            required: true,
            default: true
          },
          // 是否过期
          overDue: {
            label: '是否过期',
            colType: 'tag',
            show: false,
            item: [
              { label: '已过期', code: true, type: 'danger' },
              { label: '未过期', code: false, type: 'success' }
            ],
            real: false
          },
          // 有效期
          expiryDate: {
            label: '有效期开始日期',
            labelWidth: '120px',
            type: 'date',
            dataType: 'date',
            colShow: false,
            format: 'yyyy年MM月dd日',
            span: 12,
            width: 160,
            default: null
          },
          // 结束时间
          endDate: {
            label: '有效期结束日期',
            labelWidth: '120px',
            type: 'date',
            dataType: 'date',
            format: 'yyyy年MM月dd日',
            span: 12,
            width: 160,
            default: null
          },
          // 准行开始时间
          travelBeginDate: {
            label: '准行开始时间',
            labelWidth: '120px',
            colShow: false,
            span: 12,
            type: 'time',
            default: null
          },
          // 准行结束时间
          travelEndDate: {
            label: '准行结束时间',
            labelWidth: '120px',
            colShow: false,
            span: 12,
            type: 'time',
            default: null
          }
        }
      },
      // 增删改api
      addUrl: '/carp/business/a/q/transport/certificate/insert',
      delUrl: '/carp/business/a/q/transport/certificate',
      editUrl: '/carp/business/a/q/transport/certificate',
      searchUrl: '/carp/business/a/q/transport/certificate/project',
      // 筛选器
      filters: {
        // 项目id
        projectId: {
          label: '搜索项目',
          type: 'subSearch',
          url: '/carp/business/a/q/project/list',
          show: [0, 50].includes(this.$userType),
          value: [0, 50].includes(this.$userType) ? '' : user.accountTypeDto.ancillaryId
        },
        approvalState: {
          label: '审批状态',
          type: 'select',
          item: [
            { label: '全部', code: '' },
            { label: '已审批', code: 1 },
            { label: '未审批', code: 0 }
          ],
          value: null
        }
      }
    }
  },
  methods: {
    // 审批
    review({ row }) {
      this.$confirm(row.projectName, ' 确定审批', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .put('/carp/business/a/q/transport/certificate/update', {
            id: row.id
          })
          .then(({ code, message }) => {
            if (code === 0) {
              this.$message.success('已审批')
            } else {
              this.$message.error('请求失败: ' + message)
            }
          })
      })
    }
  },
  components: {
    commonTableControl
  }
}
</script>
