<template>
  <div class="container">
    <common-table-control
      :formConfig="form"
      :addUrl="addUrl"
      addDescription="设备登记"
      :delUrl="delUrl"
      :editUrl="editUrl"
      :searchUrl="searchUrl"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control-del="false"
      :show-control-edit="false"
      :filters="filters"
      :bind-buttons="[
        { label: '修改申请', key: 'handleDeviceEdit' },
        { label: '移机申请', type: 'warning', key: 'handleDeviceMove' }
      ]"
    ></common-table-control>
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
export default {
  name: 'manufacturerRegister',
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
        formWidth: '1000px',
        formHeight: 'auto',
        tableControlWidth: '206px',
        onBeforeAddShow: () => {
          this.form.label.videoUrl.show = true
        },
        onBeforeEditShow: data => {
          this.form.label.videoUrl.show = data.type == 202
        },
        customEdit: (data, finish) => {
          data.lastUpdateUpms = user.id
          this.$http.put(this.editUrl, data).then(({ code, message }) => {
            if (code === 0) {
              this.$message.success('修改成功')
              finish()
            } else {
              finish(message)
            }
          })
        },
        // 表格标题
        label: {
          // 是否标准设备
          dustType: {
            label: '标准设备',
            type: 'select',
            props: {
              label: 'name',
              code: 'id'
            },
            item: (() => {
              this.$http.get('/carp/business/a/q/dict/category/dustType').then(({ code, data }) => {
                if (code === 0) {
                  this.form.label.dustType.item = data
                  this.form.label.dustType.default = data[0].id
                } else {
                  this.$message.error('设备类型请求失败')
                }
              })
              return []
            })(),
            required: true,
            span: 12
          },
          // 是否基准设备
          isBasics: {
            label: '基准设备',
            type: 'radio',
            span: 12,
            item: [
              { label: '是', code: true },
              { label: '否', code: false }
            ],
            required: true,
            default: false
          },
          // 设备名称
          deviceName: {
            label: '设备名称',
            required: true,
            span: 12
          },
          // 设备序列号
          sn: {
            label: '设备序列号',
            colType: 'edit',
            width: 136,
            required: true,
            span: 12
          },
          // 设备厂商
          manufacturerId: {
            label: '设备厂商',
            type: 'select',
            span: 12,
            props: {
              label: 'name',
              code: 'id'
            },
            required: true,
            item: (() => {
              this.$http
                .get('/carp/device/a/q/device/agent/manufactures', {
                  params: {
                    id: user.accountTypeDto.ancillaryId
                  }
                })
                .then(({ code, data, message }) => {
                  if (code === 0) {
                    this.form.label.manufacturerId.item = data || []
                  } else {
                    this.$message.error('请求失败：' + message)
                  }
                })
            })(),
            // 当前账号类型为设备厂商默认当前厂商id
            show: ![80].includes(this.$userType),
            default: [80].includes(this.$userType) ? user.accountTypeDto.ancillaryId : null
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
                } else {
                  this.$message.error('未获取到固定源类型: ' + message)
                }
              })
              return []
            })(),
            span: 12,
            required: true
          },
          // 固定源名称
          fixedSourceName: {
            label: '固定源名称',
            width: 300,
            placeholder: '请填写完整的工程名称',
            required: true,
            span: 12
          },
          keyId: {
            label: 'keyId',
            width: 220,
            show: false,
            colShow: false,
            real: false,
            span: 12
          },
          keySecret: {
            label: 'keySecret',
            width: 220,
            show: false,
            colShow: false,
            real: false,
            span: 12
          },
          // 设备类型
          type: {
            label: '设备类型',
            type: 'select',
            item: [],
            props: {
              label: 'name',
              code: 'code'
            },
            width: 120,
            required: true,
            default: null,
            span: 12,
            change: type => {
              this.form.label.videoUrl.show = type == 202
            }
          },
          // 设备型号
          model: {
            label: '设备型号',
            required: true,
            span: 12
          },
          // 联系人
          linkman: {
            label: '联系人',
            width: 80,
            required: true,
            span: 12
          },
          // 联系人电话
          phone: {
            label: '联系人电话',
            width: 120,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            },
            required: true,
            span: 12
          },
          // 设备批次
          batch: {
            label: '设备批次',
            span: 12,
            required: true
          },
          // 设备定位
          location: {
            label: '设备定位',
            type: 'map',
            span: 12,
            real: false,
            // 定位相关配置
            target: {
              lng: 'lng',
              lat: 'lat'
            },
            colShow: false,
            required: true
          },
          // 现场编号
          sceneNumber: {
            label: '现场编号',
            span: 12
          },
          // 设备位置描述
          local: {
            label: '设备位置描述',
            span: 12
          },
          videoUrl: {
            label: '视频URL',
            span: 24,
            width: 300,
            show: true
          },
          // 备注
          note: {
            label: '备注',
            type: 'textarea',
            rows: 3,
            span: 24,
            width: 140
          },
          // 经度
          lng: {
            label: '经度',
            type: 'number',
            allowReset: true,
            colShow: false,
            show: false
          },
          // 纬度
          lat: {
            label: '纬度',
            type: 'number',
            allowReset: true,
            colShow: false,
            show: false
          },
          // 接入商id
          agentId: {
            show: false,
            colShow: false,
            default: [90].includes(this.$userType) ? user.accountTypeDto.ancillaryId : null
          },
          // 修改人员id
          lastUpdateUpms: {
            show: false,
            colShow: false,
            default: user.id
          }
        },
        tableSort: [
          'sn',
          'type',
          'deviceName',
          'fixedSourceName',
          'fixedSourceType',
          'dustType',
          'isBasics',
          'keyId',
          'keySecret',
          'videoUrl',
          'model',
          'linkman',
          'phone',
          'note'
        ]
      },
      addUrl: '/carp/device/a/q/device/register',
      delUrl: '/carp/device/a/q/device/register',
      editUrl: '/carp/device/a/q/device/register',
      searchUrl: '/carp/device/a/q/device/register',
      // 筛选器
      filters: {
        // 设备类型
        type: {
          label: '设备类型',
          type: 'select',
          props: {
            label: 'name'
          },
          item: [],
          value: 202
        },
        // 用户类型 设备厂商-1 接入厂商-2
        userType: {
          show: [0, 50].includes(this.$userType),
          type: 'select',
          item: [
            { label: '设备厂商', code: 1 },
            { label: '接入厂商', code: 2 }
          ],
          value: [0, 50].includes(this.$userType) ? 1 : { 80: 1, 90: 2 }[this.$userType]
        },
        // 用户id
        generalId: {
          show: false,
          value: [0, 50].includes(this.$userType) ? null : user.accountTypeDto.ancillaryId
        }
      }
    }
  },
  created() {
    // 获取设备类型
    this.$http.get('/carp/business/a/q/dict/category/deviceType').then(({ code, data }) => {
      if (code === 0) {
        this.form.label.type.item = data.map(item =>
          Object.assign(item, {
            type: parseInt(item.type)
          })
        )
        this.form.label.type.default = this.form.label.type.item[0].code
        this.filters.type.item = data
        this.filters.type.value = data[0].code
      } else {
        this.$message.error('获取文件类型字典表失败')
      }
    })
  },
  components: {
    commonTableControl
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/common';
.container {
  flex: auto;
  height: 0;
  @flex-column();
}
</style>
