<template>
  <div class="user-bind-container">
    <div class="role-bind">
      <div class="search">
        <el-input class="el-input" v-model="role.keyword" placeholder="搜索角色名"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="getRoleList"></el-button>
      </div>
      <el-transfer
        v-model="role.had"
        :data="role.list"
        :titles="['普通角色列表', user.username]"
        :props="{ label: 'name', key: 'id' }"
        :style="{ marginRight: 0 }"
      ></el-transfer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 角色操作参数
      role: {
        keyword: '',
        list: [],
        had: [],
        roles: null
      }
    }
  },
  props: {
    user: Object
  },
  watch: {
    // 监听用户信息变动后进行初始化操作
    user() {
      this.init()
    },
    // 监听用户已有角色列表变动
    'role.had': {
      handler() {
        // 对用户已有角色列表数组进行格式化重装并赋值为this.role.roles
        this.role.roles = []
        if (this.role.had[0] !== undefined) {
          this.role.had.forEach(roleId => {
            this.role.roles.push({
              roleId,
              accountId: this.user.id
            })
          })
        }
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    /* *
     * 初始化操作
     * * */
    init() {
      // 角色参数初始化
      this.role.roles = null
      this.role.list = []
      this.role.had = []
      this.role.keyword = ''

      // 用户数据不为空对象时请求列表
      if (JSON.stringify(this.user) !== '{}') {
        // 获取角色数据
        this.getRoleList()
        this.getUserRole()
      }
    },

    /* *
     * 获取普通角色列表
     * * */
    getRoleList() {
      this.$http
        .get('/carp/auth/a/q/role', {
          params: {
            name: this.role.keyword,
            limit: 10,
            page: 1,
            isProjectRole: false
          }
        })
        .then(({ code, data }) => {
          if (code === 0) {
            this.role.list = data.records
          } else {
            this.$message.error('角色列表请求失败')
          }
        })
    },

    /* *
     * 获取当前用户扮演角色列表
     * * */
    getUserRole() {
      this.$http.get(`/carp/auth/a/q/account_role/${this.user.id}`).then(({ code, data }) => {
        if (code === 0) {
          if (data[0]) {
            this.role.had = data.map(item => item.roleId + '')
          }
        } else {
          this.$message.error('用户角色列表请求失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-bind-container {
  display: flex;
  justify-content: center;
  .role-bind,
  .project-bind {
    flex: auto;
  }
  .project-bind {
    margin-left: 20px;
  }
}
.search {
  display: flex;
  margin-bottom: 10px;
  .el-input {
    margin-right: 0;
  }
  .el-select {
    flex: auto;
  }
}
</style>

<style lang="less">
.user-bind-container {
  .el-transfer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
