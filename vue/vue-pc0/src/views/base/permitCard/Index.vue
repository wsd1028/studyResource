<template>
  <div style="display:flex">
    <common-table-control
      ref="tableControl"
      :formConfig="form"
      :addUrl="addUrl"
      :delUrl="delUrl"
      :editUrl="editUrl"
      :searchUrl="searchUrl"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control-edit="false"
      :show-control-del="false"
      :show-control="[0, 50].includes($userType)"
      :filters="filters"
      :bind-buttons="[{ label: '审核' }]"
      @bindButtonClick="
        permitCard = $event.row
        reviewShow = true
      "
      @formClosed="
        constructionCompany = buildCompany = {}
        form.label.projectId.disabled = ![0, 50].includes($userType)
      "
    >
      <div slot="form">
        <h3 v-show="buildCompany.name || constructionCompany.name" class="title">
          <span>企业信息</span>
        </h3>
        <h4 v-show="buildCompany.name" style="margin:10px 0">
          <span>建设单位:</span><span style="margin-left:4px">{{ buildCompany.name }}</span>
        </h4>
        <h4 v-show="constructionCompany.name" style="margin:10px 0">
          <span>施工单位:</span><span style="margin-left:4px">{{ constructionCompany.name }}</span>
        </h4>
        <!-- 企业绑定操作弹窗 -->
        <el-dialog
          class="dialog"
          :visible.sync="companyBindShow"
          top="6vh"
          width="60%"
          append-to-body
          @closed="
            ;['657', '658'].forEach(type => {
              getCompanyInfo(form.data.projectId, type)
            })
          "
        >
          <div slot="title">
            <span>参建单位</span>
            <el-tag type="success" size="mini" v-text="project.name" style="margin-left:4px"></el-tag>
            <el-tag type="danger" size="mini" style="margin-left:4px">未添加建筑单位或施工单位</el-tag>
          </div>
          <!-- 绑定操作表单弹窗 -->
          <company-bind :info="project" style="height:64vh"></company-bind>
        </el-dialog>
        <!-- 企业绑定操作end -->
      </div>
    </common-table-control>
    <el-dialog v-if="reviewShow" :visible="true" width="500px" @close="reviewShow = false">
      <div slot="title">
        <span>排放证审核</span>
        <el-tag size="mini" type="success" v-cloak style="margin-left:4px"> 宜宾市第{{ permitCard.issueNum }}号 </el-tag>
      </div>
      <permit-review
        :permitCard="permitCard"
        :close="
          () => {
            reviewShow = false
            $refs.tableControl.getList()
          }
        "
      ></permit-review>
    </el-dialog>
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import permitReview from './review'
import companyBind from '../project/CompanyBind'
import { workStationDict } from '@/libs/dict'
export default {
  name: 'permitCard',
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
    const user = this.$store.state.user.userInfo
    return {
      user,

      // 审核弹窗显示控制器
      reviewShow: false,
      // 审核的排放证
      permitCard: {},

      // 表操作权限
      tablePermission,

      // 表单配置
      form: {
        labelWidth: '70px',
        // 表格标题
        label: {
          // 排放证附件
          imgList: {
            label: '图片',
            type: 'uploadImgs',
            colShow: false,
            default: [],
            span: 24,
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
          // 证号
          issueNum: {
            label: '证号',
            width: '160',
            colType: 'edit',
            beforeUnit: '宜宾市第',
            unit: '号',
            required: true
          },
          // 项目
          projectName: {
            label: '项目',
            show: false
          },
          projectId: {
            label: '项目',
            type: 'project',
            area: user.accountTypeDto.code,
            colShow: false,
            change: ({ id, node }) => {
              this.project = Object.assign(node, {
                id: node.projectId,
                name: node.projectName
              })
              this.form.label.projectName.default = node.name
              this.form.data.projectName = node.name
              ;['657', '658'].forEach(type => {
                this.getCompanyInfo(id, type)
              })
            },
            default: [0, 50].includes(this.$userType) ? null : user.accountTypeDto.ancillaryId,
            disabled: ![0, 50].includes(this.$userType) ? true : false,
            allowReset: [0, 50].includes(this.$userType) ? true : false,
            required: true
          },

          // 消纳站
          garbageStationName: {
            label: '消纳站',
            show: false
          },
          garbageStationId: {
            label: '消纳站',
            type: 'garbageStation',
            change: ({ name }) => {
              this.form.data.garbageStationName = name
            },
            colShow: false,
            required: true
          },

          // 行驶路线
          driverRoute: {
            label: '行驶路线',
            colShow: false,
            required: true
          },
          // 物品类型
          itemType: {
            label: '物品类型',
            type: 'select',
            required: true
          },
          // 发证机关
          issueUnit: {
            label: '发证机关',
            colShow: false
          },
          // 排放总量
          totalDischarge: {
            label: '排放总量',
            unit: '升/L',
            colShow: false
          },
          // 发证时间
          issueDate: {
            label: '发证时间',
            type: 'date',
            colShow: false,
            width: 90,
            required: true
          },
          // 排放证开始时间
          emissionPermitStartDate: {
            label: '排放证开始时间',
            type: 'date',
            labelWidth: '110px',
            colShow: false,
            width: 160
          },
          // 排放证结束时间
          emissionPermitEndDate: {
            label: '排放证结束时间',
            type: 'date',
            labelWidth: '110px',
            colShow: false,
            width: 90
          },

          // 建设单位
          buildTitle: {
            label: '建设单位',
            type: 'title',
            span: 24,
            real: false,
            colShow: false
          },
          buildId: {
            show: false,
            colShow: false
          },
          buildCompany: {
            label: '建设单位',
            disabled: true,
            allowReset: false,
            required: true
          },
          // 建设单位联系人
          buildPeople: {
            label: '联系人',
            colShow: false
          },
          // 建设单位电话
          buildPhone: {
            label: '电话',
            colShow: false,
            required: true,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            }
          },

          // 施工单位
          constructionCompanyTitle: {
            label: '施工单位',
            type: 'title',
            span: 24,
            real: false,
            colShow: false
          },
          constructionCompany: {
            label: '施工单位',
            disabled: true,
            allowReset: false,
            required: true
          },
          constructionId: {
            show: false,
            colShow: false
          },
          constructionPeople: {
            label: '联系人',
            colShow: false
          },
          constructionPhone: {
            label: '电话',
            required: true,
            colShow: false,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            }
          },

          // 运输企业
          transportCompanyTitle: {
            label: '运输单位',
            type: 'title',
            span: 24,
            colShow: false
          },
          transportType: {
            type: 'radio',
            item: [
              { label: '运输企业', code: false },
              { label: '个人业户', code: true }
            ],
            span: 24,
            default: false,
            colShow: false,
            real: false,
            change: type => {
              // 为个人业户时
              if (type) {
                this.form.label.transportCompany.show = false
                this.form.data.transportCompany = null
                this.form.data.transportCompanyId = null
              }
              // 为运输企业时
              else {
                this.form.label.transportCompany.show = true
              }
            }
          },
          transportCompany: {
            label: '运输企业',
            show: true,
            type: 'company',
            companyType: '145',
            target: 'transportCompanyId',
            default: null,
            required: true
          },
          transportCompanyId: {
            show: false,
            colShow: false,
            default: null
          },
          transportPeople: {
            label: '联系人',
            colShow: false
          },
          transportPhone: {
            label: '联系电话',
            colShow: false,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            },
            required: true
          },

          // 有效期(仅展示)
          expiryDate: {
            label: '有效期',
            show: false,
            real: false,
            data: (data, row) =>
              `<span>${this.$moment(row.emissionPermitStartDate).format('YYYY[年]MM月DD日')}</span><br/>至<br/><span>${this.$moment(
                row.emissionPermitEndDate
              ).format('YYYY[年]MM月DD日')}</span>`
          },

          // 账号类型
          departmentType: {
            show: false,
            colShow: false,
            default: [0, 50].includes(this.$userType) ? workStationDict[0].code : workStationDict[1].code
          },
          // 是否过期
          timeState: {
            label: '是否已过期',
            show: false,
            colType: 'tag',
            item: [
              { label: '已过期', type: 'danger', code: true },
              { label: '未过期', type: 'success', code: false }
            ],
            default: null
          },

          // 审核
          examinePeopleId: {
            show: false,
            colShow: false,
            default: user.id
          },
          examineState: {
            label: '审核状态',
            show: false,
            colType: 'tag',
            item: [
              { label: '已通过', code: 1, type: 'success' },
              { label: '未通过', code: 2, type: 'danger' },
              { label: '未通过', code: null, type: 'danger' }
            ],
            default: [0, 50].includes(this.$userType) ? 1 : 2
          },
          examineMessage: {
            show: false,
            colShow: false,
            default: ''
          }
        },

        // 监听提交按钮触发事件
        onBeforeSubmit: isBreak => {
          if (!this.form.data.buildId || !this.form.data.constructionId) {
            isBreak()
            this.companyBindShow = true
          }
        }
      },

      // 建筑单位
      buildCompany: {},

      // 施工单位
      constructionCompany: {},
      addUrl: '/carp/business/a/q/discharge/permit',
      delUrl: '/carp/business/a/q/discharge/permit',
      editUrl: '/carp/business/a/q/discharge/permit',
      searchUrl: '',

      // 当前选择项目
      project: {},
      // 项目企业绑定弹窗控制
      companyBindShow: false,

      // 筛选器
      filters: {
        // 项目id
        projectId: {
          label: '搜索项目',
          type: 'subSearch',
          url: '/carp/business/a/q/project/list',
          show: ![30].includes(this.$userType),
          value: [30].includes(this.$userType) ? user.accountTypeDto.ancillaryId : ''
        }
      }
    }
  },
  methods: {
    // 获取物品类型字典表
    getType() {
      this.$http.get('/carp/business/a/q/dict/category/type').then(({ code, data }) => {
        if (code === 0) {
          this.form.label.itemType.item = data.map(item => ({
            label: item.name,
            code: parseInt(item.id)
          }))
        } else {
          this.$message.error('获取物品类型字典表失败')
        }
        this.searchUrl = '/carp/business/a/q/discharge/permit/list'
      })
    },

    // 根据项目id和企业类型获取企业信息
    getCompanyInfo(projectId, companyType) {
      this.$http
        .get('/carp/business/a/q/project/corp/selectCompanyNameByProjectId', {
          params: {
            projectId,
            type: companyType
          }
        })
        .then(({ code, data }) => {
          if (code === 0 && data) {
            switch (companyType) {
              // 建设单位
              case '657':
                this.buildCompany = data
                this.form.data.buildCompany = data.name
                this.form.data.buildId = data.id
                break

              // 施工单位
              case '658':
                this.constructionCompany = data
                this.form.data.constructionCompany = data.name
                this.form.data.constructionId = data.id
                break

              default:
                break
            }
          }
        })
    }
  },
  created() {
    this.getType()
  },
  components: {
    commonTableControl,
    permitReview,
    companyBind
  }
}
</script>
