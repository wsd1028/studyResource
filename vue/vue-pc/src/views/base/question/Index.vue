<template>
  <div class="container">
    <common-table-control
      ref="tableControl"
      :formConfig="form"
      :addUrl="addUrl"
      :delUrl="delUrl"
      :searchUrl="searchUrl"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control-del="false"
      :filters="filters"
      :bind-buttons="[{ label: '查看详情', key: 'details', icon: 'el-icon-view' }]"
      @bindButtonClick="getRow"
    ></common-table-control>
    <!-- 问题上报详情 -->
    <el-dialog class="dialog details-container" :visible.sync="detailsView.show" top="5vh" width="600px">
      <div slot="title" style="font-size: 20px;font-weight: bold">
        {{ details.reportTitle }}
      </div>
      <details-view :info="details" :report-state="form.label.reportState.item"></details-view>
      <div slot="footer" class="dialog-footer" style="text-align:center">
        <el-button type="danger" v-if="[2, 3].includes(active)" @click="reject()">作 废</el-button>
        <el-button type="primary" v-if="[2].includes(active)" @click="sendTaskShow = true">处 理</el-button>
      </div>
      <!-- 督办派单弹窗 -->
      <el-dialog
        class="dialog details-container"
        v-if="sendTaskShow"
        :visible="true"
        title="发起督办派单"
        :show-close="false"
        append-to-body
        top="1.4rem"
        width="500px"
      >
        <send-task
          :close="
            () => {
              sendTaskShow = false
              $refs.tableControl.getList()
            }
          "
          :question="details"
        ></send-task>
      </el-dialog>
    </el-dialog>
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import detailsView from './DetailsView'
import sendTask from './SendTask'
export default {
  name: 'question',
  data() {
    // 表操作权限
    const tablePermission = {
      add: false,
      del: false,
      edit: false
    }
    Object.keys(tablePermission).forEach(key => {
      // 添加按钮权限验证
      this.$permission(`dust_base_question_${key}`).then(({ data }) => {
        tablePermission[key] = data && this.$parent.$options.name !== 'taskBook'
      })
    })

    const user = this.$store.state.user.userInfo
    return {
      // 表操作权限
      tablePermission,
      // 表单配置
      form: {
        // 表格标题
        label: {
          // 上报图片集合
          photo: {
            label: '上报图片集合',
            colShow: false,
            type: 'uploadImgs',
            default: [],
            allowReset: false,
            span: 24,
            limit: 3,
            // 上传请求地址
            url: '/carp/file/a/q/file/upload/files/base_image',
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
          // 上报人ID
          peopleId: {
            show: false,
            colShow: false,
            default: user.id
          },
          // 上报人名称
          peopleName: {
            label: '上报人',
            show: false,
            colShow: false,
            default: user.accountBaseDto.name
          },
          // 上报标题
          reportTitle: {
            label: '上报标题',
            width: 200,
            allowReset: false,
            required: true
          },
          // 上报类型
          reportType: {
            label: '上报类型',
            show: [0, 50].includes(this.$userType),
            type: 'select',
            colType: 'tag',
            item: [],
            allowReset: false,
            required: true,
            default: '350'
          },
          // 优先级
          emergencies: {
            show: false,
            colShow: false,
            default: { 30: 5501, 60: 5501, 50: 5502 }[this.$userType]
          },
          projectId: {
            show: false,
            colShow: false,
            default: [30, 60].includes(this.$userType) ? user.accountTypeDto.ancillaryId : null
          },
          // 行政区域id
          adminCodeId: {
            label: '行政区域',
            type: 'area',
            colShow: false,
            allowReset: false,
            default: '290871061266829312',
            required: true
          },
          // 联系电话
          phone: {
            label: '联系电话',
            width: 160,
            allowReset: false,
            colShow: false,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            },
            required: true
          },
          // 上报地址
          reportAddress: {
            label: '上报地址',
            width: 200,
            allowReset: false
          },
          // 上报进度
          reportState: {
            label: '上报进度',
            type: 'select',
            show: false,
            colType: 'tag',
            item: [],
            default: '550'
          },
          // 上报描述信息
          reportMessage: {
            label: '上报描述信息',
            type: 'textarea',
            width: 300,
            rows: 4,
            allowReset: false,
            colShow: false,
            span: 24
          },
          // 项目定位
          location: {
            label: '项目定位',
            type: 'map',
            colShow: false,
            allowReset: false,
            span: 24,
            real: false,
            // 定位相关配置
            target: {
              address: 'reportAddress',
              lng: 'longitude',
              lat: 'latitude',
              areaCode: 'areaCode'
            },
            // 获取当前定位
            getCurrentPosition: res => {
              console.log(res)
            }
          },
          // 企业经度
          longitude: {
            label: '企业经度',
            show: false,
            colShow: false
          },
          // 企业纬度
          latitude: {
            label: '企业纬度',
            show: false,
            colShow: false
          },
          // 地区码
          areaCode: {
            show: false,
            colShow: false
          },
          // 创建时间
          createDate: {
            label: '创建时间',
            width: 200,
            show: false,
            real: false
          }
        }
      },
      addUrl: '/carp/business/a/q/question/report/insert',
      delUrl: '/carp/business/a/q/question/report',
      searchUrl: '/carp/business/a/q/question/report/page',
      // 详情数据
      details: {},
      // 详情弹出框
      detailsView: {
        show: false
      },
      // 发起督办派单弹窗控制器
      sendTaskShow: false,
      // 筛选器
      filters: {
        stateQuestion: {
          label: '上报进度',
          type: 'select',
          item: [],
          value: null
        },
        // 用户地区码
        areaCode: {
          show: false,
          value: [0].includes(this.$userType) ? '' : user.accountTypeDto.code
        },
        // 上报人Id
        peopleId: {
          show: false,
          value: [0, 50].includes(this.$userType) ? '' : user.id
        }
      }
    }
  },
  computed: {
    active() {
      let index = 3
      this.form.label.reportState.item.forEach((item, i) => {
        if (item.code == this.details.reportState) {
          index = i
        }
      })
      return index
    }
  },
  created() {
    // 获取问题上报类型字典表
    this.getReportType()
    // 获取上报进度字典表
    this.getStateQuestion()
  },
  methods: {
    /* *
     * 获取字典表
     * * */
    // 获取上报类型
    getReportType() {
      this.$http.get('/carp/business/a/q/dict/category/report').then(({ code, data }) => {
        if (code === 0) {
          this.form.label.reportType.item = data.map(item => ({
            label: item.name,
            code: item.id,
            type: 'danger'
          }))
        } else {
          this.$message.err('问题上报类型字典表获取失败')
        }
      })
    },
    // 获取上报进度
    getStateQuestion() {
      this.$http.get('/carp/business/a/q/dict/category/report_state').then(({ code, data }) => {
        if (code === 0) {
          this.form.label.reportState.item = data.map((item, index) => ({
            label: item.name,
            code: item.id,
            type: ['success', 'danger', 'warning', 'primary'][index]
          }))
          this.form.label.reportState.default = this.form.label.reportState.item[2].code
          this.filters.stateQuestion.item = [{ label: '全部', code: null }].concat(this.form.label.reportState.item)
        } else {
          this.$message.error('获取上报进度字典表失败')
        }
      })
    },

    /* *
     * 获取表格行
     * * */
    getRow({ row, key }) {
      this.$http.get(`/carp/business/a/q/question/report/${row.id}`).then(({ code, data }) => {
        if (code === 0) {
          this.details = data
        } else {
          this.details = row
        }
      })
      switch (key) {
        case 'details':
          this.detailsView.show = true
          break

        default:
          break
      }
    },

    /* *
     * 作废
     * * */
    reject() {
      this.$confirm('当前问题已作废?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http
          .put(`/carp/business/a/q/question/report/update`, Object.assign(this.details, { reportState: this.form.label.reportState.item[1].code }))
          .then(({ code }) => {
            if (code === 0) {
              this.$refs.tableControl.getList()
              this.detailsView.show = false
              this.$message.success('提交成功')
            } else {
              this.$message.error('提交失败')
            }
          })
      })
    }
  },
  components: {
    commonTableControl,
    detailsView,
    sendTask
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
