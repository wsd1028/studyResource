<template>
  <div class="container">
    <table-control
      ref="tableControl"
      :form-config="form"
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
      :bind-buttons="bindBt"
      @bindButtonClick="getRow"
      @closed="form.label.workStationId.type == [60].includes(this.$userType) ? 'garbageStation' : 'project'"
    ></table-control>
    <!-- 指派点检 -->
    <el-dialog class="dialog" v-if="detailsShow" :visible="true" title="指派点检详情" width="600px" top="5vh" append-to-body :show-close="false">
      <div slot="title" style="display:flex;justify-content:space-between">
        <div>
          <span style="font-size: 20px;font-weight: bold">指派点检详情</span>
          <el-tag type="success" size="mini" v-text="details.manager" style="margin-left:4px"></el-tag>
        </div>
        <i class="el-icon-close" @click="detailsShow = false" style="cursor:pointer"></i>
      </div>
      <details-bind
        :info="details"
        :state="state"
        :close="
          () => {
            detailsShow = false
            $refs.tableControl.getList()
          }
        "
      ></details-bind>
    </el-dialog>
    <!-- 指派点检end -->
    <!-- 指派点检 -->
    <el-dialog class="dialog" v-if="reviewShow" :visible="true" title="指派点检详情" width="600px" top="5vh" append-to-body :show-close="false">
      <div slot="title" style="display:flex;justify-content:space-between">
        <div>
          <span>指派点检审核</span>
          <el-tag type="success" size="mini" v-text="details.manager" style="margin-left:4px"></el-tag>
        </div>
        <i class="el-icon-close" @click="reviewShow = false" style="cursor:pointer"></i>
      </div>
      <review-bind
        :info="details"
        :state="state"
        :close="
          () => {
            reviewShow = false
            $refs.tableControl.getList()
          }
        "
      ></review-bind>
    </el-dialog>
    <!-- 指派点检end -->
  </div>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
import detailsBind from './Details'
import reviewBind from './Review'
import { commandCheckStateDict, workStationDict } from '@/libs/dict'

export default {
  name: 'commandCheck',

  data() {
    // 表操作权限
    const tablePermission = {
      add: false,
      del: false,
      edit: false
    }
    Object.keys(tablePermission).forEach(key => {
      // 添加按钮权限验证
      this.$permission(`dust_base_commandCheck_${key}`).then(({ data }) => {
        tablePermission[key] = data
      })
    })

    // 登录用户信息
    const user = this.$store.state.user.userInfo

    // 地区树
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
        labelPosition: 'top',
        formWidth: '500px',
        // 表格标题
        label: {
          manager: {
            label: '处理人员',
            show: false,
            real: false
          },
          // 选择检查项
          checkIdList: {
            label: '选择检查项',
            type: 'checked',
            colShow: false,
            item: [],
            span: 24
          },

          // 发起人员id
          sponsorId: {
            show: false,
            colShow: false,
            default: user.id
          },

          // 接收人单位区域
          code: {
            label: '接收人单位区域',
            type: 'area',
            colShow: false,
            areaTree,
            props: {
              code: 'code'
            },
            span: 24,
            real: false,
            require: true,
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
            label: '接收人所在单位',
            placeholder: '请先选择单位所在地区',
            type: 'select',
            colShow: false,
            item: [],
            props: {
              label: 'name',
              code: 'name'
            },
            require: true,
            span: 24,
            real: false,
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
          // 接收人id
          receiverId: {
            label: '接收人',
            colShow: false,
            placeholder: '请先选择接收人所在部门',
            type: 'select',
            require: true,
            item: [],
            span: 24
          },

          // 指派点检状态
          state: {
            label: '当前状态',
            type: 'select',
            colType: 'tag',
            item: commandCheckStateDict,
            show: false,
            default: commandCheckStateDict[1].code
          },
          // 判断是消纳站还是项目
          type: {
            label: '类型',
            type: 'select',
            item: workStationDict.slice(1, 3),
            show: [50].includes(this.$userType),
            change: type => {
              const formData = this.form.data
              // 清除表单中的工作站数据
              formData.workStationName = formData.workStationId = formData.workStationAddress = formData.latitude = formData.longitude = ''
              if (type == workStationDict[1].code) {
                this.form.label.workStationId.label = '项目'
                this.form.label.workStationId.type = 'project'
              } else if (type == workStationDict[2].code) {
                this.form.label.workStationId.label = '消纳站'
                this.form.label.workStationId.type = 'garbageStation'
              }
            },
            default: [60].includes(this.$userType) ? workStationDict[2].code : workStationDict[1].code,
            colShow: false,
            span: 24,
            require: true,
            rule: {
              regExp: /^./g,
              message: '不能为空'
            }
          },
          workStationId: {
            label: '项目',
            type: [60].includes(this.$userType) ? 'garbageStation' : 'project',
            colShow: false,
            span: 24,
            require: true,
            change: ({ node }) => {
              this.form.data.workStationName = node.projectName || node.name
              this.form.data.workStationAddress = node.address
              this.form.data.latitude = node.latitude
              this.form.data.longitude = node.longitude
              this.form.data.areaCode = node.areaCode
              this.$getAreaTree(node.areaId, ({ code }) => {
                this.form.data.areaCode = code
              })
            }
          },
          workStationName: {
            label: '项目名称',
            require: true,
            span: 24,
            width: 300
          },
          workStationAddress: {
            label: '工作站地址',
            require: true,
            span: 24,
            width: 300
          },
          latitude: {
            label: '纬度',
            colShow: false
          },
          longitude: {
            label: '经度',
            colShow: false
          },
          areaCode: {
            show: false,
            colShow: false
          }
        }
      },
      addUrl: '/carp/business/a/q/command/check',

      // 添加按钮描述
      addDescription: '新增指派点检',
      searchUrl: '/carp/business/a/q/command/check/list',
      delUrl: '/carp/business/a/q/command/check',

      // 筛选器
      filters: {
        // 审核状态
        state: {
          label: '进度',
          type: 'select',
          item: [{ label: '全部', code: ' ' }].concat(commandCheckStateDict),
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
      },

      // 指派点检详情
      reviewShow: false,
      detailsShow: false,
      details: {},

      // 指派点检状态
      state: commandCheckStateDict
    }
  },
  computed: {
    bindBt() {
      let bt = [{ label: '查看', key: 'details', icon: 'el-icon-view' }]
      if ([50].includes(this.$userType)) {
        bt.push({ label: '审核', key: 'review', icon: 'el-icon-document-checked', type: 'warning', rule: { regExp: /5220/, key: 'state' } })
      }
      return bt
    }
  },
  created() {
    // 获取六不准六必须字典表
    this.getTodayCheckRule()
  },
  methods: {
    /* *
     * 获取当前点击行内容
     * * */
    getRow({ row, key }) {
      this.details = row
      switch (key) {
        // 指派点检详情
        case 'details':
          this.detailsShow = true
          break
        // 指派点检详情
        case 'review':
          this.reviewShow = true
          break
      }
    },

    /* *
     * 六不准六必须字典表
     * 对应索引号 0:必须打围作业 1:必须硬化道路 2:必须设置冲洗设备 3:必须湿法作业 4:必须定时清扫施工现场 5:不准车辆带泥出门
     * * */
    getTodayCheckRule() {
      this.$http.get('/carp/business/a/q/dict/category/check_style').then(({ code, data }) => {
        if (code === 0) {
          this.form.label.checkIdList.item = data.map(item => ({ label: item.name, code: item.id }))
          this.form.label.checkIdList.default = this.form.label.checkIdList.item.map(item => item.code)
        } else {
          this.$message.error('巡检准则字典表获取失败')
        }
      })
    }
  },
  components: {
    tableControl,
    detailsBind,
    reviewBind
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
