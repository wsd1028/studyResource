<template>
  <el-row class="container" :gutter="0">
    <el-col :lg="organization.id ? 12 : 24" class="table">
      <common-table-control
        class="organization"
        :formConfig="form"
        :addUrl="addUrl"
        :delUrl="delUrl"
        :editUrl="editUrl"
        :searchUrl="searchUrl"
        :paginationShow="false"
        :allow-add="tablePermission.add"
        :allow-delete="tablePermission.del"
        :allow-edit="tablePermission.edit"
        :show-control-edit="false"
        :show-control-del="false"
        @row-click="handleClickOrganization"
      ></common-table-control>
    </el-col>
    <el-col v-if="organization.id" :lg="organization.id ? 12 : 0" class="table" style="padding:10px 10px 10px 0">
      <user-bind :organization="organization"></user-bind>
    </el-col>
  </el-row>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import userBind from './UserBind'
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
        formHeight: '24vh',
        // 表格类型:树形
        tableType: 'tree',
        // 表格标题
        label: {
          // 组织机构名称
          name: {
            label: '组织机构名称',
            colType: 'edit',
            span: 24,
            rule: {
              regExp: /^.{1,60}$/g,
              message: '不能为空'
            }
          },
          // 父级id
          parentId: {
            label: '父级组织机构',
            type: 'organization',
            span: 24,
            show: true,
            colShow: false,
            default: null
          },
          // 地区名称
          areaName: {
            label: '行政地区',
            show: false
          },
          // 地区id
          areaId: {
            label: '所属区域',
            default: '290871061266829312',
            type: 'area',
            span: 24,
            colShow: false,
            change: areaId => {
              this.$getAreaTree(areaId, area => {
                this.form.data.areaCode = area.code
                this.form.data.areaName = area.name
              })
            }
          },
          // 区域编码
          areaCode: {
            label: '地区码',
            default: '5115',
            show: false,
            colShow: false
          }
        }
      },
      // 当前点击的组织机构
      organization: {
        /* id: '1',
        name: '市政府办公室',
        areaName: '宜宾市',
        areaCode: '5115',
        areaId: '290871061266829312',
        parentId: null,
        createDate: '2020-04-23 16:42:40',
        modifyDate: '2020-04-23 16:42:45',
        children: null */
      },
      // 增删改api
      addUrl: '/carp/auth/a/q/organization',
      editUrl: '/carp/auth/a/q/organization',
      delUrl: '/carp/auth/a/q/organization',
      searchUrl: '/carp/auth/a/q/organization'
    }
  },
  methods: {
    // 获取点击的组织机构
    handleClickOrganization({ row }) {
      this.organization = row
    }
  },
  components: {
    commonTableControl,
    userBind
  }
}
</script>

<style lang="less" scoped>
.container {
  height: 100%;
  .table {
    height: 100%;
    display: flex;
    align-items: stretch;
  }
}
</style>
