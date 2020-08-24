<template>
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
    :allowExport="false"
    :paginationShow="false"
  ></common-table-control>
</template>
<script>
import commonTableControl from '@/components/CommonTableControl'
export default {
  name: 'address',
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
    return {
      // 表操作权限
      tablePermission,
      // 表单配置
      form: {
        labelPosition: 'top',
        formWidth: '500px',
        // 表格类型-树
        tableType: 'tree',
        tableTreeConfig: {
          lazyload: true,
          lazyUrl: '/carp/business/a/q/area/leading/page',
          lazyPropId: 'parentId',
          props: {
            children: 'nodes',
            type: 'level'
          },
          appendChild: {
            regExp: /^[^4]$/,
            key: 'level'
          }
        },
        labelWidth: '112px',
        // 表格标题
        label: {
          // 地区名称
          name: {
            label: '地区名称',
            colType: 'edit',
            allowReset: false,
            type: 'string',
            span: 24,
            rule: {
              regExp: /^([\u4e00-\u9fa5]|\w){2,30}$/,
              message: '2-30位的汉字英文或数字'
            }
          },
          // 完整地区名称
          fullName: {
            label: '完整地区名称',
            type: 'string',
            width: 160,
            span: 24,
            rule: {
              regExp: /^([\u4e00-\u9fa5]|\w){2,30}$/,
              message: '2-30位的汉字英文或数字'
            }
          },
          // 地区名称首字母简拼
          pinyin: {
            label: '地区首字母简拼',
            type: 'string',
            width: 160,
            span: 24,
            rule: {
              regExp: /^.{6,30}$/,
              message: '6-30位的拼音字母'
            }
          },
          // 详细地址
          address: {
            label: '详细地址',
            span: 24,
            type: 'string'
          },
          // 省市排序
          level: {
            label: '省市排序',
            type: 'select',
            item: [
              {
                code: 1,
                label: '省'
              },
              {
                code: 2,
                label: '市'
              },
              {
                code: 3,
                label: '区'
              },
              {
                code: 4,
                label: '镇'
              }
            ],
            default: 1,
            rule: {
              regExp: /^\w$/,
              message: '不能为空'
            }
          },
          // 地区码
          code: {
            label: '地区码',
            type: 'number',
            span: 24,
            rule: {
              regExp: /./g,
              message: '不能为空'
            }
          },
          // 上级地区ID
          parentId: {
            label: '上级地区',
            type: 'area',
            span: 24,
            default: null
          },
          // 创建时间
          createDate: {
            label: '创建时间',
            show: false,
            span: 24,
            colShow: false,
            real: false
          },
          // 修改时间
          modifyDate: {
            label: '修改时间',
            show: false,
            colShow: false,
            span: 24,
            real: false
          }
        }
      },
      addUrl: '/carp/business/a/q/area/leading/increase',
      delUrl: '/carp/business/a/q/area/leading',
      editUrl: '/carp/business/a/q/area/leading',
      searchUrl: '/carp/business/a/q/area/leading/level/page/1?parentId'
    }
  },
  components: {
    commonTableControl
  }
}
</script>
