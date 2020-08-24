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
      :show-control="false"
      :filters="filters"
    ></common-table-control>
  </div>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
export default {
  name: 'company',
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

    // 根据企业名称获取信息防抖方法
    const getCompanyInfo = data => {
      Object.keys(data).forEach(key => {
        if (![NaN, undefined, null].includes(data[key])) this.$set(this.form.data, key, data[key])
      })
    }

    return {
      // 表操作权限
      tablePermission,

      // 表单配置
      form: {
        labelWidth: '70px',
        // 表格标题
        label: {
          // 企业名称
          name: {
            label: '企业名称',
            colType: 'edit',
            type: 'company',
            width: 160,
            required: true,
            getCompanyInfo
          },
          // 企业类型
          typeId: {
            show: false,
            colShow: false,
            default: '320302652877340672'
          },
          // 所属地区id
          areaId: {
            label: '注册地区',
            type: 'area',
            colShow: false,
            areaTree: this.$customAreaTree,
            default: null,
            allowExport: false,
            required: true
          },
          // 注册时间
          registerDate: {
            label: '注册日期',
            type: 'date',
            required: true,
            colShow: false
          },
          // 社会统一信用代码
          code: {
            label: '社会统一信用代码',
            labelWidth: '126px',
            span: 16,
            required: true
          },
          // 企业法人
          legalPerson: {
            label: '企业法人',
            type: 'string',
            allowReset: true,
            colShow: false
          },
          // 法人电话
          legalPhone: {
            label: '法人电话',
            type: 'string',
            width: 160,
            allowReset: true,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            },
            colShow: false
          },
          // 企业联系电话
          phone: {
            label: '企业联系电话',
            labelWidth: '98px',
            type: 'string',
            width: 160,
            allowReset: true,
            rule: {
              regExp: /^1[3-9]\d(-?\d{4}){2}$|^(0\d{2}-?)?\d{8}$|^(0\d{3}-?)?\d{7}$|^$|^null$|^undefined$/,
              message: '请填写正确的手机号或座机号'
            }
          },
          // 公司曾用名
          companyNameOld: {
            label: '公司曾用名',
            labelWidth: '86px',
            colShow: false
          },
          // 公司英文名
          companyNameEn: {
            label: '公司英文名',
            labelWidth: '86px',
            colShow: false
          },
          // 组织机构代码
          companyCode: {
            label: '组织机构代码',
            labelWidth: '98px'
          },
          // 注册号
          regNumber: {
            label: '注册号',
            colShow: false
          },
          // 公司类型
          regType: {
            label: '公司类型'
          },
          // 登记机关
          regOrgName: {
            label: '登记机关',
            colShow: false
          },
          // 企业状态
          businessStatus: {
            label: '企业状态'
          },
          // 核准日期
          chkDate: {
            label: '核准日期',
            type: 'date',
            colShow: false
          },
          // 开始营业时间
          regDate: {
            label: '开始营业时间',
            labelWidth: '98px',
            type: 'date',
            colShow: false
          },
          // 截止营业时间
          bussiness: {
            label: '截止营业时间',
            labelWidth: '98px',
            type: 'date',
            colShow: false
          },
          // 注销日期
          cancelDate: {
            label: '注销日期',
            type: 'date',
            colShow: false
          },
          // 注册资金
          regMoney: {
            label: '注册资金',
            colShow: false
          },
          // 经营范围
          businessDes: {
            label: '经营范围',
            colShow: false
          },
          // 邮箱
          email: {
            label: '邮箱',
            colShow: false
          },
          // 网址
          weiSite: {
            label: '网址'
          },
          // 所属行业
          industry: {
            label: '所属行业',
            colShow: false
          },
          // 税务登记号
          taxNumber: {
            label: '税务登记号',
            labelWidth: '86px',
            colShow: false
          },
          // 企业地址
          address: {
            label: '企业地址',
            placeholder: '可使用定位获取',
            width: 160,
            colShow: false
          },
          // 企业经度
          longitude: {
            label: '企业经度',
            show: false,
            colShow: false,
            rule: {
              regExp: /^./,
              message: '不能为空'
            }
          },
          // 企业纬度
          latitude: {
            label: '企业纬度',
            show: false,
            colShow: false
          },
          // 定位
          location: {
            label: '定位',
            type: 'map',
            colShow: false,
            span: 24,
            real: false,
            // 定位相关配置
            target: {
              address: 'address',
              lng: 'longitude',
              lat: 'latitude'
            }
          }
        }
      },
      addUrl: '/carp/business/a/q/company',
      delUrl: '/carp/business/a/q/company',
      editUrl: '/carp/business/a/q/company',
      searchUrl: '/carp/business/a/q/company/page',
      // 筛选器
      filters: {
        // 企业类型
        typeId: {
          show: false,
          value: '320302652877340672'
        },
        // 企业名称
        name: {
          label: '根据企业名称搜索',
          type: 'search',
          value: ''
        }
      }
    }
  },
  components: {
    commonTableControl
  }
}
</script>
<style lang="less" scoped>
@import '~@/assets/less/common';
.container {
  display: flex;
  flex: auto;
  height: 0;
  @flex-column();
}
</style>
