<template>
  <div style="display:flex">
    <table-control
      ref="tableControl"
      :form-config="form"
      :filters="filters"
      :allow-add="false"
      :allow-delete="false"
      :allow-edit="false"
      :search-url="searchUrl"
      :bind-buttons="[{ label: '绑定固定源', key: 'bindProject' }]"
      @bindButtonClick="showBindClick"
    ></table-control>
    <el-dialog title="绑定项目" v-if="bindProjectShow" :visible="true" width="500px" @close="bindProjectShow = false">
      <bind-project
        :device="device"
        :close="
          () => {
            bindProjectShow = false
          }
        "
        :flush="
          () => {
            $refs.tableControl.getList(1)
          }
        "
      ></bind-project>
    </el-dialog>
  </div>
</template>

<script>
import tableControl from '@/components/CommonTableControl'
import bindProject from './BindProjcet'
export default {
  name: 'deviceList',
  data() {
    const user = this.$store.state.user.userInfo

    return {
      // 当前登录用户
      user,

      searchUrl: '',

      // 是否显示绑定项目弹窗
      bindProjectShow: false,

      // 当前点击设备
      device: {},

      form: {
        label: {
          sn: {
            label: '设备序列号'
          },
          fixedSourceName: {
            label: '项目名称',
            colLabel: '实际安装固定源'
          },
          predictFixedSourceName: {
            label: '预订安装固定源',
            show: false,
            real: false
          },
          fixedSourceType: {
            label: '固定源类型',
            show: false,
            type: 'select',
            props: {
              label: 'name',
              code: 'id'
            },
            item: (() => {
              this.$http.get('/carp/business/a/q/dict/category/fixed_source_type').then(({ code, data, message }) => {
                if (code === 0) {
                  this.form.label.fixedSourceType.item = data
                } else {
                  this.$message.error('未获取到固定源类型: ' + message)
                }
              })
              return []
            })(),
            data: (data, row) => data || row.predictFixedSourceName
          },
          linkman: {
            label: '联系人',
            show: false
          },
          phone: {
            label: '联系方式',
            show: false
          },
          status: {
            label: '是否启用',
            colType: 'switch',
            url: '/carp/device/a/q/dust/info',
            item: [
              { label: '启用', code: 1 },
              { label: '禁用', code: 0 }
            ]
          },
          online: {
            label: '是否在线',
            colType: 'tag',
            item: [
              { label: '在线', code: true, type: 'success' },
              { label: '离线', code: false, type: 'danger' }
            ]
          }
        }
      },

      filters: {
        status: {
          label: '是否禁用',
          type: 'select',
          item: [
            { label: '全部', code: null },
            { label: '启用', code: true },
            { label: '禁用', code: false }
          ],
          value: null
        },
        type: {
          label: '设备类型',
          type: 'select',
          item: [],
          props: {
            label: 'name'
          },
          value: null
        },
        sn: {
          label: '设备号',
          type: 'search',
          value: null
        }
      }
    }
  },
  methods: {
    showBindClick({ row, key }) {
      this.device = row
      switch (key) {
        case 'bindProject':
          this.bindProjectShow = true
          break
      }
    }
  },
  created() {
    // 获取设备类型
    this.$http.get('/carp/business/a/q/dict/category/deviceType').then(({ code, data }) => {
      if (code === 0) {
        this.filters.type.item = data
        this.filters.type.value = data[0].code
        // 添加表格分页请求接口
        this.searchUrl = `/carp/device/a/q/dust/info${[50].includes(this.$userType) ? `?areaCode=${this.user.accountTypeDto.code}` : ''}`
      } else {
        this.$message.error('获取文件类型字典表失败')
      }
    })
  },
  components: {
    tableControl,
    bindProject
  }
}
</script>

<style></style>
