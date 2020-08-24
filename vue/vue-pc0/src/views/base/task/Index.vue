<template>
  <div class="container">
    <!-- 表格 -->
    <table-control
      ref="table"
      :formConfig="form"
      :addUrl="addUrl"
      :delUrl="delUrl"
      :addDescription="addDescription"
      :searchUrl="searchUrl"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control-del="false"
      :allowExport="false"
      :filters="filters"
      :bind-buttons="[{ label: '查看详情', key: 'details', icon: 'el-icon-view' }]"
      @bindButtonClick="getRow"
    ></table-control>

    <!-- 督办派单详情 -->
    <el-dialog class="dialog" v-if="detailsShow" :show-close="false" :visible="true" top="5vh" width="600px" append-to-body>
      <div slot="title" style="display:flex;justify-content:space-between">
        <div style="font-size: 20px;font-weight: bold">
          <span style="margin-right: 20px">督办派单详情</span>
          <el-tag type="primary" size="mini" v-text="task.address" style="margin-left:4px"></el-tag>
          <el-tag type="success" size="mini" v-text="task.manager" style="margin-left:4px"></el-tag>
        </div>
        <i class="el-icon-close" @click="detailsShow = false" style="cursor:pointer"></i>
      </div>
      <details-bind
        :task="task"
        :state="this.form.label.state.item"
        :close="
          () => {
            detailsShow = false
            $refs.table.getList()
          }
        "
      ></details-bind>
    </el-dialog>
  </div>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
import detailsBind from './DetailsBind'
export default {
  name: 'task',
  data() {
    // 表操作权限
    const tablePermission = {
      add: false,
      del: false,
      edit: false
    }
    Object.keys(tablePermission).forEach(key => {
      // 添加按钮权限验证
      this.$permission(`dust_base_task_${key}`).then(({ data }) => {
        tablePermission[key] = data
      })
    })
    const user = this.$store.state.user.userInfo

    let areaTree = []
    this.$getAreaTree(user.accountTypeDto.code, area => {
      areaTree = [area]
    })

    return {
      // 表操作权限
      tablePermission,
      // 当前登录用户信息
      user,
      // 表单配置
      form: {
        // 表格标题
        label: {
          // 案件id
          id: {
            label: '案件ID',
            width: 200,
            show: false,
            default: null
          },

          // 督办派单图片集合
          taskImageList: {
            label: '图片',
            type: 'uploadImgs',
            colShow: false,
            allowReset: false,
            default: [],
            span: 24,
            limit: 3,
            // 上传请求地址
            url: '/carp/file/a/q/file/upload/files/task_image',
            // 文件上传前执行该钩子
            before: file => {
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
              }
              return isLt2M
            },
            // 文件上传成功后执行该钩子
            success: ({ code }) => {
              if (code !== 4002) {
                this.$message.error('图片上传失败')
              }
            }
          },

          // 发起人所在市区县
          sponsorCity: {
            show: false,
            colShow: false,
            default: user.organizationDto && user.organizationDto.areaName
          },
          // 发起人所在部门
          sponsorDept: {
            show: false,
            colShow: false,
            default: user.organizationDto && user.organizationDto.name
          },
          // 发起人id
          sponsorId: {
            show: false,
            colShow: false,
            default: user.id
          },
          // 发起人姓名
          sponsorName: {
            show: false,
            colShow: false,
            default: user.accountBaseDto.name
          },
          // 发起人电话
          sponsorPhone: {
            show: false,
            colShow: false,
            default: user.accountBaseDto.phone
          },

          // 接收人单位区域
          areaCode: {
            label: '接收人单位区域',
            type: 'area',
            areaTree,
            props: {
              code: 'code'
            },
            colShow: false,
            real: false,
            change: areaCode => {
              this.$http.get(`/carp/auth/a/q/organization/area/${areaCode}`).then(({ code, data, message }) => {
                if (code === 0) {
                  this.form.label.receiverDept.item = data
                } else {
                  this.$message.error('获取部门列表失败' + message)
                }
              })
            }
          },
          // 接收人所在部门
          receiverDept: {
            label: '接收人所在部门',
            placeholder: '请先选择部门所在地区',
            type: 'select',
            item: [],
            props: {
              label: 'name',
              code: 'name'
            },
            colShow: false,
            change: (name, { id }) => {
              this.$http.get(`/carp/auth/a/q/account/organization/${id}`).then(({ code, data, message }) => {
                if (code === 0) {
                  this.form.label.receiverId.item = data.map(item => Object.assign(item, { label: item.accountBaseDto.name, code: item.id }))
                } else {
                  this.$message.error('获取用户列表失败: ' + message)
                }
              })
            }
          },
          // 收单人id
          receiverId: {
            label: '收单人',
            type: 'select',
            placeholder: '请先选择收单人所在的单位',
            item: [],
            colShow: false,
            change: (receiverId, receiver) => {
              this.form.data.receiverName = receiver.label
              this.form.data.receiverCity = receiver.organizationDto.areaName
              this.form.data.receiverPhone = receiver.accountBaseDto.phone
            }
          },
          // 接收人所在市区县
          receiverCity: {
            show: false,
            colShow: false
          },
          // 接收人姓名
          receiverName: {
            show: false,
            colShow: false
          },
          // 接收人电话
          receiverPhone: {
            show: false,
            colShow: false
          },

          // 任务描述
          description: {
            label: '任务描述',
            type: 'textarea',
            colShow: false,
            rows: 5,
            span: 24,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          // 任务位置
          address: {
            label: '任务位置',
            placeholder: '可点击下发定位按钮在地图中选择',
            width: 260
          },
          // 定位
          location: {
            label: '定位',
            type: 'map',
            colShow: false,
            span: 16,
            real: false,
            // 定位相关配置
            target: {
              address: 'address',
              lng: 'longitude',
              lat: 'latitude'
            }
          },
          // 纬度
          longitude: {
            show: false,
            colShow: false
          },
          latitude: {
            show: false,
            colShow: false
          },

          // 展示用
          // 当前进度
          state: {
            label: '当前进度',
            type: 'select',
            colType: 'tag',
            show: false,
            real: false,
            item: [],
            default: 1
          },
          // 处理人
          manager: {
            label: '处理人',
            show: false,
            real: false
          }
        }
      },
      // 派单信息对象
      task: {},
      // 详情弹窗控制器
      detailsShow: false,
      addUrl: '/carp/business/a/q/task/newTask',
      // 添加按钮描述
      addDescription: '新建督办派单',
      delUrl: '/carp/business/a/q/task',
      searchUrl: '/carp/business/a/q/task/accountId',
      // 筛选器
      filters: {
        // 进度
        state: {
          label: '督办派单进度',
          type: 'select',
          item: [],
          value: ''
        },
        // 用户id
        accountId: {
          label: '搜索用户',
          type: 'subSearch',
          item: [],
          search: query => {
            this.$http
              .get('/carp/auth/a/q/account', {
                params: {
                  limit: 10,
                  page: 1,
                  username: query
                }
              })
              .then(({ code, data }) => {
                if (code === 0) {
                  this.filters.accountId.item = data.records.map(item => ({
                    label: item.accountBaseDto.name,
                    code: item.id
                  }))
                } else {
                  this.$message.error('查询失败')
                }
              })
          },
          show: [0].includes(this.$userType),
          value: [0].includes(this.$userType) ? '' : user.id
        }
      }
    }
  },
  created() {
    // 获取派单进度字典表
    this.getTaskState()
  },
  methods: {
    /* *
     * 获取当前点击行内容
     * * */
    getRow({ row, key }) {
      this.task = row
      switch (key) {
        // 督办详情展示按钮触发
        case 'details':
          this.detailsShow = true
          break
      }
    },
    /* *
     * 刷新表格
     * * */
    flushTable() {
      this.$refs.table.getList(1)
    },
    /* *
     * 获取派单进度字典表
     * 索引号 0:待处理 1:处理中 2:待审核 3:已驳回 4:已结案 5:已作废
     * * */
    getTaskState() {
      let dict = [
        {
          label: '待处理',
          code: 5020,
          type: 'info'
        },
        {
          label: '处理中',
          code: 5030,
          type: 'warning'
        },
        {
          label: '待审核',
          code: 5050,
          type: ''
        },
        {
          label: '已驳回',
          code: 5060,
          type: 'danger'
        },
        {
          label: '已结案',
          code: 5070,
          type: 'success'
        },
        {
          label: '已作废',
          code: 5080,
          type: 'danger'
        }
      ]
      this.form.label.state.item = dict
      this.form.label.state.default = dict[0].code
      this.filters.state.item = [{ label: '全部', code: ' ' }].concat(dict)
    }
  },
  components: {
    tableControl,
    detailsBind
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
.container {
  @flex-column();
  flex: auto;
  height: 0;
}
</style>
