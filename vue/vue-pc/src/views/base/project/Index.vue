<template>
  <div class="container">
    <common-table-control
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
      :filters="filters"
      :bind-buttons="[{ label: '参建单位', key: 'company', icon: 'el-icon-office-building' }]"
      @bindButtonClick="getRow"
    ></common-table-control>
    <!-- 企业绑定操作 -->
    <el-dialog class="dialog" :visible.sync="companyBind.show" top="6vh" width="60%">
      <div slot="title">
        <span>参建单位</span>
        <el-tag type="success" size="mini" v-text="project.name" style="margin-left:4px"></el-tag>
      </div>
      <!-- 绑定操作表单 -->
      <company-bind :info="project" style="height:64vh"></company-bind>
    </el-dialog>
    <!-- 企业绑定操作end -->
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import companyBind from './CompanyBind'
export default {
  name: 'project',
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
      // 当前登录用户信息
      user,
      // 表操作权限
      tablePermission,
      // 表单配置
      form: {
        // 显示
        show: false,
        // 操作格式
        type: 'add',
        // 表单数据
        data: {},
        // 表格标题
        label: {
          // 项目图片
          image: {
            label: '项目图片',
            type: 'uploadImg',
            colType: 'img',
            width: 160,
            span: 24,
            url: '/carp/file/a/q/file/upload/files/base_image',
            before: file => {
              const isJPG = file.type.includes('image')
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isJPG) {
                this.$message.error('上传图片只能是 JPG 格式!')
              }
              if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
              }
              return isJPG && isLt2M
            },
            success: ({ code, data }) => {
              if (code !== 4002) {
                this.$message.err('图片上传失败')
              } else {
                this.form.data.image = data
                this.$message('图片上传成功')
              }
            }
          },
          // 项目名称
          name: {
            label: '项目名称',
            type: 'string',
            colType: 'edit',
            width: 200,
            required: true,
            allowReset: false,
            rule: {
              regExp: /^.{1,100}$/gi,
              message: '100位以内的汉字英文或数字'
            }
          },
          // 项目属地
          areaName: {
            label: '项目属地',
            type: 'search',
            show: false,
            real: false,
            required: true
          },
          // 项目属地-地区码
          areaId: {
            label: '项目属地',
            type: 'area',
            colShow: false,
            default: '290871061266829312',
            required: true
          },
          // 行政属地-id
          adminAreaId: {
            label: '行政属地',
            type: 'area',
            colShow: false,
            default: '290871061266829312',
            required: true
          },
          // 项目类型-id
          dictId: {
            label: '项目类型',
            type: 'select',
            colShow: false,
            item: [],
            allowReset: true,
            required: true
          },
          // 项目类型-名称
          dictName: {
            label: '项目类型',
            show: false,
            real: false,
            width: 160
          },
          // 建设性质类型
          architecturalNature: {
            label: '建设性质',
            type: 'select',
            colShow: false,
            item: [],
            required: true
          },
          // 投资类型
          investType: {
            label: '投资类型',
            type: 'select',
            colShow: false,
            item: [],
            required: true
          },
          // 项目状态
          state: {
            label: '项目状态',
            type: 'select',
            item: [],
            colShow: false,
            required: true
          },
          // 项目定位
          location: {
            label: '项目定位',
            type: 'map',
            colShow: false,
            span: 24,
            real: false,
            // 定位相关配置
            target: {
              address: 'address',
              lng: 'longitude',
              lat: 'latitude'
            },
            required: true
          },
          // 法人
          creator: {
            label: '法人',
            type: 'string',
            colShow: false,
            allowReset: true
          },
          // 法人身份证
          creatorIdCard: {
            label: '法人身份证',
            width: 180,
            colShow: false,
            rule: {
              regExp: /^\d{17}(\d|x)$|^$|^null$|^undefined$/gi,
              message: '请输入有效的身份证号码'
            }
          },
          // 法人电话号码
          creatorPhone: {
            label: '法人电话号码',
            width: 160,
            colShow: false,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            }
          },
          // 项目经理
          manager: {
            label: '项目经理',
            type: 'string',
            allowReset: true
          },
          // 项目经理身份证
          managerIdCard: {
            label: '项目经理身份证',
            labelWidth: '112px',
            width: 180,
            colShow: false,
            rule: {
              regExp: /^\d{17}(\d|x)$|^$|^null$|^undefined$/gi,
              message: '请输入有效的身份证号码'
            }
          },
          // 项目经理电话
          managerPhone: {
            label: '项目经理电话',
            type: 'string',
            width: 160,
            allowReset: true,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            }
          },
          // 项目规模
          scale: {
            label: '项目规模',
            colShow: false,
            unit: '平方米'
          },
          // 长度
          projectLength: {
            label: '长度',
            unit: '米',
            colShow: false
          },
          // 工程总造价
          totalCost: {
            label: '工程总造价',
            type: 'number',
            allowReset: true,
            unit: '万元'
          },
          // 项目所属公司名称
          companyName: {
            label: '项目所属公司',
            type: 'company',
            companyType: '146',
            placeholder: '搜索公司名称',
            colShow: false,
            real: false,
            target: 'companyId'
          },
          // 项目所属公司ID
          companyId: {
            label: '项目所属公司ID',
            show: false,
            colShow: false
          },
          // 开工时间
          startDate: {
            label: '开工时间',
            type: 'date',
            colShow: false,
            allowReset: true
          },
          // 完工时间
          completeDate: {
            label: '完工时间',
            type: 'date',
            colShow: false,
            allowReset: true
          },
          // 经度
          longitude: {
            label: '经度',
            type: 'number',
            allowReset: true,
            show: false,
            colShow: false
          },
          // 纬度
          latitude: {
            label: '纬度',
            type: 'number',
            allowReset: true,
            show: false,
            colShow: false
          },
          // 项目地址
          address: {
            label: '项目地址',
            colShow: false
          },
          // 项目描述
          description: {
            label: '项目描述',
            type: 'textarea',
            colShow: false,
            span: 24,
            rows: 3,
            width: 200
          }
        }
      },
      // 增删改api
      addUrl: '/carp/business/a/q/project',
      delUrl: '/carp/business/a/q/project',
      editUrl: '/carp/business/a/q/project',
      searchUrl: '/carp/business/a/q/project/list',
      // 当前选择项目
      project: {},
      // 企业绑定配置
      companyBind: {
        show: false
      },
      // 筛选器
      filters: {
        // 地区码
        areaCode: {
          label: '地区',
          type: 'area',
          props: {
            code: 'code'
          },
          area: (() => {
            let area = []
            this.$getAreaTree(user.accountTypeDto.code, tree => {
              area = [tree]
            })
            return area
          })(),
          show: [0].includes(this.$userType),
          value: [50].includes(this.$userType) ? user.accountTypeDto.code : null
        },
        // 项目名称
        name: {
          label: '根据项目名称搜索',
          type: 'search',
          value: ''
        }
      }
    }
  },
  methods: {
    /* *
     * 获取字典表
     * * */
    // 获取工地类型字典表
    getProjectType() {
      this.$http.get('/carp/business/a/q/dict/category/project_type').then(({ code, data }) => {
        if (code !== 0) {
          console.log('请求工地类型失败')
          return
        }
        this.form.label.dictId.item = data.map(item => {
          return {
            code: item.id,
            label: item.name
          }
        })
      })
    },
    // 获取项目状态字典表
    getProjectState() {
      this.$http.get('/carp/business/a/q/dict/category/project_state').then(({ code, data }) => {
        if (code === 0) {
          this.form.label.state.item = data.map(item => ({
            label: item.name,
            code: item.id
          }))
        } else {
          this.$message.error('项目状态字典表请求失败')
        }
      })
    },
    // 获取建设类型字典表
    getArchitecturalNature() {
      this.$http.get('/carp/business/a/q/dict/category/architectural_nature').then(({ code, data }) => {
        if (code === 0) {
          this.form.label.architecturalNature.item = data.map(item => ({
            label: item.name,
            code: item.id
          }))
        }
      })
    },
    // 获取投资类型字典表
    getInvestNature() {
      this.$http.get('/carp/business/a/q/dict/category/invest_nature').then(({ code, data }) => {
        if (code === 0) {
          this.form.label.investType.item = data.map(item => ({
            label: item.name,
            code: item.id
          }))
        }
      })
    },

    /* *
     * 获取表格当前行
     * * */
    getRow({ row, key }) {
      this.project = row
      switch (key) {
        // 参建单位
        case 'company':
          this.companyBind.show = true
          break

        default:
          break
      }
    }
  },
  created() {
    // 获取企业类型
    this.getProjectType()
    // 获取项目状态字典表
    this.getProjectState()
    // 获取建设类型字典表
    this.getArchitecturalNature()
    // 获取投资类型字典表
    this.getInvestNature()
  },
  components: {
    commonTableControl,
    companyBind
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
