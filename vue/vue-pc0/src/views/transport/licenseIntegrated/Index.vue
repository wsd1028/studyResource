<template>
  <div class="container">
    <common-table-control
      :formConfig="form"
      :addUrl="addUrl"
      :delUrl="delUrl"
      :editUrl="editUrl"
      :searchUrl="searchUrl"
      :filters="filters"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control="false"
    ></common-table-control>
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import { workStationDict } from '@/libs/dict'
export default {
  name: 'integratedLicense',
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
        labelPosition: 'top',
        formWidth: '500px',
        data: {
          // 修改人id
          modifyPerson: this.$store.state.user.userInfo.id
        },
        // 表格标题
        label: {
          // 创建人id
          createPerson: {
            show: false,
            colShow: false,
            default: this.$store.state.user.userInfo.id
          },
          // 设备序列号
          serialNumber: {
            label: '设备序列号',
            labelWidth: '82px',
            colType: 'edit',
            width: 160,
            span: 24,
            required: true
          },
          // 判断是消纳站还是项目
          type: {
            label: '类型',
            type: 'select',
            item: workStationDict.slice(1, 3),
            change: type => {
              this.form.data.workplaceId = ''
              if (type == workStationDict[1].code) {
                this.form.label.workplaceId.type = 'project'
              } else {
                this.form.label.workplaceId.type = 'garbageStation'
              }
            },
            default: workStationDict[1].code,
            colShow: false,
            span: 24,
            required: true
          },
          workplaceName: {
            label: '工作站',
            show: false
          },
          workplaceId: {
            label: '工作站',
            type: 'project',
            labelWidth: '70px',
            width: 220,
            span: 24,
            colShow: false,
            required: true,
            change: ({ node }) => {
              this.form.data.workplaceName = node.projectName || node.name
            }
          },
          // 车辆进出方向
          direction: {
            label: '车辆进出方向',
            labelWidth: '100px',
            type: 'radio',
            colType: 'tag',
            item: [
              { label: '进', code: 6, type: 'primary' },
              { label: '出', code: 7, type: 'warning' }
            ],
            span: 24,
            default: 6,
            required: true
          },
          // 是否在线
          online: {
            label: '在线状态',
            show: false,
            colType: 'tag',
            span: 24,
            item: [
              { label: '在线', code: true, type: 'success' },
              { label: '离线', code: false, type: 'danger' }
            ],
            required: true
          },
          // 备注
          remarks: {
            label: '备注',
            type: 'textarea',
            width: 200,
            rows: 3,
            span: 24,
            maxlength: 200
          }
        }
      },
      // 增删改api
      addUrl: '/carp/business/a/q/license/integrated/license',
      delUrl: '/carp/business/a/q/license/integrated/license',
      editUrl: '/carp/business/a/q/license/integrated/license',
      searchUrl: '/carp/business/a/q/license/integrated/project/page',
      // 筛选器
      filters: {
        // 类型选择
        type: {
          label: '类型选择',
          type: 'select',
          item: [{ label: '全部', code: '' }].concat(workStationDict.slice(1, 3)),
          show: [0, 50].includes(this.$userType),
          value: null,
          change: type => {
            this.filters.workplaceId.value = ''
            this.$set(this.filters.workplaceId, 'item', [])
            if (type == workStationDict[1].code) {
              this.filters.workplaceId.show = true
              this.filters.workplaceId.placeholder = '搜索项目'
              this.filters.workplaceId.url = '/carp/business/a/q/project/list'
            } else if (type == workStationDict[2].code) {
              this.filters.workplaceId.show = true
              this.filters.workplaceId.placeholder = '搜索消纳站'
              this.filters.workplaceId.url = '/carp/business/a/q/garbage/station/page'
            } else {
              this.filters.workplaceId.show = false
            }
          }
        },
        // 项目或消纳站
        workplaceId: {
          label: '搜索项目',
          url: '/carp/business/a/q/project/list',
          type: 'subSearch',
          value: [0, 50].includes(this.$userType) ? '' : user.accountTypeDto.ancillaryId,
          show: false
        },
        // 设备序列号
        serialNumber: {
          label: '序列号',
          placeholder: '根据序列号搜索',
          type: 'search',
          value: ''
        }
      }
    }
  },
  watch: {
    'form.data.type': {
      handler(type) {
        this.form.label.workplaceId.type = type == workStationDict[1].code ? 'project' : 'garbageStation'
      }
    }
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
