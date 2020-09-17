<template>
  <div class="container">
    <table-control
      ref="tableControl"
      :formConfig="baseForm"
      :addUrl="addUrl"
      addDescription="新增每日巡检"
      :delUrl="delUrl"
      :searchUrl="searchUrl"
      :show-search="false"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control-del="false"
      :allowExport="false"
      :filters="filters"
      :bind-buttons="bindBt"
      @bindButtonClick="getRow"
      @formClosed="updateChecked(baseForm.data.chooseCheck)"
    >
      <div slot="form">
        <common-form ref="checkForm" :form-config="checkForm"></common-form>
      </div>
    </table-control>

    <!-- 查看详情 -->
    <el-dialog class="dialog" v-if="detailsShow" :visible="true" width="600px" top="5vh" append-to-body :show-close="false">
      <div slot="title" style="display:flex;justify-content:space-between">
        <div style="font-size: 20px;font-weight: bold">
          <span style="margin-right: 20px">每日巡检详情</span>
          <el-tag type="success" size="mini" v-text="details.name" style="margin-left:4px"></el-tag>
        </div>
        <i class="el-icon-close" @click="detailsShow = false" style="cursor:pointer"></i>
      </div>
      <details-bind
        :info="details"
        :state="baseForm.label.state.item"
        :dict="baseForm.label.chooseCheck.item"
        :close="
          () => {
            detailsShow = false
            $refs.tableControl.getList()
          }
        "
      ></details-bind>
    </el-dialog>
    <!-- 查看详情end -->

    <!-- 审核 -->
    <el-dialog class="dialog" v-if="reviewShow" :visible="true" width="600px" top="5vh" append-to-body :show-close="false">
      <div slot="title" style="display:flex;justify-content:space-between">
        <div>
          <span>每日巡检审核</span>
          <el-tag type="success" size="mini" v-text="details.name" style="margin-left:4px"></el-tag>
        </div>
        <i class="el-icon-close" @click="reviewShow = false" style="cursor:pointer"></i>
      </div>
      <review-bind
        :info="details"
        :state="baseForm.label.state.item"
        :dict="baseForm.label.chooseCheck.item"
        :close="
          () => {
            reviewShow = false
            $refs.tableControl.getList()
          }
        "
      ></review-bind>
    </el-dialog>
    <!-- 审核end -->
  </div>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
import commonForm from '@/components/CommonForm'
import detailsBind from './Details'
import reviewBind from './Review'
import { todayCheckStateDict, workStationDict } from '@/libs/dict'
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
      // 每日巡检基本信息表单
      baseForm: {
        // 表格标题
        label: {
          // 巡检类型
          checkType: {
            label: '巡检类型',
            type: 'select',
            colShow: false,
            item: [
              { label: '扬尘', code: 1 },
              { label: '塔机', code: 2 }
            ],
            default: 1
          },
          // 工作站类型
          departmentState: {
            label: '巡检对象',
            type: 'select',
            show: [0, 50].includes(this.$userType),
            colShow: false,
            item: workStationDict.slice(1, 3),
            default: [60].includes(this.$userType) ? workStationDict[2].code : workStationDict[1].code,
            change: id => {
              if (id == workStationDict[1].code) {
                this.baseForm.label.workStationId.type = 'project'
              } else {
                this.baseForm.label.workStationId.type = 'garbageStation'
              }
            }
          },
          // 工作站
          name: {
            label: '项目/消纳站',
            show: false,
            real: false
          },
          workStationName: {
            show: false,
            colShow: false,
            default: null
          },
          workStationId: {
            label: '工作站',
            type: [60].includes(this.$userType) ? workStationDict[2].code : workStationDict[1].code,
            show: [0, 50].includes(this.$userType),
            colShow: false,
            default:
              (![0, 50].includes(this.$userType) &&
                (() => {
                  // 查询项目或消纳站名称
                  let userType = this.$userType
                  let ancillaryId = user.accountTypeDto.ancillaryId

                  // 获取项目名称
                  if (userType == 30) {
                    this.$http.get(`/carp/business/a/q/project/${ancillaryId}`).then(({ code, data }) => {
                      if (code === 0) {
                        this.baseForm.label.workStationName.default = data.name
                      } else {
                        this.$message.error('获取当前登录用户项目名称失败,请从新刷新页面')
                      }
                    })
                  }
                  // 获取消纳站名称
                  else if (userType == 60) {
                    this.$http.get(`/carp/business/a/q/garbage/station/${ancillaryId}`).then(({ code, data }) => {
                      if (code === 0) {
                        this.baseForm.label.workStationName.default = data.name
                      } else {
                        this.$message.error('获取当前登录用户消纳场名称失败,请从新刷新页面')
                      }
                    })
                  }

                  // 返回项目或消纳站id
                  return ancillaryId
                })()) ||
              null,
            change: ({ node }) => {
              this.baseForm.data.workStationName = node.projectName || node.name
              this.$getAreaTree(node.areaId, ({ code }) => {
                this.baseForm.data.areaCode = code
              })
            }
          },
          // 巡检人
          checkPeopleName: {
            label: '巡检人',
            default: user.accountBaseDto.name,
            show: false
          },
          checkPeopleId: {
            show: false,
            colShow: false,
            default: user.id
          },
          // 发起人id
          initiatorPeopleId: {
            show: false,
            colShow: false,
            default: user.id
          },
          // 今日巡检状态
          state: {
            label: '巡检状态',
            show: false,
            colType: 'tag',
            item: todayCheckStateDict,
            default: [50].includes(this.$userType) ? todayCheckStateDict[2].code : todayCheckStateDict[1].code
          },
          // 选择检查项
          chooseCheck: {
            label: '选择检查项',
            type: 'checked',
            item: [],
            span: 24,
            colShow: false,
            change: data => {
              this.updateChecked(data)
            }
          },
          createDate: {
            label: '创建时间',
            width: 200,
            show: false,
            real: false
          },
          // 地区码
          areaCode: {
            show: false,
            colShow: false,
            default: user.accountTypeDto.code
          }
        },
        /* *
         * 政府/企业新增巡检
         * * */
        customCreate: (data, finish) => {
          const params = JSON.parse(JSON.stringify(data))
          params.todaysCheckContentDtoList = params.chooseCheck.map(id => {
            return {
              dictId: id,
              todayCheckId: null,
              checkState: this.checkForm.data[`${id}-checkState`],
              checkRemark: this.checkForm.data[`${id}-checkRemark`],
              todaysImgEntityList: this.checkForm.data[`${id}-img`].map(imageUrl => ({
                id: null,
                todayCheckId: null,
                todayContentId: null,
                typeCode: id,
                imageUrl
              })),
              visible: true
            }
          })
          delete params.chooseCheck
          if ([0, 50].includes(this.$userType)) {
            params.state = this.baseForm.label.state.item[0].code
          } else {
            params.state = this.baseForm.label.state.item[1].code
          }
          this.$refs.checkForm.formValidate(valid => {
            // 表单验证
            if (!valid) {
              this.$message.error('表单内容填写不正确')
              finish('表单内容填写不正确')
              return
            }
            this.$http.post('/carp/business/a/q/todays/check/increase', params).then(({ code, message }) => {
              if (code === 0) {
                this.$message.success('添加成功')
                // 清除表单数据
                this.clearFormData()
                // 更新检查项
                this.updateChecked(this.baseForm.data.chooseCheck)
                finish()
              } else {
                this.$message.error(message)
                finish(message)
              }
            })
          })
        }
      },
      // 巡检项表单
      checkForm: {
        label: {}
      },
      // 每日巡检内容表单
      addUrl: '/carp/business/a/q/todays/check/increase',
      delUrl: '/carp/business/a/q/todays/check',
      searchUrl: '/carp/business/a/q/todays/check/page',
      filters: {
        // 开始时间
        startTime: {
          label: '开始时间',
          type: 'date'
        },
        // 结束时间
        endTime: {
          label: '结束时间',
          name: '-',
          type: 'date',
          value: this.$moment(Date.now()).format('YYYY-MM-DD HH:mm:ss')
        },
        // 巡检状态
        state: {
          label: '巡检状态',
          type: 'select',
          item: [{ label: '全部', code: '' }].concat(todayCheckStateDict),
          default: null
        },
        // 类型选择
        departmentState: {
          label: '根据工作站搜索',
          type: 'select',
          show: [0, 50].includes(this.$userType),
          item: workStationDict.slice(1, 3),
          value: [60].includes(this.$userType) ? workStationDict[2].code : workStationDict[1].code
        },
        // 根据项目或消纳站名称搜索
        projectName: {
          label: '根据项目或消纳站名称搜索',
          type: 'search',
          show: [0, 50].includes(this.$userType),
          value: null
        },
        // 项目或消纳站
        workStationId: {
          label: '搜索项目',
          show: false,
          value: (() => {
            // 查看路由是否传入项目id,如果有值则为该id,无值则根据用户类型判断
            if (this.$route.query.uid) {
              return this.$aesDecrypt(decodeURIComponent(this.$route.query.uid))
            } else {
              return [0, 50].includes(this.$userType) ? null : user.accountTypeDto.ancillaryId
            }
          })()
        },
        // 用户地区码
        areaCode: {
          show: false,
          value: [50].includes(this.$userType) ? user.accountTypeDto.code : null
        }
      },
      // 每日巡检详情
      reviewShow: false,
      detailsShow: false,
      details: {}
    }
  },
  computed: {
    bindBt() {
      let bt = [{ label: '查看', key: 'details', icon: 'el-icon-view' }]
      if ([50].includes(this.$userType)) {
        bt.push({ label: '审核', key: 'review', icon: 'el-icon-document-checked', type: 'warning', rule: { regExp: /5130/, key: 'state' } })
      }
      return bt
    }
  },
  created() {
    // 获取巡检准则
    this.getTodayCheckRule()
  },
  watch: {
    'baseForm.data.departmentState': {
      handler(state) {
        if (state == workStationDict[1].code) {
          this.baseForm.label.workStationId.type = 'project'
        }
      }
    }
  },
  methods: {
    /* *
     * 查看详情按钮事件
     * * */
    getRow({ row, key }) {
      this.details = row
      switch (key) {
        // 每日巡检详情
        case 'details':
          this.detailsShow = true
          break
        case 'review':
          this.reviewShow = true
          break
      }
    },

    /* *
     * 获取巡检准则
     * 对应索引号 0:必须打围作业 1:必须硬化道路 2:必须设置冲洗设备 3:必须湿法作业 4:必须定时清扫施工现场 5:不准车辆带泥出门
     * * */
    getTodayCheckRule() {
      this.$http.get('/carp/business/a/q/dict/category/check_style').then(({ code, data }) => {
        if (code === 0) {
          this.baseForm.label.chooseCheck.item = data.map(item => ({ label: item.name, code: item.id }))
          this.baseForm.label.chooseCheck.default = this.baseForm.label.chooseCheck.item.map(item => item.code)
          // 初始化巡检条目
          this.updateChecked(data.map(item => item.id))
        } else {
          this.$message.error('巡检准则字典表获取失败')
        }
      })
    },

    /* *
     * 更新巡检表单项
     * * */
    updateChecked(checkList) {
      this.$set(this.checkForm, 'label', {})
      // 巡检准则修饰字符串用索引顺序排序
      checkList.forEach(id => {
        // 获取当前巡检准则id号索引位置
        let label = ''
        this.baseForm.label.chooseCheck.item.every(item => {
          if (item.code == id) {
            label = item.label
            return false
          } else return true
        })

        // 标题
        this.$set(this.checkForm.label, `${id}-title`, {
          label: label + '项巡检',
          type: 'title',
          span: 24
        })

        // 图片/视频上传
        this.$set(this.checkForm.label, `${id}-img`, {
          label: '图片上传',
          labelWidth: '72px',
          type: 'uploadImgs',
          limit: 3,
          colShow: false,
          allowReset: false,
          default: [],
          span: 24,
          // 上传请求地址
          url: '/carp/file/a/q/hbase/file/upload/files/today_module',
          HBase: true,
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
        })

        // 如果是政府则添加巡检状态和备注
        if (![0, 50].includes(this.$userType)) {
          this.$set(this.checkForm.label[`${id}-img`], 'rule', {
            regExp: /^./,
            message: label + '该项不能为空'
          })
          return
        }

        // 巡检状态
        this.$set(this.checkForm.label, `${id}-checkState`, {
          label: '是否合格',
          labelWidth: '72px',
          type: 'radio',
          item: [
            { label: '合格', code: true },
            { label: '不合格', code: false }
          ],
          default: null
        })

        // 备注
        this.$set(this.checkForm.label, `${id}-checkRemark`, {
          label: '备注',
          labelWidth: '72px',
          type: 'textarea',
          rows: 3,
          maxlength: 200,
          span: 24
        })
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
    commonForm,
    detailsBind,
    reviewBind
  }
}
</script>

<style lang="less" scoped>
@import '~@/assets/less/common';
.container {
  @flex-column();
}
</style>
