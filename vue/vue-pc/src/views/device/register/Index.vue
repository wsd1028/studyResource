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
      :show-control="false"
      :filters="filters"
    ></common-table-control>
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
export default {
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
        formWidth: '500px',
        formHeight: '60vh',
        // 表单数据
        data: {},
        // 表格标题
        label: {
          manufacturerId: {
            show: false,
            colShow: false,
            default: user.accountTypeDto.ancillaryId
          },
          // 设备序列号
          sn: {
            label: '设备序列号',
            colType: 'edit',
            width: 136,
            required: true,
            span: 24
          },
          // 工程名称
          projectName: {
            label: '工程名称',
            width: 200,
            placeholder: '请填写完整的工程名称',
            required: true,
            span: 24
          },
          keyId: {
            label: 'keyId',
            width: 220,
            show: false,
            real: false,
            span: 24
          },
          keySecret: {
            label: 'keySecret',
            width: 220,
            show: false,
            real: false,
            span: 24
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
            required: true,
            default: null,
            span: 24
          },
          // 设备型号
          model: {
            label: '设备型号',
            required: true,
            span: 24
          },
          // 联系人
          linkman: {
            label: '联系人',
            width: 60,
            required: true,
            span: 24
          },
          // 联系人电话
          phone: {
            label: '联系人电话',
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            },
            required: true,
            span: 24
          },
          // 项目定位
          location: {
            label: '项目定位',
            type: 'map',
            colShow: false,
            span: 24,
            real: false,
            // 定位相关配置
            target: {
              lng: 'lng',
              lat: 'lat'
            },
            required: true
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
            show: false,
            colShow: false
          },
          // 纬度
          lat: {
            label: '纬度',
            type: 'number',
            allowReset: true,
            show: false,
            colShow: false
          }
        }
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
          item: []
        },
        // 厂商名称
        name: {
          label: '厂商名称搜索',
          type: 'search',
          show: [0].includes(this.$userType),
          value: ''
        },
        manufacturerId: {
          show: false,
          value: [0].includes(this.$userType) ? '' : user.accountTypeDto.ancillaryId
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
