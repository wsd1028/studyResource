<template>
  <div style="display:flex">
    <common-table-control
      ref="tableControl"
      :formConfig="form"
      :addUrl="addUrl"
      :delUrl="delUrl"
      :editUrl="editUrl"
      :searchUrl="searchUrl"
      :allow-add="tablePermission.add && allowAdd"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control="[0, 50].includes($userType)"
      :show-control-edit="false"
      :show-control-del="false"
      :filters="filters"
      :bind-buttons="[0, 50].includes($userType) ? [{ label: '审核', key: 'review' }] : []"
      @bindButtonClick="
        garbageStation = $event.row
        reviewShow = true
      "
    ></common-table-control>
    <el-dialog v-if="reviewShow" :visible="true" width="500px" @close="reviewShow = false">
      <div slot="title">
        <span>消纳站审核</span>
        <el-tag size="mini" type="success" v-cloak style="margin-left:4px"> {{ garbageStation.name }} </el-tag>
      </div>
      <garbage-station-review
        :garbageStation="garbageStation"
        :examinePeopleName="form.label.examinePeopleName.default"
        :close="
          () => {
            reviewShow = false
            $refs.tableControl.getList()
          }
        "
      ></garbage-station-review>
    </el-dialog>
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import garbageStationReview from './review'
export default {
  name: 'garbageStation',
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

    // 获取当前登录用户
    const user = this.$store.state.user.userInfo

    return {
      // 当前登录用户
      user,

      // 禁用添加,在created阶段相关操作完成后启用
      allowAdd: false,

      // 表操作权限
      tablePermission,

      // 审核弹窗控制
      reviewShow: false,

      // 当前选择消纳站对象
      garbageStation: {},

      // 表单配置
      form: {
        labelWidth: '110px',
        // 表格标题
        label: {
          // 背景图
          backgroundPhoto: {
            label: '消纳场图片',
            type: 'uploadImg',
            colType: 'img',
            width: 160,
            span: 24,
            url: '/carp/file/a/q/file/upload/files/base_image',
            before: file => {
              const isJPG = file.type.includes('image')
              const isLt2M = file.size / 1024 / 1024 < 2
              if (!isJPG) {
                this.$message.error('只能上传图片格式!')
              }
              if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!')
              }
              return isJPG && isLt2M
            }
          },
          // 消纳场名称
          name: {
            label: '消纳场名称',
            type: 'string',
            colType: 'edit',
            width: 200,
            required: true
          },
          // 消纳场种类
          dictId: {
            label: '消纳场种类',
            type: 'select',
            item: [],
            required: true
          },
          // 纬度
          latitude: {
            label: '消纳场纬度',
            show: false,
            colShow: false
          },
          // 经度
          longitude: {
            label: '消纳场经度',
            show: false,
            colShow: false
          },
          // 项目属地
          areaId: {
            label: '所属地区',
            type: 'area',
            // 地区树
            areaTree: (() => {
              let areaTree = []
              if ([50].includes(this.$userType)) {
                this.$getAreaTree(user.accountTypeDto.code, area => {
                  areaTree = [area]
                })
              } else {
                areaTree = null
              }
              return areaTree
            })(),
            colShow: false,
            required: true
          },
          // 所属行政区域
          adminAreaId: {
            label: '行政区域',
            type: 'area',
            // 地区树
            areaTree: (() => {
              let areaTree = []
              if ([50].includes(this.$userType)) {
                this.$getAreaTree(user.accountTypeDto.code, area => {
                  areaTree = [area]
                })
              } else {
                areaTree = null
              }
              return areaTree
            })(),
            colShow: false,
            required: true
          },
          // 消纳场容量
          capacity: {
            label: '消纳场容量',
            type: 'string',
            unit: '万立方米',
            allowReset: true,
            colShow: false
          },
          // 剩余方量
          garbageSurplusWeight: {
            label: '剩余方量',
            type: 'string',
            unit: '万立方米',
            colShow: false
          },
          // 项目定位
          location: {
            label: '项目定位',
            type: 'map',
            colShow: false,
            address: '',
            lng: '',
            lat: '',
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
          // 消纳企业
          companyName: {
            label: '消纳企业',
            type: 'company',
            companyType: '320302652877340672',
            real: false,
            colShow: false,
            target: 'companyId'
          },
          companyId: {
            show: false,
            colShow: false
          },
          // 地址
          address: {
            label: '消纳场地址',
            colShow: false
          },
          // 消纳场占地面积
          acreage: {
            label: '消纳场占地面积',
            type: 'string',
            unit: '平方米',
            colShow: false,
            width: 160
          },
          // 总方量
          garbageAllWeight: {
            label: '总方量',
            type: 'string',
            unit: '万立方米',
            show: false,
            colShow: false
          },
          // 面积
          garbageArea: {
            label: '面积',
            type: 'string',
            unit: '平方',
            show: false,
            colShow: false
          },
          // 负责人
          linkman: {
            label: '负责人'
          },
          // 负责人身份证
          linkmanIdCard: {
            label: '负责人身份证',
            type: 'string',
            colShow: false,
            width: 140,
            rule: {
              regExp: /^\d{17}(\d|x)$|^$|^null$|^undefined$/gi,
              message: '请输入有效的身份证号码'
            }
          },
          // 负责人联系电话
          linkmanPhone: {
            label: '负责人联系电话',
            type: 'string',
            width: 140,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            }
          },
          // 法人
          creator: {
            label: '法人',
            colShow: false,
            type: 'string'
          },
          // 法人身份证
          creatorIdCard: {
            label: '法人身份证',
            type: 'string',
            colShow: false,
            rule: {
              regExp: /^\d{17}(\d|x)$|^$|^null$|^undefined$/gi,
              message: '请输入有效的身份证号码'
            }
          },
          // 法人电话
          creatorPhone: {
            label: '法人电话',
            type: 'string',
            colShow: false,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            }
          },

          // 创建人id
          peopleId: {
            show: false,
            colShow: false,
            default: user.id
          },
          // 创建人名称,政府人员:部门+名称,项目人员+姓名
          peopleName: {
            label: '创建人',
            show: false,
            default: null
          },
          // 审核
          examinePeopleId: {
            show: false,
            colShow: false,
            default: user.id
          },
          examinePeopleName: {
            label: '审批人',
            show: false,
            default: null
          },
          examineState: {
            label: '审核状态',
            show: false,
            colType: 'tag',
            item: [
              { label: '已通过', code: 1, type: 'success' },
              { label: '未通过', code: 2, type: 'danger' },
              { label: '待审核', code: 3, type: 'warning' }
            ],
            default: [0, 50].includes(this.$userType) ? 1 : 3
          },
          examineMessage: {
            show: false,
            colShow: false,
            default: ''
          },
          createDate: {
            label: '创建时间',
            show: false
          }
        }
      },
      // 增删改api
      addUrl: '/carp/business/a/q/garbage/station',
      delUrl: '/carp/business/a/q/garbage/station/',
      editUrl: '/carp/business/a/q/garbage/station',
      searchUrl: '',
      // 筛选器
      filters: {
        // 地区id
        areaCode: {
          show: false,
          value: [0, 30].includes(this.$userType) ? null : user.accountTypeDto.code
        },
        // 消纳站名称
        name: {
          label: '根据消纳站名称搜索',
          type: 'search',
          value: ''
        },
        // 创建人
        peopleId: {
          show: false,
          value: [30].includes(this.$userType) ? user.id : null
        }
      }
    }
  },
  methods: {
    // 获取收纳站类型
    getType() {
      return this.$http.get('/carp/business/a/q/dict/category/type').then(({ code, data }) => {
        if (code === 0) {
          this.form.label.dictId.item = data.map(item => ({
            code: item.id,
            label: item.name
          }))
          this.searchUrl = '/carp/business/a/q/garbage/station/page'
        }
      })
    },

    // 获取登录用户并生成创建名赋值给表单中的peopleName
    getCreatorInfo() {
      switch (this.$userType) {
        // 项目人员
        case 30:
          // 项目人员是否绑定项目
          if (this.user.accountTypeDto.ancillaryId) {
            this.$http.get(`/carp/business/a/q/project/${this.user.accountTypeDto.ancillaryId}`).then(({ code, data }) => {
              if (code === 0) {
                this.form.label.peopleName.default = `${data.name}-${this.user.accountBaseDto.name}`
              } else {
                this.$message.error('获取项目名称失败')
              }
              // 开启新增条件
              this.allowAdd = true
            })
          } else {
            this.form.label.peopleName.default = `未知项目-${this.user.accountBaseDto.name}`
            // 开启新增条件
            this.allowAdd = true
          }
          break

        // 政府人员
        case 50:
          this.form.label.examinePeopleName.default = this.form.label.peopleName.default = `${this.user.organizationDto && this.user.organizationDto.name}-${
            this.user.accountBaseDto.name
          }`
          // 开启新增条件
          this.allowAdd = true
          break

        // 管理员
        case 0:
          this.form.label.examinePeopleName.default = this.form.label.peopleName.default = `系统管理员-${this.user.accountBaseDto.name}`
          // 开启新增条件
          this.allowAdd = true
          break

        default:
          this.form.label.peopleName.default = `未知账号-${this.user.accountBaseDto.name}`
          // 开启新增条件
          this.allowAdd = true
          break
      }
    }
  },
  created() {
    // 获取收纳站类型
    this.getType()
    // 获取创建者名称
    this.getCreatorInfo()
  },
  components: {
    commonTableControl,
    garbageStationReview
  }
}
</script>
