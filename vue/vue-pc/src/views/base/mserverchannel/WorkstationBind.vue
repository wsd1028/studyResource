<template>
  <common-table-control
    :form-config="form"
    add-url="/carp/business/a/q/business/msworklive"
    del-url="/carp/business/a/q/business/msworklive"
    search-url="/carp/business/a/q/business/msworklive/channel/list"
    :allow-edit="false"
    :show-control="false"
    :filters="filters"
    style="height:60vh;margin:-20px 0 -10px 0"
  ></common-table-control>
</template>

<script>
import commonTableControl from '@/components/CommonTableControl'
export default {
  name: 'workstationServerChannelBind',
  props: {
    mserverchannel: Object
  },
  data() {
    const workTypes = [
      { label: '项目', code: 'fixed_source_project' },
      { label: '消纳站', code: 'fixed_source_garbage_station' },
      { label: '公共区域', code: 'fixed_source_public_area' }
    ]

    return {
      form: {
        formHeight: 'auto',
        onBeforeAddShow: () => {
          this.form.label.workId.type = 'project'
        },
        label: {
          // 检测点id
          channelIdentifier: {
            show: false,
            colShow: false,
            default: this.mserverchannel.channelIdentifier
          },

          // 工作站类型
          workType: {
            label: '工作站类型',
            type: 'select',
            item: workTypes,
            change: type => {
              this.form.label.workId.type = {
                fixed_source_project: 'project',
                fixed_source_garbage_station: 'garbageStation',
                fixed_source_public_area: 'publicArea'
              }[type]
            },
            default: 'fixed_source_project',
            span: 24
          },

          // 工作站id
          workId: {
            label: '工作站',
            type: 'project',
            colShow: false,
            change: ({ node }) => {
              this.form.data.workName = node.projectName || node.name
            },
            span: 24
          },

          // 工作站名称
          workName: {
            label: '工作站',
            show: false
          },

          // 创建日期
          createDate: {
            label: '创建日期',
            show: false
          },

          // 修改日期
          modifyDate: {
            label: '修改日期',
            show: false
          }
        }
      },

      filters: {
        channelIdentifier: {
          show: false,
          value: this.mserverchannel.channelIdentifier
        },
        workType: {
          label: '工作站类型',
          type: 'select',
          item: [{ label: '全部', code: null }].concat(workTypes),
          value: null
        }
      }
    }
  },
  components: {
    commonTableControl
  }
}
</script>

<style></style>
