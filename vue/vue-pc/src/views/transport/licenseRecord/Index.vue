<template>
  <table-control
    :form-config="form"
    :allow-add="false"
    :allow-edit="tablePermission.edit"
    :del-url="delUrl"
    :allow-delete="tablePermission.del"
    :search-url="searchUrl"
    :show-control="false"
    :filters="filters"
  />
</template>

<script>
import tableControl from '@/components/CommonTableControl'
export default {
  name: 'licenseRecord',
  data() {
    // 表操作权限
    const uri = this.$store.state.tab.currentMenu ? this.$store.state.tab.currentMenu.uri : ''
    const tablePermission = {
      edit: false,
      del: false
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
      form: {
        label: {
          // 图片
          carPhoto: {
            label: '图片',
            HBase: true,
            colType: 'img',
            real: false
          },
          // 车牌号
          license: {
            label: '车牌号',
            colType: 'edit',
            real: false
          },
          // 设备名称
          deviceName: {
            label: '设备名称',
            real: false
          },
          // 设备id
          serialNumber: {
            label: '设备编号',
            real: false
          },
          // 方向
          directionStr: {
            label: '位置',
            real: false
          },
          // 信用值
          confidence: {
            label: '信用值',
            real: false
          },
          // 运输企业
          transportCompanyName: {
            label: '运输企业',
            real: false
          },
          // 排放企业
          projectCompanyName: {
            label: '排放企业',
            real: false
          },
          // 识别时间
          createDate: {
            label: '识别时间',
            show: false,
            width: 140
          },
          // 是否为名录车
          carState: {
            label: '是否为名录车',
            type: 'radio',
            colType: 'tag',
            item: [
              { label: '名录车', code: true, type: 'success' },
              { label: '非名录车', code: false, type: 'danger' }
            ],
            real: false
          },
          occupancy: {
            label: '是否占用',
            type: 'radio',
            colType: 'tag',
            item: [
              { label: '占用', code: true, type: 'danger' },
              { label: '空闲', code: false, type: 'success' }
            ],
            real: false
          }
        }
      },
      delUrl: '/carp/business/a/q/license/record',
      searchUrl: '/carp/business/a/q/license/record/history/page',
      // 分页筛选
      filters: {
        // 车辆类型
        carType: {
          label: '车辆类型',
          type: 'select',
          item: [
            { label: '运渣车', code: '' },
            { label: '非运渣车', code: 1 }
          ],
          value: ''
        },
        // 是否为名录车
        carState: {
          label: '是否为名录车',
          item: [
            { label: '全部', code: ' ' },
            { label: '名录车', code: 1 },
            { label: '非名录车', code: 0 }
          ],
          value: ''
        },
        // 是否占用
        occupancy: {
          label: '是否占用',
          item: [
            { label: '全部', code: ' ' },
            { label: '占用', code: 1 },
            { label: '空闲', code: 0 }
          ],
          value: ''
        },
        // 工作站类型
        workplaceType: {
          label: '工作站类型',
          placeholder: '选择类型',
          type: 'select',
          item: [
            { label: '全部', code: ' ' },
            { label: '项目', code: '6008' },
            { label: '消纳站', code: '6009' }
          ],
          change: code => {
            if (code == '6008') {
              this.filters.workplaceId.show = true
              this.filters.workplaceId.label = '搜索项目'
              this.filters.workplaceId.url = '/carp/business/a/q/project/list'
            } else if (code == '6009') {
              this.filters.workplaceId.show = true
              this.filters.workplaceId.label = '搜索消纳站'
              this.filters.workplaceId.url = '/carp/business/a/q/garbage/station/page'
            } else {
              this.filters.workplaceId.show = false
            }
          },
          value: ''
        },
        // 项目id
        workplaceId: {
          label: '搜索项目',
          type: 'subSearch',
          show: false,
          url: '/carp/business/a/q/project/list',
          value: ''
        },
        // 日期
        time: {
          label: '年份',
          type: 'select',
          item: [
            { label: '2020年', code: '2020' },
            { label: '2021年', code: '2021' },
            { label: '2022年', code: '2022' }
          ],
          value: '2020'
        },
        // 车牌号
        license: {
          label: '车牌号',
          type: 'search'
        }
      }
    }
  },
  components: {
    tableControl
  }
}
</script>
