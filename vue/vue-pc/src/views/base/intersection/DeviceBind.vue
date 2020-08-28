<template>
  <table-control
    ref="table"
    :formConfig="form"
    :addUrl="addUrl"
    :searchUrl="searchUrl"
    :delUrl="delUrl"
    :editUrl="editUrl"
    :allowAdd="[0, 50].includes($userType)"
    :allowDelete="[0, 50].includes($userType)"
    :allowEdit="[0, 50].includes($userType)"
    :show-search="false"
    style="height:80vh"
  ></table-control>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
export default {
  data() {
    return {
      // 表单配置
      form: {
        // 显示
        show: false,
        // 操作格式
        type: 'add',
        // 表单数据
        data: {},
        // 表格标题
        label: {
          // 道路卡口id
          roadId: {
            show: false,
            colShow: false,
            default: this.info.id
          },
          // 设备名称
          deviceName: {
            label: '设备名称',
            width: 200,
            rule: {
              regExp: /^./g,
              message: '设备名称不能为空'
            }
          },
          // 序列号
          serialNumber: {
            label: '序列号',
            width: 300,
            rule: {
              regExp: /^./g,
              message: '请填写正确的序列号'
            }
          }
        }
      },
      addUrl: `/carp/business/a/q/road/device/increase`,
      editUrl: '/carp/business/a/q/road/device',
      delUrl: '/carp/business/a/q/road/device',
      searchUrl: `/carp/business/a/q/road/device/roadId?roadId=${this.info.id}`
    }
  },
  props: {
    info: Object
  },
  watch: {
    // 监听信息变动刷新表格
    info() {
      this.init()
    }
  },
  methods: {
    /* *
     * 初始化
     * * */
    init() {
      this.form.data.roadId = this.info.id
      // 初始化分页请求地址
      this.searchUrl = `/carp/business/a/q/road/device/roadId?roadId=${this.info.id}`
    }
  },
  components: {
    tableControl
  }
}
</script>

<style lang="less" scoped></style>
