<template>
  <table-control
    ref="table"
    :formConfig="form"
    :delUrl="delUrl"
    :searchUrl="searchUrl"
    :allowAdd="false"
    :allowEdit="false"
    :allowExport="false"
    :show-control-edit="false"
    :show-control-del="false"
    :filters="filters"
    :bind-buttons="
      [0, 50].includes($userType) ? [{ label: '审核', type: 'primary', icon: 'el-icon-check', rule: { regExp: /5050/, key: 'disposeState' } }] : []
    "
    @bindButtonClick="review"
  ></table-control>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
import { workStationDict, warningStateDict } from '@/libs/dict'
export default {
  data() {
    const user = this.$store.state.user.userInfo
    return {
      // 登录用户
      user,

      // 表单配置
      form: {
        label: {
          // 图片
          photo: {
            label: '图片',
            width: 160,
            colType: 'img',
            HBase: true
          },
          // 固定源名称
          workplaceName: {
            label: '固定源',
            width: 220,
            show: false,
            real: false
          },
          // 审核状态
          disposeState: {
            label: '审核状态',
            colType: 'tag',
            item: warningStateDict.map(item =>
              Object.assign(item, {
                code: parseInt(item.code)
              })
            )
          },
          // 车牌
          license: {
            label: '车牌'
          },
          // 告警分类
          code: {
            label: '告警分类',
            colType: 'tag',
            item: []
          },
          // 方向
          directionStr: {
            label: '方向'
          },
          // 描述
          note: {
            label: '描述'
          },
          // 告警时间
          violationDate: {
            label: '告警时间'
          }
        }
      },

      // 增删改api
      delUrl: '/carp/business/a/q/warning/list',
      searchUrl: `/carp/business/a/q/warning/list/page`,

      // 筛选器
      filters: {
        // 开始时间
        startTime: {
          label: '开始时间',
          type: 'date'
        },
        // 结束时间
        endTime: {
          label: '结束时间',
          name: '-',
          type: 'date',
          value: this.$moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        },
        // 处理状态
        disposeState: {
          label: '处理状态',
          type: 'select',
          item: [{ label: '全部', code: null }].concat(warningStateDict),
          value: ''
        },
        // 告警分类
        code: {
          label: '告警分类',
          type: 'select',
          item: [],
          value: ''
        },
        // 固定源类型
        type: {
          label: '固定源类型',
          type: 'select',
          show: [0, 50].includes(this.$userType),
          item: [{ label: '全部', code: '' }].concat(workStationDict.slice(1, 3)),
          change: code => {
            if (code == workStationDict[1].code) {
              this.filters.projectName.show = true
              this.filters.projectName.label = '搜索项目'
            } else if (code == workStationDict[2].code) {
              this.filters.projectName.show = true
              this.filters.projectName.label = '搜索消纳站'
            }
          },
          value: { 0: null, 30: workStationDict[1].code, 60: workStationDict[2].code }[this.$userType]
        },
        // 固定源名称
        projectName: {
          label: '搜索固定源',
          show: [0, 50].includes(this.$userType),
          type: 'search',
          showBt: false,
          value: ''
        },
        plateNumber: {
          label: '车牌号',
          type: 'search',
          value: ''
        },
        // 固定源id
        workplaceId: {
          show: false,
          value: [0, 50].includes(this.$userType) ? null : user.accountTypeDto.ancillaryId
        }
      }
    }
  },
  created() {
    this.getWarningCode()
  },
  methods: {
    // 获取告警分类字典表
    getWarningCode() {
      this.$http.get('/carp/business/a/q/dict/category/warning').then(({ code, data }) => {
        if (code === 0) {
          this.form.label.code.item = data.map(item => ({
            label: item.name,
            code: item.id,
            type: 'warning'
          }))
          this.filters.code.item = [{ label: '全部', code: ' ' }].concat(this.form.label.code.item)
        } else {
          this.$message.error('告警分类字典表请求失败')
        }
      })
    },
    // 审核按钮事件
    review({ row }) {
      console.log(row)
      this.$confirm(row.workplaceName, ' 确定审核', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .catch()
        .then(() => {
          this.$http
            .put(
              '/carp/business/a/q/warning/list/dispose',
              {},
              {
                params: {
                  accountId: this.user.id,
                  id: row.id
                }
              }
            )
            .then(({ code, message }) => {
              if (code === 0) {
                this.$message.success(row.workplaceName + ' 已审核')
                this.$refs.table.getList()
              } else {
                this.$message.error('网络出错: ' + message)
              }
            })
        })
    }
  },
  components: {
    tableControl
  }
}
</script>

<style lang="less" scoped></style>
