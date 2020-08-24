<template>
  <div class="container">
    <table-control
      ref="tableControl"
      :formConfig="baseForm"
      :addUrl="addUrl"
      addDescription="新增视频巡检"
      :delUrl="delUrl"
      :searchUrl="searchUrl"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control-del="false"
      :show-search="false"
      :allow-export="false"
      :filters="filters"
      :bind-buttons="[{ label: '查看', key: 'details', icon: 'el-icon-view' }]"
      @bindButtonClick="getRow"
    >
    </table-control>

    <!-- 视频巡检 -->
    <el-dialog class="dialog" v-if="detailsShow" :visible="true" width="800px" top="5vh" append-to-body :show-close="false">
      <div slot="title" style="display:flex;justify-content:space-between">
        <div style="font-size: 20px;font-weight: bold">
          <span style="margin-right: 20px">视频巡检详情</span>
          <el-tag type="success" size="mini" v-text="details.name" style="margin-left:4px"></el-tag>
        </div>
        <i class="el-icon-close" @click="detailsShow = false" style="cursor:pointer"></i>
      </div>
      <details-bind
        :info="details"
        :state="baseForm.label.state.item"
        :dict="checkRuleDict"
        :close="
          () => {
            detailsShow = false
            $refs.tableControl.getList()
          }
        "
      ></details-bind>
    </el-dialog>
    <!-- 视频巡检end -->
  </div>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
import detailsBind from './Details'
import { workStationDict } from '@/libs/dict'
export default {
  name: 'TodayCheck',
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
    let user = this.$store.state.user.userInfo
    return {
      // 表操作权限
      tablePermission,
      // 当前登录用户信息
      user,
      // 视频巡检基本信息表单
      baseForm: {
        // 表格标题
        label: {
          // 视频封面
          videoImage: {
            label: '视频封面',
            colType: 'img',
            HBase: true,
            show: false
          },
          // 巡检人
          checkPeopleName: {
            label: '巡检人',
            show: false
          },
          // 部门状态
          departmentState: {
            label: '部门状态',
            type: 'select',
            show: false,
            colShow: false,
            item: workStationDict
          },
          name: {
            label: '项目',
            width: 200,
            show: false
          },
          // 巡检状态
          state: {
            label: '巡检状态',
            colType: 'tag',
            item: [],
            default: null,
            show: false
          },
          // 创建时间
          createDate: {
            label: '创建时间',
            show: false,
            width: 200
          }
        },
        /* *
         * 政府/企业新增巡检
         * * */
        customCreate: (data, finish) => {
          console.log(data)
          finish()
        }
      },
      // 视频巡检内容表单
      addUrl: '/carp/business/a/q/video/check/increase',
      delUrl: '/carp/business/a/q/video/check',
      searchUrl: '/carp/business/a/q/video/check/page',
      filters: {
        // 开始时间
        startTime: {
          label: '开始时间',
          type: 'date'
        },
        // 结束时间
        endTime: {
          label: '结束时间',
          type: 'date'
        },
        // 巡检状态
        state: {
          label: '巡检状态',
          type: 'select',
          item: [],
          default: null
        },
        // 搜索项目或消纳站
        projectName: {
          label: '搜索项目/消纳站',
          type: 'search',
          show: [0, 50].includes(this.$userType)
        },
        // 地区码
        areaCode: {
          show: false,
          value: [50].includes(this.$userType) ? user.accountTypeDto.code : null
        },
        projectId: {
          show: false,
          value: [30, 60].includes(this.$userType) ? user.accountTypeDto.ancillaryId : null
        }
      },
      // 视频巡检详情
      detailsShow: false,
      details: {},
      // 巡检准则
      checkRuleDict: []
    }
  },
  created() {
    // 获取巡检状态
    this.getTodayCheckState()
    // 获取巡检准则字典表
    this.getCheckRuleDict()
  },
  methods: {
    /* *
     * 查看详情按钮事件
     * * */
    getRow({ row, key }) {
      this.details = row
      switch (key) {
        // 视频巡检详情
        case 'details':
          this.detailsShow = true
          break
      }
    },

    /* *
     * 获取巡检状态
     * 对应索引号 0:整改中 1:待审核 2:已结案
     * * */
    getTodayCheckState() {
      this.$http.get('/carp/business/a/q/dict/category/today_check_state').then(({ code, data }) => {
        if (code == 0) {
          let colors = ['primary', 'warning', 'success']
          // 设置表单下拉框数据
          this.baseForm.label.state.item = data.map((item, i) => ({
            label: item.name,
            code: item.id,
            type: colors[i]
          }))
          // 设置表单默认值
          this.baseForm.label.state.default = data[1].id
          this.filters.state.item = [{ label: '全部', code: ' ' }].concat(this.baseForm.label.state.item)
        } else {
          this.$message.error('未获取到视频巡检状态字典表')
        }
      })
    },

    /* *
     * 获取巡检准则字典表
     * 对应索引号 0:必须打围作业 1:必须硬化道路 2:必须设置冲洗设备 3:必须湿法作业 4:必须定时清扫施工现场 5:不准车辆带泥出门
     * * */
    getCheckRuleDict() {
      this.$http.get('/carp/business/a/q/dict/category/check_style').then(({ code, data }) => {
        if (code === 0) {
          this.checkRuleDict = data.map(item => ({ label: item.name, code: item.id }))
        } else {
          this.$message.error('巡检准则字典表获取失败')
        }
      })
    },

    /* *
     * 清除表单数据
     * * */
    clearFormData() {
      this.$refs.checkForm.clearForm()
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
}
</style>
