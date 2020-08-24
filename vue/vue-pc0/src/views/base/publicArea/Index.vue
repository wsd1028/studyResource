<template>
  <div style="display:flex">
    <table-control
      ref="tableControl"
      :form-config="form"
      add-url="/carp/business/a/q/public/area/increase"
      del-url="/carp/business/a/q/public/area"
      edit-url="/carp/business/a/q/public/area"
      search-url="/carp/business/a/q/public/area/page"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control-edit="false"
      :show-control-del="false"
      :show-control="[0, 50].includes(this.$userType)"
      :filters="filters"
      :bind-buttons="[{ label: '审核', key: 'review', rule: { regExp: /3/, key: 'examineState' } }]"
      @bindButtonClick="
        publicArea = $event.row
        reviewShow = true
      "
    >
    </table-control>
    <el-dialog v-if="reviewShow" :visible="true" width="500px" @close="reviewShow = false">
      <div slot="title">
        <span>消纳站审核</span>
        <el-tag size="mini" type="success" v-cloak style="margin-left:4px"> {{ publicArea.name }} </el-tag>
      </div>
      <public-area-review
        :publicArea="publicArea"
        :examinePeopleName="form.label.examinePeopleName.default"
        :close="
          () => {
            reviewShow = false
            $refs.tableControl.getList()
          }
        "
      ></public-area-review>
    </el-dialog>
  </div>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
import publicAreaReview from './review'
export default {
  name: 'publicArea',
  data() {
    // 权限
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
      // 当前登录用户对象
      user,

      // 表格操作权限
      tablePermission,

      // 审核弹窗控制器
      reviewShow: false,

      // 公共区域数据对象
      publicArea: {},

      form: {
        formWidth: '500px',
        label: {
          // 背景图
          backgroundPhoto: {
            label: '背景图',
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

          // 公共区域名字
          name: {
            label: '区域名称',
            colType: 'edit',
            span: 24,
            required: true
          },

          // 行政地区码
          adminAreaCode: {
            show: false,
            colShow: false,
            default: user.accountTypeDto.code
          },

          // 地区码
          areaCode: {
            label: '所属地区',
            type: 'area',
            colShow: false,
            span: 24,
            props: {
              code: 'code'
            },
            required: true
          },

          // 项目定位
          location: {
            label: '定位',
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

          // 经纬度
          latitude: {
            show: false,
            colShow: false
          },
          longitude: {
            show: false,
            colShow: false
          },

          // 负责人
          linkman: {
            label: '负责人',
            span: 24
          },

          // 负责人身份证
          linkmanId: {
            label: '身份证',
            span: 24
          },

          // 负责人联系电话
          linkmanPhone: {
            label: '联系电话',
            span: 24
          },

          // 地址
          address: {
            label: '地址',
            span: 24
          },

          // 创建部门类型(1-政府,2-项目)
          type: {
            show: false,
            colShow: false,
            default: [0, 50].includes(this.$userType) ? 1 : 2
          },

          // 创建人id
          peopleId: {
            show: false,
            colShow: false,
            default: user.id
          },

          // 创建人姓名+部门
          peopleName: {
            label: '创建人',
            show: false
          },

          // 审核人
          examinePeopleId: {
            show: false,
            colShow: false,
            default: [0, 50].includes(this.$userType) ? user.id : null
          },

          // 审核人姓名
          examinePeopleName: {
            label: '审核人',
            show: false,
            default: [0, 50].includes(this.$userType) ? `${user.organizationDto && user.organizationDto.name}-${user.accountBaseDto.name}` : null
          },

          // 审核状态（1：合格 2：不合格）
          examineState: {
            label: '审核状态',
            show: false,
            colType: 'tag',
            item: [
              { label: '合格', code: 1, type: 'success' },
              { label: '不合格', code: 2, type: 'danger' },
              { label: '待审核', code: 3, type: 'warning' }
            ],
            default: [0, 50].includes(this.$userType) ? 1 : 3
          },

          // 审核备注
          examineMessage: {
            label: '审核备注',
            show: false,
            default: null
          }
        },
        customEdit(data, finish) {
          // 如果是项目账号则审核状态切换为待审核
          if ([30].includes(this.$userType)) data.examineState = 3
          this.$http.put('/carp/business/a/q/public/area', data).then(({ code, message }) => {
            if (code === 0) {
              this.$message.success('修改成功')
              finish()
            } else {
              finish(message)
            }
          })
        }
      },

      filters: {
        areaCode: {
          show: false,
          value: [50].includes(this.$userType) ? user.accountTypeDto.code : null
        },
        name: {
          label: '搜索区域名',
          type: 'search',
          value: null
        },
        peopleId: {
          show: false,
          value: [30].includes(this.$userType) ? user.id : null
        }
      }
    }
  },
  methods: {
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
    this.getCreatorInfo()
  },
  components: {
    tableControl,
    publicAreaReview
  }
}
</script>

<style></style>
