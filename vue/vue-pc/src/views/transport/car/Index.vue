<template>
  <div class="container">
    <!-- 表操作器 -->
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
      :show-control="[0, 50].includes($userType)"
      :filters="filters"
      :bind-buttons="[0, 50].includes($userType) ? [{ label: '企业' }] : []"
      @bindButtonClick="
        car = $event.row
        bindCompanyShow = true
      "
      @formClosed="ownerTypeInit(1)"
    >
      <div v-if="[0, 50].includes($userType)" slot="control" style="display:inline-block;margin-left:10px">
        <el-button size="mini" type="warning" class="iconfont iconfont-excel" @click="importExcelShow = true">导入Excel</el-button>
      </div>
    </common-table-control>

    <!-- 导入excel弹窗 -->
    <el-dialog title="导入excel" v-if="importExcelShow" :visible="true" width="398px" @close="importExcelShow = false">
      <import-excel
        @closed="importExcelShow = false"
        :upload="`/carp/business/a/q/car/files/template/download?userId=${user.id}&userName=${user.accountBaseDto.name}`"
        download="/carp/business/k/q/template/download"
      ></import-excel>
    </el-dialog>

    <!-- 绑定企业弹窗 -->
    <el-dialog title="绑定企业" v-if="bindCompanyShow" :visible="true" top="10vh" width="600px" @close="bindCompanyShow = false">
      <company-bind :car="car"></company-bind>
    </el-dialog>
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
import importExcel from './ImportExcel'
import companyBind from './CompanyBind'
export default {
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
      // 表操作权限
      tablePermission,

      // 导入excel弹窗
      importExcelShow: false,

      // 企业绑定弹窗控制器
      bindCompanyShow: false,

      // 当前选择车辆对象
      car: {},

      // 表单配置
      form: {
        formWidth: '520px',
        // 打开修改弹窗事件监听
        onBeforeShowEdit: data => {
          this.ownerTypeInit(data.carManageState)
        },
        // 表格标题
        label: {
          // 车牌号
          plateNumber: {
            label: '车牌号',
            colType: 'edit',
            placeholder: '川Q123456',
            rule: {
              regExp: /^[\u4e00-\u9fa5][A-Z][0-9A-Z]{5,6}[\u4e00-\u9fa5]?$/gi,
              message: '填写正确的车牌号'
            },
            span: 24,
            required: true
          },
          // 行政备案区
          adminAreaId: {
            label: '行政备案区',
            type: 'area',
            span: 24,
            colShow: false,
            required: true
          },
          // 有效起始期
          startDate: {
            label: '有效期',
            type: 'date',
            span: 14,
            format: 'yyyy年MM月dd日',
            required: true,
            style: {
              padding: '0 10px 0 20px'
            }
          },
          // 有效截止期
          effectiveDate: {
            label: '至',
            labelWidth: '24px',
            colShow: false,
            type: 'date',
            format: 'yyyy年MM月dd日',
            span: 10,
            data: data => (data ? this.$moment(data).format('YYYY年MM月DD日') : null),
            rule: {
              regExp: /^.+$/,
              message: '不能为空'
            },
            style: {
              padding: '0 20px 0 0'
            }
          },
          // 车身颜色
          bodyColor: {
            label: '车身颜色',
            placeholder: '黑',
            span: 24,
            required: true,
            colShow: false
          },
          // 核定载重
          loadWeightNumber: {
            label: '核定载重',
            type: 'number',
            unit: 'kg',
            placeholder: '2000',
            span: 24,
            required: true,
            colShow: false
          },
          // 核定方量
          quantity: {
            label: '核定方量',
            type: 'number',
            unit: '方',
            span: 24,
            required: true,
            placeholder: '8'
          },
          // 品牌
          brand: {
            label: '品牌',
            placeholder: '丰田牌',
            span: 24,
            colShow: false
          },
          // 车架号
          carFrameNumber: {
            label: '车架号',
            colShow: false,
            span: 24,
            width: 140
          },
          // 出厂日期
          dateOfManufacture: {
            label: '出厂日期',
            type: 'date',
            span: 24,
            data: data => (data ? this.$moment(data).format('YYYY年MM月DD日') : null)
          },
          // 录入信息人员
          createPerson: {
            type: 'number',
            default: user.id,
            show: false,
            colShow: false
          },
          createPersonName: {
            label: '办理人',
            type: 'number',
            default: user.accountBaseDto.name,
            show: false
          },
          // 业户类型
          carManageState: {
            type: 'radio',
            colShow: false,
            item: [
              { label: '企业', code: 1 },
              { label: '个人', code: 2 }
            ],
            change: type => {
              this.ownerTypeInit(type)
            },
            default: 1
          },
          // 拥有人姓名
          ownerName: {
            label: '业主',
            span: 24,
            placeholder: '王小虎',
            required: true
          },
          // 拥有人电话号码
          ownerPhone: {
            label: '电话',
            placeholder: '输入国内有效电话或手机号码',
            width: 140,
            span: 24,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            },
            required: true
          },
          // 车主身份证
          ownerIdCard: {
            label: '身份证',
            placeholder: '填写有效身份证件',
            colShow: false,
            width: 140,
            span: 24,
            rule: {
              regExp: /^\d{17}(\d|x)$|^$|^null$|^undefined$/gi,
              message: '请输入有效的身份证号码'
            }
          },
          // 车辆类型
          vehicleType: {
            label: '车辆类型',
            placeholder: '小型普通客车',
            span: 24,
            type: 'select',
            required: true
          },
          // 是否在黑名单
          isBlackList: {
            label: '黑名单',
            show: false,
            type: 'radio',
            colType: [0, 50].includes(this.$userType) ? 'switch' : 'tag',
            url: '/carp/business/a/q/car',
            item: [
              { label: [0, 50].includes(this.$userType) ? '加入白名单' : '白名单', code: false, type: 'success' },
              { label: [0, 50].includes(this.$userType) ? '加入黑名单' : '黑名单', code: true, type: 'danger' }
            ],
            default: false
          },
          // 车辆图片
          carImage: {
            label: '车辆图片',
            type: 'uploadImg',
            colType: 'img',
            colShow: false,
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
          // 创建日期
          createDate: {
            label: '创建日期',
            show: false,
            data: data => (data ? this.$moment(data).format('YYYY年MM月DD日') : null)
          },
          // 是否安装GPS
          installGPS: {
            label: '是否安装GPS',
            type: 'radio',
            show: false,
            colType: 'tag',
            item: [
              { label: '已安装', code: true, type: 'success' },
              { label: '未安装', code: false, type: 'danger' }
            ],
            default: false,
            real: false,
            required: true
          },
          // 审核状态
          approvalState: {
            label: '审核状态',
            show: false,
            colType: [0, 50].includes(this.$userType) ? 'switch' : 'tag',
            url: '/carp/business/a/q/car',
            item: [
              { label: '已通过', code: 1, type: 'success' },
              { label: '待审核', code: 0, type: 'warning' },
              { label: '待审核', code: null, type: 'warning' }
            ],
            default: [0, 50].includes(this.$userType) ? 1 : 0
          }
        }
      },

      // 增删改api
      addUrl: '/carp/business/a/q/car',
      delUrl: '/carp/business/a/q/car',
      editUrl: '/carp/business/a/q/car',
      searchUrl: '/carp/business/a/q/car/page',

      // 筛选器
      filters: {
        // 车牌号搜索框
        plateNumber: {
          label: '根据车牌号搜索',
          name: '车牌号',
          type: 'search',
          value: '',
          showBt: false
        },
        // 企业业主
        ownerName: {
          label: '搜索企业名称或业主姓名',
          name: '企业/业主',
          type: 'search',
          value: '',
          showBt: false
        },
        // 排序类型
        type: {
          label: '根据类型排序',
          name: '排序',
          type: 'select',
          width: '160px',
          item: [
            { label: '企业业主', code: 1 },
            { label: '注册地区', code: 2 },
            { label: '是否安装GPS', code: 3 },
            { label: '创建时间', code: 4 },
            { label: '有效期排序', code: 5 }
          ],
          value: null,
          lineBreak: true
        },
        // 如果为政府账号则只查看当前管辖区域
        areaCode: {
          label: '选择地区',
          name: '注册区域',
          show: [0, 50].includes(this.$userType),
          type: 'area',
          area: [0].includes(this.$userType)
            ? null
            : (() => {
                let areaTree = []
                this.$getAreaTree(user.accountTypeDto.code, tree => (areaTree = [tree]))
                return areaTree
              })(),
          value: [30, 50].includes(this.$userType) ? { 30: user.accountTypeDto.code.substr(0, 4), 50: user.accountTypeDto.code }[this.$userType] : null
        },
        // 黑名单
        isBlackList: {
          name: '黑名单',
          type: 'select',
          width: '134px',
          item: [
            { label: '是', code: 1 },
            { label: '否', code: 0 }
          ],
          value: 0
        },
        // 车辆类型
        vehicleType: {
          name: '车辆类型',
          type: 'select',
          width: '184px',
          item: [],
          value: null,
          showSelectButton: true
        },
        // 如果登录账号为运输企业则通过企业id查询
        companyId: {
          show: false,
          value: [70].includes(this.$userType) ? user.accountTypeDto.ancillaryId : null
        },
        // 消纳站则只查看自己创建的名录车
        createPerson: {
          show: false,
          value: [60].includes(this.$userType) ? user.id : null
        }
      }
    }
  },
  methods: {
    // 获取车辆类型
    getCarType() {
      this.$http.get('/carp/business/a/q/dict/category/car_type').then(({ code, data }) => {
        if (code === 0) {
          let list = data.map(item => ({ label: item.name, code: item.id }))
          this.form.label.vehicleType.item = list
          this.filters.vehicleType.item = [{ label: '全部', code: null }].concat(list)
        } else {
          this.$message.error('请求车辆类型字典表失败')
        }
      })
    },

    // 表单配置项初始化
    ownerTypeInit(type) {
      ;['ownerName', 'ownerPhone'].forEach(feild => {
        this.form.data[feild] = null
      })
      this.form.label.ownerName.label = type == 1 ? '企业名' : '业主名'
      this.form.label.ownerName.placeholder = type == 1 ? '请输入企业名称' : '请出入业主名称'
    }
  },
  created() {
    this.getCarType()
  },
  components: {
    commonTableControl,
    importExcel,
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
