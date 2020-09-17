<template>
  <common-table-control
    :form-config="form"
    add-url="/carp/business/a/q/business/mediaserver"
    del-url="/carp/business/a/q/business/mediaserver"
    edit-url="/carp/business/a/q/business/mediaserver"
    :search-url="searchUrl"
    :allow-add="tablePermission.add"
    :allow-delete="tablePermission.del"
    :allow-edit="tablePermission.edit"
    :show-control-del="false"
    :show-control-edit="false"
    :bind-buttons="[{ label: '更新数据', key: 'update' }]"
    @bindButtonClick="
      $http.put(`/carp/business/a/q/business/mediaserver/data/${$event.row.id}`).then(({ code }) => {
        if (code === 0) $message.success('请求成功')
      })
    "
  ></common-table-control>
</template>

<script>
import commonTableControl from '@/components/CommonTableControl'
export default {
  name: 'mediaserver',
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

      // 分页请求地址
      searchUrl: null,

      // 表格表单操作器
      form: {
        formWidth: '500px',
        formHeight: 'auto',
        label: {
          // 服务器名称
          name: {
            label: '服务器名称',
            colType: 'edit',
            span: 24
          },

          // 账号
          userName: {
            label: '账号',
            span: 24
          },

          // 密码/appKey
          password: {
            label: '密码',
            span: 24
          },

          // 厂商 0 未知，1 大华，2 海康
          manufacturer: {
            label: '厂商',
            type: 'select',
            props: {
              label: 'name',
              code: 'code'
            },
            item: (() => {
              this.$http.get('/carp/business/a/q/dict/category/manufacturer').then(({ code, data }) => {
                if (code === 0) {
                  this.form.label.manufacturer.item = data
                  this.searchUrl = '/carp/business/a/q/business/mediaserver/list'
                } else {
                  this.$message.error('请求厂商类型失败')
                }
              })
              return []
            })(),
            span: 24
          },

          // 平台标识
          plat: {
            label: '平台标识',
            type: 'number',
            rule: {
              regExp: /^\d*$|^$/,
              message: '只能是整数'
            },
            span: 24
          },

          // 流媒体标识
          sn: {
            label: '流媒体标识',
            span: 24
          },

          // 流媒体ip地址
          ip: {
            label: '流媒体ip地址',
            span: 24
          },

          // 端口
          port: {
            label: '端口',
            span: 24
          },

          // 直播流端口
          portLive: {
            label: '直播流端口',
            span: 24
          },

          // 创建日期
          createDate: {
            label: '创建日期',
            show: false,
            default: null
          },

          // 修改日期
          modifyDate: {
            label: '修改日期',
            show: false,
            default: null
          }
        }
      }
    }
  },
  components: {
    commonTableControl
  }
}
</script>

<style></style>
