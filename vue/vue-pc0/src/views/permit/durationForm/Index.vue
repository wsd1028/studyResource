<template>
  <table-control
    :form-config="form"
    :allow-add="tablePermission.add"
    :allow-edit="tablePermission.edit"
    :allow-delete="tablePermission.del"
    :add-url="addUrl"
    :del-url="delUrl"
    :edit-url="editUrl"
    :search-url="searchUrl"
    :show-control="false"
    add-description="添加工期管理"
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

    // 登录用户
    const user = this.$store.state.user.userInfo

    return {
      user,
      // 表操作权限
      tablePermission,
      form: {
        formHeight: '40vh',
        label: {
          /* *
           * 分页展示数据
           * * */
          // 项目名称
          name: {
            label: '项目名称',
            show: false,
            colType: 'edit',
            real: false
          },
          // 项目进度
          state: {
            label: '项目进度',
            show: false,
            real: false
          },
          // 所属区域
          fullName: {
            label: '所属区域',
            show: false,
            real: false
          },

          /* *
           * 新增时传递数据
           * * */
          // 项目id
          projectId: {
            label: '项目',
            type: 'project',
            colShow: false,
            allowReset: false,
            change: ({ node }) => {
              this.$http.get(`/carp/business/a/q/dict/category/phase_${node.dictId}`).then(({ code, data, message }) => {
                if (code === 0) {
                  this.form.label.phase.item = data.map(item => ({ label: item.name, code: item.id }))
                } else {
                  this.$message.error('获取施工阶段字典表失败: ' + message)
                }
              })
            },
            required: true
          },
          // 项目阶段
          phase: {
            label: '项目阶段',
            placeholder: '请先选择项目',
            colType: 'text',
            type: 'select',
            item: []
          },
          // 需求物
          inputs: {
            label: '需求物',
            type: 'checked',
            colShow: false,
            span: 24,
            item: [],
            default: [],
            required: true
          },
          // 产出物
          outputs: {
            label: '产出物',
            type: 'checked',
            colShow: false,
            span: 24,
            item: [],
            default: [],
            required: true
          },
          // 方量
          square: {
            label: '方量',
            type: 'number',
            colShow: false,
            unit: '立方米',
            required: true
          },
          // 开工日期
          startDate: {
            label: '开工日期',
            colShow: false,
            type: 'date',
            required: true
          },
          // 完工日期
          endDate: {
            label: '完工日期',
            colShow: false,
            type: 'date',
            required: true
          }
        }
      },
      addUrl: '/carp/business/a/q/duration/form/increase',
      delUrl: '/carp/business/a/q/duration/form',
      editUrl: '/carp/business/a/q/duration/form/duration',
      searchUrl: `/carp/business/a/q/duration/form/areaId?areaId=${
        [0].includes(this.$userType)
          ? ''
          : (() => {
              let areaId = 1
              this.$getAreaTree(user.accountTypeDto.code, area => {
                areaId = area.id
              })
              return areaId
            })()
      }`,
      // 分页筛选
      filters: {
        // 项目名称
        projectName: {
          label: '根据项目名称搜索',
          type: 'search'
        }
      }
    }
  },
  methods: {
    // 获取需求产出物字典表
    getDurationProductDict() {
      this.$http.get('/carp/business/a/q/dict/category/requirement_type').then(({ code, data }) => {
        if (code === 0) {
          let items = data.map(item => ({ label: item.name, code: item.id }))
          this.form.label.inputs.item = items
          this.form.label.outputs.item = items
        }
      })
    }
  },
  created() {
    // 获取需求产出物字典表
    this.getDurationProductDict()
  },
  components: {
    tableControl
  }
}
</script>
