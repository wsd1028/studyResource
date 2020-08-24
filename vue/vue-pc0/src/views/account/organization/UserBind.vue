<template>
  <el-card v-if="organization.id" class="el-card" style="display:flex;width:100%;flex-flow:column nowrap;overflow:visible" :body-style="{ flex: 'auto' }">
    <div slot="header">
      <span style="margin-right:4px">当前选择组织机构</span>
      <el-tag size="small" type="success" v-text="organization.name"></el-tag>
    </div>
    <common-table-control
      ref="tableControl"
      class="organization"
      :formConfig="form"
      :searchUrl="searchUrl"
      style="height:100%"
      :allowEdit="false"
      :allowExport="false"
      addDescription="添加用户"
      :bind-buttons="[{ label: '职位', icon: 'el-icon-s-custom', key: 'job' }]"
      :paginationShow="false"
      @bindButtonClick="getRow"
    ></common-table-control>
    <!-- 职位绑定操作 -->
    <el-dialog class="dialog" :visible.sync="jobBindShow" top="6vh" width="576px">
      <!-- 标题 -->
      <div slot="title">
        <span style="margin-right:4px">职务</span>
        <el-tag size="mini">{{ user.accountBaseDto_name }}</el-tag>
      </div>
      <!-- 绑定操作表单 -->
      <job-bind :user="user" ref="jobBind"></job-bind>
      <!-- 绑定操作表单end -->
      <!-- 确认取消按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="jobBindShow = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            jobBindShow = false
            jobSubmit()
          "
          >确 定</el-button
        >
      </span>
      <!-- 确认取消按钮end -->
    </el-dialog>
    <!-- 职位绑定操作end -->
  </el-card>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import jobBind from './UserJobBind'
export default {
  data() {
    return {
      // 表格配置
      form: {
        formHeight: '24vh',
        // 显示表格多选框
        showTableChecked: false,
        label: {
          // 人员姓名
          accountBaseDto_name: {
            label: '姓名',
            show: false,
            real: false
          },
          // 职务
          jobTitleDtoList: {
            label: '职务',
            show: false,
            real: false,
            data: data => (data && data[0] ? data.map(item => item.name).join(' ') : '暂无职位')
          },
          // 人员id
          accountId: {
            label: '选择用户',
            type: 'search',
            placeholder: '搜索人员姓名',
            item: [],
            labelWidth: '72px',
            span: 24,
            search: query => {
              this.$http
                .get('/carp/auth/a/q/account', {
                  params: {
                    limit: 10,
                    page: 1,
                    type: 50,
                    username: query
                  }
                })
                .then(({ code, data }) => {
                  if (code === 0) {
                    this.form.label.accountId.item = data.records.map(item => ({ label: item.accountBaseDto.name, code: item.id }))
                  } else {
                    this.$message.error('人员列表请求失败')
                  }
                })
            },
            colShow: false
          }
        },
        // 自定义添加操作
        customCreate: (data, finish) => {
          data.organizationId = this.organization.id
          this.$http.put('/carp/auth/a/q/account/organization', this.$qs.stringify(data)).then(({ code, message }) => {
            if (code !== 0) {
              finish(message)
            } else {
              finish()
            }
          })
        },
        // 自定义删除操作
        customDelete: (id, finish) => {
          this.$http
            .put(
              '/carp/auth/a/q/account/organization',
              this.$qs.stringify({
                accountId: id,
                organizationId: null
              })
            )
            .then(({ code, message }) => {
              if (code !== 0) {
                finish(message)
              } else {
                finish()
              }
            })
        }
      },
      // 用户信息
      user: {},
      // 下拉搜索框用户列表
      userList: [],
      // 用户职位管理弹框显示控制
      jobBindShow: false
    }
  },
  props: {
    // 组织机构信息对象
    organization: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    searchUrl() {
      return `/carp/auth/a/q/account/organization/${this.organization.id}`
    }
  },
  methods: {
    // 更多按钮事件
    getRow({ row, key }) {
      this.user = row
      switch (key) {
        case 'job':
          this.jobBindShow = true
          break

        default:
          break
      }
    },
    /* *
     * 用户职位操作
     * * */
    jobSubmit() {
      // 获取职务id数组
      let jobIdList = this.$refs['jobBind'].job.had
      // 提交绑定修改
      if (jobIdList.length === 0) {
        this.$http.delete(`/carp/auth/a/q/account_job_title/${this.user.id}`).then(({ code, message }) => {
          if (code === 0) {
            this.$message.success('用户职务绑定成功')
            // 刷新表格
            this.$refs.tableControl.getList()
          } else {
            this.$message.error('用户职务绑定失败:' + message)
          }
        })
      } else {
        this.$http
          .put(
            '/carp/auth/a/q/account_job_title',
            jobIdList.map(item => ({
              accountId: this.user.id,
              jobTitleId: item
            }))
          )
          .then(({ code, message }) => {
            if (code === 0) {
              this.$message.success('用户职务绑定成功')
              // 刷新表格
              this.$refs.tableControl.getList()
            } else {
              this.$message.error('用户职务绑定失败:' + message)
            }
          })
      }
    }
  },
  components: {
    commonTableControl,
    jobBind
  }
}
</script>

<style lang="less" scoped>
.el-card {
  height: 100%;
}
</style>
