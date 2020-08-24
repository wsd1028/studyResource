<template>
  <table-control
    :form-config="form"
    :allow-edit="false"
    :add-url="`/carp/business/a/q/car/company/insert?createPerson=${user.id}`"
    :del-config="{ url: '/carp/business/a/q/car/company/remove', method: 'query', params: { personId: user.id } }"
    :search-url="`/carp/business/a/q/car/company/company?companyId=${company.id}`"
    style="height:50vh"
  ></table-control>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
export default {
  name: 'carBindCompany',
  data() {
    const user = this.$store.state.user.userInfo
    return {
      user,
      form: {
        formWidth: '500px',
        formHeight: '60px',
        label: {
          plateNumber: {
            label: '车牌号',
            show: false,
            real: false
          },
          // 车辆id
          carId: {
            label: '车辆',
            colShow: false,
            type: 'search',
            url: '/carp/business/a/q/car/page',
            props: {
              search: 'plateNumber',
              label: 'plateNumber',
              code: 'id'
            },
            span: 24,
            required: true
          },
          // 企业id
          companyId: {
            show: false,
            colShow: false,
            default: this.company.id
          }
        }
      }
    }
  },
  props: {
    company: Object
  },
  components: {
    tableControl
  }
}
</script>

<style></style>
