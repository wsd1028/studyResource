<template>
  <div style="display:flex;flex-direction:column">
    <common-table-control
      :form-config="form"
      :allow-add="permissions[0]"
      :allow-delete="permissions[1]"
      :allow-edit="permissions[2]"
      :show-control-edit="false"
      :show-control-del="false"
      search-url="/carp/device/a/q/device/devicefile/list"
      add-url="/carp/device/a/q/device/devicefile"
      del-url="/carp/device/a/q/device/devicefile"
      add-description="新增文件"
      :bind-buttons="[
        { label: '下载', key: 'download' },
        { label: '下发到设备', key: 'distributes' }
      ]"
      @bindButtonClick="handleClick"
    ></common-table-control>
    <el-dialog title="选择设备" v-if="distributesShow" :visible="true" width="500px" @close="distributesShow = false">
      <distributes-by
        :fileInfo="fileInfo"
        :close="
          () => {
            distributesShow = false
          }
        "
      ></distributes-by>
    </el-dialog>
  </div>
</template>

<script>
import commonTableControl from '@/components/CommonTableControl'
import distributesBy from './DistributesBy'
export default {
  name: 'file',
  data() {
    // 获取权限
    const permissions = {
      add: false,
      del: false,
      edit: false
    }
    Object.keys(permissions).forEach(key => {
      this.$permission(`dust_system_file_${key}`).then(({ data }) => {
        permissions[key] = data
      })
    })

    return {
      // 权限 索引: 0-添加 1-删除 2-修改
      permissions,

      form: {
        labelPosition: 'top',
        formWidth: '444px',
        label: {
          id: {
            show: false,
            colShow: false,
            default: null
          },
          // 文件名
          name: {
            label: '文件名',
            colType: 'edit',
            show: false
          },
          // 文件上传
          fileId: {
            label: '文件上传',
            type: 'uploadFile',
            url: '/carp/file/a/q/file/upload/files/dto/web',
            limit: 1,
            span: 24,
            required: true,
            success(res) {
              this.data.name = res.name
            }
          },
          // 文件类型
          type: {
            label: '文件类型',
            type: 'select',
            span: 24,
            item: [],
            props: {
              label: 'name',
              code: 'code'
            },
            default: null,
            required: true
          },
          // 软件版本
          version: {
            label: '软件版本',
            span: 24,
            required: true
          },
          // 描述
          description: {
            label: '文件描述',
            type: 'textarea',
            rows: 5,
            span: 24,
            required: true
          }
        },

        // 自定义修改
        customEdit: (data, finish) => {
          this.$http.post('/carp/device/a/q/device/devicefile', data).then(({ code, message }) => {
            if (code === 0) {
              finish()
            } else {
              finish(message)
            }
          })
        }
      },

      fileInfo: {},

      distributesShow: false
    }
  },
  methods: {
    // 获取设备类型字典表
    getFileTypeDict() {
      this.$http.get('/carp/business/a/q/dict/category/deviceType').then(({ code, data }) => {
        if (code === 0) {
          this.form.label.type.item = data
          this.form.label.type.default = data[0].code
        } else {
          this.$message.error('获取设备类型字典表失败')
        }
      })
    },

    // 下载文件
    handleClick({ row, key }) {
      switch (key) {
        case 'download':
          location.href = `/carp/file/k/q/open/download/${row.fileId}`
          break

        case 'distributes':
          this.distributesShow = true
          this.fileInfo = row
          break

        default:
          break
      }
    }
  },
  created() {
    // 获取文件类型字典表
    this.getFileTypeDict()
  },
  components: {
    commonTableControl,
    distributesBy
  }
}
</script>

<style></style>
