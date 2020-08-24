<template>
  <div class="permission-container" v-loading="loading">
    <div class="permission-wrap">
      <el-scrollbar class="custom-scrollbar">
        <el-tree
          ref="tree"
          :data="permissions"
          :default-checked-keys="hasPermissions.map(item => item.permissionId)"
          :title="['权限列表', role.name]"
          :props="{ label: 'name' }"
          check-strictly
          node-key="id"
          show-checkbox
        ></el-tree>
      </el-scrollbar>
    </div>
    <div class="bt-wrap">
      <el-button type="primary" @click="submit">提交修改</el-button>
    </div>
  </div>
</template>

<script>
// 树形穿梭框
export default {
  name: 'roleAccountBInd',
  data() {
    return {
      loading: false,
      // 绑定值
      permissions: [],
      hasPermissions: [],
      // 变动后的权限
      editPermissions: null
    }
  },
  props: {
    // 角色信息
    role: {
      type: Object,
      default: () => ({})
    },
    // 关闭弹窗方法
    close: {
      type: Function,
      default: () => {}
    }
  },
  created() {
    // 初始化数据
    this.init()
  },
  methods: {
    /* *
     * 初始化操作
     * * */
    init() {
      this.permissions = []
      this.hasPermissions = []
      this.editPermissions = null
      this.getAccountTree()
      this.getRoleAccount()
    },

    /* *
     * 获取权限树
     * * */
    getAccountTree() {
      this.$http
        .get('/carp/auth/a/q/permission', {
          params: {
            isProjectPermission: this.role.isProjectRole
          }
        })
        .then(res => {
          // 请求成功
          if (res.code === 0) {
            this.permissions = res.data
          }
        })
    },

    /* *
     * 获取角色已有权限
     * * */
    getRoleAccount() {
      this.$http.get(`/carp/auth/a/q/account_permission/${this.role.id}`).then(res => {
        if (res.code === 0) {
          this.hasPermissions = res.data
          this.editPermissions = []
        } else {
          this.hasPermissions = []
          this.$message.error('未获取到当前角色的权限列表')
        }
      })
    },

    /* *
     * 提交修改
     * * */
    submit() {
      this.loading = true
      let params = this.$refs.tree.getCheckedNodes().map(item => ({ roleId: this.role.id, permissionId: item.id }))
      if (params.length > 0) {
        this.$http.put('/carp/auth/a/q/account_permission/', params).then(({ code, message }) => {
          if (code === 0) {
            this.$message.success(this.role.name + ' 权限绑定成功')
            this.close()
          } else {
            this.$message.error('权限绑定失败: ' + message)
          }
          this.loading = false
        })
      } else {
        this.$http.delete(`/carp/auth/a/q/account_permission/${this.role.id}`).then(({ code, message }) => {
          if (code === 0) {
            this.$message.success(this.role.name + ' 移除所有权限')
            this.close()
          } else {
            this.$message.error('权限绑定失败: ' + message)
          }
          this.loading = false
        })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
.permission-container {
  height: 100%;
  @flex-column();
  .permission-wrap {
    padding: 10px 20px;
    flex: auto;
    height: 0;
  }
  .bt-wrap {
    margin-bottom: 30px;
    padding: 10px 0;
    flex: none;
    text-align: center;
  }
}
</style>
