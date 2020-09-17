<template>
  <table-control
    :form-config="form"
    add-url="/carp/device/a/q/device/saleservice"
    del-url="/carp/device/a/q/device/saleservice"
    edit-url="/carp/device/a/q/device/saleservice"
    :search-url="`/carp/device/a/q/device/saleservice/list?agentId=${manufacturer.id}`"
    :show-control="false"
    class="sale-service-container"
  ></table-control>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
export default {
  name: 'saleService',
  data() {
    const user = this.$store.state.user.userInfo
    return {
      user,
      // 分页接口
      searchUrl: null,
      form: {
        formWidth: '500px',
        labelPosition: 'top',
        label: {
          // 售后服务点名称
          name: {
            label: '售后服务点名称',
            span: 24,
            colType: 'edit'
          },
          // 联系电话
          phone: {
            label: '联系电话',
            span: 24
          },
          // 地区码
          areaCode: {
            label: '地区码',
            type: 'select',
            props: {
              label: 'name',
              code: 'code'
            },
            item: (() => {
              this.$getAreaTree('5115', area => {
                this.$http
                  .get(`/carp/business/a/q/area/leading/level/page/3`, {
                    params: {
                      parentId: area.id
                    }
                  })
                  .then(({ code, data }) => {
                    if (code === 0) {
                      this.form.label.areaCode.item = data
                    } else {
                      this.$message.error('获取地区列表失败')
                    }
                  })
              })
              return []
            })(),
            span: 24,
            colShow: false
          },
          // 地址
          address: {
            label: '地址',
            span: 24
          },
          // 接入厂商id
          agentId: {
            show: false,
            colShow: false,
            default: this.manufacturer.id
          }
        }
      }
    }
  },
  props: {
    manufacturer: Object
  },
  created() {
    this.searchUrl = ``
  },
  components: {
    tableControl
  }
}
</script>

<style lang="less" scoped>
.sale-service-container {
  height: 70vh;
}
</style>
