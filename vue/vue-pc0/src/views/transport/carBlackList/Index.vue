<template>
  <div class="container">
    <common-table-control
      :formConfig="form"
      add-url="/carp/business/a/q/car/black/list"
      del-url="/carp/business/a/q/car"
      edit-url="/carp/business/a/q/car"
      search-url="/carp/business/a/q/car/page?isBlackList=1"
      :allow-add="tablePermission.add"
      :allow-delete="tablePermission.del"
      :allow-edit="tablePermission.edit"
      :show-control="false"
      :filters="filters"
    ></common-table-control>
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
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
      // 表单配置
      form: {
        formWidth: '500px',
        formHeight: '200px',
        // 表格标题
        label: {
          // 车牌号
          plateNumber: {
            label: '车牌号',
            colType: 'edit',
            placeholder: '川A15678',
            rule: {
              regExp: /^[\u4e00-\u9fa5][A-Z][0-9A-Z]{5,6}[\u4e00-\u9fa5]?$/gi,
              message: '填写正确的车牌号'
            },
            span: 24,
            required: true
          },
          // 是否在黑名单
          isBlackList: {
            label: '黑名单',
            type: 'radio',
            colType: 'switch',
            show: [50].includes(this.$userType),
            url: '/carp/business/a/q/car',
            item: [
              { label: '加入白名单', code: false },
              { label: '加入黑名单', code: true }
            ],
            default: true
          },
          // 车辆图片
          carImage: {
            label: '车辆图片',
            type: 'uploadImg',
            colType: 'img',
            colShow: false,
            show: false,
            real: false,
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
          /* // 是否营运
          natureOfUse: {
            label: '是否营运',
            type: 'radio',
            default: true,
            colType: 'tag',
            item: [
              { label: '营运', code: true, type: 'success' },
              { label: '非营运', code: false, type: 'danger' }
            ],
            required: true
          }, */
          // 有效期
          startDate: {
            label: '有效期',
            show: false,
            real: false,
            data: (data, row) => {
              let startDate = row['startDate'] && this.$moment(row['startDate']).format('YYYY年MM月DD日')
              let endDate = row['effectiveDate'] && this.$moment(row['effectiveDate']).format('YYYY年MM月DD日')
              return (startDate && endDate && startDate + '-' + endDate) || null
            }
          },
          effectiveDate: {
            label: '有效期',
            type: 'date',
            show: false,
            real: false,
            required: true
          },
          // 车身颜色
          bodyColor: {
            label: '车身颜色',
            placeholder: '黑',
            show: false,
            real: false,
            colShow: false
          },
          // 品牌
          brand: {
            label: '品牌',
            placeholder: '丰田牌',
            show: false,
            real: false,
            colShow: false
          },
          // 车辆识别代号/车架号
          carFrameNumber: {
            label: '车辆识别代号',
            placeholder: '或车架号',
            colShow: false,
            show: false,
            real: false,
            width: 140
          },
          // 录入信息人员
          createPerson: {
            label: '录入信息人员',
            type: 'number',
            default: user.id,
            show: false,
            colShow: false
          },
          // 出厂日期
          dateOfManufacture: {
            label: '出厂日期',
            type: 'date',
            show: false,
            real: false,
            colShow: false
          },
          // 发动机型号
          engineType: {
            label: '发动机型号',
            placeholder: '3AR',
            show: false,
            real: false,
            colShow: false
          },
          /* // 燃料种类
          fuelType: {
            label: '燃料种类',
            placeholder: '汽油',
            colShow: false
          },
          // 载客数
          loadPersonNumber: {
            label: '载客数',
            type: 'number',
            unit: '人',
            placeholder: '5',
            colShow: false
          }, */
          // 载重
          loadWeightNumber: {
            label: '载重',
            type: 'number',
            unit: '公斤',
            placeholder: '2000',
            show: false,
            real: false,
            colShow: false
          },
          // 方量
          quantity: {
            label: '方量',
            type: 'number',
            unit: '立方米',
            show: false,
            real: false,
            placeholder: '8'
          },
          // 制造厂名称
          manufacturer: {
            label: '制造厂名称',
            placeholder: '广汽丰田汽车有限公司',
            show: false,
            real: false,
            colShow: false
          },
          /* // 排量(单位L)
          outputVolume: {
            label: '排量',
            unit: 'L',
            placeholder: '2672',
            colShow: false
          }, */
          // 车主身份证
          ownerIdCard: {
            label: '车主身份证',
            placeholder: '填写有效身份证件',
            show: false,
            real: false,
            colShow: false,
            width: 140,
            rule: {
              regExp: /^\d{17}(\d|x)$|^$|^null$|^undefined$/gi,
              message: '请输入有效的身份证号码'
            }
          },
          // 拥有人姓名
          ownerName: {
            label: '运输公司/业主',
            show: false,
            real: false,
            placeholder: 'xxx运输公司/王小虎'
          },
          // 拥有人电话号码
          ownerPhone: {
            label: '车主电话',
            show: false,
            real: false,
            placeholder: '输入国内有效电话或手机号码',
            width: 140,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            }
          },
          /* // 国产/进口
          propertyType: {
            label: '国产/进口',
            type: 'radio',
            colShow: false,
            item: [
              { label: '国产', code: '国产' },
              { label: '进口', code: '进口' }
            ],
            default: '进口'
          },
          // 轮胎数
          tyreNumber: {
            label: '轮胎数',
            type: 'number',
            colShow: false,
            placeholder: '4',
            unit: '个'
          },
          // 车辆型号
          vehicleModel: {
            label: '车辆型号',
            placeholder: 'GTM6812AD',
            colShow: false
          }, */
          // 车辆类型
          vehicleType: {
            label: '车辆类型',
            show: false,
            real: false,
            placeholder: '小型普通客车',
            type: 'select'
          },
          // 所属行政区域
          adminAreaId: {
            label: '行政区域',
            type: 'area',
            show: false,
            real: false,
            colShow: false
          },
          // 创建日期
          createDate: {
            label: '创建日期',
            show: false,
            data: data => this.$moment(data).format('YYYY年MM月DD日')
          }
        },
        // 表格列排序
        tableSort: ['plateNumber', 'startDate', 'loadWeightNumber', 'quantity', 'ownerName', 'ownerPhone', 'vehicleType', 'createDate', 'isBlackList']
      },
      // 筛选器
      filters: {
        // 排序类型
        type: {
          label: '根据类型排序',
          type: 'select',
          item: [
            { label: '企业业主', code: 1 },
            { label: '注册地区', code: 2 },
            { label: '是否安装GPS', code: 3 },
            { label: '创建时间', code: 4 }
          ],
          value: null
        },
        // 车牌号搜索框
        plateNumber: {
          label: '根据车牌号搜索',
          type: 'search',
          value: null
        },
        // 如果为政府账号则只查看当前管辖区域
        areaCode: {
          show: false,
          value: [30, 50].includes(this.$userType) ? { 30: user.accountTypeDto.code.substr(0, 4), 50: user.accountTypeDto.code }[this.$userType] : null
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
          this.form.label.vehicleType.item = data.map(item => ({ label: item.name, code: item.id }))
        } else {
          this.$message.error('请求车辆类型字典表失败')
        }
      })
    }
  },
  created() {
    this.getCarType()
  },
  components: {
    commonTableControl
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
