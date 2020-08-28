<template>
  <div class="container">
    <common-table-control
      ref="tableControl"
      :formConfig="form"
      :delUrl="delUrl"
      :editUrl="editUrl"
      :searchUrl="searchUrl"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :filters="filters"
      :allowExport="false"
      :bind-buttons="[
        { label: '注册', key: 'reg', icon: 'iconfont-copyright' },
        { label: 'K系数校验', key: 'coefficient', icon: 'el-icon-setting' },
        { label: '告警策略', key: 'alarm', icon: 'el-icon-bell' }
      ]"
      @bindButtonClick="getRow"
    ></common-table-control>

    <!-- 注册弹窗 -->
    <el-dialog class="dialog" :show-close="false" v-if="regDialogShow" :visible="true" width="40%">
      <div slot="title">
        <span style="margin-right:4px">设备管理</span>
        <el-tag type="success" size="mini" v-text="device.sn"></el-tag>
      </div>
      <!-- 绑定操作表单 -->
      <reg-bind
        :info="device"
        @close="
          regDialogShow = false
          $refs.tableControl.getList()
        "
      ></reg-bind>
    </el-dialog>
    <!-- 注册弹窗end -->

    <!-- K系数校验 -->
    <el-dialog class="dialog" :show-close="false" v-if="coefficientShow" :visible="true" width="40%">
      <div slot="title">
        <span style="margin-right:4px">K系数校验</span>
        <el-tag type="success" size="mini" v-text="device.sn"></el-tag>
      </div>
      <!-- 绑定操作表单 -->
      <coefficient-bind
        :info="device"
        @close="
          coefficientShow = false
          $refs.tableControl.getList()
        "
      ></coefficient-bind>
    </el-dialog>
    <!-- K系数校验end -->

    <!-- 告警策略 -->
    <el-dialog class="dialog" :show-close="false" v-if="alarmShow" :visible="true" width="40%">
      <div slot="title">
        <span style="margin-right:4px">告警策略</span>
        <el-tag type="success" size="mini" v-text="device.sn"></el-tag>
      </div>
      <!-- 绑定操作表单 -->
      <alarm-bind
        :info="device"
        @close="
          alarmShow = false
          $refs.tableControl.getList()
        "
      ></alarm-bind>
    </el-dialog>
    <!-- 告警策略end -->
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import regBind from './RegBind'
import coefficientBind from './CoefficientBind'
import alarmBind from './AlarmBind'
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
      // 表单配置
      form: {
        // 表格标题
        label: {
          // 报警策略，单位小时
          alarmStrategy: {
            label: '报警策略',
            type: 'number',
            unit: '小时',
            show: false,
            colShow: false,
            rule: {
              regExp: /^\d{1,20}$/g,
              message: '只能是数字且不能为空'
            }
          },

          // 设备厂商ID
          manufacturer: {
            label: '设备厂商',
            type: 'search',
            colShow: false,
            show: false,
            allowReset: false,
            placeholder: '搜索设备厂商',
            // 分页请求地址
            url: '/carp/device/a/q/manufacturer',
            target: 'manufacturerId',
            real: false,
            rule: {
              regExp: /./g,
              message: '不能为空'
            }
          },

          // 设备厂商id
          manufacturerId: {
            show: false,
            colShow: false
          },

          // 监控站点id
          monitorSiteId: {
            label: '监控站点',
            show: false,
            colShow: false,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },

          // 设备序列号
          sn: {
            label: '设备序列号',
            width: 200,
            show: false,
            allowReset: false,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },

          // 是否启用 0 禁用 1 启用
          enable: {
            label: '是否启用',
            type: 'radio',
            show: false,
            colType: 'switch',
            change: row => {
              this.$http
                .put(
                  '/carp/device/a/q/dust/info/status',
                  this.$qs.stringify({
                    sn: row.sn,
                    status: row.enable
                  })
                )
                .then(({ code }) => {
                  if (code !== 0) {
                    this.$message.error('网络错误')
                  }
                  this.$refs.tableControl.getList()
                })
            },
            item: [
              { label: '启用', code: 1, type: 'success' },
              { label: '禁用', code: 0, type: 'danger' }
            ],
            default: 1
          },

          // led开关状态 0:关 1:开
          ledStatus: {
            label: 'led状态',
            type: 'radio',
            show: false,
            colType: 'switch',
            change: row => {
              this.$http
                .put(
                  '/carp/device/a/q/dust/info/led',
                  this.$qs.stringify({
                    sn: row.sn,
                    ledStatus: row.ledStatus
                  })
                )
                .then(({ code }) => {
                  if (code !== 0) {
                    this.$message.error('网络错误')
                  }
                  this.$refs.tableControl.getList()
                })
            },
            item: [
              { label: '开', code: 1, type: 'success' },
              { label: '关', code: 0, type: 'danger' }
            ],
            default: 0
          },

          // 喷淋开关状态 0:关 1:开
          sprayStatus: {
            label: '喷淋开关状态',
            type: 'radio',
            show: false,
            colType: 'switch',
            change: row => {
              this.$http
                .put(
                  '/carp/device/a/q/dust/info/spray',
                  this.$qs.stringify({
                    sn: row.sn,
                    sprayStatus: row.sprayStatus
                  })
                )
                .then(({ code }) => {
                  if (code !== 0) {
                    this.$message.error('网络错误')
                  }
                  this.$refs.tableControl.getList()
                })
            },
            item: [
              { label: '开', code: 1, type: 'success' },
              { label: '关', code: 0, type: 'danger' }
            ],
            default: 0
          },

          // 0: 待注册 1已注册
          status: {
            label: '是否注册',
            type: 'radio',
            show: false,
            colType: 'tag',
            item: [
              { label: '已注册', code: 1, type: 'success' },
              { label: '待注册', code: 0, type: 'danger' }
            ],
            default: 0
          },

          // 设备其他信息
          deviceOtherInfo: {
            label: '其他信息',
            width: 300,
            show: false,
            real: false
          }
        }
      },
      addUrl: '/carp/device/a/q/dust/info',
      delUrl: '/carp/device/a/q/dust/info/deviceId',
      editUrl: '/carp/device/a/q/dust/info',
      searchUrl: '/carp/device/a/q/dust/info',
      // 当前选中设备信息
      device: {},
      // 注册操作弹窗显示控制
      regDialogShow: false,
      // K系数校验弹窗显示控制
      coefficientShow: false,
      // 告警策略弹窗显示控制
      alarmShow: false,
      // 筛选器
      filters: {
        enable: {
          label: '是否禁用',
          type: 'select',
          value: '',
          item: [
            { label: '已启用', code: 1 },
            { label: '已禁用', code: 0 }
          ]
        },
        status: {
          label: '是否注册',
          type: 'select',
          value: '',
          item: [
            { label: '已注册', code: 1 },
            { label: '待注册', code: 0 }
          ]
        },
        sn: {
          label: '设备号',
          type: 'search',
          value: ''
        }
      }
    }
  },
  watch: {
    'form.data.manufacturerId': {
      handler(id) {
        if (!id) return
        this.$http.get(`/carp/device/a/q/manufacturer/${id}`).then(({ code, data }) => {
          if (code === 0) {
            this.form.data.manufacturer = data.name
          }
        })
      }
    }
  },
  methods: {
    /* *
     * 获取行
     * * */
    getRow({ row, key }) {
      this.device = row
      switch (key) {
        case 'reg':
          this.regDialogShow = true
          break

        case 'coefficient':
          this.coefficientShow = true
          break

        case 'alarm':
          this.alarmShow = true
          break

        default:
          break
      }
    }
  },
  components: {
    commonTableControl,
    regBind,
    coefficientBind,
    alarmBind
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
