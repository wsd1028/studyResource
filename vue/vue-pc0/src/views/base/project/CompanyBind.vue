<template>
  <table-control
    ref="table"
    :formConfig="form"
    :addUrl="addUrl"
    :searchUrl="searchUrl"
    :delConfig="delConfig"
    :show-search="false"
    :show-control="false"
    style="height:80vh"
  ></table-control>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
export default {
  data() {
    const user = this.$store.state.user.userInfo
    return {
      // 表单配置
      form: {
        // 表单高度
        formHeight: '210px',
        // 表单数据
        data: {
          // 项目id
          projectId: this.info.id
        },
        // 表格标题
        label: {
          // 企业名称
          companyName: {
            label: '企业名称',
            width: 300,
            type: 'company',
            colType: 'edit',
            target: 'corpId',
            span: 24,
            real: false
          },
          // 企业名称
          corpId: {
            show: false,
            span: 24,
            colShow: false
          },
          // 参建类型
          type: {
            label: '参建类型',
            type: 'select',
            span: 12,
            item: [],
            colShow: false
          },
          typeName: {
            label: '参建类型',
            width: 200,
            show: false,
            real: false
          },
          // 是否进出场
          state: {
            label: '进出场',
            type: 'radio',
            colShow: false,
            item: [
              { label: '进场', code: true },
              { label: '出场', code: false }
            ],
            default: true
          },
          // 进场时间
          time: {
            label: '进场时间',
            type: 'date',
            span: 12,
            width: 120
          },
          // 出场时间
          exitTime: {
            label: '出场时间',
            type: 'date',
            span: 12,
            width: 120
          }
        }
      },
      addUrl: `/carp/business/a/q/project/corp?createPerson=${user.id}`,
      delConfig: {
        url: '/carp/business/a/q/project/corp/remove',
        method: 'query',
        params: {
          deletePerson: user.id
        }
      },
      searchUrl: `/carp/business/a/q/project/corp/project?projectId=${this.info.id}`
    }
  },
  props: {
    info: Object
  },
  watch: {
    // 监听信息变动刷新表格
    info() {
      this.init()
    }
  },
  created() {
    // 获取参见类型
    this.getPartakeUnit()
  },
  methods: {
    /* *
     * 初始化
     * * */
    init() {
      this.form.data.projectId = this.info.id
      this.searchUrl = `/carp/business/a/q/project/corp/project?projectId=${this.info.id}`
    },
    /* *
     * 获取参建类型
     * * */
    getPartakeUnit() {
      this.$http.get('/carp/business/a/q/dict/category/partake_unit').then(({ code, data }) => {
        if (code === 0) {
          this.form.label.type.item = data.map(item => ({
            label: item.name,
            code: item.id
          }))
        } else {
          this.$message.error('获取参建类型字典表失败')
        }
      })
    }
  },
  components: {
    tableControl
  }
}
</script>

<style lang="less" scoped></style>
