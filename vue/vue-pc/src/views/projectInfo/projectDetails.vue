<template>
  <el-card shadow="never" v-loading="loading" class="el-card">
    <div slot="header" class="header">
      <span>项目基本信息</span>
    </div>
    <div class="content">
      <div class="item-wrap">
        <div class="item" v-if="project.name">
          <span class="label">工程名称</span>
          <span class="value" v-text="project.name"></span>
        </div>
        <div class="item" v-if="project.address">
          <span class="label">工程地址</span>
          <span class="value" v-text="project.address"></span>
        </div>
        <div class="item" v-if="project.totalCost">
          <span class="label">工程造价</span>
          <span class="value" v-cloak>{{ project.totalCost }}万元</span>
        </div>
        <div class="item" v-if="project.startDate">
          <span class="label">施工时间</span>
          <span class="value" v-text="project.startDate"></span>
        </div>
        <div class="item" v-if="project.completeDate">
          <span class="label">竣工时间</span>
          <span class="value" v-text="project.completeDate"></span>
        </div>
      </div>
      <div class="item-wrap">
        <div v-for="item in companys" :key="item.id" class="item">
          <span class="label" v-cloak>{{ item.typeName }}</span>
          <span class="value" v-text="item.companyName"></span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'projectInfoCard',
  data() {
    return {
      loading: true,
      project: {},
      companys: []
    }
  },
  props: {
    projectId: String
  },
  created() {
    Promise.all([
      new Promise(resolve => {
        this.$http
          .get(`/carp/business/a/q/project/${this.projectId}`)
          .then(({ data, code }) => {
            if (code === 0) {
              this.project = data
              resolve(true)
            } else {
              resolve(false)
            }
          })
          .catch(err => {
            if (err) resolve(false)
          })
      }),
      new Promise(resolve => {
        this.$http
          .get('/carp/business/a/q/project/corp/project', {
            params: {
              projectId: this.projectId,
              page: 1,
              limit: 20
            }
          })
          .then(({ code, data }) => {
            if (code === 0) {
              this.companys = data.records
              resolve()
            } else {
              resolve(false)
            }
          })
          .catch(err => {
            if (err) resolve(false)
          })
      })
    ]).then(() => {
      this.loading = false
    })
  }
}
</script>

<style lang="less" scoped>
@import './less/Index';
.el-card {
  flex: 1.6;
  min-height: 234px;
}
.content {
  margin: -20px 0;
  display: flex;
  font-size: 14px;
  .item-wrap {
    flex: auto;
    width: 0;
    .item {
      margin: 18px 0;
      line-height: 16px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .label {
        display: inline-block;
        width: 100px;
        color: #999999;
      }
      .value {
        color: #333333;
      }
    }
  }
}
</style>
