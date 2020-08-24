<template>
  <div class="container">
    <!-- 表操作组件 -->
    <common-table-control
      :formConfig="form"
      :addUrl="addUrl"
      :delUrl="delUrl"
      :editUrl="eidtUrl"
      :searchUrl="searchUrl"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control-edit="false"
      :show-control-del="false"
      :filters="filters"
      :bind-buttons="[{ key: 'permission', label: '权限' }]"
      @bindButtonClick="getRole"
    ></common-table-control>
    <!-- 表操作组件end -->
    <!-- 绑定权限操作 -->
    <el-drawer ref="elDrawer" :visible.sync="bind.show" direction="rtl" :destroy-on-close="true">
      <div slot="title">
        <span>权限配置</span>
        <el-tag type="success" size="mini" v-text="bind.role.name" style="margin-left:4px"></el-tag>
      </div>
      <role-account-bind
        ref="role"
        :role="bind.role"
        :close="
          () => {
            $refs.elDrawer.closeDrawer()
          }
        "
      ></role-account-bind>
    </el-drawer>
    <!-- 确认取消按钮end -->
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import roleAccountBind from './RoleAccountBind'
export default {
  name: 'role',
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
      bind: {
        show: false,
        role: {}
      },
      // 表单配置
      form: {
        formPosition: 'top',
        formWidth: '500px',
        formHeight: '26vh',
        // 表单数据
        data: {},
        // 表格标题
        label: {
          // 角色名
          name: {
            label: '角色名',
            type: 'string',
            colType: 'edit',
            width: 200,
            span: 24,
            rule: {
              regExp: /./g,
              message: '角色名不能为空'
            }
          },
          // 是否为项目角色
          isProjectRole: {
            label: '是否为项目角色',
            labelWidth: '134px',
            type: 'radio',
            colType: 'tag',
            default: false,
            width: 160,
            allowReset: false,
            span: 24,
            item: [
              { label: '项目角色', code: true, type: 'success' },
              { label: '普通角色', code: false, type: 'primary' }
            ]
          },
          // 角色号
          id: {
            label: '角色号',
            show: false,
            span: 24,
            width: 166
          },
          // 角色说明
          description: {
            label: '角色说明',
            type: 'textarea',
            width: 600,
            span: 24,
            rule: {
              regExp: /./g,
              message: '角色名称不能为空'
            }
          }
        }
      },
      // 增删改api
      addUrl: '/carp/auth/a/q/role',
      eidtUrl: '/carp/auth/a/q/role',
      delUrl: '/carp/auth/a/q/role',
      searchUrl: '/carp/auth/a/q/role',
      // 筛选器
      filters: {
        // 是否为项目角色
        isProjectRole: {
          label: '角色类型',
          type: 'select',
          item: [
            { label: '全部', code: '' },
            { label: '普通角色', code: false },
            { label: '项目角色', code: true }
          ],
          value: ''
        },
        // 角色名
        name: {
          label: '根据角色名搜索',
          type: 'search',
          value: ''
        }
      }
    }
  },
  methods: {
    /* *
     * 获取点击行的角色
     * * */
    getRole({ row }) {
      // 显示弹窗
      this.bind.show = true
      // 传递角色信息
      this.bind.role = row
    }
  },
  components: {
    commonTableControl,
    roleAccountBind
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
