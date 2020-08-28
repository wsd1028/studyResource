<template>
  <div class="user-bind-container">
    <div class="job-bind">
      <!-- 项目下拉搜索框 -->
      <div class="search">
        <el-input class="el-input" v-model="job.search" placeholder="搜索职务名"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="getJobList"></el-button>
      </div>
      <el-transfer
        v-model="job.had"
        :data="job.list"
        :titles="['职务列表', `${user.accountBaseDto.name} 已担任职务`]"
        :props="{ label: 'name', key: 'id' }"
      ></el-transfer>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      job: {
        // 职务搜索关键字
        search: '',
        // 职务列表
        list: [],
        // 当前用户就任的职务
        had: []
      }
    }
  },
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    user() {
      this.init()
    }
  },
  created() {
    // 初始化操作
    this.init()
  },
  methods: {
    /* *
     * 初始化
     * * */
    init() {
      this.search = ''
      this.list = []
      this.had = []
      if (JSON.stringify(this.user) !== '{}') {
        // 获取职位列表
        this.getJobList()
        // 获取用户已担任职务
        this.getHadList()
      }
    },
    /* *
     * 获取职务列表
     * * */
    getJobList() {
      this.$http
        .get('/carp/auth/a/q/job_title', {
          params: {
            limit: 10,
            page: 1,
            name: this.search
          }
        })
        .then(({ code, data }) => {
          if (code === 0) {
            this.job.list = data.records
          } else {
            this.$message.error('请求职务列表失败')
          }
        })
    },
    /* *
     * 获取用户已担任职务
     * * */
    getHadList() {
      this.$http.get(`/carp/auth/a/q/job_title/by_account/${this.user.id}`).then(({ code, data }) => {
        if (code === 0) {
          this.job.had = data.map(item => item.id)
        } else {
          this.$message.error('请求用户担任职务列表失败')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.user-bind-container {
  display: flex;
  .role-bind,
  .job-bind {
    flex: auto;
  }
  .job-bind {
    margin-left: 20px;
  }
}
.search {
  display: flex;
  margin: 0 34px 10px 0;
  .el-input {
    margin-right: 10px;
  }
  .el-select {
    flex: auto;
    width: 100%;
  }
}
</style>

<style lang="less">
.user-bind-container {
  .el-transfer {
    display: flex;
    margin-right: 34px;
  }
}
</style>
