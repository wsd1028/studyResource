<template>
  <table-control
    :form-config="form"
    :allow-edit="false"
    :add-url="`/carp/business/a/q/car/company/insert?createPerson=${user.id}`"
    :del-config="{ url: '/carp/business/a/q/car/company/remove', method: 'query', params: { personId: user.id } }"
    :search-url="`/carp/business/a/q/company/getPageByPlateNo?plateNo=${car.plateNumber}`"
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
          // 车辆id
          carId: {
            show: false,
            colShow: false,
            default: this.car.id
          },

          // 运输企业
          companyName: {
            label: '企业',
            show: true,
            type: 'company',
            companyType: '145',
            target: 'companyId',
            span: 24,
            default: null,
            required: true
          },
          companyId: {
            show: false,
            colShow: false,
            default: null
          }
        }
      }
    }
  },
  props: {
    car: Object
  },
  components: {
    tableControl
  }
}
</script>

<style></style>
