<template>
  <div class="user-bind-container">
    <div class="project-bind">
      <!-- 项目下拉搜索框 -->
      <div class="search">
        <el-select class="el-select" v-model="project.id" placeholder="搜索选择项目" filterable remote reserve-keyword :remote-method="getProjectList">
          <el-option v-for="item in project.list" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </div>
      <el-transfer
        v-model="project.had"
        :data="project.roles"
        :titles="['项目角色列表', project.name]"
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
      // 项目操作参数
      project: {
        id: null,
        name: '未选择项目',
        roleName: '',
        list: [],
        had: [],
        roles: [],
        // 是否有修改历史
        isEdit: false
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
    // 监听项目id变动
    'project.id': {
      handler() {
        /* *
         * 替换穿梭框项目名称
         * * */
        this.project.list.every(item => {
          if (item.id === this.project.id) {
            this.project.name = item.name
            return false
          } else return true
        })

        /* *
         * 请求用户项目当前存在的角色
         * * */
        this.project.had = []
        this.$http
          .get('/carp/auth/a/q/account_role_project/getAccountRoleProject', {
            params: {
              accountId: this.user.id,
              projectId: this.project.id
            }
          })
          .then(({ code, data }) => {
            if (code === 0) {
              data.forEach(item => {
                this.project.had.push(item.roleId)
              })
            } else {
              this.$message.error('请求当前用户项目包含角色数据失败')
            }
          })
      }
    },
    // 监听项目角色绑定又穿梭框中的值判断是否被修改过
    'project.had': {
      handler(val, oldVal) {
        if (JSON.stringify(val) !== JSON.stringify(oldVal)) {
          this.project.isEdit = true
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
      // 项目参数初始化
      this.project.name = '未选择项目'
      this.project.roleName = ''
      this.project.list = []
      this.project.had = []
      this.project.id = null
      this.project.roles = []
      this.project.isEdit = false

      // 用户数据不为空对象时请求列表
      if (JSON.stringify(this.user) !== '{}') {
        // 获取项目数据
        this.getProjectList()
        this.getProjectRoleList()
      }
    },

    /* *
     * 获取项目角色列表
     * * */
    getProjectRoleList() {
      this.$http
        .get('/carp/auth/a/q/role', {
          params: {
            name: this.project.roleName,
            limit: 10,
            page: 1,
            isProjectRole: true
          }
        })
        .then(({ code, data }) => {
          if (code === 0) {
            this.project.roles = data.records
          } else {
            this.$message.error('角色列表请求失败')
          }
        })
    },

    /* *
     * 获取项目列表
     * * */
    getProjectList(query) {
      // 设计间隔600ms的防抖操作
      this.$debounce(() => {
        // 请求项目数据
        this.$http
          .get('/carp/business/a/q/project/list', {
            params: {
              limit: 10,
              page: 1,
              name: query
            }
          })
          .then(({ code, data }) => {
            if (code === 0) {
              this.project.list = data.records
            } else {
              this.$message.error('项目列表请求失败')
            }
          })
      }, 600)()
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
    margin-left: 0;
  }
}
.search {
  display: flex;
  margin-bottom: 10px;
  .el-input {
    margin-right: 10px;
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
