<template>
  <div class="container">
    <common-table-control
      :formConfig="form"
      :addUrl="addUrl"
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
        { label: '售后服务点', key: 'saleService' },
        { label: '设备商授权', key: 'device' }
      ]"
      @bindButtonClick="handleClick"
    ></common-table-control>
    <el-dialog v-if="saleServiceShow" top="4vh" :visible="true" @close="saleServiceShow = false">
      <template slot="title">
        <span>售后服务点</span>
        <el-tag size="mini" type="success" v-text="manufacturer.name"></el-tag>
      </template>
      <sale-service :manufacturer="manufacturer"></sale-service>
    </el-dialog>
    <el-dialog v-if="deviceShow" :visible="true" @close="deviceShow = false">
      <template slot="title">
        <span>设备商授权</span>
        <el-tag size="mini" type="success" v-text="manufacturer.name"></el-tag>
      </template>
      <device-bind
        :manufacturer="manufacturer"
        :close="
          () => {
            deviceShow = false
          }
        "
      ></device-bind>
    </el-dialog>
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import saleService from './SaleService'
import deviceBind from './Device'
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
    return {
      // 表操作权限
      tablePermission,

      // 售后服务点弹窗显示控制器
      saleServiceShow: false,

      // 设备商授权弹窗显示控制器
      deviceShow: false,

      // 点击售后服务点后获取到的接入厂商详情
      manufacturer: {},

      // 表单配置
      form: {
        formWidth: '500px',
        tableControlWidth: '130px',
        // 表格标题
        label: {
          // 厂商名称
          name: {
            label: '厂商名称',
            colType: 'edit',
            width: 200,
            span: 24,
            rule: {
              regExp: /^./g,
              message: '厂商名称不能为空'
            }
          },
          // 备注
          note: {
            label: '备注',
            width: 400,
            type: 'textarea',
            rows: 3,
            maxlength: 120,
            span: 24,
            data: data => data.substr(0, 30) + '...'
          },
          // 是否启用
          enable: {
            label: '当前状态',
            type: 'radio',
            colType: 'switch',
            url: '/carp/device/a/q/device/agent',
            show: false,
            span: 24,
            width: 120,
            default: true,
            item: [
              { label: '启用', code: true, type: 'success' },
              { label: '禁用', code: false, type: 'danger' }
            ]
          }
        }
      },
      addUrl: '/carp/device/a/q/device/agent',
      delUrl: '/carp/device/a/q/device/agent',
      editUrl: '/carp/device/a/q/device/agent',
      searchUrl: '/carp/device/a/q/device/agent/list',
      // 筛选器
      filters: {
        // 厂商名称
        name: {
          label: '厂商名称搜索',
          type: 'search',
          value: ''
        }
      }
    }
  },
  methods: {
    handleClick({ row, key }) {
      this.manufacturer = row
      switch (key) {
        case 'saleService':
          this.saleServiceShow = true
          break
        case 'device':
          this.deviceShow = true
          break
      }
    }
  },
  components: {
    commonTableControl,
    saleService,
    deviceBind
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
