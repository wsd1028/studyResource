<template>
  <div style="display:flex">
    <table-control
      :formConfig="form"
      addUrl="/carp/business/a/q/gps/save"
      delUrl="/carp/business/a/q/gps"
      editUrl="/carp/business/a/q/gps"
      searchUrl="/carp/business/a/q/car/gps/plate/page"
      add-description="注册车辆GPS"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control="false"
      :filters="filters"
    ></table-control>
  </div>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
export default {
  name: 'carGps',
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

      // 权限
      tablePermission,

      // 筛选器
      filters: {
        phone: {
          label: '终端手机号',
          type: 'search',
          showBt: false,
          value: null
        },
        licensePlate: {
          label: '通过车牌号搜索',
          type: 'search',
          value: null
        }
      },

      // 表操作器
      form: {
        formWidth: '500px',
        label: {
          // 车牌号
          licensePlate: {
            label: '车牌号',
            required: true,
            colType: 'edit',
            span: 24
          },

          // 市县域ID
          cityId: {
            label: '市县域ID',
            span: 24
          },

          // 流水号
          flowId: {
            label: '流水号',
            span: 24
          },

          // 车牌颜色
          licensePlateColor: {
            label: '车牌颜色',
            type: 'select',
            item: [
              { label: '未上车牌', code: 0 },
              { label: '蓝色', code: 1 },
              { label: '黄色', code: 2 },
              { label: '黑色', code: 3 },
              { label: '白色', code: 4 },
              { label: '其他', code: 9 }
            ],
            span: 24
          },

          // 终端制造商编码
          manufacturerId: {
            label: '终端制造商编码',
            labelWidth: '116px',
            span: 24
          },

          // 终端手机号
          phone: {
            label: '终端手机号',
            span: 24
          },

          // 省域ID
          provinceId: {
            label: '省域ID',
            span: 24
          },

          // 终端ID
          terminalId: {
            label: '终端ID',
            span: 24
          },

          // 终端型号
          terminalType: {
            label: '终端型号',
            span: 24
          }
        }
      }
    }
  },
  components: {
    tableControl
  }
}
</script>

<style></style>
