<template>
  <table-control
    :form-config="form"
    add-url="/carp/device/a/q/device/saleservice"
    del-url="/carp/device/a/q/device/saleservice"
    edit-url="/carp/device/a/q/device/saleservice"
    search-url=""
  ></table-control>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
export default {
  name: 'saleService',
  data() {
    return {
      // 分页接口
      searchUrl: null,
      form: {
        label: {}
      }
    }
  },
  props: {},
  created() {
    this.searchUrl = ``
  },
  components: {
    tableControl
  }
}
</script>

<style></style>
